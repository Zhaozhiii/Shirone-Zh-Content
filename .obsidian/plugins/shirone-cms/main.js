"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/identity.js"(exports2) {
    "use strict";
    var ALIAS = /* @__PURE__ */ Symbol.for("yaml.alias");
    var DOC = /* @__PURE__ */ Symbol.for("yaml.document");
    var MAP = /* @__PURE__ */ Symbol.for("yaml.map");
    var PAIR = /* @__PURE__ */ Symbol.for("yaml.pair");
    var SCALAR = /* @__PURE__ */ Symbol.for("yaml.scalar");
    var SEQ = /* @__PURE__ */ Symbol.for("yaml.seq");
    var NODE_TYPE = /* @__PURE__ */ Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports2.ALIAS = ALIAS;
    exports2.DOC = DOC;
    exports2.MAP = MAP;
    exports2.NODE_TYPE = NODE_TYPE;
    exports2.PAIR = PAIR;
    exports2.SCALAR = SCALAR;
    exports2.SEQ = SEQ;
    exports2.hasAnchor = hasAnchor;
    exports2.isAlias = isAlias;
    exports2.isCollection = isCollection;
    exports2.isDocument = isDocument;
    exports2.isMap = isMap;
    exports2.isNode = isNode;
    exports2.isPair = isPair;
    exports2.isScalar = isScalar;
    exports2.isSeq = isSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/visit.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path) {
      const ctrl = callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visit_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = visit_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path) {
      const ctrl = await callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visitAsync_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path) {
      if (typeof visitor === "function")
        return visitor(key, node, path);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path);
      return void 0;
    }
    function replaceNode(key, path, node) {
      const parent = path[path.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports2.visit = visit;
    exports2.visitAsync = visitAsync;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/directives.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports2.Directives = Directives;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/anchors.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports2.anchorIsValid = anchorIsValid;
    exports2.anchorNames = anchorNames;
    exports2.createNodeAnchors = createNodeAnchors;
    exports2.findNewAnchor = findNewAnchor;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/applyReviver.js"(exports2) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports2.applyReviver = applyReviver;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/toJS.js"(exports2) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports2.toJS = toJS;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Node.js"(exports2) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports2.NodeBase = NodeBase;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Alias.js"(exports2) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const { anchors: anchors2, doc, maxAliasCount } = ctx;
        const source = this.resolve(doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        let data = anchors2.get(source);
        if (!data) {
          toJS.toJS(source, null, ctx);
          data = anchors2.get(source);
        }
        if (data?.res === void 0) {
          const msg = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(msg);
        }
        if (maxAliasCount >= 0) {
          data.count += 1;
          if (data.aliasCount === 0)
            data.aliasCount = getAliasCount(doc, source, anchors2);
          if (data.count * data.aliasCount > maxAliasCount) {
            const msg = "Excessive alias count indicates a resource exhaustion attack";
            throw new ReferenceError(msg);
          }
        }
        return data.res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports2.Alias = Alias;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Scalar.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports2.Scalar = Scalar;
    exports2.isScalarValue = isScalarValue;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/createNode.js"(exports2) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports2.createNode = createNode;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Collection.js"(exports2) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path, value) {
      let v = value;
      for (let i = path.length - 1; i >= 0; --i) {
        const k = path[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path, value) {
        if (isEmptyPath(path))
          this.add(value);
        else {
          const [key, ...rest] = path;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        const [key, ...rest] = path;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports2.Collection = Collection;
    exports2.collectionFromPath = collectionFromPath;
    exports2.isEmptyPath = isEmptyPath;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyComment.js"(exports2) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports2.indentComment = indentComment;
    exports2.lineComment = lineComment;
    exports2.stringifyComment = stringifyComment;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/foldFlowLines.js"(exports2) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text;
      if (onFold)
        onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text.length;
        if (fold === 0)
          res = `
${indent}${text.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text[fold]}\\`;
          res += `
${indent}${text.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text[++i];
        } else {
          do {
            ch = text[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text[start];
        }
      }
      return end;
    }
    exports2.FOLD_BLOCK = FOLD_BLOCK;
    exports2.FOLD_FLOW = FOLD_FLOW;
    exports2.FOLD_QUOTED = FOLD_QUOTED;
    exports2.foldFlowLines = foldFlowLines;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyString.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports2.stringifyString = stringifyString;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringify.js"(exports2) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify3(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports2.createStringifyContext = createStringifyContext;
    exports2.stringify = stringify3;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyPair.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify3 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify3.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify3.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports2.stringifyPair = stringifyPair;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/log.js"(exports2) {
    "use strict";
    var node_process = require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports2.debug = debug;
    exports2.warn = warn;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge2 = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge2.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge2.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge2.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports2.addMergeToJSMap = addMergeToJSMap;
    exports2.isMergeKey = isMergeKey;
    exports2.merge = merge2;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports2) {
    "use strict";
    var log = require_log();
    var merge2 = require_merge();
    var stringify3 = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge2.isMergeKey(ctx, key))
        merge2.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify3.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports2.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Pair.js"(exports2) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports2.Pair = Pair;
    exports2.createPair = createPair;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyCollection.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var stringify3 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify4 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify4(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify3.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify3.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports2.stringifyCollection = stringifyCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLMap.js"(exports2) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports2.YAMLMap = YAMLMap;
    exports2.findPair = findPair;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/map.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports2.map = map;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLSeq.js"(exports2) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports2.YAMLSeq = YAMLSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/seq.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports2.seq = seq;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/string.js"(exports2) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports2.string = string;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/null.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports2.nullTag = nullTag;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/bool.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports2.boolTag = boolTag;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyNumber.js"(exports2) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports2.stringifyNumber = stringifyNumber;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/float.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports2.float = float;
    exports2.floatExp = floatExp;
    exports2.floatNaN = floatNaN;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/int.js"(exports2) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports2.int = int;
    exports2.intHex = intHex;
    exports2.intOct = intOct;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/schema.js"(exports2) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports2.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/json/schema.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports2.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports2) {
    "use strict";
    var node_buffer = require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str.substr(o, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports2.binary = binary;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports2.createPairs = createPairs;
    exports2.pairs = pairs;
    exports2.resolvePairs = resolvePairs;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports2.YAMLOMap = YAMLOMap;
    exports2.omap = omap;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports2.falseTag = falseTag;
    exports2.trueTag = trueTag;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports2.float = float;
    exports2.floatExp = floatExp;
    exports2.floatNaN = floatNaN;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports2) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports2.int = int;
    exports2.intBin = intBin;
    exports2.intHex = intHex;
    exports2.intOct = intOct;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports2.YAMLSet = YAMLSet;
    exports2.set = set;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports2) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports2.floatTime = floatTime;
    exports2.intTime = intTime;
    exports2.timestamp = timestamp;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports2) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge2 = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge2.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports2.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/tags.js"(exports2) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge2 = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge2.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge2.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge2.merge) ? schemaTags.concat(merge2.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge2.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports2.coreKnownTags = coreKnownTags;
    exports2.getTags = getTags;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/Schema.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge: merge2, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge2);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports2.Schema = Schema;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyDocument.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var stringify3 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify3.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify3.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify3.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports2.stringifyDocument = stringifyDocument;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/Document.js"(exports2) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        if (Collection.isEmptyPath(path)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        if (Collection.isEmptyPath(path))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path) {
        if (Collection.isEmptyPath(path))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        if (Collection.isEmptyPath(path)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports2.Document = Document;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/errors.js"(exports2) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports2.YAMLError = YAMLError;
    exports2.YAMLParseError = YAMLParseError;
    exports2.YAMLWarning = YAMLWarning;
    exports2.prettifyError = prettifyError;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-props.js"(exports2) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports2.resolveProps = resolveProps;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-contains-newline.js"(exports2) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports2.containsNewline = containsNewline;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports2) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports2.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-map-includes.js"(exports2) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports2.mapIncludes = mapIncludes;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-map.js"(exports2) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports2.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-seq.js"(exports2) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports2.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-end.js"(exports2) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep + cb;
              sep = "";
              break;
            }
            case "newline":
              if (comment)
                sep += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports2.resolveEnd = resolveEnd;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep)
                for (const st of sep) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports2.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-collection.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports2.composeCollection = composeCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep === " ")
            sep = "\n";
          else if (!prevMoreIndented && sep === "\n")
            sep = "\n\n";
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep === "\n")
            value += "\n";
          else
            sep = "\n";
        } else {
          value += sep + content;
          sep = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports2.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return foldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return foldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function foldLines(source) {
      let first, line;
      try {
        first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
        line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
      } catch {
        first = /(.*?)[ \t]*\r?\n/sy;
        line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
      }
      let match = first.exec(source);
      if (!match)
        return source;
      let res = match[1];
      let sep = " ";
      let pos = first.lastIndex;
      line.lastIndex = pos;
      while (match = line.exec(source)) {
        if (match[1] === "") {
          if (sep === "\n")
            res += sep;
          else
            sep = "\n";
        } else {
          res += sep + match[1];
          sep = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports2.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-scalar.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports2.composeScalar = composeScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports2) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports2.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-node.js"(exports2) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports2.composeEmptyNode = composeEmptyNode;
    exports2.composeNode = composeNode;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-doc.js"(exports2) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports2.composeDoc = composeDoc;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/composer.js"(exports2) {
    "use strict";
    var node_process = require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports2.Composer = Composer;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-scalar.js"(exports2) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports2.createScalarToken = createScalarToken;
    exports2.resolveAsScalar = resolveAsScalar;
    exports2.setScalarValue = setScalarValue;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-stringify.js"(exports2) {
    "use strict";
    var stringify3 = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep)
        for (const st of sep)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports2.stringify = stringify3;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-visit.js"(exports2) {
    "use strict";
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path) => {
      let item = cst;
      for (const [field, index] of path) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path) => {
      const parent = visit.itemAtPath(cst, path.slice(0, -1));
      const field = path[path.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path, item, visitor) {
      let ctrl = visitor(item, path);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
    }
    exports2.visit = visit;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst.js"(exports2) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports2.createScalarToken = cstScalar.createScalarToken;
    exports2.resolveAsScalar = cstScalar.resolveAsScalar;
    exports2.setScalarValue = cstScalar.setScalarValue;
    exports2.stringify = cstStringify.stringify;
    exports2.visit = cstVisit.visit;
    exports2.BOM = BOM;
    exports2.DOCUMENT = DOCUMENT;
    exports2.FLOW_END = FLOW_END;
    exports2.SCALAR = SCALAR;
    exports2.isCollection = isCollection;
    exports2.isScalar = isScalar;
    exports2.prettyToken = prettyToken;
    exports2.tokenType = tokenType;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/lexer.js"(exports2) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports2.Lexer = Lexer;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/line-counter.js"(exports2) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports2.LineCounter = LineCounter;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/parser.js"(exports2) {
    "use strict";
    var node_process = require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep;
          if (scalar.end) {
            sep = scalar.end;
            sep.push(this.sourceToken);
            delete scalar.end;
          } else
            sep = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep = it.sep;
                  sep.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports2.Parser = Parser;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/public-api.js"(exports2) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument2(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse3(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument2(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify3(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports2.parse = parse3;
    exports2.parseAllDocuments = parseAllDocuments;
    exports2.parseDocument = parseDocument2;
    exports2.stringify = stringify3;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/index.js"(exports2) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports2.Composer = composer.Composer;
    exports2.Document = Document.Document;
    exports2.Schema = Schema.Schema;
    exports2.YAMLError = errors.YAMLError;
    exports2.YAMLParseError = errors.YAMLParseError;
    exports2.YAMLWarning = errors.YAMLWarning;
    exports2.Alias = Alias.Alias;
    exports2.isAlias = identity.isAlias;
    exports2.isCollection = identity.isCollection;
    exports2.isDocument = identity.isDocument;
    exports2.isMap = identity.isMap;
    exports2.isNode = identity.isNode;
    exports2.isPair = identity.isPair;
    exports2.isScalar = identity.isScalar;
    exports2.isSeq = identity.isSeq;
    exports2.Pair = Pair.Pair;
    exports2.Scalar = Scalar.Scalar;
    exports2.YAMLMap = YAMLMap.YAMLMap;
    exports2.YAMLSeq = YAMLSeq.YAMLSeq;
    exports2.CST = cst;
    exports2.Lexer = lexer.Lexer;
    exports2.LineCounter = lineCounter.LineCounter;
    exports2.Parser = parser.Parser;
    exports2.parse = publicApi.parse;
    exports2.parseAllDocuments = publicApi.parseAllDocuments;
    exports2.parseDocument = publicApi.parseDocument;
    exports2.stringify = publicApi.stringify;
    exports2.visit = visit.visit;
    exports2.visitAsync = visit.visitAsync;
  }
});

// tools/cms/main.mjs
var main_exports = {};
__export(main_exports, {
  default: () => ShironeCms
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_node_child_process = require("node:child_process");
var import_node_util = require("node:util");
var import_node_fs2 = require("node:fs");
var import_node_path2 = require("node:path");
var import_node_crypto2 = require("node:crypto");
var import_yaml2 = __toESM(require_dist(), 1);

// tools/cms/model.mjs
var commonFields = {
  title: ["\u6807\u9898", "text"],
  draft: ["\u8349\u7A3F", "boolean"],
  visible: ["\u663E\u793A", "boolean"],
  order: ["\u6392\u5E8F\uFF08\u5C0F\u503C\u4F18\u5148\uFF09", "number"],
  publishAt: ["\u5B9A\u65F6\u53D1\u5E03", "datetime"],
  unpublishAt: ["\u5B9A\u65F6\u4E0B\u7EBF", "datetime"]
};
var domains = {
  posts: { label: "\u6587\u7AE0", folder: "content/posts", fields: {
    title: ["\u6807\u9898", "text", true],
    published: ["\u53D1\u5E03\u65E5\u671F", "date", true],
    publishedAt: ["\u7CBE\u786E\u53D1\u5E03\u65F6\u95F4", "datetime"],
    description: ["\u6458\u8981", "textarea"],
    image: ["\u5C01\u9762", "image"],
    category: ["\u5206\u7C7B", "category"],
    tags: ["\u6807\u7B7E", "tags"],
    series: ["\u7CFB\u5217", "series"],
    seriesOrder: ["\u7CFB\u5217\u5185\u987A\u5E8F", "number"],
    pinned: ["\u7F6E\u9876", "boolean"],
    comment: ["\u5141\u8BB8\u8BC4\u8BBA", "boolean"],
    encrypted: ["\u5BC6\u7801\u4FDD\u62A4", "boolean"],
    password: ["\u8BBF\u95EE\u5BC6\u7801", "password"],
    passwordHint: ["\u5BC6\u7801\u63D0\u793A", "text"],
    hideHomeContent: ["\u9690\u85CF\u9996\u9875\u6B63\u6587", "boolean"],
    permalink: ["\u56FA\u5B9A\u7F51\u5740", "text"],
    alias: ["\u7F51\u5740\u522B\u540D", "text"],
    lang: ["\u8BED\u8A00", "text"]
  } },
  moments: { label: "\u52A8\u6001", folder: "content/moments", fields: { published: ["\u65E5\u671F", "date", true], location: ["\u4F4D\u7F6E", "text"], mood: ["\u5FC3\u60C5\u56FE\u6807", "text"], tags: ["\u6807\u7B7E", "tags"], images: ["\u56FE\u7247", "images"], pinned: ["\u7F6E\u9876", "boolean"] } },
  categories: { label: "\u5206\u7C7B", fields: { key: ["\u7A33\u5B9A\u6807\u8BC6", "text", true], name: ["\u5206\u7C7B\u540D\u79F0", "text", true], parent: ["\u7236\u5206\u7C7B", "category"], description: ["\u63CF\u8FF0", "textarea"], icon: ["\u56FE\u6807", "text"] } },
  tags: { label: "\u6807\u7B7E", fields: { key: ["\u7A33\u5B9A\u6807\u8BC6", "text", true], name: ["\u663E\u793A\u540D\u79F0", "text", true] } },
  series: { label: "\u7CFB\u5217", fields: { key: ["\u7A33\u5B9A\u7F51\u5740\u6807\u8BC6", "text", true], title: ["\u7CFB\u5217\u540D\u79F0", "text", true], description: ["\u7B80\u4ECB", "textarea"], cover: ["\u5C01\u9762", "image"] } },
  media: { label: "\u7535\u5F71\u4E66\u7C4D", fields: { key: ["\u7A33\u5B9A\u6807\u8BC6", "text", true], title: ["\u540D\u79F0", "text", true], kind: ["\u7C7B\u578B", "select", true, ["movie", "book"]], creator: ["\u4F5C\u8005 / \u5BFC\u6F14", "text"], status: ["\u89C2\u770B / \u9605\u8BFB\u8FDB\u5EA6", "select", false, ["planned", "in-progress", "completed"]], rating: ["\u8BC4\u5206\uFF080\u201310\uFF09", "number"], date: ["\u5B8C\u6210\u65E5\u671F", "date"], cover: ["\u5C01\u9762", "image"], description: ["\u7B80\u8BC4", "textarea"], url: ["\u5916\u94FE", "url"] } },
  compass: { label: "\u7F51\u5740\u5206\u7EC4", exports: ["compassData"], fields: { key: ["\u7A33\u5B9A\u6807\u8BC6", "text", true], name: ["\u5206\u7EC4\u540D\u79F0", "text", true], icon: ["\u56FE\u6807", "text"], blurb: ["\u8BF4\u660E", "textarea"], entries: ["\u7F51\u5740\u6761\u76EE", "links", true] } },
  devices: { label: "\u8BBE\u5907", exports: ["devicesData"], fields: { id: ["\u7A33\u5B9A\u6807\u8BC6", "text", true], name: ["\u540D\u79F0", "text", true], brand: ["\u54C1\u724C", "text", true], category: ["\u5206\u7C7B\u6807\u8BC6", "text", true], status: ["\u72B6\u6001", "select", true, ["active", "backup", "archived", "wishlist"]], specs: ["\u89C4\u683C", "text", true], description: ["\u4ECB\u7ECD", "textarea", true], specDetails: ["\u8BE6\u7EC6\u89C4\u683C", "specs"], image: ["\u56FE\u7247", "image"], icon: ["\u56FE\u6807", "text"], link: ["\u7F51\u5740", "url"], featured: ["\u63A8\u8350", "boolean"], year: ["\u5E74\u4EFD", "text"] } },
  projects: { label: "\u9879\u76EE", exports: ["projectsData"], fields: { key: ["\u7A33\u5B9A\u6807\u8BC6", "text", true], title: ["\u540D\u79F0", "text", true], summary: ["\u7B80\u4ECB", "textarea", true], category: ["\u5206\u7C7B\u6807\u8BC6", "text", true], phase: ["\u9636\u6BB5", "select", true, ["shipped", "building", "exploring"]], technologies: ["\u6280\u672F", "tags", true], icon: ["\u56FE\u6807", "text"], cover: ["\u5C01\u9762", "image"], coverAlt: ["\u56FE\u7247\u8BF4\u660E", "text"], featured: ["\u63A8\u8350", "boolean"], website: ["\u9879\u76EE\u7F51\u5740", "url"], repository: ["\u4ED3\u5E93", "url"], year: ["\u5E74\u4EFD", "text"] } },
  friends: { label: "\u53CB\u94FE", exports: ["friendsData"], fields: { id: ["\u7F16\u53F7", "number", true], title: ["\u540D\u79F0", "text", true], imgurl: ["\u5934\u50CF", "image", true], desc: ["\u7B80\u4ECB", "textarea", true], siteurl: ["\u7F51\u7AD9", "url", true], linkpage: ["\u53CB\u94FE\u9875", "url"], tags: ["\u6807\u7B7E", "tags", true] } },
  skills: { label: "\u6280\u80FD", exports: ["skillsData"], fields: { name: ["\u540D\u79F0", "text", true], category: ["\u5206\u7C7B", "text", true], description: ["\u7B80\u4ECB", "textarea"], icon: ["\u56FE\u6807", "text"], level: ["\u719F\u7EC3\u7A0B\u5EA6", "select", true, ["beginner", "intermediate", "advanced", "expert"]] } },
  timeline: { label: "\u65F6\u95F4\u7EBF", exports: ["timelineData"], fields: { title: ["\u6807\u9898", "text", true], date: ["\u65E5\u671F", "text", true], description: ["\u8BF4\u660E", "textarea"], category: ["\u5206\u7C7B", "text"], icon: ["\u56FE\u6807", "text"], tags: ["\u6807\u7B7E", "tags"], subtitle: ["\u673A\u6784 / \u804C\u4F4D", "text"], location: ["\u5730\u70B9", "text"], highlights: ["\u8981\u70B9", "tags"], links: ["\u76F8\u5173\u94FE\u63A5", "objects"], featured: ["\u91CD\u70B9", "boolean"] } },
  anime: { label: "\u756A\u5267\uFF08\u672C\u5730\u6536\u85CF\uFF09", exports: ["animeData"], fields: { title: ["\u540D\u79F0", "text", true], cover: ["\u5C01\u9762", "image"], link: ["\u7F51\u5740", "url"], status: ["\u72B6\u6001", "select", true, ["watching", "completed", "planned", "onHold", "dropped"]], rating: ["\u8BC4\u5206", "number", true], year: ["\u5E74\u4EFD", "text", true], genres: ["\u9898\u6750", "tags", true], description: ["\u611F\u60F3", "textarea"], studio: ["\u5236\u4F5C\u516C\u53F8", "text"], progress: ["\u89C2\u770B\u8FDB\u5EA6", "object"], period: ["\u89C2\u770B\u671F\u95F4", "object"], identity: ["\u6765\u6E90\u8EAB\u4EFD", "object"] } },
  aboutTechGroups: { label: "\u5173\u4E8E\uFF1A\u6280\u672F\u7EC4", file: "about", exports: ["aboutTechGroups"], fields: { label: ["\u540D\u79F0", "text", true], icon: ["\u56FE\u6807", "text"], items: ["\u6280\u672F\u6761\u76EE", "objects", true] } },
  aboutMilestones: { label: "\u5173\u4E8E\uFF1A\u91CC\u7A0B\u7891", file: "about", exports: ["aboutMilestones"], fields: { date: ["\u65E5\u671F", "text", true], title: ["\u6807\u9898", "text", true], tag: ["\u6807\u7B7E", "text"], desc: ["\u63CF\u8FF0", "textarea", true] } },
  aboutSocialLinks: { label: "\u5173\u4E8E\uFF1A\u793E\u4EA4\u94FE\u63A5", file: "about", exports: ["aboutSocialLinks"], fields: { brand: ["\u54C1\u724C", "text"], href: ["\u94FE\u63A5", "url", true], platform: ["\u5E73\u53F0", "text", true], handle: ["\u8D26\u53F7", "text"], icon: ["\u56FE\u6807", "text"], note: ["\u8BF4\u660E", "text"] } },
  announcements: { label: "\u516C\u544A", fields: { title: ["\u6807\u9898", "text", true], content: ["\u6B63\u6587", "textarea", true], tag: ["\u6807\u7B7E", "text"], date: ["\u65E5\u671F", "date"], link: ["\u8BE6\u60C5\u94FE\u63A5", "object"] } },
  albums: { label: "\u76F8\u518C", fields: { key: ["\u76F8\u518C\u7F51\u5740\u6807\u8BC6", "text", true], title: ["\u6807\u9898", "text", true], description: ["\u7B80\u4ECB", "textarea"], date: ["\u65E5\u671F", "date"], location: ["\u5730\u70B9", "text"], tags: ["\u6807\u7B7E", "tags"], cover: ["\u5C01\u9762", "image"], layout: ["\u5E03\u5C40", "select", false, ["masonry", "grid"]], columns: ["\u5217\u6570\uFF082\u20134\uFF09", "number"], password: ["\u8BBF\u95EE\u5BC6\u7801", "password"], passwordHint: ["\u5BC6\u7801\u63D0\u793A", "text"], photos: ["\u7167\u7247", "photos"] } }
};
var labels = {
  site: "\u7AD9\u70B9\u4E0E\u5916\u89C2",
  profile: "\u4E2A\u4EBA\u8D44\u6599",
  permalink: "\u6587\u7AE0\u7F51\u5740",
  license: "\u7248\u6743",
  "expressive-code": "\u4EE3\u7801\u5757",
  announcement: "\u516C\u544A\u680F",
  "post-list": "\u6587\u7AE0\u5217\u8868",
  "random-cover": "\u968F\u673A\u5C01\u9762",
  article: "\u6587\u7AE0\u9605\u8BFB",
  comment: "\u8BC4\u8BBA",
  "context-menu": "\u53F3\u952E\u83DC\u5355",
  fab: "\u60AC\u6D6E\u6309\u94AE",
  sidebar: "\u4FA7\u680F",
  footer: "\u9875\u811A",
  "image-bloom": "\u56FE\u7247\u6548\u679C",
  skills: "\u6280\u80FD\u9875",
  projects: "\u9879\u76EE\u9875",
  timeline: "\u65F6\u95F4\u7EBF\u9875",
  devices: "\u8BBE\u5907\u9875",
  music: "\u97F3\u4E50\u4E0E\u81EA\u52A8\u540C\u6B65",
  anime: "\u8FFD\u756A",
  sponsor: "\u6253\u8D4F",
  font: "\u5B57\u4F53",
  "friend-page": "\u53CB\u94FE\u9875",
  llms: "LLM \u8F93\u51FA",
  umami: "\u8BBF\u95EE\u7EDF\u8BA1",
  "nav-bar": "\u5BFC\u822A\u680F"
};
function folderFor(domain) {
  return domains[domain].folder || `cms/${domain}`;
}

// tools/cms/core.mjs
var import_node_crypto = require("node:crypto");
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_yaml = __toESM(require_dist(), 1);
var STATE = "cms/publication-state.json";
function files(root) {
  if (!(0, import_node_fs.existsSync)(root)) return [];
  return (0, import_node_fs.readdirSync)(root, { withFileTypes: true }).filter((e) => !e.name.startsWith(".") && e.name !== "node_modules").flatMap((e) => e.isDirectory() ? files((0, import_node_path.join)(root, e.name)) : [(0, import_node_path.join)(root, e.name)]);
}
function readNote(text) {
  const m = text.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  return { data: m ? (0, import_yaml.parse)(m[1]) || {} : {}, body: m ? text.slice(m[0].length) : text };
}
function noteText(data, body = "") {
  return `---
${(0, import_yaml.stringify)(data, { lineWidth: 0 }).trimEnd()}
---

${body.replace(/^\n+/, "")}`;
}
function instant(value, label2 = "\u65F6\u95F4") {
  if (value === void 0 || value === null || value === "") return null;
  let text = String(value);
  if (/^\d{4}-\d\d-\d\d$/.test(text)) text += "T00:00:00+08:00";
  else if (/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d)?$/.test(text)) text += "+08:00";
  if (!/^\d{4}-\d\d-\d\dT/.test(text) || !Number.isFinite(Date.parse(text))) throw new Error(`${label2}\u683C\u5F0F\u65E0\u6548`);
  return new Date(text).toISOString();
}
function readRecords(root) {
  const records = [];
  for (const domain of Object.keys(domains)) for (const file of files((0, import_node_path.join)(root, folderFor(domain))).filter((p) => /\.md$/.test(p))) {
    const note = readNote((0, import_node_fs.readFileSync)(file, "utf8"));
    records.push({ ...note, domain, path: (0, import_node_path.relative)(root, file).replaceAll("\\", "/"), file });
  }
  return records;
}
function validate(records) {
  const seen = /* @__PURE__ */ new Set();
  for (const r of records) {
    const key = r.data.cmsId || `${r.domain}:${r.data.key ?? r.data.id ?? r.path}`;
    if (seen.has(key)) throw new Error(`\u6807\u8BC6\u91CD\u590D\uFF1A${r.path}`);
    seen.add(key);
    for (const [field, [label2, type, required, values]] of Object.entries({ ...domains[r.domain].fields, order: ["\u6392\u5E8F", "number"] })) {
      const value = r.data[field];
      if (required && (value === void 0 || value === null || value === "")) throw new Error(`${r.path}\uFF1A\u8BF7\u586B\u5199${label2}`);
      if (value === void 0 || value === null || value === "") continue;
      if (type === "number" && (typeof value !== "number" || !Number.isFinite(value))) throw new Error(`${r.path}\uFF1A${label2}\u5FC5\u987B\u4E3A\u6570\u5B57`);
      if (type === "boolean" && typeof value !== "boolean") throw new Error(`${r.path}\uFF1A${label2}\u5FC5\u987B\u4E3A\u5F00\u5173`);
      if (type === "tags" && (!Array.isArray(value) || value.some((v) => typeof v !== "string"))) throw new Error(`${r.path}\uFF1A${label2}\u5FC5\u987B\u4E3A\u6587\u5B57\u5217\u8868`);
      if (values && !values.includes(value)) throw new Error(`${r.path}\uFF1A${label2}\u9009\u9879\u65E0\u6548`);
    }
    const start = instant(r.data.publishAt), end = instant(r.data.unpublishAt);
    if (start && end && end <= start) throw new Error(`${r.path}\uFF1A\u4E0B\u7EBF\u65F6\u95F4\u5FC5\u987B\u665A\u4E8E\u53D1\u5E03\u65F6\u95F4`);
    if (r.data.encrypted && !String(r.data.password || "").trim()) throw new Error(`${r.path}\uFF1A\u8BF7\u8BBE\u7F6E\u8BBF\u95EE\u5BC6\u7801`);
    if (r.domain === "media" && r.data.rating !== void 0 && (r.data.rating < 0 || r.data.rating > 10)) throw new Error(`${r.path}\uFF1A\u8BC4\u5206\u987B\u4E3A 0\u201310`);
    if (r.domain === "albums" && r.data.columns !== void 0 && ![2, 3, 4].includes(r.data.columns)) throw new Error(`${r.path}\uFF1A\u76F8\u518C\u5217\u6570\u987B\u4E3A 2\u30013 \u6216 4`);
    if (["posts", "moments"].includes(r.domain) && !/^\d{4}-\d\d-\d\d$/.test(String(r.data.published))) throw new Error(`${r.path}\uFF1A\u53D1\u5E03\u65E5\u671F\u987B\u4E3A YYYY-MM-DD`);
  }
  for (const domain of ["categories", "tags", "series"]) {
    const list = records.filter((r) => r.domain === domain), byKey = /* @__PURE__ */ new Map();
    for (const r of list) {
      if (byKey.has(r.data.key)) throw new Error(`${domain} \u6807\u8BC6\u91CD\u590D`);
      byKey.set(r.data.key, r);
    }
    if (domain === "categories") for (const r of list) {
      const chain = /* @__PURE__ */ new Set([r.data.key]);
      let parent = r.data.parent;
      while (parent) {
        if (chain.has(parent)) throw new Error("\u5206\u7C7B\u5C42\u7EA7\u5B58\u5728\u5FAA\u73AF");
        chain.add(parent);
        const p = byKey.get(parent);
        if (!p) throw new Error(`\u7236\u5206\u7C7B\u4E0D\u5B58\u5728\uFF1A${r.path}`);
        parent = p.data.parent;
      }
    }
  }
  const cats = new Set(records.filter((r) => r.domain === "categories").map((r) => r.data.key));
  const series = new Set(records.filter((r) => r.domain === "series").map((r) => r.data.key));
  for (const r of records.filter((r2) => r2.domain === "posts")) {
    if (cats.size && r.data.category && !cats.has(r.data.category)) throw new Error(`${r.path}\uFF1A\u5206\u7C7B\u4E0D\u5B58\u5728`);
    if (r.data.series && !series.has(r.data.series)) throw new Error(`${r.path}\uFF1A\u7CFB\u5217\u4E0D\u5B58\u5728`);
  }
  return records;
}
function schedule(records) {
  return [...new Set(records.flatMap((r) => [instant(r.data.publishAt), instant(r.data.unpublishAt)]).filter(Boolean))].sort();
}
function publicationState(records, evaluatedAt = (/* @__PURE__ */ new Date()).toISOString()) {
  const transitions = schedule(records);
  return {
    schemaVersion: 1,
    evaluatedAt: instant(evaluatedAt),
    transitions,
    scheduleHash: (0, import_node_crypto.createHash)("sha256").update(JSON.stringify(transitions)).digest("hex")
  };
}
function refreshState(root, now = (/* @__PURE__ */ new Date()).toISOString()) {
  const records = validate(readRecords(root));
  const state = publicationState(records, now);
  write((0, import_node_path.join)(root, STATE), JSON.stringify(state, null, 2) + "\n");
  return state;
}
function write(path, text) {
  (0, import_node_fs.mkdirSync)((0, import_node_path.dirname)(path), { recursive: true });
  if (!(0, import_node_fs.existsSync)(path) || (0, import_node_fs.readFileSync)(path, "utf8") !== text) (0, import_node_fs.writeFileSync)(path, text);
}

// tools/cms/settings-schema.json
var settings_schema_default = {
  site: {
    defaults: {
      site: "https://shirone.mysqil.com/",
      base: "/",
      title: "Shirone",
      subtitle: "A Material 3 anime blog",
      topAppBar: {
        contentAlign: "center"
      },
      displaySettings: {
        colorStyle: true,
        colorSpec: true,
        wallpaperMode: true,
        layoutMode: true,
        reduceMotion: true,
        texture: true,
        effects: true,
        bannerTitle: true,
        bannerCarousel: true,
        bannerWaves: true,
        bannerGradient: true
      },
      pages: {
        series: true,
        friends: true,
        guestbook: true,
        sponsor: true,
        moments: true,
        anime: true,
        compass: true,
        skills: true,
        projects: true,
        devices: true,
        timeline: true,
        albums: true,
        categories: true,
        tags: true,
        about: true
      },
      lang: "en",
      timeZone: "Asia/Shanghai",
      themeColor: {
        hue: 315,
        fixed: false,
        style: "tonalSpot",
        spec: "2025"
      },
      wallpaperMode: {
        defaultMode: "banner",
        fullscreen: {
          layout: "classic"
        },
        overlay: {
          opacity: 0.8,
          blur: 10,
          cardOpacity: 0.6
        }
      },
      texture: {
        enable: true,
        defaultPreset: "starlight",
        defaultOpacity: 0.12,
        allowMotion: true
      },
      effects: {
        sakura: {
          enable: false,
          sakuraNum: 21,
          limitTimes: -1,
          size: {
            min: 0.5,
            max: 1.1
          },
          opacity: {
            min: 0.3,
            max: 0.9
          },
          speed: {
            horizontal: {
              min: -1.7,
              max: -1.2
            },
            vertical: {
              min: 1.5,
              max: 2.2
            },
            rotation: 0.03,
            fadeSpeed: 0.03
          },
          zIndex: 100
        }
      },
      banner: {
        src: {
          desktop: [
            "assets/images/banner/desktop/1.webp"
          ],
          mobile: [
            "assets/images/banner/mobile/1.webp"
          ]
        },
        position: "center",
        pick: "first",
        dim: {
          enable: true,
          opacity: 0.24
        },
        homeText: {
          enable: true,
          title: "Shirone",
          links: [],
          subtitle: [
            "\u7279\u5225\u306A\u3053\u3068\u306F\u306A\u3044\u3051\u3069\u3001\u541B\u304C\u3044\u308B\u3068\u5341\u5206\u3067\u3059",
            "\u4ECA\u3067\u3082\u3042\u306A\u305F\u306F\u79C1\u306E\u5149",
            "\u541B\u3063\u3066\u3055\u3001\u77E5\u3089\u306A\u3044\u3046\u3061\u306B\u79C1\u306E\u6BCE\u65E5\u306B\u306A\u3063\u3066\u305F\u3088",
            "\u541B\u3068\u8A71\u3059\u3068\u3001\u306A\u3093\u304B\u6BCE\u65E5\u304C\u3061\u3087\u3063\u3068\u697D\u3057\u304F\u306A\u308B\u3093\u3060",
            "\u4ECA\u65E5\u306F\u306A\u3093\u3067\u3082\u306A\u3044\u65E5\u3002\u3067\u3082\u3001\u3061\u3087\u3063\u3068\u3060\u3051\u3044\u3044\u65E5"
          ],
          typewriter: {
            enable: true,
            speed: 100,
            deleteSpeed: 50,
            pauseTime: 2e3,
            loop: true
          }
        },
        carousel: {
          enable: true,
          interval: 6e3,
          fadeDuration: 1200,
          animation: "ken-burns"
        },
        video: {
          enable: false,
          src: [],
          mode: "order"
        },
        waves: {
          enable: true
        },
        gradient: {
          enable: true
        }
      },
      imageOptimization: {
        noReferrerDomains: [
          "*.hdslb.com"
        ]
      },
      toc: {
        enable: true,
        depth: 2
      },
      progressIndicator: {
        style: "dual"
      },
      favicon: [
        {
          src: "/logo/icon.webp"
        }
      ]
    },
    schema: {
      type: "object",
      properties: {
        site: {
          type: "string",
          description: "",
          label: "site"
        },
        base: {
          type: "string",
          description: "",
          label: "base"
        },
        title: {
          type: "string",
          description: "",
          label: "title"
        },
        subtitle: {
          type: "string",
          description: "",
          label: "subtitle"
        },
        topAppBar: {
          type: "object",
          properties: {
            contentAlign: {
              type: "string",
              enum: [
                "left",
                "center"
              ],
              description: "\u684C\u9762\u7AEF\u6807\u9898\u4E0E\u5BFC\u822A\u5185\u5BB9\u7EC4\u7684\u5BF9\u9F50\u65B9\u5F0F\u3002",
              label: "\u684C\u9762\u7AEF\u6807\u9898\u4E0E\u5BFC\u822A\u5185\u5BB9\u7EC4\u7684\u5BF9\u9F50\u65B9\u5F0F"
            }
          },
          description: "",
          label: "topAppBar"
        },
        displaySettings: {
          type: "object",
          properties: {
            colorStyle: {
              type: "boolean",
              description: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u914D\u8272\u98CE\u683C\uFF089 \u5BAB\u683C\uFF09\u9009\u62E9\u5668\uFF08\u9ED8\u8BA4 true\uFF09",
              label: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u914D\u8272\u98CE\u683C"
            },
            colorSpec: {
              type: "boolean",
              description: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A Color Spec\uFF08\u8C03\u8272\u89C4\u8303 2021 / 2025\uFF09\u5207\u6362\u5668\uFF08\u9ED8\u8BA4 true\uFF09",
              label: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A Color Spec"
            },
            wallpaperMode: {
              type: "boolean",
              description: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A Page background\uFF08\u9875\u9762\u80CC\u666F \u7EAF\u8272 / \u6A2A\u5E45\uFF09\u5207\u6362\u5668\uFF08\u9ED8\u8BA4 true\uFF09",
              label: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A Page background"
            },
            layoutMode: {
              type: "boolean",
              description: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A Layout\uFF08\u6587\u7AE0\u5217\u8868\u5E03\u5C40 \u5217\u8868 / \u7F51\u683C\uFF09\u5207\u6362\u5668\uFF08\u9ED8\u8BA4 true\uFF09",
              label: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A Layout"
            },
            reduceMotion: {
              type: "boolean",
              description: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A Reduce motion\uFF08\u51CF\u5C11\u52A8\u6548\uFF09\u5207\u6362\u5668\uFF08\u9ED8\u8BA4 true\uFF09",
              label: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A Reduce motion"
            },
            texture: {
              type: "boolean",
              description: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u80CC\u666F\u7EB9\u7406\u9009\u62E9\u5668\uFF08\u9ED8\u8BA4 true\uFF0C\u4E14\u53D7 texture.enable \u63A7\u5236\uFF09",
              label: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u80CC\u666F\u7EB9\u7406\u9009\u62E9\u5668"
            },
            effects: {
              type: "boolean",
              description: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u6A31\u82B1\u7279\u6548\u5F00\u5173\uFF08\u9ED8\u8BA4 true\uFF0C\u4E14\u53D7 effects.sakura \u63D0\u4F9B\u9ED8\u8BA4\u503C\uFF09",
              label: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u6A31\u82B1\u7279\u6548\u5F00\u5173"
            },
            bannerTitle: {
              type: "boolean",
              description: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u300C\u9996\u9875\u58C1\u7EB8\u6807\u9898\u300D\u5F00\u5173\uFF08\u9ED8\u8BA4 true\uFF0C\u4E14\u53D7 banner.homeText.enable \u63A7\u5236\uFF09",
              label: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u300C\u9996\u9875\u58C1\u7EB8\u6807\u9898\u300D\u5F00\u5173"
            },
            bannerCarousel: {
              type: "boolean",
              description: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u300C\u58C1\u7EB8\u8F6E\u64AD\u300D\u5F00\u5173\uFF08\u9ED8\u8BA4 true\uFF0C\u4E14\u53D7 banner.carousel.enable \u63A7\u5236\uFF09",
              label: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u300C\u58C1\u7EB8\u8F6E\u64AD\u300D\u5F00\u5173"
            },
            bannerWaves: {
              type: "boolean",
              description: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u300C\u6C34\u6CE2\u7EB9\u52A8\u753B\u300D\u5F00\u5173\uFF08\u9ED8\u8BA4 true\uFF0C\u4EC5\u6A2A\u5E45\u6A21\u5F0F\u663E\u793A\uFF0C\u4E14\u53D7 banner.waves.enable \u63A7\u5236\uFF09",
              label: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u300C\u6C34\u6CE2\u7EB9\u52A8\u753B\u300D\u5F00\u5173"
            },
            bannerGradient: {
              type: "boolean",
              description: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u300C\u6E10\u53D8\u8FC7\u6E21\u300D\u5F00\u5173\uFF08\u9ED8\u8BA4 true\uFF0C\u4EC5\u6A2A\u5E45\u6A21\u5F0F\u663E\u793A\uFF09",
              label: "\u662F\u5426\u5728\u663E\u793A\u8BBE\u7F6E\u9762\u677F\u5C55\u793A\u300C\u6E10\u53D8\u8FC7\u6E21\u300D\u5F00\u5173"
            }
          },
          description: "\u663E\u793A\u8BBE\u7F6E\u6D6E\u5C42\u5404\u5207\u6362\u9879\u7684\u524D\u7AEF\u53EF\u89C1\u6027\u63A7\u5236",
          label: "\u663E\u793A\u8BBE\u7F6E\u6D6E\u5C42\u5404\u5207\u6362\u9879\u7684\u524D\u7AEF\u53EF\u89C1\u6027\u63A7\u5236"
        },
        pages: {
          type: "object",
          properties: {
            series: {
              type: "boolean",
              description: "\u7CFB\u5217\u9875\uFF1B\u672A\u6307\u5B9A\u65F6\u4FDD\u6301\u53EF\u7528\u3002",
              label: "\u7CFB\u5217\u9875\uFF1B\u672A\u6307\u5B9A\u65F6\u4FDD\u6301\u53EF\u7528"
            },
            friends: {
              type: "boolean",
              description: "\u53CB\u94FE\u9875 /friends/",
              label: "\u53CB\u94FE\u9875 /friends/"
            },
            guestbook: {
              type: "boolean",
              description: "\u7559\u8A00\u677F\u9875 /guestbook/",
              label: "\u7559\u8A00\u677F\u9875 /guestbook/"
            },
            sponsor: {
              type: "boolean",
              description: "\u6253\u8D4F\u9875 /sponsor/\uFF0C\u4E0E sponsorConfig.enable \u53D6 AND",
              label: "\u6253\u8D4F\u9875 /sponsor/"
            },
            moments: {
              type: "boolean",
              description: "\u52A8\u6001\u9875 /moments/",
              label: "\u52A8\u6001\u9875 /moments/"
            },
            anime: {
              type: "boolean",
              description: "\u756A\u5267\u9875 /anime/\uFF0C\u4E0E animeConfig.enable \u53D6 AND",
              label: "\u756A\u5267\u9875 /anime/"
            },
            compass: {
              type: "boolean",
              description: "\u7F57\u76D8\u9875 /compass/",
              label: "\u7F57\u76D8\u9875 /compass/"
            },
            skills: {
              type: "boolean",
              description: "\u6280\u80FD\u9875 /skills/\uFF0C\u4E0E skillsConfig.enable \u53D6 AND",
              label: "\u6280\u80FD\u9875 /skills/"
            },
            projects: {
              type: "boolean",
              description: "\u9879\u76EE\u9875 /projects/\uFF0C\u4E0E projectsConfig.enable \u53D6 AND",
              label: "\u9879\u76EE\u9875 /projects/"
            },
            devices: {
              type: "boolean",
              description: "\u8BBE\u5907\u9875 /devices/\uFF0C\u4E0E devicesConfig.enable \u53D6 AND",
              label: "\u8BBE\u5907\u9875 /devices/"
            },
            timeline: {
              type: "boolean",
              description: "\u65F6\u95F4\u7EBF\u9875 /timeline/\uFF0C\u4E0E timelineConfig.enable \u53D6 AND",
              label: "\u65F6\u95F4\u7EBF\u9875 /timeline/"
            },
            albums: {
              type: "boolean",
              description: "\u76F8\u518C\u9875 /albums/ \u4E0E /albums/[id]/",
              label: "\u76F8\u518C\u9875 /albums/ \u4E0E /albums/[id]/"
            },
            categories: {
              type: "boolean",
              description: "\u5206\u7C7B\u7D22\u5F15\u9875 /categories/",
              label: "\u5206\u7C7B\u7D22\u5F15\u9875 /categories/"
            },
            tags: {
              type: "boolean",
              description: "\u6807\u7B7E\u7D22\u5F15\u9875 /tags/",
              label: "\u6807\u7B7E\u7D22\u5F15\u9875 /tags/"
            },
            about: {
              type: "boolean",
              description: "\u5173\u4E8E\u9875 /about/",
              label: "\u5173\u4E8E\u9875 /about/"
            }
          },
          description: "\u7EDF\u4E00\u9875\u9762\u5F00\u5173\uFF0812 \u4E2A\u5185\u5BB9\u9875\uFF0C\u9ED8\u8BA4\u5168\u5F00\uFF1B\u4E0E\u884C\u4E3A\u9886\u57DF enable \u53D6 AND\uFF0C\u5224\u5B9A\u89C1 src/utils/page-availability.ts\uFF09",
          label: "\u7EDF\u4E00\u9875\u9762\u5F00\u5173"
        },
        lang: {
          type: "string",
          enum: [
            "en",
            "zh_CN",
            "zh_TW",
            "ja",
            "ko",
            "es",
            "th",
            "vi",
            "tr",
            "id"
          ],
          description: "",
          label: "lang"
        },
        timeZone: {
          type: "string",
          description: "IANA time zone used to interpret precise content timestamps.",
          label: "IANA time zone used to interpret precise content timestamps."
        },
        themeColor: {
          type: "object",
          properties: {
            hue: {
              type: "number",
              description: "",
              label: "hue"
            },
            fixed: {
              type: "boolean",
              description: "",
              label: "fixed"
            },
            style: {
              type: "string",
              description: "",
              label: "style"
            },
            spec: {
              type: "string",
              description: "",
              label: "spec"
            }
          },
          description: "",
          label: "themeColor"
        },
        wallpaperMode: {
          type: "object",
          properties: {
            defaultMode: {
              type: "string",
              enum: [
                "banner",
                "fullscreen",
                "overlay",
                "none"
              ],
              description: "",
              label: "defaultMode"
            },
            fullscreen: {
              type: "object",
              properties: {
                layout: {
                  type: "string",
                  enum: [
                    "classic",
                    "hero"
                  ],
                  description: "",
                  label: "layout"
                }
              },
              description: "\u5168\u5C4F\u58C1\u7EB8\u6A21\u5F0F\u9ED8\u8BA4\u5E03\u5C40\uFF08\u8BBF\u5BA2\u53EF\u5728\u8BBE\u7F6E\u9762\u677F\u4E2D\u5207\u6362\u5E76\u4FDD\u5B58\u5230\u6D4F\u89C8\u5668\uFF09",
              label: "\u5168\u5C4F\u58C1\u7EB8\u6A21\u5F0F\u9ED8\u8BA4\u5E03\u5C40"
            },
            overlay: {
              type: "object",
              properties: {
                opacity: {
                  type: "number",
                  description: "\u58C1\u7EB8\u6574\u4F53\u4E0D\u900F\u660E\u5EA6 0-1\uFF08\u9ED8\u8BA4 0.8\uFF09",
                  label: "\u58C1\u7EB8\u6574\u4F53\u4E0D\u900F\u660E\u5EA6 0-1"
                },
                blur: {
                  type: "number",
                  description: "\u58C1\u7EB8\u6A21\u7CCA\u534A\u5F84 px 0-20\uFF08\u9ED8\u8BA4 10\uFF09",
                  label: "\u58C1\u7EB8\u6A21\u7CCA\u534A\u5F84 px 0-20"
                },
                cardOpacity: {
                  type: "number",
                  description: "\u534A\u900F\u660E\u5361\u7247\u4E0D\u900F\u660E\u5EA6 0-1\uFF08\u9ED8\u8BA4 0.6\uFF09",
                  label: "\u534A\u900F\u660E\u5361\u7247\u4E0D\u900F\u660E\u5EA6 0-1"
                }
              },
              description: "\u8986\u76D6\u900F\u660E\u6A21\u5F0F\u9ED8\u8BA4\u53C2\u6570\uFF08\u8BBF\u5BA2\u53EF\u5728\u8BBE\u7F6E\u9762\u677F\u4E2D\u8C03\u8282\u5E76\u4FDD\u5B58\u5230\u6D4F\u89C8\u5668\uFF09",
              label: "\u8986\u76D6\u900F\u660E\u6A21\u5F0F\u9ED8\u8BA4\u53C2\u6570"
            }
          },
          description: "",
          label: "wallpaperMode"
        },
        texture: {
          type: "object",
          properties: {
            enable: {
              type: "boolean",
              description: "\u662F\u5426\u542F\u7528\u7EB9\u7406\u7CFB\u7EDF",
              label: "\u662F\u5426\u542F\u7528\u7EB9\u7406\u7CFB\u7EDF"
            },
            defaultPreset: {
              type: "string",
              enum: [
                "none",
                "starlight",
                "cyber-dots",
                "topography",
                "geometric",
                "sakura"
              ],
              description: "\u9ED8\u8BA4\u751F\u6548\u7684\u7EB9\u7406\u9884\u8BBE",
              label: "\u9ED8\u8BA4\u751F\u6548\u7684\u7EB9\u7406\u9884\u8BBE"
            },
            defaultOpacity: {
              type: "number",
              description: "\u9ED8\u8BA4\u7EB9\u7406\u4E0D\u900F\u660E\u5EA6 (0.05 ~ 0.25, \u9ED8\u8BA4 0.12)",
              label: "\u9ED8\u8BA4\u7EB9\u7406\u4E0D\u900F\u660E\u5EA6 (0.05 ~ 0.25, \u9ED8\u8BA4 0.12)"
            },
            allowMotion: {
              type: "boolean",
              description: "\u662F\u5426\u5141\u8BB8\u80CC\u666F\u5FAE\u52A8\u6548 (\u5728\u5F00\u542F reduced-motion \u65F6\u5F3A\u5236\u9759\u6B62)",
              label: "\u662F\u5426\u5141\u8BB8\u80CC\u666F\u5FAE\u52A8\u6548 (\u5728\u5F00\u542F reduced-motion \u65F6\u5F3A\u5236\u9759\u6B62)"
            }
          },
          description: "\u9875\u9762\u80CC\u666F\u7EB9\u7406\u7CFB\u7EDF\u914D\u7F6E\uFF0C\u652F\u6301\u5E03\u5C14\u503C\u76F4\u63A5\u5F00\u5173\u6216\u8BE6\u7EC6\u914D\u7F6E\u5BF9\u8C61",
          label: "\u9875\u9762\u80CC\u666F\u7EB9\u7406\u7CFB\u7EDF\u914D\u7F6E"
        },
        effects: {
          type: "object",
          properties: {
            sakura: {
              type: "object",
              properties: {
                enable: {
                  type: "boolean",
                  description: "\u662F\u5426\u9ED8\u8BA4\u542F\u7528\u6A31\u82B1\u7279\u6548\uFF08\u9ED8\u8BA4 false\uFF1B\u5173\u95ED\u65F6\u96F6\u8BF7\u6C42\u3001\u96F6 DOM\u3001\u96F6\u6253\u5305\u8D1F\u62C5\uFF09",
                  label: "\u662F\u5426\u9ED8\u8BA4\u542F\u7528\u6A31\u82B1\u7279\u6548"
                },
                sakuraNum: {
                  type: "number",
                  description: "\u6A31\u82B1\u6570\u91CF\uFF08\u9ED8\u8BA4 21\uFF09",
                  label: "\u6A31\u82B1\u6570\u91CF"
                },
                limitTimes: {
                  type: "number",
                  description: "\u6A31\u82B1\u8D8A\u754C\u91CD\u7F6E\u6B21\u6570\u4E0A\u9650\uFF0C-1 \u4E3A\u65E0\u9650\u5FAA\u73AF",
                  label: "\u6A31\u82B1\u8D8A\u754C\u91CD\u7F6E\u6B21\u6570\u4E0A\u9650"
                },
                size: {
                  type: "object",
                  properties: {
                    min: {
                      type: "number",
                      description: "",
                      label: "min"
                    },
                    max: {
                      type: "number",
                      description: "",
                      label: "max"
                    }
                  },
                  description: "\u6A31\u82B1\u5C3A\u5BF8\u500D\u6570\u8303\u56F4",
                  label: "\u6A31\u82B1\u5C3A\u5BF8\u500D\u6570\u8303\u56F4"
                },
                opacity: {
                  type: "object",
                  properties: {
                    min: {
                      type: "number",
                      description: "",
                      label: "min"
                    },
                    max: {
                      type: "number",
                      description: "",
                      label: "max"
                    }
                  },
                  description: "\u6A31\u82B1\u4E0D\u900F\u660E\u5EA6\u8303\u56F4",
                  label: "\u6A31\u82B1\u4E0D\u900F\u660E\u5EA6\u8303\u56F4"
                },
                speed: {
                  type: "object",
                  properties: {
                    horizontal: {
                      type: "object",
                      properties: {
                        min: {
                          type: "number",
                          description: "",
                          label: "min"
                        },
                        max: {
                          type: "number",
                          description: "",
                          label: "max"
                        }
                      },
                      description: "\u6C34\u5E73\u6F02\u79FB\u901F\u5EA6\u8303\u56F4\uFF08\u8D1F\u503C\u5411\u5DE6\uFF09",
                      label: "\u6C34\u5E73\u6F02\u79FB\u901F\u5EA6\u8303\u56F4"
                    },
                    vertical: {
                      type: "object",
                      properties: {
                        min: {
                          type: "number",
                          description: "",
                          label: "min"
                        },
                        max: {
                          type: "number",
                          description: "",
                          label: "max"
                        }
                      },
                      description: "\u5782\u76F4\u4E0B\u843D\u901F\u5EA6\u8303\u56F4",
                      label: "\u5782\u76F4\u4E0B\u843D\u901F\u5EA6\u8303\u56F4"
                    },
                    rotation: {
                      type: "number",
                      description: "\u65CB\u8F6C\u901F\u5EA6\uFF08\u5F27\u5EA6/\u5E27\uFF09",
                      label: "\u65CB\u8F6C\u901F\u5EA6"
                    },
                    fadeSpeed: {
                      type: "number",
                      description: "\u6D88\u5931\uFF08\u6DE1\u51FA\uFF09\u901F\u5EA6\uFF0C\u4E0D\u5E94\u5927\u4E8E opacity.min",
                      label: "\u6D88\u5931"
                    }
                  },
                  description: "\u6A31\u82B1\u8FD0\u52A8\u901F\u5EA6",
                  label: "\u6A31\u82B1\u8FD0\u52A8\u901F\u5EA6"
                },
                zIndex: {
                  type: "number",
                  description: "\u753B\u5E03\u5C42\u7EA7\uFF08\u9ED8\u8BA4 100\uFF0C\u4F4D\u4E8E\u5185\u5BB9\u4E4B\u4E0A\u3001\u60AC\u6D6E\u63A7\u4EF6\u4E4B\u4E0B\uFF09",
                  label: "\u753B\u5E03\u5C42\u7EA7"
                }
              },
              description: "",
              label: "sakura"
            }
          },
          description: "\u9875\u9762\u7279\u6548\u914D\u7F6E\uFF08\u6A31\u82B1\u98D8\u843D\u7B49\u753B\u5E03\u7279\u6548\uFF09\uFF0Cenable: false \u65F6\u96F6\u8D1F\u62C5",
          label: "\u9875\u9762\u7279\u6548\u914D\u7F6E"
        },
        banner: {
          type: "object",
          properties: {
            src: {
              type: "object",
              properties: {
                desktop: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  description: "",
                  label: "desktop"
                },
                mobile: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  description: "",
                  label: "mobile"
                }
              },
              description: "",
              label: "src"
            },
            position: {
              type: "string",
              enum: [
                "center",
                "top",
                "bottom"
              ],
              description: "",
              label: "position"
            },
            pick: {
              type: "string",
              enum: [
                "first",
                "random"
              ],
              description: '\u8F6E\u64AD\u5173\u95ED\uFF08\u9759\u6001 Banner\uFF09\u65F6\u7684\u4E3B\u56FE\u9009\u62E9\uFF1A"first" \u7528\u5217\u8868\u7B2C\u4E00\u9879\uFF08\u9ED8\u8BA4\uFF09| "random" \u6BCF\u6B21\u8BBF\u95EE\u968F\u673A\u9009\u4E00\u9879\uFF08\u968F\u673A\u5230\u89C6\u9891\u64AD\u5B8C\u505C\u6700\u540E\u4E00\u5E27\uFF09\uFF1B\u8F6E\u64AD\u5F00\u542F\u65F6\u4E0D\u751F\u6548',
              label: "\u8F6E\u64AD\u5173\u95ED"
            },
            dim: {
              type: "object",
              properties: {
                enable: {
                  type: "boolean",
                  description: "",
                  label: "enable"
                },
                opacity: {
                  type: "number",
                  description: "",
                  label: "opacity"
                }
              },
              description: "",
              label: "dim"
            },
            homeText: {
              type: "object",
              properties: {
                enable: {
                  type: "boolean",
                  description: "",
                  label: "enable"
                },
                title: {
                  type: "string",
                  description: "",
                  label: "title"
                },
                subtitle: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  description: "\u9996\u9875\u526F\u6807\u9898\u6587\u672C\uFF0C\u652F\u6301\u5355\u6761\u5B57\u7B26\u4E32\u6216\u591A\u6761\u4EA4\u66FF\u5FAA\u73AF\u7684\u5B57\u7B26\u4E32\u6570\u7EC4",
                  label: "\u9996\u9875\u526F\u6807\u9898\u6587\u672C"
                },
                links: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: {
                        type: "string",
                        description: "\u6309\u94AE\u6587\u6848\uFF1B\u7701\u7565\u65F6\u6E32\u67D3\u4E3A\u5706\u5F62\u56FE\u6807\u6309\u94AE",
                        label: "\u6309\u94AE\u6587\u6848\uFF1B\u7701\u7565\u65F6\u6E32\u67D3\u4E3A\u5706\u5F62\u56FE\u6807\u6309\u94AE"
                      },
                      icon: {
                        type: "string",
                        description: 'astro-icon \u56FE\u6807\u540D\uFF08\u5982 "material-symbols:send-outline-rounded"\uFF09',
                        label: "astro-icon \u56FE\u6807\u540D"
                      },
                      url: {
                        type: "string",
                        description: "\u8DF3\u8F6C\u5730\u5740",
                        label: "\u8DF3\u8F6C\u5730\u5740"
                      },
                      ariaLabel: {
                        type: "string",
                        description: "\u65E0\u6587\u5B57\u6309\u94AE\u7684\u8BBF\u95EE\u540D\u79F0\uFF08aria-label\uFF09\uFF0C\u7EAF\u56FE\u6807\u6309\u94AE\u5EFA\u8BAE\u63D0\u4F9B",
                        label: "\u65E0\u6587\u5B57\u6309\u94AE\u7684\u8BBF\u95EE\u540D\u79F0"
                      },
                      external: {
                        type: "boolean",
                        description: "\u662F\u5426\u5728\u65B0\u6807\u7B7E\u9875\u6253\u5F00\uFF08\u9ED8\u8BA4\u6309 url \u662F\u5426\u4E3A http(s) \u5224\u65AD\uFF09",
                        label: "\u662F\u5426\u5728\u65B0\u6807\u7B7E\u9875\u6253\u5F00"
                      }
                    }
                  },
                  description: "\u6807\u9898\u4E0B\u65B9\u7684\u5FEB\u6377\u5165\u53E3\u6309\u94AE\uFF1B\u7701\u7565\u6216\u7A7A\u6570\u7EC4\u65F6\u96F6 DOM\uFF08\u96F6\u989D\u5916\u8D1F\u62C5\uFF09",
                  label: "\u6807\u9898\u4E0B\u65B9\u7684\u5FEB\u6377\u5165\u53E3\u6309\u94AE\uFF1B\u7701\u7565\u6216\u7A7A\u6570\u7EC4\u65F6\u96F6 DOM"
                },
                typewriter: {
                  type: "object",
                  properties: {
                    enable: {
                      type: "boolean",
                      description: "",
                      label: "enable"
                    },
                    speed: {
                      type: "number",
                      description: "\u6253\u5B57\u901F\u5EA6\uFF08\u6BCF\u4E2A\u5B57\u7B26\u95F4\u9694\uFF0C\u6BEB\u79D2\uFF0C\u9ED8\u8BA4 120\uFF09",
                      label: "\u6253\u5B57\u901F\u5EA6"
                    },
                    deleteSpeed: {
                      type: "number",
                      description: "\u56DE\u9000\u53CD\u5411\u5220\u9664\u901F\u5EA6\uFF08\u6BCF\u4E2A\u5B57\u7B26\u95F4\u9694\uFF0C\u6BEB\u79D2\uFF0C\u9ED8\u8BA4 50\uFF09",
                      label: "\u56DE\u9000\u53CD\u5411\u5220\u9664\u901F\u5EA6"
                    },
                    pauseTime: {
                      type: "number",
                      description: "\u6253\u5B57\u5B8C\u6210\u540E\u7B49\u5F85\u505C\u987F\u65F6\u95F4\uFF08\u6BEB\u79D2\uFF0C\u9ED8\u8BA4 2000\uFF09",
                      label: "\u6253\u5B57\u5B8C\u6210\u540E\u7B49\u5F85\u505C\u987F\u65F6\u95F4"
                    },
                    loop: {
                      type: "boolean",
                      description: "\u5B8C\u6210\u540E\u662F\u5426\u5FAA\u73AF\u64AD\u653E\uFF08\u9ED8\u8BA4 true\uFF09",
                      label: "\u5B8C\u6210\u540E\u662F\u5426\u5FAA\u73AF\u64AD\u653E"
                    }
                  },
                  description: "",
                  label: "typewriter"
                }
              },
              description: "",
              label: "homeText"
            },
            video: {
              type: "object",
              properties: {
                enable: {
                  type: "boolean",
                  description: "",
                  label: "enable"
                },
                src: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  description: "\u89C6\u9891\u6E90\u5217\u8868\uFF08public \u8DEF\u5F84\u6216\u8FDC\u7A0B URL\uFF09\uFF0C\u81F3\u5C11\u4E00\u9879\u65F6\u64AD\u653E\u63A7\u4EF6\u624D\u53EF\u7528",
                  label: "\u89C6\u9891\u6E90\u5217\u8868"
                },
                mode: {
                  type: "string",
                  enum: [
                    "random",
                    "order"
                  ],
                  description: '\u591A\u89C6\u9891\u64AD\u653E\u987A\u5E8F\uFF1A"order" \u6309\u6570\u7EC4\u987A\u5E8F\uFF08\u9ED8\u8BA4\uFF09| "random" \u968F\u673A',
                  label: '\u591A\u89C6\u9891\u64AD\u653E\u987A\u5E8F\uFF1A"order" \u6309\u6570\u7EC4\u987A\u5E8F'
                }
              },
              description: "\u6A2A\u5E45\u80CC\u666F\u89C6\u9891\uFF1Aenable: false\uFF08\u9ED8\u8BA4\uFF09\u65F6\u4E0D\u8F93\u51FA video \u5143\u7D20\u4E0E\u64AD\u653E\u63A7\u4EF6\uFF08\u96F6\u989D\u5916\u8D1F\u62C5\uFF09",
              label: "\u6A2A\u5E45\u80CC\u666F\u89C6\u9891\uFF1Aenable: false"
            },
            carousel: {
              type: "object",
              properties: {
                enable: {
                  type: "boolean",
                  description: "",
                  label: "enable"
                },
                interval: {
                  type: "number",
                  description: "",
                  label: "interval"
                },
                fadeDuration: {
                  type: "number",
                  description: "\u4EA4\u53C9\u6DE1\u5165\u6DE1\u51FA\u8FC7\u6E21\u65F6\u957F\uFF08\u6BEB\u79D2\uFF0C\u9ED8\u8BA4 1200\uFF09",
                  label: "\u4EA4\u53C9\u6DE1\u5165\u6DE1\u51FA\u8FC7\u6E21\u65F6\u957F"
                },
                animation: {
                  type: "string",
                  enum: [
                    "none",
                    "ken-burns",
                    "zoom-in",
                    "zoom-out",
                    "pan-left",
                    "pan-right"
                  ],
                  description: '\u8FD0\u955C\u547C\u5438\u52A8\u753B\u6A21\u5F0F\uFF1A"ken-burns"\uFF08\u9ED8\u8BA4\uFF0C\u5E8F\u5217\u8FD0\u955C\uFF09| "zoom-in" | "zoom-out" | "pan-left" | "pan-right" | "none"',
                  label: '\u8FD0\u955C\u547C\u5438\u52A8\u753B\u6A21\u5F0F\uFF1A"ken-burns"'
                }
              },
              description: "",
              label: "carousel"
            },
            waves: {
              type: "object",
              properties: {
                enable: {
                  type: "boolean",
                  description: "",
                  label: "enable"
                }
              },
              description: "",
              label: "waves"
            },
            gradient: {
              type: "object",
              properties: {
                enable: {
                  type: "boolean",
                  description: "",
                  label: "enable"
                }
              },
              description: "\u6E10\u53D8\u8FC7\u6E21\uFF1A\u6A2A\u5E45\u6A21\u5F0F\u5207\u6362\u9875\u9762\u65F6\u7684\u6E10\u53D8\u52A8\u753B\uFF0Cenable \u4E3A\u8BBF\u5BA2\u5F00\u5173\u7684\u7AD9\u70B9\u9ED8\u8BA4\u503C",
              label: "\u6E10\u53D8\u8FC7\u6E21\uFF1A\u6A2A\u5E45\u6A21\u5F0F\u5207\u6362\u9875\u9762\u65F6\u7684\u6E10\u53D8\u52A8\u753B"
            }
          },
          description: "",
          label: "banner"
        },
        imageOptimization: {
          type: "object",
          properties: {
            noReferrerDomains: {
              type: "array",
              items: {
                type: "string"
              },
              description: '\u6DFB\u52A0 `referrerpolicy="no-referrer"` \u7684\u8FDC\u7A0B\u56FE\u7247\u57DF\u540D\uFF0C\u652F\u6301 `*.example.com` \u901A\u914D\u7B26\u3002',
              label: '\u6DFB\u52A0 `referrerpolicy="no-referrer"` \u7684\u8FDC\u7A0B\u56FE\u7247\u57DF\u540D'
            }
          },
          description: "Markdown \u6B63\u6587\u56FE\u7247\u5904\u7406\u914D\u7F6E\u3002",
          label: "Markdown \u6B63\u6587\u56FE\u7247\u5904\u7406\u914D\u7F6E"
        },
        toc: {
          type: "object",
          properties: {
            enable: {
              type: "boolean",
              description: "",
              label: "enable"
            },
            depth: {
              type: "number",
              enum: [
                1,
                2,
                3
              ],
              description: "",
              label: "depth"
            }
          },
          description: "",
          label: "toc"
        },
        progressIndicator: {
          type: "object",
          properties: {
            style: {
              type: "string",
              enum: [
                "dual",
                "single"
              ],
              description: "dual \u53CC\u5411\u626B\u63CF\uFF08\u5B98\u65B9\u9ED8\u8BA4\u53CC\u7EBF\uFF09/ single \u5355\u5411\u626B\u63CF\uFF08\u5355\u7EBF\uFF09",
              label: "dual \u53CC\u5411\u626B\u63CF"
            }
          },
          description: "\u8FDB\u5EA6\u6761\u9884\u8BBE\u6837\u5F0F\uFF08\u9875\u9762\u5207\u6362\u8FDB\u5EA6\u6761\u7B49\uFF0C\u4EC5\u7EBF\u6027\u626B\u63CF\u6A21\u5F0F\uFF09",
          label: "\u8FDB\u5EA6\u6761\u9884\u8BBE\u6837\u5F0F"
        },
        favicon: {
          type: "array",
          items: {
            type: "object",
            properties: {
              src: {
                type: "string",
                description: "",
                label: "src"
              },
              theme: {
                type: "string",
                enum: [
                  "light",
                  "dark"
                ],
                description: "",
                label: "theme"
              },
              sizes: {
                type: "string",
                description: "",
                label: "sizes"
              }
            }
          },
          description: "",
          label: "favicon"
        }
      }
    }
  },
  permalink: {
    defaults: {
      enable: false,
      format: "%postname%"
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u662F\u5426\u542F\u7528\u5168\u5C40\u6587\u7AE0\u56FA\u5B9A\u94FE\u63A5\u529F\u80FD\uFF0C\u5173\u95ED\u65F6\u4F7F\u7528\u9ED8\u8BA4\u7684\u6587\u4EF6\u540D\u4F5C\u4E3A\u94FE\u63A5 (/posts/<slug>/)",
          label: "\u662F\u5426\u542F\u7528\u5168\u5C40\u6587\u7AE0\u56FA\u5B9A\u94FE\u63A5\u529F\u80FD"
        },
        format: {
          type: "string",
          description: "\u56FA\u5B9A\u94FE\u63A5\u683C\u5F0F\u6A21\u677F",
          label: "\u56FA\u5B9A\u94FE\u63A5\u683C\u5F0F\u6A21\u677F"
        }
      }
    }
  },
  profile: {
    defaults: {
      avatar: "assets/images/demo-avatar.webp",
      name: "Shirone",
      bio: "The rain remembers what the sky forgot to say.",
      links: [
        {
          name: "Twitter",
          icon: "fa6-brands:twitter",
          url: "https://twitter.com"
        },
        {
          name: "Steam",
          icon: "fa6-brands:steam",
          url: "https://store.steampowered.com"
        },
        {
          name: "GitHub",
          icon: "fa6-brands:github",
          url: "https://github.com/LyraVoid/Shirone"
        }
      ]
    },
    schema: {
      type: "object",
      properties: {
        avatar: {
          type: "string",
          description: "",
          label: "avatar"
        },
        name: {
          type: "string",
          description: "",
          label: "name"
        },
        bio: {
          type: "string",
          description: "",
          label: "bio"
        },
        links: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "",
                label: "name"
              },
              url: {
                type: "string",
                description: "",
                label: "url"
              },
              icon: {
                type: "string",
                description: "",
                label: "icon"
              }
            }
          },
          description: "",
          label: "links"
        }
      }
    }
  },
  license: {
    defaults: {
      enable: true,
      name: "CC BY-NC-SA 4.0",
      url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "",
          label: "enable"
        },
        name: {
          type: "string",
          description: "",
          label: "name"
        },
        url: {
          type: "string",
          description: "",
          label: "url"
        }
      }
    }
  },
  "expressive-code": {
    defaults: {
      theme: "github-dark",
      lightTheme: "github-light",
      darkTheme: "github-dark"
    },
    schema: {
      type: "object",
      properties: {
        theme: {
          type: "string",
          description: "",
          label: "theme"
        },
        lightTheme: {
          type: "string",
          description: "",
          label: "lightTheme"
        },
        darkTheme: {
          type: "string",
          description: "",
          label: "darkTheme"
        }
      }
    }
  },
  announcement: {
    defaults: {
      title: "",
      content: "The only way to do great work is to love what you do",
      closable: true,
      link: {
        enable: true,
        text: "GitHub",
        url: "https://github.com",
        external: true
      },
      board: {
        enable: false,
        items: []
      }
    },
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: '\u516C\u544A\u680F\u6807\u9898\uFF0C\u7559\u7A7A\u5219\u81EA\u52A8\u4F7F\u7528 i18n Key.announcement ("\u516C\u544A")',
          label: "\u516C\u544A\u680F\u6807\u9898"
        },
        content: {
          type: "string",
          description: "\u516C\u544A\u6B63\u6587\u5185\u5BB9",
          label: "\u516C\u544A\u6B63\u6587\u5185\u5BB9"
        },
        text: {
          type: "string",
          description: "\u5411\u540E\u517C\u5BB9\u8001\u914D\u7F6E\u7684 text \u5B57\u6BB5",
          label: "\u5411\u540E\u517C\u5BB9\u8001\u914D\u7F6E\u7684 text \u5B57\u6BB5"
        },
        icon: {
          type: "string",
          description: "\u516C\u544A\u680F\u53EF\u9009\u56FE\u6807",
          label: "\u516C\u544A\u680F\u53EF\u9009\u56FE\u6807"
        },
        type: {
          type: "string",
          enum: [
            "info",
            "warning",
            "success",
            "error"
          ],
          description: "\u516C\u544A\u7C7B\u578B",
          label: "\u516C\u544A\u7C7B\u578B"
        },
        closable: {
          type: "boolean",
          description: "\u662F\u5426\u5141\u8BB8\u7528\u6237\u5173\u95ED\u516C\u544A",
          label: "\u662F\u5426\u5141\u8BB8\u7528\u6237\u5173\u95ED\u516C\u544A"
        },
        closeDuration: {
          type: "number",
          description: "\u5173\u95ED\u516C\u544A\u540E\u7684\u6709\u6548\u751F\u547D\u5468\u671F\uFF08\u5355\u4F4D\uFF1A\u79D2\uFF09\u3002",
          label: "\u5173\u95ED\u516C\u544A\u540E\u7684\u6709\u6548\u751F\u547D\u5468\u671F"
        },
        link: {
          type: "object",
          properties: {
            enable: {
              type: "boolean",
              description: "\u662F\u5426\u542F\u7528\u94FE\u63A5",
              label: "\u662F\u5426\u542F\u7528\u94FE\u63A5"
            },
            text: {
              type: "string",
              description: "\u94FE\u63A5\u6587\u672C",
              label: "\u94FE\u63A5\u6587\u672C"
            },
            url: {
              type: "string",
              description: "\u94FE\u63A5 URL",
              label: "\u94FE\u63A5 URL"
            },
            external: {
              type: "boolean",
              description: "\u662F\u5426\u5916\u90E8\u94FE\u63A5\uFF08\u65B0\u7A97\u53E3\u6253\u5F00\uFF09",
              label: "\u662F\u5426\u5916\u90E8\u94FE\u63A5"
            }
          },
          description: "\u53EF\u9009\u884C\u52A8\u94FE\u63A5\u914D\u7F6E",
          label: "\u53EF\u9009\u884C\u52A8\u94FE\u63A5\u914D\u7F6E"
        },
        board: {
          type: "object",
          properties: {
            enable: {
              type: "boolean",
              description: "\u516C\u544A\u677F\u603B\u5F00\u5173",
              label: "\u516C\u544A\u677F\u603B\u5F00\u5173"
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tag: {
                    type: "string",
                    description: '\u5DE6\u4E0A\u89D2\u5C0F\u6807\u7B7E\uFF08\u5982"\u66F4\u65B0"\u3001"\u6D3B\u52A8"\uFF1B\u7701\u7565\u4E0D\u663E\u793A chip\uFF09',
                    label: "\u5DE6\u4E0A\u89D2\u5C0F\u6807\u7B7E"
                  },
                  title: {
                    type: "string",
                    description: "\u516C\u544A\u6807\u9898",
                    label: "\u516C\u544A\u6807\u9898"
                  },
                  date: {
                    type: "string",
                    description: "\u516C\u544A\u65E5\u671F\uFF08\u5C55\u793A\u6587\u672C\uFF0C\u5982 2026-08-29\uFF09",
                    label: "\u516C\u544A\u65E5\u671F"
                  },
                  content: {
                    type: "string",
                    description: "\u516C\u544A\u6B63\u6587",
                    label: "\u516C\u544A\u6B63\u6587"
                  },
                  link: {
                    type: "object",
                    properties: {
                      text: {
                        type: "object",
                        description: "\u94FE\u63A5\u6587\u672C",
                        label: "\u94FE\u63A5\u6587\u672C"
                      },
                      url: {
                        type: "object",
                        description: "\u94FE\u63A5 URL",
                        label: "\u94FE\u63A5 URL"
                      },
                      external: {
                        type: "object",
                        description: "\u662F\u5426\u5916\u90E8\u94FE\u63A5\uFF08\u65B0\u7A97\u53E3\u6253\u5F00\uFF09",
                        label: "\u662F\u5426\u5916\u90E8\u94FE\u63A5"
                      },
                      enable: {
                        type: "object",
                        description: "",
                        label: "enable"
                      }
                    },
                    description: '\u53EF\u9009"\u67E5\u770B\u8BE6\u60C5"\u94FE\u63A5\uFF08\u63D0\u4F9B url \u4E14\u672A\u663E\u5F0F enable: false \u65F6\u6E32\u67D3\uFF09',
                    label: '\u53EF\u9009"\u67E5\u770B\u8BE6\u60C5"\u94FE\u63A5'
                  }
                }
              },
              description: "\u516C\u544A\u5217\u8868\uFF08\u6309\u6570\u7EC4\u987A\u5E8F\u5C55\u793A\uFF09",
              label: "\u516C\u544A\u5217\u8868"
            }
          },
          description: "\u516C\u544A\u677F\uFF08FAB \u5F39\u7A97\u5217\u8868\uFF09\uFF1B\u672A\u5F00\u542F\u6216\u5217\u8868\u4E3A\u7A7A\u65F6\u4E0D\u6E32\u67D3\u4EFB\u4F55 DOM\uFF08\u96F6\u989D\u5916\u8D1F\u62C5\uFF09",
          label: "\u516C\u544A\u677F"
        }
      }
    }
  },
  "post-list": {
    defaults: {
      pageSize: 8,
      layout: {
        mode: "list",
        cover: "right",
        cardWidth: "regular"
      }
    },
    schema: {
      type: "object",
      properties: {
        pageSize: {
          type: "number",
          description: "\u9996\u9875\u6BCF\u9875\u6587\u7AE0\u6570",
          label: "\u9996\u9875\u6BCF\u9875\u6587\u7AE0\u6570"
        },
        layout: {
          type: "object",
          properties: {
            mode: {
              type: "string",
              enum: [
                "list",
                "grid"
              ],
              description: "",
              label: "mode"
            },
            cover: {
              type: "string",
              enum: [
                "left",
                "right"
              ],
              description: "",
              label: "cover"
            },
            cardWidth: {
              type: "string",
              enum: [
                "compact",
                "regular",
                "relaxed"
              ],
              description: "",
              label: "cardWidth"
            }
          },
          description: "",
          label: "layout"
        }
      }
    }
  },
  "random-cover": {
    defaults: {
      enable: false,
      endpoint: "",
      fallback: "/images/default-cover.webp"
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u662F\u5426\u542F\u7528\u968F\u673A\u5C01\u9762\u56DE\u9000\uFF1Afalse \u65F6\u65E0\u5C01\u9762\u6587\u7AE0\u4FDD\u6301\u539F\u884C\u4E3A\uFF08\u5217\u8868\u5361\u8FDB\u5165\u7BAD\u5934 / \u6587\u7AE0\u9875\u865A\u7EBF\uFF09\uFF0C\u96F6\u989D\u5916\u8D1F\u62C5",
          label: "\u662F\u5426\u542F\u7528\u968F\u673A\u5C01\u9762\u56DE\u9000\uFF1Afalse \u65F6\u65E0\u5C01\u9762\u6587\u7AE0\u4FDD\u6301\u539F\u884C\u4E3A"
        },
        endpoint: {
          type: "string",
          description: "\u56FE\u5E8A\u968F\u673A\u56FE\u7AEF\u70B9\uFF08\u5B8C\u6574 URL\uFF0C\u53EF\u76F4\u63A5\u4F5C\u4E3A <img src>\uFF09\u3002",
          label: "\u56FE\u5E8A\u968F\u673A\u56FE\u7AEF\u70B9"
        },
        fallback: {
          type: "string",
          description: "\u968F\u673A\u56FE\u52A0\u8F7D\u5931\u8D25\u65F6\u7684\u672C\u5730\u515C\u5E95\u56FE\uFF08\u7AD9\u70B9\u5185\u7EDD\u5BF9\u8DEF\u5F84\uFF0C\u6307\u5411 public/ \u4E0B\u7684\u6587\u4EF6\uFF09",
          label: "\u968F\u673A\u56FE\u52A0\u8F7D\u5931\u8D25\u65F6\u7684\u672C\u5730\u515C\u5E95\u56FE"
        }
      }
    }
  },
  article: {
    defaults: {
      lastUpdated: {
        enable: true,
        minimumAgeDays: 90
      },
      discovery: {
        enable: true,
        related: {
          enable: true,
          count: 3
        },
        random: {
          enable: true,
          count: 2
        }
      },
      share: {
        enable: true,
        includeCover: true
      }
    },
    schema: {
      type: "object",
      properties: {
        lastUpdated: {
          type: "object",
          properties: {
            enable: {
              type: "boolean",
              description: "\u662F\u5426\u663E\u793A\u6587\u7AE0\u6700\u540E\u66F4\u65B0\u63D0\u793A\u3002",
              label: "\u662F\u5426\u663E\u793A\u6587\u7AE0\u6700\u540E\u66F4\u65B0\u63D0\u793A"
            },
            minimumAgeDays: {
              type: "number",
              description: "\u8DDD\u6700\u540E\u66F4\u65B0\u8FBE\u5230\u8BE5\u65E5\u5386\u5929\u6570\u65F6\u663E\u793A\uFF1B0 \u8868\u793A\u7ACB\u5373\u663E\u793A\u3002",
              label: "\u8DDD\u6700\u540E\u66F4\u65B0\u8FBE\u5230\u8BE5\u65E5\u5386\u5929\u6570\u65F6\u663E\u793A\uFF1B0 \u8868\u793A\u7ACB\u5373\u663E\u793A"
            }
          },
          description: "",
          label: "lastUpdated"
        },
        discovery: {
          type: "object",
          properties: {
            enable: {
              type: "boolean",
              description: "\u662F\u5426\u542F\u7528\u6587\u7AE0\u5C3E\u90E8\u7684\u5EF6\u4F38\u9605\u8BFB\u533A\u57DF\u3002",
              label: "\u662F\u5426\u542F\u7528\u6587\u7AE0\u5C3E\u90E8\u7684\u5EF6\u4F38\u9605\u8BFB\u533A\u57DF"
            },
            related: {
              type: "object",
              properties: {
                enable: {
                  type: "boolean",
                  description: "",
                  label: "enable"
                },
                count: {
                  type: "number",
                  description: "\u6700\u591A\u663E\u793A\u7684\u76F8\u5173\u6587\u7AE0\u6570\u91CF\u3002",
                  label: "\u6700\u591A\u663E\u793A\u7684\u76F8\u5173\u6587\u7AE0\u6570\u91CF"
                }
              },
              description: "\u6309\u6807\u7B7E\u4E0E\u5206\u7C7B\u8BC1\u636E\u7B5B\u9009\u7684\u76F8\u5173\u6587\u7AE0\u3002",
              label: "\u6309\u6807\u7B7E\u4E0E\u5206\u7C7B\u8BC1\u636E\u7B5B\u9009\u7684\u76F8\u5173\u6587\u7AE0"
            },
            random: {
              type: "object",
              properties: {
                enable: {
                  type: "boolean",
                  description: "",
                  label: "enable"
                },
                count: {
                  type: "number",
                  description: "\u6700\u591A\u663E\u793A\u7684\u968F\u673A\u6587\u7AE0\u6570\u91CF\u3002",
                  label: "\u6700\u591A\u663E\u793A\u7684\u968F\u673A\u6587\u7AE0\u6570\u91CF"
                }
              },
              description: "\u4ECE\u5269\u4F59\u5019\u9009\u4E2D\u6309\u5F53\u524D\u6587\u7AE0\u7A33\u5B9A\u62BD\u6837\u7684\u968F\u673A\u6587\u7AE0\u3002",
              label: "\u4ECE\u5269\u4F59\u5019\u9009\u4E2D\u6309\u5F53\u524D\u6587\u7AE0\u7A33\u5B9A\u62BD\u6837\u7684\u968F\u673A\u6587\u7AE0"
            }
          },
          description: "",
          label: "discovery"
        },
        share: {
          type: "object",
          properties: {
            enable: {
              type: "boolean",
              description: "\u662F\u5426\u542F\u7528\u6587\u7AE0\u5206\u4EAB\u4E0E\u6D77\u62A5\u751F\u6210\u3002",
              label: "\u662F\u5426\u542F\u7528\u6587\u7AE0\u5206\u4EAB\u4E0E\u6D77\u62A5\u751F\u6210"
            },
            includeCover: {
              type: "boolean",
              description: "\u5206\u4EAB\u6D77\u62A5\u662F\u5426\u9ED8\u8BA4\u5305\u542B\u6587\u7AE0\u5C01\u9762\uFF08\u5C01\u9762\u4E0D\u53EF\u7528\u65F6\u81EA\u52A8\u964D\u7EA7\u4E3A\u65E0\u5C01\u9762\u6392\u7248\uFF09\u3002",
              label: "\u5206\u4EAB\u6D77\u62A5\u662F\u5426\u9ED8\u8BA4\u5305\u542B\u6587\u7AE0\u5C01\u9762"
            }
          },
          description: "",
          label: "share"
        }
      }
    }
  },
  comment: {
    defaults: {
      enable: false,
      provider: "none",
      lazy: true,
      twikoo: {
        envId: "",
        scriptUrl: "https://cdn.jsdelivr.net/npm/twikoo@1.7.19/dist/twikoo.min.js",
        lang: "auto",
        placeholder: "Share your thoughts..."
      },
      waline: {
        serverURL: "",
        scriptUrl: "https://unpkg.com/@waline/client@v3/dist/waline.js",
        cssUrl: "https://unpkg.com/@waline/client@v3/dist/waline.css",
        lang: "auto",
        placeholder: "",
        pageview: false,
        emoji: [],
        wordLimit: [
          0,
          0
        ]
      }
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u662F\u5426\u5168\u5C40\u542F\u7528\u8BC4\u8BBA\u529F\u80FD",
          label: "\u662F\u5426\u5168\u5C40\u542F\u7528\u8BC4\u8BBA\u529F\u80FD"
        },
        provider: {
          type: "string",
          enum: [
            "none",
            "twikoo",
            "waline"
          ],
          description: "\u9009\u7528\u7684\u8BC4\u8BBA\u63D0\u4F9B\u5546",
          label: "\u9009\u7528\u7684\u8BC4\u8BBA\u63D0\u4F9B\u5546"
        },
        lazy: {
          type: "boolean",
          description: "\u662F\u5426\u5F00\u542F\u89C6\u53E3\u61D2\u52A0\u8F7D\uFF08\u8FDB\u5165\u89C6\u53E3\u524D\u4E0D\u52A0\u8F7D\u5916\u90E8\u811A\u672C\uFF09",
          label: "\u662F\u5426\u5F00\u542F\u89C6\u53E3\u61D2\u52A0\u8F7D"
        },
        twikoo: {
          type: "object",
          properties: {
            envId: {
              type: "string",
              description: "Twikoo \u73AF\u5883 ID \u6216\u540E\u7AEF\u670D\u52A1\u5730\u5740 URL",
              label: "Twikoo \u73AF\u5883 ID \u6216\u540E\u7AEF\u670D\u52A1\u5730\u5740 URL"
            },
            scriptUrl: {
              type: "string",
              description: "Twikoo \u5BA2\u6237\u7AEF JS \u811A\u672C CDN \u5730\u5740",
              label: "Twikoo \u5BA2\u6237\u7AEF JS \u811A\u672C CDN \u5730\u5740"
            },
            lang: {
              type: "string",
              description: '\u8BC4\u8BBA\u8BED\u8A00\uFF0C"auto" \u81EA\u52A8\u8DDF\u968F\u7AD9\u70B9\u8BED\u8A00\uFF0C\u4E5F\u53EF\u6307\u5B9A\u5982 "zh-CN", "en" \u7B49',
              label: "\u8BC4\u8BBA\u8BED\u8A00"
            },
            placeholder: {
              type: "string",
              description: "\u8BC4\u8BBA\u8F93\u5165\u6846\u7684\u7070\u8272\u8BF4\u660E\u6587\u5B57\uFF1B\u7559\u7A7A\u65F6\u4E0D\u663E\u793A",
              label: "\u8BC4\u8BBA\u8F93\u5165\u6846\u7684\u7070\u8272\u8BF4\u660E\u6587\u5B57\uFF1B\u7559\u7A7A\u65F6\u4E0D\u663E\u793A"
            }
          },
          description: "Twikoo \u4E13\u5C5E\u914D\u7F6E",
          label: "Twikoo \u4E13\u5C5E\u914D\u7F6E"
        },
        waline: {
          type: "object",
          properties: {
            serverURL: {
              type: "string",
              description: 'Waline \u670D\u52A1\u7AEF\u5730\u5740\uFF08\u5982 "https://your-waline.vercel.app"\uFF09\uFF0C\u5FC5\u586B',
              label: "Waline \u670D\u52A1\u7AEF\u5730\u5740"
            },
            scriptUrl: {
              type: "string",
              description: "Waline \u5BA2\u6237\u7AEF ESM \u811A\u672C\u5730\u5740\uFF08@waline/client v3 dist/waline.js\uFF09",
              label: "Waline \u5BA2\u6237\u7AEF ESM \u811A\u672C\u5730\u5740"
            },
            cssUrl: {
              type: "string",
              description: "Waline \u6837\u5F0F\u8868\u5730\u5740\uFF08@waline/client v3 dist/waline.css\uFF09",
              label: "Waline \u6837\u5F0F\u8868\u5730\u5740"
            },
            lang: {
              type: "string",
              description: '\u8BC4\u8BBA\u8BED\u8A00\uFF0C"auto" \u81EA\u52A8\u8DDF\u968F\u7AD9\u70B9\u8BED\u8A00\uFF0C\u4E5F\u53EF\u6307\u5B9A\u5982 "zh-CN", "en" \u7B49',
              label: "\u8BC4\u8BBA\u8BED\u8A00"
            },
            placeholder: {
              type: "string",
              description: "\u8BC4\u8BBA\u8F93\u5165\u6846\u7684\u7070\u8272\u8BF4\u660E\u6587\u5B57\uFF1B\u7559\u7A7A\u65F6\u4F7F\u7528 Waline \u9ED8\u8BA4\u6587\u6848",
              label: "\u8BC4\u8BBA\u8F93\u5165\u6846\u7684\u7070\u8272\u8BF4\u660E\u6587\u5B57\uFF1B\u7559\u7A7A\u65F6\u4F7F\u7528 Waline \u9ED8\u8BA4\u6587\u6848"
            },
            pageview: {
              type: "boolean",
              description: "\u662F\u5426\u5F00\u542F\u9875\u9762\u6D4F\u89C8\u91CF\u7EDF\u8BA1\uFF08\u9700\u670D\u52A1\u7AEF\u652F\u6301\uFF09",
              label: "\u662F\u5426\u5F00\u542F\u9875\u9762\u6D4F\u89C8\u91CF\u7EDF\u8BA1"
            },
            emoji: {
              type: "array",
              items: {
                type: "string"
              },
              description: "\u8868\u60C5\u5305\u9884\u8BBE URL \u5217\u8868\uFF1B\u7559\u7A7A\u4F7F\u7528 Waline \u9ED8\u8BA4\u8868\u60C5",
              label: "\u8868\u60C5\u5305\u9884\u8BBE URL \u5217\u8868\uFF1B\u7559\u7A7A\u4F7F\u7528 Waline \u9ED8\u8BA4\u8868\u60C5"
            },
            wordLimit: {
              type: "array",
              items: {
                type: "number"
              },
              description: "\u8BC4\u8BBA\u5B57\u6570\u9650\u5236 [\u6700\u5C0F, \u6700\u5927]\uFF1B\u7559\u7A7A\u4E0D\u9650\u5236",
              label: "\u8BC4\u8BBA\u5B57\u6570\u9650\u5236 [\u6700\u5C0F, \u6700\u5927]\uFF1B\u7559\u7A7A\u4E0D\u9650\u5236"
            }
          },
          description: "Waline \u4E13\u5C5E\u914D\u7F6E",
          label: "Waline \u4E13\u5C5E\u914D\u7F6E"
        }
      }
    }
  },
  "context-menu": {
    defaults: {
      enable: true,
      actions: [
        "copySelection",
        "backToTop",
        "sharePageLink"
      ]
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "Master switch. False means zero DOM and zero client runtime.",
          label: "Master switch. False means zero DOM and zero client runtime."
        },
        pages: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "home",
              "archive",
              "friends",
              "guestbook",
              "moments",
              "series",
              "media",
              "anime",
              "compass",
              "skills",
              "projects",
              "devices",
              "timeline",
              "albums",
              "about",
              "sponsor",
              "categories",
              "tags",
              "rss",
              "atom",
              "post"
            ]
          },
          description: "Pages where the enhancement is allowed. Omit for every page.",
          label: "Pages where the enhancement is allowed. Omit for every page."
        },
        actions: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "copySelection",
              "backToTop",
              "sharePageLink"
            ]
          },
          description: "Menu actions in display order.",
          label: "Menu actions in display order."
        }
      }
    }
  },
  fab: {
    defaults: {
      enable: true,
      align: "end",
      size: "regular",
      offset: {
        bottom: "var(--m3e-space-8)",
        right: "var(--m3e-space-6)"
      },
      items: [
        {
          type: "top",
          enable: true,
          devices: [
            "mobile",
            "tablet",
            "desktop"
          ]
        },
        {
          type: "toc",
          enable: true,
          devices: [
            "mobile",
            "tablet"
          ],
          pages: [
            "post"
          ],
          depth: 3,
          closeOnSelect: true
        },
        {
          type: "comment",
          enable: true,
          devices: [
            "mobile",
            "tablet"
          ],
          pages: [
            "post"
          ]
        },
        {
          type: "home",
          enable: true,
          devices: [
            "mobile",
            "tablet"
          ],
          onlySubPages: true
        },
        {
          type: "board",
          enable: true,
          devices: [
            "mobile",
            "tablet",
            "desktop"
          ]
        }
      ]
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u5168\u5C40\u4E3B\u5F00\u5173\u3002\u4E3A false \u65F6\u96F6 DOM\u3001\u96F6 JS \u811A\u672C\u8F93\u51FA",
          label: "\u5168\u5C40\u4E3B\u5F00\u5173"
        },
        align: {
          type: "string",
          enum: [
            "end",
            "start"
          ],
          description: "\u505C\u9760\u4F4D\u7F6E\uFF08\u9ED8\u8BA4\u53F3\u4E0B\u89D2 end\uFF09",
          label: "\u505C\u9760\u4F4D\u7F6E"
        },
        offset: {
          type: "object",
          properties: {
            bottom: {
              type: "string",
              description: "",
              label: "bottom"
            },
            right: {
              type: "string",
              description: "",
              label: "right"
            }
          },
          description: "\u8DDD\u79BB\u89C6\u53E3\u8FB9\u8DDD\uFF08rem\uFF0C\u652F\u6301\u8BBE\u5907\u81EA\u9002\u5E94\uFF09",
          label: "\u8DDD\u79BB\u89C6\u53E3\u8FB9\u8DDD"
        },
        size: {
          type: "string",
          enum: [
            "regular",
            "small"
          ],
          description: "FAB \u6309\u94AE\u5C3A\u5BF8\u89C4\u683C\uFF1Asmall (40px) / regular (56px)\uFF0C\u9ED8\u8BA4 regular",
          label: "FAB \u6309\u94AE\u5C3A\u5BF8\u89C4\u683C\uFF1Asmall (40px) / regular (56px)"
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                description: "",
                label: "type"
              },
              scrollThresholdRatio: {
                type: "number",
                description: "\u6EDA\u52A8\u89E6\u53D1\u9608\u503C\uFF08\u5360\u9996\u5C4F Banner \u9AD8\u5EA6\u7684\u767E\u5206\u6BD4\uFF0C\u9ED8\u8BA4\u8DDF\u968F BANNER_HEIGHT\uFF09",
                label: "\u6EDA\u52A8\u89E6\u53D1\u9608\u503C"
              },
              enable: {
                type: "boolean",
                description: "\u662F\u5426\u542F\u7528\u8BE5 FAB \u7EC4\u4EF6",
                label: "\u662F\u5426\u542F\u7528\u8BE5 FAB \u7EC4\u4EF6"
              },
              devices: {
                type: "array",
                items: {
                  type: "string",
                  enum: [
                    "mobile",
                    "tablet",
                    "desktop"
                  ]
                },
                description: "\u5141\u8BB8\u6E32\u67D3\u5E76\u663E\u793A\u7684\u8BBE\u5907\u6E05\u5355\u3002",
                label: "\u5141\u8BB8\u6E32\u67D3\u5E76\u663E\u793A\u7684\u8BBE\u5907\u6E05\u5355"
              },
              pages: {
                type: "array",
                items: {
                  type: "string",
                  enum: [
                    "home",
                    "archive",
                    "friends",
                    "guestbook",
                    "moments",
                    "series",
                    "media",
                    "anime",
                    "compass",
                    "skills",
                    "projects",
                    "devices",
                    "timeline",
                    "albums",
                    "about",
                    "sponsor",
                    "categories",
                    "tags",
                    "rss",
                    "atom",
                    "post"
                  ]
                },
                description: "\u9650\u5B9A\u751F\u6548\u7684\u9875\u9762\u6807\u8BC6\u7B26\uFF08\u5BF9\u9F50 SidebarPage\uFF09\u3002",
                label: "\u9650\u5B9A\u751F\u6548\u7684\u9875\u9762\u6807\u8BC6\u7B26"
              }
            }
          },
          description: "\u60AC\u6D6E\u6309\u94AE\u7EC4\u5217\u8868\uFF08\u6309\u81EA\u4E0B\u800C\u4E0A\u987A\u5E8F\u5806\u53E0\uFF09",
          label: "\u60AC\u6D6E\u6309\u94AE\u7EC4\u5217\u8868"
        }
      }
    }
  },
  sidebar: {
    defaults: {
      enable: true,
      arrangement: "dual",
      side: "left",
      components: [
        {
          type: "profile",
          enable: true,
          slot: "top"
        },
        {
          type: "music",
          enable: true,
          slot: "top"
        },
        {
          type: "announcement",
          enable: true,
          slot: "top",
          pages: [
            "home"
          ]
        },
        {
          type: "categories",
          enable: true,
          slot: "sticky",
          collapseAfter: 5,
          pages: [
            "home",
            "archive",
            "friends",
            "moments",
            "anime",
            "compass",
            "skills",
            "projects",
            "devices",
            "timeline",
            "albums",
            "about",
            "post",
            "categories",
            "tags"
          ]
        },
        {
          type: "tags",
          enable: true,
          slot: "sticky",
          collapseAfter: 6,
          pages: [
            "home",
            "archive",
            "friends",
            "moments",
            "anime",
            "compass",
            "skills",
            "projects",
            "devices",
            "timeline",
            "albums",
            "about",
            "post",
            "categories",
            "tags"
          ]
        },
        {
          type: "stats",
          enable: true,
          slot: "top",
          column: "secondary",
          pages: [
            "home",
            "archive",
            "categories",
            "tags"
          ]
        },
        {
          type: "moments",
          enable: true,
          slot: "top",
          column: "secondary",
          limit: 3
        },
        {
          type: "calendar",
          enable: true,
          slot: "top",
          column: "secondary"
        },
        {
          type: "siteInfo",
          enable: true,
          slot: "top",
          column: "secondary"
        },
        {
          type: "toc",
          enable: true,
          slot: "sticky",
          column: "secondary",
          pages: [
            "post"
          ]
        },
        {
          type: "advertisement",
          enable: false,
          slot: "sticky"
        }
      ]
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "",
          label: "enable"
        },
        arrangement: {
          type: "string",
          enum: [
            "dual",
            "single"
          ],
          description: "",
          label: "arrangement"
        },
        side: {
          type: "string",
          enum: [
            "left",
            "right"
          ],
          description: "\u4E3B\u680F\u7269\u7406\u4FA7\uFF0C\u9ED8\u8BA4 left",
          label: "\u4E3B\u680F\u7269\u7406\u4FA7"
        },
        components: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                description: "",
                label: "type"
              },
              enable: {
                type: "boolean",
                description: "",
                label: "enable"
              },
              slot: {
                type: "string",
                enum: [
                  "top",
                  "sticky"
                ],
                description: "",
                label: "slot"
              },
              column: {
                type: "string",
                enum: [
                  "primary",
                  "secondary"
                ],
                description: "",
                label: "column"
              },
              pages: {
                type: "array",
                items: {
                  type: "string",
                  enum: [
                    "home",
                    "archive",
                    "friends",
                    "guestbook",
                    "moments",
                    "series",
                    "media",
                    "anime",
                    "compass",
                    "skills",
                    "projects",
                    "devices",
                    "timeline",
                    "albums",
                    "about",
                    "sponsor",
                    "categories",
                    "tags",
                    "rss",
                    "atom",
                    "post"
                  ]
                },
                description: "\u9650\u5B9A\u663E\u793A\u7684\u9875\u9762\uFF0C\u7701\u7565\u6216\u7A7A\u6570\u7EC4\u8868\u793A\u6240\u6709\u9875\u9762",
                label: "\u9650\u5B9A\u663E\u793A\u7684\u9875\u9762"
              }
            }
          },
          description: "",
          label: "components"
        }
      }
    }
  },
  footer: {
    defaults: {
      enable: true
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u662F\u5426\u542F\u7528\u81EA\u5B9A\u4E49\u9875\u811A HTML \u6CE8\u5165\u3002",
          label: "\u662F\u5426\u542F\u7528\u81EA\u5B9A\u4E49\u9875\u811A HTML \u6CE8\u5165"
        }
      }
    }
  },
  "image-bloom": {
    defaults: {
      enable: true,
      blurRadius: 20,
      opacity: 0.7,
      transitionDuration: 300
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u662F\u5426\u5F00\u542F Tonal Bloom \u5360\u4F4D\uFF08\u8BBE\u4E3A false \u65F6\u96F6\u989D\u5916 DOM\u3001\u96F6\u989D\u5916\u7F51\u7EDC\u8BF7\u6C42\uFF09",
          label: "\u662F\u5426\u5F00\u542F Tonal Bloom \u5360\u4F4D"
        },
        blurRadius: {
          type: "number",
          description: "\u8F89\u5149\u6A21\u7CCA\u534A\u5F84\uFF08\u5355\u4F4D px\uFF0C\u9ED8\u8BA4 20\uFF09",
          label: "\u8F89\u5149\u6A21\u7CCA\u534A\u5F84"
        },
        opacity: {
          type: "number",
          description: "\u8F89\u5149\u56FE\u5C42\u4E0D\u900F\u660E\u5EA6\uFF08\u9ED8\u8BA4 0.7\uFF09",
          label: "\u8F89\u5149\u56FE\u5C42\u4E0D\u900F\u660E\u5EA6"
        },
        transitionDuration: {
          type: "number",
          description: "\u56FE\u7247\u5C31\u7EEA\u540E\u7684\u6DE1\u5165\u6DE1\u51FA\u8FC7\u6E21\u65F6\u957F\uFF08\u5355\u4F4D ms\uFF0C\u9ED8\u8BA4 300\uFF09",
          label: "\u56FE\u7247\u5C31\u7EEA\u540E\u7684\u6DE1\u5165\u6DE1\u51FA\u8FC7\u6E21\u65F6\u957F"
        }
      }
    }
  },
  skills: {
    defaults: {
      enable: true,
      categories: [
        {
          key: "frontend",
          label: "Frontend",
          icon: "material-symbols:web-rounded"
        },
        {
          key: "backend",
          label: "Backend",
          icon: "material-symbols:dns-rounded"
        },
        {
          key: "tooling",
          label: "Tooling",
          icon: "material-symbols:construction-rounded"
        }
      ]
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u9875\u9762\u603B\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u9690\u85CF\u5BFC\u822A\u5165\u53E3\u5E76\u5C06 /skills/ \u91CD\u5B9A\u5411\u5230 404\u3002",
          label: "\u9875\u9762\u603B\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u9690\u85CF\u5BFC\u822A\u5165\u53E3\u5E76\u5C06 /skills/ \u91CD\u5B9A\u5411\u5230 404"
        },
        categories: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: {
                type: "string",
                description: "\u7A33\u5B9A\u6807\u8BC6\uFF0C\u4F9B\u6280\u80FD\u5F15\u7528\u4E0E\u7B5B\u9009\u3002",
                label: "\u7A33\u5B9A\u6807\u8BC6"
              },
              label: {
                type: "string",
                description: "\u7528\u6237\u53EF\u7F16\u8F91\u7684\u5206\u7C7B\u540D\u79F0\u3002",
                label: "\u7528\u6237\u53EF\u7F16\u8F91\u7684\u5206\u7C7B\u540D\u79F0"
              },
              icon: {
                type: "string",
                description: "Iconify \u56FE\u6807\u540D\u3002",
                label: "Iconify \u56FE\u6807\u540D"
              }
            }
          },
          description: "\u5206\u7C7B\u5217\u8868\uFF08\u51B3\u5B9A Chips \u663E\u793A\u987A\u5E8F\uFF09\u3002",
          label: "\u5206\u7C7B\u5217\u8868"
        },
        disabledNames: {
          type: "array",
          items: {
            type: "string"
          },
          description: "\u53EF\u9009\u88AB\u7981\u7528\u7684\u6280\u80FD\u540D\u79F0\u5217\u8868\u3002",
          label: "\u53EF\u9009\u88AB\u7981\u7528\u7684\u6280\u80FD\u540D\u79F0\u5217\u8868"
        },
        disabledKeys: {
          type: "array",
          items: {
            type: "string"
          },
          description: "\u517C\u5BB9\u901A\u7528 disabledKeys \u522B\u540D\u3002",
          label: "\u517C\u5BB9\u901A\u7528 disabledKeys \u522B\u540D"
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              enable: {
                type: "boolean",
                description: "\u53EF\u9009\u72EC\u7ACB\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u4E0D\u53C2\u4E0E\u6E32\u67D3\u4E0E\u8BA1\u6570\uFF08\u4F18\u5148\u4F7F\u7528 config.disabledNames\uFF09\u3002",
                label: "\u53EF\u9009\u72EC\u7ACB\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u4E0D\u53C2\u4E0E\u6E32\u67D3\u4E0E\u8BA1\u6570"
              },
              name: {
                type: "string",
                description: "",
                label: "name"
              },
              description: {
                type: "string",
                description: "",
                label: "description"
              },
              icon: {
                type: "string",
                description: "",
                label: "icon"
              },
              category: {
                type: "string",
                description: "",
                label: "category"
              },
              level: {
                type: "string",
                enum: [
                  "beginner",
                  "intermediate",
                  "advanced",
                  "expert"
                ],
                description: "",
                label: "level"
              }
            }
          },
          description: "\u53EF\u9009\u81EA\u5B9A\u4E49\u6570\u636E\uFF08\u5411\u540E\u517C\u5BB9\uFF1B\u9ED8\u8BA4\u8BFB\u53D6 src/data/skills.ts\uFF09\u3002",
          label: "\u53EF\u9009\u81EA\u5B9A\u4E49\u6570\u636E"
        }
      }
    }
  },
  projects: {
    defaults: {
      enable: true,
      categories: [
        {
          key: "theme",
          label: "Theme",
          icon: "material-symbols:palette-outline-rounded"
        },
        {
          key: "android",
          label: "Android",
          icon: "material-symbols:android-rounded"
        }
      ]
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u9875\u9762\u603B\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u9690\u85CF\u5BFC\u822A\u5165\u53E3\u5E76\u5C06 /projects/ \u91CD\u5B9A\u5411\u5230 404\u3002",
          label: "\u9875\u9762\u603B\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u9690\u85CF\u5BFC\u822A\u5165\u53E3\u5E76\u5C06 /projects/ \u91CD\u5B9A\u5411\u5230 404"
        },
        categories: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: {
                type: "string",
                description: "\u7A33\u5B9A\u6807\u8BC6\uFF0C\u4F9B\u9879\u76EE\u5F15\u7528\u4E0E\u7B5B\u9009\u3002",
                label: "\u7A33\u5B9A\u6807\u8BC6"
              },
              label: {
                type: "string",
                description: "\u7528\u6237\u53EF\u7F16\u8F91\u7684\u5206\u7C7B\u540D\u79F0\u3002",
                label: "\u7528\u6237\u53EF\u7F16\u8F91\u7684\u5206\u7C7B\u540D\u79F0"
              },
              icon: {
                type: "string",
                description: "Iconify \u56FE\u6807\u540D\u3002",
                label: "Iconify \u56FE\u6807\u540D"
              }
            }
          },
          description: "\u5206\u7C7B\u5217\u8868\uFF08\u51B3\u5B9A Chips \u663E\u793A\u987A\u5E8F\uFF09\u3002",
          label: "\u5206\u7C7B\u5217\u8868"
        },
        disabledKeys: {
          type: "array",
          items: {
            type: "string"
          },
          description: "\u53EF\u9009\u88AB\u7981\u7528\u7684\u9879\u76EE key \u5217\u8868\u3002",
          label: "\u53EF\u9009\u88AB\u7981\u7528\u7684\u9879\u76EE key \u5217\u8868"
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              enable: {
                type: "boolean",
                description: "\u53EF\u9009\u72EC\u7ACB\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u4E0D\u53C2\u4E0E\u6E32\u67D3\u4E0E\u8BA1\u6570\uFF08\u4F18\u5148\u4F7F\u7528 config.disabledKeys\uFF09\u3002",
                label: "\u53EF\u9009\u72EC\u7ACB\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u4E0D\u53C2\u4E0E\u6E32\u67D3\u4E0E\u8BA1\u6570"
              },
              key: {
                type: "string",
                description: "\u7A33\u5B9A\u6807\u8BC6\uFF0C\u7528\u4F5C\u5217\u8868 key \u4E0E\u6D4B\u8BD5\u9009\u62E9\u5668\u3002",
                label: "\u7A33\u5B9A\u6807\u8BC6"
              },
              title: {
                type: "string",
                description: "",
                label: "title"
              },
              summary: {
                type: "string",
                description: "",
                label: "summary"
              },
              category: {
                type: "string",
                description: "",
                label: "category"
              },
              phase: {
                type: "string",
                enum: [
                  "shipped",
                  "building",
                  "exploring"
                ],
                description: "",
                label: "phase"
              },
              technologies: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "",
                label: "technologies"
              },
              icon: {
                type: "string",
                description: "\u65E0\u5C01\u9762\u65F6\u4F7F\u7528\u7684 Iconify \u56FE\u6807\u3002",
                label: "\u65E0\u5C01\u9762\u65F6\u4F7F\u7528\u7684 Iconify \u56FE\u6807"
              },
              cover: {
                type: "string",
                description: "\u53EF\u9009\u9879\u76EE\u5C01\u9762\uFF0C\u5EFA\u8BAE\u4F7F\u7528\u672C\u5730 WebP/AVIF\u3002",
                label: "\u53EF\u9009\u9879\u76EE\u5C01\u9762"
              },
              coverAlt: {
                type: "string",
                description: "\u5C01\u9762\u627F\u8F7D\u989D\u5916\u4FE1\u606F\u65F6\u63D0\u4F9B\uFF1B\u7EAF\u88C5\u9970\u5C01\u9762\u7559\u7A7A\u3002",
                label: "\u5C01\u9762\u627F\u8F7D\u989D\u5916\u4FE1\u606F\u65F6\u63D0\u4F9B\uFF1B\u7EAF\u88C5\u9970\u5C01\u9762\u7559\u7A7A"
              },
              featured: {
                type: "boolean",
                description: "\u4EE3\u8868\u9879\u76EE\u6807\u8BB0\uFF0C\u4F9B\u9875\u9762\u505A\u91CD\u70B9\u9879\u76EE\u8BC6\u522B\u3002",
                label: "\u4EE3\u8868\u9879\u76EE\u6807\u8BB0"
              },
              website: {
                type: "string",
                description: "",
                label: "website"
              },
              repository: {
                type: "string",
                description: "",
                label: "repository"
              },
              year: {
                type: "string",
                description: "\u81EA\u7531\u683C\u5F0F\u7684\u5E74\u4EFD\u6216\u65F6\u95F4\u8303\u56F4\uFF0C\u5982 2024\u20132026\u3002",
                label: "\u81EA\u7531\u683C\u5F0F\u7684\u5E74\u4EFD\u6216\u65F6\u95F4\u8303\u56F4"
              }
            }
          },
          description: "\u53EF\u9009\u81EA\u5B9A\u4E49\u6570\u636E\uFF08\u5411\u540E\u517C\u5BB9\uFF1B\u9ED8\u8BA4\u8BFB\u53D6 src/data/projects.ts\uFF09\u3002",
          label: "\u53EF\u9009\u81EA\u5B9A\u4E49\u6570\u636E"
        }
      }
    }
  },
  timeline: {
    defaults: {
      enable: true,
      categories: [
        {
          key: "milestone",
          label: "Milestones",
          icon: "material-symbols:flag-rounded"
        },
        {
          key: "project",
          label: "Projects",
          icon: "material-symbols:code-rounded"
        },
        {
          key: "career",
          label: "Career",
          icon: "material-symbols:work-rounded"
        },
        {
          key: "education",
          label: "Education",
          icon: "material-symbols:school-rounded"
        },
        {
          key: "life",
          label: "Life",
          icon: "material-symbols:favorite-rounded"
        }
      ],
      order: "desc"
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u9875\u9762\u603B\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u9690\u85CF\u5BFC\u822A\u5165\u53E3\u5E76\u5C06 /timeline/ \u91CD\u5B9A\u5411\u5230 404\u3002",
          label: "\u9875\u9762\u603B\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u9690\u85CF\u5BFC\u822A\u5165\u53E3\u5E76\u5C06 /timeline/ \u91CD\u5B9A\u5411\u5230 404"
        },
        categories: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: {
                type: "string",
                description: "\u7A33\u5B9A\u6807\u8BC6\uFF0C\u4F9B\u65F6\u95F4\u7EBF\u6761\u76EE\u5F15\u7528\u4E0E\u7B5B\u9009\u3002",
                label: "\u7A33\u5B9A\u6807\u8BC6"
              },
              label: {
                type: "string",
                description: "\u7528\u6237\u53EF\u7F16\u8F91\u7684\u5206\u7C7B\u540D\u79F0\u3002",
                label: "\u7528\u6237\u53EF\u7F16\u8F91\u7684\u5206\u7C7B\u540D\u79F0"
              },
              icon: {
                type: "string",
                description: "Iconify \u56FE\u6807\u540D\u3002",
                label: "Iconify \u56FE\u6807\u540D"
              }
            }
          },
          description: "\u7B5B\u9009\u5206\u7C7B\u6E05\u5355\uFF08\u51B3\u5B9A Chips \u987A\u5E8F\uFF09\u3002",
          label: "\u7B5B\u9009\u5206\u7C7B\u6E05\u5355"
        },
        order: {
          type: "string",
          enum: [
            "desc",
            "asc"
          ],
          description: '\u6392\u5E8F\u65B9\u5411\uFF1A\u9ED8\u8BA4\u6309\u65F6\u95F4\u5012\u5E8F "desc"\uFF1B\u53EF\u9009 "asc"\u3002',
          label: '\u6392\u5E8F\u65B9\u5411\uFF1A\u9ED8\u8BA4\u6309\u65F6\u95F4\u5012\u5E8F "desc"\uFF1B\u53EF\u9009 "asc"'
        },
        disabledTitles: {
          type: "array",
          items: {
            type: "string"
          },
          description: "\u53EF\u9009\u88AB\u7981\u7528\u7684\u8282\u70B9\u6807\u9898\u5217\u8868\u3002",
          label: "\u53EF\u9009\u88AB\u7981\u7528\u7684\u8282\u70B9\u6807\u9898\u5217\u8868"
        },
        disabledKeys: {
          type: "array",
          items: {
            type: "string"
          },
          description: "\u517C\u5BB9\u901A\u7528 disabledKeys \u522B\u540D\u3002",
          label: "\u517C\u5BB9\u901A\u7528 disabledKeys \u522B\u540D"
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              enable: {
                type: "boolean",
                description: "\u53EF\u9009\u72EC\u7ACB\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u4E0D\u53C2\u4E0E\u6E32\u67D3\u4E0E\u8BA1\u6570\uFF08\u4F18\u5148\u4F7F\u7528 config.disabledTitles\uFF09\u3002",
                label: "\u53EF\u9009\u72EC\u7ACB\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u4E0D\u53C2\u4E0E\u6E32\u67D3\u4E0E\u8BA1\u6570"
              },
              title: {
                type: "string",
                description: "\u8282\u70B9\u6807\u9898\uFF08\u4E8B\u4EF6\u3001\u804C\u4F4D\u6216\u91CC\u7A0B\u7891\u540D\u79F0\uFF09\u3002",
                label: "\u8282\u70B9\u6807\u9898"
              },
              date: {
                type: "string",
                description: '\u65F6\u95F4\u6216\u65F6\u95F4\u8303\u56F4\uFF08\u5982 "2026.08", "2024.09 \u2013 2026.06"\uFF09\u3002',
                label: "\u65F6\u95F4\u6216\u65F6\u95F4\u8303\u56F4"
              },
              category: {
                type: "string",
                description: "\u5F52\u5C5E\u5206\u7C7B key\uFF08\u5BF9\u5E94 TimelineCategory.key\uFF09\u3002",
                label: "\u5F52\u5C5E\u5206\u7C7B key"
              },
              subtitle: {
                type: "string",
                description: "\u526F\u6807\u9898 / \u673A\u6784 / \u5B66\u6821 / \u516C\u53F8 / \u89D2\u8272\u3002",
                label: "\u526F\u6807\u9898 / \u673A\u6784 / \u5B66\u6821 / \u516C\u53F8 / \u89D2\u8272"
              },
              location: {
                type: "string",
                description: '\u5730\u70B9\u4FE1\u606F\uFF08\u5982 "Tokyo, Japan", "Hangzhou, China"\uFF09\u3002',
                label: "\u5730\u70B9\u4FE1\u606F"
              },
              description: {
                type: "string",
                description: "\u8BE6\u7EC6\u63CF\u8FF0\u6216\u80CC\u666F\u8BF4\u660E\u3002",
                label: "\u8BE6\u7EC6\u63CF\u8FF0\u6216\u80CC\u666F\u8BF4\u660E"
              },
              highlights: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "\u8981\u70B9 / \u5173\u952E\u6210\u5C31\u6E05\u5355\u3002",
                label: "\u8981\u70B9 / \u5173\u952E\u6210\u5C31\u6E05\u5355"
              },
              tags: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "\u6280\u672F\u6808 / \u5173\u8054\u6807\u7B7E\u3002",
                label: "\u6280\u672F\u6808 / \u5173\u8054\u6807\u7B7E"
              },
              links: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: {
                      type: "string",
                      description: "\u94FE\u63A5\u663E\u793A\u540D\u79F0\u3002",
                      label: "\u94FE\u63A5\u663E\u793A\u540D\u79F0"
                    },
                    url: {
                      type: "string",
                      description: "\u76EE\u6807 URL\u3002",
                      label: "\u76EE\u6807 URL"
                    },
                    icon: {
                      type: "object",
                      description: "\u53EF\u9009\u56FE\u6807\uFF08Iconify \u540D\uFF09\u3002",
                      label: "\u53EF\u9009\u56FE\u6807"
                    }
                  }
                },
                description: "\u5173\u8054\u94FE\u63A5\u5217\u8868\uFF08\u9879\u76EE\u4ED3\u5E93\u3001\u6F14\u793A\u7AD9\u3001\u8BC1\u4E66\u3001\u6587\u7AE0\u7B49\uFF09\u3002",
                label: "\u5173\u8054\u94FE\u63A5\u5217\u8868"
              },
              icon: {
                type: "string",
                description: "\u8282\u70B9\u81EA\u5B9A\u4E49\u56FE\u6807\uFF08Iconify \u540D\uFF09\uFF0C\u672A\u6307\u5B9A\u65F6\u4F7F\u7528\u5206\u7C7B\u56FE\u6807\u6216\u9ED8\u8BA4\u8282\u70B9\u56FE\u6807\u3002",
                label: "\u8282\u70B9\u81EA\u5B9A\u4E49\u56FE\u6807"
              },
              featured: {
                type: "boolean",
                description: "\u662F\u5426\u4E3A\u91CD\u70B9\u91CC\u7A0B\u7891\u8282\u70B9\uFF08\u5E26\u7A81\u51FA\u5FBD\u6807\u4E0E\u91CD\u70B9\u6E32\u67D3\uFF09\u3002",
                label: "\u662F\u5426\u4E3A\u91CD\u70B9\u91CC\u7A0B\u7891\u8282\u70B9"
              }
            }
          },
          description: "\u53EF\u9009\u81EA\u5B9A\u4E49\u6570\u636E\uFF08\u5411\u540E\u517C\u5BB9\uFF1B\u9ED8\u8BA4\u8BFB\u53D6 src/data/timeline.ts\uFF09\u3002",
          label: "\u53EF\u9009\u81EA\u5B9A\u4E49\u6570\u636E"
        }
      }
    }
  },
  devices: {
    defaults: {
      enable: true,
      categories: [
        {
          key: "desk",
          label: "Desk Setup",
          icon: "material-symbols:desktop-windows-outline-rounded",
          description: "Workstation & home office hardware"
        },
        {
          key: "mobile",
          label: "Mobile & EDC",
          icon: "material-symbols:phone-iphone",
          description: "Daily portable devices & smart gadgets"
        },
        {
          key: "audio",
          label: "Audio & Visual",
          icon: "material-symbols:headphones-rounded",
          description: "Headphones, speakers & monitoring gears"
        },
        {
          key: "peripheral",
          label: "Peripherals",
          icon: "material-symbols:keyboard-outline-rounded",
          description: "Keyboards, mice & desk accessories"
        }
      ]
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u9875\u9762\u603B\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u9690\u85CF\u5BFC\u822A\u5165\u53E3\u5E76\u5C06 /devices/ \u91CD\u5B9A\u5411\u5230 404\u3002",
          label: "\u9875\u9762\u603B\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u9690\u85CF\u5BFC\u822A\u5165\u53E3\u5E76\u5C06 /devices/ \u91CD\u5B9A\u5411\u5230 404"
        },
        categories: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: {
                type: "string",
                description: "\u7A33\u5B9A\u6807\u8BC6\uFF0C\u4F9B\u8BBE\u5907\u5F15\u7528\u4E0E\u7B5B\u9009\u3002",
                label: "\u7A33\u5B9A\u6807\u8BC6"
              },
              label: {
                type: "string",
                description: "\u7528\u6237\u53EF\u7F16\u8F91\u7684\u5206\u7C7B\u540D\u79F0\u3002",
                label: "\u7528\u6237\u53EF\u7F16\u8F91\u7684\u5206\u7C7B\u540D\u79F0"
              },
              icon: {
                type: "string",
                description: "Iconify \u56FE\u6807\u540D\uFF08\u7B5B\u9009 Chip \u524D\u7F6E\u56FE\u6807\uFF09\u3002",
                label: "Iconify \u56FE\u6807\u540D"
              },
              description: {
                type: "string",
                description: "\u53EF\u9009\u7684\u5206\u7C7B\u8BF4\u660E\u3002",
                label: "\u53EF\u9009\u7684\u5206\u7C7B\u8BF4\u660E"
              }
            }
          },
          description: "\u573A\u666F\u5206\u7C7B\u5217\u8868\uFF08\u51B3\u5B9A Chips \u6E32\u67D3\u987A\u5E8F\uFF09\u3002",
          label: "\u573A\u666F\u5206\u7C7B\u5217\u8868"
        },
        disabledIds: {
          type: "array",
          items: {
            type: "string"
          },
          description: "\u53EF\u9009\u88AB\u7981\u7528\u7684\u8BBE\u5907 ID \u5217\u8868\u3002",
          label: "\u53EF\u9009\u88AB\u7981\u7528\u7684\u8BBE\u5907 ID \u5217\u8868"
        },
        disabledKeys: {
          type: "array",
          items: {
            type: "string"
          },
          description: "\u517C\u5BB9\u901A\u7528 disabledKeys \u522B\u540D\u3002",
          label: "\u517C\u5BB9\u901A\u7528 disabledKeys \u522B\u540D"
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              enable: {
                type: "boolean",
                description: "\u53EF\u9009\u72EC\u7ACB\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u4E0D\u53C2\u4E0E\u6E32\u67D3\u4E0E\u8BA1\u6570\uFF08\u4F18\u5148\u4F7F\u7528 config.disabledIds\uFF09\u3002",
                label: "\u53EF\u9009\u72EC\u7ACB\u5F00\u5173\uFF1B\u5173\u95ED\u540E\u4E0D\u53C2\u4E0E\u6E32\u67D3\u4E0E\u8BA1\u6570"
              },
              id: {
                type: "string",
                description: "\u7A33\u5B9A\u6807\u8BC6\uFF08URL \u7247\u6BB5 / \u6D4B\u8BD5\u9009\u62E9\u5668\uFF09\u3002",
                label: "\u7A33\u5B9A\u6807\u8BC6"
              },
              name: {
                type: "string",
                description: '\u8BBE\u5907\u540D\u79F0\uFF08\u5982 MacBook Pro 16"\uFF09\u3002',
                label: "\u8BBE\u5907\u540D\u79F0"
              },
              brand: {
                type: "string",
                description: "\u54C1\u724C/\u5382\u5546\uFF08\u5982 Apple, Sony\uFF09\u3002",
                label: "\u54C1\u724C/\u5382\u5546"
              },
              category: {
                type: "string",
                description: "\u6240\u5C5E\u573A\u666F\u5206\u7C7B\uFF08\u5BF9\u5E94 DeviceCategory.key\uFF09\u3002",
                label: "\u6240\u5C5E\u573A\u666F\u5206\u7C7B"
              },
              status: {
                type: "string",
                enum: [
                  "active",
                  "backup",
                  "archived",
                  "wishlist"
                ],
                description: "\u4F7F\u7528\u72B6\u6001\u3002",
                label: "\u4F7F\u7528\u72B6\u6001"
              },
              specs: {
                type: "string",
                description: "\u6838\u5FC3\u89C4\u683C\u7B80\u8FF0\uFF08\u5361\u7247\u9192\u76EE\u4F4D\u7F6E\uFF0C\u5982 M3 Max / 64GB / 2TB\uFF09\u3002",
                label: "\u6838\u5FC3\u89C4\u683C\u7B80\u8FF0"
              },
              specDetails: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: {
                      type: "string",
                      description: "",
                      label: "key"
                    },
                    label: {
                      type: "string",
                      description: "",
                      label: "label"
                    },
                    value: {
                      type: "string",
                      description: "",
                      label: "value"
                    }
                  }
                },
                description: "\u53EF\u9009\u8BE6\u7EC6\u89C4\u683C\u5217\u8868\u3002",
                label: "\u53EF\u9009\u8BE6\u7EC6\u89C4\u683C\u5217\u8868"
              },
              description: {
                type: "string",
                description: "\u8BBE\u5907\u4F7F\u7528\u611F\u53D7/\u7B80\u8BC4\u3002",
                label: "\u8BBE\u5907\u4F7F\u7528\u611F\u53D7/\u7B80\u8BC4"
              },
              image: {
                type: "string",
                description: "\u8BBE\u5907\u5C55\u793A\u56FE\u7247\uFF08\u7AD9\u5185\u7EDD\u5BF9\u8DEF\u5F84\uFF0C\u5EFA\u8BAE\u672C\u5730 WebP/AVIF\uFF09\u3002",
                label: "\u8BBE\u5907\u5C55\u793A\u56FE\u7247"
              },
              icon: {
                type: "string",
                description: "\u65E0\u56FE\u7247\u65F6\u4F7F\u7528\u7684 Iconify \u56FE\u6807\u3002",
                label: "\u65E0\u56FE\u7247\u65F6\u4F7F\u7528\u7684 Iconify \u56FE\u6807"
              },
              link: {
                type: "string",
                description: "\u5B98\u65B9\u4E3B\u9875\u3001\u6D4B\u8BC4\u6216\u8D2D\u4E70\u94FE\u63A5\u3002",
                label: "\u5B98\u65B9\u4E3B\u9875\u3001\u6D4B\u8BC4\u6216\u8D2D\u4E70\u94FE\u63A5"
              },
              featured: {
                type: "boolean",
                description: "\u4E3B\u529B/\u7279\u522B\u63A8\u8350\u6807\u8BB0\uFF08\u6E32\u67D3 Featured \u5FBD\u7AE0\uFF09\u3002",
                label: "\u4E3B\u529B/\u7279\u522B\u63A8\u8350\u6807\u8BB0"
              },
              year: {
                type: "string",
                description: '\u8D2D\u5165\u6216\u5F00\u59CB\u4F7F\u7528\u5E74\u4EFD\uFF08\u81EA\u7531\u683C\u5F0F\uFF0C\u5982 "2024"\uFF09\u3002',
                label: "\u8D2D\u5165\u6216\u5F00\u59CB\u4F7F\u7528\u5E74\u4EFD"
              }
            }
          },
          description: "\u53EF\u9009\u81EA\u5B9A\u4E49\u6570\u636E\uFF08\u5411\u540E\u517C\u5BB9\uFF1B\u9ED8\u8BA4\u8BFB\u53D6 src/data/devices.ts\uFF09\u3002",
          label: "\u53EF\u9009\u81EA\u5B9A\u4E49\u6570\u636E"
        }
      }
    }
  },
  music: {
    defaults: {
      enable: true,
      provider: "mixed",
      meting: {
        server: "netease",
        type: "playlist",
        id: "14164869977"
      },
      defaultVolume: 0.7,
      defaultMode: "sequence",
      showLyrics: true,
      showFloatPlayer: true
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u662F\u5426\u5168\u5C40\u542F\u7528\u97F3\u4E50\u529F\u80FD",
          label: "\u662F\u5426\u5168\u5C40\u542F\u7528\u97F3\u4E50\u529F\u80FD"
        },
        provider: {
          type: "string",
          enum: [
            "local",
            "meting",
            "custom",
            "mixed"
          ],
          description: "\u97F3\u9891\u6570\u636E\u6E90\u6A21\u5F0F\uFF1Alocal\uFF08\u672C\u5730\u66F2\u76EE\uFF09 | meting\uFF08Meting \u8FDC\u7AEF\u6B4C\u5355\uFF09 | custom\uFF08\u663E\u5F0F\u4F20\u5165 tracks\uFF09 | mixed\uFF08\u672C\u5730\u4E0E\u8FDC\u7AEF\u6B4C\u5355\u5408\u5E76\uFF09",
          label: "\u97F3\u9891\u6570\u636E\u6E90\u6A21\u5F0F\uFF1Alocal"
        },
        tracks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "",
                label: "id"
              },
              title: {
                type: "string",
                description: "",
                label: "title"
              },
              artist: {
                type: "string",
                description: "",
                label: "artist"
              },
              source: {
                type: "string",
                description: "",
                label: "source"
              },
              cover: {
                type: "string",
                description: "",
                label: "cover"
              },
              coverSrcset: {
                type: "string",
                description: "\u6784\u5EFA\u671F\u751F\u6210\u7684\u5C01\u9762\u5019\u9009\uFF1B\u8FDC\u7A0B Meting \u66F2\u76EE\u4FDD\u6301\u4E3A\u7A7A\u3002",
                label: "\u6784\u5EFA\u671F\u751F\u6210\u7684\u5C01\u9762\u5019\u9009\uFF1B\u8FDC\u7A0B Meting \u66F2\u76EE\u4FDD\u6301\u4E3A\u7A7A"
              },
              coverSizes: {
                type: "string",
                description: "",
                label: "coverSizes"
              },
              coverWidth: {
                type: "number",
                description: "",
                label: "coverWidth"
              },
              coverHeight: {
                type: "number",
                description: "",
                label: "coverHeight"
              },
              duration: {
                type: "number",
                description: "",
                label: "duration"
              },
              lrc: {
                type: "string",
                description: "\u6B4C\u8BCD\uFF08LRC\uFF09\uFF1A\u8FDC\u7AEF URL\uFF08http(s):// \u6216 / \u5F00\u5934\uFF09\u6216\u5185\u5D4C LRC \u6587\u672C\u3002",
                label: "\u6B4C\u8BCD"
              }
            }
          },
          description: "\u672C\u5730\u64AD\u653E\u5217\u8868\uFF08provider \u4E3A local, custom, mixed \u65F6\u751F\u6548\uFF1B\u672A\u586B\u65F6\u9ED8\u8BA4\u8BFB\u53D6 src/data/music.ts\uFF09",
          label: "\u672C\u5730\u64AD\u653E\u5217\u8868"
        },
        meting: {
          type: "object",
          properties: {
            server: {
              type: "string",
              enum: [
                "netease",
                "tencent",
                "kugou",
                "xiami",
                "baidu"
              ],
              description: "\u97F3\u4E50\u5E73\u53F0\uFF0C\u9ED8\u8BA4 netease\uFF08\u7F51\u6613\u4E91\u97F3\u4E50\uFF09",
              label: "\u97F3\u4E50\u5E73\u53F0"
            },
            type: {
              type: "string",
              enum: [
                "playlist",
                "song",
                "album",
                "artist"
              ],
              description: "\u8D44\u6E90\u7C7B\u578B\uFF0C\u9ED8\u8BA4 playlist\uFF08\u6B4C\u5355\uFF09",
              label: "\u8D44\u6E90\u7C7B\u578B"
            },
            id: {
              type: "string",
              description: "\u6B4C\u5355 / \u5355\u66F2 / \u4E13\u8F91 ID",
              label: "\u6B4C\u5355 / \u5355\u66F2 / \u4E13\u8F91 ID"
            },
            api: {
              type: "string",
              description: "Meting API \u5730\u5740\u6A21\u677F\uFF0C\u9ED8\u8BA4\u4F7F\u7528\u516C\u5F00 API",
              label: "Meting API \u5730\u5740\u6A21\u677F"
            }
          },
          description: "Meting API \u914D\u7F6E\uFF08provider \u4E3A meting \u6216 mixed \u65F6\u751F\u6548\uFF09",
          label: "Meting API \u914D\u7F6E"
        },
        defaultVolume: {
          type: "number",
          description: "\u521D\u59CB\u97F3\u91CF\uFF0C\u8303\u56F4 0\u20131",
          label: "\u521D\u59CB\u97F3\u91CF"
        },
        defaultMode: {
          type: "string",
          enum: [
            "sequence",
            "repeat-one",
            "shuffle"
          ],
          description: "\u521D\u59CB\u64AD\u653E\u6A21\u5F0F",
          label: "\u521D\u59CB\u64AD\u653E\u6A21\u5F0F"
        },
        showLyrics: {
          type: "boolean",
          description: "\u662F\u5426\u542F\u7528\u6B4C\u8BCD\u529F\u80FD\uFF08\u6B4C\u8BCD\u9762\u677F + \u6D6E\u52A8\u6B4C\u8BCD\u6309\u94AE\uFF09\uFF0C\u9ED8\u8BA4 true\uFF1B\u5173\u95ED\u65F6\u4E24\u4E2A\u6309\u94AE\u96F6 DOM",
          label: "\u662F\u5426\u542F\u7528\u6B4C\u8BCD\u529F\u80FD"
        },
        showFloatPlayer: {
          type: "boolean",
          description: "\u662F\u5426\u542F\u7528\u60AC\u6D6E\u5531\u7247\uFF08\u5DE6\u4E0B\u89D2\u53EF\u62D6\u52A8\u5FEB\u6377\u63A7\u4EF6\uFF09\uFF0C\u9ED8\u8BA4 true\uFF1B\u5173\u95ED\u65F6\u96F6 DOM",
          label: "\u662F\u5426\u542F\u7528\u60AC\u6D6E\u5531\u7247"
        }
      }
    }
  },
  anime: {
    defaults: {
      enable: true,
      source: {
        kind: "local"
      },
      fallback: {
        kind: "local"
      },
      providers: {
        bangumi: {
          enable: false,
          userId: "",
          request: {
            pageSize: 50,
            maxItems: 300,
            minDelayMs: 200
          }
        },
        bilibili: {
          enable: false,
          vmid: "",
          sessdataEnv: "BILI_SESSDATA",
          cover: {
            mode: "local",
            useWebp: true
          },
          request: {
            pageSize: 30,
            maxItems: 300,
            minDelayMs: 300
          }
        }
      },
      snapshot: {
        directory: "src/data/anime-snapshots",
        staleAfterDays: 30,
        keepLastValid: true
      }
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u662F\u5426\u542F\u7528\u756A\u5267\u9875\u9762\u3002",
          label: "\u662F\u5426\u542F\u7528\u756A\u5267\u9875\u9762"
        },
        source: {
          type: "object",
          properties: {
            kind: {
              type: "string",
              enum: [
                "local",
                "snapshot"
              ],
              description: "\u6570\u636E\u6E90\u7C7B\u522B",
              label: "\u6570\u636E\u6E90\u7C7B\u522B"
            },
            provider: {
              type: "string",
              enum: [
                "bangumi",
                "bilibili"
              ],
              description: '\u6307\u5B9A provider\uFF08\u5F53 kind \u4E3A "snapshot" \u65F6\u5EFA\u8BAE\u6307\u5B9A\uFF09',
              label: "\u6307\u5B9A provider"
            },
            file: {
              type: "string",
              description: '\u6307\u5B9A\u5FEB\u7167\u6587\u4EF6\u540D\uFF08\u5FC5\u987B\u9650\u5B9A\u5728\u5FEB\u7167\u76EE\u5F55\u5185\uFF0C\u5982 "bangumi.json" \u6216 "bilibili.json"\uFF09',
              label: "\u6307\u5B9A\u5FEB\u7167\u6587\u4EF6\u540D"
            },
            fetchOnDev: {
              type: "boolean",
              description: "\u662F\u5426\u5728\u5F00\u53D1\u73AF\u5883 (pnpm dev) \u4E0B\u5141\u8BB8\u70ED\u91CD\u8F7D\u5E76\u8BFB\u53D6\u6700\u65B0\u5FEB\u7167\u6570\u636E\uFF08\u9ED8\u8BA4 true\uFF09",
              label: "\u662F\u5426\u5728\u5F00\u53D1\u73AF\u5883 (pnpm dev) \u4E0B\u5141\u8BB8\u70ED\u91CD\u8F7D\u5E76\u8BFB\u53D6\u6700\u65B0\u5FEB\u7167\u6570\u636E"
            }
          },
          description: "\u4E3B\u6570\u636E\u6E90\u914D\u7F6E",
          label: "\u4E3B\u6570\u636E\u6E90\u914D\u7F6E"
        },
        fallback: {
          type: "object",
          properties: {
            kind: {
              type: "string",
              enum: [
                "local",
                "empty"
              ],
              description: "\u964D\u7EA7\u7B56\u7565",
              label: "\u964D\u7EA7\u7B56\u7565"
            }
          },
          description: "\u5931\u8D25\u964D\u7EA7\u914D\u7F6E",
          label: "\u5931\u8D25\u964D\u7EA7\u914D\u7F6E"
        },
        providers: {
          type: "object",
          properties: {
            bangumi: {
              type: "object",
              properties: {
                enable: {
                  type: "boolean",
                  description: "\u662F\u5426\u542F\u7528 Bangumi \u540C\u6B65\u80FD\u529B",
                  label: "\u662F\u5426\u542F\u7528 Bangumi \u540C\u6B65\u80FD\u529B"
                },
                userId: {
                  type: "string",
                  description: "Bangumi \u7528\u6237 ID \u6216\u516C\u5F00\u4E2A\u6027\u57DF\u540D\uFF08\u5FC5\u586B\uFF0C\u672A\u586B\u65F6\u81EA\u52A8\u7981\u7528\uFF09",
                  label: "Bangumi \u7528\u6237 ID \u6216\u516C\u5F00\u4E2A\u6027\u57DF\u540D"
                },
                request: {
                  type: "object",
                  properties: {
                    pageSize: {
                      type: "number",
                      description: "\u5355\u9875\u62C9\u53D6\u5927\u5C0F\uFF08\u9ED8\u8BA4\u7531\u5404 provider \u9002\u914D\u5668\u5B89\u5168\u4E0A\u9650\u7EA6\u675F\uFF09",
                      label: "\u5355\u9875\u62C9\u53D6\u5927\u5C0F"
                    },
                    maxItems: {
                      type: "number",
                      description: "\u6700\u5927\u62C9\u53D6\u6761\u76EE\u6570\u4E0A\u9650\uFF08\u9632\u6B62\u8FC7\u5EA6\u6293\u53D6\uFF0C\u9ED8\u8BA4 300\uFF09",
                      label: "\u6700\u5927\u62C9\u53D6\u6761\u76EE\u6570\u4E0A\u9650"
                    },
                    minDelayMs: {
                      type: "number",
                      description: "\u8BF7\u6C42\u8282\u6D41\u5EF6\u8FDF\u6BEB\u79D2\u6570\uFF08\u9632\u6B62\u89E6\u53D1 API \u9650\u6D41\uFF0C\u9ED8\u8BA4 300ms\uFF09",
                      label: "\u8BF7\u6C42\u8282\u6D41\u5EF6\u8FDF\u6BEB\u79D2\u6570"
                    }
                  },
                  description: "\u53EF\u9009\u7F51\u7EDC\u8BF7\u6C42\u53C2\u6570",
                  label: "\u53EF\u9009\u7F51\u7EDC\u8BF7\u6C42\u53C2\u6570"
                }
              },
              description: "",
              label: "bangumi"
            },
            bilibili: {
              type: "object",
              properties: {
                enable: {
                  type: "boolean",
                  description: "\u662F\u5426\u542F\u7528 Bilibili \u540C\u6B65\u80FD\u529B",
                  label: "\u662F\u5426\u542F\u7528 Bilibili \u540C\u6B65\u80FD\u529B"
                },
                vmid: {
                  type: "string",
                  description: "Bilibili \u7528\u6237 UID / vmid\uFF08\u5FC5\u586B\uFF0C\u672A\u586B\u65F6\u81EA\u52A8\u7981\u7528\uFF09",
                  label: "Bilibili \u7528\u6237 UID / vmid"
                },
                sessdataEnv: {
                  type: "string",
                  description: '\u4FDD\u5B58 SESSDATA \u7684\u73AF\u5883\u53D8\u91CF\u540D\u79F0\uFF08\u9ED8\u8BA4\u4E3A "BILI_SESSDATA"\uFF09\u3002',
                  label: "\u4FDD\u5B58 SESSDATA \u7684\u73AF\u5883\u53D8\u91CF\u540D\u79F0"
                },
                cover: {
                  type: "object",
                  properties: {
                    mode: {
                      type: "string",
                      enum: [
                        "none",
                        "local",
                        "remote"
                      ],
                      description: "",
                      label: "mode"
                    },
                    mirror: {
                      type: "string",
                      description: "\u53EF\u9009\u5C01\u9762\u955C\u50CF\u524D\u7F00\uFF08\u5982\u52A0\u901F CDN \u6216\u53CD\u4EE3\u524D\u7F00\uFF09",
                      label: "\u53EF\u9009\u5C01\u9762\u955C\u50CF\u524D\u7F00"
                    },
                    useWebp: {
                      type: "boolean",
                      description: "\u662F\u5426\u4F7F\u7528 WebP \u56FE\u7247\u4F18\u5316\u53C2\u6570\uFF08\u9ED8\u8BA4 true\uFF09",
                      label: "\u662F\u5426\u4F7F\u7528 WebP \u56FE\u7247\u4F18\u5316\u53C2\u6570"
                    }
                  },
                  description: "\u5C01\u9762\u5904\u7406\u7B56\u7565",
                  label: "\u5C01\u9762\u5904\u7406\u7B56\u7565"
                },
                request: {
                  type: "object",
                  properties: {
                    pageSize: {
                      type: "number",
                      description: "\u5355\u9875\u62C9\u53D6\u5927\u5C0F\uFF08\u9ED8\u8BA4\u7531\u5404 provider \u9002\u914D\u5668\u5B89\u5168\u4E0A\u9650\u7EA6\u675F\uFF09",
                      label: "\u5355\u9875\u62C9\u53D6\u5927\u5C0F"
                    },
                    maxItems: {
                      type: "number",
                      description: "\u6700\u5927\u62C9\u53D6\u6761\u76EE\u6570\u4E0A\u9650\uFF08\u9632\u6B62\u8FC7\u5EA6\u6293\u53D6\uFF0C\u9ED8\u8BA4 300\uFF09",
                      label: "\u6700\u5927\u62C9\u53D6\u6761\u76EE\u6570\u4E0A\u9650"
                    },
                    minDelayMs: {
                      type: "number",
                      description: "\u8BF7\u6C42\u8282\u6D41\u5EF6\u8FDF\u6BEB\u79D2\u6570\uFF08\u9632\u6B62\u89E6\u53D1 API \u9650\u6D41\uFF0C\u9ED8\u8BA4 300ms\uFF09",
                      label: "\u8BF7\u6C42\u8282\u6D41\u5EF6\u8FDF\u6BEB\u79D2\u6570"
                    }
                  },
                  description: "\u53EF\u9009\u7F51\u7EDC\u8BF7\u6C42\u53C2\u6570",
                  label: "\u53EF\u9009\u7F51\u7EDC\u8BF7\u6C42\u53C2\u6570"
                }
              },
              description: "",
              label: "bilibili"
            }
          },
          description: "\u5404\u6570\u636E\u6E90\u63D0\u4F9B\u65B9\u8BBE\u7F6E",
          label: "\u5404\u6570\u636E\u6E90\u63D0\u4F9B\u65B9\u8BBE\u7F6E"
        },
        snapshot: {
          type: "object",
          properties: {
            directory: {
              type: "string",
              description: '\u5FEB\u7167\u4FDD\u5B58\u76EE\u5F55\uFF08\u76F8\u5BF9\u4E8E\u9879\u76EE\u6839\u76EE\u5F55\uFF0C\u9ED8\u8BA4 "src/data/anime-snapshots"\uFF09',
              label: "\u5FEB\u7167\u4FDD\u5B58\u76EE\u5F55"
            },
            staleAfterDays: {
              type: "number",
              description: "\u5FEB\u7167\u8FC7\u671F\u544A\u8B66\u5929\u6570\uFF08\u4EC5\u6784\u5EFA\u65E5\u5FD7\u63D0\u793A\uFF0C\u4E0D\u89E6\u53D1\u8FD0\u884C\u671F\u81EA\u52A8\u8BF7\u6C42\uFF0C\u9ED8\u8BA4 30 \u5929\uFF09",
              label: "\u5FEB\u7167\u8FC7\u671F\u544A\u8B66\u5929\u6570"
            },
            keepLastValid: {
              type: "boolean",
              description: "\u5F53\u5916\u90E8\u540C\u6B65\u5931\u8D25\u65F6\uFF0C\u662F\u5426\u4FDD\u7559\u4E0A\u4E00\u6B21\u6210\u529F\u7684\u6709\u6548\u5FEB\u7167\uFF08\u9ED8\u8BA4 true\uFF09",
              label: "\u5F53\u5916\u90E8\u540C\u6B65\u5931\u8D25\u65F6"
            }
          },
          description: "\u5FEB\u7167\u7B56\u7565",
          label: "\u5FEB\u7167\u7B56\u7565"
        }
      }
    }
  },
  sponsor: {
    defaults: {
      enable: false,
      methods: [],
      sponsors: []
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u9875\u9762\u884C\u4E3A\u5F00\u5173\uFF1Afalse \u65F6\u9875\u9762\u8DF3\u8F6C /404/ \u4E14\u5BFC\u822A\u5165\u53E3\u9690\u85CF\uFF08\u4E0E pages.sponsor \u53D6 AND\uFF09",
          label: "\u9875\u9762\u884C\u4E3A\u5F00\u5173\uFF1Afalse \u65F6\u9875\u9762\u8DF3\u8F6C /404/ \u4E14\u5BFC\u822A\u5165\u53E3\u9690\u85CF"
        },
        description: {
          type: "string",
          description: "\u9875\u9762\u526F\u6807\u9898\uFF08PageHeader \u4E0B\u65B9\u63CF\u8FF0\uFF09\uFF0C\u7701\u7565\u65F6\u4F7F\u7528 i18n \u9ED8\u8BA4\u6587\u6848",
          label: "\u9875\u9762\u526F\u6807\u9898"
        },
        usage: {
          type: "string",
          description: "\u9876\u90E8\u63D0\u793A\u6761\u6587\u6848\uFF08\u6253\u8D4F\u7528\u9014\u8BF4\u660E\uFF09\uFF0C\u7701\u7565\u65F6\u4F7F\u7528 i18n \u9ED8\u8BA4\u6587\u6848\uFF1B\u7A7A\u5B57\u7B26\u4E32\u9690\u85CF\u63D0\u793A\u6761",
          label: "\u9876\u90E8\u63D0\u793A\u6761\u6587\u6848"
        },
        methods: {
          type: "array",
          items: {
            type: "object",
            properties: {
              enable: {
                type: "boolean",
                description: "\u662F\u5426\u542F\u7528\u8BE5\u6253\u8D4F\u65B9\u5F0F",
                label: "\u662F\u5426\u542F\u7528\u8BE5\u6253\u8D4F\u65B9\u5F0F"
              },
              name: {
                type: "string",
                description: '\u65B9\u5F0F\u540D\u79F0\uFF08\u5982 "\u5FAE\u4FE1" / "\u652F\u4ED8\u5B9D" / "\u7231\u53D1\u7535" / "ko-fi"\uFF09\uFF0C\u76F4\u63A5\u5C55\u793A',
                label: "\u65B9\u5F0F\u540D\u79F0"
              },
              icon: {
                type: "string",
                description: 'astro-icon \u56FE\u6807\u540D\uFF08\u5982 "material-symbols:qr-code-2-rounded"\uFF09',
                label: "astro-icon \u56FE\u6807\u540D"
              },
              description: {
                type: "string",
                description: '\u5361\u7247\u63CF\u8FF0\uFF08\u5982 "\u4F7F\u7528 \u5FAE\u4FE1 \u626B\u7801\u6253\u8D4F"\uFF09\uFF0C\u7701\u7565\u65F6\u6309\u5361\u7247\u7C7B\u578B\u751F\u6210\u9ED8\u8BA4\u6587\u6848',
                label: "\u5361\u7247\u63CF\u8FF0"
              },
              qrcode: {
                type: "string",
                description: "\u6536\u6B3E\u7801\u56FE\u7247\u5730\u5740\uFF08public \u8DEF\u5F84\u6216\u8FDC\u7A0B URL\uFF09\uFF1B\u63D0\u4F9B\u65F6\u6E32\u67D3\u4E3A\u626B\u7801\u5361\u7247",
                label: "\u6536\u6B3E\u7801\u56FE\u7247\u5730\u5740"
              },
              qrcodeAlt: {
                type: "string",
                description: "\u6536\u6B3E\u7801\u56FE\u7247\u66FF\u4EE3\u6587\u672C\uFF0C\u7701\u7565\u65F6\u56DE\u9000 sponsorScan \u6587\u6848\uFF08\u201C\u4F7F\u7528 {name} \u626B\u7801\u6253\u8D4F\u201D\uFF09",
                label: "\u6536\u6B3E\u7801\u56FE\u7247\u66FF\u4EE3\u6587\u672C"
              },
              url: {
                type: "string",
                description: '\u8DF3\u8F6C\u94FE\u63A5\uFF08\u5982\u7231\u53D1\u7535 / ko-fi \u4E3B\u9875\uFF09\uFF1B\u63D0\u4F9B\u65F6\u6E32\u67D3\u4E3A"\u524D\u5F80\u6253\u8D4F"\u5916\u94FE\u5361\u7247',
                label: "\u8DF3\u8F6C\u94FE\u63A5"
              },
              external: {
                type: "boolean",
                description: "\u94FE\u63A5\u662F\u5426\u5728\u65B0\u6807\u7B7E\u9875\u6253\u5F00\uFF08\u9ED8\u8BA4\u6309 url \u662F\u5426\u4E3A http(s) \u5224\u65AD\uFF09",
                label: "\u94FE\u63A5\u662F\u5426\u5728\u65B0\u6807\u7B7E\u9875\u6253\u5F00"
              }
            }
          },
          description: "\u6253\u8D4F\u65B9\u5F0F\u6E05\u5355\uFF0C\u6309\u6570\u7EC4\u987A\u5E8F\u6E32\u67D3\u5361\u7247",
          label: "\u6253\u8D4F\u65B9\u5F0F\u6E05\u5355"
        },
        showSponsorsList: {
          type: "boolean",
          description: "\u662F\u5426\u5C55\u793A\u6253\u8D4F\u8005\u540D\u5355\u5361\u7247\u533A\uFF08\u9ED8\u8BA4 true\uFF1Bsponsors \u4E3A\u7A7A\u65F6\u663E\u793A\u7A7A\u6001\u6587\u6848\uFF09",
          label: "\u662F\u5426\u5C55\u793A\u6253\u8D4F\u8005\u540D\u5355\u5361\u7247\u533A"
        },
        sponsors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "\u540D\u79F0\uFF08\u76F4\u63A5\u5C55\u793A\uFF1B\u65E0\u5934\u50CF\u65F6\u53D6\u9996\u5B57\u7B26\u4F5C\u5360\u4F4D\u5934\u50CF\uFF09",
                label: "\u540D\u79F0"
              },
              amount: {
                type: "string",
                description: '\u91D1\u989D\u6587\u6848\uFF08\u5982 "\xA550"\uFF09\uFF0C\u7701\u7565\u65F6\u4E0D\u663E\u793A',
                label: "\u91D1\u989D\u6587\u6848"
              },
              date: {
                type: "string",
                description: "\u6253\u8D4F\u65E5\u671F\uFF08YYYY-MM-DD \u7B49 Date \u53EF\u89E3\u6790\u503C\uFF09\uFF0C\u7701\u7565\u65F6\u4E0D\u663E\u793A",
                label: "\u6253\u8D4F\u65E5\u671F"
              },
              avatar: {
                type: "string",
                description: "\u5934\u50CF\u5730\u5740\uFF08public \u8DEF\u5F84\u6216\u8FDC\u7A0B URL\uFF09\uFF0C\u7701\u7565\u65F6\u7528\u9996\u5B57\u7B26\u5360\u4F4D",
                label: "\u5934\u50CF\u5730\u5740"
              }
            }
          },
          description: "\u6253\u8D4F\u8005\u6E05\u5355\uFF0C\u6309\u6570\u7EC4\u987A\u5E8F\u6E32\u67D3",
          label: "\u6253\u8D4F\u8005\u6E05\u5355"
        },
        showComment: {
          type: "boolean",
          description: "\u662F\u5426\u5728\u6253\u8D4F\u9875\u5C55\u793A\u8BC4\u8BBA\u533A\uFF08\u9ED8\u8BA4 true\uFF1B\u4ECD\u9700\u8BC4\u8BBA\u7CFB\u7EDF\u5168\u5C40\u542F\u7528\u624D\u6E32\u67D3\uFF09",
          label: "\u662F\u5426\u5728\u6253\u8D4F\u9875\u5C55\u793A\u8BC4\u8BBA\u533A"
        }
      }
    }
  },
  font: {
    defaults: {
      mode: "custom",
      fontFamilies: [
        {
          id: "outfit-body",
          family: "Outfit",
          role: "body",
          source: "fontsource",
          variants: [
            {
              file: "@fontsource/outfit/400.css",
              weight: 400,
              style: "normal"
            },
            {
              file: "@fontsource/outfit/500.css",
              weight: 500,
              style: "normal"
            },
            {
              file: "@fontsource/outfit/700.css",
              weight: 700,
              style: "normal"
            }
          ],
          fallback: [
            "ui-sans-serif",
            "system-ui",
            "sans-serif"
          ],
          display: "swap",
          preload: false
        },
        {
          id: "yozai-cjk",
          family: "Yozai Medium",
          role: "cjk",
          source: "local",
          variants: [
            {
              file: "src/assets/fonts/Yozai-Medium.ttf",
              weight: 500,
              style: "normal"
            }
          ],
          fallback: [
            "system-ui",
            "sans-serif"
          ],
          display: "swap",
          preload: false
        },
        {
          id: "jetbrains-mono",
          family: "JetBrains Mono",
          role: "mono",
          source: "fontsource",
          variants: [
            {
              file: "@fontsource-variable/jetbrains-mono/index.css",
              weight: "100 800",
              style: "normal"
            },
            {
              file: "@fontsource-variable/jetbrains-mono/wght-italic.css",
              weight: "100 800",
              style: "italic"
            }
          ],
          fallback: [
            "ui-monospace",
            "SFMono-Regular",
            "Menlo",
            "Monaco",
            "Consolas",
            "monospace"
          ],
          display: "swap",
          preload: false
        }
      ],
      subsetting: {
        enable: true,
        includeContent: true,
        includeI18n: true,
        includeConfig: true,
        includeCommon: true,
        allowRemoteText: true
      },
      budget: {
        maxTotalBytes: 6291456,
        maxFamilyBytes: 4194304
      }
    },
    schema: {
      type: "object",
      properties: {
        mode: {
          type: "string",
          enum: [
            "custom",
            "system"
          ],
          description: '\u6784\u5EFA\u6A21\u5F0F\uFF1A"system"\uFF08\u7EAF\u7CFB\u7EDF\u5B57\u4F53\uFF09\u6216 "custom"\uFF08\u81EA\u5B9A\u4E49\u5B57\u4F53\uFF09',
          label: '\u6784\u5EFA\u6A21\u5F0F\uFF1A"system"'
        },
        fontFamilies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: '\u914D\u7F6E\u552F\u4E00\u6807\u8BC6\u7B26\uFF08\u4F7F\u7528\u5C0F\u5199\u5B57\u6BCD\u4E0E\u8FDE\u5B57\u7B26\uFF0C\u5982 "roboto-body"\u3001"zen-maru-cjk"\uFF09\uFF0C\u975E CSS family \u540D\u79F0\u3002',
                label: "\u914D\u7F6E\u552F\u4E00\u6807\u8BC6\u7B26"
              },
              family: {
                type: "string",
                description: '\u771F\u5B9E\u7684 CSS `font-family` \u540D\u79F0\uFF08\u5982 "Roboto"\u3001"Zen Maru Gothic"\u3001"JetBrains Mono Variable"\uFF09\u3002',
                label: "\u771F\u5B9E\u7684 CSS `font-family` \u540D\u79F0"
              },
              role: {
                type: "string",
                enum: [
                  "body",
                  "cjk",
                  "mono"
                ],
                description: '\u7ED1\u5B9A\u7684\u89D2\u8272\uFF1A"body" | "cjk" | "mono"\uFF0C\u6BCF\u4E2A\u89D2\u8272\u6700\u591A\u5B9A\u4E49\u4E00\u4E2A\u5B57\u4F53\u65CF',
                label: '\u7ED1\u5B9A\u7684\u89D2\u8272\uFF1A"body" | "cjk" | "mono"'
              },
              source: {
                type: "string",
                enum: [
                  "local",
                  "fontsource"
                ],
                description: '\u5B57\u4F53\u6765\u6E90\uFF1A"local"\uFF08\u672C\u5730 .woff2\uFF09\u6216 "fontsource"\uFF08npm \u5305\uFF09',
                label: '\u5B57\u4F53\u6765\u6E90\uFF1A"local"'
              },
              variants: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    file: {
                      type: "string",
                      description: "\u5B57\u4F53\u6587\u4EF6\u8DEF\u5F84\u6216\u5BFC\u5165\u6807\u8BC6\uFF1A",
                      label: "\u5B57\u4F53\u6587\u4EF6\u8DEF\u5F84\u6216\u5BFC\u5165\u6807\u8BC6\uFF1A"
                    },
                    weight: {
                      type: "number",
                      description: "\u5B57\u4F53\u5B57\u91CD\uFF08\u6570\u5B57\u6216\u53EF\u53D8\u5B57\u4F53\u533A\u95F4\uFF09",
                      label: "\u5B57\u4F53\u5B57\u91CD"
                    },
                    style: {
                      type: "string",
                      enum: [
                        "normal",
                        "italic"
                      ],
                      description: "\u5B57\u4F53\u5B57\u5F62\u98CE\u683C",
                      label: "\u5B57\u4F53\u5B57\u5F62\u98CE\u683C"
                    },
                    subset: {
                      type: "string",
                      description: '\u7A33\u5B9A\u5B50\u96C6\u540D\u79F0\uFF08\u5982 "latin", "chinese-simplified" \u7B49\uFF0C\u4F9B\u6784\u5EFA\u4E0E\u6E05\u5355\u68C0\u67E5\u4F7F\u7528\uFF0C\u53EF\u9009\uFF09',
                      label: "\u7A33\u5B9A\u5B50\u96C6\u540D\u79F0"
                    },
                    unicodeRange: {
                      type: "string",
                      description: '\u660E\u786E\u7684 Unicode \u5B57\u7B26\u8303\u56F4\uFF08\u5982 "U+0000-00FF, U+0131"\uFF0C\u53EF\u9009\uFF09',
                      label: "\u660E\u786E\u7684 Unicode \u5B57\u7B26\u8303\u56F4"
                    }
                  }
                },
                description: "\u5305\u542B\u7684\u5B57\u4F53\u53D8\u4F53\u5217\u8868\uFF08\u81F3\u5C11\u63D0\u4F9B\u4E00\u4E2A\u53D8\u4F53\uFF09",
                label: "\u5305\u542B\u7684\u5B57\u4F53\u53D8\u4F53\u5217\u8868"
              },
              fallback: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "\u56DE\u9000\u5B57\u4F53\u5217\u8868\uFF08\u5FC5\u987B\u4EE5\u901A\u7528\u7CFB\u7EDF\u5B57\u4F53\u7ED3\u5C3E\uFF09\uFF0C\u4F8B\u5982\uFF1A",
                label: "\u56DE\u9000\u5B57\u4F53\u5217\u8868"
              },
              display: {
                type: "string",
                enum: [
                  "swap",
                  "optional",
                  "block"
                ],
                description: '\u5B57\u4F53\u52A0\u8F7D display \u7B56\u7565\uFF0C\u9ED8\u8BA4\u63A8\u8350 "swap"',
                label: "\u5B57\u4F53\u52A0\u8F7D display \u7B56\u7565"
              },
              preload: {
                type: "boolean",
                description: '\u662F\u5426\u5728 HTML `<head>` \u4E2D\u751F\u6210 `<link rel="preload">` \u8FDB\u884C\u5173\u952E\u8D44\u6E90\u9884\u52A0\u8F7D',
                label: '\u662F\u5426\u5728 HTML `<head>` \u4E2D\u751F\u6210 `<link rel="preload">` \u8FDB\u884C\u5173\u952E\u8D44\u6E90\u9884\u52A0\u8F7D'
              },
              licenseFile: {
                type: "string",
                description: '\u672C\u5730\u81EA\u6258\u7BA1\u5B57\u4F53\u7684\u5F00\u6E90\u8BB8\u53EF\u8BC1\u8BF4\u660E\u6587\u4EF6\u8DEF\u5F84\uFF08\u53EF\u9009\uFF0C\u63A8\u8350\u968F\u5B57\u4F53\u4E00\u540C\u5B58\u653E\uFF0C\u5982 "src/assets/fonts/LICENSE.txt"\uFF09',
                label: "\u672C\u5730\u81EA\u6258\u7BA1\u5B57\u4F53\u7684\u5F00\u6E90\u8BB8\u53EF\u8BC1\u8BF4\u660E\u6587\u4EF6\u8DEF\u5F84"
              }
            }
          },
          description: "\u5B57\u4F53\u65CF\u6E05\u5355\u5217\u8868",
          label: "\u5B57\u4F53\u65CF\u6E05\u5355\u5217\u8868"
        },
        subsetting: {
          type: "object",
          properties: {
            enable: {
              type: "boolean",
              description: "\u662F\u5426\u5F00\u542F\u6784\u5EFA\u671F\u5B57\u7B26\u5B50\u96C6\u88C1\u526A",
              label: "\u662F\u5426\u5F00\u542F\u6784\u5EFA\u671F\u5B57\u7B26\u5B50\u96C6\u88C1\u526A"
            },
            includeContent: {
              type: "boolean",
              description: "\u662F\u5426\u626B\u63CF\u6587\u7AE0 Markdown/MDX \u5185\u5BB9\u4EE5\u63D0\u53D6\u5B57\u5F62",
              label: "\u662F\u5426\u626B\u63CF\u6587\u7AE0 Markdown/MDX \u5185\u5BB9\u4EE5\u63D0\u53D6\u5B57\u5F62"
            },
            includeI18n: {
              type: "boolean",
              description: "\u662F\u5426\u5305\u542B i18n \u8BED\u8A00\u8BCD\u5178\u5B57\u7B26",
              label: "\u662F\u5426\u5305\u542B i18n \u8BED\u8A00\u8BCD\u5178\u5B57\u7B26"
            },
            includeConfig: {
              type: "boolean",
              description: "\u662F\u5426\u5305\u542B\u7AD9\u70B9\u914D\u7F6E\u6587\u5B57\u5B57\u7B26",
              label: "\u662F\u5426\u5305\u542B\u7AD9\u70B9\u914D\u7F6E\u6587\u5B57\u5B57\u7B26"
            },
            includeCommon: {
              type: "boolean",
              description: "\u662F\u5426\u5305\u542B\u901A\u7528\u6807\u70B9\u4E0E\u57FA\u7840\u5B57\u7B26",
              label: "\u662F\u5426\u5305\u542B\u901A\u7528\u6807\u70B9\u4E0E\u57FA\u7840\u5B57\u7B26"
            },
            allowRemoteText: {
              type: "boolean",
              description: "\u662F\u5426\u5141\u8BB8\u62C9\u53D6\u8FDC\u7AEF\u6587\u672C\u8FDB\u884C\u5206\u6790\u3002",
              label: "\u662F\u5426\u5141\u8BB8\u62C9\u53D6\u8FDC\u7AEF\u6587\u672C\u8FDB\u884C\u5206\u6790"
            }
          },
          description: "\u5B57\u4F53\u5B50\u96C6\u5316\u914D\u7F6E",
          label: "\u5B57\u4F53\u5B50\u96C6\u5316\u914D\u7F6E"
        },
        budget: {
          type: "object",
          properties: {
            maxTotalBytes: {
              type: "number",
              description: "\u5168\u7AD9\u5B57\u4F53\u4EA7\u7269\u603B\u5927\u5C0F\u4E0A\u9650\uFF08\u5355\u4F4D\uFF1A\u5B57\u8282\uFF0C\u9ED8\u8BA4 4MB = 4 * 1024 * 1024\uFF09",
              label: "\u5168\u7AD9\u5B57\u4F53\u4EA7\u7269\u603B\u5927\u5C0F\u4E0A\u9650"
            },
            maxFamilyBytes: {
              type: "number",
              description: "\u5355\u4E2A\u5B57\u4F53\u65CF\u4EA7\u7269\u5927\u5C0F\u4E0A\u9650\uFF08\u5355\u4F4D\uFF1A\u5B57\u8282\uFF0C\u9ED8\u8BA4 2MB = 2 * 1024 * 1024\uFF09",
              label: "\u5355\u4E2A\u5B57\u4F53\u65CF\u4EA7\u7269\u5927\u5C0F\u4E0A\u9650"
            }
          },
          description: "\u5B57\u4F53\u4F53\u79EF\u9884\u7B97\u9650\u5236",
          label: "\u5B57\u4F53\u4F53\u79EF\u9884\u7B97\u9650\u5236"
        }
      }
    }
  },
  "friend-page": {
    defaults: {
      enable: true,
      site: {},
      template: "\u7AD9\u70B9\u540D\u79F0\uFF1A\u60A8\u7684\u7AD9\u70B9\u540D\u79F0\n\u7AD9\u70B9\u63CF\u8FF0\uFF1A\u60A8\u7684\u7AD9\u70B9\u63CF\u8FF0\n\u7AD9\u70B9\u94FE\u63A5\uFF1A\u60A8\u7684\u7AD9\u70B9\u94FE\u63A5\n\u5934\u50CF\u94FE\u63A5\uFF1A\u60A8\u7684\u7AD9\u70B9\u5934\u50CF",
      contacts: [],
      notes: [
        {
          title: "\u4E92\u6362\u539F\u5219",
          content: "\u8BF7\u5148\u5C06\u672C\u7AD9\u6DFB\u52A0\u5230\u60A8\u7684\u53CB\u94FE\u9875\u9762\uFF0C\u786E\u8BA4\u540E\u4F1A\u6DFB\u52A0\u60A8\u7684\u53CB\u94FE"
        },
        {
          title: "\u94FE\u63A5\u7EF4\u62A4",
          content: "\u53CB\u94FE\u7F51\u7AD9\u957F\u671F\u65E0\u6CD5\u8BBF\u95EE\u6216\u5185\u5BB9\u8FDD\u89C4\uFF0C\u5C06\u4F1A\u88AB\u79FB\u9664"
        },
        {
          title: "\u5185\u5BB9\u8981\u6C42",
          content: "\u5185\u5BB9\u79EF\u6781\u5411\u4E0A\uFF0C\u4E0D\u542B\u6709\u4EFB\u4F55\u8FDD\u6CD5\u8FDD\u89C4\u5185\u5BB9"
        },
        {
          title: "\u7AD9\u70B9\u8981\u6C42",
          content: "\u652F\u6301 HTTPS\uFF0C\u4EE5\u539F\u521B\u5185\u5BB9\u4E3A\u4E3B\uFF0C\u80FD\u591F\u6B63\u5E38\u8BBF\u95EE\u4E14\u6709\u6301\u7EED\u66F4\u65B0"
        }
      ],
      check: {
        enable: true,
        resultUrl: "https://check.fqzlr.com/result.json",
        cacheTtlMinutes: 30,
        pendingZone: [
          1,
          6
        ],
        graveyardZone: [
          7,
          9999
        ]
      }
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u662F\u5426\u542F\u7528\u53CB\u94FE\u9875\u4FE1\u606F\u6A21\u5757\uFF08\u5173\u95ED\u65F6\u53CB\u94FE\u5217\u8868\u672C\u8EAB\u4E0D\u53D7\u5F71\u54CD\uFF09",
          label: "\u662F\u5426\u542F\u7528\u53CB\u94FE\u9875\u4FE1\u606F\u6A21\u5757"
        },
        site: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "\u7AD9\u70B9\u540D\u79F0\uFF0C\u7F3A\u7701\u56DE\u9000 profileConfig.name",
              label: "\u7AD9\u70B9\u540D\u79F0"
            },
            desc: {
              type: "string",
              description: "\u7AD9\u70B9\u63CF\u8FF0\uFF0C\u7F3A\u7701\u56DE\u9000 profileConfig.bio",
              label: "\u7AD9\u70B9\u63CF\u8FF0"
            },
            url: {
              type: "string",
              description: "\u7AD9\u70B9\u94FE\u63A5\uFF0C\u7F3A\u7701\u56DE\u9000 siteConfig.site",
              label: "\u7AD9\u70B9\u94FE\u63A5"
            },
            avatar: {
              type: "string",
              description: "\u7AD9\u70B9\u5934\u50CF\uFF08\u76F8\u5BF9 /src\u3001/public \u6216\u8FDC\u7A0B URL\uFF09\uFF0C\u7F3A\u7701\u56DE\u9000 profileConfig.avatar",
              label: "\u7AD9\u70B9\u5934\u50CF"
            },
            email: {
              type: "string",
              description: "\u8054\u7CFB\u90AE\u7BB1\uFF08\u5C55\u793A\u5728\u7533\u8BF7\u6B65\u9AA4\u4E2D\uFF09\uFF0C\u7559\u7A7A\u5219\u4E0D\u5C55\u793A",
              label: "\u8054\u7CFB\u90AE\u7BB1"
            }
          },
          description: "\u672C\u7AD9\u4FE1\u606F\uFF08\u7533\u8BF7\u53CB\u94FE\u65F6\u4F9B\u5BF9\u65B9\u590D\u5236\u7684\u5B57\u6BB5\uFF09\uFF0C\u7F3A\u7701\u9879\u81EA\u52A8\u56DE\u9000\u7AD9\u70B9/profile \u914D\u7F6E",
          label: "\u672C\u7AD9\u4FE1\u606F"
        },
        template: {
          type: "string",
          description: "\u7533\u8BF7\u53CB\u94FE\u6A21\u677F\uFF08\u591A\u884C\u7EAF\u6587\u672C\uFF0C\u7B2C 2 \u6B65\u4EE3\u7801\u5757\u5C55\u793A\u5E76\u63D0\u4F9B\u4E00\u952E\u590D\u5236\uFF09",
          label: "\u7533\u8BF7\u53CB\u94FE\u6A21\u677F"
        },
        contacts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              label: {
                type: "string",
                description: "\u6E20\u9053\u540D\uFF0C\u5982\u300C\u90AE\u7BB1 / B\u7AD9 / QQ\u7FA4 / GitHub\u300D",
                label: "\u6E20\u9053\u540D"
              },
              value: {
                type: "string",
                description: "\u8054\u7CFB\u6807\u8BC6\uFF08\u90AE\u7BB1\u5730\u5740 / \u8D26\u53F7\u540D\uFF09\uFF0C\u63D0\u4F9B\u4E00\u952E\u590D\u5236",
                label: "\u8054\u7CFB\u6807\u8BC6"
              },
              icon: {
                type: "string",
                description: "\u53EF\u9009 Iconify \u56FE\u6807\u540D",
                label: "\u53EF\u9009 Iconify \u56FE\u6807\u540D"
              },
              link: {
                type: "string",
                description: "\u53EF\u9009\u8DF3\u8F6C\u94FE\u63A5\uFF08\u5982 B \u7AD9\u4E3B\u9875 / QQ \u7FA4\u52A0\u7FA4\u94FE / GitHub \u4E3B\u9875\uFF09",
                label: "\u53EF\u9009\u8DF3\u8F6C\u94FE\u63A5"
              }
            }
          },
          description: "\u7533\u8BF7\u53CB\u94FE\u8054\u7CFB\u65B9\u5F0F\uFF08\u7B2C 2 \u6B65\u8054\u7CFB\u65B9\u5F0F\u533A\u5C55\u793A\uFF1B\u7559\u7A7A\u6570\u7EC4\u5219\u4E0D\u6E32\u67D3\u8BE5\u533A\uFF09",
          label: "\u7533\u8BF7\u53CB\u94FE\u8054\u7CFB\u65B9\u5F0F"
        },
        notes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "\u6CE8\u610F\u4E8B\u9879\u5C0F\u6807\u9898\uFF0C\u5982\u300C\u4E92\u6362\u539F\u5219\u300D",
                label: "\u6CE8\u610F\u4E8B\u9879\u5C0F\u6807\u9898"
              },
              content: {
                type: "string",
                description: "\u6CE8\u610F\u4E8B\u9879\u8BF4\u660E\u6587\u5B57",
                label: "\u6CE8\u610F\u4E8B\u9879\u8BF4\u660E\u6587\u5B57"
              }
            }
          },
          description: "\u6CE8\u610F\u4E8B\u9879\u5217\u8868",
          label: "\u6CE8\u610F\u4E8B\u9879\u5217\u8868"
        },
        check: {
          type: "object",
          properties: {
            enable: {
              type: "boolean",
              description: "\u662F\u5426\u542F\u7528\u53CB\u94FE\u53EF\u8FBE\u6027\u68C0\u6D4B\uFF08\u9ED8\u8BA4 false\uFF0C\u96F6\u989D\u5916\u8D1F\u62C5\uFF09",
              label: "\u662F\u5426\u542F\u7528\u53CB\u94FE\u53EF\u8FBE\u6027\u68C0\u6D4B"
            },
            resultUrl: {
              type: "string",
              description: "check-flink \u90E8\u7F72\u4EA7\u7269\u7684 result.json \u5730\u5740\uFF08\u5982 https://check.example.com/result.json\uFF09\u3002",
              label: "check-flink \u90E8\u7F72\u4EA7\u7269\u7684 result.json \u5730\u5740"
            },
            cacheTtlMinutes: {
              type: "number",
              description: "result.json \u5BA2\u6237\u7AEF\u7F13\u5B58\u6709\u6548\u671F\uFF08\u5206\u949F\uFF09\uFF0C\u9ED8\u8BA4 30",
              label: "result.json \u5BA2\u6237\u7AEF\u7F13\u5B58\u6709\u6548\u671F"
            },
            pendingZone: {
              type: "array",
              items: {
                type: "number"
              },
              description: "\u8FDE\u7EED\u68C0\u6D4B\u5931\u8D25\u6B21\u6570\u843D\u5165\u300C\u53CB\u94FE\u6682\u5B58\u533A\u300D\u7684\u95ED\u533A\u95F4\uFF0C\u9ED8\u8BA4 [1, 6]",
              label: "\u8FDE\u7EED\u68C0\u6D4B\u5931\u8D25\u6B21\u6570\u843D\u5165\u300C\u53CB\u94FE\u6682\u5B58\u533A\u300D\u7684\u95ED\u533A\u95F4"
            },
            graveyardZone: {
              type: "array",
              items: {
                type: "number"
              },
              description: "\u8FDE\u7EED\u68C0\u6D4B\u5931\u8D25\u6B21\u6570\u843D\u5165\u300C\u53CB\u94FE\u5893\u7891\u300D\u7684\u95ED\u533A\u95F4\uFF0C\u9ED8\u8BA4 [7, 9999]",
              label: "\u8FDE\u7EED\u68C0\u6D4B\u5931\u8D25\u6B21\u6570\u843D\u5165\u300C\u53CB\u94FE\u5893\u7891\u300D\u7684\u95ED\u533A\u95F4"
            }
          },
          description: "\u53CB\u94FE\u53EF\u8FBE\u6027\u68C0\u6D4B\uFF08check-flink\uFF09\uFF0C\u9ED8\u8BA4\u5173\u95ED\uFF1B\u5173\u95ED\u65F6\u96F6\u8BF7\u6C42\u3001\u96F6\u5FBD\u6807 DOM\u3001\u96F6\u5206\u533A\u6A21\u5757",
          label: "\u53CB\u94FE\u53EF\u8FBE\u6027\u68C0\u6D4B"
        }
      }
    }
  },
  llms: {
    defaults: {
      enable: true,
      generateFull: true,
      siteSummary: "",
      descriptionMaxLength: 200,
      excludeTags: [
        "secret",
        "private"
      ],
      excludeCategories: [],
      corePages: [
        {
          title: "Home",
          url: "/",
          description: "Main blog entrance and latest post stream."
        },
        {
          title: "About",
          url: "/about/",
          description: "Author profile, technical stack, and background."
        },
        {
          title: "Archive",
          url: "/archive/",
          description: "Chronological index of all published writings."
        }
      ],
      customSections: []
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u662F\u5426\u542F\u7528 /llms.txt \u4E0E /llms-full.txt \u9759\u6001\u7AEF\u70B9\u751F\u6210\u3002",
          label: "\u662F\u5426\u542F\u7528 /llms.txt \u4E0E /llms-full.txt \u9759\u6001\u7AEF\u70B9\u751F\u6210"
        },
        generateFull: {
          type: "boolean",
          description: "\u662F\u5426\u540C\u65F6\u751F\u6210\u5305\u542B\u5168\u91CF\u7EAF\u51C0\u6B63\u6587\u7684 /llms-full.txt\u3002",
          label: "\u662F\u5426\u540C\u65F6\u751F\u6210\u5305\u542B\u5168\u91CF\u7EAF\u51C0\u6B63\u6587\u7684 /llms-full.txt"
        },
        siteSummary: {
          type: "string",
          description: "\u7AD9\u70B9\u5728\u5927\u6A21\u578B\u773C\u4E2D\u7684\u81EA\u6211\u4ECB\u7ECD\u77ED\u8BED\u3002",
          label: "\u7AD9\u70B9\u5728\u5927\u6A21\u578B\u773C\u4E2D\u7684\u81EA\u6211\u4ECB\u7ECD\u77ED\u8BED"
        },
        corePages: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "\u9875\u9762\u6216\u8D44\u6E90\u6807\u9898\uFF08\u5C55\u793A\u5728 Markdown \u94FE\u63A5\u6587\u672C\u4E2D\uFF09",
                label: "\u9875\u9762\u6216\u8D44\u6E90\u6807\u9898"
              },
              url: {
                type: "string",
                description: '\u76F8\u5BF9\u7AD9\u5185\u8DEF\u5F84\uFF08\u5982 "/about/"\uFF09\u6216\u4EE5 http(s) \u5F00\u5934\u7684\u5B8C\u6574\u5916\u94FE',
                label: "\u76F8\u5BF9\u7AD9\u5185\u8DEF\u5F84"
              },
              description: {
                type: "string",
                description: "\u7B80\u77ED\u8BF4\u660E\u6216\u6458\u8981\uFF08\u5C55\u793A\u5728\u94FE\u63A5\u5192\u53F7\u4E4B\u540E\uFF0C\u5E2E\u52A9\u5927\u6A21\u578B\u7406\u89E3\u8BE5\u9875\u9762\u7528\u9014\uFF09",
                label: "\u7B80\u77ED\u8BF4\u660E\u6216\u6458\u8981"
              }
            }
          },
          description: "\u81EA\u5B9A\u4E49\u524D\u7F6E\u6838\u5FC3\u9875\u9762\u6E05\u5355\uFF08\u5982 Home, About, Archive \u7B49\uFF09\u3002",
          label: "\u81EA\u5B9A\u4E49\u524D\u7F6E\u6838\u5FC3\u9875\u9762\u6E05\u5355"
        },
        customSections: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: '\u7AE0\u8282\u6807\u9898\uFF08\u5982 "Documentation", "Open Source Projects"\uFF09',
                label: "\u7AE0\u8282\u6807\u9898"
              },
              description: {
                type: "string",
                description: "\u7AE0\u8282\u603B\u4F53\u8BF4\u660E\u6587\u672C\uFF08\u53EF\u9009\uFF0C\u5C55\u793A\u5728\u7AE0\u8282\u6807\u9898\u4E0B\u65B9\uFF09",
                label: "\u7AE0\u8282\u603B\u4F53\u8BF4\u660E\u6587\u672C"
              },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "\u9875\u9762\u6216\u8D44\u6E90\u6807\u9898\uFF08\u5C55\u793A\u5728 Markdown \u94FE\u63A5\u6587\u672C\u4E2D\uFF09",
                      label: "\u9875\u9762\u6216\u8D44\u6E90\u6807\u9898"
                    },
                    url: {
                      type: "string",
                      description: '\u76F8\u5BF9\u7AD9\u5185\u8DEF\u5F84\uFF08\u5982 "/about/"\uFF09\u6216\u4EE5 http(s) \u5F00\u5934\u7684\u5B8C\u6574\u5916\u94FE',
                      label: "\u76F8\u5BF9\u7AD9\u5185\u8DEF\u5F84"
                    },
                    description: {
                      type: "string",
                      description: "\u7B80\u77ED\u8BF4\u660E\u6216\u6458\u8981\uFF08\u5C55\u793A\u5728\u94FE\u63A5\u5192\u53F7\u4E4B\u540E\uFF0C\u5E2E\u52A9\u5927\u6A21\u578B\u7406\u89E3\u8BE5\u9875\u9762\u7528\u9014\uFF09",
                      label: "\u7B80\u77ED\u8BF4\u660E\u6216\u6458\u8981"
                    }
                  }
                },
                description: "\u672C\u7AE0\u8282\u5305\u542B\u7684\u94FE\u63A5\u4E0E\u6761\u76EE\u6E05\u5355",
                label: "\u672C\u7AE0\u8282\u5305\u542B\u7684\u94FE\u63A5\u4E0E\u6761\u76EE\u6E05\u5355"
              }
            }
          },
          description: "\u81EA\u5B9A\u4E49\u6269\u5C55\u7AE0\u8282\u5217\u8868\uFF08\u7528\u4E8E\u63A8\u8350\u5916\u90E8\u9879\u76EE\u6216\u6587\u6863\u5E93\uFF0C\u53EF\u9009\uFF09\u3002",
          label: "\u81EA\u5B9A\u4E49\u6269\u5C55\u7AE0\u8282\u5217\u8868"
        },
        excludeTags: {
          type: "array",
          items: {
            type: "string"
          },
          description: "\u654F\u611F/\u79C1\u6709\u6807\u7B7E\u9ED1\u540D\u5355\uFF08\u547D\u4E2D\u8BE5\u6807\u7B7E\u7684\u6587\u7AE0\u4E0D\u66B4\u9732\u7ED9\u5927\u6A21\u578B\uFF09\u3002",
          label: "\u654F\u611F/\u79C1\u6709\u6807\u7B7E\u9ED1\u540D\u5355"
        },
        excludeCategories: {
          type: "array",
          items: {
            type: "string"
          },
          description: "\u654F\u611F\u5206\u7C7B\u9ED1\u540D\u5355\uFF08\u547D\u4E2D\u8BE5\u5206\u7C7B\u7684\u6587\u7AE0\u4E0D\u66B4\u9732\u7ED9\u5927\u6A21\u578B\uFF09\u3002",
          label: "\u654F\u611F\u5206\u7C7B\u9ED1\u540D\u5355"
        },
        descriptionMaxLength: {
          type: "number",
          description: "\u5355\u7BC7\u6587\u7AE0\u6458\u8981\u7684\u6700\u5927\u5B57\u7B26\u622A\u65AD\u957F\u5EA6\uFF08\u9ED8\u8BA4 200 \u5B57\uFF09\u3002",
          label: "\u5355\u7BC7\u6587\u7AE0\u6458\u8981\u7684\u6700\u5927\u5B57\u7B26\u622A\u65AD\u957F\u5EA6"
        }
      }
    }
  },
  umami: {
    defaults: {
      enable: false,
      shareUrl: "",
      websiteId: "",
      scriptUrl: ""
    },
    schema: {
      type: "object",
      properties: {
        enable: {
          type: "boolean",
          description: "\u5168\u5C40 Umami \u7EDF\u8BA1\u603B\u5F00\u5173\uFF1Afalse \u65F6\u5B8C\u5168\u4E0D\u52A0\u8F7D oddmisc \u8FD0\u884C\u65F6\u811A\u672C\u4E0E DOM",
          label: "\u5168\u5C40 Umami \u7EDF\u8BA1\u603B\u5F00\u5173\uFF1Afalse \u65F6\u5B8C\u5168\u4E0D\u52A0\u8F7D oddmisc \u8FD0\u884C\u65F6\u811A\u672C\u4E0E DOM"
        },
        shareUrl: {
          type: "string",
          description: "Umami \u5206\u4EAB\u94FE\u63A5\uFF08\u5FC5\u586B\uFF09",
          label: "Umami \u5206\u4EAB\u94FE\u63A5"
        },
        websiteId: {
          type: "string",
          description: "Umami Website ID\uFF1B\u4E0E scriptUrl \u540C\u65F6\u914D\u7F6E\u65F6\u542F\u7528\u8BBF\u95EE\u91C7\u96C6\u3002",
          label: "Umami Website ID\uFF1B\u4E0E scriptUrl \u540C\u65F6\u914D\u7F6E\u65F6\u542F\u7528\u8BBF\u95EE\u91C7\u96C6"
        },
        scriptUrl: {
          type: "string",
          description: "Umami \u91C7\u96C6\u811A\u672C URL\uFF1B\u4E0E websiteId \u540C\u65F6\u914D\u7F6E\u65F6\u542F\u7528\u8BBF\u95EE\u91C7\u96C6\u3002",
          label: "Umami \u91C7\u96C6\u811A\u672C URL\uFF1B\u4E0E websiteId \u540C\u65F6\u914D\u7F6E\u65F6\u542F\u7528\u8BBF\u95EE\u91C7\u96C6"
        }
      }
    }
  },
  "nav-bar": {
    defaults: {
      links: []
    },
    schema: {
      type: "object",
      properties: {
        links: {
          type: "array",
          items: {
            type: "object",
            properties: {
              preset: {
                type: "string",
                enum: [
                  "Home",
                  "Archive",
                  "Categories",
                  "Tags",
                  "Series",
                  "Friends",
                  "Moments",
                  "Anime",
                  "Compass",
                  "Albums",
                  "About",
                  "Projects",
                  "Skills",
                  "Timeline",
                  "Devices",
                  "Guestbook",
                  "Sponsor",
                  "GitHub",
                  "Rss",
                  "Atom"
                ]
              },
              name: {
                type: "string"
              },
              url: {
                type: "string"
              },
              icon: {
                type: "string"
              },
              pageKey: {
                type: "string"
              },
              external: {
                type: "boolean"
              },
              children: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    preset: {
                      type: "string",
                      enum: [
                        "Home",
                        "Archive",
                        "Categories",
                        "Tags",
                        "Series",
                        "Friends",
                        "Moments",
                        "Anime",
                        "Compass",
                        "Albums",
                        "About",
                        "Projects",
                        "Skills",
                        "Timeline",
                        "Devices",
                        "Guestbook",
                        "Sponsor",
                        "GitHub",
                        "Rss",
                        "Atom"
                      ]
                    },
                    name: {
                      type: "string"
                    },
                    url: {
                      type: "string"
                    },
                    icon: {
                      type: "string"
                    },
                    pageKey: {
                      type: "string"
                    },
                    external: {
                      type: "boolean"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// tools/cms/main.mjs
var import_obsidian2 = require("obsidian");
var execute = (0, import_node_util.promisify)(import_node_child_process.execFile);
var VIEW = "shirone-cms";
var names = { true: "\u662F", false: "\u5426", movie: "\u7535\u5F71", book: "\u4E66\u7C4D", planned: "\u8BA1\u5212\u4E2D", "in-progress": "\u8FDB\u884C\u4E2D", completed: "\u5DF2\u5B8C\u6210", active: "\u5728\u7528", backup: "\u5907\u7528", archived: "\u5DF2\u5F52\u6863", wishlist: "\u613F\u671B\u6E05\u5355", shipped: "\u5DF2\u53D1\u5E03", building: "\u5F00\u53D1\u4E2D", exploring: "\u63A2\u7D22\u4E2D", beginner: "\u5165\u95E8", intermediate: "\u719F\u6089", advanced: "\u719F\u7EC3", expert: "\u7CBE\u901A", watching: "\u5728\u770B", onHold: "\u6401\u7F6E", dropped: "\u5F03\u5751" };
var fieldLabels = { title: "\u6807\u9898", name: "\u540D\u79F0", enable: "\u542F\u7528", text: "\u6587\u5B57", url: "\u7F51\u5740", href: "\u94FE\u63A5", link: "\u94FE\u63A5", icon: "\u56FE\u6807", image: "\u56FE\u7247", cover: "\u5C01\u9762", description: "\u63CF\u8FF0", label: "\u540D\u79F0", key: "\u6807\u8BC6", content: "\u6B63\u6587", type: "\u7C7B\u578B", items: "\u6761\u76EE", links: "\u94FE\u63A5", children: "\u5B50\u9879", preset: "\u5185\u7F6E\u9875\u9762", pages: "\u9875\u9762\u5F00\u5173", home: "\u9996\u9875", media: "\u7535\u5F71\u4E66\u7C4D", anime: "\u8FFD\u756A", series: "\u7CFB\u5217", compass: "\u7F51\u5740\u5BFC\u822A", skills: "\u6280\u80FD", timeline: "\u65F6\u95F4\u7EBF", devices: "\u8BBE\u5907", friends: "\u53CB\u94FE", projects: "\u9879\u76EE", albums: "\u76F8\u518C", about: "\u5173\u4E8E", sponsor: "\u6253\u8D4F", categories: "\u5206\u7C7B", tags: "\u6807\u7B7E", moments: "\u52A8\u6001", guestbook: "\u7559\u8A00\u677F", rss: "RSS", atom: "Atom", external: "\u65B0\u7A97\u53E3\u6253\u5F00", slot: "\u505C\u9760\u4F4D\u7F6E", column: "\u6240\u5728\u5217", side: "\u4FA7\u680F\u4F4D\u7F6E", components: "\u7EC4\u4EF6", arrangement: "\u680F\u6570", position: "\u4F4D\u7F6E", color: "\u989C\u8272", size: "\u5C3A\u5BF8", width: "\u5BBD\u5EA6", height: "\u9AD8\u5EA6", mode: "\u6A21\u5F0F", style: "\u6837\u5F0F", background: "\u80CC\u666F", avatar: "\u5934\u50CF", bio: "\u7B80\u4ECB", social: "\u793E\u4EA4\u94FE\u63A5", order: "\u6392\u5E8F", provider: "\u6570\u636E\u6E90", source: "\u6765\u6E90", language: "\u8BED\u8A00", timeZone: "\u65F6\u533A", subtitle: "\u526F\u6807\u9898", banner: "\u6A2A\u5E45", homeText: "\u9996\u9875\u6587\u5B57", footer: "\u9875\u811A", nav: "\u5BFC\u822A", password: "\u5BC6\u7801", passwordHint: "\u5BC6\u7801\u63D0\u793A", depth: "\u6DF1\u5EA6", count: "\u6570\u91CF", limit: "\u6570\u91CF\u4E0A\u9650", font: "\u5B57\u4F53", family: "\u5B57\u4F53", weight: "\u5B57\u91CD", blur: "\u6A21\u7CCA", opacity: "\u900F\u660E\u5EA6", duration: "\u6301\u7EED\u65F6\u95F4", interval: "\u95F4\u9694", closable: "\u5141\u8BB8\u5173\u95ED", date: "\u65E5\u671F", rating: "\u8BC4\u5206", author: "\u4F5C\u8005", creator: "\u4F5C\u8005 / \u5BFC\u6F14", src: "\u56FE\u7247\u8DEF\u5F84", alt: "\u56FE\u7247\u8BF4\u660E", note: "\u8BF4\u660E", blurb: "\u5206\u7EC4\u4ECB\u7ECD", brand: "\u54C1\u724C", status: "\u72B6\u6001", specs: "\u89C4\u683C", summary: "\u6458\u8981", category: "\u5206\u7C7B", featured: "\u63A8\u8350", phase: "\u9636\u6BB5", technologies: "\u6280\u672F", year: "\u5E74\u4EFD", repository: "\u4ED3\u5E93", website: "\u9879\u76EE\u7F51\u7AD9", specDetails: "\u8BE6\u7EC6\u89C4\u683C", value: "\u503C", tag: "\u6807\u7B7E", tagline: "\u7B7E\u540D", id: "\u7F16\u53F7", platform: "\u5E73\u53F0", handle: "\u8D26\u53F7", genres: "\u9898\u6750", progress: "\u8FDB\u5EA6", watched: "\u5DF2\u770B", total: "\u603B\u6570", start: "\u5F00\u59CB", end: "\u7ED3\u675F", heading: "\u6807\u9898", disabledIds: "\u7981\u7528\u6761\u76EE\u7F16\u53F7", disabledKeys: "\u7981\u7528\u6761\u76EE\u6807\u8BC6", disabledNames: "\u7981\u7528\u540D\u79F0", disabledTitles: "\u7981\u7528\u6807\u9898" };
var clone = (x) => JSON.parse(JSON.stringify(x));
function merge(a, b) {
  if (Array.isArray(b) || !b || typeof b !== "object") return b ?? a;
  const out = { ...a || {} };
  for (const [k, v] of Object.entries(b)) out[k] = merge(a?.[k], v);
  return out;
}
function title(r) {
  return r.data.title || r.data.name || r.data.label || r.data.platform || (0, import_node_path2.basename)(r.path, ".md");
}
function inferred(v) {
  return { type: Array.isArray(v) ? "array" : typeof v === "object" && v !== null ? "object" : typeof v };
}
function label(k, s) {
  return fieldLabels[k] || s?.label || k;
}
function valueEditor(parent, key, value, s, changed) {
  s = s || inferred(value);
  const type = s.type || inferred(value).type;
  if (type === "object") {
    const details = parent.createEl("details", { cls: "cms-object" });
    details.createEl("summary", { text: label(key, s) });
    const current = clone(value || {});
    const fields = { ...Object.fromEntries(Object.keys(current).map((k) => [k, inferred(current[k])])), ...s.properties };
    for (const [k, child] of Object.entries(fields)) valueEditor(details, k, current[k], child, (v) => {
      if (v === void 0) delete current[k];
      else current[k] = v;
      changed(clone(current));
    });
    const add = details.createEl("button", { text: "\u6DFB\u52A0\u5C5E\u6027" });
    add.onclick = () => new TextPrompt(parent.win?.app || window.app, "\u5C5E\u6027\u540D", (name) => {
      if (name) {
        current[name] = "";
        changed(current);
        details.empty();
        details.createEl("summary", { text: label(key, s) });
        valueEditor(details, key, current, { type: "object" }, changed);
      }
    }).open();
    return;
  }
  if (type === "array") {
    let render2 = function() {
      list.empty();
      current.forEach((v, i) => {
        const box = list.createDiv({ cls: "cms-array-item" });
        valueEditor(box, String(i + 1), v, s.items || inferred(v), (x) => {
          current[i] = x;
          changed(clone(current));
        });
        const controls = box.createDiv({ cls: "cms-actions" });
        for (const [text, act] of [["\u2191", () => {
          if (i) [current[i - 1], current[i]] = [current[i], current[i - 1]];
        }], ["\u2193", () => {
          if (i < current.length - 1) [current[i + 1], current[i]] = [current[i], current[i + 1]];
        }], ["\u79FB\u9664", () => current.splice(i, 1)]]) {
          const b2 = controls.createEl("button", { text });
          b2.onclick = () => {
            act();
            changed(clone(current));
            render2();
          };
        }
      });
    };
    var render = render2;
    const details = parent.createEl("details", { cls: "cms-array" });
    details.createEl("summary", { text: `${label(key, s)}\uFF08${(value || []).length} \u9879\uFF09` });
    const current = clone(value || []), list = details.createDiv();
    const b = details.createEl("button", { text: "\u6DFB\u52A0\u6761\u76EE" });
    b.onclick = () => {
      current.push(s.items?.type === "object" ? {} : s.items?.type === "number" ? 0 : "");
      changed(clone(current));
      render2();
    };
    render2();
    return;
  }
  const setting = new import_obsidian.Setting(parent).setName(label(key, s));
  if (s.description) setting.setDesc(s.description);
  if (s.enum?.length) {
    setting.addDropdown((d) => {
      d.addOption("", "\u672A\u8BBE\u7F6E");
      for (const v of s.enum) d.addOption(String(v), names[v] || String(v));
      d.setValue(value === void 0 ? "" : String(value)).onChange((v) => changed(v === "" ? void 0 : s.enum.find((x) => String(x) === v)));
    });
  } else if (type === "boolean") setting.addToggle((t) => t.setValue(value === true).onChange(changed));
  else if (type === "number") setting.addText((t) => t.setValue(value === void 0 ? "" : String(value)).onChange((v) => changed(v === "" ? void 0 : Number(v))).inputEl.type = "number");
  else if (type === "textarea") setting.addTextArea((t) => t.setValue(value || "").onChange(changed));
  else setting.addText((t) => {
    t.setValue(value === void 0 ? "" : String(value)).onChange(changed);
    t.inputEl.type = ["password", "date", "datetime-local", "url"].includes(type) ? type : "text";
  });
}
var TextPrompt = class extends import_obsidian.Modal {
  constructor(app, text, done) {
    super(app);
    this.text = text;
    this.done = done;
  }
  onOpen() {
    this.contentEl.createEl("h2", { text: this.text });
    let value = "";
    new import_obsidian.Setting(this.contentEl).addText((t) => t.onChange((v) => value = v));
    new import_obsidian.Setting(this.contentEl).addButton((b) => b.setButtonText("\u786E\u5B9A").setCta().onClick(() => {
      this.close();
      this.done(value);
    }));
  }
};
var RecordForm = class extends import_obsidian.Modal {
  constructor(plugin, domain, record) {
    super(plugin.app);
    this.plugin = plugin;
    this.domain = domain;
    this.record = record;
  }
  async onOpen() {
    const def = domains[this.domain];
    this.contentEl.createEl("h2", { text: (this.record ? "\u7F16\u8F91" : "\u65B0\u5EFA") + def.label });
    const data = clone(this.record?.data || { cmsId: (0, import_node_crypto2.randomUUID)(), draft: true, visible: true, order: 0 });
    if (!this.record) {
      if (def.fields.published) data.published = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(/* @__PURE__ */ new Date());
      if (def.fields.key) data.key = (0, import_node_crypto2.randomUUID)().slice(0, 8);
      if (this.domain === "friends") data.id = Date.now();
      if (this.domain === "albums") {
        data.layout = "masonry";
        data.columns = 3;
        data.photos = [];
      }
    }
    const records = readRecords(this.plugin.root);
    for (const [key, [name, type, required, options]] of Object.entries({ ...def.fields, ...commonFields })) {
      if (key === "title" && !def.fields.title && this.domain !== "posts") continue;
      if (type === "category" || type === "series" || type === "tags") {
        const setting = new import_obsidian.Setting(this.contentEl).setName(name);
        const candidates = records.filter((r) => r.domain === (type === "category" ? "categories" : type === "series" ? "series" : "tags"));
        if (type === "tags") setting.addText((t) => t.setPlaceholder("\u9017\u53F7\u5206\u9694\uFF0C\u53EF\u76F4\u63A5\u586B\u5199").setValue((data[key] || []).join(", ")).onChange((v) => data[key] = v.split(/[,，]/).map((x) => x.trim()).filter(Boolean)));
        else setting.addDropdown((d) => {
          d.addOption("", "\u672A\u8BBE\u7F6E");
          if (data[key] && !candidates.some((r) => r.data.key === data[key])) d.addOption(data[key], data[key]);
          for (const r of candidates.filter((r2) => r2.data.key !== data.key || key !== "parent")) d.addOption(r.data.key, title(r));
          d.setValue(data[key] || "").onChange((v) => data[key] = v);
        });
        continue;
      }
      if (type === "image") {
        const setting = new import_obsidian.Setting(this.contentEl).setName(name).addText((t) => t.setValue(data[key] || "").onChange((v) => data[key] = v));
        setting.addButton((b) => b.setButtonText("\u9009\u62E9\u56FE\u7247").onClick(() => new ImagePicker(this.plugin, (p) => {
          data[key] = p;
          this.record = { ...this.record, data };
          this.contentEl.empty();
          this.onOpen();
        }).open()));
        continue;
      }
      const arrayTypes = { images: { src: { type: "string" }, alt: { type: "string" } }, photos: { src: { type: "string" }, alt: { type: "string" }, title: { type: "string" }, tags: { type: "array", items: { type: "string" } } }, links: { label: { type: "string" }, href: { type: "string" }, note: { type: "string" }, icon: { type: "string" }, image: { type: "string" } }, specs: { key: { type: "string" }, label: { type: "string" }, value: { type: "string" } } };
      const s = type === "select" ? { type: "string", enum: options } : arrayTypes[type] ? { type: "array", items: { type: "object", properties: arrayTypes[type] } } : type === "objects" ? { type: "array", items: { type: "object" } } : type === "object" ? { type: "object" } : { type: type === "datetime" ? "datetime-local" : type };
      s.label = name;
      valueEditor(this.contentEl, key, data[key], s, (v) => data[key] = v);
      if (required) this.contentEl.lastElementChild?.classList.add("cms-required");
    }
    const unknown = Object.fromEntries(Object.entries(data).filter(([k]) => k !== "cmsId" && !def.fields[k] && !commonFields[k]));
    if (Object.keys(unknown).length) valueEditor(this.contentEl, "\u5176\u4ED6\u5C5E\u6027", unknown, { type: "object" }, (v) => Object.assign(data, v));
    let body = this.record?.body || "";
    if (def.folder) new import_obsidian.Setting(this.contentEl).setName("\u6B63\u6587").setDesc("\u53EF\u5728\u8FD9\u91CC\u7B80\u5199\uFF1B\u4FDD\u5B58\u540E\u7528 Obsidian \u6B63\u6587\u7F16\u8F91\u5668\u7EE7\u7EED\u5199\u4F5C\u3002").addTextArea((t) => t.setValue(body).onChange((v) => body = v).inputEl.rows = 8);
    const error = this.contentEl.createDiv({ cls: "cms-error" });
    const save = async (publish) => {
      try {
        if (publish) data.draft = false;
        const id = data.cmsId || (0, import_node_crypto2.randomUUID)();
        data.cmsId = id;
        const path = this.record?.path || `${folderFor(this.domain)}/${id}.md`;
        const candidate = { domain: this.domain, path, data, body };
        validate([...readRecords(this.plugin.root).filter((r) => r.path !== path), candidate]);
        if (!(0, import_node_fs2.existsSync)((0, import_node_path2.join)(this.plugin.root, folderFor(this.domain)))) await this.app.vault.createFolder(folderFor(this.domain));
        const existing = this.app.vault.getAbstractFileByPath(path);
        if (existing) await this.app.vault.modify(existing, noteText(data, body));
        else await this.app.vault.create(path, noteText(data, body));
        this.close();
        this.plugin.render();
        if (publish) await this.plugin.sync();
      } catch (e) {
        error.setText(e.message);
      }
    };
    new import_obsidian.Setting(this.contentEl).addButton((b) => b.setButtonText("\u4FDD\u5B58").setCta().onClick(() => save(false))).addButton((b) => b.setButtonText("\u53D1\u5E03").onClick(() => save(true)));
  }
};
var ImagePicker = class extends import_obsidian.Modal {
  constructor(plugin, choose) {
    super(plugin.app);
    this.plugin = plugin;
    this.choose = choose;
  }
  onOpen() {
    this.contentEl.createEl("h2", { text: "\u56FE\u7247\u5E93" });
    this.contentEl.createEl("p", { text: "\u62D6\u5165\u6216\u7C98\u8D34\u56FE\u7247\uFF0C\u4E5F\u53EF\u4EE5\u6279\u91CF\u9009\u62E9\u6587\u4EF6\u3002" });
    const input = this.contentEl.createEl("input", { type: "file", attr: { accept: "image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml", multiple: "true" } });
    const upload = async (list2) => {
      for (const f of list2) {
        if (!/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f.name)) continue;
        const dir = "cms/media";
        if (!(0, import_node_fs2.existsSync)((0, import_node_path2.join)(this.plugin.root, dir))) await this.app.vault.createFolder(dir);
        const p = `${dir}/${(0, import_node_crypto2.randomUUID)()}-${f.name.replace(/[^\p{L}\p{N}._-]/gu, "_")}`;
        await this.app.vault.createBinary(p, await f.arrayBuffer());
      }
      this.contentEl.empty();
      this.onOpen();
    };
    input.onchange = () => upload(input.files);
    this.contentEl.ondragover = (e) => e.preventDefault();
    this.contentEl.ondrop = (e) => {
      e.preventDefault();
      upload(e.dataTransfer.files);
    };
    this.contentEl.onpaste = (e) => {
      if (e.clipboardData.files.length) {
        e.preventDefault();
        upload(e.clipboardData.files);
      }
    };
    const list = this.contentEl.createDiv({ cls: "cms-image-grid" });
    for (const file of this.app.vault.getFiles().filter((f) => f.path.startsWith("cms/media/") && /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f.path))) {
      const box = list.createDiv({ cls: "cms-image" });
      box.createEl("img", { attr: { src: this.app.vault.getResourcePath(file), alt: file.basename, loading: "lazy" } });
      box.createEl("small", { text: file.name });
      const select = box.createEl("button", { text: "\u9009\u62E9" });
      select.onclick = () => {
        this.choose(file.path);
        this.close();
      };
      const refs = readRecords(this.plugin.root).filter((r) => JSON.stringify(r.data).includes(file.path) || r.body.includes(file.path) || r.body.includes(file.name));
      box.createEl("small", { text: `\u88AB ${refs.length} \u4E2A\u6761\u76EE\u5F15\u7528` });
      const del = box.createEl("button", { text: "\u79FB\u5165\u56DE\u6536\u7AD9" });
      del.disabled = refs.length > 0;
      del.onclick = async () => {
        await this.app.fileManager.trashFile(file);
        box.remove();
      };
    }
  }
};
var SettingsForm = class extends import_obsidian.Modal {
  constructor(plugin, domain) {
    super(plugin.app);
    this.plugin = plugin;
    this.domain = domain;
  }
  onOpen() {
    const file = (0, import_node_path2.join)(this.plugin.root, `config/${this.domain}.yaml`), original = (0, import_node_fs2.existsSync)(file) ? (0, import_node_fs2.readFileSync)(file, "utf8") : "";
    const overrides = (0, import_yaml2.parse)(original) || {}, def = settings_schema_default[this.domain] || {}, draft = merge(def.defaults, overrides);
    this.contentEl.createEl("h2", { text: labels[this.domain] || this.domain });
    this.contentEl.createEl("p", { text: "\u4EC5\u4FDD\u5B58\u4F60\u4FEE\u6539\u7684\u5B57\u6BB5\uFF1B\u672A\u8986\u76D6\u7684\u503C\u7EE7\u7EED\u7EE7\u627F\u4E3B\u9898\u9ED8\u8BA4\u8BBE\u7F6E\u3002" });
    const changes = /* @__PURE__ */ new Map();
    const props = def.schema?.properties || Object.fromEntries(Object.keys(draft || {}).map((k) => [k, inferred(draft[k])]));
    function diff(base, value) {
      if (JSON.stringify(base) === JSON.stringify(value)) return void 0;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const out = {};
        for (const [k, v] of Object.entries(value)) {
          const d = diff(base?.[k], v);
          if (d !== void 0) out[k] = d;
        }
        return Object.keys(out).length ? out : void 0;
      }
      return value;
    }
    if (Array.isArray(draft)) valueEditor(this.contentEl, "\u5BFC\u822A\u94FE\u63A5", draft, { type: "array", items: { type: "object", properties: { preset: { type: "string", enum: ["Home", "Archive", "Categories", "Tags", "Friends", "Moments", "Anime", "Compass", "Albums", "About", "Projects", "Skills", "Timeline", "Devices", "Media", "Guestbook", "Sponsor", "RSS", "Atom"] }, name: { type: "string" }, url: { type: "string" }, icon: { type: "string" }, external: { type: "boolean" }, children: { type: "array", items: { type: "object", properties: { name: { type: "string" }, url: { type: "string" }, preset: { type: "string" } } } } } } }, (v) => changes.set("$", v));
    else for (const [k, s] of Object.entries({ ...Object.fromEntries(Object.keys(draft || {}).map((k2) => [k2, inferred(draft[k2])])), ...props })) {
      const row = this.contentEl.createDiv();
      valueEditor(row, k, draft?.[k], s, (v) => changes.set(k, diff(def.defaults?.[k], v)));
      const reset = row.createEl("button", { text: "\u6062\u590D\u7EE7\u627F", cls: "cms-reset" });
      reset.onclick = () => {
        changes.set(k, void 0);
        row.classList.add("cms-inherited");
        new import_obsidian.Notice("\u4FDD\u5B58\u540E\u6062\u590D\u4E3B\u9898\u9ED8\u8BA4\u503C");
      };
    }
    const error = this.contentEl.createDiv({ cls: "cms-error" });
    new import_obsidian.Setting(this.contentEl).addButton((b) => b.setButtonText("\u4FDD\u5B58\u8BBE\u7F6E").setCta().onClick(async () => {
      try {
        const doc = (0, import_yaml2.parseDocument)(original || "{}");
        if (changes.has("$")) doc.contents = doc.createNode(changes.get("$"));
        else for (const [k, v] of changes) {
          if (v === void 0) doc.delete(k);
          else doc.set(k, v);
        }
        const path = `config/${this.domain}.yaml`;
        const existing = this.app.vault.getAbstractFileByPath(path);
        if (existing) await this.app.vault.modify(existing, doc.toString({ lineWidth: 0 }));
        else await this.app.vault.create(path, doc.toString({ lineWidth: 0 }));
        this.close();
        this.plugin.render();
      } catch (e) {
        error.setText(e.message);
      }
    }));
  }
};
var CmsView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.domain = "posts";
    this.selected = /* @__PURE__ */ new Set();
  }
  getViewType() {
    return VIEW;
  }
  getDisplayText() {
    return "Shirone CMS";
  }
  getIcon() {
    return "panels-top-left";
  }
  async onOpen() {
    this.render();
  }
  render() {
    const el = this.contentEl;
    el.empty();
    el.addClass("shirone-cms");
    el.createEl("h1", { text: "\u535A\u5BA2\u7BA1\u7406" });
    el.createEl("p", { text: this.plugin.status, cls: "cms-status" });
    const actions = el.createDiv({ cls: "cms-actions" });
    for (const [text, act] of [["\u7ACB\u5373\u540C\u6B65", () => this.plugin.sync()], ["\u9884\u89C8", () => this.plugin.preview()], ["\u6307\u5B9A\u65F6\u95F4\u9884\u89C8", () => new TextPrompt(this.app, "\u9884\u89C8\u65F6\u95F4\uFF0C\u4F8B\u5982 2026-10-24T18:00", (v) => this.plugin.preview(v)).open()], ["\u68C0\u67E5\u53D1\u5E03\u72B6\u6001", () => this.plugin.checkStatus()], ["\u6062\u590D\u540C\u6B65", () => {
      this.plugin.paused = false;
      this.plugin.sync();
    }], ["\u56FE\u7247\u5E93", () => new ImagePicker(this.plugin, (p) => {
      navigator.clipboard.writeText(p);
      new import_obsidian.Notice("\u56FE\u7247\u8DEF\u5F84\u5DF2\u590D\u5236\uFF0C\u53EF\u5728\u8868\u5355\u4E2D\u9009\u62E9\u5C01\u9762\u6216\u63D2\u5165\u6B63\u6587");
    }).open()]]) {
      const b = actions.createEl("button", { text });
      b.onclick = () => Promise.resolve(act()).catch((e) => this.plugin.fail(e));
    }
    const nav = el.createDiv({ cls: "cms-nav" });
    for (const [d, def2] of Object.entries(domains)) {
      const b = nav.createEl("button", { text: def2.label, cls: d === this.domain ? "mod-cta" : "" });
      b.onclick = () => {
        this.domain = d;
        this.selected.clear();
        this.render();
      };
    }
    const settings = el.createEl("details");
    settings.createEl("summary", { text: "\u7F51\u7AD9\u8BBE\u7F6E" });
    const settingsButtons = settings.createDiv({ cls: "cms-nav" });
    for (const d of Object.keys(settings_schema_default)) {
      const b = settingsButtons.createEl("button", { text: labels[d] || d });
      b.onclick = () => new SettingsForm(this.plugin, d).open();
    }
    const footer = settingsButtons.createEl("button", { text: "\u81EA\u5B9A\u4E49\u9875\u811A HTML" });
    footer.onclick = async () => {
      let f = this.app.vault.getAbstractFileByPath("config/footer.html");
      if (!f) f = await this.app.vault.create("config/footer.html", "");
      await this.app.workspace.getLeaf(true).openFile(f);
    };
    const def = domains[this.domain];
    el.createEl("h2", { text: def.label });
    const bar = el.createDiv({ cls: "cms-actions" });
    const add = bar.createEl("button", { text: "\u65B0\u5EFA" + def.label, cls: "mod-cta" });
    add.onclick = () => new RecordForm(this.plugin, this.domain).open();
    for (const [type, text] of [["\u8868\u683C", "\u539F\u751F\u8868\u683C"], ["\u5361\u7247", "\u539F\u751F\u5361\u7247"]]) {
      const b = bar.createEl("button", { text });
      b.onclick = async () => {
        const f = this.app.vault.getAbstractFileByPath(`\u7BA1\u7406\u9762\u677F/${def.label}.base`);
        await this.app.workspace.getLeaf(true).openFile(f);
      };
    }
    const search = bar.createEl("input", { type: "search", placeholder: "\u641C\u7D22\u6807\u9898\u548C\u6807\u7B7E" });
    let query = "";
    const filter = bar.createEl("select");
    for (const [value, text] of [["all", "\u5168\u90E8"], ["draft", "\u8349\u7A3F"], ["published", "\u5DF2\u53D1\u5E03"], ["scheduled", "\u5F85\u53D1\u5E03"], ["hidden", "\u9690\u85CF"]]) filter.createEl("option", { value, text });
    const batch = bar.createEl("select");
    for (const [v, text] of [["", "\u6279\u91CF\u64CD\u4F5C"], ["draft", "\u8F6C\u4E3A\u8349\u7A3F"], ["publish", "\u53D1\u5E03"], ["hide", "\u9690\u85CF"], ["show", "\u663E\u793A"], ["category", "\u4FEE\u6539\u5206\u7C7B"], ["tags", "\u4FEE\u6539\u6807\u7B7E"], ["order", "\u8BBE\u7F6E\u6392\u5E8F"], ["trash", "\u79FB\u5165\u56DE\u6536\u7AD9"]]) batch.createEl("option", { value: v, text });
    batch.onchange = async () => {
      const action = batch.value;
      batch.value = "";
      if (!action || !this.selected.size) return;
      const apply = async (value) => {
        try {
          for (const path of this.selected) {
            const f = this.app.vault.getAbstractFileByPath(path);
            if (action === "trash") {
              await this.app.fileManager.trashFile(f);
              continue;
            }
            await this.app.fileManager.processFrontMatter(f, (data) => {
              if (action === "category") data.category = value;
              if (action === "tags") data.tags = value.split(/[,，]/).map((s) => s.trim()).filter(Boolean);
              if (action === "order") data.order = Number(value);
              if (["draft", "publish"].includes(action)) data.draft = action === "draft";
              if (["hide", "show"].includes(action)) data.visible = action === "show";
            });
          }
          this.selected.clear();
          this.render();
        } catch (e) {
          this.plugin.fail(e);
        }
      };
      if (["category", "tags", "order"].includes(action)) new TextPrompt(this.app, { category: "\u5206\u7C7B\u7A33\u5B9A\u6807\u8BC6", tags: "\u6807\u7B7E\uFF08\u9017\u53F7\u5206\u9694\uFF09", order: "\u6392\u5E8F\u503C" }[action], apply).open();
      else await apply("");
    };
    const list = el.createDiv();
    const renderList = () => {
      list.empty();
      const table = list.createEl("table", { cls: "cms-table" });
      const head = table.createEl("thead").createEl("tr");
      for (const h of ["\u9009\u62E9", "\u540D\u79F0", "\u72B6\u6001", "\u6392\u5E8F", "\u64CD\u4F5C"]) head.createEl("th", { text: h });
      const body = table.createEl("tbody");
      const records = readRecords(this.plugin.root).filter((r) => r.domain === this.domain).sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
      for (const r of records) {
        if (query && !`${title(r)} ${(r.data.tags || []).join(" ")}`.toLowerCase().includes(query.toLowerCase())) continue;
        const status = r.data.draft ? "\u8349\u7A3F" : r.data.visible === false ? "\u9690\u85CF" : r.data.publishAt && new Date(r.data.publishAt) > /* @__PURE__ */ new Date() ? "\u5F85\u53D1\u5E03" : r.data.unpublishAt && new Date(r.data.unpublishAt) <= /* @__PURE__ */ new Date() ? "\u5DF2\u4E0B\u7EBF" : "\u5DF2\u53D1\u5E03";
        if (filter.value !== "all" && !({ draft: "\u8349\u7A3F", published: "\u5DF2\u53D1\u5E03", scheduled: "\u5F85\u53D1\u5E03", hidden: "\u9690\u85CF" }[filter.value] === status)) continue;
        const row = body.createEl("tr");
        const check = row.createEl("td").createEl("input", { type: "checkbox" });
        check.checked = this.selected.has(r.path);
        check.onchange = () => check.checked ? this.selected.add(r.path) : this.selected.delete(r.path);
        row.createEl("td", { text: title(r) });
        row.createEl("td", { text: status });
        row.createEl("td", { text: String(r.data.order || 0) });
        const controls = row.createEl("td");
        const edit = controls.createEl("button", { text: "\u7F16\u8F91" });
        edit.onclick = () => new RecordForm(this.plugin, this.domain, r).open();
        const open = controls.createEl("button", { text: "\u6B63\u6587" });
        open.onclick = () => this.app.workspace.getLeaf(true).openFile(this.app.vault.getAbstractFileByPath(r.path));
      }
      if (!records.length) list.createEl("p", { text: "\u8FD8\u6CA1\u6709\u6761\u76EE\uFF0C\u70B9\u51FB\u201C\u65B0\u5EFA\u201D\u5F00\u59CB\u3002" });
    };
    search.oninput = () => {
      query = search.value;
      renderList();
    };
    filter.onchange = renderList;
    renderList();
  }
};
var ShironeCms = class extends import_obsidian.Plugin {
  async onload() {
    this.root = this.app.vault.adapter.getBasePath();
    this.settings = { themePath: (0, import_node_path2.resolve)(this.root, "../shirone-Zh"), autoSync: true, ...await this.loadData() };
    this.status = "\u5C31\u7EEA";
    this.paused = false;
    this.queue = Promise.resolve();
    this.firstDirty = 0;
    this.children = [];
    this.registerView(VIEW, (leaf) => new CmsView(leaf, this));
    this.addRibbonIcon("panels-top-left", "Shirone CMS", () => this.open());
    this.addCommand({ id: "open", name: "\u6253\u5F00\u535A\u5BA2\u7BA1\u7406", callback: () => this.open() });
    this.addCommand({ id: "sync", name: "\u7ACB\u5373\u540C\u6B65\u548C\u53D1\u5E03", callback: () => this.sync() });
    this.addCommand({ id: "preview", name: "\u9884\u89C8\u7F51\u7AD9\uFF08\u5305\u542B\u8349\u7A3F\uFF09", callback: () => this.preview() });
    this.statusEl = this.addStatusBarItem();
    this.setStatus("\u5C31\u7EEA");
    for (const event of ["create", "modify", "delete", "rename"]) this.registerEvent(this.app.vault.on(event, (file) => {
      if (this.relevant(file.path)) this.dirty();
    }));
    this.registerInterval(window.setInterval(() => {
      if (this.settings.autoSync && !this.paused) {
        if (this.firstDirty && Date.now() - this.firstDirty >= 3e5) this.sync();
        else if (!this.firstDirty) this.pull();
      }
    }, 3e5));
    this.app.workspace.onLayoutReady(() => {
      if (this.settings.autoSync) this.pull();
    });
    this.addSettingTab(new CmsSettings(this.app, this));
  }
  relevant(path) {
    return /^(content|cms|config|data|assets|public)\//.test(path) && path !== "cms/publication-state.json";
  }
  setStatus(text) {
    this.status = text;
    this.statusEl?.setText("\u535A\u5BA2\uFF1A" + text);
    this.render();
  }
  render() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW)) leaf.view.render();
  }
  async open() {
    let leaf = this.app.workspace.getLeavesOfType(VIEW)[0];
    if (!leaf) {
      leaf = this.app.workspace.getLeaf(true);
      await leaf.setViewState({ type: VIEW, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
  }
  dirty() {
    if (this.busy) return;
    if (!this.firstDirty) this.firstDirty = Date.now();
    this.setStatus("\u672A\u540C\u6B65");
    clearTimeout(this.timer);
    if (this.settings.autoSync && !this.paused) this.timer = window.setTimeout(() => this.sync(), 6e4);
  }
  async git(args) {
    return (await execute("git", args, { cwd: this.root, windowsHide: true, encoding: "utf8", maxBuffer: 8 * 1024 * 1024, env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never" } })).stdout.trim();
  }
  enqueue(fn) {
    const task = this.queue.then(fn);
    this.queue = task.catch(() => {
    });
    return task.catch((e) => this.fail(e));
  }
  fail(e) {
    this.setStatus("\u5931\u8D25\uFF1A" + (e.publicMessage || e.message?.split("\n")[0] || "\u8BF7\u68C0\u67E5\u8FDE\u63A5"));
    new import_obsidian.Notice(this.status, 1e4);
  }
  async pullRemote() {
    await this.git(["fetch", "origin", "main"]);
    const ahead = await this.git(["rev-list", "--count", "HEAD..origin/main"]);
    if (ahead !== "0") {
      try {
        await this.git(["rebase", "origin/main"]);
      } catch {
        await this.git(["rebase", "--abort"]).catch(() => {
        });
        this.paused = true;
        throw new Error("\u8FDC\u7AEF\u4FEE\u6539\u4E0E\u672C\u673A\u51B2\u7A81\uFF0C\u5DF2\u4FDD\u7559\u53CC\u65B9\u5185\u5BB9\u5E76\u6682\u505C\u540C\u6B65\u3002\u8BF7\u5904\u7406\u51B2\u7A81\u540E\u70B9\u201C\u6062\u590D\u540C\u6B65\u201D\u3002");
      }
    }
  }
  pull() {
    return this.enqueue(async () => {
      if (this.firstDirty || this.paused) return;
      const dirty = await this.git(["status", "--porcelain"]);
      if (dirty) {
        this.dirty();
        return;
      }
      this.busy = true;
      try {
        await this.pullRemote();
        await this.checkStatus();
      } finally {
        this.busy = false;
      }
    });
  }
  sync() {
    return this.enqueue(async () => {
      if (this.paused) throw new Error("\u540C\u6B65\u5DF2\u6682\u505C\uFF0C\u8BF7\u5904\u7406\u51B2\u7A81\u540E\u6062\u590D");
      clearTimeout(this.timer);
      this.busy = true;
      try {
        this.setStatus("\u6821\u9A8C\u5185\u5BB9");
        validate(readRecords(this.root));
        refreshState(this.root);
        await execute("node", [(0, import_node_path2.join)(this.settings.themePath, "scripts/content/sync.mjs"), "--dry-run"], { cwd: this.settings.themePath, windowsHide: true, env: { ...process.env, CONTENT_DIR: this.root }, maxBuffer: 16 * 1024 * 1024 });
        const before = await this.git(["status", "--porcelain"]);
        if (before) {
          refreshState(this.root);
          await this.git(["add", "--all"]);
          const staged = await this.git(["diff", "--cached", "--name-only"]);
          if (staged) await this.git(["commit", "-m", "feat(content): update from Obsidian CMS"]);
        }
        this.setStatus("\u540C\u6B65 GitHub");
        await this.pullRemote();
        await this.git(["push", "origin", "HEAD:main"]);
        this.firstDirty = 0;
        this.lastSha = await this.git(["rev-parse", "HEAD"]);
        this.setStatus("\u5DF2\u540C\u6B65\uFF0C\u7B49\u5F85\u6784\u5EFA");
        await this.checkStatus();
      } catch (e) {
        if (e.stderr || e.stdout) {
          const dir = (0, import_node_path2.join)(this.root, ".obsidian/plugins/shirone-cms");
          (0, import_node_fs2.mkdirSync)(dir, { recursive: true });
          (0, import_node_fs2.writeFileSync)((0, import_node_path2.join)(dir, "last-error.log"), `${e.stdout || ""}
${e.stderr || ""}`);
          e.publicMessage = "\u6821\u9A8C\u6216\u540C\u6B65\u5931\u8D25\uFF0C\u8BE6\u7EC6\u4FE1\u606F\u4FDD\u5B58\u5728\u672C\u673A CMS last-error.log";
        }
        throw e;
      } finally {
        this.busy = false;
      }
    });
  }
  async checkStatus() {
    try {
      const sha = this.lastSha || await this.git(["rev-parse", "HEAD"]);
      const response = await (0, import_obsidian.requestUrl)({ url: `https://blog.zhiii.top/healthz?cms=${Date.now()}`, throw: false });
      if (response.status !== 200) throw new Error("\u5065\u5EB7\u68C0\u67E5\u5931\u8D25");
      if (response.json.content === sha) {
        this.setStatus("\u90E8\u7F72\u6210\u529F");
        return;
      }
      const token = await this.githubToken();
      if (token) {
        const runs = await (0, import_obsidian.requestUrl)({ url: `https://api.github.com/repos/Zhaozhiii/Shirone-Zh-Content/actions/workflows/publish.yml/runs?per_page=5`, headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }, throw: false });
        if (runs.status === 200) {
          const run = runs.json.workflow_runs.find((r) => r.head_sha === sha);
          if (run) {
            this.setStatus(run.status !== "completed" ? "\u6784\u5EFA\u4E2D" : run.conclusion === "success" ? "\u5DF2\u6784\u5EFA\uFF0C\u7B49\u5F85\u90E8\u7F72\u786E\u8BA4" : "\u6784\u5EFA\u6216\u90E8\u7F72\u5931\u8D25\uFF08Actions \u53EF\u67E5\u770B\u8BE6\u60C5\uFF09");
            return;
          }
        }
      }
      this.setStatus("\u5DF2\u540C\u6B65\uFF0C\u7B49\u5F85\u6784\u5EFA");
    } catch {
      if (!this.firstDirty) this.setStatus("\u6682\u65F6\u65E0\u6CD5\u786E\u8BA4\u90E8\u7F72\u72B6\u6001");
    }
  }
  async githubToken() {
    return new Promise((resolveToken) => {
      const child = (0, import_node_child_process.execFile)("git", ["credential", "fill"], { cwd: this.root, windowsHide: true, env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never" }, timeout: 1e4 }, (err, out) => resolveToken(err ? null : out.split(/\r?\n/).find((l) => l.startsWith("password="))?.slice(9)));
      child.stdin.end("protocol=https\nhost=github.com\n\n");
    });
  }
  async preview(at) {
    if (this.children.length) {
      for (const child of this.children) child.kill();
      this.children = [];
    }
    const env = { ...process.env, CONTENT_DIR: this.root, CMS_PREVIEW_AT: at || "" };
    const node = process.platform === "win32" ? (0, import_node_path2.join)((0, import_node_path2.dirname)(process.execPath), "node.exe") : process.execPath;
    const launch = (args) => {
      const child = (0, import_node_child_process.spawn)("node", args, { cwd: this.settings.themePath, env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
      const log = (0, import_node_path2.join)(this.root, ".obsidian/plugins/shirone-cms/preview.log");
      child.stdout.on("data", (b) => (0, import_node_fs2.writeFileSync)(log, b, { flag: "a" }));
      child.stderr.on("data", (b) => (0, import_node_fs2.writeFileSync)(log, b, { flag: "a" }));
      child.on("error", (e) => this.fail(e));
      this.children.push(child);
    };
    refreshState(this.root);
    launch(["scripts/content/sync.mjs", "--watch"]);
    launch(["node_modules/astro/bin/astro.mjs", "dev", "--host", "127.0.0.1", "--port", "4381"]);
    new import_obsidian.Notice("\u6B63\u5728\u542F\u52A8\u672C\u673A\u9884\u89C8\uFF0C\u51E0\u79D2\u540E\u6253\u5F00");
    window.setTimeout(() => window.open("http://127.0.0.1:4381"), 3500);
  }
  onunload() {
    clearTimeout(this.timer);
    for (const c of this.children) c.kill();
  }
};
var CmsSettings = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.containerEl.empty();
    this.containerEl.createEl("h2", { text: "Shirone CMS" });
    new import_obsidian.Setting(this.containerEl).setName("\u4E3B\u9898\u4ED3\u76EE\u5F55").addText((t) => t.setValue(this.plugin.settings.themePath).onChange(async (v) => {
      this.plugin.settings.themePath = v;
      await this.plugin.saveData(this.plugin.settings);
    }));
    new import_obsidian.Setting(this.containerEl).setName("\u81EA\u52A8\u540C\u6B65\u5E76\u53D1\u5E03").setDesc("\u505C\u6B62\u7F16\u8F91 60 \u79D2\u540E\u540C\u6B65\uFF1B\u8FDE\u7EED\u7F16\u8F91\u6700\u591A\u6BCF 5 \u5206\u949F\u540C\u6B65\u4E00\u6B21\u3002").addToggle((t) => t.setValue(this.plugin.settings.autoSync).onChange(async (v) => {
      this.plugin.settings.autoSync = v;
      await this.plugin.saveData(this.plugin.settings);
    }));
  }
};
