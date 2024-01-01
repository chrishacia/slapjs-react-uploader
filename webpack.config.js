const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map', // for source mapping
  entry: './src/index.js', // your entry point
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'slapjs-react-uploader.js', // Replace with your desired output file name
    publicPath: '/', // ensure the dev server handles deep URLs
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public/dist'),
    },
    // proxy: {
    //   '/api': 'http://localhost:8080',
    //   changeOrigin: true,
    // },
    compress: true,
    port: 3001, // you can choose any port
    hot: true, // enable hot module replacement
    historyApiFallback: true, // for single-page applications
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Transform all .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
  ],
};

