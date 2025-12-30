"use strict";var P=Object.defineProperty;var W=Object.getOwnPropertyDescriptor;var Y=Object.getOwnPropertyNames;var K=Object.prototype.hasOwnProperty;var X=(n,t)=>{for(var e in t)P(n,e,{get:t[e],enumerable:!0})},Z=(n,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Y(t))!K.call(n,i)&&i!==e&&P(n,i,{get:()=>t[i],enumerable:!(s=W(t,i))||s.enumerable});return n};var J=n=>Z(P({},"__esModule",{value:!0}),n);var ot={};X(ot,{default:()=>S});module.exports=J(ot);var T=require("obsidian");var y=class{baseUrl;token;constructor(t,e){this.baseUrl=t,this.token=e||null}setToken(t){this.token=t}async request(t,e,s,i=!1){let a={};this.token&&(a.Authorization=`Bearer ${this.token}`),s&&!i&&(a["Content-Type"]="application/json");let r=0,c=5;for(;r<c;)try{let l=await fetch(`${this.baseUrl}${e}`,{method:t,headers:a,body:i?s:s?JSON.stringify(s):void 0});if(!l.ok){let o=await l.json().catch(()=>({message:"Request failed"}));if(l.status===429){let u=l.headers.get("Retry-After"),p=u?Number.parseInt(u,10)*1e3:2**r*1e3;if(r++,r>=c)throw new m("RATE_LIMITED","Rate limited. Try again later.",429);await new Promise(h=>setTimeout(h,Math.min(p,3e4)));continue}throw l.status>=400&&l.status<500?new m(o.code||"ERROR",o.message,l.status):new m(o.code||"SERVER_ERROR",o.message||"Server error",l.status)}return l.json()}catch(l){if(l instanceof m&&l.status>=400&&l.status<500||(r++,r>=c))throw l;await new Promise(o=>setTimeout(o,2**r*1e3))}throw new Error("Max retries exceeded")}async getDeviceCode(){return this.request("POST","/auth/device-code")}async pollDeviceCode(t){return this.request("GET",`/auth/poll/${t}`)}async revokeToken(){return this.request("POST","/auth/revoke")}async getSites(){return this.request("GET","/sites")}async createSite(t){return this.request("POST","/sites",{subdomain:t})}async getSite(t){return this.request("GET",`/sites/${t}`)}async getNotes(t){return this.request("GET",`/sites/${t}/notes`)}async uploadNote(t,e,s){let i={"Content-Type":"text/markdown; charset=utf-8"};this.token&&(i.Authorization=`Bearer ${this.token}`);let a=5;for(let r=0;r<a;r++){let c=await fetch(`${this.baseUrl}/sites/${t}/notes/${e}`,{method:"PUT",headers:i,body:s});if(c.ok)return c.json();if(c.status===429){let o=c.headers.get("Retry-After"),u=o?Number.parseInt(o,10)*1e3:2**r*1e3;await new Promise(p=>setTimeout(p,Math.min(u,3e4)));continue}let l=await c.json().catch(()=>({message:"Upload failed"}));throw new m(l.code||"UPLOAD_FAILED",l.message,c.status)}throw new m("RATE_LIMITED","Rate limited after multiple retries",429)}async deleteNote(t,e){return this.request("DELETE",`/sites/${t}/notes/${e}`)}async getImages(t){return this.request("GET",`/sites/${t}/images`)}async uploadImage(t,e,s){let i=new FormData,a=new Blob([e],{type:this.getMimeType(s)});return i.append("image",a,s),this.request("POST",`/sites/${t}/images`,i,!0)}async publish(t,e=!1){let s=e?"?force=true":"";return this.request("POST",`/sites/${t}/publish${s}`)}getMimeType(t){let e=t.split(".").pop()?.toLowerCase();return{png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",webp:"image/webp",svg:"image/svg+xml"}[e||""]||"application/octet-stream"}},m=class extends Error{code;status;constructor(t,e,s){super(e),this.code=t,this.status=s,this.name="ApiError"}};var L=require("obsidian"),E=class extends L.Modal{code;verificationUrl;api;pollInterval=null;onSuccess;onCancel;constructor(t,e,s,i,a,r){super(t),this.code=e,this.verificationUrl=s,this.api=i,this.onSuccess=a,this.onCancel=r}onOpen(){let{contentEl:t}=this;t.empty(),t.addClass("publish-device-code-modal"),t.createEl("h2",{text:"Connect Your Vault"}),t.createDiv({cls:"publish-instructions"}).createEl("p",{text:"Enter this code in your browser to connect:"}),t.createDiv({cls:"publish-code-display"}).createEl("span",{text:this.code,cls:"publish-code"});let i=t.createDiv({cls:"publish-button-container"}),a=i.createEl("button",{text:"Copy Code",cls:"mod-cta"});a.addEventListener("click",()=>{navigator.clipboard.writeText(this.code),a.textContent="Copied!",setTimeout(()=>{a.textContent="Copy Code"},2e3)}),i.createEl("button",{text:"Open in Browser"}).addEventListener("click",()=>{window.open(this.verificationUrl,"_blank")});let c=t.createDiv({cls:"publish-status"});c.createEl("p",{text:"Waiting for authorization..."}),t.createEl("button",{text:"Cancel",cls:"publish-cancel-button"}).addEventListener("click",()=>{this.close(),this.onCancel()}),this.startPolling(c),this.addStyles()}startPolling(t){this.pollInterval=setInterval(async()=>{try{let e=await this.api.pollDeviceCode(this.code);e.status==="completed"&&e.token?(this.stopPolling(),t.empty(),t.createEl("p",{text:"Connected successfully!",cls:"publish-status-success"}),setTimeout(()=>{this.close(),this.onSuccess({token:e.token,email:e.email||"",siteId:e.siteId,subdomain:e.subdomain})},1e3)):e.status==="expired"&&(this.stopPolling(),t.empty(),t.createEl("p",{text:"Code expired. Please try again.",cls:"publish-status-error"}))}catch{}},2e3)}stopPolling(){this.pollInterval&&(clearInterval(this.pollInterval),this.pollInterval=null)}onClose(){this.stopPolling();let{contentEl:t}=this;t.empty()}addStyles(){let t=document.createElement("style");t.textContent=`
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
		`,this.contentEl.appendChild(t)}};function k(n){if(!n||typeof n!="string")return"";let t=n.toLowerCase().trim(),e={\u00E4:"ae",\u00F6:"oe",\u00FC:"ue",\u00DF:"ss",\u00E0:"a",\u00E1:"a",\u00E2:"a",\u00E3:"a",\u00E5:"a",\u00E6:"ae",\u00E7:"c",\u00E8:"e",\u00E9:"e",\u00EA:"e",\u00EB:"e",\u00EC:"i",\u00ED:"i",\u00EE:"i",\u00EF:"i",\u00F1:"n",\u00F2:"o",\u00F3:"o",\u00F4:"o",\u00F5:"o",\u00F8:"o",\u00F9:"u",\u00FA:"u",\u00FB:"u",\u00FD:"y",\u00FF:"y",\u00F0:"d",\u00FE:"th"};for(let[s,i]of Object.entries(e))t=t.replace(new RegExp(s,"g"),i);return t=t.replace(/[\s_]+/g,"-"),t=t.replace(/[^a-z0-9-]/g,""),t=t.replace(/-+/g,"-"),t=t.replace(/^-+|-+$/g,""),t||"untitled"}async function A(n){let e=new TextEncoder().encode(n),s=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(s)).map(r=>r.toString(16).padStart(2,"0")).join("")}var $=new Set(["www","api","app","admin","dashboard","help","support","blog","docs","status","mail","smtp","pop","imap","ftp","cdn","assets","static","img","images","js","css","auth","login","register","signup","signin","account","billing","payment","dev","staging","test","demo","portal"]),Q=/^[a-z][a-z0-9-]{1,28}[a-z0-9]$/;function I(n){return!(!n||typeof n!="string"||!Q.test(n)||n.includes("--"))}function N(n){return $.has(n.toLowerCase())}var O=require("obsidian"),x=class extends O.Modal{api;serviceDomain;onSuccess;onCancel;constructor(t,e,s,i,a){super(t),this.api=e,this.serviceDomain=s,this.onSuccess=i,this.onCancel=a}onOpen(){let{contentEl:t}=this;t.empty(),t.addClass("publish-subdomain-modal"),t.createEl("h2",{text:"Choose Your Site URL"}),t.createDiv({cls:"publish-instructions"}).createEl("p",{text:"Pick a unique subdomain for your published notes:"});let s=t.createDiv({cls:"publish-subdomain-input"}),i=s.createEl("input",{type:"text",placeholder:"my-notes",cls:"publish-subdomain-field"});s.createEl("span",{text:`.${this.serviceDomain}`,cls:"publish-domain-suffix"});let a=t.createDiv({cls:"publish-url-preview"});a.createEl("span",{text:"Your site will be at: "});let r=a.createEl("span",{cls:"publish-preview-url",text:`https://your-subdomain.${this.serviceDomain}`}),c=t.createDiv({cls:"publish-feedback"}),l=t.createDiv({cls:"publish-button-container"}),o=l.createEl("button",{text:"Create Site",cls:"mod-cta"});o.disabled=!0;let u=l.createEl("button",{text:"Cancel"});i.addEventListener("input",()=>{let p=i.value.toLowerCase().trim();if(r.textContent=p?`https://${p}.${this.serviceDomain}`:`https://your-subdomain.${this.serviceDomain}`,c.empty(),o.disabled=!0,!!p){if(!I(p)){c.createEl("p",{text:"Must be 3-30 characters, start with a letter, and contain only lowercase letters, numbers, and hyphens.",cls:"publish-feedback-error"});return}if(N(p)){c.createEl("p",{text:"This subdomain is reserved.",cls:"publish-feedback-error"});return}c.createEl("p",{text:"Looks good!",cls:"publish-feedback-success"}),o.disabled=!1}}),o.addEventListener("click",async()=>{let p=i.value.toLowerCase().trim();o.disabled=!0,o.textContent="Creating...",c.empty();try{let h=await this.api.createSite(p);this.close(),this.onSuccess(h.id,h.subdomain)}catch(h){o.disabled=!1,o.textContent="Create Site",c.empty(),c.createEl("p",{text:h instanceof Error?h.message:"Failed to create site",cls:"publish-feedback-error"})}}),u.addEventListener("click",()=>{this.close(),this.onCancel()}),this.addStyles(),i.focus()}onClose(){let{contentEl:t}=this;t.empty()}addStyles(){let t=document.createElement("style");t.textContent=`
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
		`,this.contentEl.appendChild(t)}};var _=require("obsidian"),w=class extends _.Modal{statusEl=null;progressEl=null;detailsEl=null;closeButton=null;cancelled=!1;onOpen(){let{contentEl:t}=this;t.empty(),t.addClass("publish-sync-modal"),t.createEl("h2",{text:"Publishing Notes"}),this.progressEl=t.createDiv({cls:"publish-progress"}),this.progressEl.createDiv({cls:"publish-progress-bar"}),this.statusEl=t.createDiv({cls:"publish-sync-status"}),this.statusEl.createEl("p",{text:"Starting..."}),this.detailsEl=t.createDiv({cls:"publish-sync-details"});let e=t.createDiv({cls:"publish-button-container"});this.closeButton=e.createEl("button",{text:"Cancel"}),this.closeButton.addEventListener("click",()=>{this.cancelled=!0,this.close()}),this.addStyles()}setStatus(t){this.statusEl&&(this.statusEl.empty(),this.statusEl.createEl("p",{text:t}))}setProgress(t){if(this.progressEl){let e=this.progressEl.querySelector(".publish-progress-bar");e&&(e.style.width=`${t}%`)}}showSuccess(t,e){!this.statusEl||!this.detailsEl||(this.statusEl.empty(),this.statusEl.addClass("publish-status-success"),this.statusEl.createEl("p",{text:"Published successfully!"}),this.detailsEl.empty(),this.detailsEl.createEl("p",{text:`Uploaded: ${e.uploaded} | Deleted: ${e.deleted} | Unchanged: ${e.unchanged}`}),t&&this.detailsEl.createEl("a",{text:t,href:t,cls:"publish-site-link"}).addEventListener("click",i=>{i.preventDefault(),window.open(t,"_blank")}),this.closeButton&&(this.closeButton.textContent="Close"),this.setProgress(100))}showError(t){this.statusEl&&(this.statusEl.empty(),this.statusEl.addClass("publish-status-error"),this.statusEl.createEl("p",{text:"Publish failed"}),this.statusEl.createEl("p",{text:t,cls:"publish-error-message"}),this.closeButton&&(this.closeButton.textContent="Close"))}isCancelled(){return this.cancelled}onClose(){let{contentEl:t}=this;t.empty()}addStyles(){let t=document.createElement("style");t.textContent=`
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
		`,this.contentEl.appendChild(t)}};var tt="https://api.pubit.site",et="https://auth.pubit.site",U=tt,st=et,M=`${st}/dashboard/`,F="pubit.site",B={};var f=require("obsidian");var C=class extends f.PluginSettingTab{plugin;constructor(t,e){super(t,e),this.plugin=e}display(){let{containerEl:t}=this;t.empty();let e=!!this.plugin.settings.apiToken;if(new f.Setting(t).setName("Connection status").setDesc(e?`Connected as ${this.plugin.settings.userEmail||"Unknown"}`:"Not connected").addButton(s=>{e?s.setButtonText("Disconnect").setWarning().onClick(async()=>{await this.plugin.disconnect(),this.display()}):s.setButtonText("Connect").setCta().onClick(async()=>{await this.plugin.startDeviceCodeFlow(),setTimeout(()=>this.display(),1e3)})}),e&&this.plugin.settings.subdomain){let i=`https://${this.plugin.settings.subdomain}.${F}`;new f.Setting(t).setName("Your site").setDesc(i).addButton(a=>a.setButtonText("Open Site").onClick(()=>{window.open(i,"_blank")})),new f.Setting(t).setName("Dashboard").setDesc("Manage your site, edit menu order, or delete your site").addButton(a=>a.setButtonText("Open Dashboard").onClick(()=>{window.open(M,"_blank")}))}}};function it(n){if(n.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").includes("#publish"))return!0;if(n.startsWith("---")){let e=n.indexOf(`
---`,3);if(e!==-1){let s=n.slice(4,e);if(/^publish:\s*["']?true["']?\s*$/im.test(s))return!0}}return!1}async function V(n){let t=n.vault.getMarkdownFiles(),e=[];for(let s of t){let i=await n.vault.cachedRead(s);it(i)&&e.push(s)}return e}function j(n){return n.path.replace(/\.md$/,"").split("/").map(i=>k(i)).join("/")}function H(n){let t=/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g,e=[],s;for(;(s=t.exec(n))!==null;){let i=s[1].trim();/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(i)&&e.push(i)}return[...new Set(e)]}function q(n,t){let e=n.vault.getFiles(),s=t.toLowerCase(),i=t.split("/").pop()||t,a=i.toLowerCase();for(let r of e)if(r.name===t||r.name===i||r.path===t)return r;for(let r of e)if(r.name.toLowerCase()===s||r.name.toLowerCase()===a)return r;for(let r of e)if(r.path.toLowerCase().endsWith(`/${a}`))return r;if(!/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(t))for(let r of["png","jpg","jpeg","gif","webp","svg"]){let l=`${i}.${r}`.toLowerCase();for(let o of e)if(o.name.toLowerCase()===l)return o}return null}async function nt(n,t,e,s,i){i?.("Checking existing images on server...");let a={};try{a=(await t.getImages(e)).images}catch(o){console.error("Failed to fetch server images:",o)}let r=new Set(Object.keys(a)),c=[],l=new Set;for(let o of s){let u=await n.vault.cachedRead(o),p=H(u);for(let h of p)l.add(h)}for(let o of l){if(r.has(o))continue;let u=q(n,o);u&&c.push({filename:o,file:u})}for(let o=0;o<c.length;o++){let{filename:u,file:p}=c[o];i?.(`Uploading image ${o+1}/${c.length}: ${u}`);try{let h=await n.vault.readBinary(p);await t.uploadImage(e,h,u)}catch(h){console.error(`[Pubit] Failed to upload image ${u}:`,h)}}}async function z(n,t,e,s){let i=[];try{s?.("Collecting local notes...",5);let a=await V(n);s?.("Fetching remote state...",10);let r=await t.getNotes(e),c=new Map(r.map(d=>[d.slug,d.contentHash]));s?.("Syncing images...",15),await nt(n,t,e,a,d=>s?.(d,20)),s?.("Computing changes...",25);let l=[],o=[],u=new Set,p=0;for(let d of a){let g=j(d),b=await n.vault.cachedRead(d),R=await A(b);u.add(g);let v=c.get(g);!v||v!==R?l.push({slug:g,content:b}):p++}for(let[d]of c)u.has(d)||o.push(d);let h=0;if(l.length>0){let d=l.length;for(let g=0;g<l.length;g++){let b=l[g],R=30+g/d*40;s?.(`Uploading ${g+1}/${d}: ${b.slug.split("/").pop()}...`,R);try{await t.uploadNote(e,b.slug,b.content),h++}catch(v){i.push(`Upload failed: ${b.slug} - ${v instanceof Error?v.message:"Unknown"}`)}}}let D=0;if(o.length>0){s?.(`Deleting ${o.length} orphaned notes...`,75);for(let d of o)try{await t.deleteNote(e,d),D++}catch(g){i.push(`Delete failed: ${d} - ${g instanceof Error?g.message:"Unknown"}`)}}if(h>0||D>0){s?.("Publishing...",85);let d=await t.publish(e);return{success:i.length===0,uploaded:h,deleted:D,unchanged:p,errors:i,siteUrl:d.url}}s?.("Publishing...",90);let G=await t.publish(e);return{success:!0,uploaded:0,deleted:0,unchanged:a.length,errors:[],siteUrl:G.url}}catch(a){return{success:!1,uploaded:0,deleted:0,unchanged:0,errors:[a instanceof Error?a.message:"Unknown error"]}}}var S=class extends T.Plugin{settings=B;api=null;statusBarItem=null;settingsTab=null;ribbonIcon=null;hasPendingChanges=!1;styleEl=null;async onload(){await this.loadSettings(),this.api=new y(U,this.settings.apiToken),this.registerStyles(),this.ribbonIcon=this.addRibbonIcon("upload-cloud","Publish notes",async()=>{await this.publish()}),this.registerEvent(this.app.vault.on("modify",()=>this.markPendingChanges())),this.registerEvent(this.app.vault.on("create",()=>this.markPendingChanges())),this.registerEvent(this.app.vault.on("delete",()=>this.markPendingChanges())),this.registerEvent(this.app.vault.on("rename",()=>this.markPendingChanges())),this.addCommand({id:"publish-sync",name:"Sync and publish",callback:async()=>{await this.publish()}}),this.addCommand({id:"publish-connect",name:"Connect vault",callback:async()=>{await this.startDeviceCodeFlow()}}),this.addCommand({id:"publish-disconnect",name:"Disconnect vault",callback:async()=>{await this.disconnect()}}),this.settingsTab=new C(this.app,this),this.addSettingTab(this.settingsTab),this.statusBarItem=this.addStatusBarItem(),this.updateStatusBar()}async loadSettings(){this.settings=Object.assign({},B,await this.loadData())}async saveSettings(){await this.saveData(this.settings),this.api&&(this.api=new y(U,this.settings.apiToken)),this.updateStatusBar()}showNotice(t){new T.Notice(t)}updateStatusBar(){this.statusBarItem&&(this.settings.apiToken?this.hasPendingChanges?(this.statusBarItem.setText("Publish: Changes pending"),this.statusBarItem.setAttribute("aria-label","Click ribbon icon to sync")):(this.statusBarItem.setText("Publish: Up to date"),this.statusBarItem.setAttribute("aria-label","All synced")):(this.statusBarItem.setText("Publish: Not connected"),this.statusBarItem.setAttribute("aria-label","Click to connect")))}markPendingChanges(){this.settings.apiToken&&(this.hasPendingChanges||(this.hasPendingChanges=!0,this.updatePendingIndicator(),this.updateStatusBar()))}clearPendingChanges(){this.hasPendingChanges=!1,this.updatePendingIndicator(),this.updateStatusBar()}updatePendingIndicator(){this.ribbonIcon&&(this.hasPendingChanges?(this.ribbonIcon.addClass("has-pending-changes"),this.ribbonIcon.setAttribute("aria-label","Publish notes (changes pending)")):(this.ribbonIcon.removeClass("has-pending-changes"),this.ribbonIcon.setAttribute("aria-label","Publish notes")))}registerStyles(){this.styleEl=document.createElement("style"),this.styleEl.id="publish-plugin-styles",this.styleEl.textContent=`
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
		`,document.head.appendChild(this.styleEl)}onunload(){this.styleEl&&this.styleEl.remove()}async startDeviceCodeFlow(){if(!this.api){this.showNotice("Plugin not initialized");return}try{let t=await this.api.getDeviceCode();new E(this.app,t.code,t.verificationUrl,this.api,async s=>{this.settings.apiToken=s.token,this.settings.userEmail=s.email,this.settings.siteId=s.siteId,this.settings.subdomain=s.subdomain,await this.saveSettings(),this.api?.setToken(s.token),this.settingsTab?.display();let i=s.subdomain?` Your site: ${s.subdomain}.pubit.site`:"";this.showNotice(`Successfully connected!${i}`)},()=>{}).open()}catch(t){this.showNotice(`Failed to start connection: ${t instanceof Error?t.message:"Unknown error"}`)}}async disconnect(){if(!this.api||!this.settings.apiToken){this.showNotice("Not connected");return}let t=this.settings.subdomain;try{await this.api.revokeToken()}catch{}this.settings.apiToken=void 0,this.settings.siteId=void 0,this.settings.userEmail=void 0,this.settings.subdomain=void 0,await this.saveSettings(),t?this.showNotice(`Disconnected. Your site remains online at ${t}.pubit.site. To delete it, visit the dashboard.`):this.showNotice("Disconnected")}async publish(){if(!this.api){this.showNotice("Plugin not initialized");return}if(!this.settings.apiToken){this.showNotice("Please connect your vault first"),await this.startDeviceCodeFlow();return}if(!this.settings.siteId){this.showNotice("No site configured. Please disconnect and reconnect.");return}let t=new w(this.app);t.open();try{let e=await z(this.app,this.api,this.settings.siteId,(s,i)=>{t.setStatus(s),i!==void 0&&t.setProgress(i)});e.success?(t.showSuccess(e.siteUrl||"",{uploaded:e.uploaded,deleted:e.deleted,unchanged:e.unchanged}),this.clearPendingChanges()):t.showError(e.errors.join(`
`))}catch(e){t.showError(e instanceof Error?e.message:"Unknown error")}}async createSite(){if(this.api)return new Promise(t=>{new x(this.app,this.api,"pubit.site",async(s,i)=>{this.settings.siteId=s,this.settings.subdomain=i,await this.saveSettings(),this.showNotice(`Site created: ${i}.pubit.site`),t()},()=>{t()}).open()})}async changeSubdomain(){if(!this.api){this.showNotice("Plugin not initialized");return}if(!this.settings.apiToken){this.showNotice("Please connect your vault first");return}this.showNotice("Subdomain change coming soon! For now, disconnect and reconnect to get a new subdomain.")}};
