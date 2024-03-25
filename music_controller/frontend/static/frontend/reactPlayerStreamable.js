/*! For license information please see reactPlayerStreamable.js.LICENSE.txt */
(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["reactPlayerStreamable"],{"./node_modules/react-player/lib/players/Streamable.js":(module,__unused_webpack_exports,__webpack_require__)=>{eval('var __create = Object.create;\nvar __defProp = Object.defineProperty;\nvar __getOwnPropDesc = Object.getOwnPropertyDescriptor;\nvar __getOwnPropNames = Object.getOwnPropertyNames;\nvar __getProtoOf = Object.getPrototypeOf;\nvar __hasOwnProp = Object.prototype.hasOwnProperty;\nvar __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;\nvar __export = (target, all) => {\n  for (var name in all)\n    __defProp(target, name, { get: all[name], enumerable: true });\n};\nvar __copyProps = (to, from, except, desc) => {\n  if (from && typeof from === "object" || typeof from === "function") {\n    for (let key of __getOwnPropNames(from))\n      if (!__hasOwnProp.call(to, key) && key !== except)\n        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });\n  }\n  return to;\n};\nvar __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(\n  // If the importer is in node compatibility mode or this is not an ESM\n  // file that has been converted to a CommonJS file using a Babel-\n  // compatible transform (i.e. "__esModule" has not been set), then set\n  // "default" to the CommonJS "module.exports" for node compatibility.\n  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,\n  mod\n));\nvar __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);\nvar __publicField = (obj, key, value) => {\n  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);\n  return value;\n};\nvar Streamable_exports = {};\n__export(Streamable_exports, {\n  default: () => Streamable\n});\nmodule.exports = __toCommonJS(Streamable_exports);\nvar import_react = __toESM(__webpack_require__(/*! react */ "./node_modules/react/index.js"));\nvar import_utils = __webpack_require__(/*! ../utils */ "./node_modules/react-player/lib/utils.js");\nvar import_patterns = __webpack_require__(/*! ../patterns */ "./node_modules/react-player/lib/patterns.js");\nconst SDK_URL = "https://cdn.embed.ly/player-0.1.0.min.js";\nconst SDK_GLOBAL = "playerjs";\nclass Streamable extends import_react.Component {\n  constructor() {\n    super(...arguments);\n    __publicField(this, "callPlayer", import_utils.callPlayer);\n    __publicField(this, "duration", null);\n    __publicField(this, "currentTime", null);\n    __publicField(this, "secondsLoaded", null);\n    __publicField(this, "mute", () => {\n      this.callPlayer("mute");\n    });\n    __publicField(this, "unmute", () => {\n      this.callPlayer("unmute");\n    });\n    __publicField(this, "ref", (iframe) => {\n      this.iframe = iframe;\n    });\n  }\n  componentDidMount() {\n    this.props.onMount && this.props.onMount(this);\n  }\n  load(url) {\n    (0, import_utils.getSDK)(SDK_URL, SDK_GLOBAL).then((playerjs) => {\n      if (!this.iframe)\n        return;\n      this.player = new playerjs.Player(this.iframe);\n      this.player.setLoop(this.props.loop);\n      this.player.on("ready", this.props.onReady);\n      this.player.on("play", this.props.onPlay);\n      this.player.on("pause", this.props.onPause);\n      this.player.on("seeked", this.props.onSeek);\n      this.player.on("ended", this.props.onEnded);\n      this.player.on("error", this.props.onError);\n      this.player.on("timeupdate", ({ duration, seconds }) => {\n        this.duration = duration;\n        this.currentTime = seconds;\n      });\n      this.player.on("buffered", ({ percent }) => {\n        if (this.duration) {\n          this.secondsLoaded = this.duration * percent;\n        }\n      });\n      if (this.props.muted) {\n        this.player.mute();\n      }\n    }, this.props.onError);\n  }\n  play() {\n    this.callPlayer("play");\n  }\n  pause() {\n    this.callPlayer("pause");\n  }\n  stop() {\n  }\n  seekTo(seconds, keepPlaying = true) {\n    this.callPlayer("setCurrentTime", seconds);\n    if (!keepPlaying) {\n      this.pause();\n    }\n  }\n  setVolume(fraction) {\n    this.callPlayer("setVolume", fraction * 100);\n  }\n  setLoop(loop) {\n    this.callPlayer("setLoop", loop);\n  }\n  getDuration() {\n    return this.duration;\n  }\n  getCurrentTime() {\n    return this.currentTime;\n  }\n  getSecondsLoaded() {\n    return this.secondsLoaded;\n  }\n  render() {\n    const id = this.props.url.match(import_patterns.MATCH_URL_STREAMABLE)[1];\n    const style = {\n      width: "100%",\n      height: "100%"\n    };\n    return /* @__PURE__ */ import_react.default.createElement(\n      "iframe",\n      {\n        ref: this.ref,\n        src: `https://streamable.com/o/${id}`,\n        frameBorder: "0",\n        scrolling: "no",\n        style,\n        allow: "encrypted-media; autoplay; fullscreen;"\n      }\n    );\n  }\n}\n__publicField(Streamable, "displayName", "Streamable");\n__publicField(Streamable, "canPlay", import_patterns.canPlay.streamable);\n\n\n//# sourceURL=webpack://frontend/./node_modules/react-player/lib/players/Streamable.js?')}}]);