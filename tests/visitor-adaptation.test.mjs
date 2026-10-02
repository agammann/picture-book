import {test} from 'node:test';
import assert from 'node:assert/strict';
import {visitorAdaptation, sourceSections} from '../server/visitor-adaptation.mjs';
import {storySections} from '../shared/story-sections.mjs';
import {startServer} from '../server/index.mjs';
import worker from '../server/worker.mjs';

const origin = 'https://picture-book.example';
const key = 'sk-test-only-placeholder-not-a-credential';
const fixture = () => ({model: 'gpt-5.4', source: {name: 'Test story', text: '  A child found a red stone.\n\nThe child put it beside a tree.\tA bird sat in the tree. The stone stayed there.  '}, options: {spreads: 4, audience: 'Plain language', language: 'English', mode: 'Simplify the language, keep the story'}});
const book = (spreads = 4) => ({title: 'The Stone', characters: [], pages: Array.from({length: spreads}, (_, i) => ({sourceSection: i + 1, title: `Part ${i + 1}`, text: 'A moment in the story.', scene: 'A red stone beside a tree.'}))});
const providerResponse = value => Response.json({status: 'completed', output: [{type: 'message', content: [{type: 'output_text', text: JSON.stringify(value)}]}]});
const request = (body = fixture(), options = {}) => new Request(origin + '/api/adapt/visitor', {method: 'POST', headers: {Origin: origin, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'}, body: JSON.stringify(body), ...options});
const noFetch = () => assert.fail('Rejected requests must not reach a provider');

test('source anchors retain every original character and match editor section order', () => {
  for (const source of [fixture().source.text, '  one\ntwo\tthree    four five six seven eight  ', '猫。 雨。 家。 朝。 ']) {
    const sections = sourceSections(source, 4);
    assert.equal(sections.map(s => s.text).join(''), source);
    assert.deepEqual(sections.map(s => s.id), [1, 2, 3, 4]);
    assert.deepEqual(sections.map(s => s.text.trim().replace(/\s+/g, ' ')), storySections(source, 4));
  }
});

test('one visitor-funded request uses fixed provider, full source, bounded structured output, and no storage', async () => {
  let calls = 0;
  const result = await visitorAdaptation(request(), {fetchImpl: async (url, options) => {
    calls++;
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal(options.headers.Authorization, `Bearer ${key}`);
    assert.equal(options.redirect, 'manual');
    assert.equal(options.method, 'POST');
    const body = JSON.parse(options.body), input = JSON.parse(body.input);
    assert.equal(body.model, 'gpt-5.4'); assert.equal(body.store, false);
    assert.deepEqual(body.reasoning, {effort: 'medium'}); assert.equal(body.max_output_tokens, 20000);
    assert.equal(input.source.sections.map(s => s.text).join(''), fixture().source.text);
    assert.equal(body.text.format.strict, true);
    assert.equal(body.text.format.schema.properties.pages.minItems, 4);
    assert.equal(body.text.format.schema.properties.pages.maxItems, 4);
    assert.equal(body.text.format.schema.additionalProperties, false);
    assert.equal(body.input.includes(key), false);
    return providerResponse(book());
  }});
  assert.equal(result.status, 200); assert.equal(calls, 1);
  assert.equal(result.headers.get('Cache-Control'), 'no-store');
  assert.equal(result.headers.get('Set-Cookie'), null);
  assert.deepEqual(await result.json(), book());
});

test('all supported lengths and a 600,000-character ASCII source stay complete', async () => {
  for (const spreads of [4, 6, 8, 12, 16, 24]) {
    const input = fixture(); input.options.spreads = spreads;
    input.source.text = 'A bird sat by a tree. '.repeat(30000).slice(0, 600000);
    const result = await visitorAdaptation(request(input), {fetchImpl: async (_url, options) => {
      const data = JSON.parse(JSON.parse(options.body).input);
      assert.equal(data.source.sections.map(s => s.text).join(''), input.source.text);
      assert.equal(data.source.sections.length, spreads);
      return providerResponse(book(spreads));
    }});
    assert.equal(result.status, 200);
  }
});

test('invalid authority, credentials, options and source bounds stop before provider access', async () => {
  const variants = [
    [request(undefined, {method: 'GET', body: undefined}), 405],
    [request(undefined, {headers: {'Content-Type': 'application/json', Authorization: `Bearer ${key}`}}), 403],
    [request(undefined, {headers: {Origin: 'https://other.example', Authorization: `Bearer ${key}`}}), 403],
    [request(undefined, {headers: {Origin: origin, 'Content-Type': 'application/json'}}), 401],
    [request(undefined, {headers: {Origin: origin, Authorization: `Bearer ${key}`, 'Content-Type': 'text/plain'}}), 400],
    [request(undefined, {body: '{invalid'}), 400],
  ];
  for (const mutate of [v => {v.model = 'other';}, v => {v.options.spreads = 5;}, v => {v.options.language = '';}, v => {v.options.audience = 'anything';}, v => {v.options.mode = 'anything';}, v => {v.source.name = '';}, v => {v.source.text = 'word'.repeat(11); v.options.spreads = 24;}, v => {v.options.style = 'extra';}, v => {v.source.text = 'x'.repeat(600001);}]) {
    const value = fixture(); mutate(value); variants.push([request(value), 400]);
  }
  const wide = fixture(); wide.source.text = '猫 '.repeat(250000); variants.push([request(wide), 413]);
  const escaped = fixture(); escaped.source.text = 'a\u0000 '.repeat(190000); variants.push([request(escaped), 413]);
  for (const [req, status] of variants) assert.equal((await visitorAdaptation(req, {fetchImpl: noFetch})).status, status);
});

test('stream and advertised request limits cancel unread input', async () => {
  for (const advertised of [true, false]) {
    let cancelled = false, pulls = 0;
    const stream = new ReadableStream({pull(controller) { pulls++; controller.enqueue(new Uint8Array(1000000)); }, cancel() {cancelled = true;}});
    const req = request(undefined, {body: stream, duplex: 'half', headers: {Origin: origin, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(advertised ? {'Content-Length': '2500001'} : {})}});
    const response = await visitorAdaptation(req, {fetchImpl: noFetch});
    assert.equal(response.status, 413); assert.equal(cancelled, true); assert.ok(pulls <= 4);
  }
});

test('provider failures are sanitized and never retried', async () => {
  for (const [upstream, status] of [[401, 401], [403, 403], [404, 403], [429, 429], [302, 502], [500, 502]]) {
    let calls = 0;
    const response = await visitorAdaptation(request(), {fetchImpl: async () => {calls++; return new Response('private-provider-detail ' + key, {status: upstream});}});
    assert.equal(response.status, status); assert.equal(calls, 1);
    const raw = await response.text(); assert.equal(raw.includes(key), false); assert.equal(raw.includes('private-provider-detail'), false);
  }
  const unavailable = await visitorAdaptation(request(), {fetchImpl: async () => {throw Error(key);}});
  assert.equal(unavailable.status, 502); assert.equal((await unavailable.text()).includes(key), false);
});

test('refusals, incomplete responses and invalid coverage cannot become books', async () => {
  const envelopes = [
    [{status: 'incomplete', output: []}, 502],
    [{status: 'completed', output: [{type: 'message', content: [{type: 'refusal', refusal: 'No'}]}]}, 422],
    [{status: 'completed', output: []}, 502],
  ];
  for (const [value, status] of envelopes) assert.equal((await visitorAdaptation(request(), {fetchImpl: async () => Response.json(value)})).status, status);
  for (const mutate of [
    value => value.pages.pop(), value => value.pages.reverse(), value => {value.pages[1].sourceSection = 1;},
    value => {value.pages[0].text = ' ';}, value => {value.pages[0].scene = 'x'.repeat(221);},
    value => {value.characters = [{name: 'A', description: 'Green coat'}, {name: 'a', description: 'Red coat'}];},
    value => {value.pages[0].sourceNote = 'invented';}, value => {value.extra = 'unexpected';},
  ]) {
    const value = book(); mutate(value);
    assert.equal((await visitorAdaptation(request(), {fetchImpl: async () => providerResponse(value)})).status, 502);
  }
});

test('decoded credential echoes are rejected in input and output', async () => {
  const input = fixture(); input.source.text += key;
  const encoded = JSON.stringify(input).replace(key, key.replace('sk-', '\\u0073k-'));
  assert.equal((await visitorAdaptation(request(undefined, {body: encoded}), {fetchImpl: noFetch})).status, 400);
  const value = book(); value.pages[0].text = key;
  const output = JSON.stringify(value).replace(key, key.replace('sk-', '\\u0073k-'));
  const result = await visitorAdaptation(request(), {fetchImpl: async () => Response.json({status: 'completed', output: [{type: 'message', content: [{type: 'output_text', text: output}]}]})});
  assert.equal(result.status, 502); assert.equal((await result.text()).includes(key), false);
});

test('cancellation covers a pending request body and a pending provider body', async () => {
  for (const phase of ['request', 'response']) {
    const controller = new AbortController(); let cancelled = false;
    const stream = new ReadableStream({cancel() {cancelled = true;}});
    const req = request(undefined, {signal: controller.signal, ...(phase === 'request' ? {body: stream, duplex: 'half'} : {})});
    const result = visitorAdaptation(req, {fetchImpl: phase === 'request' ? noFetch : async (_url, options) => {assert.equal(options.signal.aborted, false); return new Response(stream);}});
    setTimeout(() => controller.abort(), 5);
    assert.equal((await result).status, 499); assert.equal(cancelled, true);
  }
});

test('Node and worker adapters enforce the same route and cancel disconnected generation', async t => {
  let upstreamSignal, started;
  const ready = new Promise(resolve => {started = resolve;});
  const server = await startServer({port: 0, visitorFetch: async (_url, options) => {
    upstreamSignal = options.signal; started();
    return await new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason), {once: true}));
  }});
  t.after(() => new Promise(resolve => {server.closeAllConnections(); server.close(resolve);}));
  const local = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(local + '/api/adapt/visitor', {method: 'POST', headers: {Origin: local, 'Content-Type': 'application/json'}, body: '{}'})).status, 401);
  const controller = new AbortController();
  const pending = fetch(local + '/api/adapt/visitor', {method: 'POST', signal: controller.signal, headers: {Origin: local, 'Content-Type': 'application/json', Authorization: `Bearer ${key}`}, body: JSON.stringify(fixture())});
  await ready; controller.abort(); await assert.rejects(pending, /abort/i);
  for (let n = 0; !upstreamSignal.aborted && n < 20; n++) await new Promise(resolve => setTimeout(resolve, 5));
  assert.equal(upstreamSignal.aborted, true);
  t.mock.method(globalThis, 'fetch', async () => providerResponse(book()));
  assert.deepEqual(await (await worker.fetch(request(), {})).json(), book());
  assert.equal((await worker.fetch(request(undefined, {headers: {Origin: origin}}), {OPENAI_API_KEY: key})).status, 401);
});

test('Node adapter returns 413 for oversized bodies instead of mistaking its own reader cancellation for a disconnected visitor', async t => {
  const server = await startServer({port: 0, visitorFetch: noFetch});
  t.after(() => new Promise(resolve => {server.closeAllConnections(); server.close(resolve);}));
  const local = `http://127.0.0.1:${server.address().port}`;
  for (const streamed of [false, true]) {
    let sent = 0;
    const body = streamed ? new ReadableStream({pull(controller) {if (sent++ < 3) controller.enqueue(new Uint8Array(1000000)); else controller.close();}}) : 'x'.repeat(2600000);
    const response = await fetch(local + '/api/adapt/visitor', {method: 'POST', headers: {Origin: local, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'}, body, ...(streamed ? {duplex: 'half'} : {})});
    assert.equal(response.status, 413); assert.match((await response.json()).error, /too large/);
  }
});
