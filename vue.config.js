const path = require('path');
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devdist',
  lintOnSave: false,
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
    .use("svg-sprite-loader") 
    .loader("svg-sprite-loader")
    .options({
      symbolId: "icon-[name]",
      include: ["./src/icons"]
    });
  },
  configureWebpack: (config) => {
    config.resolve = {
      extensions: ['.js', '.json', '.vue'],
      alias: {
        'vue': 'vue/dist/vue.js',
        '@': path.resolve(__dirname, './src'),
        'public': path.resolve(__dirname, './public'),
        '@c': path.resolve(__dirname, './src/components'),
        'common': path.resolve(__dirname, './src/common'),
        'api': path.resolve(__dirname, './src/api'),
        'views': path.resolve(__dirname, './src/views'),
        'data': path.resolve(__dirname, './src/data')
      }
    }
  },
  productionSourceMap: false,
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      sass: {
        additionalData: `@import "./src/styles/main.scss";`
      }
    },
    requireModuleExtension: true
  },
  parallel: require('os').cpus().length > 1,
  pwa: {},
    devServer: {
    open: false,
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hot: true,
    hotOnly: false,
    proxy: null,
    proxy: {
      '/devApi': {
        target: "xxxxx", // API服务器的地址
        changeOrigin: true,
        pathRewrite: {
          '^/devApi': ''
        }
      }
    },
    overlay: {
      warnings: true,
      errors: true
    },
    before: app => {
    }
  },
  pluginOptions: {}
}
