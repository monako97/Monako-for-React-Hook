const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
    entry: [
        "core-js/stable",
        "regenerator-runtime/runtime",
        path.resolve(__dirname, "../src/pages/monako.jsx"),
    ],
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Monako',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeAttributeQuotes: true,
                useShortDoctype: true
            },
            template: path.resolve(__dirname, '../src/html/monako.html'),
            filename: 'monako.html',
            hash: false,
            chunksSortMode: 'none'
        }),
        // 压缩 css
        new MiniCssExtractPlugin({
            filename: "style/[name].min.css",
            chunkFilename: "style/[name].chunk.css"
        }),
        // 拷贝静态文件
        new CopyWebpackPlugin([
            {from: path.resolve(__dirname, '../src/static'), to: 'static'},
            {from: path.resolve(__dirname, '../src/markdown'), to: 'markdown'},
            {from: path.resolve(__dirname, '../src/error'), to: './'},
        ]),
        // 编译显示进度条
        new ProgressBarPlugin(),
        // 下面是下载的插件的配置
        new CompressionWebpackPlugin({
            algorithm: 'gzip', // 可以是 (buffer, cb) => cb(buffer) 或者是使用 zlib 里面的算法的 {String}
            test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'), // 处理所有匹配此 {RegExp} 的资源
            threshold: 1024, // 只处理比这个值大的资源。按字节计算 1k
            minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
            deleteOriginalAssets: false // 是否删除原资源
        })
    ],
    resolve: {
        extensions: ['.js', ".jsx", '.scss', '.css'], //后缀名自动补全
    },
    module: {
        rules: [
            {
                test: /\.md$/,
                use: [{ loader: 'text-loader' }]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    process.env.NODE_ENV === 'development' ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                            modules: true,
                            getLocalIdent: (context, localIdentName, localName, options) => {
                                return localName
                            },
                            publicPath: '../'
                        },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: { // modules：启用模块化
                                // localIdentName：自定类名 [path] ：使用文件路径, [name]：文件名称
                                localIdentName: "[name]-[hash:5]"
                            }
                        }
                    },
                    "sass-loader",
                    'postcss-loader'
                ],
                exclude: /node_modules/, // 排除项
            },
            {
                test: /\.(gif|jpg|png|ico|mp4)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 2048,
                        name: 'static/images/[name].[ext]'
                    }
                }],
                exclude: /node_modules/, // 排除项
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 5000,
                    name: 'static/fonts/[name].[ext]'
                },
                exclude: /node_modules/, // 排除项
            },
            {
                test: /\.js|.jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/, // 排除项
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: './js/[name].min.js',
        chunkFilename: './js/[name].chunk.js',
        publicPath: '/'
    }
};
