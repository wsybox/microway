const W = (e) => e && e.hasOwnProperty("__IS_VNODE") && e.__IS_VNODE, S = (e, t) => t.type === e, _ = (e, t) => {
  let i;
  return e === "Text" || e === "Comment" ? i = { children: [t] } : i = t, i.type = e, i.__IS_VNODE = !0, i;
}, H = (e, t) => document.createElement(e, t), K = (e, t, i) => document.createElementNS(e, t, i), U = () => document.createDocumentFragment(), k = (e) => document.createTextNode(e), q = (e = "") => document.createComment(e), J = (e) => e.nodeType === 1, Q = (e) => e.nodeType === 3, X = (e) => e.nodeType === 8, Z = (e) => e.nodeType === 11, V = (e, t, i) => {
  e.insertBefore(t, i);
}, j = (e, t) => {
  e.removeChild(t);
}, G = (e, t) => {
  e.appendChild(t);
}, ee = (e, t, i) => {
  e.replaceChild(t, i);
}, te = (e, t) => e.cloneNode(t), re = (e) => e.parentNode, ne = (e) => e.nextSibling, ie = (e, ...t) => {
  e.append(...t);
}, oe = (e) => e.tagName, se = (e, t) => e[t], ce = (e, t, i) => {
  e[t] = i;
}, I = [void 0, null], fe = (e, t) => e.getAttribute(t), le = (e, t, i) => {
  I.includes(i) ? e.removeAttribute(t) : e.setAttribute(t, i);
}, de = (e, t, i) => e.getAttributeNS(t, i), ue = (e, t, i, s) => {
  I.includes(s) ? e.removeAttributeNS(t, i) : e.setAttributeNS(t, i, s);
}, me = (e, t) => {
  I.includes(t) ? e.removeAttribute("class") : e.className = t;
}, ae = (e, t, i, s) => {
  e.addEventListener(t, i, s);
}, pe = (e, t, i, s) => {
  e.removeEventListener(t, i, s);
}, ge = (e, t) => {
  e.textContent = t;
}, he = (e) => e.textContent, ye = /* @__PURE__ */ new Set([
  // "a",
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  // "script",
  "set",
  "stop",
  // "style",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  // "title",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
]), B = {
  Element: H,
  ElementNS: K,
  Text: k,
  Fragment: U,
  Comment: q,
  isElement: J,
  isText: Q,
  isComment: X,
  isFragment: Z,
  insertBefore: V,
  removeChild: j,
  appendChild: G,
  replaceChild: ee,
  insertFragmentBefore: V,
  appendFragment: G,
  cloneNode: te,
  parentNode: re,
  nextSibling: ne,
  append: ie,
  tagName: oe,
  getProperty: se,
  setProperty: ce,
  getAttribute: fe,
  setAttribute: le,
  getAttributeNS: de,
  setAttributeNS: ue,
  className: me,
  addEventListener: ae,
  removeEventListener: pe,
  setTextContent: ge,
  getTextContent: he,
  SVGElements: ye
}, Ne = Object.prototype.toString, Y = (e) => Ne.call(e), w = (e) => typeof e == "function", P = Array.isArray, v = (e) => e === void 0, z = (e) => e !== void 0, be = (e) => v(e) || e === null, O = (e) => typeof e == "string", Te = (e) => typeof e == "number", L = (e) => e === !0 || e === !1, A = (e) => O(e) || Te(e) || e instanceof String || e instanceof Number, $ = (e) => Y(e) === "[object Object]", R = /^(?![0-9-_.])[\w-.:]+$/, M = new Error("compilerToVNode: TemplateStrings format error"), Ee = (e, t) => {
  let i, s = "";
  const C = [];
  if (t.length === 0)
    s = e[0], i = s.split(/\s+/)[0];
  else {
    let o = [...e.raw];
    o.length === 1 ? o = [o[0].trim()] : (o.unshift(o.shift().replace(/^\s*/g, "")), o.push(o.pop().replace(/\s*$/g, ""))), o = o.map((f) => f.split(/\s+/)).flat();
    let l, c, n;
    for (; o.length > 0; )
      if (c = o.shift(), i === void 0) {
        if (R.test(c))
          i = c, s += i + " ";
        else
          throw M;
        c = void 0;
      } else if (c === "" || c.endsWith("=")) {
        if (l = c, c = o.shift(), c === "")
          if (l === "")
            if (n = t.shift(), Object.prototype.toString.call(n) === "[object Object]")
              C.push(n), n = void 0;
            else
              throw M;
          else {
            const f = l.slice(0, -1);
            if (R.test(f))
              n = t.shift(), ["string", "number", "boolean"].includes(typeof n) ? s += `${l}'${n}' ` : C.push({ [f]: n }), n = void 0;
            else
              throw M;
          }
        else
          throw M;
        l = void 0, c = void 0;
      } else
        s += c + " ", c = void 0;
  }
  return { tag: i, tpl: s, data: C };
}, xe = ["transform", "identify", "patch", "create", "replace", "reference"], Ce = (e) => xe.includes(e), Se = (e, ...t) => {
  const i = {
    [Symbol.toStringTag]: "LTag",
    strs: e,
    vals: t
  };
  return Object.assign((...s) => ({ ...i, children: s }), i);
}, _e = (...e) => {
  const t = { api: B }, i = {}, s = {}, C = {
    get: (r) => s[r] || (s[r] = []),
    add: (r, d) => {
      Ce(r) && (v(s[r]) ? s[r] = [d] : s[r].push(d));
    }
  };
  let o, l;
  for (o of e)
    if (typeof o == "function" && (o = o({ ...t, ...i }, C)), z(o) && $(o))
      for (l in o)
        l.startsWith("_") ? v(i[l]) && (i[l] = o[l]) : l === "api" && t.api === B ? t.api = o.api : v(t[l]) && (t[l] = o[l]);
  const { api: c } = t, n = (r) => {
    if (W(r))
      return r;
    if (A(r))
      return _("Text", r);
    if (Y(r) === "[object LTag]") {
      const { strs: d, vals: a, children: u } = r, { data: p, tag: g, tpl: b } = Ee(d, a), y = c.SVGElements.has(g);
      return _("Element", { data: p, tag: g, tpl: b, isSVG: y, children: u });
    } else if (s.transform) {
      let d, a;
      for (a of s.transform)
        if (d = a(r), d)
          return d;
    }
  }, f = (r, d) => {
    const { children: a } = r;
    if (["Element", "Fragment"].includes(r.type) && a && a.length > 0) {
      let u, p;
      for (u = 0; u < a.length; u++)
        p = n(a[u]), p && d && (p = d(p, a.length === 1)), a.splice(u, 1, p), p = void 0;
    }
  }, m = /* @__PURE__ */ new Map(), h = (r) => {
    let d = m.get(r);
    if (!d) {
      const a = c.Element("template");
      a.innerHTML = r, m.set(r, d = a.content.childNodes);
    }
    if (d.length > 1) {
      const a = c.Fragment();
      return d.forEach((u) => a.append(c.cloneNode(u, !0))), a;
    } else
      return d.length === 1 ? c.cloneNode(d[0], !0) : void 0;
  }, E = (r, d) => {
    r.root && S("Fragment", r.vnode) ? r.html = "" : S("Element", r.vnode) && (r.html = `<${r.vnode.tpl}>`);
    const a = (u, p) => {
      const g = [];
      if (S("Element", u)) {
        const { data: b } = u;
        if (b && b.length > 0 && b.forEach((y) => {
          let x;
          e:
            for (x in y) {
              if (s.patch) {
                let D;
                for (D of s.patch)
                  if (D(x, y[x], g))
                    continue e;
              }
              A(y[x]) ? u.tpl += `${x}='${y[x]}' ` : (w(y[x]) || $(y[x]) || P(y[x])) && g.push([x, y[x]]);
            }
        }), g.length > 0) {
          const y = "__RID_" + d.size;
          return T({ vnode: u, id: y, reference: g, parent: r, only: p }, d), r.html += `<!--${y}-->`, _("Comment", y);
        } else
          r.html += `<${u.tpl}>`;
      } else if (S("Text", u) && A(u.children[0]))
        r.html += u.children[0];
      else if (s.identify) {
        let b, y;
        for (y of s.identify)
          if (b = y(u, r, d, T, p), b)
            return b;
      }
      return f(u, a), S("Element", u) && g.length === 0 && (r.html += `</${u.tag}>`), u;
    };
    f(r.vnode, a), S("Element", r.vnode) && (r.html += `</${r.vnode.tag}>`);
  }, N = (r, d) => {
    const a = document.createNodeIterator(r.elm, NodeFilter.SHOW_COMMENT);
    let u;
    for (; u = a.nextNode(); ) {
      const p = u.nodeValue;
      if (p) {
        const g = d.get(p);
        if (g && g.elm)
          c.replaceChild(u.parentNode, g.elm, u);
        else if (s.replace) {
          let b;
          for (b of s.replace)
            if (b(u, p, r, d, T))
              break;
        }
      }
    }
    if (c.isElement(r.elm) && r.reference && r.reference.length) {
      let p, g;
      e:
        for ([p, g] of r.reference) {
          if (s.reference) {
            let b;
            for (b of s.reference)
              if (b(p, g, r.elm))
                continue e;
          }
          A(g) || L(g) || g === null ? c.setAttribute(r.elm, p, g) : p !== "effects" && c.setProperty(r.elm, p, g);
        }
    }
  }, T = (r, d = /* @__PURE__ */ new Map()) => {
    if (d.set(r.root ? "" : r.id, r), E(r, d), r.html)
      r.elm = h(r.html);
    else if (s.create) {
      let a;
      for (a of s.create)
        if (a(r, h, T))
          break;
    }
    return r.elm && N(r, d), d;
  };
  return Object.assign(t, { fragment: (...r) => {
    const a = { vnode: _("Fragment", { children: r }), root: !0 };
    return T(a), a.elm;
  } });
}, ve = (e, t) => {
  const i = {
    class: [
      (o, l, c) => {
        if (L(c))
          return o.classList[c ? "add" : "remove"](l), !0;
      }
    ],
    style: [
      (o, l, c) => {
        if (O(c))
          return o.style[l] = c, !0;
      }
    ],
    on: [
      (o, l, c) => {
        if (w(c))
          return o.addEventListener(l, c), !0;
      }
    ],
    data: [
      (o, l, c) => {
        if (A(c) || L(c) || c === null)
          return o.dataset[l] = c + "", !0;
      }
    ]
  }, s = {
    get: (o) => i[o] || (i[o] = []),
    add: (o, l) => {
      v(i[o]) ? i[o] = [l] : i[o].push(l);
    }
  }, C = Object.keys(i);
  return t.add("reference", (o, l, c) => {
    if (P(l) && o === "class")
      return l.forEach((n) => {
        O(n) && c.classList.add(n);
      }), !0;
    if (w(l) && o.startsWith("on")) {
      const n = i.on[0];
      return n(c, o.slice(2), l), !0;
    } else if ($(l) && C.includes(o))
      return Object.entries(l).forEach(([n, f]) => {
        let m;
        for (m of i[o])
          if (m(c, n, f))
            break;
      }), !0;
  }), { _actions: s };
}, Ae = ({ api: e, _signal: t, _actions: i }, s) => {
  const C = /* @__PURE__ */ new WeakSet(), o = (n, f, m) => {
    let h = e.getProperty(n, "effects");
    return v(h) && (e.setProperty(n, "effects", h = /* @__PURE__ */ new Map()), C.add(n)), h.set(f, t.effect(m)), n;
  }, l = (n, f) => {
    const m = e.getProperty(n, "effects");
    z(m) && C.has(n) && (v(f) ? (C.delete(n), m.forEach((h) => t.stop(h)), m.clear()) : m.has(f) && (t.stop(m.get(f)), m.delete(f)));
  };
  return s.add("transform", (n) => {
    if (t.is(n) && A(t.get(n)))
      return _("Text", n);
    if (w(n)) {
      const f = n();
      if (W(f) || P(f))
        return _("Fragment", { dynamic: n });
    }
  }), s.add("patch", (n, f, m) => {
    if (t.is(f))
      return m.push([n, f]), !0;
  }), s.add(
    "identify",
    (n, f, m, h, E) => {
      if (S("Text", n) && t.is(n.children[0])) {
        const N = n.children[0];
        n.children = void 0;
        const T = "__RID_" + m.size;
        return h({ vnode: n, id: T, parent: f, signalText: N, only: E }, m), f.html += `<!--${T}-->`, _("Comment", T);
      } else if (S("Fragment", n) && n.dynamic) {
        const N = "__RID_" + m.size;
        return h({ vnode: n, id: N, parent: f, dynamic: n.dynamic, only: E }, m), f.html += `<!--__DYNAMIC_START${N}--><!--${N}--><!--__DYNAMIC_END${N}-->`, _("Comment", N);
      }
    }
  ), s.add(
    "create",
    (n, f, m) => {
      const { vnode: h, signalText: E, dynamic: N } = n;
      if (S("Text", h) && t.is(E))
        return n.elm = e.Text(t.get(E)), o(n.elm, "signalText", () => e.setTextContent(n.elm, t.get(E))), !0;
      if (S("Fragment", h) && N) {
        const F = { vnode: _("Fragment", { children: [N()].flat() }), root: !0 };
        return m(F), n.elm = F.elm, !0;
      }
    }
  ), s.add(
    "replace",
    (n, f, m, h, E) => {
      if (f.startsWith("__DYNAMIC_START")) {
        const N = f.slice(15), T = h.get(N);
        T.start = n;
      } else if (f.startsWith("__DYNAMIC_END")) {
        const N = f.slice(13), T = h.get(N);
        T.end = n;
        const { start: F, end: r, dynamic: d } = T, a = t.memo(d);
        o(r, "dynamic", () => {
          const u = e.parentNode(r), p = t.get(a), g = be(p) ? void 0 : [p].flat(), b = g && g.length > 0;
          let y;
          for (; (y = e.nextSibling(F)) !== r; )
            e.removeChild(u, y);
          if (b) {
            const D = { vnode: _("Fragment", { children: g }), root: !0 };
            E(D), e.insertBefore(u, D.elm, r);
          }
        });
      }
    }
  ), ["style", "class", "on", "data"].forEach((n) => {
    i.add(n, (f, m, h) => {
      if (t.is(h)) {
        const E = i.get(n)[0], N = () => E(f, m, t.get(h));
        return N(), o(f, n + ":" + m, N), !0;
      }
    });
  }), s.add("reference", (n, f, m) => {
    if (t.is(f)) {
      const h = () => e.setAttribute(m, n, t.get(f));
      return h(), o(m, n, h), !0;
    }
  }), { _track: o, _untrack: l };
};
export {
  ve as baseModule,
  B as htmlDomApi,
  _e as init,
  Ce as isHookName,
  Se as l,
  Ae as signalModule
};
