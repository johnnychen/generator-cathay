var path = require('path');
var webpack = require('webpack');


module.exports = {
    entry: {
        'detail': [
            './screen/detail.js'
        ]
    },
    output: {
        path: path.join(__dirname, '../app/public/'),
        filename: '[name].js',
        publicPath: '/public/'
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        extensions: ['', '.web.js', '.js', '.jsx'],
        alias: {}
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.json$/,
                loaders: ['json-loader'],
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.css?$/,
                loaders: ['style-loader', 'css-loader'],
                include: __dirname
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: 'url',
                query: {limit: 10240}
            }
        ]
    }
};


