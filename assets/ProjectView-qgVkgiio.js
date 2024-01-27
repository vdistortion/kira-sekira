import{d as K,e as q,n as ue,f as Se,g as Ce,h as Q,t as Ge,o as k,i as L,F as ee,j as fe,k as he,u as Je,l as Qe,b as e9,m as t9,p as ae,q as O,s as o,v as ie,x as o9,y as l9,z as n9,_ as oe,a as te,c as Me,w as De,A as de,r as N,B as a9,T as i9}from"./index-HL3yhdSE.js";function r9({columns:e,columnWidth:r,emit:n,gap:s,items:b,maxColumns:p,minColumns:w,nextTick:u,onBeforeUnmount:$,onMounted:a,rtl:i,scrollContainer:v,ssrColumns:B,vue:j,wall:Y,watch:G}){function J(m,c,h,M){const D=E(h);return M+c+D<=m?J(m,c,h+1,M+c+D):h}function E(m){const c=Array.isArray(r.value)?r.value:[r.value];return c[m%c.length]}function F(){const m=J(Y.value.getBoundingClientRect().width,s.value,0,-s.value),c=X(P(m));return c>0?c:1}function P(m){const c=p==null?void 0:p.value;return c&&m>c?c:m}function X(m){const c=w==null?void 0:w.value;return c&&m<c?c:m}function T(m){return Array.from({length:m}).map(()=>[])}if(B.value>0){const m=T(B.value);b.value.forEach((c,h)=>m[h%B.value].push(h)),e.value=m}async function W(m){if(m>=b.value.length)return;await u();const c=[...Y.value.children];i.value&&c.reverse();const h=c.reduce((M,D)=>D.getBoundingClientRect().height<M.getBoundingClientRect().height?D:M);e.value[+h.dataset.index].push(m),await W(m+1)}async function S(m=!1){if(e.value.length===F()&&!m){n(j===2?"redraw-skip":"redrawSkip");return}e.value=T(F());const c=v==null?void 0:v.value,h=c?c.scrollTop:window.scrollY;await W(0),c?c.scrollBy({top:h-c.scrollTop}):window.scrollTo({top:h}),n("redraw")}const C=typeof ResizeObserver>"u"?void 0:new ResizeObserver(()=>S());return a(()=>{S(),C==null||C.observe(Y.value)}),$(()=>C==null?void 0:C.unobserve(Y.value)),G([b,i],()=>S(!0)),G([r,s,w,p],()=>S()),{getColumnWidthTarget:E}}const s9=["data-index"],c9=K({__name:"masonry-wall",props:{columnWidth:{default:400},items:{},gap:{default:0},rtl:{type:Boolean,default:!1},ssrColumns:{default:0},scrollContainer:{default:null},minColumns:{default:1},maxColumns:{default:void 0},keyMapper:{default:void 0}},emits:["redraw","redrawSkip"],setup(e,{emit:r}){const n=e,s=r,b=q([]),p=q(),{getColumnWidthTarget:w}=r9({columns:b,emit:s,nextTick:ue,onBeforeUnmount:Se,onMounted:Ce,vue:3,wall:p,watch:Q,...Ge(n)});return(u,$)=>(k(),L("div",{ref_key:"wall",ref:p,class:"masonry-wall",style:he({display:"flex",gap:`${u.gap}px`})},[(k(!0),L(ee,null,fe(b.value,(a,i)=>(k(),L("div",{key:i,class:"masonry-column","data-index":i,style:he({display:"flex","flex-basis":`${Je(w)(i)}px`,"flex-direction":"column","flex-grow":1,gap:`${u.gap}px`,height:["-webkit-max-content","-moz-max-content","max-content"],"min-width":0})},[(k(!0),L(ee,null,fe(a,(v,B)=>{var j;return k(),L("div",{key:((j=u.keyMapper)==null?void 0:j.call(u,u.items[v],i,B,v))??v,class:"masonry-item"},[Qe(u.$slots,"default",{item:u.items[v],column:i,row:B,index:v},()=>[e9(t9(u.items[v]),1)])])}),128))],12,s9))),128))],4))}}),u9=(()=>{const e=c9;return e.install=r=>{r.component("MasonryWall",e)},e})();function V(e,r){r===void 0&&(r={});var n=r.insertAt;if(e&&typeof document<"u"){var s=document.head||document.getElementsByTagName("head")[0],b=document.createElement("style");b.type="text/css",n==="top"&&s.firstChild?s.insertBefore(b,s.firstChild):s.appendChild(b),b.styleSheet?b.styleSheet.cssText=e:b.appendChild(document.createTextNode(e))}}V(".vel-fade-enter-active,.vel-fade-leave-active{-webkit-transition:all .3s ease;transition:all .3s ease}.vel-fade-enter-from,.vel-fade-leave-to{opacity:0}.vel-img-swiper{display:block;position:relative}.vel-modal{background:rgba(0,0,0,.5);bottom:0;left:0;margin:0;position:fixed;right:0;top:0;z-index:9998}.vel-img-wrapper{left:50%;margin:0;position:absolute;top:50%;-webkit-transform:translate(-50% -50%);transform:translate(-50% -50%);-webkit-transition:.3s linear;transition:.3s linear;will-change:transform opacity}.vel-img,.vel-img-wrapper{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.vel-img{background-color:rgba(0,0,0,.7);-webkit-box-shadow:0 5px 20px 2px rgba(0,0,0,.7);box-shadow:0 5px 20px 2px rgba(0,0,0,.7);display:block;max-height:80vh;max-width:80vw;position:relative;-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}@media (max-width:750px){.vel-img{max-height:95vh;max-width:85vw}}.vel-btns-wrapper{position:static}.vel-btns-wrapper .btn__close,.vel-btns-wrapper .btn__next,.vel-btns-wrapper .btn__prev{-webkit-tap-highlight-color:transparent;color:#fff;cursor:pointer;font-size:32px;opacity:.6;outline:none;position:absolute;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);-webkit-transition:.15s linear;transition:.15s linear;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.vel-btns-wrapper .btn__close:hover,.vel-btns-wrapper .btn__next:hover,.vel-btns-wrapper .btn__prev:hover{opacity:1}.vel-btns-wrapper .btn__close.disable,.vel-btns-wrapper .btn__close.disable:hover,.vel-btns-wrapper .btn__next.disable,.vel-btns-wrapper .btn__next.disable:hover,.vel-btns-wrapper .btn__prev.disable,.vel-btns-wrapper .btn__prev.disable:hover{cursor:default;opacity:.2}.vel-btns-wrapper .btn__next{right:12px}.vel-btns-wrapper .btn__prev{left:12px}.vel-btns-wrapper .btn__close{right:10px;top:24px}@media (max-width:750px){.vel-btns-wrapper .btn__next,.vel-btns-wrapper .btn__prev{font-size:20px}.vel-btns-wrapper .btn__close{font-size:24px}.vel-btns-wrapper .btn__next{right:4px}.vel-btns-wrapper .btn__prev{left:4px}}.vel-modal.is-rtl .vel-btns-wrapper .btn__next{left:12px;right:auto}.vel-modal.is-rtl .vel-btns-wrapper .btn__prev{left:auto;right:12px}@media (max-width:750px){.vel-modal.is-rtl .vel-btns-wrapper .btn__next{left:4px;right:auto}.vel-modal.is-rtl .vel-btns-wrapper .btn__prev{left:auto;right:4px}}.vel-modal.is-rtl .vel-img-title{direction:rtl}");V('.vel-loading{left:50%;position:absolute;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.vel-loading .ring{display:inline-block;height:64px;width:64px}.vel-loading .ring:after{-webkit-animation:ring 1.2s linear infinite;animation:ring 1.2s linear infinite;border-color:hsla(0,0%,100%,.7) transparent;border-radius:50%;border-style:solid;border-width:5px;content:" ";display:block;height:46px;margin:1px;width:46px}@-webkit-keyframes ring{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes ring{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}');V(".vel-on-error{left:50%;position:absolute;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.vel-on-error .icon{color:#aaa;font-size:80px}");V(".vel-img-title{bottom:60px;color:#ccc;cursor:default;font-size:12px;left:50%;line-height:1;max-width:80%;opacity:.8;overflow:hidden;position:absolute;text-align:center;text-overflow:ellipsis;-webkit-transform:translate(-50%);transform:translate(-50%);-webkit-transition:opacity .15s;transition:opacity .15s;white-space:nowrap}.vel-img-title:hover{opacity:1}");V(".vel-icon{fill:currentColor;height:1em;overflow:hidden;vertical-align:-.15em;width:1em}");V(".vel-toolbar{border-radius:4px;bottom:8px;display:-webkit-box;display:-ms-flexbox;display:flex;left:50%;opacity:.9;overflow:hidden;padding:0;position:absolute;-webkit-transform:translate(-50%);transform:translate(-50%)}.vel-toolbar,.vel-toolbar .toolbar-btn{background-color:#2d2d2d;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.vel-toolbar .toolbar-btn{-ms-flex-negative:0;-webkit-tap-highlight-color:transparent;color:#fff;cursor:pointer;flex-shrink:0;font-size:20px;outline:none;padding:6px 10px}.vel-toolbar .toolbar-btn:active,.vel-toolbar .toolbar-btn:hover{background-color:#3d3d3d}");const _="vel",z=K({name:"SvgIcon",props:{type:{type:String,default:""}},setup:e=>()=>o("svg",{class:`${_}-icon icon`,"aria-hidden":"true"},[o("use",{"xlink:href":`#icon-${e.type}`},null)])}),le=typeof window<"u",I=()=>{};let Le=!1;if(le)try{const e={};Object.defineProperty(e,"passive",{get(){Le=!0}}),window.addEventListener("test-passive",I,e)}catch{}const we=function(e,r,n){let s=arguments.length>3&&arguments[3]!==void 0&&arguments[3];le&&e.addEventListener(r,n,!!Le&&{capture:!1,passive:s})},xe=(e,r,n)=>{le&&e.removeEventListener(r,n)},d9=e=>{e.preventDefault()},p9=Object.prototype.toString,pe=e=>r=>p9.call(r).slice(8,-1)===e,m9=e=>!!e&&pe("Object")(e),ye=e=>!!e&&pe("String")(e);function v9(e){return e!=null}const b9=K({name:"Toolbar",props:{zoomIn:{type:Function,default:I},zoomOut:{type:Function,default:I},rotateLeft:{type:Function,default:I},rotateRight:{type:Function,default:I},resize:{type:Function,default:I},rotateDisabled:{type:Boolean,default:!1},zoomDisabled:{type:Boolean,default:!1}},setup:e=>()=>o("div",{class:`${_}-toolbar`},[!e.zoomDisabled&&o(ee,null,[o("div",{role:"button","aria-label":"zoom in button",class:"toolbar-btn toolbar-btn__zoomin",onClick:e.zoomIn},[o(z,{type:"zoomin"},null)]),o("div",{role:"button","aria-label":"zoom out button",class:"toolbar-btn toolbar-btn__zoomout",onClick:e.zoomOut},[o(z,{type:"zoomout"},null)])]),o("div",{role:"button","aria-label":"resize image button",class:"toolbar-btn toolbar-btn__resize",onClick:e.resize},[o(z,{type:"resize"},null)]),!e.rotateDisabled&&o(ee,null,[o("div",{role:"button","aria-label":"image rotate left button",class:"toolbar-btn toolbar-btn__rotate",onClick:e.rotateLeft},[o(z,{type:"rotate-left"},null)]),o("div",{role:"button","aria-label":"image rotate right button",class:"toolbar-btn toolbar-btn__rotate",onClick:e.rotateRight},[o(z,{type:"rotate-right"},null)])])])}),g9=()=>o("div",{class:`${_}-loading`},[o("div",{class:"ring"},null)]),f9=()=>o("div",{class:`${_}-on-error`},[o("div",{class:"ring"},null),o(z,{type:"img-broken"},null)]),h9=(e,r)=>{let{slots:n}=r;return o("div",{class:`${_}-img-title`},[n.default?n.default():""])},w9=K({name:"DefaultIcons",setup:()=>()=>o("svg",{"aria-hidden":!0,style:"position: absolute; width: 0; height: 0; overflow: hidden; visibility: hidden;"},[o("symbol",{id:"icon-rotate-right",viewBox:"0 0 1024 1024"},[o("path",{d:"M275.199914 450.496179v20.031994c0.384-38.079988 12.543996-67.423979 36.479989-87.967973 22.431993-20.351994 49.215985-30.55999 80.319975-30.55999 32.06399 0 59.295981 10.175997 81.759974 30.55999 22.815993 20.543994 34.591989 49.887984 35.359989 87.967973v123.935961c-0.768 37.887988-12.543996 67.135979-35.359989 87.679973-22.431993 20.351994-49.695984 30.75199-81.759974 31.10399a120.255962 120.255962 0 0 1-72.991978-24.895992c-21.503993-15.839995-35.359989-38.751988-41.567987-68.735979h60.831981c9.247997 23.007993 27.167992 34.495989 53.759983 34.49599 37.535988-0.384 56.863982-21.407993 57.983982-63.071981v-38.751988c-28.095991 8.863997-54.303983 13.119996-78.623975 12.735996a91.263971 91.263971 0 0 1-68.447979-27.711991c-18.847994-18.303994-28.095991-47.231985-27.711991-86.847973z m62.55998 24.863992c7.103998 24.799992 25.215992 37.343988 54.271983 37.663989 27.103992-0.288 44.703986-11.327996 52.831984-33.11999 3.135999-8.383997 2.655999-29.599991-1.28-38.559988-8.607997-19.615994-25.791992-29.695991-51.551984-30.20799-28.383991 0.576-46.303986 12.639996-53.759983 36.159988a58.719982 58.719982 0 0 0-0.512 28.063991z m390.335878 115.711964v-116.895963c-1.12-41.311987-20.447994-62.335981-57.983981-63.07198-37.727988 0.768-56.959982 21.791993-57.695982 63.07198v116.895963c0.768 41.663987 19.999994 62.68798 57.695982 63.071981 37.535988-0.384 56.863982-21.407993 57.983981-63.071981z m-174.815945 3.391999v-123.935961c0.384-38.079988 12.543996-67.423979 36.479989-87.967973 22.431993-20.351994 49.215985-30.55999 80.319975-30.55999 32.06399 0 59.295981 10.175997 81.759974 30.55999 22.815993 20.543994 34.591989 49.887984 35.359989 87.967973v123.935961c-0.768 37.887988-12.543996 67.135979-35.359989 87.679973-22.431993 20.351994-49.695984 30.75199-81.759974 31.10399-31.10399-0.384-57.887982-10.751997-80.319975-31.10399-23.935993-20.543994-36.127989-49.791984-36.479989-87.679973z m282.559912-479.07185A509.887841 509.887841 0 0 0 511.99984 0.00032C229.215928 0.00032 0 229.216248 0 512.00016s229.215928 511.99984 511.99984 511.99984 511.99984-229.215928 511.99984-511.99984c0-3.743999-0.032-7.455998-0.128-11.167997-1.631999-11.295996-8.159997-27.103992-31.87199-27.103991-27.487991 0-31.67999 21.247993-32.03199 32.06399l0.032 4.127999a30.62399 30.62399 0 0 0 0.16 2.079999H959.9997c0 247.423923-200.575937 447.99986-447.99986 447.99986S63.99998 759.424083 63.99998 512.00016 264.575917 64.0003 511.99984 64.0003a446.079861 446.079861 0 0 1 277.439913 96.22397l-94.91197 91.679971c-25.439992 24.607992-17.439995 44.991986 17.887994 45.599986l188.031942 3.295999a64.31998 64.31998 0 0 0 65.055979-62.84798l3.295999-188.127942C969.407697 15.040315 949.311703 5.792318 923.871711 30.368311l-87.999972 85.023973z",fill:""},null)]),o("symbol",{id:"icon-rotate-left",viewBox:"0 0 1024 1024"},[o("path",{d:"M275.199914 450.496179v20.031994c0.384-38.079988 12.543996-67.423979 36.479989-87.967973 22.431993-20.351994 49.215985-30.55999 80.319975-30.55999 32.06399 0 59.295981 10.175997 81.759974 30.55999 22.815993 20.543994 34.591989 49.887984 35.359989 87.967973v123.935961c-0.768 37.887988-12.543996 67.135979-35.359989 87.679973-22.431993 20.351994-49.695984 30.75199-81.759974 31.10399a120.255962 120.255962 0 0 1-72.991978-24.895992c-21.503993-15.839995-35.359989-38.751988-41.567987-68.735979h60.831981c9.247997 23.007993 27.167992 34.495989 53.759983 34.49599 37.535988-0.384 56.863982-21.407993 57.983982-63.071981v-38.751988c-28.095991 8.863997-54.303983 13.119996-78.623975 12.735996a91.263971 91.263971 0 0 1-68.447979-27.711991c-18.847994-18.303994-28.095991-47.231985-27.711991-86.847973z m62.55998 24.863992c7.103998 24.799992 25.215992 37.343988 54.271983 37.663989 27.103992-0.288 44.703986-11.327996 52.831984-33.11999 3.135999-8.383997 2.655999-29.599991-1.28-38.559988-8.607997-19.615994-25.791992-29.695991-51.551984-30.20799-28.383991 0.576-46.303986 12.639996-53.759983 36.159988a58.719982 58.719982 0 0 0-0.512 28.063991z m390.335878 115.711964v-116.895963c-1.12-41.311987-20.447994-62.335981-57.983981-63.07198-37.727988 0.768-56.959982 21.791993-57.695982 63.07198v116.895963c0.768 41.663987 19.999994 62.68798 57.695982 63.071981 37.535988-0.384 56.863982-21.407993 57.983981-63.071981z m-174.815945 3.391999v-123.935961c0.384-38.079988 12.543996-67.423979 36.479989-87.967973 22.431993-20.351994 49.215985-30.55999 80.319975-30.55999 32.06399 0 59.295981 10.175997 81.759974 30.55999 22.815993 20.543994 34.591989 49.887984 35.359989 87.967973v123.935961c-0.768 37.887988-12.543996 67.135979-35.359989 87.679973-22.431993 20.351994-49.695984 30.75199-81.759974 31.10399-31.10399-0.384-57.887982-10.751997-80.319975-31.10399-23.935993-20.543994-36.127989-49.791984-36.479989-87.679973zM188.159941 115.392284A509.887841 509.887841 0 0 1 511.99984 0.00032c282.783912 0 511.99984 229.215928 511.99984 511.99984s-229.215928 511.99984-511.99984 511.99984S0 794.784072 0 512.00016c0-3.743999 0.032-7.455998 0.128-11.167997 1.631999-11.295996 8.159997-27.103992 31.87199-27.103991 27.487991 0 31.67999 21.247993 32.03199 32.06399L63.99998 509.920161a30.62399 30.62399 0 0 1-0.16 2.079999H63.99998c0 247.423923 200.575937 447.99986 447.99986 447.99986s447.99986-200.575937 447.99986-447.99986S759.423763 64.0003 511.99984 64.0003a446.079861 446.079861 0 0 0-277.439913 96.22397l94.91197 91.679971c25.439992 24.607992 17.439995 44.991986-17.887994 45.599986L123.551961 300.800226a64.31998 64.31998 0 0 1-65.055979-62.84798l-3.295999-188.127942C54.591983 15.040315 74.687977 5.792318 100.127969 30.368311l87.999972 85.023973z",fill:""},null)]),o("symbol",{id:"icon-resize",viewBox:"0 0 1024 1024"},[o("path",{d:"M456.036919 791.8108 270.553461 791.8108 460.818829 601.572038l-39.593763-39.567157L231.314785 751.915162l0.873903-183.953615c0-15.465227-12.515035-27.981285-27.981285-27.981285s-27.981285 12.515035-27.981285 27.981285l0 251.829516c0 8.3072 3.415796 14.975063 8.826016 19.564591 5.082762 5.192256 12.132318 8.416693 19.947308 8.416693l251.036453 0c15.46625 0 27.981285-12.514012 27.981285-27.981285C484.018204 804.325835 471.504192 791.8108 456.036919 791.8108zM838.945819 184.644347c-5.082762-5.191232-12.132318-8.416693-19.947308-8.416693L567.961034 176.227654c-15.46625 0-27.981285 12.515035-27.981285 27.981285 0 15.46625 12.514012 27.981285 27.981285 27.981285l185.483458 0L563.206754 422.427962l39.567157 39.567157 189.910281-189.910281-0.873903 183.953615c0 15.46625 12.514012 27.981285 27.981285 27.981285s27.981285-12.514012 27.981285-27.981285L847.772858 204.208938C847.771835 195.902762 844.356039 189.234899 838.945819 184.644347zM847.771835 64.303538 176.227142 64.303538c-61.809741 0-111.924115 50.115398-111.924115 111.924115l0 671.544693c0 61.809741 50.114374 111.924115 111.924115 111.924115l671.544693 0c61.809741 0 111.924115-50.114374 111.924115-111.924115l0-671.544693C959.69595 114.418936 909.581576 64.303538 847.771835 64.303538zM903.733381 847.772346c0 30.878265-25.056676 55.962569-55.962569 55.962569L176.227142 903.734916c-30.90487 0-55.962569-25.084305-55.962569-55.962569l0-671.544693c0-30.9325 25.056676-55.962569 55.962569-55.962569l671.544693 0c30.90487 0 55.962569 25.03007 55.962569 55.962569L903.734404 847.772346z"},null)]),o("symbol",{id:"icon-img-broken",viewBox:"0 0 1024 1024"},[o("path",{d:"M810.666667 128H213.333333c-46.933333 0-85.333333 38.4-85.333333 85.333333v597.333334c0 46.933333 38.4 85.333333 85.333333 85.333333h597.333334c46.933333 0 85.333333-38.4 85.333333-85.333333V213.333333c0-46.933333-38.4-85.333333-85.333333-85.333333z m0 682.666667H213.333333v-195.413334l42.24 42.24 170.666667-170.666666 170.666667 170.666666 170.666666-170.24L810.666667 530.346667V810.666667z m0-401.493334l-43.093334-43.093333-170.666666 171.093333-170.666667-170.666666-170.666667 170.666666-42.24-42.666666V213.333333h597.333334v195.84z"},null)]),o("symbol",{id:"icon-prev",viewBox:"0 0 1024 1024"},[o("path",{d:"M784.652701 955.6957 346.601985 517.644983c-2.822492-2.822492-2.822492-7.902977 0-11.289967l439.179713-439.179713c6.77398-6.77398 10.725469-16.370452 10.725469-25.966924L796.507166 36.692393c0-20.32194-16.370452-36.692393-36.692393-36.692393l-4.515987 0c-9.596472 0-19.192944 3.951488-25.966924 10.725469L250.072767 489.420066c-12.418964 12.418964-12.418964 32.740904 0 45.159868l477.565601 477.565601c7.338479 7.338479 17.499449 11.854465 28.224917 11.854465l0 0c22.015436 0 40.079383-18.063947 40.079383-40.079383l0 0C796.507166 973.759647 791.99118 963.598677 784.652701 955.6957z"},null)]),o("symbol",{id:"icon-next",viewBox:"0 0 1024 1024"},[o("path",{d:"M246.121279 955.6957l438.050717-438.050717c2.822492-2.822492 2.822492-7.902977 0-11.289967L244.992282 67.175303c-6.77398-6.77398-10.725469-16.370452-10.725469-25.966924L234.266814 36.692393C234.266814 16.370452 250.637266 0 270.959206 0l4.515987 0c9.596472 0 19.192944 3.951488 25.966924 10.725469l478.694598 478.694598c12.418964 12.418964 12.418964 32.740904 0 45.159868l-477.565601 477.565601c-7.338479 7.338479-17.499449 11.854465-28.224917 11.854465l0 0c-22.015436 0-40.079383-18.063947-40.079383-40.079383l0 0C234.266814 973.759647 238.7828 963.598677 246.121279 955.6957z"},null)]),o("symbol",{id:"icon-zoomin",viewBox:"0 0 1024 1024"},[o("path",{d:"M725.504 652.864c46.4-61.44 71.744-136.448 71.744-218.752C797.248 230.464 632.768 64 430.656 64S64 230.464 64 434.112C64 639.36 228.48 805.76 430.656 805.76c86.656 0 164.48-30.144 227.52-81.088L889.984 960 960 891.264l-234.496-238.4z m-294.848 67.456c-155.776 0-282.624-128.896-282.624-286.208s126.848-286.208 282.624-286.208 282.624 128.896 282.624 286.208-126.912 286.208-282.624 286.208z"},null),o("path",{d:"M235.712 369.92h390.72v127.104H235.712z"},null),o("path",{d:"M367.488 238.144h127.104v390.72H367.488z"},null)]),o("symbol",{id:"icon-close",viewBox:"0 0 1024 1024"},[o("path",{d:"M570.24 512l259.2 259.2-58.88 58.24L512 570.24l-261.12 261.12-58.24-58.24L453.76 512 194.56 252.8l58.24-58.24L512 453.76l261.12-261.12 58.24 58.24z"},null)]),o("symbol",{id:"icon-zoomout",viewBox:"0 0 1024 1024"},[o("path",{d:"M725.504 652.864c46.4-61.44 71.744-136.448 71.744-218.752C797.248 230.464 632.768 64 430.656 64S64 230.464 64 434.112C64 639.36 228.48 805.76 430.656 805.76c86.656 0 164.48-30.144 227.52-81.088L889.984 960 960 891.264l-234.496-238.4z m-294.848 67.456c-155.776 0-282.624-128.896-282.624-286.208s126.848-286.208 282.624-286.208 282.624 128.896 282.624 286.208-126.912 286.208-282.624 286.208z"},null),o("path",{d:"M235.712 369.92h390.72v127.104H235.712z"},null)])])}),Z=le?window:global;let _e=Date.now();function x9(e){const r=Date.now(),n=Math.max(0,16-(r-_e)),s=setTimeout(e,n);return _e=r+n,s}function re(e){return(Z.requestAnimationFrame||x9).call(Z,e)}function ke(e){(Z.cancelAnimationFrame||Z.clearTimeout).call(Z,e)}function ze(e,r){const n=e.clientX-r.clientX,s=e.clientY-r.clientY;return Math.sqrt(n*n+s*s)}function se(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Object]"&&!l9(e)}var ce=K({name:"VueEasyLightbox",props:{imgs:{type:[Array,String],default:()=>""},visible:{type:Boolean,default:!1},index:{type:Number,default:0},scrollDisabled:{type:Boolean,default:!0},escDisabled:{type:Boolean,default:!1},moveDisabled:{type:Boolean,default:!1},titleDisabled:{type:Boolean,default:!1},maskClosable:{type:Boolean,default:!0},teleport:{type:[String,Object],default:null},swipeTolerance:{type:Number,default:50},loop:{type:Boolean,default:!1},rtl:{type:Boolean,default:!1},zoomScale:{type:Number,default:.12},maxZoom:{type:Number,default:3},minZoom:{type:Number,default:.1},rotateDisabled:{type:Boolean,default:!1},zoomDisabled:{type:Boolean,default:!1},pinchDisabled:{type:Boolean,default:!1},dblclickDisabled:{type:Boolean,default:!1}},emits:{hide:()=>!0,"on-error":e=>!0,"on-prev":(e,r)=>!0,"on-next":(e,r)=>!0,"on-prev-click":(e,r)=>!0,"on-next-click":(e,r)=>!0,"on-index-change":(e,r)=>!0,"on-rotate":e=>!0},setup(e,r){let{emit:n,slots:s}=r;const{imgRef:b,imgState:p,setImgSize:w}=(()=>{const t=q(),l=ae({width:0,height:0,maxScale:1});return{imgRef:t,imgState:l,setImgSize:()=>{if(t.value){const{width:d,height:f,naturalWidth:y}=t.value;l.maxScale=y/d,l.width=d,l.height=f}}}})(),u=q(e.index),$=q(""),a=ae({scale:1,lastScale:1,rotateDeg:0,top:0,left:0,initX:0,initY:0,lastX:0,lastY:0,touches:[]}),i=ae({loadError:!1,loading:!1,dragging:!1,gesturing:!1,wheeling:!1}),v=O(()=>{return t=e.imgs,pe("Array")(t)?e.imgs.map(l=>typeof l=="string"?{src:l}:function(d){return m9(d)&&ye(d.src)}(l)?l:void 0).filter(v9):ye(e.imgs)?[{src:e.imgs}]:[];var t}),B=O(()=>v.value[u.value]),j=O(()=>{var t;return(t=v.value[u.value])==null?void 0:t.src}),Y=O(()=>{var t;return(t=v.value[u.value])==null?void 0:t.title}),G=O(()=>{var t;return(t=v.value[u.value])==null?void 0:t.alt}),J=O(()=>({cursor:i.loadError?"default":e.moveDisabled?i.dragging?"grabbing":"grab":"move",top:`calc(50% + ${a.top}px)`,left:`calc(50% + ${a.left}px)`,transition:i.dragging||i.gesturing?"none":"",transform:`translate(-50%, -50%) scale(${a.scale}) rotate(${a.rotateDeg}deg)`})),E=()=>{n("hide")},F=()=>{a.scale=1,a.lastScale=1,a.rotateDeg=0,a.top=0,a.left=0,i.loadError=!1,i.dragging=!1,i.loading=!0},P=(t,l)=>{const d=u.value;F(),u.value=t,v.value[u.value]===v.value[t]&&ue(()=>{i.loading=!1}),e.visible&&d!==t&&(l&&l(d,t),n("on-index-change",d,t))},X=()=>{const t=u.value,l=e.loop?(t+1)%v.value.length:t+1;!e.loop&&l>v.value.length-1||P(l,(d,f)=>{n("on-next",d,f),n("on-next-click",d,f)})},T=()=>{const t=u.value;let l=t-1;if(t===0){if(!e.loop)return;l=v.value.length-1}P(l,(d,f)=>{n("on-prev",d,f),n("on-prev-click",d,f)})},W=t=>{Math.abs(1-t)<.05?t=1:Math.abs(p.maxScale-t)<.05&&(t=p.maxScale),a.lastScale=a.scale,a.scale=t},S=()=>{const t=a.scale+e.zoomScale;t<p.maxScale*e.maxZoom&&W(t)},C=()=>{const t=a.scale-e.zoomScale;t>e.minZoom&&W(t)},m=()=>{const t=a.rotateDeg%360;n("on-rotate",Math.abs(t<0?t+360:t))},c=()=>{a.rotateDeg-=90,m()},h=()=>{a.rotateDeg+=90,m()},M=()=>{a.scale=1,a.top=0,a.left=0},D=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;return!e.moveDisabled&&t===0},{onMouseDown:Be,onMouseMove:Te,onMouseUp:$e}=((t,l,d)=>{let f,y=!1;return{onMouseDown:g=>{t.initX=t.lastX=g.clientX,t.initY=t.lastY=g.clientY,l.dragging=!0,y=!1,g.stopPropagation()},onMouseUp:g=>{d(g.button)&&ke(f),l.dragging=!1,y=!1},onMouseMove:g=>{if(l.dragging)if(d(g.button)){if(y)return;y=!0,f=re(()=>{const{top:H,left:R,lastY:x,lastX:ne}=t;t.top=H-x+g.clientY,t.left=R-ne+g.clientX,t.lastX=g.clientX,t.lastY=g.clientY,y=!1})}else t.lastX=g.clientX,t.lastY=g.clientY;g.stopPropagation()}}})(a,i,D),{onTouchStart:je,onTouchMove:Ye,onTouchEnd:Ee}=((t,l,d,f,y)=>{let g,H=!1;return{onTouchStart:R=>{const{touches:x}=R;x.length>1&&y()?(d.gesturing=!0,l.touches=x):(l.initX=l.lastX=x[0].clientX,l.initY=l.lastY=x[0].clientY,d.dragging=!0),R.stopPropagation()},onTouchMove:R=>{if(H)return;const{touches:x}=R,{lastX:ne,lastY:Ue,left:qe,top:Ze,scale:Ke}=l;if(!d.gesturing&&d.dragging){if(!x[0])return;const{clientX:U,clientY:A}=x[0];f()?g=re(()=>{l.lastX=U,l.lastY=A,l.top=Ze-Ue+A,l.left=qe-ne+U,H=!1}):(l.lastX=U,l.lastY=A)}else d.gesturing&&l.touches.length>1&&x.length>1&&y()&&(g=re(()=>{const U=(ze(l.touches[0],l.touches[1])-ze(x[0],x[1]))/t.width;l.touches=x;const A=Ke-1.3*U;A>.5&&A<1.5*t.maxScale&&(l.scale=A),H=!1}))},onTouchEnd:()=>{ke(g),d.dragging=!1,d.gesturing=!1,H=!1}}})(p,a,i,D,()=>!e.pinchDisabled),Xe=()=>{e.dblclickDisabled||(a.scale!==p.maxScale?(a.lastScale=a.scale,a.scale=p.maxScale):a.scale=a.lastScale)},Ae=t=>{i.loadError||i.gesturing||i.loading||i.dragging||i.wheeling||!e.scrollDisabled||e.zoomDisabled||(i.wheeling=!0,setTimeout(()=>{i.wheeling=!1},80),t.deltaY<0?S():C())},me=t=>{const l=t;e.visible&&(!e.escDisabled&&l.key==="Escape"&&e.visible&&E(),l.key==="ArrowLeft"&&(e.rtl?X():T()),l.key==="ArrowRight"&&(e.rtl?T():X()))},He=()=>{e.maskClosable&&E()},Re=()=>{w()},Oe=()=>{i.loading=!1},Ie=t=>{i.loading=!1,i.loadError=!0,n("on-error",t)},ve=()=>{e.visible&&w()};Q(()=>e.index,t=>{t<0||t>=v.value.length||P(t)}),Q(()=>i.dragging,(t,l)=>{const d=!t&&l;if(!D()&&d){const f=a.lastX-a.initX,y=a.lastY-a.initY,g=e.swipeTolerance;Math.abs(f)>Math.abs(y)&&(f<-1*g?X():f>g&&T())}}),Q(()=>e.visible,t=>{if(t){F();const l=v.value.length;if(l===0)return u.value=0,i.loading=!1,void ue(()=>i.loadError=!0);u.value=e.index>=l?l-1:e.index<0?0:e.index,e.scrollDisabled&&Ne()}else e.scrollDisabled&&be()});const Ne=()=>{document&&($.value=document.body.style.overflowY,document.body.style.overflowY="hidden")},be=()=>{document&&(document.body.style.overflowY=$.value)};Ce(()=>{we(document,"keydown",me),we(window,"resize",ve)}),Se(()=>{xe(document,"keydown",me),xe(window,"resize",ve),be()});const Ve=()=>i.loading?s.loading?s.loading({key:"loading"}):o(g9,{key:"img-loading"},null):i.loadError?s.onerror?s.onerror({key:"onerror"}):o(f9,{key:"img-on-error"},null):o("div",{class:`${_}-img-wrapper`,style:J.value,key:"img-wrapper"},[o("img",{alt:G.value,ref:b,draggable:"false",class:`${_}-img`,src:j.value,onMousedown:Be,onMouseup:$e,onMousemove:Te,onTouchstart:je,onTouchmove:Ye,onTouchend:Ee,onLoad:Re,onDblclick:Xe,onDragstart:t=>{t.preventDefault()}},null)]),Fe=()=>{if(s["prev-btn"])return s["prev-btn"]({prev:T});if(v.value.length<=1)return;const t=!e.loop&&u.value<=0;return o("div",{role:"button","aria-label":"previous image button",class:"btn__prev "+(t?"disable":""),onClick:T},[e.rtl?o(z,{type:"next"},null):o(z,{type:"prev"},null)])},Pe=()=>{if(s["next-btn"])return s["next-btn"]({next:X});if(v.value.length<=1)return;const t=!e.loop&&u.value>=v.value.length-1;return o("div",{role:"button","aria-label":"next image button",class:"btn__next "+(t?"disable":""),onClick:X},[e.rtl?o(z,{type:"prev"},null):o(z,{type:"next"},null)])},We=()=>{if(!(e.titleDisabled||i.loading||i.loadError))return s.title?s.title({currentImg:B.value}):Y.value?o(h9,null,{default:()=>[Y.value]}):void 0},ge=()=>{let t;if(e.visible)return o("div",{onTouchmove:d9,class:[`${_}-modal`,e.rtl?"is-rtl":""],onClick:n9(He,["self"]),onWheel:Ae},[o(w9,null,null),o(ie,{name:`${_}-fade`,mode:"out-in"},se(t=Ve())?t:{default:()=>[t]}),o("img",{style:"display:none;",src:j.value,onError:Ie,onLoad:Oe},null),o("div",{class:`${_}-btns-wrapper`},[Fe(),Pe(),We(),s["close-btn"]?s["close-btn"]({close:E}):o("div",{role:"button","aria-label":"close image preview button",class:"btn__close",onClick:E},[o(z,{type:"close"},null)]),s.toolbar?s.toolbar({toolbarMethods:{zoomIn:S,zoomOut:C,rotate:c,rotateLeft:c,rotateRight:h,resize:M},zoomIn:S,zoomOut:C,rotate:c,rotateLeft:c,rotateRight:h,resize:M}):o(b9,{zoomIn:S,zoomOut:C,resize:M,rotateLeft:c,rotateRight:h,rotateDisabled:e.rotateDisabled,zoomDisabled:e.zoomDisabled},null)])])};return()=>{let t;if(e.teleport){let l;return o(o9,{to:e.teleport},{default:()=>[o(ie,{name:`${_}-fade`},se(l=ge())?l:{default:()=>[l]})]})}return o(ie,{name:`${_}-fade`},se(t=ge())?t:{default:()=>[t]})}}});const y9=Object.assign(ce,{install:e=>{e.component(ce.name,ce)}}),_9={props:{image:{type:String,required:!0},description:{type:String,default:""}},name:"picture-card"},k9={class:"picture-card"},z9=["src","alt"],S9=["innerHTML"];function C9(e,r,n,s,b,p){return k(),L("div",k9,[te("img",{class:"picture-card__image",src:n.image,alt:n.description},null,8,z9),te("h2",{class:"picture-card__description",innerHTML:n.description},null,8,S9)])}const M9=oe(_9,[["render",C9]]),D9={methods:{showImg(e){this.index=e,this.visibleSlider=!0},handleHide(){this.visibleSlider=!1}},mounted(){this.$nextTick(()=>{this.visibleLayout=!0})},data(){return{visibleLayout:!1,visibleSlider:!1,index:0}},props:{images:{type:Array,default:()=>[]}},components:{MasonryWall:u9,VueEasyLightbox:y9,PictureCard:M9},name:"picture-list"},L9={key:0},B9=["onClick"];function T9(e,r,n,s,b,p){const w=N("picture-card"),u=N("masonry-wall"),$=N("vue-easy-lightbox");return n.images.length?(k(),L("div",L9,[b.visibleLayout?(k(),Me(u,{key:0,items:n.images,"column-width":520,gap:20},{default:De(({item:a,index:i})=>[te("div",{class:"picture-list__item1",onClick:v=>p.showImg(i)},[o(w,{image:a.src,description:a.title},null,8,["image","description"])],8,B9)]),_:1},8,["items"])):de("",!0),o($,{visible:b.visibleSlider,imgs:n.images,index:b.index,"move-disabled":"",onHide:p.handleHide},null,8,["visible","imgs","index","onHide"])])):de("",!0)}const $9=oe(D9,[["render",T9]]),j9={props:{description:{type:String,default:""},videos:{type:Array,default:()=>[]},images:{type:Array,default:()=>[]}},components:{PictureList:$9},name:"project-detail"},Y9={class:"project-detail"},E9={key:0,class:"project-detail__item"},X9=["innerHTML"];function A9(e,r,n,s,b,p){const w=N("picture-list");return k(),L("div",Y9,[n.description?(k(),L("div",E9,[te("div",{class:"project-detail__description",innerHTML:n.description},null,8,X9)])):de("",!0),o(w,{class:"project-detail__item",images:n.images},null,8,["images"])])}const H9=oe(j9,[["render",A9]]),R9={computed:{project(){return a9[this.$route.params.id]}},mounted(){document.title=`${this.project.name} — Kira Sekira`},components:{ThePage:i9,ProjectDetail:H9},name:"project-view"};function O9(e,r,n,s,b,p){const w=N("project-detail"),u=N("the-page");return k(),Me(u,{title:p.project.name,link:p.project.link,tags:p.project.tags},{default:De(()=>[o(w,{description:p.project.detail||p.project.description,videos:p.project.videos,images:p.project.images},null,8,["description","videos","images"])]),_:1},8,["title","link","tags"])}const N9=oe(R9,[["render",O9]]);export{N9 as default};
