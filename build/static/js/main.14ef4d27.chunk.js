(this["webpackJsonppart2-notes"]=this["webpackJsonppart2-notes"]||[]).push([[0],{39:function(t,e,n){},40:function(t,e,n){"use strict";n.r(e);var c=n(0),r=n(15),o=n.n(r),a=n(6),i=n(3),u=n(2),s=function(t){var e=t.note,n=t.toggleImportance,r=e.important?"make not important":"make important";return Object(c.jsxs)("li",{className:"note",children:[e.content,Object(c.jsx)("button",{onClick:n,children:r})]})},l=function(t){var e=t.message;return null===e?null:Object(c.jsx)("div",{className:"error",children:e})},j=function(){return Object(c.jsxs)("div",{style:{color:"green",fontStyle:"italic",fontSize:16},children:[Object(c.jsx)("br",{}),Object(c.jsx)("em",{children:"Note app, Department of Computer Science, University of Helsinki, 2021"})]})},f=n(4),b=n.n(f),d="/api/notes",p={getAll:function(){return b.a.get(d).then((function(t){return t.data}))},create:function(t){return b.a.post(d,t).then((function(t){return t.data}))},update:function(t,e){return b.a.put("".concat(d,"/").concat(t),e).then((function(t){return t.data}))}},m=function(t){var e=Object(u.useState)([]),n=Object(i.a)(e,2),r=n[0],o=n[1],f=Object(u.useState)(""),b=Object(i.a)(f,2),d=b[0],m=b[1],O=Object(u.useState)(!0),h=Object(i.a)(O,2),v=h[0],x=h[1],g=Object(u.useState)(null),S=Object(i.a)(g,2),k=S[0],y=S[1];Object(u.useEffect)((function(){p.getAll().then((function(t){o(t)}))}),[]);var w=v?r:r.filter((function(t){return t.important}));return Object(c.jsxs)("div",{children:[Object(c.jsx)("h1",{children:"Notes"}),Object(c.jsx)(l,{message:k}),Object(c.jsx)("div",{children:Object(c.jsxs)("button",{onClick:function(){return x(!v)},children:["show ",v?"important":"all"]})}),Object(c.jsx)("ul",{children:w.map((function(t){return Object(c.jsx)(s,{note:t,toggleImportance:function(){return function(t){var e=r.find((function(e){return e.id===t})),n=Object(a.a)(Object(a.a)({},e),{},{important:!e.important});p.update(t,n).then((function(e){o(r.map((function(n){return n.id!==t?n:e})))})).catch((function(t){y('Note "'.concat(e.content,'" was already removed from server')),setTimeout((function(){y(null)}),5e3)}))}(t.id)}},t.id)}))}),Object(c.jsxs)("form",{onSubmit:function(t){t.preventDefault();var e={content:d,date:(new Date).toISOString(),important:Math.random()>.5};p.create(e).then((function(t){o(r.concat(t)),m("")}))},children:[Object(c.jsx)("input",{value:d,onChange:function(t){console.log(t.target.value),m(t.target.value)}}),Object(c.jsx)("button",{type:"submit",children:"save"})]}),Object(c.jsx)(j,{})]})};n(39);o.a.render(Object(c.jsx)(m,{}),document.getElementById("root"))}},[[40,1,2]]]);
//# sourceMappingURL=main.14ef4d27.chunk.js.map