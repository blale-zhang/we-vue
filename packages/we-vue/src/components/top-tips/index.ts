import Vue from 'vue'
import TopTipsComponent from './top-tips.vue'
import { isObj } from '../../utils'

type TopTipsOptions = {
  message: string,
  visible?: boolean,
  duration?: number
}

type a = InstanceType<typeof TopTipsComponent>

interface TopTipsType extends a {
  defaultOptions: TopTipsOptions,
  currentOptions: TopTipsOptions,
  close: Function,
  setDefaultOptions: Function,
  resetDefaultOptions: Function,
  [key: string]: any
}

const defaultOptions: TopTipsOptions = {
  message: '',
  visible: true,
  duration: 3000
}

let instance: TopTipsType
let currentOptions: TopTipsOptions = { ...defaultOptions }

const parseOptions: (message: string | object) => object = message => (isObj(message) ? <object>message : { message })

const createInstance: () => void = () => {
  instance = new (Vue.extend(TopTipsComponent))({
    el: document.createElement('div')
  })

  instance.$on('update:visible', visible => {
    instance.visible = visible
  })

  document.body.appendChild(instance.$el)
}

const TopTips: (options: TopTipsOptions | string) => TopTipsType = options => {
  options = {
    ...currentOptions,
    ...parseOptions(options)
  }

  if (!instance) {
    createInstance()
  }

  Object.assign(instance, options)
  clearTimeout(instance.timer)

  Object.assign(instance, { ...options })

  if (options.duration > 0) {
    instance.timer = setTimeout(() => {
      instance.visible = false
    }, options.duration)
  }

  return instance
}

TopTips.close = () => {
  if (instance) {
    instance.visible = false
  }
}

TopTips.setDefaultOptions = options => {
  Object.assign(TopTips.currentOptions, options)
}

TopTips.resetDefaultOptions = () => {
  TopTips.currentOptions = { ...defaultOptions }
}

Vue.prototype.$toptips = TopTips

export default TopTips
