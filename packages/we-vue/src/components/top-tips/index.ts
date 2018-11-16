import Vue, { PluginFunction } from 'vue'
import TopTipsComponent from './top-tips.vue'
import { isObj } from '../../utils'

type TopTipsOptions = {
  visible?: boolean,
  duration?: number
}

type TopTipsType = {
  defaultOptions: TopTipsOptions,
  currentOptions: TopTipsOptions,
  close: Function,
  setDefaultOptions: Function,
  allowMultiple: Function,
  resetDefaultOptions: Function,
  install: PluginFunction<any>,
  [key: string]: any,
}

const defaultOptions: TopTipsOptions = {
  visible: true,
  duration: 3000
}

let instance
let currentOptions = { ...defaultOptions }

const parseOptions: object = (message: any) => (isObj(message) ? message : { message })

const createInstance = () => {
  instance = new (Vue.extend(TopTipsComponent))({
    el: document.createElement('div')
  })

  instance.$on('update:visible', visible => {
    instance.visible = visible
  })

  document.body.appendChild(instance.$el)
}

const TopTips: TopTipsType = options => {
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

TopTips.install = () => {
  Vue.use(TopTipsComponent)
}

Vue.prototype.$toptips = TopTips

export default TopTips
