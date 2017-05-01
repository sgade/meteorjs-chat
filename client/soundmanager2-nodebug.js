/** @license
 *
 * SoundManager 2: JavaScript Sound for the Web
 * ----------------------------------------------
 * http://schillmania.com/projects/soundmanager2/
 *
 * Copyright (c) 2007, Scott Schiller. All rights reserved.
 * Code provided under the BSD License:
 * http://schillmania.com/projects/soundmanager2/license.txt
 *
 * V2.97a.20130101
 */

/*global window, SM2_DEFER, sm2Debugger, console, document, navigator, setTimeout, setInterval, clearInterval, Audio, opera */
/*jslint regexp: true, sloppy: true, white: true, nomen: true, plusplus: true */

(((window, _undefined) => {
"use strict";
var soundManager = null;
function SoundManager(smURL, smID) {
  this.setupOptions = {
    'url': (smURL || null),
    'flashVersion': 8,
    'debugMode': true,
    'debugFlash': false,
    'useConsole': true,
    'consoleOnly': true,
    'waitForWindowLoad': false,
    'bgColor': '#ffffff',
    'useHighPerformance': false,
    'flashPollingInterval': null,
    'html5PollingInterval': null,
    'flashLoadTimeout': 1000,
    'wmode': null,
    'allowScriptAccess': 'always',
    'useFlashBlock': false,
    'useHTML5Audio': true,
    'html5Test': /^(probably|maybe)$/i,
    'preferFlash': true,
    'noSWFCache': false
  };
  this.defaultOptions = {
    'autoLoad': false,
    'autoPlay': false,
    'from': null,
    'loops': 1,
    'onid3': null,
    'onload': null,
    'whileloading': null,
    'onplay': null,
    'onpause': null,
    'onresume': null,
    'whileplaying': null,
    'onposition': null,
    'onstop': null,
    'onfailure': null,
    'onfinish': null,
    'multiShot': true,
    'multiShotEvents': false,
    'position': null,
    'pan': 0,
    'stream': true,
    'to': null,
    'type': null,
    'usePolicyFile': false,
    'volume': 100
  };
  this.flash9Options = {
    'isMovieStar': null,
    'usePeakData': false,
    'useWaveformData': false,
    'useEQData': false,
    'onbufferchange': null,
    'ondataerror': null
  };
  this.movieStarOptions = {
    'bufferTime': 3,
    'serverURL': null,
    'onconnect': null,
    'duration': null
  };
  this.audioFormats = {
    'mp3': {
      'type': ['audio/mpeg; codecs="mp3"', 'audio/mpeg', 'audio/mp3', 'audio/MPA', 'audio/mpa-robust'],
      'required': true
    },
    'mp4': {
      'related': ['aac','m4a','m4b'],
      'type': ['audio/mp4; codecs="mp4a.40.2"', 'audio/aac', 'audio/x-m4a', 'audio/MP4A-LATM', 'audio/mpeg4-generic'],
      'required': false
    },
    'ogg': {
      'type': ['audio/ogg; codecs=vorbis'],
      'required': false
    },
    'wav': {
      'type': ['audio/wav; codecs="1"', 'audio/wav', 'audio/wave', 'audio/x-wav'],
      'required': false
    }
  };
  this.movieID = 'sm2-container';
  this.id = (smID || 'sm2movie');
  this.debugID = 'soundmanager-debug';
  this.debugURLParam = /([#?&])debug=1/i;
  this.versionNumber = 'V2.97a.20130101';
  this.version = null;
  this.movieURL = null;
  this.altURL = null;
  this.swfLoaded = false;
  this.enabled = false;
  this.oMC = null;
  this.sounds = {};
  this.soundIDs = [];
  this.muted = false;
  this.didFlashBlock = false;
  this.filePattern = null;
  this.filePatterns = {
    'flash8': /\.mp3(\?.*)?$/i,
    'flash9': /\.mp3(\?.*)?$/i
  };
  this.features = {
    'buffering': false,
    'peakData': false,
    'waveformData': false,
    'eqData': false,
    'movieStar': false
  };
  this.sandbox = {
  };
  this.html5 = {
    'usingFlash': null
  };
  this.flash = {};
  this.html5Only = false;
  this.ignoreFlash = false;
  var SMSound;
  var sm2 = this;
  var globalHTML5Audio = null;
  var flash = null;
  var sm = 'soundManager';
  var smc = sm + ': ';
  var h5 = 'HTML5::';
  var id;
  var ua = navigator.userAgent;
  var wl = window.location.href.toString();
  var doc = document;
  var doNothing;
  var setProperties;
  var init;
  var fV;
  var on_queue = [];
  var debugOpen = true;
  var debugTS;
  var didAppend = false;
  var appendSuccess = false;
  var didInit = false;
  var disabled = false;
  var windowLoaded = false;
  var _wDS;
  var wdCount = 0;
  var initComplete;
  var mixin;
  var assign;
  var extraOptions;
  var addOnEvent;
  var processOnEvents;
  var initUserOnload;
  var delayWaitForEI;
  var waitForEI;
  var setVersionInfo;
  var handleFocus;
  var strings;
  var initMovie;
  var preInit;
  var domContentLoaded;
  var winOnLoad;
  var didDCLoaded;
  var getDocument;
  var createMovie;
  var catchError;
  var setPolling;
  var initDebug;
  var debugLevels = ['log', 'info', 'warn', 'error'];
  var defaultFlashVersion = 8;
  var disableObject;
  var failSafely;
  var normalizeMovieURL;
  var oRemoved = null;
  var oRemovedHTML = null;
  var str;
  var flashBlockHandler;
  var getSWFCSS;
  var swfCSS;
  var toggleDebug;
  var loopFix;
  var policyFix;
  var complain;
  var idCheck;
  var waitingForEI = false;
  var initPending = false;
  var startTimer;
  var stopTimer;
  var timerExecute;
  var h5TimerCount = 0;
  var h5IntervalTimer = null;
  var parseURL;
  var messages = [];
  var needsFlash = null;
  var featureCheck;
  var html5OK;
  var html5CanPlay;
  var html5Ext;
  var html5Unload;
  var domContentLoadedIE;
  var testHTML5;
  var event;
  var slice = Array.prototype.slice;
  var useGlobalHTML5Audio = false;
  var lastGlobalHTML5URL;
  var hasFlash;
  var detectFlash;
  var badSafariFix;
  var html5_events;
  var showSupport;
  var flushMessages;
  var is_iDevice = ua.match(/(ipad|iphone|ipod)/i);
  var isAndroid = ua.match(/android/i);
  var isIE = ua.match(/msie/i);
  var isWebkit = ua.match(/webkit/i);
  var isSafari = (ua.match(/safari/i) && !ua.match(/chrome/i));
  var isOpera = (ua.match(/opera/i));
  var mobileHTML5 = (ua.match(/(mobile|pre\/|xoom)/i) || is_iDevice || isAndroid);
  var isBadSafari = (!wl.match(/usehtml5audio/i) && !wl.match(/sm2\-ignorebadua/i) && isSafari && !ua.match(/silk/i) && ua.match(/OS X 10_6_([3-7])/i));
  var hasConsole = (window.console !== _undefined && console.log !== _undefined);
  var isFocused = (doc.hasFocus !== _undefined?doc.hasFocus():null);
  var tryInitOnFocus = (isSafari && (doc.hasFocus === _undefined || !doc.hasFocus()));
  var okToDisable = !tryInitOnFocus;
  var flashMIME = /(mp3|mp4|mpa|m4a|m4b)/i;
  var emptyURL = 'about:blank';
  var overHTTP = (doc.location?doc.location.protocol.match(/http/i):null);
  var http = (!overHTTP ? 'http:/'+'/' : '');
  var netStreamMimeTypes = /^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i;
  var netStreamTypes = ['mpeg4', 'aac', 'flv', 'mov', 'mp4', 'm4v', 'f4v', 'm4a', 'm4b', 'mp4v', '3gp', '3g2'];
  var netStreamPattern = new RegExp('\\.(' + netStreamTypes.join('|') + ')(\\?.*)?$', 'i');
  this.mimePattern = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;
  this.useAltURL = !overHTTP;
  swfCSS = {
    'swfBox': 'sm2-object-box',
    'swfDefault': 'movieContainer',
    'swfError': 'swf_error',
    'swfTimedout': 'swf_timedout',
    'swfLoaded': 'swf_loaded',
    'swfUnblocked': 'swf_unblocked',
    'sm2Debug': 'sm2_debug',
    'highPerf': 'high_performance',
    'flashDebug': 'flash_debug'
  };
  this.hasHTML5 = ((() => {
    try {
      return (Audio !== _undefined && (isOpera && opera !== _undefined && opera.version() < 10 ? new Audio(null) : new Audio()).canPlayType !== _undefined);
    } catch(e) {
      return false;
    }
  })());
  this.setup = options => {
    var noURL = (!sm2.url);
    if (options !== _undefined && didInit && needsFlash && sm2.ok() && (options.flashVersion !== _undefined || options.url !== _undefined || options.html5Test !== _undefined)) {
      complain(str('setupLate'));
    }
    assign(options);
    if (noURL && didDCLoaded && options.url !== _undefined) {
      sm2.beginDelayedInit();
    }
    if (!didDCLoaded && options.url !== _undefined && doc.readyState === 'complete') {
      setTimeout(domContentLoaded, 1);
    }
    return sm2;
  };
  this.ok = () => needsFlash?(didInit && !disabled):(sm2.useHTML5Audio && sm2.hasHTML5);
  this.supported = this.ok;
  this.getMovie = smID => id(smID) || doc[smID] || window[smID];
  this.createSound = (oOptions, _url) => {
    var cs;
    var cs_string;
    var options;
    var oSound = null;
    if (!didInit || !sm2.ok()) {
      complain(cs_string);
      return false;
    }
    if (_url !== _undefined) {
      oOptions = {
        'id': oOptions,
        'url': _url
      };
    }
    options = mixin(oOptions);
    options.url = parseURL(options.url);
    if (idCheck(options.id, true)) {
      return sm2.sounds[options.id];
    }
    function make() {
      options = loopFix(options);
      sm2.sounds[options.id] = new SMSound(options);
      sm2.soundIDs.push(options.id);
      return sm2.sounds[options.id];
    }
    if (html5OK(options)) {
      oSound = make();
      oSound._setup_html5(options);
    } else {
      if (fV > 8) {
        if (options.isMovieStar === null) {
          options.isMovieStar = !!(options.serverURL || (options.type ? options.type.match(netStreamMimeTypes) : false) || options.url.match(netStreamPattern));
        }
      }
      options = policyFix(options, cs);
      oSound = make();
      if (fV === 8) {
        flash._createSound(options.id, options.loops||1, options.usePolicyFile);
      } else {
        flash._createSound(options.id, options.url, options.usePeakData, options.useWaveformData, options.useEQData, options.isMovieStar, (options.isMovieStar?options.bufferTime:false), options.loops||1, options.serverURL, options.duration||null, options.autoPlay, true, options.autoLoad, options.usePolicyFile);
        if (!options.serverURL) {
          oSound.connected = true;
          if (options.onconnect) {
            options.onconnect.apply(oSound);
          }
        }
      }
      if (!options.serverURL && (options.autoLoad || options.autoPlay)) {
        oSound.load(options);
      }
    }
    if (!options.serverURL && options.autoPlay) {
      oSound.play();
    }
    return oSound;
  };
  this.destroySound = (sID, _bFromSound) => {
    if (!idCheck(sID)) {
      return false;
    }
    var oS = sm2.sounds[sID];
    var i;
    oS._iO = {};
    oS.stop();
    oS.unload();
    for (i = 0; i < sm2.soundIDs.length; i++) {
      if (sm2.soundIDs[i] === sID) {
        sm2.soundIDs.splice(i, 1);
        break;
      }
    }
    if (!_bFromSound) {
      oS.destruct(true);
    }
    oS = null;
    delete sm2.sounds[sID];
    return true;
  };
  this.load = (sID, oOptions) => {
    if (!idCheck(sID)) {
      return false;
    }
    return sm2.sounds[sID].load(oOptions);
  };
  this.unload = sID => {
    if (!idCheck(sID)) {
      return false;
    }
    return sm2.sounds[sID].unload();
  };
  this.onPosition = (sID, nPosition, oMethod, oScope) => {
    if (!idCheck(sID)) {
      return false;
    }
    return sm2.sounds[sID].onposition(nPosition, oMethod, oScope);
  };
  this.onposition = this.onPosition;
  this.clearOnPosition = (sID, nPosition, oMethod) => {
    if (!idCheck(sID)) {
      return false;
    }
    return sm2.sounds[sID].clearOnPosition(nPosition, oMethod);
  };
  this.play = (sID, oOptions) => {
    var result = false;
    if (!didInit || !sm2.ok()) {
      complain(sm + '.play(): ' + str(!didInit?'notReady':'notOK'));
      return result;
    }
    if (!idCheck(sID)) {
      if (!(oOptions instanceof Object)) {
        oOptions = {
          url: oOptions
        };
      }
      if (oOptions && oOptions.url) {
        oOptions.id = sID;
        result = sm2.createSound(oOptions).play();
      }
      return result;
    }
    return sm2.sounds[sID].play(oOptions);
  };
  this.start = this.play;
  this.setPosition = (sID, nMsecOffset) => {
    if (!idCheck(sID)) {
      return false;
    }
    return sm2.sounds[sID].setPosition(nMsecOffset);
  };
  this.stop = sID => {
    if (!idCheck(sID)) {
      return false;
    }
    return sm2.sounds[sID].stop();
  };
  this.stopAll = () => {
    var oSound;
    for (oSound in sm2.sounds) {
      if (sm2.sounds.hasOwnProperty(oSound)) {
        sm2.sounds[oSound].stop();
      }
    }
  };
  this.pause = sID => {
    if (!idCheck(sID)) {
      return false;
    }
    return sm2.sounds[sID].pause();
  };
  this.pauseAll = () => {
    var i;
    for (i = sm2.soundIDs.length-1; i >= 0; i--) {
      sm2.sounds[sm2.soundIDs[i]].pause();
    }
  };
  this.resume = sID => {
    if (!idCheck(sID)) {
      return false;
    }
    return sm2.sounds[sID].resume();
  };
  this.resumeAll = () => {
    var i;
    for (i = sm2.soundIDs.length-1; i >= 0; i--) {
      sm2.sounds[sm2.soundIDs[i]].resume();
    }
  };
  this.togglePause = sID => {
    if (!idCheck(sID)) {
      return false;
    }
    return sm2.sounds[sID].togglePause();
  };
  this.setPan = (sID, nPan) => {
    if (!idCheck(sID)) {
      return false;
    }
    return sm2.sounds[sID].setPan(nPan);
  };
  this.setVolume = (sID, nVol) => {
    if (!idCheck(sID)) {
      return false;
    }
    return sm2.sounds[sID].setVolume(nVol);
  };
  this.mute = sID => {
    var i = 0;
    if (sID instanceof String) {
      sID = null;
    }
    if (!sID) {
      for (i = sm2.soundIDs.length-1; i >= 0; i--) {
        sm2.sounds[sm2.soundIDs[i]].mute();
      }
      sm2.muted = true;
    } else {
      if (!idCheck(sID)) {
        return false;
      }
      return sm2.sounds[sID].mute();
    }
    return true;
  };
  this.muteAll = () => {
    sm2.mute();
  };
  this.unmute = sID => {
    var i;
    if (sID instanceof String) {
      sID = null;
    }
    if (!sID) {
      for (i = sm2.soundIDs.length-1; i >= 0; i--) {
        sm2.sounds[sm2.soundIDs[i]].unmute();
      }
      sm2.muted = false;
    } else {
      if (!idCheck(sID)) {
        return false;
      }
      return sm2.sounds[sID].unmute();
    }
    return true;
  };
  this.unmuteAll = () => {
    sm2.unmute();
  };
  this.toggleMute = sID => {
    if (!idCheck(sID)) {
      return false;
    }
    return sm2.sounds[sID].toggleMute();
  };
  this.getMemoryUse = () => {
    var ram = 0;
    if (flash && fV !== 8) {
      ram = parseInt(flash._getMemoryUse(), 10);
    }
    return ram;
  };
  this.disable = bNoDisable => {
    var i;
    if (bNoDisable === _undefined) {
      bNoDisable = false;
    }
    if (disabled) {
      return false;
    }
    disabled = true;
    for (i = sm2.soundIDs.length-1; i >= 0; i--) {
      disableObject(sm2.sounds[sm2.soundIDs[i]]);
    }
    initComplete(bNoDisable);
    event.remove(window, 'load', initUserOnload);
    return true;
  };
  this.canPlayMIME = sMIME => {
    var result;
    if (sm2.hasHTML5) {
      result = html5CanPlay({type:sMIME});
    }
    if (!result && needsFlash) {
      result = (sMIME && sm2.ok() ? !!((fV > 8 ? sMIME.match(netStreamMimeTypes) : null) || sMIME.match(sm2.mimePattern)) : null);
    }
    return result;
  };
  this.canPlayURL = sURL => {
    var result;
    if (sm2.hasHTML5) {
      result = html5CanPlay({url: sURL});
    }
    if (!result && needsFlash) {
      result = (sURL && sm2.ok() ? !!(sURL.match(sm2.filePattern)) : null);
    }
    return result;
  };
  this.canPlayLink = oLink => {
    if (oLink.type !== _undefined && oLink.type) {
      if (sm2.canPlayMIME(oLink.type)) {
        return true;
      }
    }
    return sm2.canPlayURL(oLink.href);
  };
  this.getSoundById = (sID, _suppressDebug) => {
    if (!sID) {
      throw new Error(sm + '.getSoundById(): sID is null/_undefined');
    }
    var result = sm2.sounds[sID];
    return result;
  };
  this.onready = (oMethod, oScope) => {
    var sType = 'onready';
    var result = false;
    if (typeof oMethod === 'function') {
      if (!oScope) {
        oScope = window;
      }
      addOnEvent(sType, oMethod, oScope);
      processOnEvents();
      result = true;
    } else {
      throw str('needFunction', sType);
    }
    return result;
  };
  this.ontimeout = (oMethod, oScope) => {
    var sType = 'ontimeout';
    var result = false;
    if (typeof oMethod === 'function') {
      if (!oScope) {
        oScope = window;
      }
      addOnEvent(sType, oMethod, oScope);
      processOnEvents({type:sType});
      result = true;
    } else {
      throw str('needFunction', sType);
    }
    return result;
  };
  this._writeDebug = (sText, sType) => true;
  this._wD = this._writeDebug;
  this._debug = () => {
  };
  this.reboot = (resetEvents, excludeInit) => {
    var i;
    var j;
    var k;
    for (i = sm2.soundIDs.length-1; i >= 0; i--) {
      sm2.sounds[sm2.soundIDs[i]].destruct();
    }
    if (flash) {
      try {
        if (isIE) {
          oRemovedHTML = flash.innerHTML;
        }
        oRemoved = flash.parentNode.removeChild(flash);
      } catch(e) {
      }
    }
    oRemovedHTML = oRemoved = needsFlash = flash = null;
    sm2.enabled = didDCLoaded = didInit = waitingForEI = initPending = didAppend = appendSuccess = disabled = useGlobalHTML5Audio = sm2.swfLoaded = false;
    sm2.soundIDs = [];
    sm2.sounds = {};
    if (!resetEvents) {
      for (i in on_queue) {
        if (on_queue.hasOwnProperty(i)) {
          for (j = 0, k = on_queue[i].length; j < k; j++) {
            on_queue[i][j].fired = false;
          }
        }
      }
    } else {
      on_queue = [];
    }
    sm2.html5 = {
      'usingFlash': null
    };
    sm2.flash = {};
    sm2.html5Only = false;
    sm2.ignoreFlash = false;
    window.setTimeout(() => {
      preInit();
      if (!excludeInit) {
        sm2.beginDelayedInit();
      }
    }, 20);
    return sm2;
  };
  this.reset = () => sm2.reboot(true, true);
  this.getMoviePercent = () => flash && 'PercentLoaded' in flash ? flash.PercentLoaded() : null;
  this.beginDelayedInit = () => {
    windowLoaded = true;
    domContentLoaded();
    setTimeout(() => {
      if (initPending) {
        return false;
      }
      createMovie();
      initMovie();
      initPending = true;
      return true;
    }, 20);
    delayWaitForEI();
  };
  this.destruct = () => {
    sm2.disable(true);
  };
  SMSound = function(oOptions) {
    var s = this;
    var resetProperties;
    var add_html5_events;
    var remove_html5_events;
    var stop_html5_timer;
    var start_html5_timer;
    var attachOnPosition;
    var onplay_called = false;
    var onPositionItems = [];
    var onPositionFired = 0;
    var detachOnPosition;
    var applyFromTo;
    var lastURL = null;
    var lastHTML5State;
    lastHTML5State = {
      duration: null,
      time: null
    };
    this.id = oOptions.id;
    this.sID = this.id;
    this.url = oOptions.url;
    this.options = mixin(oOptions);
    this.instanceOptions = this.options;
    this._iO = this.instanceOptions;
    this.pan = this.options.pan;
    this.volume = this.options.volume;
    this.isHTML5 = false;
    this._a = null;
    this.id3 = {};
    this._debug = () => {
    };
    this.load = oOptions => {
      var oSound = null;
      var instanceOptions;
      if (oOptions !== _undefined) {
        s._iO = mixin(oOptions, s.options);
      } else {
        oOptions = s.options;
        s._iO = oOptions;
        if (lastURL && lastURL !== s.url) {
          s._iO.url = s.url;
          s.url = null;
        }
      }
      if (!s._iO.url) {
        s._iO.url = s.url;
      }
      s._iO.url = parseURL(s._iO.url);
      s.instanceOptions = s._iO;
      instanceOptions = s._iO;
      if (instanceOptions.url === s.url && s.readyState !== 0 && s.readyState !== 2) {
        if (s.readyState === 3 && instanceOptions.onload) {
          instanceOptions.onload.apply(s, [(!!s.duration)]);
        }
        return s;
      }
      s.loaded = false;
      s.readyState = 1;
      s.playState = 0;
      s.id3 = {};
      if (html5OK(instanceOptions)) {
        oSound = s._setup_html5(instanceOptions);
        if (!oSound._called_load) {
          s._html5_canplay = false;
          if (s.url !== instanceOptions.url) {
            s._a.src = instanceOptions.url;
            s.setPosition(0);
          }
          s._a.autobuffer = 'auto';
          s._a.preload = 'auto';
          s._a._called_load = true;
          if (instanceOptions.autoPlay) {
            s.play();
          }
        } else {
        }
      } else {
        try {
          s.isHTML5 = false;
          s._iO = policyFix(loopFix(instanceOptions));
          instanceOptions = s._iO;
          if (fV === 8) {
            flash._load(s.id, instanceOptions.url, instanceOptions.stream, instanceOptions.autoPlay, instanceOptions.usePolicyFile);
          } else {
            flash._load(s.id, instanceOptions.url, !!(instanceOptions.stream), !!(instanceOptions.autoPlay), instanceOptions.loops||1, !!(instanceOptions.autoLoad), instanceOptions.usePolicyFile);
          }
        } catch(e) {
          catchError({type:'SMSOUND_LOAD_JS_EXCEPTION', fatal:true});
        }
      }
      s.url = instanceOptions.url;
      return s;
    };
    this.unload = () => {
      if (s.readyState !== 0) {
        if (!s.isHTML5) {
          if (fV === 8) {
            flash._unload(s.id, emptyURL);
          } else {
            flash._unload(s.id);
          }
        } else {
          stop_html5_timer();
          if (s._a) {
            s._a.pause();
            html5Unload(s._a, emptyURL);
            lastURL = emptyURL;
          }
        }
        resetProperties();
      }
      return s;
    };
    this.destruct = _bFromSM => {
      if (!s.isHTML5) {
        s._iO.onfailure = null;
        flash._destroySound(s.id);
      } else {
        stop_html5_timer();
        if (s._a) {
          s._a.pause();
          html5Unload(s._a);
          if (!useGlobalHTML5Audio) {
            remove_html5_events();
          }
          s._a._s = null;
          s._a = null;
        }
      }
      if (!_bFromSM) {
        sm2.destroySound(s.id, true);
      }
    };
    this.play = (oOptions, _updatePlayState) => {
      var fN;
      var allowMulti;
      var a;
      var onready;
      var startOK = true;
      var exit = null;
      _updatePlayState = (_updatePlayState === _undefined ? true : _updatePlayState);
      if (!oOptions) {
        oOptions = {};
      }
      if (s.url) {
        s._iO.url = s.url;
      }
      s._iO = mixin(s._iO, s.options);
      s._iO = mixin(oOptions, s._iO);
      s._iO.url = parseURL(s._iO.url);
      s.instanceOptions = s._iO;
      if (s._iO.serverURL && !s.connected) {
        if (!s.getAutoPlay()) {
          s.setAutoPlay(true);
        }
        return s;
      }
      if (html5OK(s._iO)) {
        s._setup_html5(s._iO);
        start_html5_timer();
      }
      if (s.playState === 1 && !s.paused) {
        allowMulti = s._iO.multiShot;
        if (!allowMulti) {
          exit = s;
        } else {
        }
      }
      if (exit !== null) {
        return exit;
      }
      if (oOptions.url && oOptions.url !== s.url) {
        s.load(s._iO);
      }
      if (!s.loaded) {
        if (s.readyState === 0) {
          if (!s.isHTML5) {
            s._iO.autoPlay = true;
            s.load(s._iO);
          } else {
            s.load(s._iO);
          }
          s.instanceOptions = s._iO;
        } else if (s.readyState === 2) {
          exit = s;
        } else {
        }
      } else {
      }
      if (exit !== null) {
        return exit;
      }
      if (!s.isHTML5 && fV === 9 && s.position > 0 && s.position === s.duration) {
        oOptions.position = 0;
      }
      if (s.paused && s.position >= 0 && (!s._iO.serverURL || s.position > 0)) {
        s.resume();
      } else {
        s._iO = mixin(oOptions, s._iO);
        if (s._iO.from !== null && s._iO.to !== null && s.instanceCount === 0 && s.playState === 0 && !s._iO.serverURL) {
          onready = () => {
            s._iO = mixin(oOptions, s._iO);
            s.play(s._iO);
          };
          if (s.isHTML5 && !s._html5_canplay) {
            s.load({
              oncanplay: onready
            });
            exit = false;
          } else if (!s.isHTML5 && !s.loaded && (!s.readyState || s.readyState !== 2)) {
            s.load({
              onload: onready
            });
            exit = false;
          }
          if (exit !== null) {
            return exit;
          }
          s._iO = applyFromTo();
        }
        if (!s.instanceCount || s._iO.multiShotEvents || (!s.isHTML5 && fV > 8 && !s.getAutoPlay())) {
          s.instanceCount++;
        }
        if (s._iO.onposition && s.playState === 0) {
          attachOnPosition(s);
        }
        s.playState = 1;
        s.paused = false;
        s.position = (s._iO.position !== _undefined && !isNaN(s._iO.position) ? s._iO.position : 0);
        if (!s.isHTML5) {
          s._iO = policyFix(loopFix(s._iO));
        }
        if (s._iO.onplay && _updatePlayState) {
          s._iO.onplay.apply(s);
          onplay_called = true;
        }
        s.setVolume(s._iO.volume, true);
        s.setPan(s._iO.pan, true);
        if (!s.isHTML5) {
          startOK = flash._start(s.id, s._iO.loops || 1, (fV === 9 ? s._iO.position : s._iO.position / 1000), s._iO.multiShot);
          if (fV === 9 && !startOK) {
            if (s._iO.onplayerror) {
              s._iO.onplayerror.apply(s);
            }
          }
        } else {
          start_html5_timer();
          a = s._setup_html5();
          s.setPosition(s._iO.position);
          a.play();
        }
      }
      return s;
    };
    this.start = this.play;
    this.stop = bAll => {
      var instanceOptions = s._iO;
      var originalPosition;
      if (s.playState === 1) {
        s._onbufferchange(0);
        s._resetOnPosition(0);
        s.paused = false;
        if (!s.isHTML5) {
          s.playState = 0;
        }
        detachOnPosition();
        if (instanceOptions.to) {
          s.clearOnPosition(instanceOptions.to);
        }
        if (!s.isHTML5) {
          flash._stop(s.id, bAll);
          if (instanceOptions.serverURL) {
            s.unload();
          }
        } else {
          if (s._a) {
            originalPosition = s.position;
            s.setPosition(0);
            s.position = originalPosition;
            s._a.pause();
            s.playState = 0;
            s._onTimer();
            stop_html5_timer();
          }
        }
        s.instanceCount = 0;
        s._iO = {};
        if (instanceOptions.onstop) {
          instanceOptions.onstop.apply(s);
        }
      }
      return s;
    };
    this.setAutoPlay = autoPlay => {
      s._iO.autoPlay = autoPlay;
      if (!s.isHTML5) {
        flash._setAutoPlay(s.id, autoPlay);
        if (autoPlay) {
          if (!s.instanceCount && s.readyState === 1) {
            s.instanceCount++;
          }
        }
      }
    };
    this.getAutoPlay = () => s._iO.autoPlay;
    this.setPosition = nMsecOffset => {
      if (nMsecOffset === _undefined) {
        nMsecOffset = 0;
      }
      var original_pos;
      var position;
      var position1K;
      var offset = (s.isHTML5 ? Math.max(nMsecOffset, 0) : Math.min(s.duration || s._iO.duration, Math.max(nMsecOffset, 0)));
      original_pos = s.position;
      s.position = offset;
      position1K = s.position/1000;
      s._resetOnPosition(s.position);
      s._iO.position = offset;
      if (!s.isHTML5) {
        position = (fV === 9 ? s.position : position1K);
        if (s.readyState && s.readyState !== 2) {
          flash._setPosition(s.id, position, (s.paused || !s.playState), s._iO.multiShot);
        }
      } else if (s._a) {
        if (s._html5_canplay) {
          if (s._a.currentTime !== position1K) {
            try {
              s._a.currentTime = position1K;
              if (s.playState === 0 || s.paused) {
                s._a.pause();
              }
            } catch(e) {
            }
          }
        } else {
        }
      }
      if (s.isHTML5) {
        if (s.paused) {
          s._onTimer(true);
        }
      }
      return s;
    };
    this.pause = _bCallFlash => {
      if (s.paused || (s.playState === 0 && s.readyState !== 1)) {
        return s;
      }
      s.paused = true;
      if (!s.isHTML5) {
        if (_bCallFlash || _bCallFlash === _undefined) {
          flash._pause(s.id, s._iO.multiShot);
        }
      } else {
        s._setup_html5().pause();
        stop_html5_timer();
      }
      if (s._iO.onpause) {
        s._iO.onpause.apply(s);
      }
      return s;
    };
    this.resume = () => {
      var instanceOptions = s._iO;
      if (!s.paused) {
        return s;
      }
      s.paused = false;
      s.playState = 1;
      if (!s.isHTML5) {
        if (instanceOptions.isMovieStar && !instanceOptions.serverURL) {
          s.setPosition(s.position);
        }
        flash._pause(s.id, instanceOptions.multiShot);
      } else {
        s._setup_html5().play();
        start_html5_timer();
      }
      if (!onplay_called && instanceOptions.onplay) {
        instanceOptions.onplay.apply(s);
        onplay_called = true;
      } else if (instanceOptions.onresume) {
        instanceOptions.onresume.apply(s);
      }
      return s;
    };
    this.togglePause = () => {
      if (s.playState === 0) {
        s.play({
          position: (fV === 9 && !s.isHTML5 ? s.position : s.position / 1000)
        });
        return s;
      }
      if (s.paused) {
        s.resume();
      } else {
        s.pause();
      }
      return s;
    };
    this.setPan = (nPan, bInstanceOnly) => {
      if (nPan === _undefined) {
        nPan = 0;
      }
      if (bInstanceOnly === _undefined) {
        bInstanceOnly = false;
      }
      if (!s.isHTML5) {
        flash._setPan(s.id, nPan);
      }
      s._iO.pan = nPan;
      if (!bInstanceOnly) {
        s.pan = nPan;
        s.options.pan = nPan;
      }
      return s;
    };
    this.setVolume = (nVol, _bInstanceOnly) => {
      if (nVol === _undefined) {
        nVol = 100;
      }
      if (_bInstanceOnly === _undefined) {
        _bInstanceOnly = false;
      }
      if (!s.isHTML5) {
        flash._setVolume(s.id, (sm2.muted && !s.muted) || s.muted?0:nVol);
      } else if (s._a) {
        s._a.volume = Math.max(0, Math.min(1, nVol/100));
      }
      s._iO.volume = nVol;
      if (!_bInstanceOnly) {
        s.volume = nVol;
        s.options.volume = nVol;
      }
      return s;
    };
    this.mute = () => {
      s.muted = true;
      if (!s.isHTML5) {
        flash._setVolume(s.id, 0);
      } else if (s._a) {
        s._a.muted = true;
      }
      return s;
    };
    this.unmute = () => {
      s.muted = false;
      var hasIO = (s._iO.volume !== _undefined);
      if (!s.isHTML5) {
        flash._setVolume(s.id, hasIO?s._iO.volume:s.options.volume);
      } else if (s._a) {
        s._a.muted = false;
      }
      return s;
    };
    this.toggleMute = () => s.muted?s.unmute():s.mute();
    this.onPosition = (nPosition, oMethod, oScope) => {
      onPositionItems.push({
        position: parseInt(nPosition, 10),
        method: oMethod,
        scope: (oScope !== _undefined ? oScope : s),
        fired: false
      });
      return s;
    };
    this.onposition = this.onPosition;
    this.clearOnPosition = (nPosition, oMethod) => {
      var i;
      nPosition = parseInt(nPosition, 10);
      if (isNaN(nPosition)) {
        return false;
      }
      for (i=0; i < onPositionItems.length; i++) {
        if (nPosition === onPositionItems[i].position) {
          if (!oMethod || (oMethod === onPositionItems[i].method)) {
            if (onPositionItems[i].fired) {
              onPositionFired--;
            }
            onPositionItems.splice(i, 1);
          }
        }
      }
    };
    this._processOnPosition = () => {
      var i;
      var item;
      var j = onPositionItems.length;
      if (!j || !s.playState || onPositionFired >= j) {
        return false;
      }
      for (i=j-1; i >= 0; i--) {
        item = onPositionItems[i];
        if (!item.fired && s.position >= item.position) {
          item.fired = true;
          onPositionFired++;
          item.method.apply(item.scope, [item.position]);
        }
      }
      return true;
    };
    this._resetOnPosition = nPosition => {
      var i;
      var item;
      var j = onPositionItems.length;
      if (!j) {
        return false;
      }
      for (i=j-1; i >= 0; i--) {
        item = onPositionItems[i];
        if (item.fired && nPosition <= item.position) {
          item.fired = false;
          onPositionFired--;
        }
      }
      return true;
    };
    applyFromTo = () => {
      var instanceOptions = s._iO;
      var f = instanceOptions.from;
      var t = instanceOptions.to;
      var start;
      var end;
      end = () => {
        s.clearOnPosition(t, end);
        s.stop();
      };
      start = () => {
        if (t !== null && !isNaN(t)) {
          s.onPosition(t, end);
        }
      };
      if (f !== null && !isNaN(f)) {
        instanceOptions.position = f;
        instanceOptions.multiShot = false;
        start();
      }
      return instanceOptions;
    };
    attachOnPosition = () => {
      var item;
      var op = s._iO.onposition;
      if (op) {
        for (item in op) {
          if (op.hasOwnProperty(item)) {
            s.onPosition(parseInt(item, 10), op[item]);
          }
        }
      }
    };
    detachOnPosition = () => {
      var item;
      var op = s._iO.onposition;
      if (op) {
        for (item in op) {
          if (op.hasOwnProperty(item)) {
            s.clearOnPosition(parseInt(item, 10));
          }
        }
      }
    };
    start_html5_timer = () => {
      if (s.isHTML5) {
        startTimer(s);
      }
    };
    stop_html5_timer = () => {
      if (s.isHTML5) {
        stopTimer(s);
      }
    };
    resetProperties = retainPosition => {
      if (!retainPosition) {
        onPositionItems = [];
        onPositionFired = 0;
      }
      onplay_called = false;
      s._hasTimer = null;
      s._a = null;
      s._html5_canplay = false;
      s.bytesLoaded = null;
      s.bytesTotal = null;
      s.duration = (s._iO && s._iO.duration ? s._iO.duration : null);
      s.durationEstimate = null;
      s.buffered = [];
      s.eqData = [];
      s.eqData.left = [];
      s.eqData.right = [];
      s.failures = 0;
      s.isBuffering = false;
      s.instanceOptions = {};
      s.instanceCount = 0;
      s.loaded = false;
      s.metadata = {};
      s.readyState = 0;
      s.muted = false;
      s.paused = false;
      s.peakData = {
        left: 0,
        right: 0
      };
      s.waveformData = {
        left: [],
        right: []
      };
      s.playState = 0;
      s.position = null;
      s.id3 = {};
    };
    resetProperties();
    this._onTimer = bForce => {
      var duration;
      var isNew = false;
      var time;
      var x = {};
      if (s._hasTimer || bForce) {
        if (s._a && (bForce || ((s.playState > 0 || s.readyState === 1) && !s.paused))) {
          duration = s._get_html5_duration();
          if (duration !== lastHTML5State.duration) {
            lastHTML5State.duration = duration;
            s.duration = duration;
            isNew = true;
          }
          s.durationEstimate = s.duration;
          time = (s._a.currentTime * 1000 || 0);
          if (time !== lastHTML5State.time) {
            lastHTML5State.time = time;
            isNew = true;
          }
          if (isNew || bForce) {
            s._whileplaying(time,x,x,x,x);
          }
        }
        return isNew;
      }
    };
    this._get_html5_duration = () => {
      var instanceOptions = s._iO;
      var d = (s._a && s._a.duration ? s._a.duration*1000 : (instanceOptions && instanceOptions.duration ? instanceOptions.duration : null));
      var result = (d && !isNaN(d) && d !== Infinity ? d : null);
      return result;
    };
    this._apply_loop = (a, nLoops) => {
      a.loop = (nLoops > 1 ? 'loop' : '');
    };
    this._setup_html5 = oOptions => {
      var instanceOptions = mixin(s._iO, oOptions);
      var d = decodeURI;
      var a = useGlobalHTML5Audio ? globalHTML5Audio  : s._a;
      var dURL = d(instanceOptions.url);
      var sameURL;
      if (useGlobalHTML5Audio) {
        if (dURL === lastGlobalHTML5URL) {
          sameURL = true;
        }
      } else if (dURL === lastURL) {
        sameURL = true;
      }
      if (a) {
        if (a._s) {
          if (useGlobalHTML5Audio) {
            if (a._s && a._s.playState && !sameURL) {
              a._s.stop();
            }
          } else if (!useGlobalHTML5Audio && dURL === d(lastURL)) {
            s._apply_loop(a, instanceOptions.loops);
            return a;
          }
        }
        if (!sameURL) {
          resetProperties(false);
          a.src = instanceOptions.url;
          s.url = instanceOptions.url;
          lastURL = instanceOptions.url;
          lastGlobalHTML5URL = instanceOptions.url;
          a._called_load = false;
        }
      } else {
        if (instanceOptions.autoLoad || instanceOptions.autoPlay) {
          s._a = new Audio(instanceOptions.url);
        } else {
          s._a = (isOpera && opera.version() < 10 ? new Audio(null) : new Audio());
        }
        a = s._a;
        a._called_load = false;
        if (useGlobalHTML5Audio) {
          globalHTML5Audio = a;
        }
      }
      s.isHTML5 = true;
      s._a = a;
      a._s = s;
      add_html5_events();
      s._apply_loop(a, instanceOptions.loops);
      if (instanceOptions.autoLoad || instanceOptions.autoPlay) {
        s.load();
      } else {
        a.autobuffer = false;
        a.preload = 'auto';
      }
      return a;
    };
    add_html5_events = () => {
      if (s._a._added_events) {
        return false;
      }
      var f;
      function add(oEvt, oFn, bCapture) {
        return s._a ? s._a.addEventListener(oEvt, oFn, bCapture||false) : null;
      }
      s._a._added_events = true;
      for (f in html5_events) {
        if (html5_events.hasOwnProperty(f)) {
          add(f, html5_events[f]);
        }
      }
      return true;
    };
    remove_html5_events = () => {
      var f;
      function remove(oEvt, oFn, bCapture) {
        return (s._a ? s._a.removeEventListener(oEvt, oFn, bCapture||false) : null);
      }
      s._a._added_events = false;
      for (f in html5_events) {
        if (html5_events.hasOwnProperty(f)) {
          remove(f, html5_events[f]);
        }
      }
    };
    this._onload = nSuccess => {
      var fN;
      var loadOK = !!nSuccess || (!s.isHTML5 && fV === 8 && s.duration);
      s.loaded = loadOK;
      s.readyState = loadOK?3:2;
      s._onbufferchange(0);
      if (s._iO.onload) {
        s._iO.onload.apply(s, [loadOK]);
      }
      return true;
    };
    this._onbufferchange = nIsBuffering => {
      if (s.playState === 0) {
        return false;
      }
      if ((nIsBuffering && s.isBuffering) || (!nIsBuffering && !s.isBuffering)) {
        return false;
      }
      s.isBuffering = (nIsBuffering === 1);
      if (s._iO.onbufferchange) {
        s._iO.onbufferchange.apply(s);
      }
      return true;
    };
    this._onsuspend = () => {
      if (s._iO.onsuspend) {
        s._iO.onsuspend.apply(s);
      }
      return true;
    };
    this._onfailure = (msg, level, code) => {
      s.failures++;
      if (s._iO.onfailure && s.failures === 1) {
        s._iO.onfailure(s, msg, level, code);
      } else {
      }
    };
    this._onfinish = () => {
      var io_onfinish = s._iO.onfinish;
      s._onbufferchange(0);
      s._resetOnPosition(0);
      if (s.instanceCount) {
        s.instanceCount--;
        if (!s.instanceCount) {
          detachOnPosition();
          s.playState = 0;
          s.paused = false;
          s.instanceCount = 0;
          s.instanceOptions = {};
          s._iO = {};
          stop_html5_timer();
          if (s.isHTML5) {
            s.position = 0;
          }
        }
        if (!s.instanceCount || s._iO.multiShotEvents) {
          if (io_onfinish) {
            io_onfinish.apply(s);
          }
        }
      }
    };
    this._whileloading = (nBytesLoaded, nBytesTotal, nDuration, nBufferLength) => {
      var instanceOptions = s._iO;
      s.bytesLoaded = nBytesLoaded;
      s.bytesTotal = nBytesTotal;
      s.duration = Math.floor(nDuration);
      s.bufferLength = nBufferLength;
      if (!s.isHTML5 && !instanceOptions.isMovieStar) {
        if (instanceOptions.duration) {
          s.durationEstimate = (s.duration > instanceOptions.duration) ? s.duration : instanceOptions.duration;
        } else {
          s.durationEstimate = parseInt((s.bytesTotal / s.bytesLoaded) * s.duration, 10);
        }
      } else {
        s.durationEstimate = s.duration;
      }
      if (!s.isHTML5) {
        s.buffered = [{
          'start': 0,
          'end': s.duration
        }];
      }
      if ((s.readyState !== 3 || s.isHTML5) && instanceOptions.whileloading) {
        instanceOptions.whileloading.apply(s);
      }
    };
    this._whileplaying = (nPosition, oPeakData, oWaveformDataLeft, oWaveformDataRight, oEQData) => {
      var instanceOptions = s._iO;
      var eqLeft;
      if (isNaN(nPosition) || nPosition === null) {
        return false;
      }
      s.position = Math.max(0, nPosition);
      s._processOnPosition();
      if (!s.isHTML5 && fV > 8) {
        if (instanceOptions.usePeakData && oPeakData !== _undefined && oPeakData) {
          s.peakData = {
            left: oPeakData.leftPeak,
            right: oPeakData.rightPeak
          };
        }
        if (instanceOptions.useWaveformData && oWaveformDataLeft !== _undefined && oWaveformDataLeft) {
          s.waveformData = {
            left: oWaveformDataLeft.split(','),
            right: oWaveformDataRight.split(',')
          };
        }
        if (instanceOptions.useEQData) {
          if (oEQData !== _undefined && oEQData && oEQData.leftEQ) {
            eqLeft = oEQData.leftEQ.split(',');
            s.eqData = eqLeft;
            s.eqData.left = eqLeft;
            if (oEQData.rightEQ !== _undefined && oEQData.rightEQ) {
              s.eqData.right = oEQData.rightEQ.split(',');
            }
          }
        }
      }
      if (s.playState === 1) {
        if (!s.isHTML5 && fV === 8 && !s.position && s.isBuffering) {
          s._onbufferchange(0);
        }
        if (instanceOptions.whileplaying) {
          instanceOptions.whileplaying.apply(s);
        }
      }
      return true;
    };
    this._oncaptiondata = oData => {
      s.captiondata = oData;
      if (s._iO.oncaptiondata) {
        s._iO.oncaptiondata.apply(s, [oData]);
      }
    };
    this._onmetadata = (oMDProps, oMDData) => {
      var oData = {};
      var i;
      var j;
      for (i = 0, j = oMDProps.length; i < j; i++) {
        oData[oMDProps[i]] = oMDData[i];
      }
      s.metadata = oData;
      if (s._iO.onmetadata) {
        s._iO.onmetadata.apply(s);
      }
    };
    this._onid3 = (oID3Props, oID3Data) => {
      var oData = [];
      var i;
      var j;
      for (i = 0, j = oID3Props.length; i < j; i++) {
        oData[oID3Props[i]] = oID3Data[i];
      }
      s.id3 = mixin(s.id3, oData);
      if (s._iO.onid3) {
        s._iO.onid3.apply(s);
      }
    };
    this._onconnect = bSuccess => {
      bSuccess = (bSuccess === 1);
      s.connected = bSuccess;
      if (bSuccess) {
        s.failures = 0;
        if (idCheck(s.id)) {
          if (s.getAutoPlay()) {
            s.play(_undefined, s.getAutoPlay());
          } else if (s._iO.autoLoad) {
            s.load();
          }
        }
        if (s._iO.onconnect) {
          s._iO.onconnect.apply(s, [bSuccess]);
        }
      }
    };
    this._ondataerror = sError => {
      if (s.playState > 0) {
        if (s._iO.ondataerror) {
          s._iO.ondataerror.apply(s);
        }
      }
    };
  };
  getDocument = () => doc.body || doc._docElement || doc.getElementsByTagName('div')[0];
  id = sID => doc.getElementById(sID);
  mixin = (oMain, oAdd) => {
    var o1 = (oMain || {});
    var o2;
    var o;
    o2 = (oAdd === _undefined ? sm2.defaultOptions : oAdd);
    for (o in o2) {
      if (o2.hasOwnProperty(o) && o1[o] === _undefined) {
        if (typeof o2[o] !== 'object' || o2[o] === null) {
          o1[o] = o2[o];
        } else {
          o1[o] = mixin(o1[o], o2[o]);
        }
      }
    }
    return o1;
  };
  extraOptions = {
    'onready': 1,
    'ontimeout': 1,
    'defaultOptions': 1,
    'flash9Options': 1,
    'movieStarOptions': 1
  };
  assign = (o, oParent) => {
    var i;
    var result = true;
    var hasParent = (oParent !== _undefined);
    var setupOptions = sm2.setupOptions;
    var bonusOptions = extraOptions;
    for (i in o) {
      if (o.hasOwnProperty(i)) {
        if (typeof o[i] !== 'object' || o[i] === null || o[i] instanceof Array || o[i] instanceof RegExp) {
          if (hasParent && bonusOptions[oParent] !== _undefined) {
            sm2[oParent][i] = o[i];
          } else if (setupOptions[i] !== _undefined) {
            sm2.setupOptions[i] = o[i];
            sm2[i] = o[i];
          } else if (bonusOptions[i] === _undefined) {
            complain(str((sm2[i] === _undefined ? 'setupUndef' : 'setupError'), i), 2);
            result = false;
          } else {
            if (sm2[i] instanceof Function) {
              sm2[i](...((o[i] instanceof Array ? o[i] : [o[i]])));
            } else {
              sm2[i] = o[i];
            }
          }
        } else {
          if (bonusOptions[i] === _undefined) {
            complain(str((sm2[i] === _undefined ? 'setupUndef' : 'setupError'), i), 2);
            result = false;
          } else {
            return assign(o[i], i);
          }
        }
      }
    }
    return result;
  };
  function preferFlashCheck(kind) {
    return (sm2.preferFlash && hasFlash && !sm2.ignoreFlash && (sm2.flash[kind] !== _undefined && sm2.flash[kind]));
  }
  event = ((() => {
    var old = (window.attachEvent);

    var evt = {
      add: (old?'attachEvent':'addEventListener'),
      remove: (old?'detachEvent':'removeEventListener')
    };

    function getArgs(oArgs) {
      var args = slice.call(oArgs);
      var len = args.length;
      if (old) {
        args[1] = 'on' + args[1];
        if (len > 3) {
          args.pop();
        }
      } else if (len === 3) {
        args.push(false);
      }
      return args;
    }
    function apply(args, sType) {
      var element = args.shift();
      var method = [evt[sType]];
      if (old) {
        element[method](args[0], args[1]);
      } else {
        element[method](...args);
      }
    }
    function add(...args) {
      apply(getArgs(args), 'add');
    }
    function remove(...args) {
      apply(getArgs(args), 'remove');
    }
    return {
      'add': add,
      'remove': remove
    };
  })());
  function html5_event(oFn) {
    return function(e) {
      var s = this._s;
      var result;
      if (!s || !s._a) {
        result = null;
      } else {
        result = oFn.call(this, e);
      }
      return result;
    };
  }
  html5_events = {
    abort: html5_event(() => {
    }),
    canplay: html5_event(function() {
      var s = this._s;
      var position1K;
      if (s._html5_canplay) {
        return true;
      }
      s._html5_canplay = true;
      s._onbufferchange(0);
      position1K = (s._iO.position !== _undefined && !isNaN(s._iO.position)?s._iO.position/1000:null);
      if (s.position && this.currentTime !== position1K) {
        try {
          this.currentTime = position1K;
        } catch(ee) {
        }
      }
      if (s._iO._oncanplay) {
        s._iO._oncanplay();
      }
    }),
    canplaythrough: html5_event(function() {
      var s = this._s;
      if (!s.loaded) {
        s._onbufferchange(0);
        s._whileloading(s.bytesLoaded, s.bytesTotal, s._get_html5_duration());
        s._onload(true);
      }
    }),
    ended: html5_event(function() {
      var s = this._s;
      s._onfinish();
    }),
    error: html5_event(function() {
      this._s._onload(false);
    }),
    loadeddata: html5_event(function() {
      var s = this._s;
      if (!s._loaded && !isSafari) {
        s.duration = s._get_html5_duration();
      }
    }),
    loadedmetadata: html5_event(() => {
    }),
    loadstart: html5_event(function() {
      this._s._onbufferchange(1);
    }),
    play: html5_event(function() {
      this._s._onbufferchange(0);
    }),
    playing: html5_event(function() {
      this._s._onbufferchange(0);
    }),
    progress: html5_event(function(e) {
      var s = this._s;
      var i;
      var j;
      var str;
      var buffered = 0;
      var isProgress = (e.type === 'progress');
      var ranges = e.target.buffered;
      var loaded = (e.loaded||0);
      var total = (e.total||1);
      var scale = 1000;
      s.buffered = [];
      if (ranges && ranges.length) {
        for (i=0, j=ranges.length; i<j; i++) {
          s.buffered.push({
            'start': ranges.start(i) * scale,
            'end': ranges.end(i) * scale
          });
        }
        buffered = (ranges.end(0) - ranges.start(0)) * scale;
        loaded = buffered/(e.target.duration*scale);
      }
      if (!isNaN(loaded)) {
        s._onbufferchange(0);
        s._whileloading(loaded, total, s._get_html5_duration());
        if (loaded && total && loaded === total) {
          html5_events.canplaythrough.call(this, e);
        }
      }
    }),
    ratechange: html5_event(() => {
    }),
    suspend: html5_event(function(e) {
      var s = this._s;
      html5_events.progress.call(this, e);
      s._onsuspend();
    }),
    stalled: html5_event(() => {
    }),
    timeupdate: html5_event(function() {
      this._s._onTimer();
    }),
    waiting: html5_event(function() {
      var s = this._s;
      s._onbufferchange(1);
    })
  };
  html5OK = iO => {
    var result;
    if (iO.serverURL || (iO.type && preferFlashCheck(iO.type))) {
      result = false;
    } else {
      result = ((iO.type ? html5CanPlay({type:iO.type}) : html5CanPlay({url:iO.url}) || sm2.html5Only));
    }
    return result;
  };
  html5Unload = (oAudio, url) => {
    if (oAudio) {
      oAudio.src = url;
      oAudio._called_load = false;
    }
    if (useGlobalHTML5Audio) {
      lastGlobalHTML5URL = null;
    }
  };
  html5CanPlay = o => {
    if (!sm2.useHTML5Audio || !sm2.hasHTML5) {
      return false;
    }
    var url = (o.url || null);
    var mime = (o.type || null);
    var aF = sm2.audioFormats;
    var result;
    var offset;
    var fileExt;
    var item;
    if (mime && sm2.html5[mime] !== _undefined) {
      return (sm2.html5[mime] && !preferFlashCheck(mime));
    }
    if (!html5Ext) {
      html5Ext = [];
      for (item in aF) {
        if (aF.hasOwnProperty(item)) {
          html5Ext.push(item);
          if (aF[item].related) {
            html5Ext = html5Ext.concat(aF[item].related);
          }
        }
      }
      html5Ext = new RegExp('\\.('+html5Ext.join('|')+')(\\?.*)?$','i');
    }
    fileExt = (url ? url.toLowerCase().match(html5Ext) : null);
    if (!fileExt || !fileExt.length) {
      if (!mime) {
        result = false;
      } else {
        offset = mime.indexOf(';');
        fileExt = (offset !== -1?mime.substr(0,offset):mime).substr(6);
      }
    } else {
      fileExt = fileExt[1];
    }
    if (fileExt && sm2.html5[fileExt] !== _undefined) {
      result = (sm2.html5[fileExt] && !preferFlashCheck(fileExt));
    } else {
      mime = 'audio/'+fileExt;
      result = sm2.html5.canPlayType({type:mime});
      sm2.html5[fileExt] = result;
      result = (result && sm2.html5[mime] && !preferFlashCheck(mime));
    }
    return result;
  };
  testHTML5 = () => {
    if (!sm2.useHTML5Audio || !sm2.hasHTML5) {
      return false;
    }
    var a = (Audio !== _undefined ? (isOpera && opera.version() < 10 ? new Audio(null) : new Audio()) : null);
    var item;
    var lookup;
    var support = {};
    var aF;
    var i;
    function cp(m) {
      var canPlay;
      var i;
      var j;
      var result = false;
      var isOK = false;
      if (!a || typeof a.canPlayType !== 'function') {
        return result;
      }
      if (m instanceof Array) {
        for (i=0, j=m.length; i<j; i++) {
          if (sm2.html5[m[i]] || a.canPlayType(m[i]).match(sm2.html5Test)) {
            isOK = true;
            sm2.html5[m[i]] = true;
            sm2.flash[m[i]] = !!(m[i].match(flashMIME));
          }
        }
        result = isOK;
      } else {
        canPlay = (a && typeof a.canPlayType === 'function' ? a.canPlayType(m) : false);
        result = !!(canPlay && (canPlay.match(sm2.html5Test)));
      }
      return result;
    }
    aF = sm2.audioFormats;
    for (item in aF) {
      if (aF.hasOwnProperty(item)) {
        lookup = 'audio/' + item;
        support[item] = cp(aF[item].type);
        support[lookup] = support[item];
        if (item.match(flashMIME)) {
          sm2.flash[item] = true;
          sm2.flash[lookup] = true;
        } else {
          sm2.flash[item] = false;
          sm2.flash[lookup] = false;
        }
        if (aF[item] && aF[item].related) {
          for (i=aF[item].related.length-1; i >= 0; i--) {
            support['audio/'+aF[item].related[i]] = support[item];
            sm2.html5[aF[item].related[i]] = support[item];
            sm2.flash[aF[item].related[i]] = support[item];
          }
        }
      }
    }
    support.canPlayType = (a?cp:null);
    sm2.html5 = mixin(sm2.html5, support);
    return true;
  };
  strings = {
  };
  str = () => {
  };
  loopFix = sOpt => {
    if (fV === 8 && sOpt.loops > 1 && sOpt.stream) {
      sOpt.stream = false;
    }
    return sOpt;
  };
  policyFix = (sOpt, sPre) => {
    if (sOpt && !sOpt.usePolicyFile && (sOpt.onid3 || sOpt.usePeakData || sOpt.useWaveformData || sOpt.useEQData)) {
      sOpt.usePolicyFile = true;
    }
    return sOpt;
  };
  complain = sMsg => {
  };
  doNothing = () => false;
  disableObject = o => {
    var oProp;
    for (oProp in o) {
      if (o.hasOwnProperty(oProp) && typeof o[oProp] === 'function') {
        o[oProp] = doNothing;
      }
    }
    oProp = null;
  };
  failSafely = bNoDisable => {
    if (bNoDisable === _undefined) {
      bNoDisable = false;
    }
    if (disabled || bNoDisable) {
      sm2.disable(bNoDisable);
    }
  };
  normalizeMovieURL = smURL => {
    var urlParams = null;
    var url;
    if (smURL) {
      if (smURL.match(/\.swf(\?.*)?$/i)) {
        urlParams = smURL.substr(smURL.toLowerCase().lastIndexOf('.swf?') + 4);
        if (urlParams) {
          return smURL;
        }
      } else if (smURL.lastIndexOf('/') !== smURL.length - 1) {
        smURL += '/';
      }
    }
    url = (smURL && smURL.lastIndexOf('/') !== - 1 ? smURL.substr(0, smURL.lastIndexOf('/') + 1) : './') + sm2.movieURL;
    if (sm2.noSWFCache) {
      url += ('?ts=' + new Date().getTime());
    }
    return url;
  };
  setVersionInfo = () => {
    fV = parseInt(sm2.flashVersion, 10);
    if (fV !== 8 && fV !== 9) {
      sm2.flashVersion = fV = defaultFlashVersion;
    }
    var isDebug = (sm2.debugMode || sm2.debugFlash?'_debug.swf':'.swf');
    if (sm2.useHTML5Audio && !sm2.html5Only && sm2.audioFormats.mp4.required && fV < 9) {
      sm2.flashVersion = fV = 9;
    }
    sm2.version = sm2.versionNumber + (sm2.html5Only?' (HTML5-only mode)':(fV === 9?' (AS3/Flash 9)':' (AS2/Flash 8)'));
    if (fV > 8) {
      sm2.defaultOptions = mixin(sm2.defaultOptions, sm2.flash9Options);
      sm2.features.buffering = true;
      sm2.defaultOptions = mixin(sm2.defaultOptions, sm2.movieStarOptions);
      sm2.filePatterns.flash9 = new RegExp('\\.(mp3|' + netStreamTypes.join('|') + ')(\\?.*)?$', 'i');
      sm2.features.movieStar = true;
    } else {
      sm2.features.movieStar = false;
    }
    sm2.filePattern = sm2.filePatterns[(fV !== 8?'flash9':'flash8')];
    sm2.movieURL = (fV === 8?'soundmanager2.swf':'soundmanager2_flash9.swf').replace('.swf', isDebug);
    sm2.features.peakData = sm2.features.waveformData = sm2.features.eqData = (fV > 8);
  };
  setPolling = (bPolling, bHighPerformance) => {
    if (!flash) {
      return false;
    }
    flash._setPolling(bPolling, bHighPerformance);
  };
  initDebug = () => {
    if (sm2.debugURLParam.test(wl)) {
      sm2.debugMode = true;
    }
  };
  idCheck = this.getSoundById;
  getSWFCSS = () => {
    var css = [];
    if (sm2.debugMode) {
      css.push(swfCSS.sm2Debug);
    }
    if (sm2.debugFlash) {
      css.push(swfCSS.flashDebug);
    }
    if (sm2.useHighPerformance) {
      css.push(swfCSS.highPerf);
    }
    return css.join(' ');
  };
  flashBlockHandler = () => {
    var name = str('fbHandler');
    var p = sm2.getMoviePercent();
    var css = swfCSS;
    var error = {type:'FLASHBLOCK'};
    if (sm2.html5Only) {
      return false;
    }
    if (!sm2.ok()) {
      if (needsFlash) {
        sm2.oMC.className = getSWFCSS() + ' ' + css.swfDefault + ' ' + (p === null?css.swfTimedout:css.swfError);
      }
      sm2.didFlashBlock = true;
      processOnEvents({type:'ontimeout', ignoreInit:true, error});
      catchError(error);
    } else {
      if (sm2.oMC) {
        sm2.oMC.className = [getSWFCSS(), css.swfDefault, css.swfLoaded + (sm2.didFlashBlock?' '+css.swfUnblocked:'')].join(' ');
      }
    }
  };
  addOnEvent = (sType, oMethod, oScope) => {
    if (on_queue[sType] === _undefined) {
      on_queue[sType] = [];
    }
    on_queue[sType].push({
      'method': oMethod,
      'scope': (oScope || null),
      'fired': false
    });
  };
  processOnEvents = function(oOptions) {
    if (!oOptions) {
      oOptions = {
        type: (sm2.ok() ? 'onready' : 'ontimeout')
      };
    }
    if (!didInit && oOptions && !oOptions.ignoreInit) {
      return false;
    }
    if (oOptions.type === 'ontimeout' && (sm2.ok() || (disabled && !oOptions.ignoreInit))) {
      return false;
    }

    var status = {
          success: (oOptions && oOptions.ignoreInit?sm2.ok():!disabled)
        };

    var srcQueue = (oOptions && oOptions.type?on_queue[oOptions.type]||[]:[]);
    var queue = [];
    var i;
    var j;
    var args = [status];
    var canRetry = (needsFlash && !sm2.ok());
    if (oOptions.error) {
      args[0].error = oOptions.error;
    }
    for (i = 0, j = srcQueue.length; i < j; i++) {
      if (srcQueue[i].fired !== true) {
        queue.push(srcQueue[i]);
      }
    }
    if (queue.length) {
      for (i = 0, j = queue.length; i < j; i++) {
        if (queue[i].scope) {
          queue[i].method.apply(queue[i].scope, args);
        } else {
          queue[i].method.apply(this, args);
        }
        if (!canRetry) {
          queue[i].fired = true;
        }
      }
    }
    return true;
  };
  initUserOnload = () => {
    window.setTimeout(() => {
      if (sm2.useFlashBlock) {
        flashBlockHandler();
      }
      processOnEvents();
      if (typeof sm2.onload === 'function') {
        sm2.onload.apply(window);
      }
      if (sm2.waitForWindowLoad) {
        event.add(window, 'load', initUserOnload);
      }
    },1);
  };
  detectFlash = () => {
    if (hasFlash !== _undefined) {
      return hasFlash;
    }
    var hasPlugin = false;
    var n = navigator;
    var nP = n.plugins;
    var obj;
    var type;
    var types;
    var AX = window.ActiveXObject;
    if (nP && nP.length) {
      type = 'application/x-shockwave-flash';
      types = n.mimeTypes;
      if (types && types[type] && types[type].enabledPlugin && types[type].enabledPlugin.description) {
        hasPlugin = true;
      }
    } else if (AX !== _undefined && !ua.match(/MSAppHost/i)) {
      try {
        obj = new AX('ShockwaveFlash.ShockwaveFlash');
      } catch(e) {
      }
      hasPlugin = (!!obj);
      obj = null;
    }
    hasFlash = hasPlugin;
    return hasPlugin;
  };
  featureCheck = () => {
    var needsFlash;
    var item;
    var result = true;
    var formats = sm2.audioFormats;
    var isSpecial = (is_iDevice && !!(ua.match(/os (1|2|3_0|3_1)/i)));
    if (isSpecial) {
      sm2.hasHTML5 = false;
      sm2.html5Only = true;
      if (sm2.oMC) {
        sm2.oMC.style.display = 'none';
      }
      result = false;
    } else {
      if (sm2.useHTML5Audio) {
        if (!sm2.html5 || !sm2.html5.canPlayType) {
          sm2.hasHTML5 = false;
        }
      }
    }
    if (sm2.useHTML5Audio && sm2.hasHTML5) {
      for (item in formats) {
        if (formats.hasOwnProperty(item)) {
          if ((formats[item].required && !sm2.html5.canPlayType(formats[item].type)) || (sm2.preferFlash && (sm2.flash[item] || sm2.flash[formats[item].type]))) {
            needsFlash = true;
          }
        }
      }
    }
    if (sm2.ignoreFlash) {
      needsFlash = false;
    }
    sm2.html5Only = (sm2.hasHTML5 && sm2.useHTML5Audio && !needsFlash);
    return (!sm2.html5Only);
  };
  parseURL = url => {
    var i;
    var j;
    var urlResult = 0;
    var result;
    if (url instanceof Array) {
      for (i=0, j=url.length; i<j; i++) {
        if (url[i] instanceof Object) {
          if (sm2.canPlayMIME(url[i].type)) {
            urlResult = i;
            break;
          }
        } else if (sm2.canPlayURL(url[i])) {
          urlResult = i;
          break;
        }
      }
      if (url[urlResult].url) {
        url[urlResult] = url[urlResult].url;
      }
      result = url[urlResult];
    } else {
      result = url;
    }
    return result;
  };
  startTimer = oSound => {
    if (!oSound._hasTimer) {
      oSound._hasTimer = true;
      if (!mobileHTML5 && sm2.html5PollingInterval) {
        if (h5IntervalTimer === null && h5TimerCount === 0) {
          h5IntervalTimer = window.setInterval(timerExecute, sm2.html5PollingInterval);
        }
        h5TimerCount++;
      }
    }
  };
  stopTimer = oSound => {
    if (oSound._hasTimer) {
      oSound._hasTimer = false;
      if (!mobileHTML5 && sm2.html5PollingInterval) {
        h5TimerCount--;
      }
    }
  };
  timerExecute = () => {
    var i;
    if (h5IntervalTimer !== null && !h5TimerCount) {
      window.clearInterval(h5IntervalTimer);
      h5IntervalTimer = null;
      return false;
    }
    for (i = sm2.soundIDs.length-1; i >= 0; i--) {
      if (sm2.sounds[sm2.soundIDs[i]].isHTML5 && sm2.sounds[sm2.soundIDs[i]]._hasTimer) {
        sm2.sounds[sm2.soundIDs[i]]._onTimer();
      }
    }
  };
  catchError = options => {
    options = (options !== _undefined ? options : {});
    if (typeof sm2.onerror === 'function') {
      sm2.onerror.apply(window, [{type:(options.type !== _undefined ? options.type : null)}]);
    }
    if (options.fatal !== _undefined && options.fatal) {
      sm2.disable();
    }
  };
  badSafariFix = () => {
    if (!isBadSafari || !detectFlash()) {
      return false;
    }
    var aF = sm2.audioFormats;
    var i;
    var item;
    for (item in aF) {
      if (aF.hasOwnProperty(item)) {
        if (item === 'mp3' || item === 'mp4') {
          sm2.html5[item] = false;
          if (aF[item] && aF[item].related) {
            for (i = aF[item].related.length-1; i >= 0; i--) {
              sm2.html5[aF[item].related[i]] = false;
            }
          }
        }
      }
    }
  };
  this._setSandboxType = sandboxType => {
  };
  this._externalInterfaceOK = (flashDate, swfVersion) => {
    if (sm2.swfLoaded) {
      return false;
    }
    var e;
    sm2.swfLoaded = true;
    tryInitOnFocus = false;
    if (isBadSafari) {
      badSafariFix();
    }
    setTimeout(init, isIE ? 100 : 1);
  };
  createMovie = (smID, smURL) => {
    if (didAppend && appendSuccess) {
      return false;
    }
    function initMsg() {
    }
    if (sm2.html5Only) {
      setVersionInfo();
      initMsg();
      sm2.oMC = id(sm2.movieID);
      init();
      didAppend = true;
      appendSuccess = true;
      return false;
    }
    var remoteURL = (smURL || sm2.url);
    var localURL = (sm2.altURL || remoteURL);
    var swfTitle = 'JS/Flash audio component (SoundManager 2)';
    var oTarget = getDocument();
    var extraClass = getSWFCSS();
    var isRTL = null;
    var html = doc.getElementsByTagName('html')[0];
    var oEmbed;
    var oMovie;
    var tmp;
    var movieHTML;
    var oEl;
    var s;
    var x;
    var sClass;
    isRTL = (html && html.dir && html.dir.match(/rtl/i));
    smID = (smID === _undefined?sm2.id:smID);
    function param(name, value) {
      return '<param name="'+name+'" value="'+value+'" />';
    }
    setVersionInfo();
    sm2.url = normalizeMovieURL(overHTTP?remoteURL:localURL);
    smURL = sm2.url;
    sm2.wmode = (!sm2.wmode && sm2.useHighPerformance ? 'transparent' : sm2.wmode);
    if (sm2.wmode !== null && (ua.match(/msie 8/i) || (!isIE && !sm2.useHighPerformance)) && navigator.platform.match(/win32|win64/i)) {
       messages.push(strings.spcWmode);
      sm2.wmode = null;
    }
    oEmbed = {
      'name': smID,
      'id': smID,
      'src': smURL,
      'quality': 'high',
      'allowScriptAccess': sm2.allowScriptAccess,
      'bgcolor': sm2.bgColor,
      'pluginspage': http+'www.macromedia.com/go/getflashplayer',
      'title': swfTitle,
      'type': 'application/x-shockwave-flash',
      'wmode': sm2.wmode,
      'hasPriority': 'true'
    };
    if (sm2.debugFlash) {
      oEmbed.FlashVars = 'debug=1';
    }
    if (!sm2.wmode) {
      delete oEmbed.wmode;
    }
    if (isIE) {
      oMovie = doc.createElement('div');
      movieHTML = [
        '<object id="' + smID + '" data="' + smURL + '" type="' + oEmbed.type + '" title="' + oEmbed.title +'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="' + http+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0">',
        param('movie', smURL),
        param('AllowScriptAccess', sm2.allowScriptAccess),
        param('quality', oEmbed.quality),
        (sm2.wmode? param('wmode', sm2.wmode): ''),
        param('bgcolor', sm2.bgColor),
        param('hasPriority', 'true'),
        (sm2.debugFlash ? param('FlashVars', oEmbed.FlashVars) : ''),
        '</object>'
      ].join('');
    } else {
      oMovie = doc.createElement('embed');
      for (tmp in oEmbed) {
        if (oEmbed.hasOwnProperty(tmp)) {
          oMovie.setAttribute(tmp, oEmbed[tmp]);
        }
      }
    }
    initDebug();
    extraClass = getSWFCSS();
    oTarget = getDocument();
    if (oTarget) {
      sm2.oMC = (id(sm2.movieID) || doc.createElement('div'));
      if (!sm2.oMC.id) {
        sm2.oMC.id = sm2.movieID;
        sm2.oMC.className = swfCSS.swfDefault + ' ' + extraClass;
        s = null;
        oEl = null;
        if (!sm2.useFlashBlock) {
          if (sm2.useHighPerformance) {
            s = {
              'position': 'fixed',
              'width': '8px',
              'height': '8px',
              'bottom': '0px',
              'left': '0px',
              'overflow': 'hidden'
            };
          } else {
            s = {
              'position': 'absolute',
              'width': '6px',
              'height': '6px',
              'top': '-9999px',
              'left': '-9999px'
            };
            if (isRTL) {
              s.left = Math.abs(parseInt(s.left,10))+'px';
            }
          }
        }
        if (isWebkit) {
          sm2.oMC.style.zIndex = 10000;
        }
        if (!sm2.debugFlash) {
          for (x in s) {
            if (s.hasOwnProperty(x)) {
              sm2.oMC.style[x] = s[x];
            }
          }
        }
        try {
          if (!isIE) {
            sm2.oMC.appendChild(oMovie);
          }
          oTarget.appendChild(sm2.oMC);
          if (isIE) {
            oEl = sm2.oMC.appendChild(doc.createElement('div'));
            oEl.className = swfCSS.swfBox;
            oEl.innerHTML = movieHTML;
          }
          appendSuccess = true;
        } catch(e) {
          throw new Error(str('domError')+' \n'+e.toString());
        }
      } else {
        sClass = sm2.oMC.className;
        sm2.oMC.className = (sClass?sClass+' ':swfCSS.swfDefault) + (extraClass?' '+extraClass:'');
        sm2.oMC.appendChild(oMovie);
        if (isIE) {
          oEl = sm2.oMC.appendChild(doc.createElement('div'));
          oEl.className = swfCSS.swfBox;
          oEl.innerHTML = movieHTML;
        }
        appendSuccess = true;
      }
    }
    didAppend = true;
    initMsg();
    return true;
  };
  initMovie = () => {
    if (sm2.html5Only) {
      createMovie();
      return false;
    }
    if (flash) {
      return false;
    }
    if (!sm2.url) {
       return false;
    }
    flash = sm2.getMovie(sm2.id);
    if (!flash) {
      if (!oRemoved) {
        createMovie(sm2.id, sm2.url);
      } else {
        if (!isIE) {
          sm2.oMC.appendChild(oRemoved);
        } else {
          sm2.oMC.innerHTML = oRemovedHTML;
        }
        oRemoved = null;
        didAppend = true;
      }
      flash = sm2.getMovie(sm2.id);
    }
    if (typeof sm2.oninitmovie === 'function') {
      setTimeout(sm2.oninitmovie, 1);
    }
    return true;
  };
  delayWaitForEI = () => {
    setTimeout(waitForEI, 1000);
  };
  waitForEI = () => {
    var p;
    var loadIncomplete = false;
    if (!sm2.url) {
      return false;
    }
    if (waitingForEI) {
      return false;
    }
    waitingForEI = true;
    event.remove(window, 'load', delayWaitForEI);
    if (tryInitOnFocus && !isFocused) {
      return false;
    }
    if (!didInit) {
      p = sm2.getMoviePercent();
      if (p > 0 && p < 100) {
        loadIncomplete = true;
      }
    }
    setTimeout(() => {
      p = sm2.getMoviePercent();
      if (loadIncomplete) {
        waitingForEI = false;
        window.setTimeout(delayWaitForEI, 1);
        return false;
      }
      if (!didInit && okToDisable) {
        if (p === null) {
          if (sm2.useFlashBlock || sm2.flashLoadTimeout === 0) {
            if (sm2.useFlashBlock) {
              flashBlockHandler();
            }
          } else {
            processOnEvents({type:'ontimeout', ignoreInit: true});
          }
        } else {
          if (sm2.flashLoadTimeout === 0) {
          } else {
            failSafely(true);
          }
        }
      }
    }, sm2.flashLoadTimeout);
  };
  handleFocus = () => {
    function cleanup() {
      event.remove(window, 'focus', handleFocus);
    }
    if (isFocused || !tryInitOnFocus) {
      cleanup();
      return true;
    }
    okToDisable = true;
    isFocused = true;
    waitingForEI = false;
    delayWaitForEI();
    cleanup();
    return true;
  };
  flushMessages = () => {
  };
  showSupport = () => {
  };
  initComplete = bNoDisable => {
    if (didInit) {
      return false;
    }
    if (sm2.html5Only) {
      didInit = true;
      initUserOnload();
      return true;
    }
    var wasTimeout = (sm2.useFlashBlock && sm2.flashLoadTimeout && !sm2.getMoviePercent());
    var result = true;
    var error;
    if (!wasTimeout) {
      didInit = true;
      if (disabled) {
        error = {type: (!hasFlash && needsFlash ? 'NO_FLASH' : 'INIT_TIMEOUT')};
      }
    }
    if (disabled || bNoDisable) {
      if (sm2.useFlashBlock && sm2.oMC) {
        sm2.oMC.className = getSWFCSS() + ' ' + (sm2.getMoviePercent() === null?swfCSS.swfTimedout:swfCSS.swfError);
      }
      processOnEvents({type:'ontimeout', error, ignoreInit: true});
      catchError(error);
      result = false;
    } else {
    }
    if (!disabled) {
      if (sm2.waitForWindowLoad && !windowLoaded) {
        event.add(window, 'load', initUserOnload);
      } else {
        initUserOnload();
      }
    }
    return result;
  };
  setProperties = () => {
    var i;
    var o = sm2.setupOptions;
    for (i in o) {
      if (o.hasOwnProperty(i)) {
        if (sm2[i] === _undefined) {
          sm2[i] = o[i];
        } else if (sm2[i] !== o[i]) {
          sm2.setupOptions[i] = sm2[i];
        }
      }
    }
  };
  init = () => {
    if (didInit) {
      return false;
    }
    function cleanup() {
      event.remove(window, 'load', sm2.beginDelayedInit);
    }
    if (sm2.html5Only) {
      if (!didInit) {
        cleanup();
        sm2.enabled = true;
        initComplete();
      }
      return true;
    }
    initMovie();
    try {
      flash._externalInterfaceTest(false);
      setPolling(true, (sm2.flashPollingInterval || (sm2.useHighPerformance ? 10 : 50)));
      if (!sm2.debugMode) {
        flash._disableDebug();
      }
      sm2.enabled = true;
      if (!sm2.html5Only) {
        event.add(window, 'unload', doNothing);
      }
    } catch(e) {
      catchError({type:'JS_TO_FLASH_EXCEPTION', fatal:true});
      failSafely(true);
      initComplete();
      return false;
    }
    initComplete();
    cleanup();
    return true;
  };
  domContentLoaded = () => {
    if (didDCLoaded) {
      return false;
    }
    didDCLoaded = true;
    setProperties();
    initDebug();
    if (!hasFlash && sm2.hasHTML5) {
      sm2.setup({
        'useHTML5Audio': true,
        'preferFlash': false
      });
    }
    testHTML5();
    sm2.html5.usingFlash = featureCheck();
    needsFlash = sm2.html5.usingFlash;
    if (!hasFlash && needsFlash) {
      messages.push(strings.needFlash);
      sm2.setup({
        'flashLoadTimeout': 1
      });
    }
    if (doc.removeEventListener) {
      doc.removeEventListener('DOMContentLoaded', domContentLoaded, false);
    }
    initMovie();
    return true;
  };
  domContentLoadedIE = () => {
    if (doc.readyState === 'complete') {
      domContentLoaded();
      doc.detachEvent('onreadystatechange', domContentLoadedIE);
    }
    return true;
  };
  winOnLoad = () => {
    windowLoaded = true;
    event.remove(window, 'load', winOnLoad);
  };
  preInit = () => {
    if (mobileHTML5) {
      sm2.setupOptions.useHTML5Audio = true;
      sm2.setupOptions.preferFlash = false;
      if (is_iDevice || (isAndroid && !ua.match(/android\s2\.3/i))) {
        if (is_iDevice) {
          sm2.ignoreFlash = true;
        }
        useGlobalHTML5Audio = true;
      }
    }
  };
  preInit();
  detectFlash();
  event.add(window, 'focus', handleFocus);
  event.add(window, 'load', delayWaitForEI);
  event.add(window, 'load', winOnLoad);
  if (doc.addEventListener) {
    doc.addEventListener('DOMContentLoaded', domContentLoaded, false);
  } else if (doc.attachEvent) {
    doc.attachEvent('onreadystatechange', domContentLoadedIE);
  } else {
    catchError({type:'NO_DOM2_EVENTS', fatal:true});
  }
}
// SM2_DEFER details: http://www.schillmania.com/projects/soundmanager2/doc/getstarted/#lazy-loading
if (window.SM2_DEFER === undefined || !SM2_DEFER) {
  soundManager = new SoundManager();
}
window.SoundManager = SoundManager;
window.soundManager = soundManager;
})(window));