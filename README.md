## 项目介绍

一个在js/ts中编写html标签的 dom 库

## 基础教程

首先引入

```js
import { init, render, t } from 'microway'

init(h => h.to(render))
```

使用 t 函数来编写 html

```js
let { div, a } = t

const dom = div(
    div`ddd span='14'`(
      a`href='https://baidu.com/' target="_blank"`('百度'),
      456
    ),
  )

document.querySelector('#app')!.append(dom)
```

接下来是在标签上使用js变量

```js
const pd = '25px'
const num = 123

const on = {
  click() {
    console.log('hello microway')
  }
}

const dom = div(
  div`ddd span='14'`(
    a`${{ href: 'https://baidu.com/' }} target="_blank"`('百度'),
    div`style=${{ 'padding-top': pd }}`(l`span`('fff'), pd),
    num
  ),
  div`${{ on, style: { border: '1px solid red' } }}`('btn')
)
```

引入变量的情况分为在等号后引入，此时 style 为属性名

```js
div`style=${{ 'padding-top': pd }}`()
```

以及直接引入对象字面量，此时 href 为属性名

```js
a`${{ href: 'https://baidu.com/' }} target="_blank"`()
```

## 响应式

前面的教程都属于静态部分，因为 render 只会编译一次，想要动态内容，就得使用响应式框架，本项目不提供响应式框架实现，但是可
以通过配置引入其他框架，接下来使用 @vue/reactivity 来演示

```js
import { isRef, effect, stop, computed, ref } from '@vue/reactivity'
import { use, signalExtendPlugin } from 'microway'

use({
  signal: {
    is: isRef,
    get: obj => (isRef(obj) ? obj.value : obj),
    memo: computed,
    effect,
    stop
  }
})
use(signalExtendPlugin)

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

const fgm = div(
  div`ddd span='14'`(
    a`href=${href} target="_blank"`('百度'),
    div`style=${{ 'padding-top': pd }} onclick=${setPd}`(pd),
    456
  ),
  div`${{ on, style: { border: '1px solid red' } }}`('hello'),
  div(() => [...new Array(num.value).keys()].map(i => div`style='color: blue'`(i)))
)
```

组件化

```js

import { define, definePlugin } from 'microway'

use(definePlugin)

const pd = ref('25px')
const href = ref('https://baidu.com/')
const num = ref(2)

const setPd = () => {
  pd.value = '10px'
}

let { div, a, myDiv } = t

define.myDiv((props: any) =>
  div(
    div`ddd span='14'`(
      a`href=${href} target="_blank"`('百度'),
      div`style=${{ 'padding-top': props.pd }} onclick=${setPd}`(props.pd),
      456
    )
  )
)

document.querySelector('#app')!.append(myDiv`${{ pd }}`())

```

[项目地址](https://github.com/wsybox/microway)
