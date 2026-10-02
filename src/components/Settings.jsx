import React from 'react';
import {Modal,Field} from './Modal';
import BrowserModelPanel from './browser-model-panel';
export default function Settings({settings,onChange,onSave,onClose}){
 const hosted=settings.provider==='visitor';
 return <Modal title="Your workspace" onClose={onClose}>
  <p className="intro">Your books stay in this browser. Export a project to keep a portable backup.</p>
  <Field label="Story generation"><select value={settings.provider||'browser'} onChange={e=>onChange({provider:e.target.value,apiKey:''})}><option value="browser">On this device · browser model</option><option value="visitor">Hosted text · GPT-5.4 · your API key</option></select></Field>
  {hosted?<section aria-label="Hosted text generation">
   <p className="note">GPT-5.4 uses your OpenAI API account and can incur charges. Your source text and adaptation settings pass through this app’s server to OpenAI. Illustrations continue to use the device model or your uploaded art.</p>
   <Field label="OpenAI API key"><input type="password" autoComplete="off" autoCapitalize="none" spellCheck={false} value={settings.apiKey||''} onChange={e=>onChange({...settings,apiKey:e.target.value})} placeholder="Paste your API key"/></Field>
   <button className="secondary" disabled={!settings.apiKey} onClick={()=>onChange({...settings,apiKey:''})}>Clear key</button>
   <p className="note">The key stays in memory for this tab and is sent only with hosted text requests. It is excluded from saved books and exports. Clearing it, stopping a task, switching to device mode, or leaving this page removes it. Review the adaptation for omissions, invented details and scene consistency.</p>
  </section>:<><BrowserModelPanel/><p className="note">Device drafts can miss causes, invent details or misidentify objects as characters. Review the story and character list before illustrating. A model that runs successfully does not guarantee a faithful adaptation.</p></>}
  <h3>Browser illustrations</h3><p className="note">SD-Turbo draws 512 × 512 draft illustrations on your device. Its first download is about 2.4 GB and needs more graphics memory than the text model. Drawing unloads the text model to free memory. You can upload your own artwork on any device.</p>
  <p className="note">Character descriptions guide illustrations. This browser model does not condition new artwork on your reference image, and short image prompts can lose detail. Review every illustration. Image model use is governed by its <a href="https://huggingface.co/schmuell/sd-turbo-ort-web/blob/main/LICENSE" target="_blank" rel="noreferrer">noncommercial model license</a>.</p>
  <p className="note">Device models download assets from public hosts and process prompts locally. Cached models and your library may be removed if browser storage is cleared.</p>
  <div className="modal-actions"><button className="primary" onClick={()=>onSave(settings)}>Done</button></div>
 </Modal>;
}
