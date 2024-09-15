const path = require('path');
const { EsbuildPlugin } = require('esbuild-loader');

module.exports = {
  entry: path.resolve(__dirname, './index.jsx'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(?:jsx|mjs|js|cjs)$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          // JavaScript version to compile to
          target: 'es2015'
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [
      new EsbuildPlugin({
        target: 'es2015'  // Syntax to transpile to (see options below for possible values)
      })
    ]
  }
};
