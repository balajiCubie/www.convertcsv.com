try { !function(e,n){n((e="undefined"!=typeof globalThis?globalThis:e||self).webVitals={})}(this,(function(e){"use strict";var n,t,i,r,o,a=-1,c=function(e){addEventListener("pageshow",(function(n){n.persisted&&(a=n.timeStamp,e(n))}),!0)},u=function(){return window.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]},s=function(){var e=u();return e&&e.activationStart||0},f=function(e,n){var t=u(),i="navigate";a>=0?i="back-forward-cache":t&&(document.prerendering||s()>0?i="prerender":document.wasDiscarded?i="restore":t.type&&(i=t.type.replace(/_/g,"-")));return{name:e,value:void 0===n?-1:n,rating:"good",delta:0,entries:[],id:"v3-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:i}},d=function(e,n,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){var i=new PerformanceObserver((function(e){Promise.resolve().then((function(){n(e.getEntries())}))}));return i.observe(Object.assign({type:e,buffered:!0},t||{})),i}}catch(e){}},l=function(e,n,t,i){var r,o;return function(a){n.value>=0&&(a||i)&&((o=n.value-(r||0))||void 0===r)&&(r=n.value,n.delta=o,n.rating=function(e,n){return e>n[1]?"poor":e>n[0]?"needs-improvement":"good"}(n.value,t),e(n))}},p=function(e){requestAnimationFrame((function(){return requestAnimationFrame((function(){return e()}))}))},v=function(e){var n=function(n){"pagehide"!==n.type&&"hidden"!==document.visibilityState||e(n)};addEventListener("visibilitychange",n,!0),addEventListener("pagehide",n,!0)},m=function(e){var n=!1;return function(t){n||(e(t),n=!0)}},h=-1,g=function(){return"hidden"!==document.visibilityState||document.prerendering?1/0:0},T=function(e){"hidden"===document.visibilityState&&h>-1&&(h="visibilitychange"===e.type?e.timeStamp:0,E())},y=function(){addEventListener("visibilitychange",T,!0),addEventListener("prerenderingchange",T,!0)},E=function(){removeEventListener("visibilitychange",T,!0),removeEventListener("prerenderingchange",T,!0)},C=function(){return h<0&&(h=g(),y(),c((function(){setTimeout((function(){h=g(),y()}),0)}))),{get firstHiddenTime(){return h}}},L=function(e){document.prerendering?addEventListener("prerenderingchange",(function(){return e()}),!0):e()},b=[1800,3e3],S=function(e,n){n=n||{},L((function(){var t,i=C(),r=f("FCP"),o=d("paint",(function(e){e.forEach((function(e){"first-contentful-paint"===e.name&&(o.disconnect(),e.startTime<i.firstHiddenTime&&(r.value=Math.max(e.startTime-s(),0),r.entries.push(e),t(!0)))}))}));o&&(t=l(e,r,b,n.reportAllChanges),c((function(i){r=f("FCP"),t=l(e,r,b,n.reportAllChanges),p((function(){r.value=performance.now()-i.timeStamp,t(!0)}))})))}))},w=[.1,.25],P=function(e,n){n=n||{},S(m((function(){var t,i=f("CLS",0),r=0,o=[],a=function(e){e.forEach((function(e){if(!e.hadRecentInput){var n=o[0],t=o[o.length-1];r&&e.startTime-t.startTime<1e3&&e.startTime-n.startTime<5e3?(r+=e.value,o.push(e)):(r=e.value,o=[e])}})),r>i.value&&(i.value=r,i.entries=o,t())},u=d("layout-shift",a);u&&(t=l(e,i,w,n.reportAllChanges),v((function(){a(u.takeRecords()),t(!0)})),c((function(){r=0,i=f("CLS",0),t=l(e,i,w,n.reportAllChanges),p((function(){return t()}))})),setTimeout(t,0))})))},I={passive:!0,capture:!0},F=new Date,A=function(e,r){n||(n=r,t=e,i=new Date,k(removeEventListener),M())},M=function(){if(t>=0&&t<i-F){var e={entryType:"first-input",name:n.type,target:n.target,cancelable:n.cancelable,startTime:n.timeStamp,processingStart:n.timeStamp+t};r.forEach((function(n){n(e)})),r=[]}},D=function(e){if(e.cancelable){var n=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,n){var t=function(){A(e,n),r()},i=function(){r()},r=function(){removeEventListener("pointerup",t,I),removeEventListener("pointercancel",i,I)};addEventListener("pointerup",t,I),addEventListener("pointercancel",i,I)}(n,e):A(n,e)}},k=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(n){return e(n,D,I)}))},x=[100,300],B=function(e,i){i=i||{},L((function(){var o,a=C(),u=f("FID"),s=function(e){e.startTime<a.firstHiddenTime&&(u.value=e.processingStart-e.startTime,u.entries.push(e),o(!0))},p=function(e){e.forEach(s)},h=d("first-input",p);o=l(e,u,x,i.reportAllChanges),h&&v(m((function(){p(h.takeRecords()),h.disconnect()}))),h&&c((function(){var a;u=f("FID"),o=l(e,u,x,i.reportAllChanges),r=[],t=-1,n=null,k(addEventListener),a=s,r.push(a),M()}))}))},N=0,R=1/0,H=0,O=function(e){e.forEach((function(e){e.interactionId&&(R=Math.min(R,e.interactionId),H=Math.max(H,e.interactionId),N=H?(H-R)/7+1:0)}))},j=function(){return o?N:performance.interactionCount||0},_=function(){"interactionCount"in performance||o||(o=d("event",O,{type:"event",buffered:!0,durationThreshold:0}))},q=[200,500],V=0,z=function(){return j()-V},G=[],J={},K=function(e){var n=G[G.length-1],t=J[e.interactionId];if(t||G.length<10||e.duration>n.latency){if(t)t.entries.push(e),t.latency=Math.max(t.latency,e.duration);else{var i={id:e.interactionId,latency:e.duration,entries:[e]};J[i.id]=i,G.push(i)}G.sort((function(e,n){return n.latency-e.latency})),G.splice(10).forEach((function(e){delete J[e.id]}))}},Q=function(e,n){n=n||{},L((function(){var t;_();var i,r=f("INP"),o=function(e){e.forEach((function(e){(e.interactionId&&K(e),"first-input"===e.entryType)&&(!G.some((function(n){return n.entries.some((function(n){return e.duration===n.duration&&e.startTime===n.startTime}))}))&&K(e))}));var n,t=(n=Math.min(G.length-1,Math.floor(z()/50)),G[n]);t&&t.latency!==r.value&&(r.value=t.latency,r.entries=t.entries,i())},a=d("event",o,{durationThreshold:null!==(t=n.durationThreshold)&&void 0!==t?t:40});i=l(e,r,q,n.reportAllChanges),a&&("interactionId"in PerformanceEventTiming.prototype&&a.observe({type:"first-input",buffered:!0}),v((function(){o(a.takeRecords()),r.value<0&&z()>0&&(r.value=0,r.entries=[]),i(!0)})),c((function(){G=[],V=j(),r=f("INP"),i=l(e,r,q,n.reportAllChanges)})))}))},U=[2500,4e3],W={},X=function(e,n){n=n||{},L((function(){var t,i=C(),r=f("LCP"),o=function(e){var n=e[e.length-1];n&&n.startTime<i.firstHiddenTime&&(r.value=Math.max(n.startTime-s(),0),r.entries=[n],t())},a=d("largest-contentful-paint",o);if(a){t=l(e,r,U,n.reportAllChanges);var u=m((function(){W[r.id]||(o(a.takeRecords()),a.disconnect(),W[r.id]=!0,t(!0))}));["keydown","click"].forEach((function(e){addEventListener(e,(function(){return setTimeout(u,0)}),!0)})),v(u),c((function(i){r=f("LCP"),t=l(e,r,U,n.reportAllChanges),p((function(){r.value=performance.now()-i.timeStamp,W[r.id]=!0,t(!0)}))}))}}))},Y=[800,1800],Z=function e(n){document.prerendering?L((function(){return e(n)})):"complete"!==document.readyState?addEventListener("load",(function(){return e(n)}),!0):setTimeout(n,0)},$=function(e,n){n=n||{};var t=f("TTFB"),i=l(e,t,Y,n.reportAllChanges);Z((function(){var r=u();if(r){var o=r.responseStart;if(o<=0||o>performance.now())return;t.value=Math.max(o-s(),0),t.entries=[r],i(!0),c((function(){t=f("TTFB",0),(i=l(e,t,Y,n.reportAllChanges))(!0)}))}}))};e.CLSThresholds=w,e.FCPThresholds=b,e.FIDThresholds=x,e.INPThresholds=q,e.LCPThresholds=U,e.TTFBThresholds=Y,e.getCLS=P,e.getFCP=S,e.getFID=B,e.getINP=Q,e.getLCP=X,e.getTTFB=$,e.onCLS=P,e.onFCP=S,e.onFID=B,e.onINP=Q,e.onLCP=X,e.onTTFB=$,Object.defineProperty(e,"__esModule",{value:!0})}));var metricNameMap={"CLS":"cls_value","FID":"fid_value","LCP":"lcp_value","INP":"inp_value"};function ezlogVital(m){if(!metricNameMap[m.name]||!window._ezaq){return;}
window.__ez.bit.Add(window._ezaq["page_view_id"],[(new window.__ezDotData(metricNameMap[m.name],m.delta))]);window.__ez.bit.Fire();}
window.webVitals.onCLS(ezlogVital);window.webVitals.onLCP(ezlogVital);window.webVitals.onFID(ezlogVital);window.webVitals.onINP(ezlogVital);} catch(err) {var hREED = function(er) {return function() {reportEzError(er, "/tardisrocinante/vitals.js")}}; typeof reportEzError==="function"?hREED(err):window.addEventListener('reportEzErrorDefined',hREED(err), {once: true}); console.error(err);}