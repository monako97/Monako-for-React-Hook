# 一个基于ReactHooks的全局提醒插件

![](../markdown/img/1.gif)

__1. 安装：react-hooks-toast__

```shell
npm i react-hooks-toast --save --dev
# 或
yarn add react-hooks-toast --save --dev
```

__2. 使用__

```javascript
import Toast from "react-hooks-toast";

Toast.info("Info", 2000, true);
Toast.success("操作成功", 2000);
Toast.danger("发送错误", 2000);
Toast.loading("Loading", 2000);
Toast.warning("警告", 2000);
Toast.primary("OK", 2000);
```

__3. webpack配置：__

```javascript
module: {
    rules: [
        {
            test: /\.css$/,
            include: [
                path.join(__dirname, '../node_modules/react-hooks-toast')
            ],
            use: ['style-loader', 'css-loader', 'postcss-loader' ],
        },
        {
            test: /\.(eot|ttf|woff|woff2|svg)$/,
            loader: 'url-loader',
            options: { limit: 5000, name: 'static/fonts/[name].[ext]' },
            include: [
                path.join(__dirname, '../node_modules/react-hooks-toast')
            ]
        }
    ]
}
```

