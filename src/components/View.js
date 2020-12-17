export default class View {

    constructor(model) {
        this.steps = 0
        this.render(model, null)
    }

    render(model, subject) {

        const isDefaultRender = subject === null || subject == 'min' || subject == 'max' || subject == 'vertical' || subject == 'step'

        const onIntervalOrPrompt = (subject == 'interval' || subject == 'prompt') && model.interval == true

        const isCurrentValue = subject == 'currentValue' && model.interval !== true

        const isStartOrEndValue = (subject == 'startValue' || subject == 'endValue') && model.interval === true

        const offIntervalOrPrompt = (subject == 'interval' || subject == 'prompt') && model.interval == false

        const isScaleOfValues = subject == 'scaleOfValues'
        const isProgressBar = subject == 'progressBar'

        if (isDefaultRender) {
            this.defaultRender(model)
        } else if (isCurrentValue) {
            this.setStandart(model)
        } else if (isStartOrEndValue) {
            this.setInterval(model)
        } else if (onIntervalOrPrompt) {
            let fsdInner = model.target.querySelector('.fsd__inner')
            fsdInner = this.renderInterval(model, fsdInner)
            const fsd = model.target.querySelector('.fsd')
            fsd.classList.add('fsd-interval')
            fsd.querySelector('.fsd__inner').remove()
            fsd.prepend(fsdInner)
            this.setInterval(model)
        } else if (offIntervalOrPrompt) {
            let fsdInner = model.target.querySelector('.fsd__inner')
            fsdInner = this.renderStandart(model, fsdInner)
            const fsd = model.target.querySelector('.fsd')
            fsd.classList.remove('fsd-interval')
            fsd.querySelector('.fsd__inner')?.remove()
            fsd.prepend(fsdInner)
            this.setStandart(model)
        } else if (isScaleOfValues) {
            model.target.querySelector('.fsd__scale')?.remove()
            let fsd = model.target.querySelector('.fsd')
            fsd = this.renderScale(model, fsd)
            model.target.append(fsd)
            this.setScale(model)
        } else if (isProgressBar) {
            if (model.progressBar === true) {
                const progress = document.createElement('div')
                progress.classList.add('fsd__progress')
                const inner = model.target.querySelector('.fsd__inner')
                inner.append(progress)
                if (model.interval === true) {
                    this.setInterval(model)
                } else {
                    this.setStandart(model)
                }
            } else {
                model.target.querySelector('.fsd__progress').remove()
            }
        }

    }

    defaultRender(model) {
        let fsd
        let fsdInner
        const fsdRange = document.createElement('div')

        let mn = +model.min
        this.steps = 0

        while (mn < model.max) {
            this.steps++
            mn += model.step
        }

        fsd = document.createElement('div')
        fsd.classList.add('fsd')
        fsdInner = document.createElement('div')
        fsdInner.classList.add('fsd__inner')

        fsdRange.classList.add('fsd__range')
        fsdInner.append(fsdRange)

        if (model.vertical) {
            fsd.classList.add('fsd-vertical')
        }

        fsd = this.renderScale(model, fsd)

        if (model.interval === true) {
            fsdInner = this.renderInterval(model, fsdInner)
            fsd.classList.add('fsd-interval')
        } else {
            fsdInner = this.renderStandart(model, fsdInner)
        }

        fsd.prepend(fsdInner)
        model.target.innerHTML = ''
        model.target.append(fsd)

        this.setScale(model)
        if (model.interval === true) {
            this.setInterval(model)
        } else {
            this.setStandart(model)
        }
        this.setPrompt(model)
    }

    renderScale(model, fsd) {

        const scaleOfValues = document.createElement('div')
        scaleOfValues.classList.add('fsd__scale')

        const min = document.createElement('span')
        min.classList.add('fsd__min')
        min.innerHTML = '' + model.min
        scaleOfValues.append(min)

        const max = document.createElement('span')
        max.classList.add('fsd__max')
        max.innerHTML = '' + model.max
        scaleOfValues.append(max)

        fsd.append(scaleOfValues)

        return fsd

    }


    renderInterval(model, fsdInner) {
        let startIntervalWrapper = document.createElement('div')
        startIntervalWrapper.classList.add('fsd__start-wrapper', 'fsd__slider-wrapper')
        const startInterval = document.createElement('div')
        startIntervalWrapper.append(startInterval)
        startInterval.classList.add('fsd__start', 'fsd__slider')

        let endIntervalWrapper = document.createElement('div')
        endIntervalWrapper.classList.add('fsd__end-wrapper', 'fsd__slider-wrapper')
        const endInterval = document.createElement('div')
        endInterval.classList.add('fsd__end', 'fsd__slider')
        endIntervalWrapper.append(endInterval)

        if (model.target.querySelector('.fsd__inner')) {
            model.target.querySelector('.fsd__interval').remove()
            model.target.querySelectorAll('.fsd__slider-wrapper').forEach(elem => {
                elem.remove()
            })
            model.target.querySelectorAll('.fsd__prompt').forEach(elem => {
                elem.remove()
            })
            model.target.querySelector('.fsd__progress').remove()
        }

        let progressBar
        if (model.progressBar === true) {
            progressBar = document.createElement('div')
            progressBar.classList.add('fsd__progress')
            fsdInner.append(progressBar)
        }

        fsdInner.append(startIntervalWrapper, endIntervalWrapper)

        let generalPrompt
        if (model.prompt === true) {
            startIntervalWrapper = this.renderPropmt(startIntervalWrapper)
            endIntervalWrapper = this.renderPropmt(endIntervalWrapper)
            generalPrompt = document.createElement('div')
            generalPrompt.classList.add('fsd__prompt', 'fsd__prompt-general')
            generalPrompt.style.visibility = 'hidden'
            fsdInner.append(generalPrompt)
        }

        return fsdInner

    }


    renderStandart(model, fsdInner) {
        let sliderWrapper = document.createElement('div')
        sliderWrapper.classList.add('fsd__slider-wrapper')
        const slider = document.createElement('div')
        slider.classList.add('fsd__slider')
        sliderWrapper.append(slider)



        if (model.target.querySelector('.fsd__inner')) {
            model.target.querySelectorAll('.fsd__slider-wrapper').forEach(elem => {
                elem.remove()
            })
            model.target.querySelectorAll('.fsd__prompt').forEach(elem => {
                elem.remove()
            })
            model.target.querySelector('.fsd__progress')?.remove()
            model.target.querySelector('.fsd')?.classList.remove('fsd__interval')
        }

        if (model.prompt === true)
            sliderWrapper = this.renderPropmt(sliderWrapper)

        let progressBar
        if (model.progressBar === true) {
            progressBar = document.createElement('div')
            progressBar.classList.add('fsd__progress')
            fsdInner.append(progressBar)
        }

        fsdInner.append(sliderWrapper)

        return fsdInner
    }


    renderPropmt(sliderWrapper) {
        const prompt = document.createElement('div')
        prompt.classList.add('fsd__prompt')

        sliderWrapper.append(prompt)

        return sliderWrapper
    }

    setScale(model) {

        const range = model.target.querySelector('.fsd__range')
        const min = model.target.querySelector('.fsd__min')
        const max = model.target.querySelector('.fsd__max')

        if (model.vertical === true) {
            this.stepsWidth = range.offsetHeight / this.steps / range.offsetHeight * 100
        } else {
            this.stepsWidth = range.offsetWidth / this.steps / range.offsetWidth * 100
        }

        if (model.vertical === true) {
            min.style.top = 0 + '%'
            max.style.top = 100 - max.offsetHeight / range.offsetHeight * 100 + '%'
        } else {
            min.style.left = 0 + '%'
            max.style.left = 100 - max.offsetWidth / range.offsetWidth * 100 + '%'
        }

        if (model.scaleOfValues === true) {
            let curSpan = min
            for (let i = 1; i < this.steps; i++) {
                const span = document.createElement('span')
                span.innerHTML = model.min + i * model.step + ''
                max.before(span)
                let distance
                let condition
                let maxDistance
                if (model.vertical === true) {
                    distance = this.stepsWidth * i - span.offsetHeight / range.offsetHeight * 100 / 2
                    condition = distance - (parseFloat(curSpan.style.top) + curSpan.offsetHeight / range.offsetHeight * 100)
                    maxDistance = parseFloat(max.style.top) - (distance + span.offsetHeight / range.offsetHeight * 100)
                } else {
                    distance = this.stepsWidth * i - span.offsetWidth / range.offsetWidth * 100 / 2
                    condition = distance - (parseFloat(curSpan.style.left) + curSpan.offsetWidth / range.offsetWidth * 100)
                    maxDistance = parseFloat(max.style.left) - (distance + span.offsetWidth / range.offsetWidth * 100)
                }
                if (condition < 7 || maxDistance < 7) {
                    span.remove()
                } else {
                    if (model.vertical === true) {
                        span.style.top = distance + '%'
                    } else {
                        span.style.left = distance + '%'
                    }
                    curSpan = span
                }
            }
        }

        const scaleOfValues = model.target.querySelector('.fsd__scale')
        if (model.vertical === true) {
            scaleOfValues.style.minWidth = max.offsetWidth + 'px'
        } else {
            scaleOfValues.style.minHeight = max.offsetHeight + 'px'
        }

    }

    setInterval(model) {

        const range = model.target.querySelector('.fsd__range')
        const startIntervalWrapper = model.target.querySelector('.fsd__start-wrapper')
        const endIntervalWrapper = model.target.querySelector('.fsd__end-wrapper')

        let sliderSize
        if (model.vertical === true) {
            sliderSize = startIntervalWrapper.offsetHeight / range.offsetHeight * 100
        } else {
            sliderSize = startIntervalWrapper.offsetWidth / range.offsetWidth * 100
        }
        const rightEdge = 100 - sliderSize

        let start
        start = this.getStartPos(model, model.startValue)
        start -= sliderSize / 2
        if (start < 0) start = 0
        if (start > rightEdge) start = rightEdge

        let end
        end = this.getStartPos(model, model.endValue)
        end -= sliderSize / 2

        if (end < 0) end = 0
        if (end > rightEdge) end = rightEdge

        let progressBar
        if (model.progressBar === true) {
            progressBar = model.target.querySelector('.fsd__progress')
            if (model.vertical === true) {
                progressBar.style.height = end - start + '%'
                progressBar.style.top = start + sliderSize / 2 + '%'
            } else {
                progressBar.style.width = end - start + '%'
                progressBar.style.left = start + sliderSize / 2 + '%'
            }
        }

        if (model.vertical === true) {
            startIntervalWrapper.style.top = start + '%'
            endIntervalWrapper.style.top = end + '%'
        } else {
            startIntervalWrapper.style.left = start + '%'
            endIntervalWrapper.style.left = end + '%'
        }

        if (model.prompt === true) {
            this.setAndCheckGeneralPrompt(model)
        }

    }

    setStandart(model) {

        const range = model.target.querySelector('.fsd__range')
        const sliderWrapper = model.target.querySelector('.fsd__slider-wrapper')

        let sliderSize
        if (model.vertical === true) {
            sliderSize = sliderWrapper.offsetHeight / range.offsetHeight * 100
        } else {
            sliderSize = sliderWrapper.offsetWidth / range.offsetWidth * 100
        }

        let distance
        distance = this.getStartPos(model, model.currentValue)
        distance -= sliderSize / 2

        const rightEdge = 100 - sliderSize
        if (distance < 0) distance = 0
        if (distance > rightEdge) distance = rightEdge

        if (model.vertical === true) {
            sliderWrapper.style.top = distance + '%'
        } else {
            sliderWrapper.style.left = distance + '%'
        }

        let progressBar
        if (model.progressBar === true) {
            progressBar = model.target.querySelector('.fsd__progress')
            if (model.vertical === true) {
                progressBar.style.height = distance + sliderSize / 2 + '%'
            } else {
                progressBar.style.width = distance + sliderSize / 2 + '%'
            }
        }

        let prompt
        if (model.prompt === true) {
            prompt = model.target.querySelector('.fsd__prompt')
            prompt.innerHTML = model.currentValue + ''
        }

    }

    setPrompt(model) {
        if (model.prompt === true && model.vertical === true) {
            const fsd = model.target.querySelector('.fsd')
            const prompt = fsd.querySelector('.fsd__prompt')
            const max = fsd.querySelector('.fsd__max')
            const stylePrompt = getComputedStyle(prompt)
            fsd.style.paddingLeft = max.offsetWidth + parseInt(stylePrompt.paddingLeft) + parseInt(stylePrompt.paddingRight) + 10 + 'px'
        }
    }

    setAndCheckGeneralPrompt(model) {
        const range = model.target.querySelector('.fsd__range')
        const startWrapper = model.target.querySelector('.fsd__start-wrapper')
        const endWrapper = model.target.querySelector('.fsd__end-wrapper')
        const startPrompt = startWrapper.querySelector('.fsd__prompt')
        const endPrompt = endWrapper.querySelector('.fsd__prompt')
        const generalPrompt = model.target.querySelector('.fsd__prompt-general')
        let sliderSize
        if (model.vertical === true) {
            sliderSize = startWrapper.offsetHeight / range.offsetHeight * 100
        } else {
            sliderSize = startWrapper.offsetWidth / range.offsetWidth * 100
        }

        startPrompt.innerHTML = model.startValue + ''
        endPrompt.innerHTML = model.endValue + ''

        if (model.endValue == model.startValue) {
            generalPrompt.innerHTML = model.startValue + ''
        } else {
            generalPrompt.innerHTML = model.startValue + (model.vertical === true ? '<span>-</span>' : ' - ') + model.endValue
        }
        if (model.vertical === true) {
            generalPrompt.style.top = parseFloat(startWrapper.style.top) + (parseFloat(endWrapper.style.top) + sliderSize - parseFloat(startWrapper.style.top)) / 2 + '%'
        } else {
            generalPrompt.style.left = parseFloat(startWrapper.style.left) + (parseFloat(endWrapper.style.left) + sliderSize - parseFloat(startWrapper.style.left)) / 2 + '%'
        }

        let startDistance
        let endDistance
        if (model.vertical === true) {
            startDistance = startPrompt.getBoundingClientRect().top + startPrompt.offsetHeight
            endDistance = endPrompt.getBoundingClientRect().top
        } else {
            startDistance = startPrompt.getBoundingClientRect().left + startPrompt.offsetWidth
            endDistance = endPrompt.getBoundingClientRect().left
        }
        if (endDistance - startDistance <= 0) {
            startPrompt.style.visibility = 'hidden'
            endPrompt.style.visibility = 'hidden'
            generalPrompt.style.visibility = 'visible'
        } else {
            startPrompt.style.visibility = 'visible'
            endPrompt.style.visibility = 'visible'
            generalPrompt.style.visibility = 'hidden'
        }
    }

    getStartPos(model, value) {
        for (let i = 0; i <= this.steps; i++) {
            const num = model.min + i * model.step
            if (num == value) {
                return i * this.stepsWidth
            }
        }

        return 0
    }
}