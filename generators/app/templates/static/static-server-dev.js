require('babel-register')

const webpack = require('webpack');
const proxy = require('http-proxy-middleware');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./webpack.dev.config');

const PROXY_PORT = process.env.PROXY_PORT || 7001;

const app = express();


const compiler = webpack(config);
app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true
}));

app.use(require('webpack-hot-middleware')(compiler));

// app.use(proxy({
//     target: `http://localhost:${PROXY_PORT}`,
//     changeOrigin: false
// }));



app.use(bodyParser.json({type: 'application/json'}))

const port = 7777;

app.listen(port, function (err, result) {
    if (err) {
        console.log(err);
    }
    console.log('Server running on port ' + port);
});

