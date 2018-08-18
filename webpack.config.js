/**
 * @file local compile
 */

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLess = new ExtractTextPlugin({
    filename: '[name].css'
});

module.exports = {
    mode: 'development',
    devtool: 'none',
    optimization: {
        minimize: false
    },
    entry: {
        lib: './src/index.ts',
        test: './src/test.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: 'r',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    module: {
        rules: [{
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
            loader: 'url-loader?limit=30000&name=[name].[ext]'
        }, {
            test: /\.ts/,
            use: 'ts-loader',
            exclude: /dist|node_modules/
        }, {
            test: /\.less$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract([
                {loader: 'css-loader', options: {minimize: true}},
                {loader: 'less-loader'}
            ])
        }]
    },
    plugins: [extractLess],
    resolve: {
        extensions: ['.js', '.json', '.ts']
    }
};