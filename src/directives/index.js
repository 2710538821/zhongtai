// 定义所有全局指令的配置对象

// 图片加载出错
export const imgagerror = {
  // 指令对象
  inserted(dom, options) {
    // dom实际上就是指令绑定的元素
    // option就是指令的详细参数对象，options.value就是=后面的参数
    // 除了加载失败，也有 src属性为空的时候，为空并不会触发error事件
    dom.src = dom.src || options.value // 初始化的时候，如果有值，则赋值，如果没值，则需要进行默认值赋值
    try {
      dom.onerror = function() {
        // 当元素加载图片失败的时候就让src指向 = 后面的变量
        dom.src = options.value
      }
    } catch (error) {
      console.log(error.message)
    }
  },
  // 每当组件视图更新之后都去执行一次
  componentUpdated(dom, options) {
    // 该钩子函数会在当前指令作用的组件更新数据完毕之后执行
    // inserted只会执行一次
    // 组件初始化，一旦更新就会再进入inserted函数，会进去componentUpdated
    dom.src = dom.src || options.value
  }
}
