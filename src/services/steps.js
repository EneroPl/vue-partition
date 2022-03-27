/**
 * Service, which is a storage for formatted changes when editing a section.
 * Properties are defined here that allow adjustments to be made to values,
 * as well as methods that provide the ability to adjust change values.
 * 
 * In addition to all this, a "stepChanged" property is defined here,
 * which is used to distribute changes at the specified "step"
 * property to the component.
*/

const SIDES_VARS = Object.freeze({
  LEFT: 'left',
  RIGHT: 'right'
});

export default class StepService {
  constructor({ step, wrapperWidth, totalValue }) {
    this.step = step;
    this.wrapperWidth = wrapperWidth;
    this.totalValue = totalValue;
    this.stepChanged = 0;
  }

  get availableStep() {
    return (this.wrapperWidth / this.totalValue) * this.step;
  }

  getAvailableValue(value) {
    return value - (value % this.availableStep);
  }

  getValueByAvailableStep(value, shiftState = null) {
    const correctValue = this.getAvailableValue(value);
  
    switch (true) {
      default:
      case !shiftState:
        return correctValue;
      case shiftState.movementSide === SIDES_VARS.LEFT:
        return correctValue - this.getAvailableValue(shiftState.value);
      case shiftState.movementSide === SIDES_VARS.RIGHT:
        return correctValue + this.getAvailableValue(shiftState.value);
    }
  }

  getValueByWidth(width) {
    return width / this.availableStep;
  }

  setStepChange(value, side) { 
    switch (true) {
      case side === SIDES_VARS.LEFT: {
        this.stepChanged -= value;

        if (this.stepChanged < 0) {
          this.stepChanged = 0;
        }

        break;
      };
      case side === SIDES_VARS.RIGHT: {
        this.stepChanged += value;

        if (this.stepChanged > this.totalValue) {
          this.stepChanged = this.totalValue;
        }

        break;
      };
      default:
        break;
    }
  }

  clearStepChange() {
    this.stepChanged = 0;
  }
}