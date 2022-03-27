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
    borderColor: '#000000'
  },
  arrows: {
    size: 10,
    prev: {
      background: '#FFFFFF',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#000000'
    },
    next: {
      background: '#FFFFFF',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#000000'
    }
  }
};

export default class StyleService {
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
      console.warn('Style property is not type object');
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
          background: this.getExistProperty('arrows.prev.background', true),
          border: this.getBorderStyles('arrows.prev')
        },
        next: {
          background: this.getExistProperty('arrows.next.background', true),
          border: this.getBorderStyles('arrows.next')
        },
      }
    }
  }
  /**
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
  getExistProperty(target, selectGeneral = false) {
    const propsChain = target?.split('.') || target;
    const stylesCollection = [this.currentStyle, this.componentStyles, initialStyles];

    for (let i = 0; i < stylesCollection.length; i++) {
      let currentStyle = stylesCollection[i];
      let isExistValue = false;

      for (let j = 0; j < propsChain.length; j++) {
        let currentProp = propsChain[j];
        let currentValue = currentStyle[currentProp];

        if (!currentValue && selectGeneral) {
          const generalObject = stylesCollection[i][propsChain[0]] || false;
          
          if (generalObject && generalObject[propsChain[propsChain.length - 1]]) {
            currentStyle = generalObject[propsChain[propsChain.length - 1]];
            isExistValue = true;

            break;
          }
        }

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