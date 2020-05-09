module.exports = {
    plugins: [
        require('postcss-flexbugs-fixes'),
        require('autoprefixer')({
            browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
            ],
            flexbox: 'no-2009',
            overrideBrowserslist: ['> 0.15% in CN']
        }), //引入
        // require('postcss-plugin-px2rem')({
        //     rootValue: 75, //换算基数,默认100，可以设置为75这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了
        //     remUnit: 75, //设计图的宽度/10 比如你的设计图是1920的宽度 这里你就1920/10=192
        //     exclude: /(node_modules)/,  // 排除文件夹 /(node_module)/。如果想把UI框架内的px也转换成rem，设为false
        // })
    ]
};