[TOC]

# Vue 使用

1. Vue 父子组件通信
2. slot
3. 双向数据流
4. 



# Vue 底层


1. 响应式原理
   vue是通过数据劫持和订阅发布来进行深入响应的。

   - 数据劫持（双向数据绑定）：通过 Object.defineProperty 的 getter/setter 监听数据的变化，同时getter也用于依赖收集，而setter在数据变更时通知订阅者更新视图
   - 发布订阅模式：通过之定义自定义事件将data的变化反映到视图上去，vue通过observer观察者对象反应数据的变化，然后通知vue生成新的Virtual DOM ，进而渲染视图

2. 观察者模式 （Observer） 通过递归的方式把一个对象的所有属性都转化成可观测对象
   https://www.freesion.com/article/2571574110/
   https://blog.csdn.net/xiaozidewawa/article/details/108381583
   https://zhuanlan.zhihu.com/p/51357583
   https://www.jianshu.com/p/594f018b68e7
   https://www.cnblogs.com/fundebug/p/responsive-vue.html
   https://www.cnblogs.com/liaohuihui/p/11269052.html

   ```javascript
   
   ```
   
   
   
3. Vue3 如何实现响应式 （proxy 和 object.defineproperty 的区别）
   Vue3 使用 Proxy，Proxy 代理是针对整个对象，而不是对象的某个属性，因此不同于 `Object.defineProperty` 的必须遍历对象每个属性，`Proxy` 只需要做一层代理就可以监听同级结构下的所有属性变化，当然对于深层结构，递归还是需要进行的。此外 Proxy 还支持代理数组变化。

   1. Object.defineProperty  在一个对象上定义一个新属性或者修改一个已经存在的属性，使用 getter/setter 监听这个属性的变化。

      - Vue3 使用 Proxy，Proxy 代理是针对整个对象，而不是对象的某个属性，因此不同于 `Object.defineProperty` 的必须遍历对象每个属性，`Proxy` 只需要做一层代理就可以监听同级结构下的所有属性变化，当然对于深层结构，递归还是需要进行的。此外 Proxy 还支持代理数组变化。
        Object.defineProperty  的缺陷

      - 提升性能：函数科里化
      - 函数拦截：处理数组的 push、pop、shift、unshift、revers、sort、splice 方法

   2. 123

4. Vue最小化更新过程是什么样子的

5. Vue 如何实现指令系统

6. 用到了哪些开发小技巧
   - 提升性能：函数科里化
   
  ```javascript
     
     /**
      * 把一个形如'data.a.b.c'的字符串路径所表示的值，从真实的data对象中取出来
      * 使用函数柯里化的技巧
      */
     function parsePath(path) {
         // 判断path是否正确
         if (/[^\w.$]/.test(path)) return;
         const segments = path.split('.')
         return function (obj) {
             // 两种写法
             /* let key = ''
     			while (key = segments.shift()) {
     			// 判断obj是否正确
     			if (!obj) return;
     				obj = obj[key]
                 } */
             for (let i = 0; i < segments.length; i++) {
                 if (!obj) return
                 obj = obj[segments[i]]
             }
             return obj;
         }
     }
     console.log(parsePath('a.b.c.d.e')({ a: { b: { c: { d: { e: '123' } } } } }));
  ```

​     

   - 函数拦截：处理数组的 push、pop、shift、unshift、revers、sort、splice 方法

     ```javascript
     const arrayProto = Array.prototype;
     const arrayMethods = Object.create(arrayProto);
     [
         'push',
         'pop',
         'shift',
         'unshift',
         'splice',
         'sort',
         'reverse'
     ].forEach((method) => {
         Object.defineProperty(arrayMethods, method, {
             enumerable: false,
             configurable: true,
             writable: true,
             value(...args) {
                 console.log(args)
                 const ob = this.__ob__
                 // notify change
                 ob.dep.notify()
                 return arrayProto[method].apply(this, args)
             }
         })
     })
     ```

