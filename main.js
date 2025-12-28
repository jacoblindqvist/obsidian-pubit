"use strict";var U=Object.defineProperty;var tt=Object.getOwnPropertyDescriptor;var et=Object.getOwnPropertyNames;var st=Object.prototype.hasOwnProperty;var it=(n,t)=>{for(var e in t)U(n,e,{get:t[e],enumerable:!0})},nt=(n,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of et(t))!st.call(n,i)&&i!==e&&U(n,i,{get:()=>t[i],enumerable:!(s=tt(t,i))||s.enumerable});return n};var ot=n=>nt(U({},"__esModule",{value:!0}),n);var ct={};it(ct,{default:()=>R});module.exports=ot(ct);var v=require("obsidian");var w=class{baseUrl;token;constructor(t,e){this.baseUrl=t,this.token=e||null}setToken(t){this.token=t}async request(t,e,s,i=!1){let a={};this.token&&(a.Authorization=`Bearer ${this.token}`),s&&!i&&(a["Content-Type"]="application/json");let o=0,p=3;for(;o<p;)try{let r=await fetch(`${this.baseUrl}${e}`,{method:t,headers:a,body:i?s:s?JSON.stringify(s):void 0});if(!r.ok){let c=await r.json().catch(()=>({message:"Request failed"}));throw r.status>=400&&r.status<500?new E(c.code||"ERROR",c.message,r.status):new E(c.code||"SERVER_ERROR",c.message||"Server error",r.status)}return r.json()}catch(r){if(r instanceof E&&r.status>=400&&r.status<500||(o++,o>=p))throw r;await new Promise(c=>setTimeout(c,2**o*1e3))}throw new Error("Max retries exceeded")}async getDeviceCode(){return this.request("POST","/auth/device-code")}async pollDeviceCode(t){return this.request("GET",`/auth/poll/${t}`)}async revokeToken(){return this.request("POST","/auth/revoke")}async getSites(){return this.request("GET","/sites")}async createSite(t){return this.request("POST","/sites",{subdomain:t})}async getSite(t){return this.request("GET",`/sites/${t}`)}async getNotes(t){return this.request("GET",`/sites/${t}/notes`)}async syncNotes(t,e){return this.request("POST",`/sites/${t}/sync`,e)}async uploadImage(t,e,s){let i=new FormData,a=new Blob([e],{type:this.getMimeType(s)});return i.append("image",a,s),this.request("POST",`/sites/${t}/images`,i,!0)}async publish(t){return this.request("POST",`/sites/${t}/publish`)}getMimeType(t){let e=t.split(".").pop()?.toLowerCase();return{png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",webp:"image/webp",svg:"image/svg+xml"}[e||""]||"application/octet-stream"}},E=class extends Error{code;status;constructor(t,e,s){super(e),this.code=t,this.status=s,this.name="ApiError"}};var H=require("obsidian"),S=class extends H.Modal{code;verificationUrl;api;pollInterval=null;onSuccess;onCancel;constructor(t,e,s,i,a,o){super(t),this.code=e,this.verificationUrl=s,this.api=i,this.onSuccess=a,this.onCancel=o}onOpen(){let{contentEl:t}=this;t.empty(),t.addClass("publish-device-code-modal"),t.createEl("h2",{text:"Connect Your Vault"}),t.createDiv({cls:"publish-instructions"}).createEl("p",{text:"Enter this code in your browser to connect:"}),t.createDiv({cls:"publish-code-display"}).createEl("span",{text:this.code,cls:"publish-code"});let i=t.createDiv({cls:"publish-button-container"}),a=i.createEl("button",{text:"Copy Code",cls:"mod-cta"});a.addEventListener("click",()=>{navigator.clipboard.writeText(this.code),a.textContent="Copied!",setTimeout(()=>{a.textContent="Copy Code"},2e3)}),i.createEl("button",{text:"Open in Browser"}).addEventListener("click",()=>{window.open(this.verificationUrl,"_blank")});let p=t.createDiv({cls:"publish-status"});p.createEl("p",{text:"Waiting for authorization..."}),t.createEl("button",{text:"Cancel",cls:"publish-cancel-button"}).addEventListener("click",()=>{this.close(),this.onCancel()}),this.startPolling(p),this.addStyles()}startPolling(t){this.pollInterval=setInterval(async()=>{try{let e=await this.api.pollDeviceCode(this.code);e.status==="completed"&&e.token?(this.stopPolling(),t.empty(),t.createEl("p",{text:"Connected successfully!",cls:"publish-status-success"}),setTimeout(()=>{this.close(),this.onSuccess({token:e.token,email:e.email||"",siteId:e.siteId,subdomain:e.subdomain})},1e3)):e.status==="expired"&&(this.stopPolling(),t.empty(),t.createEl("p",{text:"Code expired. Please try again.",cls:"publish-status-error"}))}catch(e){console.error("Polling error:",e)}},2e3)}stopPolling(){this.pollInterval&&(clearInterval(this.pollInterval),this.pollInterval=null)}onClose(){this.stopPolling();let{contentEl:t}=this;t.empty()}addStyles(){let t=document.createElement("style");t.textContent=`
			.publish-device-code-modal {
				padding: 20px;
				text-align: center;
			}
			.publish-device-code-modal h2 {
				margin-bottom: 16px;
			}
			.publish-instructions {
				margin-bottom: 20px;
				color: var(--text-muted);
			}
			.publish-code-display {
				background: var(--background-secondary);
				border-radius: 8px;
				padding: 20px;
				margin-bottom: 20px;
			}
			.publish-code {
				font-family: var(--font-monospace);
				font-size: 2em;
				font-weight: bold;
				letter-spacing: 0.2em;
			}
			.publish-button-container {
				display: flex;
				gap: 10px;
				justify-content: center;
				margin-bottom: 20px;
			}
			.publish-button-container button {
				padding: 8px 16px;
			}
			.publish-status {
				margin-bottom: 16px;
				color: var(--text-muted);
			}
			.publish-status-success {
				color: var(--text-success);
			}
			.publish-status-error {
				color: var(--text-error);
			}
			.publish-cancel-button {
				color: var(--text-muted);
			}
		`,this.contentEl.appendChild(t)}};function $(n){if(!n||typeof n!="string")return"";let t=n.toLowerCase().trim(),e={\u00E4:"ae",\u00F6:"oe",\u00FC:"ue",\u00DF:"ss",\u00E0:"a",\u00E1:"a",\u00E2:"a",\u00E3:"a",\u00E5:"a",\u00E6:"ae",\u00E7:"c",\u00E8:"e",\u00E9:"e",\u00EA:"e",\u00EB:"e",\u00EC:"i",\u00ED:"i",\u00EE:"i",\u00EF:"i",\u00F1:"n",\u00F2:"o",\u00F3:"o",\u00F4:"o",\u00F5:"o",\u00F8:"o",\u00F9:"u",\u00FA:"u",\u00FB:"u",\u00FD:"y",\u00FF:"y",\u00F0:"d",\u00FE:"th"};for(let[s,i]of Object.entries(e))t=t.replace(new RegExp(s,"g"),i);return t=t.replace(/[\s_]+/g,"-"),t=t.replace(/[^a-z0-9-]/g,""),t=t.replace(/-+/g,"-"),t=t.replace(/^-+|-+$/g,""),t||"untitled"}async function B(n){let e=new TextEncoder().encode(n),s=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(s)).map(o=>o.toString(16).padStart(2,"0")).join("")}var z=new Set(["www","api","app","admin","dashboard","help","support","blog","docs","status","mail","smtp","pop","imap","ftp","cdn","assets","static","img","images","js","css","auth","login","register","signup","signin","account","billing","payment","dev","staging","test","demo","portal"]),at=/^[a-z][a-z0-9-]{1,28}[a-z0-9]$/;function O(n){return!(!n||typeof n!="string"||!at.test(n)||n.includes("--"))}function L(n){return z.has(n.toLowerCase())}var G=require("obsidian"),P=class extends G.Modal{api;serviceDomain;onSuccess;onCancel;constructor(t,e,s,i,a){super(t),this.api=e,this.serviceDomain=s,this.onSuccess=i,this.onCancel=a}onOpen(){let{contentEl:t}=this;t.empty(),t.addClass("publish-subdomain-modal"),t.createEl("h2",{text:"Choose Your Site URL"}),t.createDiv({cls:"publish-instructions"}).createEl("p",{text:"Pick a unique subdomain for your published notes:"});let s=t.createDiv({cls:"publish-subdomain-input"}),i=s.createEl("input",{type:"text",placeholder:"my-notes",cls:"publish-subdomain-field"});s.createEl("span",{text:`.${this.serviceDomain}`,cls:"publish-domain-suffix"});let a=t.createDiv({cls:"publish-url-preview"});a.createEl("span",{text:"Your site will be at: "});let o=a.createEl("span",{cls:"publish-preview-url",text:`https://your-subdomain.${this.serviceDomain}`}),p=t.createDiv({cls:"publish-feedback"}),r=t.createDiv({cls:"publish-button-container"}),c=r.createEl("button",{text:"Create Site",cls:"mod-cta"});c.disabled=!0;let d=r.createEl("button",{text:"Cancel"});i.addEventListener("input",()=>{let u=i.value.toLowerCase().trim();if(o.textContent=u?`https://${u}.${this.serviceDomain}`:`https://your-subdomain.${this.serviceDomain}`,p.empty(),c.disabled=!0,!!u){if(!O(u)){p.createEl("p",{text:"Must be 3-30 characters, start with a letter, and contain only lowercase letters, numbers, and hyphens.",cls:"publish-feedback-error"});return}if(L(u)){p.createEl("p",{text:"This subdomain is reserved.",cls:"publish-feedback-error"});return}p.createEl("p",{text:"Looks good!",cls:"publish-feedback-success"}),c.disabled=!1}}),c.addEventListener("click",async()=>{let u=i.value.toLowerCase().trim();c.disabled=!0,c.textContent="Creating...",p.empty();try{let h=await this.api.createSite(u);this.close(),this.onSuccess(h.id,h.subdomain)}catch(h){c.disabled=!1,c.textContent="Create Site",p.empty(),p.createEl("p",{text:h instanceof Error?h.message:"Failed to create site",cls:"publish-feedback-error"})}}),d.addEventListener("click",()=>{this.close(),this.onCancel()}),this.addStyles(),i.focus()}onClose(){let{contentEl:t}=this;t.empty()}addStyles(){let t=document.createElement("style");t.textContent=`
			.publish-subdomain-modal {
				padding: 20px;
			}
			.publish-subdomain-modal h2 {
				margin-bottom: 16px;
				text-align: center;
			}
			.publish-instructions {
				margin-bottom: 20px;
				color: var(--text-muted);
				text-align: center;
			}
			.publish-subdomain-input {
				display: flex;
				align-items: center;
				background: var(--background-secondary);
				border-radius: 8px;
				padding: 8px 12px;
				margin-bottom: 12px;
			}
			.publish-subdomain-field {
				flex: 1;
				border: none;
				background: transparent;
				font-size: 1.1em;
				padding: 8px;
				outline: none;
			}
			.publish-domain-suffix {
				color: var(--text-muted);
				font-size: 1.1em;
			}
			.publish-url-preview {
				text-align: center;
				margin-bottom: 12px;
				font-size: 0.9em;
				color: var(--text-muted);
			}
			.publish-preview-url {
				color: var(--text-accent);
			}
			.publish-feedback {
				min-height: 24px;
				margin-bottom: 16px;
				text-align: center;
			}
			.publish-feedback-error {
				color: var(--text-error);
				margin: 0;
			}
			.publish-feedback-success {
				color: var(--text-success);
				margin: 0;
			}
			.publish-button-container {
				display: flex;
				gap: 10px;
				justify-content: center;
			}
			.publish-button-container button {
				padding: 8px 20px;
			}
		`,this.contentEl.appendChild(t)}};var W=require("obsidian"),I=class extends W.Modal{statusEl=null;progressEl=null;detailsEl=null;closeButton=null;cancelled=!1;onOpen(){let{contentEl:t}=this;t.empty(),t.addClass("publish-sync-modal"),t.createEl("h2",{text:"Publishing Notes"}),this.progressEl=t.createDiv({cls:"publish-progress"}),this.progressEl.createDiv({cls:"publish-progress-bar"}),this.statusEl=t.createDiv({cls:"publish-sync-status"}),this.statusEl.createEl("p",{text:"Starting..."}),this.detailsEl=t.createDiv({cls:"publish-sync-details"});let e=t.createDiv({cls:"publish-button-container"});this.closeButton=e.createEl("button",{text:"Cancel"}),this.closeButton.addEventListener("click",()=>{this.cancelled=!0,this.close()}),this.addStyles()}setStatus(t){this.statusEl&&(this.statusEl.empty(),this.statusEl.createEl("p",{text:t}))}setProgress(t){if(this.progressEl){let e=this.progressEl.querySelector(".publish-progress-bar");e&&(e.style.width=`${t}%`)}}showSuccess(t,e){!this.statusEl||!this.detailsEl||(this.statusEl.empty(),this.statusEl.addClass("publish-status-success"),this.statusEl.createEl("p",{text:"Published successfully!"}),this.detailsEl.empty(),this.detailsEl.createEl("p",{text:`Created: ${e.created} | Updated: ${e.updated} | Deleted: ${e.deleted}`}),t&&this.detailsEl.createEl("a",{text:t,href:t,cls:"publish-site-link"}).addEventListener("click",i=>{i.preventDefault(),window.open(t,"_blank")}),this.closeButton&&(this.closeButton.textContent="Close"),this.setProgress(100))}showError(t){this.statusEl&&(this.statusEl.empty(),this.statusEl.addClass("publish-status-error"),this.statusEl.createEl("p",{text:"Publish failed"}),this.statusEl.createEl("p",{text:t,cls:"publish-error-message"}),this.closeButton&&(this.closeButton.textContent="Close"))}isCancelled(){return this.cancelled}onClose(){let{contentEl:t}=this;t.empty()}addStyles(){let t=document.createElement("style");t.textContent=`
			.publish-sync-modal {
				padding: 20px;
				min-width: 300px;
			}
			.publish-sync-modal h2 {
				margin-bottom: 20px;
				text-align: center;
			}
			.publish-progress {
				height: 8px;
				background: var(--background-secondary);
				border-radius: 4px;
				overflow: hidden;
				margin-bottom: 20px;
			}
			.publish-progress-bar {
				height: 100%;
				width: 0%;
				background: var(--interactive-accent);
				transition: width 0.3s ease;
			}
			.publish-sync-status {
				text-align: center;
				margin-bottom: 16px;
			}
			.publish-sync-status p {
				margin: 4px 0;
			}
			.publish-status-success {
				color: var(--text-success);
			}
			.publish-status-error {
				color: var(--text-error);
			}
			.publish-error-message {
				font-size: 0.9em;
				color: var(--text-muted);
			}
			.publish-sync-details {
				text-align: center;
				font-size: 0.9em;
				color: var(--text-muted);
				margin-bottom: 16px;
			}
			.publish-site-link {
				display: block;
				margin-top: 8px;
				color: var(--text-accent);
			}
			.publish-button-container {
				display: flex;
				justify-content: center;
			}
			.publish-button-container button {
				padding: 8px 20px;
			}
		`,this.contentEl.appendChild(t)}};function rt(n){if(n.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").includes("#publish"))return!0;if(n.startsWith("---")){let e=n.indexOf(`
---`,3);if(e!==-1){let s=n.slice(4,e);if(/^publish:\s*["']?true["']?\s*$/im.test(s))return!0}}return!1}async function C(n){let t=n.vault.getMarkdownFiles(),e=[];for(let s of t){let i=await n.vault.cachedRead(s);rt(i)&&e.push(s)}return e}function Y(n){return n.basename}function K(n){return n.path.replace(/\.md$/,"").split("/").map(i=>$(i)).join("/")}function X(n){let t=/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g,e=[],s;for(;(s=t.exec(n))!==null;){let i=s[1].trim();/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(i)&&e.push(i)}return[...new Set(e)]}function Z(n,t){let e=n.vault.getFiles();for(let s of e)if(s.name===t||s.path.endsWith(`/${t}`))return s;if(!/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(t))for(let s of["png","jpg","jpeg","gif","webp","svg"]){let i=`${t}.${s}`;for(let a of e)if(a.name===i)return a}return null}var M="http://localhost:8787",_="http://localhost:5173",J="https://api.pubit.site",Q="https://auth.pubit.site";var F={uploadedImages:{},devMode:!0,apiUrl:M,portalUrl:_,autoPublish:!1};var m=require("obsidian");var T=class extends m.PluginSettingTab{plugin;constructor(t,e){super(t,e),this.plugin=e}display(){let{containerEl:t}=this;t.empty(),t.createEl("h2",{text:"Publish Settings"});let e=!!this.plugin.settings.apiToken;if(new m.Setting(t).setName("Connection Status").setDesc(e?`Connected as ${this.plugin.settings.userEmail||"Unknown"}`:"Not connected").addButton(s=>{e?s.setButtonText("Disconnect").setWarning().onClick(async()=>{await this.plugin.disconnect(),this.display()}):s.setButtonText("Connect").setCta().onClick(async()=>{await this.plugin.startDeviceCodeFlow(),setTimeout(()=>this.display(),1e3)})}),e&&this.plugin.settings.subdomain){let s=this.plugin.settings.subdomain,i=this.plugin.settings.devMode?"localhost:8787/preview":"pubit.site",a=this.plugin.settings.devMode?`http://${i}/${s}`:`https://${s}.${i}`;new m.Setting(t).setName("Your Site").setDesc(`${a}`).addButton(o=>o.setButtonText("Open Site").onClick(()=>{window.open(a,"_blank")})).addButton(o=>o.setButtonText("Change Subdomain").onClick(async()=>{await this.plugin.changeSubdomain(),this.display()}))}e&&(t.createEl("h3",{text:"Options"}),new m.Setting(t).setName("Auto-publish").setDesc("Automatically publish changes every 5 minutes when there are pending changes.").addToggle(s=>s.setValue(this.plugin.settings.autoPublish).onChange(async i=>{this.plugin.settings.autoPublish=i,await this.plugin.saveSettings(),this.plugin.setupAutoPublish()}))),t.createEl("h3",{text:"Advanced"}),new m.Setting(t).setName("Development Mode").setDesc("Use localhost URLs for local development. Disable for production.").addToggle(s=>s.setValue(this.plugin.settings.devMode).onChange(async i=>{this.plugin.settings.devMode=i,i?(this.plugin.settings.apiUrl=M,this.plugin.settings.portalUrl=_):(this.plugin.settings.apiUrl=J,this.plugin.settings.portalUrl=Q),await this.plugin.saveSettings(),this.display()})),new m.Setting(t).setName("API URL").setDesc("The URL of the publishing API").addText(s=>s.setPlaceholder("https://api.pubit.site").setValue(this.plugin.settings.apiUrl).onChange(async i=>{this.plugin.settings.apiUrl=i,await this.plugin.saveSettings()})),new m.Setting(t).setName("Portal URL").setDesc("The URL of the auth portal").addText(s=>s.setPlaceholder("https://auth.pubit.site").setValue(this.plugin.settings.portalUrl).onChange(async i=>{this.plugin.settings.portalUrl=i,await this.plugin.saveSettings()})),Object.keys(this.plugin.settings.uploadedImages).length>0&&new m.Setting(t).setName("Clear Image Cache").setDesc(`${Object.keys(this.plugin.settings.uploadedImages).length} images cached. Clear to re-upload all images.`).addButton(s=>s.setButtonText("Clear Cache").setWarning().onClick(async()=>{this.plugin.settings.uploadedImages={},await this.plugin.saveSettings(),this.display()}))}};async function V(n,t){let e={create:[],update:[],delete:[]},s=await C(n),i=new Map;for(let o of t)i.set(o.slug,o);let a=new Set;for(let o of s){let p=Y(o),r=K(o),c=await n.vault.cachedRead(o),d=await B(c);a.add(r);let u=i.get(r);u?u.contentHash!==d&&e.update.push({file:o,slug:r,title:p,content:c}):e.create.push({file:o,slug:r,title:p,content:c})}for(let o of t)a.has(o.slug)||e.delete.push({slug:o.slug});return e}async function lt(n,t,e,s,i,a){let o=new Map(Object.entries(i.uploadedImages)),p=[];for(let c of s){let d=await n.vault.cachedRead(c),u=X(d);for(let h of u){if(o.has(h))continue;let f=Z(n,h);f&&p.push({filename:h,file:f})}}let r=[...new Map(p.map(c=>[c.filename,c])).values()];for(let c=0;c<r.length;c++){let{filename:d,file:u}=r[c];a?.(`Uploading image ${c+1}/${r.length}: ${d}`);try{let h=await n.vault.readBinary(u),f=await t.uploadImage(e,h,d);o.set(d,f.url)}catch(h){console.error(`Failed to upload image ${d}:`,h)}}return o}async function j(n,t,e,s,i){let a=[];try{i?.("Fetching remote notes...");let o=await t.getNotes(e);i?.("Computing changes...");let p=await C(n),r=await V(n,o);if(r.create.length+r.update.length+r.delete.length===0){i?.("No changes to sync"),i?.("Publishing...");let l=await t.publish(e);return{success:!0,created:0,updated:0,deleted:0,errors:[],siteUrl:l.url}}i?.("Uploading images...");let d=await lt(n,t,e,p,s,i);s.uploadedImages=Object.fromEntries(d);let u=50,h=0,f=0,q=0,A=r.create.map(l=>({slug:l.slug,title:l.title,content:l.content})),D=r.update.map(l=>({slug:l.slug,title:l.title,content:l.content})),k=r.delete.map(l=>({slug:l.slug}));for(let l=0;l<A.length;l+=u){let y=A.slice(l,l+u);i?.(`Creating notes ${l+1}-${Math.min(l+u,A.length)}...`);let x={create:y,update:[],delete:[]},b=await t.syncNotes(e,x);h+=b.created.length;for(let g of b.errors)a.push(`Create error: ${g.title||g.slug} - ${g.message}`)}for(let l=0;l<D.length;l+=u){let y=D.slice(l,l+u);i?.(`Updating notes ${l+1}-${Math.min(l+u,D.length)}...`);let x={create:[],update:y,delete:[]},b=await t.syncNotes(e,x);f+=b.updated.length;for(let g of b.errors)a.push(`Update error: ${g.title||g.slug} - ${g.message}`)}for(let l=0;l<k.length;l+=u){let y=k.slice(l,l+u);i?.(`Deleting notes ${l+1}-${Math.min(l+u,k.length)}...`);let x={create:[],update:[],delete:y},b=await t.syncNotes(e,x);q+=b.deleted.length;for(let g of b.errors)a.push(`Delete error: ${g.slug} - ${g.message}`)}i?.("Publishing...");let N=await t.publish(e);return N.status==="error"&&a.push(`Publish error: ${N.error?.message||"Unknown error"}`),{success:a.length===0,created:h,updated:f,deleted:q,errors:a,siteUrl:N.url}}catch(o){return{success:!1,created:0,updated:0,deleted:0,errors:[o instanceof Error?o.message:"Unknown error"]}}}var R=class extends v.Plugin{settings=F;api=null;statusBarItem=null;settingsTab=null;ribbonIcon=null;pendingChanges=0;autoPublishInterval=null;async onload(){await this.loadSettings(),this.api=new w(this.settings.apiUrl,this.settings.apiToken),this.registerStyles(),this.ribbonIcon=this.addRibbonIcon("upload-cloud","Publish notes",async()=>{await this.publish()});let t=(0,v.debounce)(()=>this.checkPendingChanges(),2e3,!0);this.registerEvent(this.app.vault.on("modify",t)),this.registerEvent(this.app.vault.on("create",t)),this.registerEvent(this.app.vault.on("delete",t)),this.registerEvent(this.app.vault.on("rename",t)),setTimeout(()=>this.checkPendingChanges(),3e3),this.setupAutoPublish(),this.addCommand({id:"publish-sync",name:"Sync and publish",callback:async()=>{await this.publish()}}),this.addCommand({id:"publish-connect",name:"Connect vault",callback:async()=>{await this.startDeviceCodeFlow()}}),this.addCommand({id:"publish-disconnect",name:"Disconnect vault",callback:async()=>{await this.disconnect()}}),this.settingsTab=new T(this.app,this),this.addSettingTab(this.settingsTab),this.statusBarItem=this.addStatusBarItem(),this.updateStatusBar()}onunload(){this.autoPublishInterval&&clearInterval(this.autoPublishInterval)}async loadSettings(){this.settings=Object.assign({},F,await this.loadData())}async saveSettings(){await this.saveData(this.settings),this.api&&(this.api=new w(this.settings.apiUrl,this.settings.apiToken)),this.updateStatusBar()}showNotice(t){new v.Notice(t)}updateStatusBar(){this.statusBarItem&&(this.settings.apiToken?this.pendingChanges>0?(this.statusBarItem.setText(`Publish: ${this.pendingChanges} pending`),this.statusBarItem.setAttribute("aria-label",`${this.pendingChanges} notes to publish`)):(this.statusBarItem.setText("Publish: Up to date"),this.statusBarItem.setAttribute("aria-label","All notes published")):(this.statusBarItem.setText("Publish: Not connected"),this.statusBarItem.setAttribute("aria-label","Click to connect")),this.ribbonIcon&&(this.pendingChanges>0?(this.ribbonIcon.setAttribute("aria-label",`Publish notes (${this.pendingChanges} pending)`),this.ribbonIcon.addClass("has-pending-changes")):(this.ribbonIcon.setAttribute("aria-label","Publish notes"),this.ribbonIcon.removeClass("has-pending-changes"))))}async checkPendingChanges(){if(!this.settings.apiToken||!this.settings.siteId||!this.api){this.pendingChanges=0,this.updateStatusBar();return}try{let t=await C(this.app),e=await this.api.getNotes(this.settings.siteId),s=await V(this.app,e);this.pendingChanges=s.create.length+s.update.length+s.delete.length,this.updateStatusBar()}catch(t){console.debug("Failed to check pending changes:",t)}}registerStyles(){let t=document.createElement("style");t.id="publish-plugin-styles",t.textContent=`
			/* Pending changes indicator on ribbon icon */
			.side-dock-ribbon-action.has-pending-changes::after {
				content: '';
				position: absolute;
				top: 6px;
				right: 6px;
				width: 8px;
				height: 8px;
				background: var(--color-accent);
				border-radius: 50%;
				border: 2px solid var(--background-primary);
			}
			
			.side-dock-ribbon-action.has-pending-changes {
				position: relative;
			}
		`,document.head.appendChild(t)}setupAutoPublish(){if(this.autoPublishInterval&&(clearInterval(this.autoPublishInterval),this.autoPublishInterval=null),!this.settings.autoPublish||!this.settings.apiToken)return;let t=5*60*1e3;this.autoPublishInterval=setInterval(async()=>{this.pendingChanges>0&&(this.showNotice(`Auto-publishing ${this.pendingChanges} changes...`),await this.publishSilent())},t)}async publishSilent(){if(!(!this.api||!this.settings.siteId))try{let t=await j(this.app,this.api,this.settings.siteId,this.settings,()=>{});await this.saveSettings(),t.success&&(this.pendingChanges=0,this.updateStatusBar(),this.showNotice(`Auto-published: ${t.created} created, ${t.updated} updated, ${t.deleted} deleted`))}catch(t){console.error("Auto-publish failed:",t)}}async startDeviceCodeFlow(){if(!this.api){this.showNotice("Plugin not initialized");return}try{let t=await this.api.getDeviceCode();new S(this.app,t.code,t.verificationUrl,this.api,async s=>{this.settings.apiToken=s.token,this.settings.userEmail=s.email,this.settings.siteId=s.siteId,this.settings.subdomain=s.subdomain,await this.saveSettings(),this.api?.setToken(s.token),this.settingsTab?.display();let i=s.subdomain?` Your site: ${s.subdomain}.pubit.site`:"";this.showNotice(`Successfully connected!${i}`)},()=>{}).open()}catch(t){this.showNotice(`Failed to start connection: ${t instanceof Error?t.message:"Unknown error"}`)}}async disconnect(){if(!this.api||!this.settings.apiToken){this.showNotice("Not connected");return}try{await this.api.revokeToken()}catch{}this.settings.apiToken=void 0,this.settings.siteId=void 0,this.settings.userEmail=void 0,await this.saveSettings(),this.showNotice("Disconnected")}async publish(){if(!this.api){this.showNotice("Plugin not initialized");return}if(!this.settings.apiToken){this.showNotice("Please connect your vault first"),await this.startDeviceCodeFlow();return}if(!this.settings.siteId){this.showNotice("No site configured. Please disconnect and reconnect.");return}let t=new I(this.app);t.open();try{let e=await j(this.app,this.api,this.settings.siteId,this.settings,s=>{t.setStatus(s)});await this.saveSettings(),e.success?(t.showSuccess(e.siteUrl||"",{created:e.created,updated:e.updated,deleted:e.deleted}),this.pendingChanges=0,this.updateStatusBar()):t.showError(e.errors.join(`
`))}catch(e){t.showError(e instanceof Error?e.message:"Unknown error")}}async createSite(){if(this.api)return new Promise(t=>{new P(this.app,this.api,"pubit.site",async(s,i)=>{this.settings.siteId=s,this.settings.subdomain=i,await this.saveSettings(),this.showNotice(`Site created: ${i}.pubit.site`),t()},()=>{t()}).open()})}async changeSubdomain(){if(!this.api){this.showNotice("Plugin not initialized");return}if(!this.settings.apiToken){this.showNotice("Please connect your vault first");return}this.showNotice("Subdomain change coming soon! For now, disconnect and reconnect to get a new subdomain.")}};
