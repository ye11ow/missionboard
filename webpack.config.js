"use strict";

var webpack = require("webpack"),
    path = require("path"),
    srcPath = path.join(__dirname, "js"),
    buildPath = srcPath;
    // buildPath = path.join(__dirname, "build");

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel?presets[]=react,presets[]=es2015"
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: "json"
      }
    ]
  },
  entry: {
    module: path.join(srcPath, "app.js")
  },
  output: {
    path: buildPath,
    publicPath: buildPath,
    filename: "bundle.js"
  },
  devServer: {
    contentBase: buildPath,
    hotComponents: true,
    devtool: "eval",
  }
}