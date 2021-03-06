const path = require('path');

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: './public',
  },
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
  },
};
