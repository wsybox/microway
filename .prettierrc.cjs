/**
 * prettier配置
 * @module .prettierrc
 */
module.exports = {
  // 一行最多多少字符
  printWidth: 120,
  // 使用2个空格缩进
  tabWidth: 2,
  // 缩进不使用tab，使用空格
  useTabs: false,
  // 行尾不需要分号
  semi: false,
  // 使用单引号
  singleQuote: true,
  // 对象的key仅在必要时使用引号
  quoteProps: 'as-needed',
  // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  trailingComma: 'none',
  // 大括号内的收尾需要空格
  bracketSpacing: true,
  // 箭头函数参数只有一个时是否要有小括号。avoid：省略括号,  always: 必须有小括号
  arrowParens: 'avoid',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的@prettier
  requirePragma: false,
  // 不需要自动在文件开头插入@prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'always',
  // 根据显示样式决定html要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用lf
  endOfLine: 'lf'
}
