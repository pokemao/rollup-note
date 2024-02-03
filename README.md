# rollup-note
this is a repository about what is rollup and how to use it.

# rollup
1. 模块化打包工具
2. 默认情况下，只支持对es module的模块化进行打包，意思是源代码是es module，可以打包成 commonjs2 浏览器 amd umd esmodule，不支持打包成commonjs
3. 要想支持在对commonjs2的源代码进行打包的话需要使用插件@rollup/plugin-commonjs，源代码指的就是我们常常在src下写的代码，如果你是写库的话那应该是lib文件夹下的代码，但是这个库也只是支持源代码中可以是cjs2导出，还是不能支持在源代码中使用cjs2导入，所以导入的部分还是要使用esm
4. 天生支持tree shaking
5. 源代码import的库来自于node_modules(导入的库来自于node_modules)，那么必须要使用插件@rollup/plugin-node-resolve，否则从node_modules中导入的内容无法被打包到输出代码中
6. 和webpack一样有专门的babel插件, @rollup/plugin-babel, 当然只要是babel就同时需要依赖@babel/core这个库，预设可以使用@babel/preset-env
7. 和webpack一样有专门的css插件, rollup-plugin-postcss
8. 和webpack一样有专门的vue插件, rollup-plugin-vue@4.6.1处理vue2，rollup-plugin-vue处理vue3
9. 在打包src中源代码的时候向源代码中注入环境变量使用rollup-plugin-replace
10. 开启本地服务的插件rollup-plugin-serve
11. 热更新
    ```json
    //package.json
    "script": {
        "watch": "echo -c表示要使用rollup.config.js这个配置文件 && echo -w表示要监听文件的变化进行热更新 && rollup -c -w",
    }
    ```
    ```js
    // rollup.config.js
    plugins: [
    // 配合在package.json中配置"watch": "echo -c表示要使用rollup.config.js这个配置文件 && echo -w表示要监听文件的变化进行热更新 && rollup -c -w"的-w表示监听入口文件的变化，然后利用livereload，重启服务
    livereload()
    ]
    ```
12. 注入换进变量
    ```json
    //package.json
    "script": {
        "serve": "rollup -c -w --environment NODE_ENV:development",
        "build:production": "rollup -c --environment NODE_ENV:production",
    }
    ```
    ```js
    // rollup.config.js
    // 在pnpm run serve时
    process.env.NODE_ENV === "development"
    // 在pnpm run build时
    process.env.NODE_ENV === "production"
    // 如果在package.json中使用了--environment NODE_ENV，指定了 process.env.NODE_ENV的值的话，这里可以写成
    // 通过--environment NODE_ENV只能把process.env.NODE_ENV属性注入到rollup.config.js中，但是不能注入到源代码的环境中
    ```
13. 使用babel解析ts文件，需要pnpm install @babel/preset-typescript，加到babel.config.js中，同时在rollup.config.js的babel插件中添加一个选项，表示使用@rollup/plugin-babel解析ts文件
14. 打包生成类型文件.d.ts，需要使用插件 rollup-plugin-dts
15. 如果需要多个打包逻辑可以在rollup.config.js文件中导出一个数组，而且现在rollup中也有vite的defineConfig函数，还有一个重点就是rollup现在也像vite一样支持使用esm的格式来写rollup.config.js
    ```js
    // rollup.config.js
    import { defineConfig } from 'rollup'
    import babel from '@rollup/plugin-babel'
    // 生成.d.ts的插件
    import dts from 'rollup-plugin-dts'

    export default defineConfig([
        // 库本身打包逻辑
        {
            input: "./src/index.ts"
            output: {
                format: "umd",
                file: "./dist/index.js",
                name: "myLibrary"
            },
            plugins: [
                babel({
                    babelHelpers: "bundled",
                    extensions: ['.ts']
                })
            ]
        },
        // 库类型文件的打包逻辑
        {
            input: "./src/index.ts",
            plugins: [dts()],
            output: {
                format: 'esm',
                file: './dist/index.d.ts'
            }
        }
    ])
    ```
16. 
