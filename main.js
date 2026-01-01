"use strict";var P=Object.defineProperty;var K=Object.getOwnPropertyDescriptor;var Q=Object.getOwnPropertyNames;var Z=Object.prototype.hasOwnProperty;var J=(n,t)=>{for(var e in t)P(n,e,{get:t[e],enumerable:!0})},tt=(n,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Q(t))!Z.call(n,i)&&i!==e&&P(n,i,{get:()=>t[i],enumerable:!(s=K(t,i))||s.enumerable});return n};var et=n=>tt(P({},"__esModule",{value:!0}),n);var lt={};J(lt,{default:()=>D});module.exports=et(lt);var I=require("obsidian");var E=class{baseUrl;token;constructor(t,e){this.baseUrl=t,this.token=e||null}setToken(t){this.token=t}async request(t,e,s,i=!1){let r={};this.token&&(r.Authorization=`Bearer ${this.token}`),s&&!i&&(r["Content-Type"]="application/json");let o=0,c=5;for(;o<c;)try{let l=await fetch(`${this.baseUrl}${e}`,{method:t,headers:r,body:i?s:s?JSON.stringify(s):void 0});if(!l.ok){let a=await l.json().catch(()=>({message:"Request failed"}));if(l.status===429){let u=l.headers.get("Retry-After"),h=u?Number.parseInt(u,10)*1e3:2**o*1e3;if(o++,o>=c)throw new m("RATE_LIMITED","Rate limited. Try again later.",429);await new Promise(d=>setTimeout(d,Math.min(h,3e4)));continue}throw l.status>=400&&l.status<500?new m(a.code||"ERROR",a.message,l.status):new m(a.code||"SERVER_ERROR",a.message||"Server error",l.status)}return l.json()}catch(l){if(l instanceof m&&l.status>=400&&l.status<500||(o++,o>=c))throw l;await new Promise(a=>setTimeout(a,2**o*1e3))}throw new Error("Max retries exceeded")}async getDeviceCode(){return this.request("POST","/auth/device-code")}async pollDeviceCode(t){return this.request("GET",`/auth/poll/${t}`)}async revokeToken(){return this.request("POST","/auth/revoke")}async getSites(){return this.request("GET","/sites")}async createSite(t){return this.request("POST","/sites",{subdomain:t})}async getSite(t){return this.request("GET",`/sites/${t}`)}async getNotes(t){return this.request("GET",`/sites/${t}/notes`)}async uploadNote(t,e,s,i){let r={"Content-Type":"text/markdown; charset=utf-8","X-Note-Title":encodeURIComponent(s)};this.token&&(r.Authorization=`Bearer ${this.token}`);let o=5;for(let c=0;c<o;c++){let l=await fetch(`${this.baseUrl}/sites/${t}/notes/${e}`,{method:"PUT",headers:r,body:i});if(l.ok)return l.json();if(l.status===429){let u=l.headers.get("Retry-After"),h=u?Number.parseInt(u,10)*1e3:2**c*1e3;await new Promise(d=>setTimeout(d,Math.min(h,3e4)));continue}let a=await l.json().catch(()=>({message:"Upload failed"}));throw new m(a.code||"UPLOAD_FAILED",a.message,l.status)}throw new m("RATE_LIMITED","Rate limited after multiple retries",429)}async deleteNote(t,e){return this.request("DELETE",`/sites/${t}/notes/${e}`)}async getImages(t){return this.request("GET",`/sites/${t}/images`)}async uploadImage(t,e,s){let i=new FormData,r=new Blob([e],{type:this.getMimeType(s)});return i.append("image",r,s),this.request("POST",`/sites/${t}/images`,i,!0)}async publish(t,e=!1){let s=e?"?force=true":"";return this.request("POST",`/sites/${t}/publish${s}`)}getMimeType(t){let e=t.split(".").pop()?.toLowerCase();return{png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",webp:"image/webp",svg:"image/svg+xml"}[e||""]||"application/octet-stream"}},m=class extends Error{code;status;constructor(t,e,s){super(e),this.code=t,this.status=s,this.name="ApiError"}};var $=require("obsidian"),w=class extends $.Modal{code;verificationUrl;api;pollInterval=null;onSuccess;onCancel;constructor(t,e,s,i,r,o){super(t),this.code=e,this.verificationUrl=s,this.api=i,this.onSuccess=r,this.onCancel=o}onOpen(){let{contentEl:t}=this;t.empty(),t.addClass("publish-device-code-modal"),t.createEl("h2",{text:"Connect Your Vault"}),t.createDiv({cls:"publish-instructions"}).createEl("p",{text:"Enter this code in your browser to connect:"}),t.createDiv({cls:"publish-code-display"}).createEl("span",{text:this.code,cls:"publish-code"});let i=t.createDiv({cls:"publish-button-container"}),r=i.createEl("button",{text:"Copy Code",cls:"mod-cta"});r.addEventListener("click",()=>{navigator.clipboard.writeText(this.code),r.textContent="Copied!",setTimeout(()=>{r.textContent="Copy Code"},2e3)}),i.createEl("button",{text:"Open in Browser"}).addEventListener("click",()=>{window.open(this.verificationUrl,"_blank")});let c=t.createDiv({cls:"publish-status"});c.createEl("p",{text:"Waiting for authorization..."}),t.createEl("button",{text:"Cancel",cls:"publish-cancel-button"}).addEventListener("click",()=>{this.close(),this.onCancel()}),this.startPolling(c),this.addStyles()}startPolling(t){this.pollInterval=setInterval(async()=>{try{let e=await this.api.pollDeviceCode(this.code);e.status==="completed"&&e.token?(this.stopPolling(),t.empty(),t.createEl("p",{text:"Connected successfully!",cls:"publish-status-success"}),setTimeout(()=>{this.close(),this.onSuccess({token:e.token,email:e.email||"",siteId:e.siteId,subdomain:e.subdomain})},1e3)):e.status==="expired"&&(this.stopPolling(),t.empty(),t.createEl("p",{text:"Code expired. Please try again.",cls:"publish-status-error"}))}catch{}},2e3)}stopPolling(){this.pollInterval&&(clearInterval(this.pollInterval),this.pollInterval=null)}onClose(){this.stopPolling();let{contentEl:t}=this;t.empty()}addStyles(){let t=document.createElement("style");t.textContent=`
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
		`,this.contentEl.appendChild(t)}};function k(n){if(!n||typeof n!="string")return"";let t=n.toLowerCase().trim(),e={\u00E4:"ae",\u00F6:"oe",\u00FC:"ue",\u00DF:"ss",\u00E0:"a",\u00E1:"a",\u00E2:"a",\u00E3:"a",\u00E5:"a",\u00E6:"ae",\u00E7:"c",\u00E8:"e",\u00E9:"e",\u00EA:"e",\u00EB:"e",\u00EC:"i",\u00ED:"i",\u00EE:"i",\u00EF:"i",\u00F1:"n",\u00F2:"o",\u00F3:"o",\u00F4:"o",\u00F5:"o",\u00F8:"o",\u00F9:"u",\u00FA:"u",\u00FB:"u",\u00FD:"y",\u00FF:"y",\u00F0:"d",\u00FE:"th"};for(let[s,i]of Object.entries(e))t=t.replace(new RegExp(s,"g"),i);return t=t.replace(/[\s_]+/g,"-"),t=t.replace(/[^a-z0-9-]/g,""),t=t.replace(/-+/g,"-"),t=t.replace(/^-+|-+$/g,""),t||"untitled"}async function N(n){let e=new TextEncoder().encode(n),s=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(s)).map(o=>o.toString(16).padStart(2,"0")).join("")}var B=new Set(["www","api","app","admin","dashboard","help","support","blog","docs","status","mail","smtp","pop","imap","ftp","cdn","assets","static","img","images","js","css","auth","login","register","signup","signin","account","billing","payment","dev","staging","test","demo","portal"]),st=/^[a-z][a-z0-9-]{1,28}[a-z0-9]$/;function U(n){return!(!n||typeof n!="string"||!st.test(n)||n.includes("--"))}function _(n){return B.has(n.toLowerCase())}var M=require("obsidian"),C=class extends M.Modal{api;serviceDomain;onSuccess;onCancel;constructor(t,e,s,i,r){super(t),this.api=e,this.serviceDomain=s,this.onSuccess=i,this.onCancel=r}onOpen(){let{contentEl:t}=this;t.empty(),t.addClass("publish-subdomain-modal"),t.createEl("h2",{text:"Choose Your Site URL"}),t.createDiv({cls:"publish-instructions"}).createEl("p",{text:"Pick a unique subdomain for your published notes:"});let s=t.createDiv({cls:"publish-subdomain-input"}),i=s.createEl("input",{type:"text",placeholder:"my-notes",cls:"publish-subdomain-field"});s.createEl("span",{text:`.${this.serviceDomain}`,cls:"publish-domain-suffix"});let r=t.createDiv({cls:"publish-url-preview"});r.createEl("span",{text:"Your site will be at: "});let o=r.createEl("span",{cls:"publish-preview-url",text:`https://your-subdomain.${this.serviceDomain}`}),c=t.createDiv({cls:"publish-feedback"}),l=t.createDiv({cls:"publish-button-container"}),a=l.createEl("button",{text:"Create Site",cls:"mod-cta"});a.disabled=!0;let u=l.createEl("button",{text:"Cancel"});i.addEventListener("input",()=>{let h=i.value.toLowerCase().trim();if(o.textContent=h?`https://${h}.${this.serviceDomain}`:`https://your-subdomain.${this.serviceDomain}`,c.empty(),a.disabled=!0,!!h){if(!U(h)){c.createEl("p",{text:"Must be 3-30 characters, start with a letter, and contain only lowercase letters, numbers, and hyphens.",cls:"publish-feedback-error"});return}if(_(h)){c.createEl("p",{text:"This subdomain is reserved.",cls:"publish-feedback-error"});return}c.createEl("p",{text:"Looks good!",cls:"publish-feedback-success"}),a.disabled=!1}}),a.addEventListener("click",async()=>{let h=i.value.toLowerCase().trim();a.disabled=!0,a.textContent="Creating...",c.empty();try{let d=await this.api.createSite(h);this.close(),this.onSuccess(d.id,d.subdomain)}catch(d){a.disabled=!1,a.textContent="Create Site",c.empty(),c.createEl("p",{text:d instanceof Error?d.message:"Failed to create site",cls:"publish-feedback-error"})}}),u.addEventListener("click",()=>{this.close(),this.onCancel()}),this.addStyles(),i.focus()}onClose(){let{contentEl:t}=this;t.empty()}addStyles(){let t=document.createElement("style");t.textContent=`
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
		`,this.contentEl.appendChild(t)}};var F=require("obsidian"),T=class extends F.Modal{statusEl=null;progressEl=null;detailsEl=null;closeButton=null;cancelled=!1;onOpen(){let{contentEl:t}=this;t.empty(),t.addClass("publish-sync-modal"),t.createEl("h2",{text:"Publishing Notes"}),this.progressEl=t.createDiv({cls:"publish-progress"}),this.progressEl.createDiv({cls:"publish-progress-bar"}),this.statusEl=t.createDiv({cls:"publish-sync-status"}),this.statusEl.createEl("p",{text:"Starting..."}),this.detailsEl=t.createDiv({cls:"publish-sync-details"});let e=t.createDiv({cls:"publish-button-container"});this.closeButton=e.createEl("button",{text:"Cancel"}),this.closeButton.addEventListener("click",()=>{this.cancelled=!0,this.close()}),this.addStyles()}setStatus(t){this.statusEl&&(this.statusEl.empty(),this.statusEl.createEl("p",{text:t}))}setProgress(t){if(this.progressEl){let e=this.progressEl.querySelector(".publish-progress-bar");e&&(e.style.width=`${t}%`)}}showSuccess(t,e){!this.statusEl||!this.detailsEl||(this.statusEl.empty(),this.statusEl.addClass("publish-status-success"),this.statusEl.createEl("p",{text:"Published successfully!"}),this.detailsEl.empty(),this.detailsEl.createEl("p",{text:`Uploaded: ${e.uploaded} | Deleted: ${e.deleted} | Unchanged: ${e.unchanged}`}),t&&this.detailsEl.createEl("a",{text:t,href:t,cls:"publish-site-link"}).addEventListener("click",i=>{i.preventDefault(),window.open(t,"_blank")}),this.closeButton&&(this.closeButton.textContent="Close"),this.setProgress(100))}showError(t){this.statusEl&&(this.statusEl.empty(),this.statusEl.addClass("publish-status-error"),this.statusEl.createEl("p",{text:"Publish failed"}),this.statusEl.createEl("p",{text:t,cls:"publish-error-message"}),this.closeButton&&(this.closeButton.textContent="Close"))}isCancelled(){return this.cancelled}onClose(){let{contentEl:t}=this;t.empty()}addStyles(){let t=document.createElement("style");t.textContent=`
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
		`,this.contentEl.appendChild(t)}};var it="https://api.pubit.site",nt="https://auth.pubit.site",O=it,ot=nt,V=`${ot}/dashboard/`,j="pubit.site",v={publishTag:"publish"};var f=require("obsidian");var S=class extends f.PluginSettingTab{plugin;constructor(t,e){super(t,e),this.plugin=e}display(){let{containerEl:t}=this;t.empty();let e=!!this.plugin.settings.apiToken;if(new f.Setting(t).setName("Connection status").setDesc(e?`Connected as ${this.plugin.settings.userEmail||"Unknown"}`:"Not connected").addButton(i=>{e?i.setButtonText("Disconnect").setWarning().onClick(async()=>{await this.plugin.disconnect(),this.display()}):i.setButtonText("Connect").setCta().onClick(async()=>{await this.plugin.startDeviceCodeFlow(),setTimeout(()=>this.display(),1e3)})}),e&&this.plugin.settings.subdomain){let r=`https://${this.plugin.settings.subdomain}.${j}`;new f.Setting(t).setName("Your site").setDesc(r).addButton(o=>o.setButtonText("Open Site").onClick(()=>{window.open(r,"_blank")})),new f.Setting(t).setName("Dashboard").setDesc("Manage your site, edit menu order, or delete your site").addButton(o=>o.setButtonText("Open Dashboard").onClick(()=>{window.open(V,"_blank")}))}let s=this.plugin.settings.publishTag||v.publishTag;new f.Setting(t).setName("Publish tag").setDesc(`Notes with "${s}: true" in frontmatter will be published`).addText(i=>i.setPlaceholder("publish").setValue(this.plugin.settings.publishTag||"").onChange(async r=>{this.plugin.settings.publishTag=r||v.publishTag,await this.plugin.saveSettings(),this.display()}))}};function at(n,t="publish"){if(!n.startsWith("---"))return!1;let e=n.indexOf(`
---`,3);if(e===-1)return!1;let s=n.slice(4,e),i=t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`^${i}:\\s*["']?true["']?\\s*$`,"im").test(s)}async function H(n,t="publish"){let e=n.vault.getMarkdownFiles(),s=[];for(let i of e){if(i.path.startsWith(".trash/")||i.path.startsWith(".obsidian/"))continue;let r=await n.vault.cachedRead(i);at(r,t)&&s.push(i)}return s}function q(n){return n.basename}function G(n){return n.path.replace(/\.md$/,"").split("/").map(i=>k(i)).join("/")}function z(n){let t=/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g,e=[],s;for(;(s=t.exec(n))!==null;){let i=s[1].trim();/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(i)&&e.push(i)}return[...new Set(e)]}function W(n,t){let e=n.vault.getFiles(),s=t.toLowerCase(),i=t.split("/").pop()||t,r=i.toLowerCase();for(let o of e)if(o.name===t||o.name===i||o.path===t)return o;for(let o of e)if(o.name.toLowerCase()===s||o.name.toLowerCase()===r)return o;for(let o of e)if(o.path.toLowerCase().endsWith(`/${r}`))return o;if(!/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(t))for(let o of["png","jpg","jpeg","gif","webp","svg"]){let l=`${i}.${o}`.toLowerCase();for(let a of e)if(a.name.toLowerCase()===l)return a}return null}async function rt(n,t,e,s,i){i?.("Checking existing images on server...");let r={};try{r=(await t.getImages(e)).images}catch(a){console.error("Failed to fetch server images:",a)}let o=new Set(Object.keys(r)),c=[],l=new Set;for(let a of s){let u=await n.vault.cachedRead(a),h=z(u);for(let d of h)l.add(d)}for(let a of l){if(o.has(a))continue;let u=W(n,a);u&&c.push({filename:a,file:u})}for(let a=0;a<c.length;a++){let{filename:u,file:h}=c[a];i?.(`Uploading image ${a+1}/${c.length}: ${u}`);try{let d=await n.vault.readBinary(h);await t.uploadImage(e,d,u)}catch(d){console.error(`[Pubit] Failed to upload image ${u}:`,d)}}}async function X(n,t,e,s,i="publish"){let r=[];try{s?.("Collecting local notes...",5);let o=await H(n,i);s?.("Fetching remote state...",10);let c=await t.getNotes(e),l=new Map(c.map(p=>[p.slug,p.contentHash]));s?.("Syncing images...",15),await rt(n,t,e,o,p=>s?.(p,20)),s?.("Computing changes...",25);let a=[],u=[],h=new Set,d=0;for(let p of o){let g=G(p),b=q(p),y=await n.vault.cachedRead(p),x=await N(y);h.add(g);let L=l.get(g);!L||L!==x?a.push({slug:g,title:b,content:y}):d++}for(let[p]of l)h.has(p)||u.push(p);let R=0;if(a.length>0){let p=a.length;for(let g=0;g<a.length;g++){let b=a[g],y=30+g/p*40;s?.(`Uploading ${g+1}/${p}: ${b.slug.split("/").pop()}...`,y);try{await t.uploadNote(e,b.slug,b.title,b.content),R++}catch(x){r.push(`Upload failed: ${b.slug} - ${x instanceof Error?x.message:"Unknown"}`)}}}let A=0;if(u.length>0){s?.(`Deleting ${u.length} orphaned notes...`,75);for(let p of u)try{await t.deleteNote(e,p),A++}catch(g){r.push(`Delete failed: ${p} - ${g instanceof Error?g.message:"Unknown"}`)}}if(R>0||A>0){s?.("Publishing...",85);let p=await t.publish(e);return{success:r.length===0,uploaded:R,deleted:A,unchanged:d,errors:r,siteUrl:p.url}}s?.("Publishing...",90);let Y=await t.publish(e);return{success:!0,uploaded:0,deleted:0,unchanged:o.length,errors:[],siteUrl:Y.url}}catch(o){return{success:!1,uploaded:0,deleted:0,unchanged:0,errors:[o instanceof Error?o.message:"Unknown error"]}}}var D=class extends I.Plugin{settings=v;api=null;statusBarItem=null;settingsTab=null;ribbonIcon=null;hasPendingChanges=!1;styleEl=null;async onload(){await this.loadSettings(),this.api=new E(O,this.settings.apiToken),this.registerStyles(),this.ribbonIcon=this.addRibbonIcon("upload-cloud","Publish notes",async()=>{await this.publish()}),this.registerEvent(this.app.vault.on("modify",()=>this.markPendingChanges())),this.registerEvent(this.app.vault.on("create",()=>this.markPendingChanges())),this.registerEvent(this.app.vault.on("delete",()=>this.markPendingChanges())),this.registerEvent(this.app.vault.on("rename",()=>this.markPendingChanges())),this.addCommand({id:"publish-sync",name:"Sync and publish",callback:async()=>{await this.publish()}}),this.addCommand({id:"publish-connect",name:"Connect vault",callback:async()=>{await this.startDeviceCodeFlow()}}),this.addCommand({id:"publish-disconnect",name:"Disconnect vault",callback:async()=>{await this.disconnect()}}),this.settingsTab=new S(this.app,this),this.addSettingTab(this.settingsTab),this.statusBarItem=this.addStatusBarItem(),this.updateStatusBar()}async loadSettings(){this.settings=Object.assign({},v,await this.loadData())}async saveSettings(){await this.saveData(this.settings),this.api&&(this.api=new E(O,this.settings.apiToken)),this.updateStatusBar()}showNotice(t){new I.Notice(t)}updateStatusBar(){this.statusBarItem&&(this.settings.apiToken?this.hasPendingChanges?(this.statusBarItem.setText("Publish: Changes pending"),this.statusBarItem.setAttribute("aria-label","Click ribbon icon to sync")):(this.statusBarItem.setText("Publish: Up to date"),this.statusBarItem.setAttribute("aria-label","All synced")):(this.statusBarItem.setText("Publish: Not connected"),this.statusBarItem.setAttribute("aria-label","Click to connect")))}markPendingChanges(){this.settings.apiToken&&(this.hasPendingChanges||(this.hasPendingChanges=!0,this.updatePendingIndicator(),this.updateStatusBar()))}clearPendingChanges(){this.hasPendingChanges=!1,this.updatePendingIndicator(),this.updateStatusBar()}updatePendingIndicator(){this.ribbonIcon&&(this.hasPendingChanges?(this.ribbonIcon.addClass("has-pending-changes"),this.ribbonIcon.setAttribute("aria-label","Publish notes (changes pending)")):(this.ribbonIcon.removeClass("has-pending-changes"),this.ribbonIcon.setAttribute("aria-label","Publish notes")))}registerStyles(){this.styleEl=document.createElement("style"),this.styleEl.id="publish-plugin-styles",this.styleEl.textContent=`
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
		`,document.head.appendChild(this.styleEl)}onunload(){this.styleEl&&this.styleEl.remove()}async startDeviceCodeFlow(){if(!this.api){this.showNotice("Plugin not initialized");return}try{let t=await this.api.getDeviceCode();new w(this.app,t.code,t.verificationUrl,this.api,async s=>{this.settings.apiToken=s.token,this.settings.userEmail=s.email,this.settings.siteId=s.siteId,this.settings.subdomain=s.subdomain,await this.saveSettings(),this.api?.setToken(s.token),this.settingsTab?.display();let i=s.subdomain?` Your site: ${s.subdomain}.pubit.site`:"";this.showNotice(`Successfully connected!${i}`)},()=>{}).open()}catch(t){this.showNotice(`Failed to start connection: ${t instanceof Error?t.message:"Unknown error"}`)}}async disconnect(){if(!this.api||!this.settings.apiToken){this.showNotice("Not connected");return}let t=this.settings.subdomain;try{await this.api.revokeToken()}catch{}this.settings.apiToken=void 0,this.settings.siteId=void 0,this.settings.userEmail=void 0,this.settings.subdomain=void 0,await this.saveSettings(),t?this.showNotice(`Disconnected. Your site remains online at ${t}.pubit.site. To delete it, visit the dashboard.`):this.showNotice("Disconnected")}async publish(){if(!this.api){this.showNotice("Plugin not initialized");return}if(!this.settings.apiToken){this.showNotice("Please connect your vault first"),await this.startDeviceCodeFlow();return}if(!this.settings.siteId){this.showNotice("No site configured. Please disconnect and reconnect.");return}let t=new T(this.app);t.open();try{let e=await X(this.app,this.api,this.settings.siteId,(s,i)=>{t.setStatus(s),i!==void 0&&t.setProgress(i)},this.settings.publishTag||"publish");e.success?(t.showSuccess(e.siteUrl||"",{uploaded:e.uploaded,deleted:e.deleted,unchanged:e.unchanged}),this.clearPendingChanges()):t.showError(e.errors.join(`
`))}catch(e){t.showError(e instanceof Error?e.message:"Unknown error")}}async createSite(){if(this.api)return new Promise(t=>{new C(this.app,this.api,"pubit.site",async(s,i)=>{this.settings.siteId=s,this.settings.subdomain=i,await this.saveSettings(),this.showNotice(`Site created: ${i}.pubit.site`),t()},()=>{t()}).open()})}async changeSubdomain(){if(!this.api){this.showNotice("Plugin not initialized");return}if(!this.settings.apiToken){this.showNotice("Please connect your vault first");return}this.showNotice("Subdomain change coming soon! For now, disconnect and reconnect to get a new subdomain.")}};
