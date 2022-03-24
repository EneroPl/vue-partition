/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 679:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ entry_lib)
});

;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
/* eslint-disable no-var */
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__(679)
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ const setPublicPath = (null);

;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@vue/cli-service/node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuePartition.vue?vue&type=template&id=e2cfe3ee&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"ui-partition"},[_c('div',{ref:"ui-field",staticClass:"ui-partition__field"},[_c('div',{staticClass:"ui-partition__items"},_vm._l((_vm.options),function(item,index){return _c('div',{key:index,ref:("ui-item-" + index),refInFor:true,staticClass:"ui-partition__item",style:({
          '--item-background': _vm.sourceStyles[index].background,
          'width': _vm.parseValueToWidth(item.value) + 'px',
        })},[(item.editable)?_c('div',{ref:("ui-control-" + index),refInFor:true,staticClass:"ui-partition__control",style:({
            '--control-background': _vm.sourceStyles[index].control.background,
            '--control-border': _vm.sourceStyles[index].control.border,
            '--arrow-size': _vm.sourceStyles[index].arrows.size,
            'z-index': _vm.lastControlIndex === index ? 2 : 1,
          })},[_vm._l((['prev', 'next']),function(arrow,arrowIndex){return [_c('div',{key:arrowIndex,class:['ui-partition__arrow', ("ui-partition__arrow--" + arrow)],style:({
                '--arrow-background': _vm.sourceStyles[index].arrows[arrow].background,
                '--arrow-border': _vm.sourceStyles[index].arrows[arrow].border,
              })})]})],2):_vm._e()])}),0)])])}
var staticRenderFns = []


;// CONCATENATED MODULE: ./src/components/VuePartition.vue?vue&type=template&id=e2cfe3ee&

;// CONCATENATED MODULE: ./services/styles.js
/**
 * StyleService using for construct each element of options styles
 * by 3 objects: element styles, global component styles & default (initialStyles).
*/
const initialStyles = {
  background: 'transparent',
  control: {
    background: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#FFFFFF'
  },
  arrows: {
    size: 10,
    prev: {
      background: '#FFFFFF',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#FFFFFF'
    },
    next: {
      background: '#FFFFFF',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#FFFFFF'
    }
  }
};

class StyleService {
  constructor (componentStyles) {
    this.componentStyles = componentStyles;
    this._currentStyle = {};
  }

  get currentStyle() {
    return this._currentStyle;
  }

  set currentStyle(value) {
    if (typeof value !== 'object') {
      this._currentStyle = {};
    }

    this._currentStyle = value;
  }

  initStyles(styles) {
    this.currentStyle = styles;

    return {
      background: this.getExistProperty('background'),
      control: {
        background: this.getExistProperty('control.background'),
        border: this.getBorderStyles('control')
      },
      arrows: {
        size: `${this.getExistProperty('arrows.size')}px`,
        prev: {
          background: this.getExistProperty('arrows.prev.background'),
          border: this.getBorderStyles('arrows.prev')
        },
        next: {
          background: this.getExistProperty('arrows.next.background'),
          border: this.getBorderStyles('arrows.next')
        },
      }
    }
  }
  /**
   * TODO: Add generals arrows\control find border props.
   * 
   * This method find nested value of properties chaining in 3 objects
   * and return first founded trusty value.
   * 
   * Example: control.background => ['control', 'background'] will find:
   * 
   * 1. Find "control" prop in each style objects
   * 2. Find "background" props in style.control
   * 
   * If prop not founded it's return for next object to initialStyles.
  */
  getExistProperty(target) {
    const propsChain = target?.split('.') || target;
    const stylesCollection = [this.currentStyle, this.componentStyles, initialStyles];

    for (let i = 0; i < stylesCollection.length; i++) {
      let currentStyle = stylesCollection[i];
      let isExistValue = false;

      for (let j = 0; j < propsChain.length; j++) {
        const currentProp = propsChain[j];
        const currentValue = currentStyle[currentProp];

        if (!currentValue) {
          break;
        }

        if (currentValue) {
          currentStyle = currentValue;
        
          if (j === propsChain.length - 1) {
            isExistValue = true;
            break;
          }
        }
      }

      if (isExistValue) {
        return currentStyle;
      }
    }
  }

