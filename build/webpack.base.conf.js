const path = require('path')
var config = require('../config')
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  entry: {
    app: resolve("src/index.tsx"),
  },
  output: {
    filename: '[name].js',
    path: config.build.assetsRoot,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json','jsx' ]
  },
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        loader: "ts-loader",
        include: [resolve("src")]
      },
      // {
      //   enforce: "pre",
      //   test: /\.js$/,
      //   loader: "source-map-loader",
      //   exclued: [resolve('node_modules')]
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        query: {
          // limit: 10000,
          name: 'static/images/[name].[hash:7].[ext]'
        },
        include: [resolve("src"), resolve("node_modules/@317hu")]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        query: {
          limit: 10000,
          name: 'static/images/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
  ],
}