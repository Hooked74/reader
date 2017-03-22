'use strict';
const NODE_ENV_DEV = 'dev';
const NODE_ENV_TEST = 'test';
const NODE_ENV = process.env.NODE_ENV || NODE_ENV_DEV;

const path = require('path');
const webpack = require('webpack');
const createDefineOptions = require('./webpack.define-options');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const buildPath = path.resolve(__dirname, 'build');

const addHash = (template, hash) => {
    return NODE_ENV !== NODE_ENV_DEV ? 
        template.replace(/\.[^.]+$/, `.[${hash}]$&`) : `${template}?hash=[${hash}]`;
};

const debug = NODE_ENV === NODE_ENV_DEV || NODE_ENV === NODE_ENV_TEST;
const host = 'localhost';
const port = 9051;
const defineOptions = createDefineOptions(host, port);

module.exports = {
    debug: debug,
    
    watch: NODE_ENV === NODE_ENV_DEV,
    watchOptions: {
        aggregateTimeout: 100
    },
    
    devtool: debug ? 'sourcemap' : null,

    entry: {
        "bundle": ["./src/styles/index", "./src/app/index"]
    },
    output: {
        path: buildPath,
        publicPath: '/',
        filename: addHash('scripts/[name].js', NODE_ENV === NODE_ENV_DEV ? 'hash' : 'chunkhash'),
        chunkFilename: addHash('scripts/[id].js', 'chunkhash'),
        library: '[name]'
    },
    // externals: [function(context, request, callback) {
    //     if (/vertx/.test(request)) return callback(null, "var null");
    //     callback();
    // }],
    resolve: {
        modulesDirectories: ["node_modules", "src"],
        extensions: ['.js', '.jsx', '.scss', '']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /\/(node_modules)\//,
                query: {
                    presets: ['es2015', 'stage-0', 'react'],
                    plugins: [["transform-runtime", { "polyfill": false }], 'transform-decorators-legacy']
                }
            },
            {
                test: /styles\/.+\.scss$/,
                loader: ExtractTextPlugin.extract('style', "css!autoprefixer!resolve-url!sass?sourceMap")
            },
            {
                test: /components\/.+\.scss$/,
                loader: "style!css!autoprefixer!resolve-url!sass?sourceMap"
            },
            {
                test: /(img|images|node_modules)\/.*\.(png|jpg|svg|gif|jpeg)$/,
                loader: 'file?name=images/[name].[ext]?[hash]&regExp=(img|images)\/(.*)$'
            },
            {
                test: /(fonts)\/.*\.(ttf|eot|otf|woff|woff2|svg)$/,
                loader: 'file?name=fonts/[2]?[hash]&regExp=(fonts)\/(.*)$'
            }
        ]
        //noParse: /(localforage)/
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new CopyWebpackPlugin([
            {
                from: 'src/images',
                to: 'images'
            },
            {
                from: 'src/epubs',
                to: 'epubs'
            }
        ]),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            NODE_ENV_DEV: JSON.stringify(NODE_ENV_DEV),
            BITRIX_API_URL: JSON.stringify(defineOptions[NODE_ENV].bitrixApi),
            API_URL: JSON.stringify(defineOptions[NODE_ENV].api),
            PORTAL_URL: JSON.stringify(defineOptions[NODE_ENV].portal),
            'process.env': {
                'NODE_ENV': NODE_ENV !== NODE_ENV_DEV ? JSON.stringify('production') : JSON.stringify('development')
            }
        }),
        new ExtractTextPlugin(addHash('styles/[name].css', 'contenthash'), {allChunks: true}), //disable: NODE_ENV === NODE_ENV_DEV}),
        new HtmlWebpackPlugin({
            title: 'Reader',
            filename: './index.html',
            template: './src/index.ejs',
            chunksSortMode: 'none',
            chunks: ['bundle']
        })
    ],
    devServer: {
        host: host,
        port: port,
        contentBase: __dirname + "build",
        hot: true
    }
};

if (NODE_ENV !== NODE_ENV_DEV && NODE_ENV !== NODE_ENV_TEST) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                dead_code: true,
                drop_console: true,
                drop_debugger: true
            },
            output: {
                comments: false
            } 
        })
    );
}