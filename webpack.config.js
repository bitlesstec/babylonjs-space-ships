const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',  // template html
    }),
    // new CopyWebpackPlugin({
    //     patterns: [
    //         { from: 'src/textures', to: 'textures' },  //copy textures to dist/textures folder
    //         { from: 'src/sounds', to: 'sounds' }, //copy sounds to dist/sound folder
    //     ],
    // }),
  ],
  devServer: {
    static: './dist',
  },
  mode: 'development',
};