"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@tiptap/core"),t=require("@tiptap/pm/state"),o=require("@tiptap/pm/view"),s=require("@tiptap/pm/model");function r(e){if(!e.length)return o.DecorationSet.empty;const t=[],s=e[0].$from.node(0);return e.forEach((e=>{const s=e.$from.pos,r=e.$from.nodeAfter;r&&t.push(o.Decoration.node(s,s+r.nodeSize,{class:"ProseMirror-selectednoderange"}))})),o.DecorationSet.create(s,t)}function n(e,o,r){const n=[],i=e.node(0);r="number"==typeof r&&r>=0?r:e.sameParent(o)?Math.max(0,e.sharedDepth(o.pos)-1):e.sharedDepth(o.pos);const a=new s.NodeRange(e,o,r),c=0===a.depth?0:i.resolve(a.start).posAtIndex(0);return a.parent.forEach(((e,o)=>{const s=c+o,r=s+e.nodeSize;if(s<a.start||s>=a.end)return;const h=new t.SelectionRange(i.resolve(s),i.resolve(r));n.push(h)})),n}class i{constructor(e,t){this.anchor=e,this.head=t}map(e){return new i(e.map(this.anchor),e.map(this.head))}resolve(e){const t=e.resolve(this.anchor),o=e.resolve(this.head);return new a(t,o)}}class a extends t.Selection{constructor(e,t,o,s=1){const{doc:r}=e,i=e===t,a=e.pos===r.content.size&&t.pos===r.content.size,c=i&&!a?r.resolve(t.pos+(s>0?1:-1)):t,h=i&&a?r.resolve(e.pos-(s>0?1:-1)):e,d=n(h.min(c),h.max(c),o);super(c.pos>=e.pos?d[0].$from:d[d.length-1].$to,c.pos>=e.pos?d[d.length-1].$to:d[0].$from,d),this.depth=o}get $to(){return this.ranges[this.ranges.length-1].$to}eq(e){return e instanceof a&&e.$from.pos===this.$from.pos&&e.$to.pos===this.$to.pos}map(e,t){const o=e.resolve(t.map(this.anchor)),s=e.resolve(t.map(this.head));return new a(o,s)}toJSON(){return{type:"nodeRange",anchor:this.anchor,head:this.head}}get isForwards(){return this.head>=this.anchor}get isBackwards(){return!this.isForwards}extendBackwards(){const{doc:e}=this.$from;if(this.isForwards&&this.ranges.length>1){const e=this.ranges.slice(0,-1),t=e[0].$from,o=e[e.length-1].$to;return new a(t,o,this.depth)}const t=this.ranges[0],o=e.resolve(Math.max(0,t.$from.pos-1));return new a(this.$anchor,o,this.depth)}extendForwards(){const{doc:e}=this.$from;if(this.isBackwards&&this.ranges.length>1){const e=this.ranges.slice(1),t=e[0].$from,o=e[e.length-1].$to;return new a(o,t,this.depth)}const t=this.ranges[this.ranges.length-1],o=e.resolve(Math.min(e.content.size,t.$to.pos+1));return new a(this.$anchor,o,this.depth)}static fromJSON(e,t){return new a(e.resolve(t.anchor),e.resolve(t.head))}static create(e,t,o,s,r=1){return new this(e.resolve(t),e.resolve(o),s,r)}getBookmark(){return new i(this.anchor,this.head)}}function c(e){return e instanceof a}a.prototype.visible=!1;const h=e.Extension.create({name:"nodeRange",addOptions:()=>({depth:void 0,key:"Mod"}),addKeyboardShortcuts(){return{"Shift-ArrowUp":({editor:e})=>{const{depth:t}=this.options,{view:o,state:s}=e,{doc:r,selection:n,tr:i}=s,{anchor:h,head:d}=n;if(!c(n)){const e=a.create(r,h,d,t,-1);return i.setSelection(e),o.dispatch(i),!0}const p=n.extendBackwards();return i.setSelection(p),o.dispatch(i),!0},"Shift-ArrowDown":({editor:e})=>{const{depth:t}=this.options,{view:o,state:s}=e,{doc:r,selection:n,tr:i}=s,{anchor:h,head:d}=n;if(!c(n)){const e=a.create(r,h,d,t);return i.setSelection(e),o.dispatch(i),!0}const p=n.extendForwards();return i.setSelection(p),o.dispatch(i),!0},"Mod-a":({editor:e})=>{const{depth:t}=this.options,{view:o,state:s}=e,{doc:r,tr:n}=s,i=a.create(r,0,r.content.size,t);return n.setSelection(i),o.dispatch(n),!0}}},onSelectionUpdate(){const{selection:e}=this.editor.state;c(e)&&this.editor.view.dom.classList.add("ProseMirror-noderangeselection")},addProseMirrorPlugins(){let e=!1,o=!1;return[new t.Plugin({key:new t.PluginKey("nodeRange"),props:{attributes:()=>e?{class:"ProseMirror-noderangeselection"}:{class:""},handleDOMEvents:{mousedown:(e,t)=>{const{key:s}=this.options,r=/Mac/.test(navigator.platform),n=!!t.shiftKey,i=!!t.ctrlKey,c=!!t.altKey,h=!!t.metaKey;return(null==s||"Shift"===s&&n||"Control"===s&&i||"Alt"===s&&c||"Meta"===s&&h||"Mod"===s&&(r?h:i))&&(o=!0),!!o&&(document.addEventListener("mouseup",(()=>{o=!1;const{state:t}=e,{doc:s,selection:r,tr:n}=t,{$anchor:i,$head:c}=r;if(i.sameParent(c))return;const h=a.create(s,i.pos,c.pos,this.options.depth);n.setSelection(h),e.dispatch(n)}),{once:!0}),!1)}},decorations:t=>{const{selection:s}=t,i=c(s);if(e=!1,!o)return i?(e=!0,r(s.ranges)):null;const{$from:a,$to:h}=s;if(!i&&a.sameParent(h))return null;const d=n(a,h,this.options.depth);return d.length?(e=!0,r(d)):null}}})]}});exports.NodeRange=h,exports.NodeRangeSelection=a,exports.default=h,exports.getNodeRangeDecorations=r,exports.getSelectionRanges=n,exports.isNodeRangeSelection=c;