  getBorderStyles(target) {
    return [
      `${this.getExistProperty(`${target}.borderWidth`)}px`,
      this.getExistProperty(`${target}.borderStyle`),
      this.getExistProperty(`${target}.borderColor`),
    ].join(' ');
  }
}
;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuePartition.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ const VuePartitionvue_type_script_lang_js_ = ({
  model: {
    prop: 'options',
    event: 'input'
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      default: null,
    },
    step: {
      type: Number,
      default: 1,
      validator(value) {
        return value % 1 === 0 && value >= 1;
      }
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    minValue: {
      type: Number,
      default: 0,
      validator(value) {
        return value >= 0;
      }
    },
    maxValue: {
      type: Number,
      default: null,
    },
    styles: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      fieldWidth: null,
      isTracking: false,
      lastControlIndex: null,
      control: {
        index: null,
        el: null,
        rect: {},
        data: {},
      },
      shiftState: {
        width: null,
        value: null,
        movementSide: ''
      },
      sourceTotal: null,
      sourceStyles: [],
      styleService: {},
    };
  },
  created() {
    this.sourceOptions = this.options;
    this.sourceTotal = this.total || this.sourceOptions.reduce((acc, item) => {
      acc += item;
      return acc;
    }, 0);

    this.styleService = new StyleService(this.styles);

    this.sourceOptions.forEach(item => {
      this.sourceStyles.push(
        this.styleService.initStyles(item?.styles || {})
      );
    })
  },
  mounted() {
    this.fieldWidth = this.$refs['ui-field'].getBoundingClientRect().width;

    this.sourceOptions.forEach((item, index) => {
      if (item.editable) {
        const controlRef = this.getRefDetail(`ui-control-${index}`);

        controlRef.el.addEventListener('pointerdown', (e) => {
          this.handleClick(e, index);
        })
      }
    })
  },
  beforeDestroy() {
    this.closeTracking();
  },
  computed: {
    sourceOptions: {
      get () {
        return this.options;
      },

      set(newOptions) {
        this.$emit('input', newOptions);
      }
    },
    availableStep() {
      return (this.fieldWidth / this.sourceTotal) * this.step;
    },
  },
  methods: {
    handleClick(event, index) {
      if (this.disabled || this.isTracking) {
        return false;
      }

      this.isTracking = true;
      this.lastControlIndex = index;

      this.control = this.getRefDetail(`ui-item-${index}`);
      const fieldRef = this.$refs['ui-field'];

      fieldRef.addEventListener('pointermove', this.handleMovement);
      fieldRef.addEventListener('pointerup', this.closeTracking);
      fieldRef.addEventListener('pointerleave', this.closeTracking);
    },
    handleMovement({ pageX }) {
      const ref = this.getRefDetail(`ui-item-${this.control.index}`);

      if (!!ref.data.disabled) {
        return false;
      }

      const shift = pageX - (ref.rect.left + ref.rect.width);
      const shiftValue = this.parseWidthToValue(
        this.getWidthByAvailableStep(Math.abs(shift))
      );

      this.shiftState = {
        width: shift,
        value: shiftValue,
        movementSide: shift > 0 ? 'right' : 'left'
      };

      const isAccessMovement = this.isAccessedMovement(
        this.getWidthByAvailableStep(ref.rect.width, this.shiftState.width)
      );

      if (isAccessMovement) {
        this.updateRefs();
      }
    },
    updateRefs(stacked = false) {
      if (Math.abs(this.shiftState.width) === 0) return false;

      for (let i = this.control.index + 1; i < this.sourceOptions.length; i++) {
        const ref = this.getRefDetail(`ui-item-${i}`);

        if (!ref.isValid) {
          continue;
        }

        if (this.shiftState?.movementSide === 'right') {
          this.sourceOptions[this.control.index].value += this.shiftState.value;
          
          if (ref.data.value - this.shiftState.value <= 0) {
            const untracked = this.shiftState.value - ref.data.value;
            this.sourceOptions[this.control.index].value -= untracked;

            this.shiftState = {
              ...this.shiftState,
              width: this.parseValueToWidth(untracked),
              value: untracked
            };

            this.sourceOptions[i].value = 0;
            return false;
          }

          this.sourceOptions[i].value -= this.shiftState.value;
        }

        if (this.shiftState?.movementSide === 'left') {
          const prevRef = this.getAvailableNextRef('left');

          const {
            minValue: minControlValue = this.minValue || 0,
            maxValue: maxControlValue = this.maxValue || 0,
            value: controlValue,
          } = this.control.data;

          if (!prevRef && controlValue <= minControlValue) {
            return false;
          }

          const {
            minValue: minPrevValue = this.minValue || 0,
            maxValue: maxPrevValue = this.maxValue || null,
            value: prevValue,
          } = prevRef.data || {};

          switch (true) {
            case (
              prevRef && prevRef.index === 0 && prevValue - this.shiftState.value <= 0
              && controlValue <= minControlValue
            ): {
              this.sourceOptions[prevRef.index].value = minPrevValue;

              break;
            };
            case (
              prevRef && prevRef.data.value - this.shiftState.value <= minPrevValue
              && controlValue <= minControlValue
            ): {
              const correctPrevValue = prevValue - minPrevValue;
              const untracked = this.shiftState.value - correctPrevValue;

              if (prevRef.index === 0) {
                this.sourceOptions[prevRef.index].value = minPrevValue;
                this.sourceOptions[i].value += correctPrevValue;

                break;
              }

              this.sourceOptions[prevRef.index - 1].value -= untracked;
              this.sourceOptions[i].value += (untracked + correctPrevValue);
              this.sourceOptions[prevRef.index].value = minPrevValue;

              break;
            };
            case prevRef && controlValue - this.shiftState.value <= minControlValue: {
              const correctControlValue = controlValue - minControlValue;
              const untracked = this.shiftState.value - correctControlValue;

              if (this.control.data.editType === 'local') {
                this.sourceOptions[i].value += correctControlValue;
                this.sourceOptions[this.control.index].value = minControlValue;

                break;
              }

              this.sourceOptions[prevRef.index].value -= untracked;
              this.sourceOptions[i].value += (untracked + correctControlValue);
              this.sourceOptions[this.control.index].value = minControlValue;

              break;
            };
            default: {
              if (!prevRef && this.control.data.value - this.shiftState.value <= minControlValue) {
                const untracked = this.shiftState.value - this.control.data.value;

                this.sourceOptions[this.control.index].value = minControlValue;
                this.sourceOptions[i].value += (controlValue - minControlValue);
                break;
              }

              this.sourceOptions[this.control.index].value -= this.shiftState.value;
              this.sourceOptions[i].value += this.shiftState.value;

              break;
            }
          }
        }

        this.shiftState = {
          width: null,
          value: null,
          movementSide: ''
        };
      }
    },
    isAccessedMovement(width) {
      if (this.shiftState.value === 0 || !this.isTracking) return false;

      const {
        maxValue: maxControlValue = this.maxValue || null,
        minValue: minControlValue = this.minValue || 0,
        value: controlValue,
      } = this.control.data;

      const isExistController = this.control.data.value > minControlValue;
      
      switch (true) {
        case this.shiftState.movementSide === 'left' && !isExistController: {
          if (this.control.data.editType === 'local') {
            return false;
          }

          const prevRef = this.getAvailableNextRef('left');
          const prevRefs = this.sourceOptions.slice(0, this.control.index);

          switch (true) {
            case this.control.data.value <= 0 && !prevRef:
              return false;
            default:
              return this.control.data.value > 0 || prevRefs.some(item => item.value > 0);
          }
        };
        case this.shiftState.movementSide === 'right': {
          const nextRef = this.getAvailableNextRef();
          const {
            value,
            minValue = this.minValue || 0
          } = nextRef.data;

          if (this.control.data.editType === 'local' && nextRef.index !== this.control.index + 1) {
            return false;
          }

          const isValidControl = minControlValue <= this.control.data.value;
          const isValid = !!nextRef && nextRef.data.value > nextRef.data.minValue || isValidControl;

          return maxControlValue ? controlValue < maxControlValue && isValid : isValid;
        };
        default: {
          const nextRef = this.getAvailableNextRef('right');

          if (!nextRef) {
            return false;
          }

          return !nextRef.disabled && nextRef.isValid;
        }
      }

      return false;
    },
    getRefDetail(refKey) {
      const foundedRef = this.$refs[refKey][0] || this.$refs[refKey];
      const optionIndex = Number.parseInt(refKey.split('-')[2], 10)

      let refState = {
        index: optionIndex,
        el: foundedRef,
        rect: {
          width: foundedRef.getBoundingClientRect().width,
          left: foundedRef.getBoundingClientRect().left
        },
        data: this.sourceOptions[optionIndex],
      }

      refState.isValid = this.isValidRef(refState);

      return refState;
    },
    getAvailableNextRef(trackSide = '') {
      const defaultRefIndex = this.sourceOptions.findIndex(item => {
        return !!item?.focused;
      });

      const {
        minValue: minControlValue = this.minValue || 0
      } = this.control.data;

      if (defaultRefIndex >= 0) {
        const defaultRef = this.getRefDetail(`ui-item-${defaultRefIndex}`);

        if (defaultRef.isValid) {
          return defaultRef;
        }
      }
      
      switch (true) {
        case trackSide === 'right':
        case this.shiftState.movementSide === 'right': {
          for (let i = this.control.index + 1; i < this.sourceOptions.length - 1; i++) {
            const indexedRef = this.getRefDetail(`ui-item-${i}`);

            if (indexedRef.isValid) {
              return indexedRef;
            }
          }

          break;
        };
        case trackSide === 'left':
        case this.shiftState.movementSide === 'left' && this.control.data.value <= minControlValue: {
          for (let i = this.control.index - 1; i >= 0; i--) {
            const indexedRef = this.getRefDetail(`ui-item-${i}`);
            const minValue = indexedRef.data.minValue || this.minValue || 0;

            if (indexedRef.isValid && indexedRef.data.value > minValue) {
              return indexedRef;
            }
          }

          break;
        };
        case this.shiftState.movementSide === 'left': {
          for (let i = this.control.index + 1; i <= this.sourceOptions.length - 1; i++) {
            const indexedRef = this.getRefDetail(`ui-item-${i}`);
            const minValue = indexedRef.data.minValue || this.minValue || 0;

            if (indexedRef.isValid && indexedRef.data.value > minValue) {
              return indexedRef;
            }
          }

          break;
        };
        default:
          break;
      }

      return false;
    },
    isValidRef(ref) {
      const {
        disabled = false,
        value,
        minValue = this.minValue || 0,
        maxValue = this.maxValue || this.sourceTotal
      } = ref.data;

      switch (true) {
        case disabled:
          return false;
        case this.shiftState.movementSide === 'right':
          return minValue < value;
        case this.shiftState.movementSide === 'left':
          return minValue <= value && value < maxValue;
        default:
          return false;
      }
    },
    closeTracking() {
      if (!this.isTracking) {
        return false;
      }

      const fieldRef = this.$refs['ui-field'];
      fieldRef.removeEventListener('pointermove', this.handleMovement);

      this.control = {};
      this.shiftState = {};
      this.isTracking = false;
    },
    getWidthByAvailableStep(width, shift = 0) {
      const correctedWidth = width - (width % this.availableStep);
      const correctedShift = Math.abs(shift) - (Math.abs(shift) % this.availableStep);

      switch (true) {
        case shift === 0:
          return correctedWidth;
        case this.shiftState.movementSide === 'right':
          return correctedWidth + correctedShift;
        case this.shiftState.movementSide === 'left':
          return correctedWidth - correctedShift;
        default:
          return correctedWidth;
      }
    },
    parseValueToWidth(value) {
      return value * (this.fieldWidth / this.sourceTotal);
    },
    parseWidthToValue(width) {
      return width / this.availableStep;
    },
  }
});

;// CONCATENATED MODULE: ./src/components/VuePartition.vue?vue&type=script&lang=js&
 /* harmony default export */ const components_VuePartitionvue_type_script_lang_js_ = (VuePartitionvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22[0].rules[0].use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22[0].rules[0].use[1]!./node_modules/@vue/cli-service/node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22[0].rules[0].use[3]!./node_modules/@vue/cli-service/node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuePartition.vue?vue&type=style&index=0&lang=scss&
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/VuePartition.vue?vue&type=style&index=0&lang=scss&

;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

;// CONCATENATED MODULE: ./src/components/VuePartition.vue



;


/* normalize component */

var component = normalizeComponent(
  components_VuePartitionvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ const VuePartition = (component.exports);
;// CONCATENATED MODULE: ./src/index.js


const install = (Vue) => {
	Vue.component('VuePartition', VuePartition);
};

/* harmony default export */ const src_0 = (install);
;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ const entry_lib = (src_0);


})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=VuePartition.common.js.map