module.exports = {
    // 解析选项
    parserOptions: {
        ecmaVersion: 6, // ES 语法版本
        sourceType: "module", // ES 模块化
        ecmaFeatures: { // ES 其他特性
          jsx: true // 如果是 React 项目，就需要开启 jsx 语法
        }
    },
    // 具体检查规则
    rules: {
        "no-var":2//不能使用var定义变量
    },
    env:{
        node:true,//启用node中全局变量
        browser:true,//启用浏览器中全局变量
    },
    // 继承其他规则
    extends: [],
    // ...
    // 其他规则详见：https://eslint.bootcss.com/docs/user-guide/configuring
  };