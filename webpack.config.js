const path = require('path');

module.exports = {
  entry: './src/frontend/src/index.jsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'src/frontend/dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(?:jsx|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react'],
            ],
            plugins: ["babel-plugin-styled-components"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