- 事件模型

  ```javascript
  const EVENTS = (() => {
      let events = {
  
      }
      return {
          /** 注册事件, 可以连续注册, 可以注册多个事件 */
          on(eventType, handler) {
              (events[eventType] || (events[eventType] = [])).push(handler)
          },
          off(eventType, handler) {
              // 全部移除
              if (arguments.length === 0) {
                  events = {}
                  // 清空 eventType 类型注册的事件
              } else if (arguments.length === 1) {
                  events[eventType] = [];
                  // 移除 eventType 类型下注册的handler事件
              } else if (arguments.length === 2) {
                  for (let i = events[eventType].length; i >= 0; i--) {
                      if (events[eventType][i] === handler) {
                          events[eventType].splice(i, 1)
                      }
                  }
              }
          },
          /* 执行已经注册的事件， 并且可以传入参数 */
          emit(eventType) {
              events[eventType] && events[eventType].forEach(handler => handler && handler(...Array.from(arguments).slice(1)))
          }
      }
  })();
  EVENTS.on('data', function (data, asg, asd) {
      console.log(data, asg, asd)
  })
  EVENTS.emit('data', 123, 65612, 56123)
  EVENTS.emit('2')
  ```

  

7. ssr渲染

   1. 当有大量静态内容时，这些内容会被当做纯字符串推进 buffer 里面，即使存在动态绑定属性，则会通过模板插值嵌入进去，这样会比创建 dom 更加效率
   2. 当静态内容达到一定量级的时候，会用 _createStaticVNode 方法在客户端生成 static node， 这些静态 node 会被直接 inenrHtml 进去。不需要创建对象再去渲染了

8. vue3是如何变快的

   1. diff方法优化

      - Vue2 中的虚拟dom是进行全量对比
      - Vue3 中新增静态标记（patch flag），与上次虚拟节点对比时，只对比带有 patch flag 的节点，并且通过 flag 信息得知当前节点要对比的集体内容

   2. hoistStatic 静态提升

      - Vue2 中无论元素是否参与更新，每次都会重新创建
      - Vue3 中对于不参与更新的元素，只会被创建一次，之后每次渲染时重复使用

   3. cacheHandlers 时间侦听器缓存

      - onClick 等事件默认为动态绑定，每次都会追踪它的变化，如果是同一个函数，则不去追踪变化，直接缓存复用

        

# Vue 思想

1. 什么是MVVM？
   
2. 为什么使用 Composition API
   https://blog.csdn.net/wu_xianqiang/article/details/104417875

   https://blog.csdn.net/u011068996/article/details/111337403

3. JSX语法开发与传统开发有什么区别（包含了 为什么使用JSX语法开发）
   因为JSX语法符合Vnode的抽象思维，更加贴近Vue原生底层结构，思想和结构更加清晰明了。

4. 为什么要使用虚拟 DOM
   性能提升

5. Vue、React、Angular 哪个更好？

   - 与其说哪个更好，主要是看社区更发达为主要优点之一
   - Vue 集成了 React 和 Angular 的优点，通过vue核心去对比三大框架。
     - 集成了 Angular 的哪些优点
     - 相比之下与不如 Angular 
     - 集成了 React 的哪些优点
     - 相比之下与不如 React

   - Vue 和 React 都可以完成相同的事情。 两者都是JS嘛， 但是React偏向于底层JS， 而Vue框架内提供了大量的API，偏向于Jquery。但是Vue3新推出了compositionAPI（组合式开发）更加融合了Vue集合了Angular、React两者的优点，对新接触框架的人更友好。

   - react不算是真正意义上的框架， 而是一种开发范式。 它的核心思想非常简单：

     界面/视图就是数据结构的可视化表达
     UI = f(data)

     而界面/视图由组件组合而来
     UI = f1(data) + f2(data) + f3(data) + ...

     That's all.

     三大框架整体的核心思想都是源于数据驱动（MVVM）

6. Vue2 和 Vue3 的区别

   - 更好的支持 typescript
   - 底层，使用了Proxy
   - API：几大改动，细小改动
   - 疑点：
     - provide/inject 
     - computed
     - watch
     - watchEffect
     - resolveDirective
     - withDirectives
     - createRenderer
       更多可以看 vue2 迁移 https://vue-docs-next-zh-cn.netlify.app/guide/migration/introduction.html#%E6%A6%82%E8%A7%88
       不建议保留对原始对象的持久引用。请谨慎使用。返回的 proxy 是不等于原始对象的。建议只使用响应式 proxy，避免依赖原始对象
     - 分清楚 Vue3 新特性 和 Vue2 与 Vue3 对应API的改动

