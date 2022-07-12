const path=require("path")//nodejs核心模块。专门用来处理路径问题
module.exports={
    //入口
    entry:'./src/main.js',
    //出口
    output:{
        //__dirname代表当前文件的文件夹目录
        path:path.resolve(__dirname,"dist"),//绝对路径
        filename:'js/main.js',//文件名
    },
    
    //loader加载器
    module:{
        rules:[            
            {
                test: /\.css$/i,
                use: [//use从后往前执行
                    "style-loader", 
                    "css-loader"],//将css资源编译成commonjs模块到js中
              },
              {
                test: /\.less$/i,
                use: [
                  // compiles Less to CSS
                  'style-loader',
                  'css-loader',
                  'less-loader',
                ],
              },
              {
                test: /\.s[ac]ss$/i,
                use: [
                  // 将 JS 字符串生成为 style 节点
                  'style-loader',
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
                filename: 'images/[hash:10][ext][query]',//hash:10表示hash值只取10位
              },
            },
            
        ]
    },
    //插件
    plugins:[

    ],
    //模式
    mode:"development"

}