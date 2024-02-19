## 项目介绍

一个在js/ts中编写html标签的js库

## 基础教程

首先引入

```js
import { init, l } from 'microway'

const { fragment } = init()
```

调用 fragment 函数，在参数括号内使用 l 函数来编写 html 标签，正如其名，fragment 函数返回一个 DocumentFragment，然后来把
fgm 挂载到界面

```js
const fgm = fragment(
  l`div ddd span='14'`(
    l`a href='https://baidu.com/' target="_blank"`('百度'),
    456
  )
)

document.querySelector('#app')!.appendChild(fgm)
```

接下来是在标签上引入js变量，让我们再引入 baseModule 然后再 init 时传入 baseModule 插件

```js
import { init, l, baseModule } from 'microway'

const { fragment } = init(baseModule)
```

使用变量

```js
const pd = '25px'
const num = 123

const on = {
  click() {
    console.log('hello microway')
  }
}

const fgm = fragment(
  l`div ddd span='14'`(
    l`a ${{ href: 'https://baidu.com/' }} target="_blank"`('百度'),
    l`div style=${{ 'padding-top': pd }}`(l`span`('fff'), pd),
    num
  ),
  l`div ${{ on, style: { border: '1px solid red' } }}`('btn')
)
```

引入变量的情况分为在等号后引入，此时 style 为属性名

```js
l`div style=${{ 'padding-top': pd }}`
```

以及直接引入对象字面量，此时 href 为属性名

```js
l`a ${{ href: 'https://baidu.com/' }} target="_blank"`
```

## 响应式

前面的教程都属于静态部分，因为 fragment 只会编译一次，想要动态内容，就得使用响应式框架来实现，本项目不提供响应式框架实
现，但是可以通过配置引入其他框架，接下来使用 @vue/reactivity 来演示

```js
import { isRef, effect, stop, computed, ref } from '@vue/reactivity'
import { init, l, baseModule, signalModule } from 'microway'

const { fragment } = init(
  {
    _signal: {
      is: isRef,
      get: obj => (isRef(obj) ? obj.value : obj),
      memo: computed,
      effect,
      stop
    }
  },
  baseModule,
  signalModule
)
```

使用

```js
const pd = ref('25px')
const href = ref('https://baidu.com/')
const num = ref(2)

const on = {
  click() {
    num.value++
    console.log('add: ', num.value)
  }
}

const setPd = () => {
  pd.value = '10px'
}

const fgm = fragment(
  l`div ddd span='14'`(
    l`a href=${href} target="_blank"`('百度'),
    l`div style=${{ 'padding-top': pd }} onclick=${setPd}`(pd),
    456
  ),
  l`div ${{ on, style: { border: '1px solid red' } }}`('hello'),
  l`div`(() => [...new Array(num.value).keys()].map(i => l`div style='color: blue'`(i)))
)
```

重点说一下最后的函数部分，引入 signalModule 插件后，fragment 会将 参数里的函数看作动态节点，使用 fragment 编译函数的返回
值， 再插入到函数的位置，函数会用作 memo 的参数， 所以只要函数里的响应式数据有更改， 函数部分的节点都会重新渲染一次

[项目地址](https://github.com/wsybox/microway)

[也许可以不用vue模板和jsx，在js当中就可以灵活、优雅、简洁的编写UI](https://juejin.cn/post/7337211350042787876)
