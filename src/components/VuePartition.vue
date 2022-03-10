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
            '--item-background': currentStyles(item).background,
            'width': parseValueToWidth(item.value) + 'px',
          }"
        >
          <div
            v-if="item.editable"
            :ref="`ui-control-${index}`"
            class="ui-partition__control"
            :style="{
              '--control-background': currentStyles(item).control.background,
              '--control-border': currentStyles(item).control.border,
              '--arrow-size': currentStyles(item).arrows.size,
              'z-index': lastControlIndex === index ? 2 : 1,
            }"
          >
            <div
              class="ui-partition__arrow ui-partition__arrow--left"
              :style="{
                '--arrow-background': currentStyles(item, index).arrows.prev.background,
                '--arrow-border': currentStyles(item).arrows.prev.border,
              }"
            />
            <div
              class="ui-partition__arrow ui-partition__arrow--right"
              :style="{
                '--arrow-background': currentStyles(item, index).arrows.next.background,
                '--arrow-border': currentStyles(item).arrows.next.border,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'options',
    event: 'input'
  },
  props: {
    /*
      Массив объектов данных для отображения\редактирования.
      О свойствах объекта options читайте документацию по компоненту.
    */
    options: {
      type: Array,
      required: true,
    },
    /*
      Сумма всех объектов value
    */
    total: {
      type: Number,
      default: null,
    },
    /*
      Изменение по value при минимальном условии, что оно изменилось не менее
      чем на step. Step значение должно быть целым числом.
    */
    step: {
      type: Number,
      default: 1,
      validator(value) {
        return value % 1 === 0 && value >= 1;
      }
    },
    /*
      Блокирование всего компонента
    */
    disabled: {
      type: Boolean,
      default: false,
    },
    /*
      Глобальное v значение.
      Если в конкретном объекте не указан minValue, то значение будет браться
      отсюда.
    */
    minValue: {
      type: Number,
      default: 0,
      validator(value) {
        return value >= 0;
      }
    },
    /*
      Глобальное максимальное значение. Работает также.
    */
    maxValue: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      fieldWidth: null,
      isTracking: false,
      lastControlIndex: null,
      /*
        Объект элемента, который редактируется на данный момент:
        index: number - индекс объекта с options
        el: HTMLElement - ссылка на DOM-element редактируемого айтема
        rect: RectElement - разметка computed свойств для el
        data - исходный объект options[index]
      */
      control: {
        index: null,
        el: null,
        rect: {},
        data: {},
      },
      /*
        Стейт изменений при движении контроллера:
        width: number - единицы обновлённой ширины.
        value: number - единица обновлённого значения value относительно width
        movementSide: 'left' | 'right' - направление движения мыши в момент
        изменений.
      */
      shiftState: {
        width: null,
        value: null,
        movementSide: ''
      },
      sourceTotal: null,
    };
  },
  created() {
    this.sourceOptions = this.options;
    /*
      Создаём total на основе суммы всех value в объектах, если не передаётся
      total через пропс
    */
    this.sourceTotal = this.total || this.options.reduce((acc, item) => {
      acc += item.value || 0;
      return acc;
    }, 0);
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
    /*
      Корректировка step значения с преобразованием в width относительно
      ширины контейнера.
    */
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
      /*
        shift определяет направление движения мыши.
        Отрицательное значение - движение влево
        Положительное значение - движение вправо
      */
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
    /*
      Метод определения и изменения доступного элемента относительно shift
      и состояния контроллера.
    */
    updateRefs(stacked = false) {
      if (Math.abs(this.shiftState.width) === 0) return false;

      for (let i = this.control.index + 1; i < this.sourceOptions.length; i++) {
        const ref = this.getRefDetail(`ui-item-${i}`);

        if (!ref.isValid) {
          continue;
        }

        if (this.shiftState?.movementSide === 'right') {
          this.sourceOptions[this.control.index].value += this.shiftState.value;
          /*
            Если value смещения больше чем value объекта, то вычитаем разницу
            и перевызываем метод, в котором разница в value пройдёт ещё раз все
            проверки, чтобы, если у последующего элемента будет такое же
            true условие, то он не сломал ничего.
          */
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
            /*
              value смещения больше ширины предыдущего редактируемого объекта
              с учётом того, что мы уже не работаем с редактируемым объектом
              (control.data.value === 0), поэтому производим вычисления в
              соседних объектах
            */
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
            /*
              value смещений больше ширины редактируемого объекта.
              Вычисляем разницу и распределяем поровну между соседними объектами.
            */
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
    /*
      Аксессор доступа. Запрещяет выполнение движения мышки, если не соблюдены
      поставленные условия.
    */
    isAccessedMovement(width) {
      if (this.shiftState.value === 0 || !this.isTracking) return false;

      const {
        maxValue: maxControlValue = this.maxValue || null,
        minValue: minControlValue = this.minValue || 0,
        value: controlValue,
      } = this.control.data;

      const isExistController = this.control.data.value > minControlValue;
      /*
        Валидация на состояния editType
      */
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
    /*
      Получение более подробной информации о DOM-элементе:
      refKey: string - ключ-указатель на ref элемент
    */
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
    /*
      Получение доступного элемента относительно shift & стейта control.data
    */
    getAvailableNextRef(trackSide = '') {
      const defaultRefIndex = this.sourceOptions.findIndex(item => {
        return !!item?.focused;
      });

      const {
        minValue: minControlValue = this.minValue || 0
      } = this.control.data;

      /*
        Поиск фокусируемого объекта, который ещё должен соответствовать
        условиям доступности для редактирования.
      */
      if (defaultRefIndex >= 0) {
        const defaultRef = this.getRefDetail(`ui-item-${defaultRefIndex}`);

        if (defaultRef.isValid) {
          return defaultRef;
        }
      }
      /*
        Если фокусируемого объекта нет или он не соответствует условиям,
        то выполняем дефолтный алгоритм поиска доступных объектов.
      */
      switch (true) {
        // Правосторонний поиск доступных объектов
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
        // Левосторонний поиск доступных объектов при control.data.value <= 0;
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
    /*
      Метод валидации ref-элемента на соответствие кастомным условиям.
    */
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
    /*
      Вызываемый метод возвращает текущее состояние ui-field элемента:
      total: number - ширина элемента
      untracked: number - незарегестрированная ширина (пустое пространство)
    */
    fieldState() {
      let totalWidth = 0;
      let totalValue = 0;

      for (let i = 0; i < this.sourceOptions.length; i++) {
        const indexedRef = this.getRefDetail(`ui-item-${i}`);
        totalWidth += parseInt(indexedRef.el.style.width);
        totalValue += indexedRef.data.value;
      }

      return {
        total: totalWidth,
        untracked: this.getWidthByAvailableStep(this.fieldWidth - totalWidth),
        totalValue: this.parseWidthToValue(totalWidth),
      };
    },
    /*
      Работает при расфокусировки\завершении событии мышки.
      Снимает все привязки и возвращает массив с новыми value у объектов
    */
    closeTracking() {
      if (!this.isTracking) {
        return false;
      }

      const fieldRef = this.$refs['ui-field'];
      fieldRef.removeEventListener('pointermove', this.handleMovement);

      this.sourceOptions = this.sourceOptions.map(item => {
        const itemMinValue = item.minValue || this.minValue || 0;
        const itemMaxValue = item.maxValue || this.maxValue || null;

        switch (true) {
          case item.value < itemMinValue:
            item.value = itemMinValue;
            return item;
          case itemMaxValue && item.value > itemMaxValue:
            item.value = itemMaxValue;
            return item;
          default:
            return item;
        }
      });

      this.control = {};
      this.shiftState = {};
      this.isTracking = false;
    },
    /*
      Пересобираем options элемента, добавляя свойства по умолчанию к тем местам,
      которые не указаны.
    */
    currentStyles(item, index = null) {
      const options = item.settings;
      const { control = {}, arrows = {} } = item.settings;

      const styles = {
        background: options.background || 'transparent',
        control: {
          background: control?.background || '#FFFFFF',
          border: [
            `${control?.borderWidth || 1}px`,
            control?.borderStyle || 'solid',
            control?.borderColor || 'transparent',
          ].join(' '),
        },
        arrows: {
          size: `${arrows?.size || 10}px`,
          prev: {
            background: arrows?.prev?.background || arrows?.background || '#FFF',
            border: [
              `${arrows?.prev?.borderWidth || arrows?.borderWidth || 1}px`,
              arrows?.prev?.borderStyle || arrows?.borderStyle || 'solid',
              arrows?.prev?.borderColor || arrows?.borderColor || 'transparent'
            ].join(' '),
          },
          next: {
            background: arrows?.next?.background || arrows?.background || '#FFF',
            border: [
              `${arrows?.next?.borderWidth || arrows?.borderWidth || 1}px`,
              arrows?.next?.borderStyle || arrows?.borderStyle || 'solid',
              arrows?.next?.borderColor || arrows?.borderColor || 'transparent'
            ].join(' '),
          }
        },
      };

      return styles;
    },
    /*
      Метод вычисления доступной ширины элемента относительно availableStep.
      Возвращает ширину, соответствующую условиям availableStep.

      width: string - новая ширина
      shift: string - разница старой ширины и width

      Если не передаём 2 параметр, то просто форматируем width и возвращаем
      его корректное значение.
    */
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
    // Парсим value объекта в ширину относительно ширины контейнера
    parseValueToWidth(value) {
      return value * (this.fieldWidth / this.sourceTotal);
    },
    // Парсим ширишу элемента в value
    parseWidthToValue(width) {
      return width / this.availableStep;
    },
  }
}
</script>

<style lang="scss">
  .ui-partition {
    // Это свойство никогда не переопределять!
    box-sizing: content-box;
    //
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
      border: 1px solid;
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

      &--left {
        left: $arrow-position;

        &::before {
          position: absolute;
          content: '';
          top: calc(50% - (var(--arrow-size) / 2));
          left: $arrow-offset;
          width: var(--arrow-size);
          height: var(--arrow-size);
          background-color: var(--arrow-background);
          border: var(--arrow-border);
          transform: rotate(45deg);
        }
      }

      &--right {
        right: $arrow-position;

        &::before {
          position: absolute;
          content: '';
          top: calc(50% - (var(--arrow-size) / 2));
          right: $arrow-offset;
          width: var(--arrow-size);
          height: var(--arrow-size);
          background-color: var(--arrow-background);
          border: var(--arrow-border);
          transform: rotate(45deg);
        }
      }
    }
  }
</style>
