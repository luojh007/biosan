const path = require('path');
const webpack = require('webpack');
const baseWebpack = require('./webpack.base.conf')
const merge = require('webpack-merge')
var config = require('../config')
const pkg = require('../package.json')
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 每次构建清除上一次打包出来的文件
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
function resolve(dir) {
  return path.join(__dirname, "..", dir);
}
const prodConfig = {
  mode: 'production',
  // devtool: 'source-map',
  entry: path.resolve(__dirname, '../src/components/index.tsx'), //指定入口文件，程序从这里开始编译,__dirname当前所在目录, ../表示上一级目录, ./同级目录
  output: {
    library: pkg.name,
    libraryTarget: 'umd',  // 任意一种打包方式，common，amd，全局gobal    
    path: config.build.assetsRoot,
    filename: '[name].js',
  },
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    'moment': {
      root: 'moment',
      commonjs2: 'moment',
      commonjs: 'moment',
      amd: 'moment',
    },
    "antd": "antd",
  },

  //压缩js,css
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserJSPlugin({
  //       sourceMap: true,
  //     }),
  //     // new OptimizeCssAssetsPlugin({})
  //   ],
  //   // splitChunks: {
  //   //   chunks: 'all',
  //   // },
  // },
  module: {
    rules: [
      {
        /* 自定义的组件，样式 css-modules 化？？如果需要使用其他的 css 预编译程序，则可以去除以下两条配置 */
        test: /(\.css|\.less)$/,
        include: [
          resolve("src/components"),
          resolve("src/view"),
        ],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]"
              },
              sourceMap: config.build.productionSourceMap
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins:
                process.env.NODE_ENV === "production"
                  ? loader => [
                    require("postcss-import")({ root: loader.resourcePath }),
                    require("autoprefixer")()
                  ]
                  : []
            }
          },
          {
            loader: "less-loader"
          }
        ]
      },
      {
        test: /(\.css|\.less)$/,
        exclude: [
          resolve("src/components"),
          resolve("src/view"),
        ],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: false,
              sourceMap: config.build.productionSourceMap
            }
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
              modifyVars: {} // 使用了 antd 的全局样式配置时，.babelrc 仅支持 import 导入 "style": true
              // ["import", { "libraryName": "antd", "style": true, "comment": "true for .less, css for .css"}]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/[name].css",
      chunkFilename: "./css/[name].css"
    }),
    new CleanWebpackPlugin(),
  ],
}
module.exports = merge(baseWebpack, prodConfig)