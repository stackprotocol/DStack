var webpack = require('webpack')
var path = require('path')
var glob = require('glob-all')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var PurgecssPlugin = require('purgecss-webpack-plugin')

var exports = {
  context: __dirname,
  mode: 'development',
  entry: [
    path.resolve(__dirname, 'app/index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'index_bundle.js',
    publicPath: '/ipos/'
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015']
          }
        }]
      }, {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'less-loader'
        }]
      }, {
        test: /\.css$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }]
      }, {
        test: /\.(eot|woff|woff2|ttf|svg|png)/,
        use: [{
          loader: 'url-loader'
        }]
      }]
  },
  node:{
    fs:'empty'
  },
  devServer: {
    historyApiFallback: {
      index: '/ipos/'
    },
    proxy: {
      '/ipos/webrpc': {
	target: 'http://localhost:9000',
  secure: false,
  headers: {'Host': "localhost:9000"}
      },
      '/ipos/upload/*': {
	target: 'http://localhost:9000',
	secure: false
      },
      '/ipos/download/*': {
	target: 'http://localhost:9000',
	secure: false
      },
      '/ipos/zip': {
        target: 'http://localhost:9000',
        secure: false
      }
    }
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: 'app/css/loader.css'},
      {from: 'app/img/browsers/chrome.png'},
      {from: 'app/img/browsers/firefox.png'},
      {from: 'app/img/browsers/safari.png'},
      {from: 'app/img/logo.svg'},
      {from: 'app/img/favicon/favicon-16x16.png'},
      {from: 'app/img/favicon/favicon-32x32.png'},
      {from: 'app/img/favicon/favicon-96x96.png'},
      {from: 'app/index.html'}
    ]),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/),
    new PurgecssPlugin({
      paths: glob.sync([
        path.join(__dirname, 'app/index.html'),
        path.join(__dirname, 'app/js/*.js')
      ])
    })
  ]
}

if (process.env.NODE_ENV === 'dev') {
  exports.entry = [
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, 'app/index.js')
  ]
}

module.exports = exports
