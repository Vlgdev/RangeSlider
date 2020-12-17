export default class Model {

  constructor(params) {
    const { target, min = 1, max = 10, currentValue = min, vertical = false, interval = false, step = 1, prompt = true, scaleOfValues = false, startValue = min, endValue = max, progressBar = true, init, onMove } = params 
    this.target = target 
    this.min = min 
    this.max = max 
    this.currentValue = currentValue 
    this.vertical = vertical 
    this.interval = interval 
    this.startValue = startValue 
    this.endValue = endValue 
    this.step = step 
    this.prompt = prompt 
    this.scaleOfValues = scaleOfValues 
    this.progressBar = progressBar 
    this.checkMinMax() 
    this.checkCurVal() 
    this.checkStartVal() 
    this.checkEndVal() 
    if (init) {
      this.init = init 
    }
    if (onMove) {
      this.onMove = onMove 
    }
  }

  checkMinMax() {

    if (this.min >= this.max) {
      this.min = this.max - this.step 
    }

    if (this.max - this.min < this.step) {
      this.step = this.max - this.min 
    }

  }

  checkCurVal() {
    if (this.currentValue < this.min) {
      this.currentValue = this.min 
    } else if (this.currentValue > this.max) {
      this.currentValue = this.max 
    }

    const value = this.checkValue(this.currentValue) 
    if (value !== false) {
      this.currentValue = value 
    }

  }
  checkStartVal() {
    if (this.startValue < this.min) {
      this.startValue = this.min 
    } else if (this.conditionForCheckStartVal()) {
      this.startValue = this.endValue 
    } else if (this.startValue > this.max) {
      this.startValue = this.max 
    }

    const value = this.checkValue(this.startValue) 
    if (value !== false) {
      this.startValue = value 
    }

  }

  conditionForCheckStartVal() {
    return this.startValue > this.endValue && this.endValue >= this.min && this.endValue <= this.max 
  }

  checkEndVal() {
    if (this.endValue > this.max) {
      this.endValue = this.max 
    } else if (this.endValue < this.startValue) {
      this.endValue = this.startValue 
    }

    const value = this.checkValue(this.endValue) 
    if (value !== false) {
      this.endValue = value 
    }

  }

  checkValue(value) {
    for (let i = this.min;  i < this.max;  i += this.step) {
      let nextValue = i + this.step 
      if (nextValue > this.max)
        nextValue = this.max
      if (value > i && value < nextValue) {
        return i 
      }
    }
    return false 
  }

}