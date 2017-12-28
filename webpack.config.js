const webpack = require('webpack')
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const extractLess = new ExtractTextPlugin({
    filename: "[name].css",
    disable: process.env.NODE_ENV === "development"
});

const uglifyJs = new UglifyJSPlugin({
    exclude: /node_modules/
});

module.exports = {
    entry: {
        lib: './index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js/,
            use: 'ts-loader',
            exclude: /dist|node_modules/
        }, {
            test: /\.less$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract([{loader: 'css-loader'},
                {loader: 'less-loader'}])
        }]
    },
    resolve: {
        extensions: [".js", ".json", ".ts"]
    },
    plugins: [extractLess, uglifyJs]
};