/**
 * @Version 1.0.0
 * @Author ZhenYuTsai
 * @Descripttion 整个项目的打包配置流程
 * @Date 2021-07-05 11:09:12
 */
const gulp = require('gulp')
const cssmin = require('gulp-cssmin')
const less = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const webServer = require('gulp-webserver')
const fileInclude = require('gulp-file-include')

// 创建一个打包css的任务
const cssHandler = function(){
  return gulp
    .src('./src/css/*.css') // 找到源文件
    .pipe(autoprefixer()) // 自动添加css前缀
    .pipe(cssmin()) // 执行压缩任务
    .pipe(gulp.dest('./dist/css/')) // 放到指定目录下
}

// 创建一个打包less的任务
const lessHandler = function(){
  return gulp
    .src('./src/less/*.less') // 找到源文件
    .pipe(less()) // 转换成css
    .pipe(autoprefixer()) // 自动添加css前缀
    .pipe(cssmin()) // 执行压缩任务
    .pipe(gulp.dest('./dist/less/')) // 放到指定目录下
}

// 创建一个打包js的任务
const jsHandler = function(){
  return gulp
    .src('./src/js/*.js') // 找到源文件
    .pipe(babel({ presets: ['@babel/env'] })) // 转换成es5
    .pipe(uglify()) // 执行压缩任务
    .pipe(gulp.dest('./dist/js/')) // 放到指定目录下
}

// 创建一个打包html的任务
const htmlHandler = function(){
  return gulp
    .src('./src/pages/*.html') // 找到源文件
    .pipe(fileInclude({
      prefix: '@-@', // 自定义标识符
      basepath: './src/components',// 基准目录,你的组件文件夹在那
    }))// 根据你的配置导入对应的HTML片段
    .pipe(htmlmin({
      removeComments: true, // 清除HTML注释
      collapseWhitespace: true, // 表示移除空格和换行
      removeEmptyAttributes: true, // 表示移除空的属性(仅限于原生属性)
      collapseBooleanAttributes: true, // 移除Boolean类型的多余值
      removeAttributeQuotes: true, // 移除属性单一值的双引号
      minifyCSS: true, // 压缩内嵌式css(只能基本压缩不能添加前缀)
      minifyJS: true, // 压缩内嵌式js(只能基本压缩不能转码)
      removeStyleLinkTypeAttributes: true, // 移除style标签和link标签的type属性
      removeScriptTypeAttributes:true, // 移除script标签上的type属性
    })) // 执行压缩任务
    .pipe(gulp.dest('./dist/pages/')) // 放到指定目录下
}

// 创建一个打包assets的任务(视频等其他无需压缩的资源是同样的方式)
const assetsHandler = function(){
  return gulp
    .src('./src/assets/**/*') // 找到源文件
    .pipe(gulp.dest('./dist/assets/')) // 放到指定目录下
}

// 创建删除原先的打包文件夹
const delHandler = function(){
  return del('./dist')
}

// 创建一个启动服务器的任务
const webServerHandler = function(){
  return gulp
    .src('./dist')
    .pipe(webServer({
      host: 'localhost', // 域名
      port: '8080', // 端口号
      livereload: true, // 当文件修改时,是否自动刷新
      open: './pages/index.html' // 默认打开文件, 从dist往后书写
    }))
}

// 创建一个监控任务
const watchHandler = function(){
  gulp.watch('./src/css/*.css', cssHandler)
  gulp.watch('./src/less/*.less', lessHandler)
  gulp.watch('./src/js/*.js', jsHandler)
  gulp.watch('./src/pages/*.html', htmlHandler)
  gulp.watch('./src/components/*.html', htmlHandler)
  gulp.watch('./src/assets/**/*', assetsHandler)
}

module.exports.build = gulp.series(
  delHandler,
  gulp.parallel(cssHandler,lessHandler,jsHandler,htmlHandler,assetsHandler)
)

module.exports.default = gulp.series(
  delHandler,
  gulp.parallel(cssHandler,lessHandler,jsHandler,htmlHandler,assetsHandler),
  webServerHandler,
  watchHandler
)

