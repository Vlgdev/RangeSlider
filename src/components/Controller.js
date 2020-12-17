export default class Controller {

  constructor(model, view) {

    this.fsdInit(model, view) 

  }

  fsdSettings(model, view) {

    for (const key in model) {
      if (this.checkKeyForSettings(key)) continue 

      Object.defineProperty(model.target, key, {
        get: function () {

          if (key === 'currentValue') {
            if (model.interval === true) return null 
          } else if (key === 'startValue' || key === 'endValue') {
            if (model.interval !== true) return null 
          }

          return model[key] 
        },
        set: (value) => {
          this.fsdSetter(value, key, model, view)
        }
      })

    }

  }

  fsdSetter(value, key, model, view) {
    if (this.checkKeyForSetter(key)) {
      model[key] = +value 
    } else {
      model[key] = value 
    }

    if (key == 'currentValue') {
      model.checkCurVal() 
    } else if (key == 'startValue') {
      model.checkStartVal() 
    } else if (key == 'endValue') {
      model.checkEndVal() 
    } else if (key == 'min' || key == 'max') {
      model.checkMinMax() 
    }

    view.render(model, key) 
  }

  fsdProtection(model) {
    Object.defineProperty(model.target, 'model', {
      get: function () {
        return null 
      },
      set: function () {
        console.error('Свойство model не может быть изменено') 
        return false 
      }
    }) 
    Object.defineProperty(model.target, 'view', {
      get: function () {
        return null 
      },
      set: function () {
        console.error('Свойство view не может быть изменено') 
        return false 
      }
    }) 
    Object.defineProperty(model.target, 'controller', {
      get: function () {
        return null 
      },
      set: function () {
        console.error('Свойство controller не может быть изменено') 
        return false 
      }
    }) 
  }

  fsdInit(model, view) {

    model.target.addEventListener("mousedown", (event) => {
      this.fsdOn(model, view, event) 
    })
    model.target.addEventListener("touchstart", (event) => {
      this.fsdOn(model, view, event) 
    })

    model.target.addEventListener('click', (event) => {
      this.fsdInteractive(model, view, event) 
    })

    model.target.addEventListener("selectstart", (event) => {
      event.preventDefault() 
    })

    window.addEventListener("resize", () => {
      this.fsdResize(model, view) 
    })

    this.fsdSettings(model, view) 

    if (model.init) {
      model.init(model.target) 
    }
  }

  fsdOn(model, view, event) {

    const target = event.target 
    if (!target.closest('.fsd__slider')) return 
    
    let shift = 0
    const coordY = event.clientY ? event.clientY : event.touches[0].clientY
    const coordX = event.clientX ? event.clientX : event.touches[0].clientX
    if (model.vertical === true) {
      shift = coordY - target.getBoundingClientRect().top 
    } else {
      shift = coordX - target.getBoundingClientRect().left 
    }

    this.boundMove = this.fsdMove.bind(this, model, view, shift, target.closest('.fsd__slider-wrapper')) 
    this.boundOff = this.fsdOff.bind(this) 
    if(event instanceof TouchEvent) {
      this.boundDisableWindowTouchMove = this.disableWindowTouchMove.bind(this)
      document.addEventListener('touchmove', this.boundDisableWindowTouchMove, {passive: false})
    }
    document.addEventListener("mousemove", this.boundMove) 
    document.addEventListener("touchmove", this.boundMove) 
    document.addEventListener("mouseup", this.boundOff) 
    document.addEventListener("touchend", this.boundOff) 
    document.addEventListener("touchcancel", this.boundOff) 

  }

  fsdMove(model, view, shift, slider, event) {

    const range = model.target.querySelector(".fsd__range") 
    let sliderSize 
    if (model.vertical === true) {
      sliderSize = (slider.offsetHeight / range.offsetHeight) * 100 
    } else {
      sliderSize = (slider.offsetWidth / range.offsetWidth) * 100 
    }

    let distance 
    let coordY 
    let coordX  
    if (event instanceof TouchEvent) {
      coordY = event.touches[0].clientY
      coordX = event.touches[0].clientX
    } else {
      coordY = event.clientY 
      coordX = event.clientX 
    }

    if (model.vertical === true) {
      distance = ((coordY - shift - range.getBoundingClientRect().top) / range.offsetHeight) * 100 
    } else {
      distance = ((coordX - shift - range.getBoundingClientRect().left) / range.offsetWidth) * 100 
    }

    distance = this.setDistance(model, view, slider, distance, sliderSize)
    if (distance < 0) distance = 0 
    const rightEdge = 100 - sliderSize 
    if (distance > rightEdge) distance = rightEdge 

    if (model.vertical === true) {
      slider.style.top = distance + "%" 
    } else {
      slider.style.left = distance + "%" 
    }

    if (model.progressBar === true) {
      const progressBar = model.target.querySelector('.fsd__progress')
      const [progressSize, progressDistance] = this.setProgressBar(model, distance, slider, sliderSize)

      if (model.vertical === true) {
        progressBar.style.height = progressSize + '%'
      } else {
        progressBar.style.width = progressSize + '%'
      }

      if (model.interval === true) {
        if (model.vertical === true) {
          progressBar.style.top = progressDistance + '%'
        } else {
          progressBar.style.left = progressDistance + '%'
        }
      }
    }

    if (model.prompt === true && model.interval === true) {
      view.setAndCheckGeneralPrompt(model)
    }

    if (model.onMove) {
      model.onMove(slider, model.target) 
    }
  }

  fsdOff(event) {
    if (event instanceof TouchEvent) {
      document.removeEventListener('touchmove', this.boundDisableWindowTouchMove)
    }
    
    document.removeEventListener("mousemove", this.boundMove) 
    document.removeEventListener("touchmove", this.boundMove) 
    document.removeEventListener("mouseup", this.boundOff) 
    document.removeEventListener("touchend", this.boundOff) 
    document.removeEventListener("touchcancel", this.boundOff) 
  }

  disableWindowTouchMove(event) {
    event.preventDefault()
  }

  fsdInteractive(model, view, event) {

    const target = event.target 

    if (!(target.closest('.fsd__scale') || target.closest('.fsd__range') || target.closest('.fsd__interval') || target.closest('.fsd__progress'))) return 

    const range = model.target.querySelector(".fsd__range") 

    let sliderSize 
    {
      const slider = model.target.querySelector(".fsd__slider-wrapper") 
      if (model.vertical === true) {
        sliderSize = (slider.offsetHeight / range.offsetHeight) * 100 
      } else {
        sliderSize = (slider.offsetWidth / range.offsetWidth) * 100 
      }
    }

    const rightEdge = 100 - sliderSize 
    let distance 
    if (model.vertical === true) {
      distance = ((event.clientY - range.getBoundingClientRect().top) / range.offsetHeight) * 100 
    } else {
      distance = ((event.clientX - range.getBoundingClientRect().left) / range.offsetWidth) * 100 
    }

    const progressBar = model.target.querySelector('.fsd__progress') 

    if (model.interval == true) {

      const startSlider = model.target.querySelector('.fsd__start-wrapper') 
      const endSlider = model.target.querySelector('.fsd__end-wrapper') 

      let startPos 
      let endPos 
      if (model.vertical === true) {
        startPos = parseFloat(startSlider.style.top) 
        endPos = parseFloat(endSlider.style.top) 
      } else {
        startPos = parseFloat(startSlider.style.left) 
        endPos = parseFloat(endSlider.style.left) 
      }

      if (startPos < 0) startPos = 0 
      if (startPos > rightEdge) startPos = rightEdge 
      if (endPos < 0) endPos = 0 
      if (endPos > rightEdge) endPos = rightEdge 

      let typePosition
      if (distance <= endPos - (endPos - startPos) / 2) {
        typePosition = 'start'
      }
      else {
        typePosition = 'end'
      }

      if (typePosition == 'start') {
        distance = this.setDistance(model, view, startSlider, distance, sliderSize)
      } else if (typePosition == 'end') {
        distance = this.setDistance(model, view, endSlider, distance, sliderSize)
      }

      if (distance < 0) distance = 0 
      if (distance > rightEdge) distance = rightEdge 

      if (typePosition == 'start') {
        if (model.vertical === true) {
          startSlider.style.top = distance + '%'
        } else {
          startSlider.style.left = distance + '%'
        }
      } else {
        if (model.vertical === true) {
          endSlider.style.top = distance + '%'
        } else {
          endSlider.style.left = distance + '%'
        }
      }

      if (model.progressBar === true) {
        const progressBar = model.target.querySelector('.fsd__progress')
        const [progressSize, progressDistance] = this.setProgressBar(model, distance, typePosition == 'start' ? startSlider : endSlider, sliderSize)
        if (model.vertical === true) {
          progressBar.style.height = progressSize + '%'
          progressBar.style.top = progressDistance + '%'
        } else {
          progressBar.style.width = progressSize + '%'
          progressBar.style.left = progressDistance + '%'
        }
      }

      if (model.prompt === true) {
        view.setAndCheckGeneralPrompt(model) 
      }

      if (model.onMove) {
        if (typePosition == 'start') {
          model.onMove(startSlider, model.target)
        } else {
          model.onMove(endSlider, model.target)
        }
      }

    } else {
      const slider = model.target.querySelector(".fsd__slider-wrapper") 

      distance = this.setDistance(model, view, slider, distance, sliderSize)

      if (distance < 0) distance = 0 
      if (distance > rightEdge) distance = rightEdge 


      if (model.vertical === true) {
        slider.style.top = distance + "%" 
        progressBar.style.height = distance + sliderSize / 2 + '%' 
      } else {
        slider.style.left = distance + "%" 
        progressBar.style.width = distance + sliderSize / 2 + '%' 
      }

      if (model.onMove) {
        model.onMove(slider, model.target)
      }
    }

  }

  fsdResize(model, view) {
    if (model.vertical === true) return 

    const range = model.target.querySelector(".fsd__range") 

    if (model.interval === true) {
      const startSlider = model.target.querySelector('.fsd__start-wrapper') 
      const endSlider = model.target.querySelector('.fsd__end-wrapper') 
      const sliderWidth = startSlider.offsetWidth / range.offsetWidth * 100 
      const right = 100 - sliderWidth 

      let startPos = (model.startValue - model.min) / model.step * view.stepsWidth - sliderWidth / 2
      if (startPos < 0) startPos = 0 
      if (startPos > right) startPos = right 

      let endPos = (model.endValue - model.min) / model.step * view.stepsWidth - sliderWidth / 2
      if (endPos < 0) endPos = 0 
      if (endPos > right) endPos = right 

      startSlider.style.left = startPos + '%' 
      endSlider.style.left = endPos + '%' 
      if (model.progressBar === true) {
        const progressBar = model.target.querySelector('.fsd__progress') 
        progressBar.style.width = endPos - startPos + '%' 
        progressBar.style.left = startPos + sliderWidth / 2 + '%' 
      }

    } else {
      const slider = model.target.querySelector(".fsd__slider-wrapper") 

      const sliderWidth = (slider.offsetWidth / range.offsetWidth) * 100 
      let curPos = (model.currentValue - model.min) / model.step * view.stepsWidth - sliderWidth / 2
      if (curPos < 0) curPos = 0 
      const right = 100 - sliderWidth 
      if (curPos > right) curPos = right 
      slider.style.left = curPos + "%" 
      if (model.progressBar === true) {
        const progressBar = model.target.querySelector('.fsd__progress')
        progressBar.style.width = curPos + sliderWidth / 2 + '%' 
      }
    }

    const scale = model.target.querySelector('.fsd__scale') 
    const max = scale.querySelector('.fsd__max') 
    const min = scale.querySelector('.fsd__min') 

    min.style.left = 0 + '%' 
    max.style.left = 100 - max.offsetWidth / range.offsetWidth * 100 + '%' 

    const spans = scale.querySelectorAll('span')

    for (let i = 0;  i < spans.length - 1;  i++) {
      const distance = parseFloat(spans[i + 1].style.left) - (parseFloat(spans[i].style.left) + spans[i].offsetWidth / range.offsetWidth * 100) 

      if (distance < 7 || distance > 10) {

        scale.querySelectorAll('span').forEach(elem => {
          if (elem.classList.contains('fsd__min') || elem.classList.contains('fsd__max')) return 

          elem.remove() 
        })

        if (model.scaleOfValues === true) {
          let curSpan = min 
          for (let i = 1 ; i < view.steps;  i++) {
            const span = document.createElement('span') 
            span.innerHTML = model.min + i * model.step + '' 
            max.before(span) 
            const distance = view.stepsWidth * i - span.offsetWidth / range.offsetWidth * 100 / 2 
            const condition = distance - (parseFloat(curSpan.style.left) + curSpan.offsetWidth / range.offsetWidth * 100) 
            const maxDistance = parseFloat(max.style.left) - (distance + span.offsetWidth / range.offsetWidth * 100) 
            if (condition < 7 || maxDistance < 7) {
              span.remove()
            } else {
              span.style.left = distance + '%' 
              curSpan = span 
            }
          }
        }

        break 
      }
    }

  }

  getPos(view, distance) {

    let area = 0 
    let i 

    for (i = 0; i <= view.steps; i++) {
      area = view.stepsWidth * i 
      if (this.checkNewPos(distance, area, view)) {
        return { area, i } 
      }
    }

    if (distance > view.steps * view.stepsWidth) {
      return {
        area: view.steps * view.stepsWidth,
        i: view.steps
      } 
    }

    return {
      area: 0,
      i: 0
    } 

  }

  setDistance(model, view, slider, distance, sliderSize) {
    let maxPos 

    if (model.interval === true && slider.classList.contains('fsd__start-wrapper')) {
      const endWrap = model.target.querySelector('.fsd__end-wrapper')
      if (model.vertical === true)
        maxPos = parseFloat(endWrap.style.top) + sliderSize / 2 
      else
        maxPos = parseFloat(endWrap.style.left) + sliderSize / 2 

      const { area, i } = this.getPos(view, distance) 
      distance = area
      if (distance > maxPos) distance = maxPos 

      distance -= sliderSize / 2 

      model.startValue = model.min + i * model.step 
      model.checkStartVal() 

      if (model.prompt === true) {
        const prompt = slider.querySelector(".fsd__prompt")
        prompt.innerHTML = model.startValue + "" 
      }
    } else if (model.interval === true && slider.classList.contains('fsd__end-wrapper')) {
      const startWrap = model.target.querySelector('.fsd__start-wrapper')
      if (model.vertical === true)
        maxPos = parseFloat(startWrap.style.top) + sliderSize / 2 
      else
        maxPos = parseFloat(startWrap.style.left) + sliderSize / 2 

      const { area, i } = this.getPos(view, distance) 
      distance = area
      if (distance < maxPos) distance = maxPos 

      distance -= sliderSize / 2 
      model.endValue = model.min + i * model.step 
      model.checkEndVal() 

      if (model.prompt === true) {
        const prompt = slider.querySelector(".fsd__prompt")
        prompt.innerHTML = model.endValue + "" 
      }
    } else {
      const { area, i } = this.getPos(view, distance) 

      distance = area - sliderSize / 2 
      model.currentValue = model.min + i * model.step 
      model.checkCurVal() 

      if (model.prompt === true) {
        const prompt = slider.querySelector(".fsd__prompt")
         
        prompt.innerHTML = model.currentValue + "" 
      }
    }

    return distance
  }

  setProgressBar(model, distance, slider, sliderSize) {
    let progressSize
    if (model.interval === true) {
      let progressDistance

      if (slider.classList.contains('fsd__start-wrapper')) {
        const end = model.target.querySelector('.fsd__end-wrapper')

        if (model.vertical === true) {
          progressSize = parseFloat(end.style.top) - distance 
          progressDistance = distance + sliderSize / 2 
        } else {
          progressSize = parseFloat(end.style.left) - distance 
          progressDistance = distance + sliderSize / 2 
        }

      } else {
        const start = model.target.querySelector('.fsd__start-wrapper')

        if (model.vertical === true) {
          progressSize = distance - parseFloat(start.style.top) 
          progressDistance = parseFloat(start.style.top) + sliderSize / 2 
        } else {
          progressSize = distance - parseFloat(start.style.left) 
          progressDistance = parseFloat(start.style.left) + sliderSize / 2 
        }
      }
      if (progressSize < 0) progressSize = 0 

      return [progressSize, progressDistance]
    } else {
      if (model.vertical === true) {
        progressSize = distance + sliderSize / 2 
      } else {
        progressSize = distance + sliderSize / 2 
      }
      if (progressSize < 0) progressSize = 0 

      return [progressSize, null]
    }
  }

  checkKeyForSettings(key) {
    return key == 'target' || key == 'init' || key == 'onMove' 
  }

  checkKeyForSetter(key) {
    return key == 'currentValue' || key == 'startValue' || key == 'endValue' || key == 'min' || key == 'max' || key == 'step' 
  }

  checkNewPos(distance, area, view) {
    return ((distance <= area && distance >= area - view.stepsWidth / 2) || (distance >= area && distance <= area + view.stepsWidth / 2)) && !(distance > view.steps * view.stepsWidth) && !(distance < 0) 
  }

}


