const path=require("path")//nodejs核心模块。专门用来处理路径问题
const os=require('os') //nodejs核心模块
const ESLintPlugin=require("eslint-webpack-plugin")//引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin=require("terser-webpack-plugin")
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");//图片压缩
const threads = os.cpus().length;
function getStyleLoader(preprocessor){//传入预处理器
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",//指定加载器
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        }
      }
    },
    preprocessor
    ].filter(Boolean)

}
module.exports={
    //入口
    entry:'./src/main.js',
    //出口
    output:{
        //__dirname代表当前文件的文件夹目录
        path:path.resolve(__dirname,"../dist"),//绝对路径
        filename:'js/main.js',//文件名
        chunkFilename:'js/[name]/chunk.js',//动态导入输出资源命名方式
        // assetModuleFilename:"media/[name].[hash][ext]",//图片，字体等资源命名方式（注意用hash)
        clean:true//清空上次打包的内容  
    },
    
    //loader加载器
    module:{
        rules:[
          {
          oneOf:[
            {
              test: /\.css$/i,
              use: getStyleLoader()
            },
            {
              test: /\.less$/i,
              use:getStyleLoader("less-loader"),
            },
            {
              test: /\.s[ac]ss$/i,
              use: getStyleLoader("sass-loader")
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
              loader: "thread-loader", // 开启多进程
              options: {
                workers: threads, // 数量
              },
            },
            {
              loader: "babel-loader",//用于将 ES6 语法编写的代码转换为向后兼容的 JavaScript 语法
              options:{
                cacheDirectory:true,//开启babel编译缓存
                cacheCompression:false,//缓存文件不要压缩
                plugins:["@babel/plugin-transform-runtime"],//减少代码体积
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
        context:path.resolve(__dirname,'../src'),
        exclude: "node_modules", // 默认值
        cache: true, // 开启缓存
        //缓存目录
        cacheLocation:path.resolve(__dirname,'../node_modules/.cache/.eslintcache')
      }),
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname,"../public/index.html")
      }),
      //本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。
      new MiniCssExtractPlugin({
        filename:"css/main.css"
      }),
    ],
    optimization:{
      minimize:true,
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
      ],
      //代码分割配置
      splitChunks:{
        chunks:"all",//对所有模块都进行分割
      }
    },
    //模式
    mode:"production",
    devtool: "source-map",//从构建后代码位置找到映射后源代码位置，便于我们更清楚的找到代码出错的位置
    //SourceMap（源代码映射）是一个用来生成源代码与构建后代码一一映射的文件的方案。
    //cheap-module-source-map 与 source-map的区别，前者只包含行映射，后者既包含行又包含列

}