const defaultSettings = require('./src/settings.js')
const {
  getEntry,
  camel2Line,
  baseUrl,
  editOperation,
  dllReference
} = require('./util')
const { NODE_ENV, BASE_URL } = process.env
const projectName = process.argv[3] || 'dashboard'
const name = defaultSettings.title || '小熊美术TOSS'

/**
 * api 环境切换，默认 dev
 */
const env = 'dev' // default, dev, test, prod, live
// graphql api
let targetGrapqhlEnv = 'http://ai-app-default-tossgraphql.meixiu.mobi'
// 微服务api
let targetApiEnv = 'http://ai-app-default-toss.meixiu.mobi'
if (env === 'dev') {
  targetGrapqhlEnv = 'http://ai-app-dev-tossgraphql.meixiu.mobi'
  targetApiEnv = 'http://ai-app-dev-toss.meixiu.mobi'
}
// 测试环境
else if (env === 'test') {
  targetGrapqhlEnv = 'http://ai-app-test-tossgraphql.meixiu.mobi'
  targetApiEnv = 'http://ai-app-test-toss.meixiu.mobi'
} else if (env === 'prod') {
  // 预发布环境
  targetGrapqhlEnv = 'http://ai-app-prod-tossgraphql.meixiu.mobi'
  targetApiEnv = 'http://ai-app-prod-toss.meixiu.mobi'
} else if (env === 'live') {
  targetGrapqhlEnv = 'http://ai-app-live-bossgraphql.meixiu.mobi'
  targetApiEnv = 'http://ai-app-live-toss.meixiu.mobi'
}

editOperation('构建')

module.exports = {
  publicPath:
    NODE_ENV === 'production' ? `${baseUrl()}` : `/${camel2Line(projectName)}`,
  pages: getEntry(),
  productionSourceMap: BASE_URL !== 'ghpageslive', // 只有生产是false
  configureWebpack: {
    name,
    plugins: [],
    // 解决build log日志warning
    performance: {
      hints: 'warning',
      maxEntrypointSize: 50000000,
      maxAssetSize: 30000000,
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
  },
  chainWebpack(config) {
    if (NODE_ENV === 'production') {
      dllReference(config)
    }
    config.plugins.delete('prefetch')
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('html-loader')
      .loader('html-loader')
      .end()
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        mozjpeg: { progressive: true, quality: 65 },
        optipng: { enabled: false },
        pngquant: { quality: '65-90', speed: 4 },
        gifsicle: { interlaced: false },
        webp: { quality: 75 }
      })
      .end()
  },
  devServer: {
    // 本地调试上传图片使用
    // port: 6001,
    proxy: {
      '/api': {
        target: targetApiEnv,
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      // 查询接口
      '/data': {
        target: targetApiEnv,
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/data': '/data'
        }
      },
      '/graphql': {
        // local - 本地开发环境
        // target: 'http://localhost:3000',
        // release - 测试环境
        // target: 'http://docker.meixiu.mobi:43401',
        // dev - 开发环境
        // target: 'http://docker.meixiu.mobi:33401',
        //  线上环境
        // target: 'http://docker.meixiu.mobi:13401',
        // product -预发布环境
        // target: 'http://docker.meixiu.mobi:53401',
        target: targetGrapqhlEnv,
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/graphql': ''
        }
      },
      '/getStuRankingList': {
        target: targetGrapqhlEnv,
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/getStuRankingList': '/getStuRankingList'
        }
      }
    }
  }
}
