const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.common');
const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer");
module.exports = merge(common, {
    // devtool:"cheap-module-source-map",
    optimization: {
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    minSize: 100,
                    minChunks: 5,
                    chunks: 'all',
                    priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
                },
                commons: {
                    test: /[\\/]src[\\/]js[\\/]/,
                    name: 'commons',
                    minSize: 100,
                    minChunks: 5,
                    chunks: 'all',
                    priority: -1,
                    reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
                }
            }
        },
        runtimeChunk: {
            name:'main'
        },
        minimizer: [
            // 自定义js优化配置，将会覆盖默认配置
            new UglifyJsPlugin({
                cache: true,
                parallel: true, // 开启并行压缩，充分利用cpu
                sourceMap: false,
                extractComments: {
                    condition: true,
                    filename(file) {
                        return `${file}.LICENSE`;
                    },
                    banner(commentsFile) {
                        // return `monako ${commentsFile}`;
                        return null;
                    },
                }, // 移除注释
                uglifyOptions: {
                    warnings: false,
                    ecma: 8,
                    compress: {
                        unused: true,
                        drop_console: true,
                        drop_debugger: true
                    },
                    output: {
                        comments: false
                    }
                }
            }),
            // 用于优化css文件
            new OptimizeCSSAssetsPlugin({
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: { disable: true }, // 这里是个大坑，稍后会提到
                    mergeLonghand: true,
                    discardComments: {
                        removeAll: true // 移除注释
                    }
                },
                canPrint: true
            })
        ]
    },
    plugins: [
        // 代码体积分析模块
        new BundleAnalyzerPlugin({
            openAnalyzer: false, // 不使用8888端口
            analyzerMode: "static" // 为分析生成静态的html文件
        })
    ]
});
