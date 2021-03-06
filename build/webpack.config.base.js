'use strict'

const config = require('./config')
const utils = require('./utils')
// const webpack = require('webpack')
const EslintFriendlyFormatter = require('eslint-friendly-formatter')
const { VueLoaderPlugin } = require('vue-loader')
const StylelintPlugin = require('stylelint-webpack-plugin')

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [
    utils.resolve('src'),
    utils.resolve('test'),
  ],
  options: {
    formatter: EslintFriendlyFormatter,
    emitWarning: !config.dev.showEslintErrorsInOverlay,
  },
})

module.exports = {
  entry: {
    app: ['./src/main.js'],
  },
  output: {
    filename: '[name].js',
    path: config.build.assetsRoot,
    chunkFilename: '[name].js',
    publicPath: config.dev.assetsPublicPath,
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': utils.resolve('src'),
      '@static': utils.resolve('static'),
    },
  },

  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        use: 'vue-loader',
      }, {
        test: /\.js$/,
        include: [
          utils.resolve('src'),
          utils.resolve('test'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            compact: false,
          },
        },
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[ext]'),
          },
        },
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[ext]'),
          },
        },
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[ext]'),
          },
        },
      },
    ],
  },

  plugins: [
    new VueLoaderPlugin(),

    new StylelintPlugin({
      context: 'src',
      files: [
        '**/*.vue',
        '**/*.styl',
        // '**/*.s?(a|c)ss',
      ],
      customSyntax: 'stylelint-plugin-stylus/custom-syntax',
    }),
  ],
}
