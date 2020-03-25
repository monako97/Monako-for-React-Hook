const merge = require('webpack-merge');
const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const Webpack = require('webpack');
const common = require('./webpack.common.js');
//获取本机ip地址
function getIPAdress() {
    let interfaces = require('os').networkInterfaces();
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && alias.address.indexOf('169.254.') === -1 && !alias.internal) {
                return alias.address;
            }
        }
    }
}
let ip = getIPAdress();
getIPAdress = null;
module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        openPage: 'index.html', //指定第一次打开的路径
        compress: false, //启用 gzip 压缩
        host: "localhost",
        port: 1314,
        inline: true,
        hot: true, //启用热替换模块
        historyApiFallback: true,
        proxy: {
            changeOrigin: true
        },
        open: false,
        clientLogLevel: "none", // 不显示log
        quiet: true, // 不显示devServer信息
        overlay: true // 编译出现错误时将错误显示在页面中
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin(),
        // 进度条美化
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: ['Application running in http://localhost:1314/']
            },
            clearConsole: true
        })
    ],
});
