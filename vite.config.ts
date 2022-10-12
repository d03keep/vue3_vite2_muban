import path from "path"
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import autoprefixer from "autoprefixer"
import postcssFlexbugsFixes from "postcss-flexbugs-fixes"
import legacy from '@vitejs/plugin-legacy'

const { ENV } = process.env

const now = new Date();
const version = require("./package.json").version;
const VERSION = ENV === "prod" ? version : [now.getDate(), now.getHours(), now.getMinutes()].join(".")

console.log("==========================")
console.log("当前版本===>", VERSION)
console.log("当前环境===>", ENV)
console.log("==========================")

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: ENV === 'prod',
                drop_debugger: ENV === 'prod',
            }
        },
        rollupOptions: {
            output: {
                // 入口文件名
                entryFileNames: `assets/${ENV === 'prod' ? '[hash]' : '[name]-[hash]'}.v${VERSION}.js`,
                // 块文件名
                chunkFileNames: `assets/${ENV === 'prod' ? '[hash]' : '[name]-[hash]'}.v${VERSION}.js`,
                // 资源文件名 css 图片等等
                assetFileNames: `assets/${ENV === 'prod' ? '[hash]' : '[name]-[hash]'}.v${VERSION}.[ext]`
            }
        }
    },
    // experimental: {
    //
    // },
    css: {
        postcss: {
            plugins: [
                // 前缀追加
                autoprefixer({
                    overrideBrowserslist: [
                        'Android 4.1',
                        'iOS 7.1',
                        'Chrome > 51',
                        'ff > 31',
                        'ie >= 9',
                        '> 1%',
                    ],
                    grid: true,
                }),
                postcssFlexbugsFixes,
            ],
        },
        preprocessorOptions: {
            less: {
                modifyVars: {
                    hack: `true; @import (reference) "${path.resolve('src/css/webp.less')}";`,
                    version: VERSION
                },
                javascriptEnabled: true,
            }
        }
    },
    plugins: [
        vue(),
        Components({
            resolvers: [
                VantResolver()
            ],
        }),
        legacy({
            targets: ['> 1%', 'iOS >= 9', 'Android >= 4.0']
        })
    ],

    resolve: {
        alias: [
            {
                find: '@',
                replacement: path.resolve(__dirname, 'src')
            }
        ]
    },

    // 打包路径
    base: '/',

    define: {
        __ENV__: `'${ENV}'`,
        __VERSION__: `'${VERSION}'`
    },

    server: {
        port: 9003, // 服务端口号
        open: false, // 服务启动时是否自动打开浏览器
        cors: true, // 允许跨域
        host: '0.0.0.0',
        proxy: {
            '/proxy': {
                // target: "https://test3_api.sun8tv.com",
                // target: "https://test2-api.sun8tv.com",
                // target: "https://test1-api.sun8tv.com",
                // target: "https://uat-api.sun8tv.com",
                target: "https://api.mliveplus.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy/, '')
            },
            '/chat': {
                target: "https://loginchat.sun8tv.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/chat/, '')
            }
        }
    }
})
