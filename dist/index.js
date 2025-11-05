typeof window<"u"&&(async()=>{try{let t=await import("datastar");t?.attribute&&t?.effect&&t.attribute(i(t.effect))}catch{}})();function i(t){return{name:"prop",requirement:{value:"must"},returnsValue:!0,apply({el:a,key:n,rx:r}){return t(n?()=>{let e=r();a[n]=e}:()=>{let e=r();for(let u of Object.keys(e))a[u]=e[u]})}}}export{i as default};
//# sourceMappingURL=index.js.map
