const path=require("path")//nodejs核心模块。专门用来处理路径问题
const os=require("os")
const ESLintPlugin=require("eslint-webpack-plugin")//引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin=require("terser-webpack-plugin") //webpack内置了不需要安装
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const threads=os.cpus().length
module.exports={
    //入口
    entry:'./src/main.js',
    //出口
    output:{
        //__dirname代表当前文件的文件夹目录
        path:undefined, //path.resolve(__dirname,"../dist"),//绝对路径
        filename:'js/main.js',//文件名
         clean:true//清空上次打包的内容  注释了是因为开发服务不会输出资源
    },
    
    //loader加载器
    module:{
        rules:[     
          {
            oneOf:[//每个文件只能被其中一个loader处理
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
            // exclude: /node_modules/, // 排除node_modules代码不编译
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            use:[
              {
                loader:"thread-loader",
                options:{
                  workers:threads
                }
                
              },
              {
                loader: "babel-loader",//用于将 ES6 语法编写的代码转换为向后兼容的 JavaScript 语法
                options:{
                  cacheDirectory: true, // 开启babel编译缓存
                  cacheCompression: false, // 缓存文件不要压缩
                  plugins:["@/babel/plugin-transform-runtime"],//减少图片体积
                }
              }
              
            ]
           
          },
            ]
          }       
           
        ]
    },
    //插件
    plugins:[
      new ESLintPlugin({
        //检查指定文件的根目录
        context:path.resolve(__dirname,'../src'),
        exclude: "node_modules", // 默认值
        //缓存目录
        cacheLocation:path.resolve(__dirname,'../node_modules/.cache/.eslintcache')
      }),
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname,"../public/index.html")
      })
      
    ],
    optimization: {
      minimize: true,
      minimizer:[
        // css压缩也可以写到optimization.minimizer里面，效果一样的
      new CssMinimizerPlugin(), //css压缩
      new TerserPlugin({
        parallel: threads // 开启多进程 提升打包速度
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ]
    },
    //开发服务器  //不会输出资源，在内存中编译打包
    devServer: {
      host: "localhost", // 启动服务器域名
      port: "3000", // 启动服务器端口号
      open: true, // 是否自动打开浏览器
      hot:true,//热模块替换 开启HMR功能（只能用于开发环境，生产环境不需要了）
    },
    //模式
    mode:"development",
    devtool: "cheap-module-source-map",

}