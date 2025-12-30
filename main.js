"use strict";var k=Object.defineProperty;var W=Object.getOwnPropertyDescriptor;var Y=Object.getOwnPropertyNames;var K=Object.prototype.hasOwnProperty;var X=(n,t)=>{for(var e in t)k(n,e,{get:t[e],enumerable:!0})},Z=(n,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Y(t))!K.call(n,i)&&i!==e&&k(n,i,{get:()=>t[i],enumerable:!(s=W(t,i))||s.enumerable});return n};var J=n=>Z(k({},"__esModule",{value:!0}),n);var ot={};X(ot,{default:()=>S});module.exports=J(ot);var D=require("obsidian");var y=class{baseUrl;token;constructor(t,e){this.baseUrl=t,this.token=e||null}setToken(t){this.token=t}async request(t,e,s,i=!1){let o={};this.token&&(o.Authorization=`Bearer ${this.token}`),s&&!i&&(o["Content-Type"]="application/json");let r=0,c=3;for(;r<c;)try{let l=await fetch(`${this.baseUrl}${e}`,{method:t,headers:o,body:i?s:s?JSON.stringify(s):void 0});if(!l.ok){let a=await l.json().catch(()=>({message:"Request failed"}));throw l.status>=400&&l.status<500?new b(a.code||"ERROR",a.message,l.status):new b(a.code||"SERVER_ERROR",a.message||"Server error",l.status)}return l.json()}catch(l){if(l instanceof b&&l.status>=400&&l.status<500||(r++,r>=c))throw l;await new Promise(a=>setTimeout(a,2**r*1e3))}throw new Error("Max retries exceeded")}async getDeviceCode(){return this.request("POST","/auth/device-code")}async pollDeviceCode(t){return this.request("GET",`/auth/poll/${t}`)}async revokeToken(){return this.request("POST","/auth/revoke")}async getSites(){return this.request("GET","/sites")}async createSite(t){return this.request("POST","/sites",{subdomain:t})}async getSite(t){return this.request("GET",`/sites/${t}`)}async getNotes(t){return this.request("GET",`/sites/${t}/notes`)}async uploadNote(t,e,s){let i={"Content-Type":"text/markdown; charset=utf-8"};this.token&&(i.Authorization=`Bearer ${this.token}`);let o=await fetch(`${this.baseUrl}/sites/${t}/notes/${e}`,{method:"PUT",headers:i,body:s});if(!o.ok){let r=await o.json().catch(()=>({message:"Upload failed"}));throw new b(r.code||"UPLOAD_FAILED",r.message,o.status)}return o.json()}async deleteNote(t,e){return this.request("DELETE",`/sites/${t}/notes/${e}`)}async getImages(t){return this.request("GET",`/sites/${t}/images`)}async uploadImage(t,e,s){let i=new FormData,o=new Blob([e],{type:this.getMimeType(s)});return i.append("image",o,s),this.request("POST",`/sites/${t}/images`,i,!0)}async publish(t,e=!1){let s=e?"?force=true":"";return this.request("POST",`/sites/${t}/publish${s}`)}getMimeType(t){let e=t.split(".").pop()?.toLowerCase();return{png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",webp:"image/webp",svg:"image/svg+xml"}[e||""]||"application/octet-stream"}},b=class extends Error{code;status;constructor(t,e,s){super(e),this.code=t,this.status=s,this.name="ApiError"}};var L=require("obsidian"),x=class extends L.Modal{code;verificationUrl;api;pollInterval=null;onSuccess;onCancel;constructor(t,e,s,i,o,r){super(t),this.code=e,this.verificationUrl=s,this.api=i,this.onSuccess=o,this.onCancel=r}onOpen(){let{contentEl:t}=this;t.empty(),t.addClass("publish-device-code-modal"),t.createEl("h2",{text:"Connect Your Vault"}),t.createDiv({cls:"publish-instructions"}).createEl("p",{text:"Enter this code in your browser to connect:"}),t.createDiv({cls:"publish-code-display"}).createEl("span",{text:this.code,cls:"publish-code"});let i=t.createDiv({cls:"publish-button-container"}),o=i.createEl("button",{text:"Copy Code",cls:"mod-cta"});o.addEventListener("click",()=>{navigator.clipboard.writeText(this.code),o.textContent="Copied!",setTimeout(()=>{o.textContent="Copy Code"},2e3)}),i.createEl("button",{text:"Open in Browser"}).addEventListener("click",()=>{window.open(this.verificationUrl,"_blank")});let c=t.createDiv({cls:"publish-status"});c.createEl("p",{text:"Waiting for authorization..."}),t.createEl("button",{text:"Cancel",cls:"publish-cancel-button"}).addEventListener("click",()=>{this.close(),this.onCancel()}),this.startPolling(c),this.addStyles()}startPolling(t){this.pollInterval=setInterval(async()=>{try{let e=await this.api.pollDeviceCode(this.code);e.status==="completed"&&e.token?(this.stopPolling(),t.empty(),t.createEl("p",{text:"Connected successfully!",cls:"publish-status-success"}),setTimeout(()=>{this.close(),this.onSuccess({token:e.token,email:e.email||"",siteId:e.siteId,subdomain:e.subdomain})},1e3)):e.status==="expired"&&(this.stopPolling(),t.empty(),t.createEl("p",{text:"Code expired. Please try again.",cls:"publish-status-error"}))}catch{}},2e3)}stopPolling(){this.pollInterval&&(clearInterval(this.pollInterval),this.pollInterval=null)}onClose(){this.stopPolling();let{contentEl:t}=this;t.empty()}addStyles(){let t=document.createElement("style");t.textContent=`
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
		`,this.contentEl.appendChild(t)}};function R(n){if(!n||typeof n!="string")return"";let t=n.toLowerCase().trim(),e={\u00E4:"ae",\u00F6:"oe",\u00FC:"ue",\u00DF:"ss",\u00E0:"a",\u00E1:"a",\u00E2:"a",\u00E3:"a",\u00E5:"a",\u00E6:"ae",\u00E7:"c",\u00E8:"e",\u00E9:"e",\u00EA:"e",\u00EB:"e",\u00EC:"i",\u00ED:"i",\u00EE:"i",\u00EF:"i",\u00F1:"n",\u00F2:"o",\u00F3:"o",\u00F4:"o",\u00F5:"o",\u00F8:"o",\u00F9:"u",\u00FA:"u",\u00FB:"u",\u00FD:"y",\u00FF:"y",\u00F0:"d",\u00FE:"th"};for(let[s,i]of Object.entries(e))t=t.replace(new RegExp(s,"g"),i);return t=t.replace(/[\s_]+/g,"-"),t=t.replace(/[^a-z0-9-]/g,""),t=t.replace(/-+/g,"-"),t=t.replace(/^-+|-+$/g,""),t||"untitled"}async function A(n){let e=new TextEncoder().encode(n),s=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(s)).map(r=>r.toString(16).padStart(2,"0")).join("")}var $=new Set(["www","api","app","admin","dashboard","help","support","blog","docs","status","mail","smtp","pop","imap","ftp","cdn","assets","static","img","images","js","css","auth","login","register","signup","signin","account","billing","payment","dev","staging","test","demo","portal"]),Q=/^[a-z][a-z0-9-]{1,28}[a-z0-9]$/;function I(n){return!(!n||typeof n!="string"||!Q.test(n)||n.includes("--"))}function N(n){return $.has(n.toLowerCase())}var O=require("obsidian"),E=class extends O.Modal{api;serviceDomain;onSuccess;onCancel;constructor(t,e,s,i,o){super(t),this.api=e,this.serviceDomain=s,this.onSuccess=i,this.onCancel=o}onOpen(){let{contentEl:t}=this;t.empty(),t.addClass("publish-subdomain-modal"),t.createEl("h2",{text:"Choose Your Site URL"}),t.createDiv({cls:"publish-instructions"}).createEl("p",{text:"Pick a unique subdomain for your published notes:"});let s=t.createDiv({cls:"publish-subdomain-input"}),i=s.createEl("input",{type:"text",placeholder:"my-notes",cls:"publish-subdomain-field"});s.createEl("span",{text:`.${this.serviceDomain}`,cls:"publish-domain-suffix"});let o=t.createDiv({cls:"publish-url-preview"});o.createEl("span",{text:"Your site will be at: "});let r=o.createEl("span",{cls:"publish-preview-url",text:`https://your-subdomain.${this.serviceDomain}`}),c=t.createDiv({cls:"publish-feedback"}),l=t.createDiv({cls:"publish-button-container"}),a=l.createEl("button",{text:"Create Site",cls:"mod-cta"});a.disabled=!0;let h=l.createEl("button",{text:"Cancel"});i.addEventListener("input",()=>{let d=i.value.toLowerCase().trim();if(r.textContent=d?`https://${d}.${this.serviceDomain}`:`https://your-subdomain.${this.serviceDomain}`,c.empty(),a.disabled=!0,!!d){if(!I(d)){c.createEl("p",{text:"Must be 3-30 characters, start with a letter, and contain only lowercase letters, numbers, and hyphens.",cls:"publish-feedback-error"});return}if(N(d)){c.createEl("p",{text:"This subdomain is reserved.",cls:"publish-feedback-error"});return}c.createEl("p",{text:"Looks good!",cls:"publish-feedback-success"}),a.disabled=!1}}),a.addEventListener("click",async()=>{let d=i.value.toLowerCase().trim();a.disabled=!0,a.textContent="Creating...",c.empty();try{let p=await this.api.createSite(d);this.close(),this.onSuccess(p.id,p.subdomain)}catch(p){a.disabled=!1,a.textContent="Create Site",c.empty(),c.createEl("p",{text:p instanceof Error?p.message:"Failed to create site",cls:"publish-feedback-error"})}}),h.addEventListener("click",()=>{this.close(),this.onCancel()}),this.addStyles(),i.focus()}onClose(){let{contentEl:t}=this;t.empty()}addStyles(){let t=document.createElement("style");t.textContent=`
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
		`,this.contentEl.appendChild(t)}};var tt="https://api.pubit.site",et="https://auth.pubit.site",U=tt,st=et,F=`${st}/dashboard/`,M="pubit.site",B={};var f=require("obsidian");var C=class extends f.PluginSettingTab{plugin;constructor(t,e){super(t,e),this.plugin=e}display(){let{containerEl:t}=this;t.empty();let e=!!this.plugin.settings.apiToken;if(new f.Setting(t).setName("Connection status").setDesc(e?`Connected as ${this.plugin.settings.userEmail||"Unknown"}`:"Not connected").addButton(s=>{e?s.setButtonText("Disconnect").setWarning().onClick(async()=>{await this.plugin.disconnect(),this.display()}):s.setButtonText("Connect").setCta().onClick(async()=>{await this.plugin.startDeviceCodeFlow(),setTimeout(()=>this.display(),1e3)})}),e&&this.plugin.settings.subdomain){let i=`https://${this.plugin.settings.subdomain}.${M}`;new f.Setting(t).setName("Your site").setDesc(i).addButton(o=>o.setButtonText("Open Site").onClick(()=>{window.open(i,"_blank")})),new f.Setting(t).setName("Dashboard").setDesc("Manage your site, edit menu order, or delete your site").addButton(o=>o.setButtonText("Open Dashboard").onClick(()=>{window.open(F,"_blank")}))}}};function it(n){if(n.replace(/```[\s\S]*?```/g,"").replace(/`[^`]+`/g,"").includes("#publish"))return!0;if(n.startsWith("---")){let e=n.indexOf(`
---`,3);if(e!==-1){let s=n.slice(4,e);if(/^publish:\s*["']?true["']?\s*$/im.test(s))return!0}}return!1}async function V(n){let t=n.vault.getMarkdownFiles(),e=[];for(let s of t){let i=await n.vault.cachedRead(s);it(i)&&e.push(s)}return e}function j(n){return n.path.replace(/\.md$/,"").split("/").map(i=>R(i)).join("/")}function H(n){let t=/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g,e=[],s;for(;(s=t.exec(n))!==null;){let i=s[1].trim();/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(i)&&e.push(i)}return[...new Set(e)]}function q(n,t){let e=n.vault.getFiles(),s=t.toLowerCase(),i=t.split("/").pop()||t,o=i.toLowerCase();for(let r of e)if(r.name===t||r.name===i||r.path===t)return r;for(let r of e)if(r.name.toLowerCase()===s||r.name.toLowerCase()===o)return r;for(let r of e)if(r.path.toLowerCase().endsWith(`/${o}`))return r;if(!/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(t))for(let r of["png","jpg","jpeg","gif","webp","svg"]){let l=`${i}.${r}`.toLowerCase();for(let a of e)if(a.name.toLowerCase()===l)return a}return null}async function nt(n,t,e,s,i){i?.("Checking existing images on server...");let o={};try{o=(await t.getImages(e)).images}catch(a){console.error("Failed to fetch server images:",a)}let r=new Set(Object.keys(o)),c=[],l=new Set;for(let a of s){let h=await n.vault.cachedRead(a),d=H(h);for(let p of d)l.add(p)}for(let a of l){if(r.has(a))continue;let h=q(n,a);h&&c.push({filename:a,file:h})}for(let a=0;a<c.length;a++){let{filename:h,file:d}=c[a];i?.(`Uploading image ${a+1}/${c.length}: ${h}`);try{let p=await n.vault.readBinary(d);await t.uploadImage(e,p,h)}catch(p){console.error(`[Pubit] Failed to upload image ${h}:`,p)}}}async function z(n,t,e,s){let i=[];try{s?.("Collecting local notes...",5);let o=await V(n);s?.("Fetching remote state...",10);let r=await t.getNotes(e),c=new Map(r.map(u=>[u.slug,u.contentHash]));s?.("Syncing images...",15),await nt(n,t,e,o,u=>s?.(u,20)),s?.("Computing changes...",25);let l=[],a=[],h=new Set,d=0;for(let u of o){let g=j(u),m=await n.vault.cachedRead(u),P=await A(m);h.add(g);let v=c.get(g);!v||v!==P?l.push({slug:g,content:m}):d++}for(let[u]of c)h.has(u)||a.push(u);let p=0;if(l.length>0){let u=l.length;for(let g=0;g<l.length;g++){let m=l[g],P=30+g/u*40;s?.(`Uploading ${g+1}/${u}: ${m.slug.split("/").pop()}...`,P);try{await t.uploadNote(e,m.slug,m.content),p++}catch(v){i.push(`Upload failed: ${m.slug} - ${v instanceof Error?v.message:"Unknown"}`)}}}let T=0;if(a.length>0){s?.(`Deleting ${a.length} orphaned notes...`,75);for(let u of a)try{await t.deleteNote(e,u),T++}catch(g){i.push(`Delete failed: ${u} - ${g instanceof Error?g.message:"Unknown"}`)}}if(p>0||T>0){s?.("Publishing...",85);let u=await t.publish(e);return{success:i.length===0,uploaded:p,deleted:T,unchanged:d,errors:i,siteUrl:u.url}}s?.("Publishing...",90);let G=await t.publish(e);return{success:!0,uploaded:0,deleted:0,unchanged:o.length,errors:[],siteUrl:G.url}}catch(o){return{success:!1,uploaded:0,deleted:0,unchanged:0,errors:[o instanceof Error?o.message:"Unknown error"]}}}var S=class extends D.Plugin{settings=B;api=null;statusBarItem=null;settingsTab=null;ribbonIcon=null;hasPendingChanges=!1;styleEl=null;async onload(){await this.loadSettings(),this.api=new y(U,this.settings.apiToken),this.registerStyles(),this.ribbonIcon=this.addRibbonIcon("upload-cloud","Publish notes",async()=>{await this.publish()}),this.registerEvent(this.app.vault.on("modify",()=>this.markPendingChanges())),this.registerEvent(this.app.vault.on("create",()=>this.markPendingChanges())),this.registerEvent(this.app.vault.on("delete",()=>this.markPendingChanges())),this.registerEvent(this.app.vault.on("rename",()=>this.markPendingChanges())),this.addCommand({id:"publish-sync",name:"Sync and publish",callback:async()=>{await this.publish()}}),this.addCommand({id:"publish-connect",name:"Connect vault",callback:async()=>{await this.startDeviceCodeFlow()}}),this.addCommand({id:"publish-disconnect",name:"Disconnect vault",callback:async()=>{await this.disconnect()}}),this.settingsTab=new C(this.app,this),this.addSettingTab(this.settingsTab),this.statusBarItem=this.addStatusBarItem(),this.updateStatusBar()}async loadSettings(){this.settings=Object.assign({},B,await this.loadData())}async saveSettings(){await this.saveData(this.settings),this.api&&(this.api=new y(U,this.settings.apiToken)),this.updateStatusBar()}showNotice(t){new D.Notice(t)}updateStatusBar(){this.statusBarItem&&(this.settings.apiToken?this.hasPendingChanges?(this.statusBarItem.setText("Publish: Changes pending"),this.statusBarItem.setAttribute("aria-label","Click ribbon icon to sync")):(this.statusBarItem.setText("Publish: Up to date"),this.statusBarItem.setAttribute("aria-label","All synced")):(this.statusBarItem.setText("Publish: Not connected"),this.statusBarItem.setAttribute("aria-label","Click to connect")))}markPendingChanges(){this.settings.apiToken&&(this.hasPendingChanges||(this.hasPendingChanges=!0,this.updatePendingIndicator(),this.updateStatusBar()))}clearPendingChanges(){this.hasPendingChanges=!1,this.updatePendingIndicator(),this.updateStatusBar()}updatePendingIndicator(){this.ribbonIcon&&(this.hasPendingChanges?(this.ribbonIcon.addClass("has-pending-changes"),this.ribbonIcon.setAttribute("aria-label","Publish notes (changes pending)")):(this.ribbonIcon.removeClass("has-pending-changes"),this.ribbonIcon.setAttribute("aria-label","Publish notes")))}registerStyles(){this.styleEl=document.createElement("style"),this.styleEl.id="publish-plugin-styles",this.styleEl.textContent=`
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
		`,document.head.appendChild(this.styleEl)}onunload(){this.styleEl&&this.styleEl.remove()}async startDeviceCodeFlow(){if(!this.api){this.showNotice("Plugin not initialized");return}try{let t=await this.api.getDeviceCode();new x(this.app,t.code,t.verificationUrl,this.api,async s=>{this.settings.apiToken=s.token,this.settings.userEmail=s.email,this.settings.siteId=s.siteId,this.settings.subdomain=s.subdomain,await this.saveSettings(),this.api?.setToken(s.token),this.settingsTab?.display();let i=s.subdomain?` Your site: ${s.subdomain}.pubit.site`:"";this.showNotice(`Successfully connected!${i}`)},()=>{}).open()}catch(t){this.showNotice(`Failed to start connection: ${t instanceof Error?t.message:"Unknown error"}`)}}async disconnect(){if(!this.api||!this.settings.apiToken){this.showNotice("Not connected");return}let t=this.settings.subdomain;try{await this.api.revokeToken()}catch{}this.settings.apiToken=void 0,this.settings.siteId=void 0,this.settings.userEmail=void 0,this.settings.subdomain=void 0,await this.saveSettings(),t?this.showNotice(`Disconnected. Your site remains online at ${t}.pubit.site. To delete it, visit the dashboard.`):this.showNotice("Disconnected")}async publish(){if(!this.api){this.showNotice("Plugin not initialized");return}if(!this.settings.apiToken){this.showNotice("Please connect your vault first"),await this.startDeviceCodeFlow();return}if(!this.settings.siteId){this.showNotice("No site configured. Please disconnect and reconnect.");return}let t=new w(this.app);t.open();try{let e=await z(this.app,this.api,this.settings.siteId,(s,i)=>{t.setStatus(s),i!==void 0&&t.setProgress(i)});e.success?(t.showSuccess(e.siteUrl||"",{uploaded:e.uploaded,deleted:e.deleted,unchanged:e.unchanged}),this.clearPendingChanges()):t.showError(e.errors.join(`
`))}catch(e){t.showError(e instanceof Error?e.message:"Unknown error")}}async createSite(){if(this.api)return new Promise(t=>{new E(this.app,this.api,"pubit.site",async(s,i)=>{this.settings.siteId=s,this.settings.subdomain=i,await this.saveSettings(),this.showNotice(`Site created: ${i}.pubit.site`),t()},()=>{t()}).open()})}async changeSubdomain(){if(!this.api){this.showNotice("Plugin not initialized");return}if(!this.settings.apiToken){this.showNotice("Please connect your vault first");return}this.showNotice("Subdomain change coming soon! For now, disconnect and reconnect to get a new subdomain.")}};
