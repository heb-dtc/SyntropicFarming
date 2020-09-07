const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new Dotenv({
      path: './.env.prod',
    }),
  ],
  devServer: {
    contentBase: './dist',
  },
};
