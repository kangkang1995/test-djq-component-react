const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const image = require('gulp-image');
const stripDebug = require('gulp-strip-debug');

const minimist = require('minimist');
const child_process = require('child_process');
const fs = require('fs');

const path = require('path');
const pack = require('./package');

const { ver } = minimist(process.argv.slice(2));
if (!/^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/.test(ver)) {
  throw "nonstandard version";
}

const nextVersion = getNextVersion();

// 配置参数
const config = {
  srcPath: path.resolve(__dirname, './src/component'), // 源目录
  buildPath: path.resolve(__dirname, './build'),       // 目标目录
  copyPath: [],                                        // 将会复制到目标目录
  package: {
    "name": pack.name,
    "version": nextVersion,
    "description": pack.description,
    "main": pack.main,
    "author": pack.author,
    "license": pack.license,
    "publishConfig": {
      "registry": "http://47.96.255.76:8081/repository/djq-npm-hosted/" // 发布源
    },
    "dependencies": pack.dependencies
  }
};

// 清空目标目录
const cleanBuild = () => gulp.src(config.buildPath, {read: false, allowEmpty: true}).pipe(clean());

// 处理tsx 生成 js 文件到目标目录
const buildtsx = () => {
  return tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(stripDebug())
    .pipe(gulp.dest(config.buildPath));
}

// 处理scss 生成 css 文件到目标目录
const buildscss = () => {
  return gulp.src(`${config.srcPath}/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.buildPath));
}

// 处理图片资源
const buildimage = () => {
  return gulp.src([`${config.srcPath}/**/*.png`, `${config.srcPath}/**/*.jpg`, `${config.srcPath}/**/*.gif`, `${config.srcPath}/**/*.jpeg`])
  .pipe(image())
  .pipe(gulp.dest(config.buildPath));
}

// 拷贝 资源
const copyStatic = (done) => {
  if (!config.copyPath.length) return done();

  return gulp.src(config.copyPath)
  .pipe(gulp.dest(config.buildPath))
}

// 生成package.json 并 发布npm包 
const publish = (done)=>{
  fs.writeFileSync(`${config.buildPath}/package.json`, JSON.stringify(config.package, "", "\t"));
  // 发布npm包
  console.log(child_process.execSync('cd build && npm publish', { encoding: "utf8" }));
  return done();
}

// 获取下一个npm版本号
function getNextVersion(){
  // 假设git的版本号为 x.y.z npm的版本号则去x.y.(取x.y的最新版本+1)  
  //例子
  // current：20.1.0
  // next： 20.1.1
  let versionsStr = child_process.execSync(`npm view ${pack.name} versions`, { encoding: "utf8" });
  const xyz = ver.split('.');
  const x = xyz[0];
  const y = xyz[1];

  const re = new RegExp(`${x}.${y}.[0-9]{1,}`, "g")
  const versions = versionsStr.match(re) || [];
  const currentZ = versions.reduce((prevZ, nextVersion) => {
    const item = nextVersion.split('.')
    const nextZ = Number(item[2]);

    if(item[0] == x && item[1] == y && nextZ > prevZ) {
      return nextZ 
    }else {
      return prevZ
    }
  }, -1)

  return `${x}.${y}.${Number(currentZ) + 1}`;
}

//构建 build
const build = gulp.series(cleanBuild, gulp.parallel(buildtsx, buildscss, buildimage, copyStatic));

// 生产模式构建
gulp.task('default', gulp.series(build, publish))

// 构建并发布npm包 gulp --ver [git 版本分支号]