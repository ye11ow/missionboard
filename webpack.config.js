"use strict";

var webpack = require("webpack"),
    path = require("path"),
    srcPath = path.join(__dirname, "js");

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ["react", "es2015"]
        }
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
    path: srcPath,
    filename: "bundle.js",
    pathInfo: true
  }
}