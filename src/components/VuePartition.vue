<template>
  <div class="ui-partition">
    <div ref="ui-field" class="ui-partition__field">
      <div class="ui-partition__items">
        <div
          v-for="(item, index) in options"
          :key="index"
          :ref="`ui-item-${index}`"
          class="ui-partition__item"
          :style="{
            '--item-background': sourceStyles[index].background,
            'width': parseValueToWidth(item.value) + 'px',
          }"
        >
          <div
            v-if="item.editable"
            :ref="`ui-control-${index}`"
            class="ui-partition__control"
            :style="{
              '--control-background': sourceStyles[index].control.background,
              '--control-border': sourceStyles[index].control.border,
              '--arrow-size': sourceStyles[index].arrows.size,
              'z-index': lastControlIndex === index ? 2 : 1,
            }"
          >
            <template v-for="(arrow, arrowIndex) in ['prev', 'next']">
              <div
                :key="arrowIndex"
                :class="['ui-partition__arrow', `ui-partition__arrow--${arrow}`]"
                :style="{
                  '--arrow-background': sourceStyles[index].arrows[arrow].background,
                  '--arrow-border': sourceStyles[index].arrows[arrow].border,
                }"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StyleService from './../services/styles.js';
import StepService from './../services/steps.js';

export default {
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
      stepService: {},
    };
  },
  created() {
    this.sourceOptions = this.options;
    this.styleService = new StyleService(this.styles);
    this.sourceTotal = this.total;

    this.sourceOptions.forEach(item => {
      this.sourceStyles.push(
        this.styleService.initStyles(item?.styles || {})
      );

      if (!this.total) {
        this.sourceTotal += item?.value || 0;
      }
    });

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
    });

    this.stepService = new StepService({
      step: this.step || 1,
      wrapperWidth: this.fieldWidth,
      totalValue: this.sourceTotal
    });
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
      const availableShift = this.stepService.getValueByAvailableStep(Math.abs(shift));
      const shiftValue = this.stepService.getValueByWidth(availableShift);

      this.shiftState = {
        width: shift,
        value: shiftValue,
        movementSide: shift > 0 ? 'right' : 'left'
      };

      if (this.shiftState.value < this.step) {
        return false;
      }

      const isAccessMovement = this.isAccessedMovement(
        this.stepService.getValueByAvailableStep(ref.rect.width, this.shiftState)
      );

      if (isAccessMovement) {
        this.updateRefs();
      }
    },
    updateRefs() {
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
    isAccessedMovement() {
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
          return (minValue <= value && value < maxValue) || this.control.index + 1 === ref.index;
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
    parseValueToWidth(value) {
      return value * (this.fieldWidth / this.sourceTotal);
    },
  }
}
</script>

<style lang="scss">
  .ui-partition {
    box-sizing: content-box;
    max-width: 500px;
    width: 100%;
    height: 54px;

    &__field {
      width: 100%;
      height: 100%;
    }

    &__items {
      box-sizing: content-box;
      display: flex;
      width: 100%;
      height: 100%;
    }

    &__item {
      position: relative;
      height: 100%;
      background-color: var(--item-background);
      overflow: visible;

      &:first-child {
        border-radius: 5px 0 0 5px;
      }

      &:last-child {
        border-radius: 0 5px 5px 0;
      }
    }

    &__control {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: -15px;
      width: 30px;
      height: 100%;
      z-index: 1;

      &::before {
        position: absolute;
        content: '';
        top: -3px;
        left: calc(50% - 1.5px);
        width: 3px;
        height: calc(100% + 6px);
        background-color: var(--control-background);
        border: var(--control-border);
      }
    }

    &__arrow {
      $arrow-position: calc((var(--arrow-size) - var(--arrow-size) / 1.5) * -1);
      $arrow-offset: calc(var(--arrow-size) - (var(--arrow-size) / 3));

      position: absolute;
      top: calc(50% - (var(--arrow-size) / 2));
      width: var(--arrow-size);
      height: var(--arrow-size);
      overflow: hidden;

      &--prev,
      &--next {
        &::before {
          position: absolute;
          content: '';
          top: calc(50% - (var(--arrow-size) / 2));
          width: var(--arrow-size);
          height: var(--arrow-size);
          background-color: var(--arrow-background);
          border: var(--arrow-border);
          transform: rotate(45deg);
        }
      }

      &--prev {
        left: $arrow-position;

        &::before {
          left: $arrow-offset;
        }
      }

      &--next {
        right: $arrow-position;

        &::before {
          right: $arrow-offset;
        }
      }
    }
  }
</style>
