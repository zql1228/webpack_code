const path=require("path")//nodejs核心模块。专门用来处理路径问题
const ESLintPlugin=require("eslint-webpack-plugin")//引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports={
    //入口
    entry:'./src/main.js',
    //出口
    output:{
        //__dirname代表当前文件的文件夹目录
        path:path.resolve(__dirname,"../dist"),//绝对路径
        filename:'js/main.js',//文件名
        clean:true//清空上次打包的内容  
    },
    
    //loader加载器
    module:{
        rules:[            
            {
                test: /\.css$/i,
                use: [//use从后往前执行
                MiniCssExtractPlugin.loader, 
                    "css-loader"],//将css资源编译成commonjs模块到js中
              },
              {
                test: /\.less$/i,
                use: [
                  // compiles Less to CSS
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  'less-loader',
                ],
              },
              {
                test: /\.s[ac]ss$/i,
                use: [
                  // 将 JS 字符串生成为 style 节点
                  MiniCssExtractPlugin.loader,
                  // 将 CSS 转化成 CommonJS 模块
                  'css-loader',
                  // 将 Sass 编译成 CSS
                  'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                type: 'asset',
               parser: {
                 dataUrlCondition: {
                   maxSize: 10 * 1024 // 10kb 小于10kb的文件转base64 优点减少请求，缺点压缩后占用空间变大
                 }
               },
               generator: {
                //设置打包文件目录
                filename: 'images/[hash:10][ext][query]',//hash:10表示hash值只取10位
              },
            },
            {
              test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
              type: 'asset/resource',
             generator: {
              //设置打包文件目录
              filename: 'media/[hash:10][ext][query]',//hash:10表示hash值只取10位
            },
          },
          {
            test: /\.js$/,
            exclude: /node_modules/, // 排除node_modules代码不编译
            loader: "babel-loader",//用于将 ES6 语法编写的代码转换为向后兼容的 JavaScript 语法
          },
        ]
    },
    //插件
    plugins:[
      new ESLintPlugin({
        context:path.resolve(__dirname,'../src')}),
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname,"../public/index.html")
      }),
      //本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。
      new MiniCssExtractPlugin({
        filename:"css/main.css"
      })
    ],
    //模式
    mode:"production"

}