(()=>{"use strict";var e={961:(e,t,a)=>{a.r(t);var r=a(871),n=a(555);a.p;var o=a(497),s=a(423);const l=({onFormSwitch:e,onLoginSuccess:t})=>{const[a,n]=(0,r.useState)(""),[l,i]=(0,r.useState)("");return(0,s.jsxs)("div",{className:"auth-form-container",children:[(0,s.jsx)("h2",{children:"Login"}),(0,s.jsxs)("form",{className:"login-form",onSubmit:e=>{e.preventDefault(),o.default.post("http://localhost:3005/api/user/validatePassword",{email:a,pass:l}).then((e=>{e.data.validation?(alert("Your password is correct, Thank you!"),t()):alert("Your password is not correct, Please try again")}))},children:[(0,s.jsx)("label",{htmlfor:"email",children:" Email "}),(0,s.jsx)("input",{value:a,onChange:e=>n(e.target.value),type:"email",placeholder:"youremail@gmail.com",id:"email",name:"email"}),(0,s.jsx)("label",{htmlfor:"password",children:" Password "}),(0,s.jsx)("input",{value:l,onChange:e=>i(e.target.value),type:"password",placeholder:"*********",id:"password",name:"password"}),(0,s.jsx)("button",{type:"submit",children:"Log In"})]}),(0,s.jsx)("button",{className:"link-btn",onClick:()=>e("register"),children:"Don't have an account? Register here."})]})},i=e=>{const[t,a]=(0,r.useState)(""),[n,l]=(0,r.useState)(""),[i,c]=(0,r.useState)("");return(0,s.jsxs)("div",{className:"auth-form-container",children:[(0,s.jsx)("h2",{children:"Register"}),(0,s.jsxs)("form",{className:"register-form",onSubmit:e=>{e.preventDefault(),console.log(t),o.default.post("http://localhost:3005/api/user/registerUser",{name:i,email:t,pass:n}).then((e=>{e.data.validation?alert("Successful"):alert("Please try again")}))},children:[(0,s.jsx)("label",{htmlFor:"name",children:"Full name"}),(0,s.jsx)("input",{value:i,onChange:e=>c(e.target.value),name:"name",id:"name",placeholder:"Full Name"}),(0,s.jsx)("label",{htmlfor:"email",children:" Email "}),(0,s.jsx)("input",{value:t,onChange:e=>a(e.target.value),type:"email",placeholder:"youremail@gmail.com",id:"email",name:"email"}),(0,s.jsx)("label",{htmlfor:"password",children:" Password "}),(0,s.jsx)("input",{value:n,onChange:e=>l(e.target.value),type:"password",placeholder:"*********",id:"password",name:"password"}),(0,s.jsx)("button",{type:"submit",children:"Submit"})]}),(0,s.jsx)("button",{className:"link-btn",onClick:()=>e.onFormSwitch("login"),children:"Already have an account? Login here."})]})},c=({handleLogout:e})=>(0,s.jsxs)("div",{className:"title-bar",children:[(0,s.jsx)("h1",{children:"OfficebuddyAI"}),(0,s.jsx)("button",{onClick:e,className:"logout-button",children:"Logout"})]});var d="";const u=(e,t="")=>Object.entries(e).map((([e,a])=>((e,a)=>"object"!==typeof a||null===a||Array.isArray(a)?Array.isArray(a)?`${t}${e}: [\n${a.map((e=>u(e,t+"  "))).join(",\n")}\n${t}]`:`${t}${e}: ${a}`:`${t}${e}: {\n${u(a,t+"  ")}\n${t}}`)(e,a))).join("\n"+t),h=({handleLogout:e})=>{const[t,a]=(0,r.useState)([]),[n,l]=(0,r.useState)(""),[i,h]=(0,r.useState)(""),[m,p]=(0,r.useState)(""),b=async e=>{try{await o.default.post("http://localhost:3005/api/vectordb/feedback",{userInput:d,sqlStatement:i,feedback:e,embedding:m}).then((e=>{alert(e.data.message)}))}catch(t){console.error("Error:",t),alert("Failed to record feedback.")}};return(0,s.jsxs)("div",{className:"chat-container",children:[(0,s.jsx)("h6",{children:(0,s.jsx)(c,{handleLogout:e})}),(0,s.jsx)("div",{className:"chat-history",children:t.map(((e,t)=>"feedback"===e.from?(0,s.jsxs)("div",{children:[(0,s.jsx)("br",{}),(0,s.jsx)("p",{className:"message bot",children:e.text}),(0,s.jsx)("button",{className:"feedback-button",onClick:()=>b("YES"),children:"Yes"}),(0,s.jsx)("button",{className:"feedback-button",onClick:()=>b("NO"),children:"No"}),(0,s.jsx)("br",{}),(0,s.jsx)("br",{}),(0,s.jsx)("hr",{})]},t):(0,s.jsxs)("div",{children:[(0,s.jsx)("br",{}),(0,s.jsx)("p",{className:`message ${e.from}`,children:e.text},t),")",(0,s.jsx)("hr",{})]})))}),(0,s.jsxs)("div",{className:"input-button-container",children:[(0,s.jsx)("input",{className:"input-area",type:"text",value:n,onChange:e=>{l(e.target.value)},placeholder:"Type a message..."}),(0,s.jsx)("button",{className:"chat-button",onClick:()=>{const e=[...t,{text:n,from:"user"}];a(e),d=n,l(""),o.default.post("http://localhost:3005/api/vectordb/get_data",{input:n}).then((t=>{const r={text:t.data.bot.map((e=>u(e))).join("\n\n"),from:"bot"};h(t.data.sql),p(t.data.embedding),a([...e,r,{text:"Was the data displayed correctly?",from:"feedback"}])})).catch((e=>{console.error("Error",e),alert("Sorry, can you try again?")}))},children:"Send"})]})]})};const m=function(){const[e,t]=(0,r.useState)("login"),[a,n]=(0,r.useState)(!1),o=e=>{t(e)};return(0,s.jsx)("div",{className:"App",children:a?(0,s.jsx)(h,{handleLogout:()=>{n(!1)}}):"login"===e?(0,s.jsx)(l,{onFormSwitch:o,onLoginSuccess:()=>{n(!0)}}):(0,s.jsx)(i,{onFormSwitch:o})})},p=e=>{e&&e instanceof Function&&a.e(897).then(a.bind(a,897)).then((({getCLS:t,getFID:a,getFCP:r,getLCP:n,getTTFB:o})=>{t(e),a(e),r(e),n(e),o(e)}))};n.createRoot(document.getElementById("root")).render((0,s.jsx)(r.StrictMode,{children:(0,s.jsx)(m,{})})),p()}},t={};function a(r){var n=t[r];if(void 0!==n)return n.exports;var o=t[r]={exports:{}};return e[r](o,o.exports,a),o.exports}a.m=e,(()=>{var e=[];a.O=(t,r,n,o)=>{if(!r){var s=1/0;for(d=0;d<e.length;d++){for(var[r,n,o]=e[d],l=!0,i=0;i<r.length;i++)(!1&o||s>=o)&&Object.keys(a.O).every((e=>a.O[e](r[i])))?r.splice(i--,1):(l=!1,o<s&&(s=o));if(l){e.splice(d--,1);var c=n();void 0!==c&&(t=c)}}return t}o=o||0;for(var d=e.length;d>0&&e[d-1][2]>o;d--)e[d]=e[d-1];e[d]=[r,n,o]}})(),a.d=(e,t)=>{for(var r in t)a.o(t,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},a.f={},a.e=e=>Promise.all(Object.keys(a.f).reduce(((t,r)=>(a.f[r](e,t),t)),[])),a.u=e=>"static/js/"+e+".76fc402a.chunk.js",a.miniCssF=e=>{},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={},t="web:";a.l=(r,n,o,s)=>{if(e[r])e[r].push(n);else{var l,i;if(void 0!==o)for(var c=document.getElementsByTagName("script"),d=0;d<c.length;d++){var u=c[d];if(u.getAttribute("src")==r||u.getAttribute("data-webpack")==t+o){l=u;break}}l||(i=!0,(l=document.createElement("script")).charset="utf-8",l.timeout=120,a.nc&&l.setAttribute("nonce",a.nc),l.setAttribute("data-webpack",t+o),l.src=r),e[r]=[n];var h=(t,a)=>{l.onerror=l.onload=null,clearTimeout(m);var n=e[r];if(delete e[r],l.parentNode&&l.parentNode.removeChild(l),n&&n.forEach((e=>e(a))),t)return t(a)},m=setTimeout(h.bind(null,void 0,{type:"timeout",target:l}),12e4);l.onerror=h.bind(null,l.onerror),l.onload=h.bind(null,l.onload),i&&document.head.appendChild(l)}}})(),a.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.p="/",(()=>{var e={792:0};a.f.j=(t,r)=>{var n=a.o(e,t)?e[t]:void 0;if(0!==n)if(n)r.push(n[2]);else{var o=new Promise(((a,r)=>n=e[t]=[a,r]));r.push(n[2]=o);var s=a.p+a.u(t),l=new Error;a.l(s,(r=>{if(a.o(e,t)&&(0!==(n=e[t])&&(e[t]=void 0),n)){var o=r&&("load"===r.type?"missing":r.type),s=r&&r.target&&r.target.src;l.message="Loading chunk "+t+" failed.\n("+o+": "+s+")",l.name="ChunkLoadError",l.type=o,l.request=s,n[1](l)}}),"chunk-"+t,t)}},a.O.j=t=>0===e[t];var t=(t,r)=>{var n,o,[s,l,i]=r,c=0;if(s.some((t=>0!==e[t]))){for(n in l)a.o(l,n)&&(a.m[n]=l[n]);if(i)var d=i(a)}for(t&&t(r);c<s.length;c++)o=s[c],a.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return a.O(d)},r=self.webpackChunkweb=self.webpackChunkweb||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var r=a.O(void 0,[661],(()=>a(961)));r=a.O(r)})();
//# sourceMappingURL=main.9452cfe9.js.map