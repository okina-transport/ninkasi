const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'inline-source-map',
  entry: {
      app: './index',
      react: ['react', 'react-redux']
  },
  output: {
    path: __dirname + '/public/',
    filename: 'bundle.js',
    publicPath: './public/'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin("react", "react.bundle.js"),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      beautify: false,
      comments: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'BABEL_ENV': JSON.stringify('production'),
        'VERSION': JSON.stringify(require('./package.json').version),
        'AUTH_SERVER_URL': JSON.stringify(process.env.AUTH_SERVER_URL),
        'CHOUETTE_BASE_URL': JSON.stringify(process.env.CHOUETTE_BASE_URL),
        'PROVIDERS_BASE_URL': JSON.stringify(process.env.PROVIDERS_BASE_URL), // BABA
        'ORGANISATIONS_BASE_URL': JSON.stringify(process.env.ORGANISATIONS_BASE_URL), // BABA
        'EVENTS_BASE_URL': JSON.stringify(process.env.EVENTS_BASE_URL),
        'TIMETABLE_ADMIN_BASE_URL': JSON.stringify(process.env.TIMETABLE_ADMIN_BASE_URL),
      }
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: __dirname,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-1', 'react']
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        include: __dirname,
        loaders: ['style-loader', 'css-loader', 'sass']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: /node_modules/,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  }
}
