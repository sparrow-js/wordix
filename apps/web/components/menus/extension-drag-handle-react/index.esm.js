import r, { useState as t, useRef as l, useEffect as i } from "react";
import { DragHandlePlugin as e, dragHandlePluginDefaultKey as n } from "../extension-drag-handle/index.esm";
const o = (o) => {
  const {
      className: a = "drag-handle",
      children: p,
      editor: s,
      pluginKey: u = n,
      onNodeChange: d,
      tippyOptions: c = {},
    } = o,
    [g, m] = t(null),
    h = l(null);
  return (
    i(
      () =>
        g
          ? s.isDestroyed
            ? () => null
            : (h.current ||
                ((h.current = e({ editor: s, element: g, pluginKey: u, tippyOptions: c, onNodeChange: d })),
                s.registerPlugin(h.current)),
              () => {
                s.unregisterPlugin(u);
              })
          : () => null,
      [g, s, d, u],
    ),
    r.createElement("div", { className: a, ref: m }, p)
  );
};
export { o as DragHandle, o as default };
