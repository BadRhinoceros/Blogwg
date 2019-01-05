module.exports = {
  entry: __dirname + "/src/index.js",
  output: {
    path: __dirname + "/src/dist/",
    filename: "bundle.js"
  },
  devtool: "#sourcemap",
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: "babel-loader"
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
  }
}
