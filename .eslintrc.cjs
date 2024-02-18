const mode =
  _mode =>
  (...args) =>
    args.length > 0 ? [_mode, ...args] : _mode

// 将 ESlint 规则的 value 定义为常量
const [OFF, WARN, ERROR] = [0, 1, 2]
const [off, warn, error] = [mode(OFF), mode(WARN), mode(ERROR)]

module.exports = {
  env: {
    browser: true, // 浏览器环境
    es2021: true, // ECMAScript 2021
    node: true // Node环境
  },
  // 扩展的 ESlint 规范, 可以被继承的规则; 字符串数组: 每个配置继承它之前的配置
  // eslint-config- 前缀可以省略
  extends: ['airbnb-base', 'prettier'],
  // ESlint 会对我们的代码进行校验, 而 parser 的作用是将我们写的代码转换为 EsTree(AST), ESlint 会对 EsTree 进行校验
  parser: '@typescript-eslint/parser',
  // 转换器配置项
  parserOptions: {
    // ES版本, 可以填 版本号/年份/latest
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    // 源码类型 默认是 script, ES模块使用 module
    sourceType: 'module'
  },
  // 插件
  // eslint-plugin- 前缀可以省略
  // vue 官方提供了一个 ESlint 插件 eslint-plugin-vue, 它提供了 parser 和 rules
  // parser 为 vue-eslint-parser 配置在上面的 parser 转换器字段
  // rules 配置在上面的 extends 里
  plugins: ['@typescript-eslint'],
  settings: {
    // 设置项目内的别名
    'import/reslover': {
      alias: {
        map: [['@', './src']],
        // 允许的扩展名
        extensions: ['.js', '.ts']
      }
    }
  },
  rules: {
    strict: ERROR, // 使用严格模式,
    camelcase: ERROR, // 强制驼峰法命名
    eqeqeq: error('always'), // 禁止使用 ==，!=
    'no-console': WARN,
    'consistent-return': OFF,
    'prefer-promise-reject-errors': off({ allowEmptyReject: false })
  }
}
