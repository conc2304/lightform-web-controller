let t,

  e,
  o,
  n = !1,
  i = !1,
  l = !1,
  s = !1,
  r = !1;
const a = 'undefined' != typeof window ? window : {},
  c = a.document || { head: {} },
  d = {
    t: 0,
    o: '',
    jmp: t => t(),
    raf: t => requestAnimationFrame(t),
    ael: (t, e, o, n) => t.addEventListener(e, o, n),
    rel: (t, e, o, n) => t.removeEventListener(e, o, n),
    ce: (t, e) => new CustomEvent(t, e),
  },
  u = (() => (c.head.attachShadow + '').indexOf('[native') > -1)(),
  f = (() => {
    try {
      return new CSSStyleSheet(), !0;
    } catch (t) {}
    return !1;
  })(),
  p = 'http://www.w3.org/1999/xlink',
  h = new WeakMap(),
  b = t => 'sc-' + t.i,
  g = {},
  m = t => 'object' == (t = typeof t) || 'function' === t,
  x = 'undefined' != typeof Deno,
  v = !(
    x ||
    'undefined' == typeof global ||
    'function' != typeof require ||
    !global.process ||
    'string' != typeof __filename ||
    (global.origin && 'string' == typeof global.origin)
  ),
  y =
    (x && Deno,
    v ? process : x && Deno,
    v ? process : x && Deno,
    (t, e, ...o) => {
      let n = null,
        i = null,
        l = null,
        s = !1,
        r = !1,
        a = [];
      const c = e => {
        for (let o = 0; o < e.length; o++)
          (n = e[o]),
            Array.isArray(n)
              ? c(n)
              : null != n && 'boolean' != typeof n && ((s = 'function' != typeof t && !m(n)) && (n += ''), s && r ? (a[a.length - 1].l += n) : a.push(s ? w(null, n) : n), (r = s));
      };
      if ((c(o), e)) {
        e.key && (i = e.key), e.name && (l = e.name);
        {
          const t = e.className || e.class;
          t &&
            (e.class =
              'object' != typeof t
                ? t
                : Object.keys(t)
                    .filter(e => t[e])
                    .join(' '));
        }
      }
      if ('function' == typeof t) return t(null === e ? {} : e, a, z);
      const d = w(t, null);
      return (d.s = e), a.length > 0 && (d.u = a), (d.p = i), (d.h = l), d;
    }),
  w = (t, e) => ({ t: 0, g: t, l: e, m: null, u: null, s: null, p: null, h: null }),
  k = {},
  z = { forEach: (t, e) => t.map($).forEach(e), map: (t, e) => t.map($).map(e).map(L) },
  $ = t => ({ vattrs: t.s, vchildren: t.u, vkey: t.p, vname: t.h, vtag: t.g, vtext: t.l }),
  L = t => {
    if ('function' == typeof t.vtag) {
      const e = Object.assign({}, t.vattrs);
      return t.vkey && (e.key = t.vkey), t.vname && (e.name = t.vname), y(t.vtag, e, ...(t.vchildren || []));
    }
    const e = w(t.vtag, t.vtext);
    return (e.s = t.vattrs), (e.u = t.vchildren), (e.p = t.vkey), (e.h = t.vname), e;
  },
  S = (t, e, o, n, i, l) => {
    if (o !== n) {
      let r = at(t, e),
        c = e.toLowerCase();
      if ('class' === e) {
        const e = t.classList,
          i = E(o),
          l = E(n);
        e.remove(...i.filter(t => t && !l.includes(t))), e.add(...l.filter(t => t && !i.includes(t)));
      } else if ('style' === e) {
        for (const e in o) (n && null != n[e]) || (e.includes('-') ? t.style.removeProperty(e) : (t.style[e] = ''));
        for (const e in n) (o && n[e] === o[e]) || (e.includes('-') ? t.style.setProperty(e, n[e]) : (t.style[e] = n[e]));
      } else if ('key' === e);
      else if ('ref' === e) n && n(t);
      else if (t.__lookupSetter__(e) || 'o' !== e[0] || 'n' !== e[1]) {
        const a = m(n);
        if ((r || (a && null !== n)) && !i)
          try {
            if (t.tagName.includes('-')) t[e] = n;
            else {
              let i = null == n ? '' : n;
              'list' === e ? (r = !1) : (null != o && t[e] == i) || (t[e] = i);
            }
          } catch (s) {}
        let d = !1;
        c !== (c = c.replace(/^xlink\:?/, '')) && ((e = c), (d = !0)),
          null == n || !1 === n
            ? (!1 === n && '' !== t.getAttribute(e)) || (d ? t.removeAttributeNS(p, e) : t.removeAttribute(e))
            : (!r || 4 & l || i) && !a && ((n = !0 === n ? '' : n), d ? t.setAttributeNS(p, e, n) : t.setAttribute(e, n));
      } else (e = '-' === e[2] ? e.slice(3) : at(a, c) ? c.slice(2) : c[2] + e.slice(3)), o && d.rel(t, e, o, !1), n && d.ael(t, e, n, !1);
    }
  },
  C = /\s/,
  E = t => (t ? t.split(C) : []),
  A = (t, e, o, n) => {
    const i = 11 === e.m.nodeType && e.m.host ? e.m.host : e.m,
      l = (t && t.s) || g,
      s = e.s || g;
    for (n in l) n in s || S(i, n, l[n], void 0, o, e.t);
    for (n in s) S(i, n, l[n], s[n], o, e.t);
  },
  H = (i, r, a, d) => {
    let u,
      f,
      p,
      h = r.u[a],
      b = 0;
    if ((n || ((l = !0), 'slot' === h.g && (t && d.classList.add(t + '-s'), (h.t |= h.u ? 2 : 1))), null !== h.l)) u = h.m = c.createTextNode(h.l);
    else if (1 & h.t) u = h.m = c.createTextNode('');
    else {
      if (
        (s || (s = 'svg' === h.g),
        (u = h.m = c.createElementNS(s ? 'http://www.w3.org/2000/svg' : 'http://www.w3.org/1999/xhtml', 2 & h.t ? 'slot-fb' : h.g)),
        s && 'foreignObject' === h.g && (s = !1),
        A(null, h, s),
        null != t && u['s-si'] !== t && u.classList.add((u['s-si'] = t)),
        h.u)
      )
        for (b = 0; b < h.u.length; ++b) (f = H(i, h, b, u)), f && u.appendChild(f);
      'svg' === h.g ? (s = !1) : 'foreignObject' === u.tagName && (s = !0);
    }
    return (u['s-hn'] = o), 3 & h.t && ((u['s-sr'] = !0), (u['s-cr'] = e), (u['s-sn'] = h.h || ''), (p = i && i.u && i.u[a]), p && p.g === h.g && i.m && B(i.m, !1)), u;
  },
  B = (t, e) => {
    d.t |= 1;
    const n = t.childNodes;
    for (let i = n.length - 1; i >= 0; i--) {
      const t = n[i];
      t['s-hn'] !== o && t['s-ol'] && (G(t).insertBefore(t, _(t)), t['s-ol'].remove(), (t['s-ol'] = void 0), (l = !0)), e && B(t, e);
    }
    d.t &= -2;
  },
  T = (t, e, n, i, l, s) => {
    let r,
      a = (t['s-cr'] && t['s-cr'].parentNode) || t;
    for (a.shadowRoot && a.tagName === o && (a = a.shadowRoot); l <= s; ++l) i[l] && ((r = H(null, n, l, t)), r && ((i[l].m = r), a.insertBefore(r, _(e))));
  },
  j = (t, e, o, n, l) => {
    for (; e <= o; ++e) (n = t[e]) && ((l = n.m), D(n), (i = !0), l['s-ol'] ? l['s-ol'].remove() : B(l, !0), l.remove());
  },
  I = (t, e) => t.g === e.g && ('slot' === t.g ? t.h === e.h : t.p === e.p),
  _ = t => (t && t['s-ol']) || t,
  G = t => (t['s-ol'] ? t['s-ol'] : t).parentNode,
  M = (t, e) => {
    const o = (e.m = t.m),
      n = t.u,
      i = e.u,
      l = e.g,
      r = e.l;
    let a;
    null === r
      ? ((s = 'svg' === l || ('foreignObject' !== l && s)),
        'slot' === l || A(t, e, s),
        null !== n && null !== i
          ? ((t, e, o, n) => {
              let i,
                l,
                s = 0,
                r = 0,
                a = 0,
                c = 0,
                d = e.length - 1,
                u = e[0],
                f = e[d],
                p = n.length - 1,
                h = n[0],
                b = n[p];
              for (; s <= d && r <= p; )
                if (null == u) u = e[++s];
                else if (null == f) f = e[--d];
                else if (null == h) h = n[++r];
                else if (null == b) b = n[--p];
                else if (I(u, h)) M(u, h), (u = e[++s]), (h = n[++r]);
                else if (I(f, b)) M(f, b), (f = e[--d]), (b = n[--p]);
                else if (I(u, b)) ('slot' !== u.g && 'slot' !== b.g) || B(u.m.parentNode, !1), M(u, b), t.insertBefore(u.m, f.m.nextSibling), (u = e[++s]), (b = n[--p]);
                else if (I(f, h)) ('slot' !== u.g && 'slot' !== b.g) || B(f.m.parentNode, !1), M(f, h), t.insertBefore(f.m, u.m), (f = e[--d]), (h = n[++r]);
                else {
                  for (a = -1, c = s; c <= d; ++c)
                    if (e[c] && null !== e[c].p && e[c].p === h.p) {
                      a = c;
                      break;
                    }
                  a >= 0
                    ? ((l = e[a]), l.g !== h.g ? (i = H(e && e[r], o, a, t)) : (M(l, h), (e[a] = void 0), (i = l.m)), (h = n[++r]))
                    : ((i = H(e && e[r], o, r, t)), (h = n[++r])),
                    i && G(u.m).insertBefore(i, _(u.m));
                }
              s > d ? T(t, null == n[p + 1] ? null : n[p + 1].m, o, n, r, p) : r > p && j(e, s, d);
            })(o, n, e, i)
          : null !== i
          ? (null !== t.l && (o.textContent = ''), T(o, null, e, i, 0, i.length - 1))
          : null !== n && j(n, 0, n.length - 1),
        s && 'svg' === l && (s = !1))
      : (a = o['s-cr'])
      ? (a.parentNode.textContent = r)
      : t.l !== r && (o.data = r);
  },
  O = t => {
    let e,
      o,
      n,
      i,
      l,
      s,
      r = t.childNodes;
    for (o = 0, n = r.length; o < n; o++)
      if (((e = r[o]), 1 === e.nodeType)) {
        if (e['s-sr'])
          for (l = e['s-sn'], e.hidden = !1, i = 0; i < n; i++)
            if (r[i]['s-hn'] !== e['s-hn'])
              if (((s = r[i].nodeType), '' !== l)) {
                if (1 === s && l === r[i].getAttribute('slot')) {
                  e.hidden = !0;
                  break;
                }
              } else if (1 === s || (3 === s && '' !== r[i].textContent.trim())) {
                e.hidden = !0;
                break;
              }
        O(e);
      }
  },
  R = [],
  F = t => {
    let e,
      o,
      n,
      l,
      s,
      r,
      a = 0,
      c = t.childNodes,
      d = c.length;
    for (; a < d; a++) {
      if (((e = c[a]), e['s-sr'] && (o = e['s-cr'])))
        for (n = o.parentNode.childNodes, l = e['s-sn'], r = n.length - 1; r >= 0; r--)
          (o = n[r]),
            o['s-cn'] ||
              o['s-nr'] ||
              o['s-hn'] === e['s-hn'] ||
              (P(o, l)
                ? ((s = R.find(t => t.v === o)),
                  (i = !0),
                  (o['s-sn'] = o['s-sn'] || l),
                  s ? (s.k = e) : R.push({ k: e, v: o }),
                  o['s-sr'] &&
                    R.map(t => {
                      P(t.v, o['s-sn']) && ((s = R.find(t => t.v === o)), s && !t.k && (t.k = s.k));
                    }))
                : R.some(t => t.v === o) || R.push({ v: o }));
      1 === e.nodeType && F(e);
    }
  },
  P = (t, e) => (1 === t.nodeType ? (null === t.getAttribute('slot') && '' === e) || t.getAttribute('slot') === e : t['s-sn'] === e || '' === e),
  D = t => {
    t.s && t.s.ref && t.s.ref(null), t.u && t.u.map(D);
  },
  N = (t, e, o) => {
    const n = t;
    return { emit: t => W(n, e, { bubbles: !!(4 & o), composed: !!(2 & o), cancelable: !!(1 & o), detail: t }) };
  },
  W = (t, e, o) => {
    const n = d.ce(e, o);
    return t.dispatchEvent(n), n;
  },
  q = (t, e) => {
    e && !t.$ && e['s-p'] && e['s-p'].push(new Promise(e => (t.$ = e)));
  },
  K = (t, e) => {
    if (((t.t |= 16), !(4 & t.t))) return q(t, t.L), mt(() => U(t, e));
    t.t |= 512;
  },
  U = (t, e) => {
    const o = t.S;
    let n;
    return e && (n = Y(o, 'componentWillLoad')), Z(n, () => V(t, o, e));
  },
  V = (s, r, a) => {
    const f = s.S,
      p = f['s-rc'];
    a &&
      (t => {
        const e = t.C,
          o = t.S,
          n = e.t,
          i = ((t, e) => {
            let o = b(e),
              n = dt.get(o);
            if (((t = 11 === t.nodeType ? t : c), n))
              if ('string' == typeof n) {
                let e,
                  i = h.get((t = t.head || t));
                i || h.set(t, (i = new Set())), i.has(o) || ((e = c.createElement('style')), (e.innerHTML = n), t.insertBefore(e, t.querySelector('link')), i && i.add(o));
              } else t.adoptedStyleSheets.includes(n) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, n]);
            return o;
          })(u && o.shadowRoot ? o.shadowRoot : o.getRootNode(), e);
        10 & n && ((o['s-sc'] = i), o.classList.add(i + '-h'), 2 & n && o.classList.add(i + '-s'));
      })(s);
    ((s, r) => {
      const a = s.S,
        f = s.C,
        p = s.A || w(null, null),
        h = (t => t && t.g === k)(r) ? r : y(null, null, r);
      if (
        ((o = a.tagName),
        f.H && ((h.s = h.s || {}), f.H.map(([t, e]) => (h.s[e] = a[t]))),
        (h.g = null),
        (h.t |= 4),
        (s.A = h),
        (h.m = p.m = a.shadowRoot || a),
        (t = a['s-sc']),
        (e = a['s-cr']),
        (n = u && 0 != (1 & f.t)),
        (i = !1),
        M(p, h),
        (d.t |= 1),
        l)
      ) {
        let t, e, o, n, i, l;
        F(h.m);
        let s = 0;
        for (; s < R.length; s++) (t = R[s]), (e = t.v), e['s-ol'] || ((o = c.createTextNode('')), (o['s-nr'] = e), e.parentNode.insertBefore((e['s-ol'] = o), e));
        for (s = 0; s < R.length; s++)
          if (((t = R[s]), (e = t.v), t.k)) {
            for (n = t.k.parentNode, i = t.k.nextSibling, o = e['s-ol']; (o = o.previousSibling); )
              if (((l = o['s-nr']), l && l['s-sn'] === e['s-sn'] && n === l.parentNode && ((l = l.nextSibling), !l || !l['s-nr']))) {
                i = l;
                break;
              }
            ((!i && n !== e.parentNode) || e.nextSibling !== i) && e !== i && (!e['s-hn'] && e['s-ol'] && (e['s-hn'] = e['s-ol'].parentNode.nodeName), n.insertBefore(e, i));
          } else 1 === e.nodeType && (e.hidden = !0);
      }
      i && O(h.m), (d.t &= -2), (R.length = 0);
    })(s, J(s, r)),
      p && (p.map(t => t()), (f['s-rc'] = void 0));
    {
      const t = f['s-p'],
        e = () => Q(s);
      0 === t.length ? e() : (Promise.all(t).then(e), (s.t |= 4), (t.length = 0));
    }
  },
  J = (t, e) => {
    try {
      (e = e.render()), (t.t &= -17), (t.t |= 2);
    } catch (o) {
      ct(o);
    }
    return e;
  },
  Q = t => {
    const e = t.S,
      o = t.L;
    64 & t.t || ((t.t |= 64), tt(e), t.B(e), o || X()), t.$ && (t.$(), (t.$ = void 0)), 512 & t.t && gt(() => K(t, !1)), (t.t &= -517);
  },
  X = () => {
    tt(c.documentElement), gt(() => W(a, 'appload', { detail: { namespace: 'lf-web-components' } }));
  },
  Y = (t, e, o) => {
    if (t && t[e])
      try {
        return t[e](o);
      } catch (n) {
        ct(n);
      }
  },
  Z = (t, e) => (t && t.then ? t.then(e) : e()),
  tt = t => t.classList.add('hydrated'),
  et = (t, e) => {
    if (e.T) {
      t.watchers && (e.j = t.watchers);
      const o = Object.entries(e.T),
        n = t.prototype;
      o.map(([t, [o]]) => {
        (31 & o || 32 & o) &&
          Object.defineProperty(n, t, {
            get() {
              return ((t, e) => st(this).I.get(e))(0, t);
            },
            set(o) {
              ((t, e, o, n) => {
                const i = st(t),
                  l = t,
                  s = i.I.get(e),
                  r = i.t,
                  a = l;
                if ((o = ((t, e) => (null == t || m(t) ? t : 4 & e ? 'false' !== t && ('' === t || !!t) : 2 & e ? parseFloat(t) : 1 & e ? t + '' : t))(o, n.T[e][0])) !== s) {
                  if ((i.I.set(e, o), n.j && 128 & r)) {
                    const t = n.j[e];
                    t &&
                      t.map(t => {
                        try {
                          a[t](o, s, e);
                        } catch (n) {
                          ct(n);
                        }
                      });
                  }
                  2 == (18 & r) && K(i, !1);
                }
              })(this, t, o, e);
            },
            configurable: !0,
            enumerable: !0,
          });
      });
      {
        const i = new Map();
        (n.attributeChangedCallback = function (t, e, o) {
          d.jmp(() => {
            const e = i.get(t);
            this[e] = (null !== o || 'boolean' != typeof this[e]) && o;
          });
        }),
          (t.observedAttributes = o
            .filter(([t, e]) => 15 & e[0])
            .map(([t, o]) => {
              const n = o[1] || t;
              return i.set(n, t), 512 & o[0] && e.H.push([t, n]), n;
            }));
      }
    }
    return t;
  },
  ot = (t, e) => {
    const o = { t: e[0], i: e[1] };
    return (
      (o.T = e[2]),
      (o.j = t.j),
      (o.H = []),
      !u && 1 & o.t && (o.t |= 8),
      Object.assign(t.prototype, {
        __registerHost() {
          rt(this, o);
        },
        connectedCallback() {
          (t => {
            if (0 == (1 & d.t)) {
              const e = st(t),
                o = e.C,
                n = () => {};
              if (!(1 & e.t)) {
                (e.t |= 1),
                  12 & o.t &&
                    (t => {
                      const e = (t['s-cr'] = c.createComment(''));
                      (e['s-cn'] = !0), t.insertBefore(e, t.firstChild);
                    })(t);
                {
                  let o = t;
                  for (; (o = o.parentNode || o.host); )
                    if (o['s-p']) {
                      q(e, (e.L = o));
                      break;
                    }
                }
                (async (t, e, o, n, i) => {
                  if (0 == (32 & e.t) && ((i = t.constructor), (e.t |= 160), i.style)) {
                    let t = i.style;
                    const e = b(o);
                    if (!dt.has(e)) {
                      const n = () => {};
                      8 & o.t &&
                        (t = await Promise.resolve()
                          .then(function () {
                            return oe;
                          })
                          .then(o => o.scopeCss(t, e, !1))),
                        ((t, e, o) => {
                          let n = dt.get(t);
                          f && o ? ((n = n || new CSSStyleSheet()), n.replace(e)) : (n = e), dt.set(t, n);
                        })(e, t, !!(1 & o.t)),
                        n();
                    }
                  }
                  const l = e.L,
                    s = () => K(e, !0);
                  l && l['s-rc'] ? l['s-rc'].push(s) : s();
                })(t, e, o);
              }
              n();
            }
          })(this);
        },
        disconnectedCallback() {},
      }),
      (t.is = o.i),
      et(t, o)
    );
  },
  nt = t => {
    u ? t.attachShadow({ mode: 'open' }) : (t.shadowRoot = t);
  },
  it = t => (d.o = t),
  lt = new WeakMap(),
  st = t => lt.get(t),
  rt = (t, e) => {
    const o = { t: 0, S: t, C: e, I: new Map() };
    return (o._ = new Promise(t => (o.B = t))), (t['s-p'] = []), (t['s-rc'] = []), lt.set(t, o);
  },
  at = (t, e) => e in t,
  ct = t => console.error(t),
  dt = new Map(),
  ut = [],
  ft = [],
  pt = (t, e) => o => {
    t.push(o), r || ((r = !0), e && 4 & d.t ? gt(bt) : d.raf(bt));
  },
  ht = t => {
    for (let o = 0; o < t.length; o++)
      try {
        t[o](performance.now());
      } catch (e) {
        ct(e);
      }
    t.length = 0;
  },
  bt = () => {
    ht(ut), ht(ft), (r = ut.length > 0) && d.raf(bt);
  },
  gt = t => Promise.resolve(void 0).then(t),
  mt = pt(ft, !0),
  xt = class extends HTMLElement {
    constructor() {
      super(), this.__registerHost(), nt(this), (this.buttonSizes = ['x-large', 'large', 'regular', 'small', 'x-small']), (this.buttonContexts = ['primary', 'secondary']);
    }
    renderTypographyExample() {
      return y(
        'div',
        { class: 'typography-container' },
        y(
          'div',
          { class: 'atlas-light table-row' },
          y('div', { class: 'font-label td' }, 'Light 300'),
          y('div', { class: 'td' }, 'The quick brown fox jumps over the lazy dog.'),
          y('div', { class: 'td' }, 'Scan'),
          y('div', { class: 'td' }, 'Cancel'),
          y('lf-button', { size: 'regular' }, 'Scan'),
        ),
        y(
          'div',
          { class: 'atlas-regular table-row' },
          y('div', { class: 'font-label td' }, 'Regular 400'),
          y('div', { class: 'td' }, 'The quick brown fox jumps over the lazy dog.'),
          y('div', { class: 'td' }, 'Scan'),
          y('div', { class: 'td' }, 'Cancel'),
          y('lf-button', { size: 'regular' }, 'Scan'),
        ),
        y(
          'div',
          { class: 'atlas-medium table-row' },
          y('div', { class: 'font-label td' }, 'Medium 500'),
          y('div', { class: 'td' }, 'The quick brown fox jumps over the lazy dog.'),
          y('div', { class: 'td' }, 'Scan'),
          y('div', { class: 'td' }, 'Cancel'),
          y('lf-button', { size: 'regular' }, 'Scan'),
        ),
        y(
          'div',
          { class: 'atlas-bold table-row' },
          y('div', { class: 'font-label td' }, 'Bold 700'),
          y('div', { class: 'td' }, 'The quick brown fox jumps over the lazy dog.'),
          y('div', { class: 'td' }, 'Scan'),
          y('div', { class: 'td' }, 'Cancel'),
          y('lf-button', { size: 'regular' }, 'Scan'),
        ),
      );
    }
    renderButtonsExample() {
      try {
        let t;
        return (
          (function (t) {
            (t.primary = 'Scan'), (t.secondary = 'Cancel');
          })(t || (t = {})),
          y(
            'div',
            { class: 'button-section--container' },
            y('h3', { class: 'section-header' }, 'UI Buttons'),
            this.buttonContexts.map(e =>
              y(
                'div',
                { class: 'btn-context-row' },
                y('h4', { class: 'btn-type-label' }, e),
                y(
                  'div',
                  { class: 'btn-container' },
                  y(
                    'lf-button',
                    {
                      class: 'btn-spacer',
                      size: 'regular',
                      disabled: !0,
                      context: e,
                      onClick: () => {
                        console.log('click');
                      },
                    },
                    t[e],
                  ),
                  y('div', { class: 'btn-size-label' }, 'Disabled'),
                ),
                this.buttonSizes.map(o =>
                  y(
                    'div',
                    { class: 'btn-container' },
                    y(
                      'lf-button',
                      {
                        class: 'btn-spacer',
                        size: o,
                        context: e,
                        onClick: () => {
                          console.log('click');
                        },
                      },
                      t[e],
                    ),
                    y('div', { class: 'btn-size-label' }, '' + o),
                  ),
                ),
              ),
            ),
            y(
              'div',
              { class: 'btn-context-row' },
              y('h4', { class: 'btn-type-label' }, 'Buttons with Icons'),
              y(
                'div',
                { class: 'btn-container' },
                y(
                  'lf-button',
                  { class: 'btn-spacer test', context: 'secondary', size: 'regular' },
                  y('img', { slot: 'start', src: '/assets/images/icons/Lock.svg' }),
                  y('span', null, 'Lock'),
                ),
                y('div', { class: 'btn-size-label' }, 'Secondary ', y('br', null), ' w/ Icon Start (reg)'),
              ),
              y(
                'div',
                { class: 'btn-container' },
                y(
                  'lf-button',
                  { class: 'btn-spacer', context: 'primary', size: 'regular' },
                  y('span', null, 'Unlock'),
                  y('img', { slot: 'end', src: '/assets/images/icons/Unlock.svg' }),
                ),
                y('div', { class: 'btn-size-label' }, 'Primary', y('br', null), ' w/ Icon End (reg)'),
              ),
            ),
            this.renderRoundButtons(),
          )
        );
      } catch (t) {
        console.error(t);
      }
    }
    renderRoundButtons() {
      return y(
        'div',
        { class: 'btn-context-row' },
        y('h4', { class: 'btn-type-label' }, 'Rounded Buttons'),
        y(
          'div',
          { class: 'btn-container' },
          y('lf-button', { class: 'btn-spacer', context: 'primary', size: 'regular', shape: 'round', disabled: !0 }, y('img', { src: '/assets/images/icons/Lock.svg' })),
          y('div', { class: 'btn-size-label' }, 'Disabled'),
        ),
        this.buttonSizes.map(t =>
          y(
            'div',
            { class: 'btn-container' },
            y('lf-button', { class: 'btn-spacer', size: t, context: 'primary', shape: 'round' }, y('img', { src: '/assets/images/icons/Lock.svg' })),
            y('div', { class: 'btn-size-label' }, '' + t),
          ),
        ),
      );
    }
    renderWifiListScssCode() {
      return y('pre', null, y('code', null, 'lf-subheader { \r\n --background: #{$color-brand-lf-green-base}; \r\n}'));
    }
    renderTextInputsExample() {
      return [
        y(
          'div',
          { class: 'lf-text-inputs-container' },
          y('lf-text-input', { label: 'Default Label', placeholder: 'Placeholder Text', size: 20 }),
          y('lf-text-input', { label: 'Stacked Label w/ clear', labelPosition: 'stacked', placeholder: 'Stacked', clearInput: !0 }),
          y('lf-text-input', { label: 'Password', labelPosition: 'stacked', placeholder: 'Enter Password', type: 'password' }),
        ),
        y(
          'div',
          { class: 'lf-text-inputs-container' },
          y('lf-text-input', { label: 'Input Expands', expand: 'fill', class: 'item', placeholder: 'Watch me grow' }),
          y('lf-text-input', { label: 'Date', placeholder: 'Enter Date', type: 'date' }),
        ),
        y(
          'div',
          { class: 'lf-text-inputs-container' },
          y('lf-text-input', { label: 'Invalid', labelPosition: 'stacked', placeholder: 'This is no good', invalid: !0 }),
          y('lf-text-input', { label: 'Disabled', labelPosition: 'stacked', disabled: !0, class: 'item', placeholder: 'No touchy!!' }),
        ),
      ];
    }
    render() {
      return y(
        k,
        null,
        y(
          'div',
          { class: 'design-sheet--wrapper' },
          y('div', { class: 'design-sheet--hero' }, y('h1', { class: 'hero--text' }, 'Lightform Design Sheet')),
          y('div', { class: 'lf-text-inputs design-sheet--example' }, y('h3', { class: 'section-header' }, 'Typography'), this.renderTypographyExample()),
          y('div', { class: 'lf-buttons design-sheet--example' }, this.renderButtonsExample()),
          y('div', { class: 'lf-text-inputs design-sheet--example' }, y('h3', { class: 'section-header' }, 'Text Inputs'), this.renderTextInputsExample()),
          y(
            'div',
            { class: 'wifi-list design-sheet--example' },
            y('h3', { class: 'section-header' }, 'Native Wifi List'),
            y('lf-wifi-list', null),
            y('br', null),
            y('p', { class: 'section-subheader' }, 'Styling Example'),
            y(
              'p',
              { class: 'section-subheader' },
              'Implementation of lf-list, lf-subheader, and lf-list-item',
              y('br', null),
              "Example of custom flavorings through the component's api:",
              ' ',
              y('br', null),
              'subheader in green, 2nd list item disabled',
            ),
            this.renderWifiListScssCode(),
          ),
        ),
      );
    }
    static get style() {
      return ':host{height:100%;width:100%;overflow-y:scroll;-webkit-box-sizing:border-box;box-sizing:border-box;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;padding:2rem}:host .design-sheet--wrapper{border:3px solid #2c65ff;background-color:#161618;color:white;padding:1rem;border-radius:0.5rem}:host .design-sheet--hero{margin:2rem auto;text-align:center}:host .design-sheet--hero .hero--text{font-size:3rem;font-family:"AtlasGrotesk-Light", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal}:host .design-sheet--example{max-width:66%;margin:0 auto;justify-self:center;padding:4rem 0;border-bottom:1px solid grey}:host .section-header{font-family:"AtlasGrotesk-Regular", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;color:#2c65ff;font-size:1.5rem;margin-bottom:0.2rem}:host .section-subheader{font-family:"AtlasGrotesk-Regular", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;color:#2c65ff;font-size:1rem;margin:0 0 1rem}:host .typography-container{font-size:16px;color:#ffffff;padding:20px 0 0 20px;display:table}:host .typography-container .font-label{font-size:24px;line-height:36px;padding-right:16px}:host .typography-container .table-row{display:table-row}:host .typography-container .td{display:table-cell;padding:5px}:host .typography-container .atlas-light{font-family:"AtlasGrotesk-Light", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal}:host .typography-container .atlas-light lf-button{--font-family:"AtlasGrotesk-Light", "Helvetica", sans-serif !important}:host .typography-container .atlas-regular{font-family:"AtlasGrotesk-Regular", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal}:host .typography-container .atlas-regular lf-button{--font-family:"AtlasGrotesk-Regular", "Helvetica", sans-serif !important}:host .typography-container .atlas-medium{font-family:"AtlasGrotesk-Medium", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal}:host .typography-container .atlas-medium lf-button{--font-family:"AtlasGrotesk-Medium", "Helvetica", sans-serif !important}:host .typography-container .atlas-bold{font-family:"AtlasGrotesk-Bold", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal}:host .typography-container .atlas-bold lf-button{--font-family:"AtlasGrotesk-Bold", "Helvetica", sans-serif !important}:host .typography-container lf-button{margin:10px}:host lf-subheader{--background:#12A37B}:host .btn-type-label{font-family:"AtlasGrotesk-Light", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;text-transform:capitalize}:host lf-subheader{--background:#12A37B}:host .btn-type-label{font-family:"AtlasGrotesk-Light", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;text-transform:capitalize}:host lf-subheader{--background:#12A37B}:host .btn-type-label{font-family:"AtlasGrotesk-Light", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;text-transform:capitalize}:host .btn-container{display:inline-block;padding:1rem}:host .btn-type-label{margin-left:1rem;margin:0 1rem}:host .btn-size-label{font-family:"AtlasGrotesk-Light", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;color:#fff;font-size:0.8rem;text-align:center;margin-top:5px;text-transform:uppercase}pre{background:#161618;border:1px solid #3c3e47;border-left:3px solid #d43333;color:#12A37B;page-break-inside:avoid;font-family:monospace;font-size:15px;line-height:1.6;margin-bottom:1.6em;max-width:100%;overflow:auto;padding:1em 1.5em;display:block;word-wrap:break-word}.lf-text-inputs-container{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-align:end;align-items:flex-end;-ms-flex-wrap:wrap;flex-wrap:wrap}';
    }
  },
  vt = class extends HTMLElement {
    constructor() {
      super(),
        this.__registerHost(),
        nt(this),
        (this.lfBLur = N(this, 'lfBLur', 7)),
        (this.lfFocus = N(this, 'lfFocus', 7)),
        (this.size = 'regular'),
        (this.context = 'primary'),
        (this.disabled = !1),
        (this.type = 'button');
    }
    onBlur() {
      try {
        this.lfBLur.emit();
      } catch (t) {
        console.error(t);
      }
    }
    onFocus() {
      try {
        this.lfBLur.emit();
      } catch (t) {
        console.error(t);
      }
    }
    render() {
      try {
        const { context: t, disabled: e, expand: o, rel: n, target: i, href: l, type: s, shape: r } = this,
          a = void 0 === l ? 'button' : 'a';
        return y(
          k,
          {
            class: `\n          lf-button \n          lf-button--context-${t} \n          lf-button--size-${this.size} \n          ${r ? 'lf-button--' + r : ''}\n          ${
              e ? 'lf-button--disabled' : ''
            }\n          ${o ? 'lf-button--expand' : ''}\n          `,
            'aria-disabled': e ? 'true' : null,
          },
          y(
            a,
            Object.assign({}, 'button' === a ? { type: s } : { href: l, rel: n, target: i }, {
              disabled: e,
              tabindex: '0',
              role: 'button',
              part: 'native',
              class: 'native-element',
              onBlur: () => {
                this.onBlur();
              },
              onFocus: () => {
                this.onFocus();
              },
            }),
            y('span', { class: 'lf-button--content' }, y('slot', { name: 'start' }), y('span', { class: 'slot--wrapper' }, y('slot', null)), y('slot', { name: 'end' })),
          ),
        );
      } catch (t) {
        console.error(t);
      }
    }
    get el() {
      return this;
    }
    static get style() {
      return ':host{--border-radius:4px;--border-width:0px;--font-family:"AtlasGrotesk-Medium", "Helvetica", sans-serif;--background:#12A37B;--background-active:#17e8b0;--background-hover:#15c595;display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-webkit-box-sizing:border-box;box-sizing:border-box;cursor:pointer;border-radius:var(--border-radius);border-width:var(--border-width);-webkit-transition-duration:0.15s;transition-duration:0.15s;-webkit-transition-property:opacity, background-color, -webkit-box-shadow, -webkit-transform;transition-property:opacity, background-color, -webkit-box-shadow, -webkit-transform;transition-property:box-shadow, transform, opacity, background-color;transition-property:box-shadow, transform, opacity, background-color, -webkit-box-shadow, -webkit-transform;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}:host .native-element{font-family:var(--font-family);-webkit-box-sizing:border-box;box-sizing:border-box;background-color:unset;color:#ffffff;border-style:none;border-radius:unset;-webkit-appearance:none;-moz-appearance:none;appearance:none;-ms-flex-align:center;align-items:center;display:-ms-inline-flexbox;display:inline-flex;-ms-flex:0 0 auto;flex:0 0 auto;letter-spacing:0.03em;-ms-flex-pack:center;justify-content:center;outline:0;position:relative;text-decoration:none;text-indent:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle;white-space:nowrap;appearance:none;width:100%;height:100%;cursor:pointer;padding:unset}:host .native-element:disabled{pointer-events:none}.lf-button--content{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;z-index:1;margin:0}:host(lf-button.lf-button--context-primary){--background:#12A37B;--background-active:#17e8b0;--background-hover:#15c595;background-color:var(--background);opacity:1}:host(lf-button.lf-button--context-primary:hover:not(.lf-button--disabled)){background-color:var(--background-hover)}:host(lf-button.lf-button--context-primary:active:not(.lf-button--disabled)){background-color:var(--background-active)}:host(lf-button.lf-button--context-secondary){--background:#3c3e47;--background-active:#17e8b0;--background-hover:#15c595;background-color:var(--background);opacity:1}:host(lf-button.lf-button--context-secondary:hover:not(.lf-button--disabled)){background-color:var(--background-hover)}:host(lf-button.lf-button--context-secondary:active:not(.lf-button--disabled)){background-color:var(--background-active)}:host(lf-button.lf-button--context-ui){background-color:#3c3e47;opacity:1}:host(lf-button.lf-button--context-ui:hover:not(.lf-button--disabled)){background-color:#232326}:host(lf-button.lf-button--context-ui:active:not(.lf-button--disabled)){background-color:#2352d0}:host(lf-button.lf-button--disabled){opacity:0.5;pointer-events:none}:host(lf-button.lf-button--size-x-large){padding:22.4px 44.8px}:host(lf-button.lf-button--size-x-large) .slot--wrapper{font-size:22.4px;line-height:22.4px}:host(lf-button.lf-button--size-x-large.lf-button--context-ui){text-align:0.9;padding:1.26em 4.2em}:host(lf-button.lf-button--size-x-large.lf-button--context-ui) .slot--wrapper{font-size:22.4px;line-height:22.4px}:host(lf-button.lf-button--size-large){padding:19.2px 38.4px}:host(lf-button.lf-button--size-large) .slot--wrapper{font-size:19.2px;line-height:19.2px}:host(lf-button.lf-button--size-large.lf-button--context-ui){text-align:0.9;padding:1.08em 3.6em}:host(lf-button.lf-button--size-large.lf-button--context-ui) .slot--wrapper{font-size:19.2px;line-height:19.2px}:host(lf-button.lf-button--size-regular){padding:16px 32px}:host(lf-button.lf-button--size-regular) .slot--wrapper{font-size:16px;line-height:16px}:host(lf-button.lf-button--size-regular.lf-button--context-ui){text-align:0.9;padding:0.9em 3em}:host(lf-button.lf-button--size-regular.lf-button--context-ui) .slot--wrapper{font-size:16px;line-height:16px}:host(lf-button.lf-button--size-small){padding:12.8px 25.6px}:host(lf-button.lf-button--size-small) .slot--wrapper{font-size:12.8px;line-height:12.8px}:host(lf-button.lf-button--size-small.lf-button--context-ui){text-align:0.9;padding:0.72em 2.4em}:host(lf-button.lf-button--size-small.lf-button--context-ui) .slot--wrapper{font-size:12.8px;line-height:12.8px}:host(lf-button.lf-button--size-x-small){padding:9.6px 19.2px}:host(lf-button.lf-button--size-x-small) .slot--wrapper{font-size:9.6px;line-height:9.6px}:host(lf-button.lf-button--size-x-small.lf-button--context-ui){text-align:0.9;padding:0.54em 1.8em}:host(lf-button.lf-button--size-x-small.lf-button--context-ui) .slot--wrapper{font-size:9.6px;line-height:9.6px}:host(lf-button.lf-button--size-x-large.lf-button--round){border-radius:50%;padding:1.575rem}:host(lf-button.lf-button--size-x-large.lf-button--round) .slot--wrapper,:host(lf-button.lf-button--size-x-large.lf-button--round) ::slotted(img){width:2.1rem;height:2.1rem}:host(lf-button.lf-button--size-large.lf-button--round){border-radius:50%;padding:1.35rem}:host(lf-button.lf-button--size-large.lf-button--round) .slot--wrapper,:host(lf-button.lf-button--size-large.lf-button--round) ::slotted(img){width:1.8rem;height:1.8rem}:host(lf-button.lf-button--size-regular.lf-button--round){border-radius:50%;padding:1.125rem}:host(lf-button.lf-button--size-regular.lf-button--round) .slot--wrapper,:host(lf-button.lf-button--size-regular.lf-button--round) ::slotted(img){width:1.5rem;height:1.5rem}:host(lf-button.lf-button--size-small.lf-button--round){border-radius:50%;padding:0.9rem}:host(lf-button.lf-button--size-small.lf-button--round) .slot--wrapper,:host(lf-button.lf-button--size-small.lf-button--round) ::slotted(img){width:1.2rem;height:1.2rem}:host(lf-button.lf-button--size-x-small.lf-button--round){border-radius:50%;padding:0.675rem}:host(lf-button.lf-button--size-x-small.lf-button--round) .slot--wrapper,:host(lf-button.lf-button--size-x-small.lf-button--round) ::slotted(img){width:0.9rem;height:0.9rem}::slotted(*){margin:initial}::slotted(img){height:1.1em;pointer-events:none}::slotted(img[slot=start]){margin:0 0.6em 0 -0.3rem;-ms-flex-item-align:center;align-self:center}::slotted(img[slot=end]){margin:0 0.2rem 0 0.6em;-ms-flex-item-align:center;align-self:center}:host(lf-button.lf-button--expand){width:100%}';
    }
  },
  yt = class extends HTMLElement {
    constructor() {
      super(), this.__registerHost(), nt(this), (this.disabled = !1), (this.striped = !1);
    }
    getListClassName() {
      let t = 'lf-list';
      return this.disabled && (t += ' lf-list--disabled'), this.striped && (t += ' lf-list--striped'), t;
    }
    render() {
      const { disabled: t } = this;
      return y(
        k,
        {
          class: this.getListClassName(),
          'aria-disabled': t ? 'true' : null,
          ref: t => {
            this.hostEl = t;
          },
        },
        y('div', { class: 'native-element', part: 'native', role: 'list' }, y('slot', null)),
      );
    }
    get listItemEl() {
      return this;
    }
    static get style() {
      return ':host{--height:initial;--min-height:3rem;--max-height:initial;--width:100%;--min-width:3rem;--max-width:initial;--background:initial;--list-item-background-odd:#1a1a1c;--list-item-background-even:#232326;--border-radius:0;--border-width:0;--border-style:solid;--border-color:transparent;display:block;position:relative;outline:none;text-align:initial;text-decoration:none;overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box;background:var(--background);border-style:solid;border-width:var(--border-width);border-color:var(--border-color);border-radius:var(--border-radius);width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);font-family:"AtlasGrotesk-Regular", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal}.native-element{background:var(--background);height:100%;width:100%}:host(.lf-list--disabled){pointer-events:none}:host(.lf-list--disabled) *{opacity:0.4}:host(lf-list.lf-list--striped) ::slotted(lf-list-item:nth-of-type(odd)){--background:var(--list-item-background-odd)}:host(lf-list.lf-list--striped) ::slotted(lf-list-item:nth-of-type(even)){--background:var(--list-item-background-even)}';
    }
  },
  wt = class extends HTMLElement {
    constructor() {
      super(), this.__registerHost(), nt(this), (this.button = !1), (this.active = !1), (this.disabled = !1), (this.type = 'button');
    }
    isClickable() {
      try {
        return void 0 !== this.href || this.button;
      } catch (t) {
        console.error(t);
      }
    }
    getListItemClassName() {
      try {
        let t = 'lf-list-item';
        return this.disabled && (t += ' lf-list-item--disabled'), this.active && (t += ' lf-list-item--active'), t;
      } catch (t) {
        console.error(t);
      }
    }
    render() {
      try {
        const { disabled: t, href: e, rel: o, target: n } = this,
          i = this.isClickable() ? (void 0 === this.href ? 'button' : 'a') : 'div',
          l = 'button' === i ? { type: this.type } : { href: e, rel: o, target: n };
        return y(
          k,
          {
            class: this.getListItemClassName(),
            'aria-disabled': t ? 'true' : null,
            ref: t => {
              this.listItem = t;
            },
            tabindex: '0',
          },
          y(
            i,
            Object.assign({}, l, { class: 'native-element', role: 'listitem' }),
            y('slot', { name: 'start' }),
            y('div', { class: 'lf-list-item--slot-wrapper' }, y('slot', null)),
            y('slot', { name: 'end' }),
          ),
        );
      } catch (t) {
        console.error(t);
      }
    }
    get listItemEl() {
      return this;
    }
    static get style() {
      return ':host{--background:#232326;--background-active:#2c65ff;--background-active-opacity:1;--background-focus:#232326;--background-focus-opacity:1;--background-hover:#232326;--background-hover-opacity:1;--border-radius:4px;--border-width:2px;--border-style:solid;--border-color:transparent;--border-color-active:#2c65ff;--border-color-focus:transparent;--border-color-hover:#2352d0;--padding-top:0px;--padding-bottom:0px;--padding-right:1rem;--padding-left:1rem;--outer-padding-top:0rem;--outer-padding-bottom:0rem;--outer-padding-right:0rem;--outer-padding-left:0rem;--color:#ffffff;--color-active:var(--color);--color-focus:var(--color);--color-hover:var(--color);display:-ms-flexbox;display:flex;position:relative;outline:none;text-align:initial;text-decoration:none;overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:1}button{width:100%;-webkit-appearance:unset;-moz-appearance:unset;appearance:unset;background:unset;color:unset;border:unset;padding:unset;font:unset;cursor:unset;outline:unset}:host(lf-list-item){padding:var(--outer-padding-top) var(--outer-padding-right) var(--outer-padding-bottom) var(--outer-padding-left);text-decoration:none;background:var(--background);border-style:var(--border-style);border-color:var(--border-color);border-width:var(--border-width);color:var(--color);-webkit-transition-duration:0.2s;transition-duration:0.2s;-webkit-transition-property:border-color, background-color;transition-property:border-color, background-color;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);margin:var(--outer-padding-top) var(--outer-padding-right) var(--outer-padding-bottom) var(--outer-padding-left)}:host(lf-list-item) button,:host(lf-list-item) a{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-user-drag:none}:host(lf-list-item) a{color:unset;text-decoration:unset}.native-element{display:-ms-flexbox;display:flex;-ms-flex:1 1 100%;flex:1 1 100%;width:100%;-ms-flex-align:center;align-items:center;-ms-flex-direction:row;flex-direction:row;padding:var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left)}.native-element:hover,.native-element:focus,.native-element:active{outline:none}:host(lf-list-item:focus-within){border-color:var(--border-color-focus);background-color:var(--background-focus);opacity:var(--background-focus-opacity);color:var(--color-focus);outline:none}:host(lf-list-item.lf-list-item--active,lf-list-item:active){background-color:var(--background-active);border-color:var(--border-color-active);opacity:var(--background-active-opacity);color:var(--color-active);outline:none}:host(lf-list-item:hover){background-color:var(--background-hover);border-color:var(--border-color-hover);opacity:var(--background-hover-opacity);color:var(--color-hover);outline:none}:host(.lf-list-item--disabled){pointer-events:none}:host(.lf-list-item--disabled) *{opacity:0.4}.lf-list-item--slot-wrapper{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;overflow:hidden;padding:0.8rem 0}::slotted(*),.lf-list-item--slot-wrapper{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center}slot[name=start]::slotted(*){margin-right:0.63rem;min-width:1.5rem;justify-self:flex-left}:host slot[name=end]::slotted(*){margin-left:auto;min-width:1.5rem;justify-self:flex-right}';
    }
  },
  kt = class extends HTMLElement {
    constructor() {
      super(), this.__registerHost(), nt(this), (this.inset = !1);
    }
    getClassName() {
      let t = 'lf-subheader';
      return this.inset && (t += ' lf-subheader--inset'), t;
    }
    render() {
      return y(
        k,
        { class: this.getClassName() },
        y(
          'div',
          { class: 'native-element', part: 'native' },
          y('slot', { name: 'start' }),
          y('div', { class: 'lf-subheader--slot-wrapper' }, y('slot', null)),
          y('slot', { name: 'end' }),
        ),
      );
    }
    get element() {
      return this;
    }
    static get style() {
      return ':host{--background:#2c65ff;--color:#ffffff;--inset:3rem;--min-height:3rem;--max-height:initial;--padding-top:0;--padding-bottom:0;--padding-right:1rem;--padding-left:0;--outer-padding-top:0rem;--outer-padding-bottom:0rem;--outer-padding-right:0rem;--outer-padding-left:0rem;-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex;min-height:var(--min-height);max-height:var(--max-height);font-size:0.875rem}:host(lf-subheader){padding:var(--outer-padding-top) var(--outer-padding-right) var(--outer-padding-bottom) var(--outer-padding-left);text-decoration:none;background:var(--background);border-style:var(--border-style);border-color:var(--border-color);border-width:var(--border-width);color:var(--color);margin:var(--outer-padding-top) var(--outer-padding-right) var(--outer-padding-bottom) var(--outer-padding-left)}:host(lf-subheader.lf-subheader--inset) .native-element{margin-left:var(--inset)}.native-element{display:-ms-flexbox;display:flex;-ms-flex:1 1 100%;flex:1 1 100%;width:100%;-ms-flex-align:center;align-items:center;-ms-flex-direction:row;flex-direction:row;padding:var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left)}.native-element:hover,.native-element:focus,.native-element:active{outline:none}.lf-subheader--slot-wrapper{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;overflow:hidden;padding:0.8rem 0}::slotted(*),.lf-list-item--slot-wrapper{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center}slot[name=start]::slotted(*){margin-right:0.63rem;min-width:1.5rem;justify-self:flex-left}:host slot[name=end]::slotted(*){margin-left:auto;min-width:1.5rem;justify-self:flex-right}';
    }
  },
  zt = (t, e = 0) => {
    let o;
    return (...n) => {
      clearTimeout(o), (o = setTimeout(t, e, ...n));
    };
  },
  $t = class extends HTMLElement {
    constructor() {
      super(),
        this.__registerHost(),
        (this.lfInput = N(this, 'lfInput', 7)),
        (this.lfChange = N(this, 'lfChange', 7)),
        (this.lfBlur = N(this, 'lfBlur', 7)),
        (this.lfFocus = N(this, 'lfFocus', 7)),
        (this.lfStyle = N(this, 'lfStyle', 7)),
        (this.inputId = 'lf-text-input-' + Lt++),
        (this.didBlurAfterEdit = !1),
        (this.fireFocusEvents = !0),
        (this.hasFocus = !1),
        (this.autocapitalize = 'off'),
        (this.autofocus = !1),
        (this.clearInput = !1),
        (this.clearIconColor = '#FFF'),
        (this.debounce = 0),
        (this.invalid = !1),
        (this.disabled = !1),
        (this.name = this.inputId),
        (this.readonly = !1),
        (this.required = !1),
        (this.expand = 'block'),
        (this.type = 'text'),
        (this.value = ''),
        (this.onInput = t => {
          const e = t.target;
          e && (this.value = e.value || ''), this.lfInput.emit(t);
        }),
        (this.onBlur = t => {
          (this.hasFocus = !1), this.focusChanged(), this.emitStyle(), this.fireFocusEvents && this.lfBlur.emit(t);
        }),
        (this.onFocus = t => {
          (this.hasFocus = !0), this.focusChanged(), this.emitStyle(), this.fireFocusEvents && this.lfFocus.emit(t);
        }),
        (this.onKeydown = t => {
          this.shouldClearOnEdit() && (this.didBlurAfterEdit && this.hasValue() && 'Enter' !== t.key && this.clearTextInput(), (this.didBlurAfterEdit = !1));
        }),
        (this.clearTextOnEnter = t => {
          'Enter' === t.key && this.clearTextInput(t);
        }),
        (this.clearTextInput = t => {
          this.clearInput && !this.readonly && !this.disabled && t && (t.preventDefault(), t.stopPropagation(), this.setFocus()),
            (this.value = ''),
            this.nativeInput && (this.nativeInput.value = '');
        });
    }
    debounceChanged() {
      this.lfChange = ((t, e) => {
        const o = t._original || t;
        return { _original: t, emit: zt(o.emit.bind(o), e) };
      })(this.lfChange, this.debounce);
    }
    invalidChanged() {
      this.emitStyle();
    }
    disabledChanged() {
      this.emitStyle();
    }
    valueChanged() {
      this.emitStyle(), this.lfChange.emit({ value: null == this.value ? this.value : '' + this.value });
    }
    componentWillLoad() {
      if (this.el.hasAttribute('tabindex')) {
        const t = this.el.getAttribute('tabindex');
        (this.tabindex = null !== t ? t : void 0), this.el.removeAttribute('tabindex');
      }
      this.label && void 0 === this.labelPosition && (this.labelPosition = 'fixed');
    }
    async setFocus() {
      this.nativeInput && this.nativeInput.focus();
    }
    async setBlur() {
      this.nativeInput && this.nativeInput.blur();
    }
    getInputElement() {
      return Promise.resolve(this.nativeInput);
    }
    shouldClearOnEdit() {
      const { type: t, clearOnEdit: e } = this;
      return void 0 === e ? 'password' === t : e;
    }
    getValue() {
      return 'number' == typeof this.value ? '' + this.value : '' + (this.value || '');
    }
    emitStyle() {
      this.lfStyle.emit({
        interactive: !0,
        input: !0,
        'has-placeholder': null != this.placeholder,
        'has-value': this.hasValue(),
        'has-focus': this.hasFocus,
        'interactive-disabled': this.disabled,
        'input-invalid': this.invalid,
      });
    }
    focusChanged() {
      !this.hasFocus && this.shouldClearOnEdit() && this.hasValue() && (this.didBlurAfterEdit = !0);
    }
    hasValue() {
      return this.getValue().length > 0;
    }
    getClassName() {
      try {
        let t = 'lf-text-input';
        return (
          this.disabled && (t += ' lf-text-input--disabled'),
          this.invalid && (t += ' lf-text-input--invalid'),
          this.hasValue() ? (t += ' lf-text-input--has-value') : (t += ' lf-text-input--empty'),
          this.hasFocus && (t += ' lf-text-input--has-focus'),
          this.expand && (t = `${t} lf-text-input--expand-${this.expand}`),
          this.labelPosition ? (t = `${t} lf-text-input--label-position-${this.labelPosition}`) : (t += ' lf-text-input--label-position-fixed'),
          t
        );
      } catch (t) {
        console.error(t);
      }
    }
    render() {
      try {
        const t = this.getValue(),
          e = this.inputId + '--label',
          o = 'textarea' === this.type ? 'textarea' : 'input';
        let n;
        return (
          this.label && (n = { id: e, class: 'lf-text-input--label', htmlFor: this.inputId, 'aria-owns': this.inputId }),
          y(
            k,
            { 'aria-disabled': this.disabled ? 'true' : null, class: this.getClassName() },
            this.label && y('span', { class: 'lf-text-input--label-wrapper' }, y('label', Object.assign({}, n), this.label)),
            y(
              'div',
              { class: 'lf-text-input--wrapper' },
              y(o, {
                id: this.inputId,
                class: 'native-input',
                ref: t => (this.nativeInput = t),
                'aria-labelledby': e,
                disabled: this.disabled,
                autoCapitalize: this.autocapitalize,
                autoFocus: this.autofocus,
                min: this.min,
                max: this.max,
                minLength: this.minlength,
                maxLength: this.maxlength,
                multiple: this.multiple,
                name: this.name,
                pattern: this.pattern,
                placeholder: this.placeholder || '',
                readOnly: this.readonly,
                required: this.required,
                step: this.step,
                size: this.size,
                tabindex: this.tabindex,
                type: this.type,
                value: t,
                onInput: this.onInput,
                onBlur: this.onBlur,
                onFocus: this.onFocus,
                onKeyDown: this.onKeydown,
              }),
              this.clearInput &&
                !this.readonly &&
                !this.disabled &&
                y(
                  'button',
                  {
                    'aria-label': 'reset',
                    type: 'button',
                    class: 'input--clear-icon',
                    onTouchStart: this.clearTextInput,
                    onMouseDown: this.clearTextInput,
                    onKeyDown: this.clearTextOnEnter,
                  },
                  y(
                    'svg',
                    { width: '12', height: '12', viewBox: '0 0 12 12', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
                    y('path', { d: 'M1.5 1.5L10.5 10.5', stroke: this.clearIconColor, 'stroke-width': '2' }),
                    y('path', { d: 'M1.5 10.5L10.5 1.5', stroke: this.clearIconColor, 'stroke-width': '2' }),
                  ),
                ),
            ),
          )
        );
      } catch (t) {
        console.error(t);
      }
    }
    get el() {
      return this;
    }
    static get watchers() {
      return { debounce: ['debounceChanged'], disabled: ['invalidChanged', 'disabledChanged'], value: ['valueChanged'] };
    }
    static get style() {
      return '.sc-lf-text-input-h{--background:#232326;--color:#ffffff;--border-radius:2px;--border-color:#232326;--border-width:1px;--border-color-input-dirty:transparent;--border-color-focus:#2c65ff;--placeholder-color:#575c6d;--placeholder-opacity:1;--label-color:#babfd1;--label-padding-top:0;--label-padding-right:0;--label-padding-bottom:0.75rem;--label-padding-left:0;--padding-top:12px;--padding-right:2rem;--padding-bottom:12px;--padding-left:16px;display:-ms-flexbox;display:flex;-ms-flex:1 0 auto;flex:1 0 auto;position:relative;-ms-flex-align:center;align-items:center;justify-items:flex-start;padding:0 1.25rem 1.25rem 0;z-index:2}.native-input.sc-lf-text-input{background:var(--background);border-width:var(--border-width);border-color:var(--border-color);border-radius:var(--border-radius);border-style:solid;-webkit-transition:border 0.2s linear;transition:border 0.2s linear;padding:var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);display:-ms-inline-flexbox;display:inline-flex;-ms-flex:1;flex:1;outline:none;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-appearance:none;-moz-appearance:none;appearance:none;font-family:"AtlasGrotesk-Regular", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;color:var(--color);font-size:16px}.native-input.sc-lf-text-input::-webkit-input-placeholder{font-family:"AtlasGrotesk-Regular", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;color:var(--placeholder-color);font-size:16px;color:var(--placeholder-color);opacity:var(--placeholder-opacity)}.native-input.sc-lf-text-input::-moz-placeholder{font-family:"AtlasGrotesk-Regular", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;color:var(--placeholder-color);font-size:16px;color:var(--placeholder-color);opacity:var(--placeholder-opacity)}.native-input.sc-lf-text-input:-ms-input-placeholder{font-family:"AtlasGrotesk-Regular", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;color:var(--placeholder-color);font-size:16px;color:var(--placeholder-color);opacity:var(--placeholder-opacity)}.native-input.sc-lf-text-input::-ms-input-placeholder{font-family:"AtlasGrotesk-Regular", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;color:var(--placeholder-color);font-size:16px;color:var(--placeholder-color);opacity:var(--placeholder-opacity)}.native-input.sc-lf-text-input::placeholder{font-family:"AtlasGrotesk-Regular", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;color:var(--placeholder-color);font-size:16px;color:var(--placeholder-color);opacity:var(--placeholder-opacity)}.native-input.native-input.sc-lf-text-input:-webkit-autofill{background-color:var(--background) !important}.native-input.sc-lf-text-input:invalid{-webkit-box-shadow:none;box-shadow:none}.native-input.sc-lf-text-input::-ms-clear{display:none}.lf-text-input--wrapper.sc-lf-text-input{position:relative;-ms-flex-item-align:start;align-self:flex-start;-ms-flex-positive:1;flex-grow:1}button.sc-lf-text-input{width:100%;-webkit-appearance:unset;-moz-appearance:unset;appearance:unset;background:unset;color:unset;border:unset;padding:unset;font:unset;cursor:unset;outline:unset}.input--clear-icon.sc-lf-text-input{position:absolute;right:0;top:0;bottom:0;margin:auto 0.5rem auto;padding:0;background-position:center;background-color:transparent;background-repeat:no-repeat;outline:none;height:1rem;width:1rem;visibility:hidden;-webkit-appearance:none;-moz-appearance:none;appearance:none}.input--clear-icon.sc-lf-text-input *.sc-lf-text-input{display:block;position:relative}.input--clear-icon.sc-lf-text-input:hover{opacity:0.75}.input--clear-icon.sc-lf-text-input:active{opacity:0.5}.lf-text-input--has-value.sc-lf-text-input-h .input--clear-icon.sc-lf-text-input{visibility:visible}.native-input.sc-lf-text-input:-internal-autofill-selected+.input--clear-icon.sc-lf-text-input path.sc-lf-text-input,.native-input.sc-lf-text-input:-webkit-autofill+.input--clear-icon.sc-lf-text-input path.sc-lf-text-input{stroke:#000}.sc-lf-text-input::-webkit-calendar-picker-indicator{-webkit-filter:invert(1);filter:invert(1);position:relative}.lf-text-input--has-value.sc-lf-text-input-h .native-input.sc-lf-text-input{border-color:var(--border-color-input-dirty)}.lf-text-input--has-focus.sc-lf-text-input-h .native-input.sc-lf-text-input{pointer-events:none;border-color:var(--border-color-focus)}.lf-text-input--has-focus.sc-lf-text-input-h input.sc-lf-text-input,.lf-text-input--has-focus.sc-lf-text-input-h a.sc-lf-text-input,.lf-text-input--has-focus.sc-lf-text-input-h button.sc-lf-text-input{pointer-events:auto}lf-text-input.sc-lf-text-input-h .lf-text-input--label-wrapper.sc-lf-text-input{font-family:"AtlasGrotesk-Regular", "Helvetica", sans-serif;font-weight:normal;font-style:normal;font-stretch:normal;color:var(--label-color);font-size:14px}.lf-text-input--label-position-fixed.sc-lf-text-input-h .lf-text-input--label-wrapper.sc-lf-text-input{padding-right:1rem}.lf-text-input--label-position-stacked.sc-lf-text-input-h{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.lf-text-input--label-position-stacked.sc-lf-text-input-h .lf-text-input--label-wrapper.sc-lf-text-input{-ms-flex-item-align:start;align-self:flex-start;display:block;-webkit-box-sizing:content-box;box-sizing:content-box;overflow:hidden;margin:var(--label-padding-top) var(--label-padding-right) var(--label-padding-bottom) var(--label-padding-left)}.lf-text-input--label-position-stacked-centered.sc-lf-text-input-h{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.lf-text-input--label-position-stacked-centered.sc-lf-text-input-h .lf-text-input--label-wrapper.sc-lf-text-input{-ms-flex-item-align:center;align-self:center;display:block;-webkit-box-sizing:content-box;box-sizing:content-box;overflow:hidden;margin:var(--label-padding-top) var(--label-padding-right) var(--label-padding-bottom) var(--label-padding-left)}lf-text-input.lf-text-input--disabled.sc-lf-text-input-h{opacity:0.4}lf-text-input.lf-text-input--invalid.sc-lf-text-input-h .lf-text-input--label-wrapper.sc-lf-text-input{color:#c23030}lf-text-input.lf-text-input--invalid.sc-lf-text-input-h .native-input.sc-lf-text-input{color:#c23030;border-color:#c23030}lf-text-input.lf-text-input--invalid.sc-lf-text-input-h .native-input.sc-lf-text-input::-webkit-input-placeholder{color:#c23030}lf-text-input.lf-text-input--invalid.sc-lf-text-input-h .native-input.sc-lf-text-input::-moz-placeholder{color:#c23030}lf-text-input.lf-text-input--invalid.sc-lf-text-input-h .native-input.sc-lf-text-input:-ms-input-placeholder{color:#c23030}lf-text-input.lf-text-input--invalid.sc-lf-text-input-h .native-input.sc-lf-text-input::-ms-input-placeholder{color:#c23030}lf-text-input.lf-text-input--invalid.sc-lf-text-input-h .native-input.sc-lf-text-input::placeholder{color:#c23030}.lf-text-input--expand-fill.sc-lf-text-input-h .native-input.sc-lf-text-input{width:100%;-ms-flex-positive:2;flex-grow:2;-ms-flex-preferred-size:100%;flex-basis:100%}.lf-text-input--expand-block.sc-lf-text-input-h .native-input.sc-lf-text-input{width:initial}';
    }
  };
let Lt = 0;
var St, Ct;
!(function (t) {
  (t.Weak = 'Weak'), (t.OK = 'OK'), (t.Strong = 'Strong');
})(St || (St = {})),
  (function (t) {
    (t.Uninitialized = 'Uninitialized'), (t.Loading = 'Loading'), (t.Loaded = 'Loaded');
  })(Ct || (Ct = {}));
const Et = class extends HTMLElement {
    constructor() {
      super(),
        this.__registerHost(),
        (this.wifiEntries = []),
        (this.progress = Ct.Uninitialized),
        (this.activeWifiEntry = null),
        (this.listData = [
          { wifiName: 'List Item Example w/ Icon Start and End', locked: !1, signalStrength: St.Strong },
          { wifiName: 'Wu-Tang LAN', locked: !0, signalStrength: St.Strong },
          { wifiName: 'It Burns When IP', locked: !0, signalStrength: St.Weak },
          { wifiName: 'Bill Wi The Science Fi', locked: !0, signalStrength: St.OK },
          { wifiName: 'FBI Surveillance Van', locked: !1, signalStrength: St.Strong },
        ]);
    }
    async componentWillLoad() {
      (this.progress = Ct.Loading),
        this.getWifiList()
          .then(t => {
            this.wifiEntries = t;
          })
          .catch(t => {
            throw Error(t);
          })
          .then(() => {
            this.progress = Ct.Loaded;
          });
    }
    async getWifiList() {
      return new Promise(t => {
        setTimeout(() => {
          t(this.listData);
        }, 1e3);
      });
    }
    onClickHandler(t) {
      console.group('onClickHandler');
      try {
        this.activeWifiEntry = t;
      } catch (e) {
        console.error(e);
      } finally {
        console.groupEnd();
      }
    }
    render() {
      function t(t) {
        return '/assets/images/icons/' + (t ? 'Lock.svg' : 'Unlock.svg');
      }
      function e(t) {
        let e;
        switch (t) {
          case St.Strong:
            e = 'network-3bars.svg';
            break;
          case St.OK:
            e = 'network-2bars.svg';
            break;
          case St.Weak:
            e = 'network-1bar.svg';
        }
        return '/assets/images/icons/' + e;
      }
      return y(
        'lf-list',
        { class: 'wifi-test', striped: !0 },
        y('lf-subheader', { inset: !0 }, y('div', null, 'Inset Subheader Example w/ Appended Icon'), y('img', { slot: 'end', src: t(!0) })),
        this.wifiEntries.map((o, n) =>
          y(
            'lf-list-item',
            {
              button: !0,
              active: this.activeWifiEntry === o,
              disabled: 1 === n,
              onClick: () => {
                this.onClickHandler(o);
              },
            },
            y('img', { slot: 'start', src: e(o.signalStrength) }),
            y('div', null, o.wifiName),
            y('img', { class: 'lock-icon', slot: 'end', src: t(o.locked) }),
          ),
        ),
      );
    }
    static get style() {
      return ':host{display:-ms-flexbox;display:flex;-webkit-box-sizing:border-box;box-sizing:border-box;width:100%}lf-list-item.lf-list-item--disabled{cursor:not-allowed}lf-list{--min-height:20rem;--background:#3c3e47;--border-radius:4px}.lock-icon{height:1rem}';
    }
  },
  At = ot(xt, [1, 'design-sheet']),
  Ht = ot(vt, [1, 'lf-button', { size: [1], shape: [1], context: [1], disabled: [516], href: [1], expand: [513], rel: [1], target: [1], type: [1] }]),
  Bt = ot(yt, [1, 'lf-list', { disabled: [4], striped: [4] }]),
  Tt = ot(wt, [1, 'lf-list-item', { button: [4], active: [4], disabled: [4], href: [1], rel: [1], target: [1], type: [1] }]),
  jt = ot(kt, [1, 'lf-subheader', { inset: [4] }]),
  It = ot($t, [
    2,
    'lf-text-input',
    {
      fireFocusEvents: [4, 'fire-focus-events'],
      autocapitalize: [1],
      autofocus: [4],
      clearInput: [4, 'clear-input'],
      clearIconColor: [1, 'clear-icon-color'],
      clearOnEdit: [4, 'clear-on-edit'],
      debounce: [2],
      invalid: [4],
      disabled: [4],
      label: [1],
      labelPosition: [1, 'label-position'],
      max: [1],
      maxlength: [2],
      min: [1],
      minlength: [2],
      multiple: [4],
      name: [1],
      pattern: [1],
      placeholder: [1],
      readonly: [4],
      required: [4],
      step: [1],
      size: [2],
      expand: [1],
      type: [1],
      value: [1032],
      hasFocus: [32],
    },
  ]),
  _t = ot(Et, [0, 'lf-wifi-list', { wifiEntries: [32], progress: [32], activeWifiEntry: [32] }]),
  Gt = t => {
    'undefined' != typeof customElements &&
      [At, Ht, Bt, Tt, jt, It, _t].forEach(e => {
        customElements.get(e.is) || customElements.define(e.is, e, t);
      });
  },
  Mt = /(-shadowcsshost)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))?([^,{]*)/gim,
  Ot = /(-shadowcsscontext)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))?([^,{]*)/gim,
  Rt = /(-shadowcssslotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))?([^,{]*)/gim,
  Ft = /-shadowcsshost-no-combinator([^\s]*)/,
  Pt = [/::shadow/g, /::content/g],
  Dt = /-shadowcsshost/gim,
  Nt = /:host/gim,
  Wt = /::slotted/gim,
  qt = /:host-context/gim,
  Kt = /\/\*\s*[\s\S]*?\*\//g,
  Ut = /\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g,
  Vt = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g,
  Jt = /([{}])/g,
  Qt = (t, e) => {
    const o = Xt(t);
    let n = 0;
    return o.escapedString.replace(Vt, (...t) => {
      const i = t[2];
      let l = '',
        s = t[4],
        r = '';
      s && s.startsWith('{%BLOCK%') && ((l = o.blocks[n++]), (s = s.substring(8)), (r = '{'));
      const a = e({ selector: i, content: l });
      return `${t[1]}${a.selector}${t[3]}${r}${a.content}${s}`;
    });
  },
  Xt = t => {
    const e = t.split(Jt),
      o = [],
      n = [];
    let i = 0,
      l = [];
    for (let s = 0; s < e.length; s++) {
      const t = e[s];
      '}' === t && i--, i > 0 ? l.push(t) : (l.length > 0 && (n.push(l.join('')), o.push('%BLOCK%'), (l = [])), o.push(t)), '{' === t && i++;
    }
    return l.length > 0 && (n.push(l.join('')), o.push('%BLOCK%')), { escapedString: o.join(''), blocks: n };
  },
  Yt = (t, e, o) =>
    t.replace(e, (...t) => {
      if (t[2]) {
        const e = t[2].split(','),
          n = [];
        for (let i = 0; i < e.length; i++) {
          const l = e[i].trim();
          if (!l) break;
          n.push(o('-shadowcsshost-no-combinator', l, t[3]));
        }
        return n.join(',');
      }
      return '-shadowcsshost-no-combinator' + t[3];
    }),
  Zt = (t, e, o) => t + e.replace('-shadowcsshost', '') + o,
  te = (t, e, o) => (e.indexOf('-shadowcsshost') > -1 ? Zt(t, e, o) : t + e + o + ', ' + e + ' ' + t + o),
  ee = (t, e, o, n) =>
    Qt(t, t => {
      let i = t.selector,
        l = t.content;
      return (
        '@' !== t.selector[0]
          ? (i = ((t, e, o, n) =>
              t
                .split(',')
                .map(t =>
                  n && t.indexOf('.' + n) > -1
                    ? t.trim()
                    : ((t, e) => !(t => ((t = t.replace(/\[/g, '\\[').replace(/\]/g, '\\]')), RegExp('^(' + t + ')([>\\s~+[.,{:][\\s\\S]*)?$', 'm')))(e).test(t))(t, e)
                    ? ((t, e, o) => {
                        const n = '.' + (e = e.replace(/\[is=([^\]]*)\]/g, (t, ...e) => e[0])),
                          i = t => {
                            let i = t.trim();
                            if (!i) return '';
                            if (t.indexOf('-shadowcsshost-no-combinator') > -1)
                              i = ((t, e, o) => {
                                if (((Dt.lastIndex = 0), Dt.test(t))) {
                                  const e = '.' + o;
                                  return t.replace(Ft, (t, o) => o.replace(/([^:]*)(:*)(.*)/, (t, o, n, i) => o + e + n + i)).replace(Dt, e + ' ');
                                }
                                return e + ' ' + t;
                              })(t, e, o);
                            else {
                              const e = t.replace(Dt, '');
                              if (e.length > 0) {
                                const t = e.match(/([^:]*)(:*)(.*)/);
                                t && (i = t[1] + n + t[2] + t[3]);
                              }
                            }
                            return i;
                          },
                          l = (t => {
                            const e = [];
                            let o,
                              n = 0;
                            return (
                              (o = (t = t.replace(/(\[[^\]]*\])/g, (t, o) => {
                                const i = `__ph-${n}__`;
                                return e.push(o), n++, i;
                              })).replace(/(:nth-[-\w]+)(\([^)]+\))/g, (t, o, i) => {
                                const l = `__ph-${n}__`;
                                return e.push(i), n++, o + l;
                              })),
                              { content: o, placeholders: e }
                            );
                          })(t);
                        let s,
                          r = '',
                          a = 0;
                        const c = /( |>|\+|~(?!=))\s*/g;
                        let d = !((t = l.content).indexOf('-shadowcsshost-no-combinator') > -1);
                        for (; null !== (s = c.exec(t)); ) {
                          const e = s[1],
                            o = t.slice(a, s.index).trim();
                          (d = d || o.indexOf('-shadowcsshost-no-combinator') > -1), (r += `${d ? i(o) : o} ${e} `), (a = c.lastIndex);
                        }
                        const u = t.substring(a);
                        return (
                          (d = d || u.indexOf('-shadowcsshost-no-combinator') > -1), (r += d ? i(u) : u), ((t, e) => e.replace(/__ph-(\d+)__/g, (e, o) => t[+o]))(l.placeholders, r)
                        );
                      })(t, e, o).trim()
                    : t.trim(),
                )
                .join(', '))(t.selector, e, o, n))
          : (t.selector.startsWith('@media') || t.selector.startsWith('@supports') || t.selector.startsWith('@page') || t.selector.startsWith('@document')) &&
            (l = ee(t.content, e, o, n)),
        { selector: i.replace(/\s{2,}/g, ' ').trim(), content: l }
      );
    }),
  oe = Object.freeze({
    __proto__: null,
    scopeCss: (t, e, o) => {
      const n = e + '-h',
        i = e + '-s',
        l = (t => t.match(Ut) || [])(t);
      t = (t => t.replace(Kt, ''))(t);
      const s = [];
      if (o) {
        const e = t => {
          const e = `/*!@___${s.length}___*/`;
          return s.push({ placeholder: e, comment: `/*!@${t.selector}*/` }), (t.selector = e + t.selector), t;
        };
        t = Qt(t, t =>
          '@' !== t.selector[0]
            ? e(t)
            : t.selector.startsWith('@media') || t.selector.startsWith('@supports') || t.selector.startsWith('@page') || t.selector.startsWith('@document')
            ? ((t.content = Qt(t.content, e)), t)
            : t,
        );
      }
      const r = ((t, e, o, n) => {
        const i = ((t, e) => {
          const o = '.' + e + ' > ',
            n = [];
          return (
            (t = t.replace(Rt, (...t) => {
              if (t[2]) {
                const e = t[2].trim(),
                  i = o + e + t[3];
                let l = '';
                for (let o = t[4] - 1; o >= 0; o--) {
                  const e = t[5][o];
                  if ('}' === e || ',' === e) break;
                  l = e + l;
                }
                const s = l + i,
                  r = `${l.trimRight()}${i.trim()}`;
                return s.trim() !== r.trim() && n.push({ orgSelector: s, updatedSelector: `${r}, ${s}` }), i;
              }
              return '-shadowcsshost-no-combinator' + t[3];
            })),
            { selectors: n, cssText: t }
          );
        })(
          (t = (t => Yt(t, Ot, te))((t = (t => Yt(t, Mt, Zt))((t = (t => t.replace(qt, '-shadowcsscontext').replace(Nt, '-shadowcsshost').replace(Wt, '-shadowcssslotted'))(t)))))),
          n,
        );
        return (
          (t = (t => Pt.reduce((t, e) => t.replace(e, ' '), t))((t = i.cssText))),
          e && (t = ee(t, e, o, n)),
          { cssText: (t = (t = t.replace(/-shadowcsshost-no-combinator/g, '.' + o)).replace(/>\s*\*\s+([^{, ]+)/gm, ' $1 ')).trim(), slottedSelectors: i.selectors }
        );
      })(t, e, n, i);
      return (
        (t = [r.cssText, ...l].join('\n')),
        o &&
          s.forEach(({ placeholder: e, comment: o }) => {
            t = t.replace(e, o);
          }),
        r.slottedSelectors.forEach(e => {
          t = t.replace(e.orgSelector, e.updatedSelector);
        }),
        t
      );
    },
  });
export {
  At as DesignSheet,
  Ht as LfButton,
  Bt as LfList,
  Tt as LfListItem,
  jt as LfSubheader,
  It as LfTextInput,
  _t as LfWifiList,
  Gt as defineCustomElements,
  it as setAssetPath,
};
