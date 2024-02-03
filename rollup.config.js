const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const babel = require('@rollup/plugin-babel')
const {terser} = require('rollup-plugin-terser')
const postcss = require('rollup-plugin-postcss')
const replace = require('rollup-plugin-replace')
const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')


// rollup 的配置文件也要使用module.export，除非nodejs支持export default
// rollup 好像不支持commonjs规范的打包，只支持commonjs2规范的打包
module.exports = {
  // 入口 相对于命令行执行时的相对路径，一般是相对于package.json的相对路径
  input: "./src/index.js",
  //   output: {
  //     // 打包生成什么规范的库
  //     format: "umd",
  //     // 如果是umd的话需要指定打包出来的对象名，目的是支持浏览器和commonjs，这一点和webpack的库打包一样
  //     // 对于浏览器和commonjs使用的时候也要使用如 const ... = window.pokemaoUtils的方式
  //     name: "pokemaoUtils",
  //     // 打包生成的文件的路径及文件名称
  //     file: "dist/pokemao.umd.js",
  //     // 和webpack的external属性作用相似
  //     // 配合rollup的external属性使用，表示使用cdn的时候，lodash这个cdn文件导出的全局变量是"_"
  //     globals: {
  //       "lodsh": "_"
  //     }
  //   },
  // rollup的一大优势就是打包生成库文件很方便，可以同时生成支持多个规范的库，其实webpack也可以
  output: [
    {
      format: "umd",
      name: "pokemaoUtils",
      file: "dist/pokemao.umd.js",
      // 和webpack的external属性作用相似
      // 配合rollup的external属性使用，表示使用cdn的时候，lodash这个cdn文件导出的全局变量是"_"
      globals: {
        lodsh: "_",
      },
    },
    {
      // 这里的cjs指的是commonjs2，commonjs2不需要指定name: "pokemaoUtils", 可见webpack的讲解，这个就是commonjs2的导出规范
      format: "cjs",
      file: "dist/pokemao.cjs.js",
      // 和webpack的external属性作用相似
      // 配合rollup的external属性使用，表示使用cdn的时候，lodash这个cdn文件导出的全局变量是"_"
      globals: {
        lodsh: "_",
      },
    },
    {
      // 同样的es module规范也不需要指定name: "pokemaoUtils"，这个就是esm的导出规范
      format: "es",
      file: "dist/pokemao.esm.js",
      // 和webpack的external属性作用相似
      // 配合rollup的external属性使用，表示使用cdn的时候，lodash这个cdn文件导出的全局变量是"_"
      globals: {
        lodsh: "_",
      },
    },
    {
      // 这个导出规范是导出成一个立即执行函数，这个就相当于是浏览器的导出规范，使用的时候要用const ... = window.pokemaoUtils的方式，所以要指定name: "pokemaoUtils"
      format: "iife",
      name: "pokemaoUtils",
      file: "dist/pokemao.iife.js",
      // 和webpack的external属性作用相似
      // 配合rollup的external属性使用，表示使用cdn的时候，lodash这个cdn文件导出的全局变量是"_"
      globals: {
        lodsh: "_",
      },
    },
  ],
  // cdn引入
  // 表示不对lodash这个库进行打包，一般在我们项目源代码里面使用了lodash，但是我们要把lodash的代码使用cdn引入而不是打包到我们的输出文件中的时候使用的
  external: ["lodash"],
  plugins: [
    // 使得rollup支持对源代码是cjs2规范导出的打包，但是导入还是要用esmodule
    // 导入还是使用esm的话，这个插件的意义是什么呢? 意义是对于我们项目源代码中引用的外部的一些库，他们可能是使用cjs2导出的，我们不能改我们引用的这些库的导出形式，所以提供了这个插件
    commonjs(),
    // 源代码import的库来自于node_modules(导入的库来自于node_modules)，那么必须要使用插件@rollup/plugin-node-resolve，否则从node_modules中导入的内容无法被打包到输出代码中
    resolve(),
    babel(),
    // 添加解析ts文件的逻辑
    // babel({
    //   extensions: ['.ts']
    // }),
    terser(),
    postcss(),
    replace({
        // 这里表示process.env.NODE_ENV的值等于变量production
        "process.env.NODE_ENV": "production",
        // 这里表示process.env.NODE_ENV的值等于变量"production"
        "process.env.NODE_ENV": JSON.stringify("production"),
        // 如果在package.json中使用了--environment NODE_ENV，指定了 process.env.NODE_ENV的值的话，这里可以写成
        // 通过--environment NODE_ENV只能把process.env.NODE_ENV属性注入到rollup.config.js中，但是不能注入到源代码的环境中
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    // 打包完毕开启一个本地服务
    serve({
        port: 8080,
        open: true, // npm run build 打包完毕之后，使用浏览器打开http://localhost:8080
        // 这个服务器 http://localhost:8080 服务于那个文件夹，'.'表示rollup.config.js所在的文件夹
        contentBase: '.'
    }),
    // 配合在package.json中配置"watch": "echo -c表示要使用rollup.config.js这个配置文件 && echo -w表示要监听文件的变化进行热更新 && rollup -c -w",
    // 的-w表示监听入口文件的变化，然后利用livereload，重启服务
    livereload()
  ],
};
