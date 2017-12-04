const webpack = require('webpack')
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLess = new ExtractTextPlugin({
    filename: "[name].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: {
        lib: './src/lib.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'app/client/assets')
    },
    module: {
        rules: [{
            test: /src\/\.ts/,
            use: 'ts-loader',
            exclude: /dist|node_modules/
        }, {
            test: /\.less$/,
            use: extractLess.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "less-loader"
                }],
                fallback: "style-loader"
            }),
            exclude: /dist|node_modules/
        }]
    },
    plugins: [extractLess],
    resolve: {
        extensions: [".js", ".json", ".ts"]
    }
};