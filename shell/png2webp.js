const sharp = require("sharp");
const sizeOf = require('image-size')
const { getCommandParams, isDir } = require('./common')
const fs = require("fs");
const path = require('path');

/**
 * avif     是否转 avif (true | false)
 * webp     是否转 webp (true | false)
 * thumb    是否生成缩略图 (true | false)
 * quality  图片质量 系数 1~100
 * dir      需要转换的图片目录
 * size     超过 size 大小才转换 默认 20kb
 * */
const { avif = false, webp = true, thumb = false, quality = 100, size = 1024, dir = '../public/images' } = getCommandParams()

console.log(avif, webp, thumb, quality, size, dir)

// 判断 path 路径是否为文件夹
const imgReg = /.(png|jpg|jpeg)$/;

/**
 * / 1 获取指定目录以及子目录下所有符合条件的图片路径
 * png jpg jpeg 的非缩略图(暂不做)
 */
const getDirFilenames = () => {
  const imgMap = []
  function getFilenames(startDir) {
    const filepath = fs.readdirSync(startDir).map(file => path.join(startDir, file));

    filepath.forEach(filePath => {
      // 如果是文件夹 递归
      if (isDir(filePath)) {
        getFilenames(filePath)
      } else {
        // 如果是 png jpg jpeg图片 并且不是缩略图 push 到 imgMap
        imgReg.test(filePath) && !/\.s\.(png|jpeg|jpg|webp)$/.test(filePath) && imgMap.push(filePath)
      }
    })
  }
  getFilenames(dir)

  return imgMap
};

/**
 * 2 对所有需要转换的图片 分类
 * */
function filterNeedTransImages(imgPaths = []) {
  const NeedTransImages = {
    avif: [],
    webp: [],
    thumbnail: []
  }

  for (const path of imgPaths) {
    // 如果 转 avif
    if (avif) {
      const avifImgPath = path.replace(/\.(png|jpg|jpeg)$/g, '.avif')
      const exists = fs.existsSync(avifImgPath);
      // 如果不存在 则添加到待转数组中
      !exists && NeedTransImages.avif.push(path)
    }
    // 如果 转 webp
    if (webp) {
      const webpImgPath = path.replace(/\.(png|jpg|jpeg)$/g, '.webp')
      const exists = fs.existsSync(webpImgPath);
      // 如果不存在 则添加到待转数组中
      !exists && NeedTransImages.webp.push(path)
    }

    // 如果 转 缩略图
    if (thumb) {
      const thumbImgPath = path.replace(/\.(png|jpg|jpeg)$/g, $1 => '.s' + $1)
      // 如果不存在 则添加到待转数组中
      const exists = fs.existsSync(thumbImgPath);
      !exists && NeedTransImages.thumbnail.push(path)
    }
  }

  return NeedTransImages;
}

// png jep jpeg 转 avif
function png2avif(pname = '') {
  const imgUrl = pname;

  if (!pname) return;
  const start = new Date().getTime()
  return new Promise((resolve, reject) => {
    fs.readFile(imgUrl, (err, inputBuffer) => {
      if (err) reject(err);

      if(inputBuffer.length > size) {
        const toFileName = imgUrl.replace(/\.(png|jpg|jpeg)$/g, '.avif')
        sharp(inputBuffer)
          .avif({quality: Number(quality), speed: 8})
          .toFile(toFileName, (err, info) => {
            if (err) {
              console.log('图片', `${imgUrl}`, '转换失败')
              reject(err)
            } else {
              const end = new Date().getTime()
              console.log('图片', `${imgUrl}.avif 质量${quality}%`, '转换成功', '耗时', (end - start) / 1000, '秒')
              resolve(info)
            }
          })
      } else {
        console.log('图片', `${imgUrl}`, '小于', size  / 1024, 'kb 无需转换')
        reject(err)
      }
    })
  })
}

// png jep jpeg 转 webp
function png2webp(pname = '') {
  const imgUrl = pname;

  if (!pname) return;
  const start = new Date().getTime()
  return new Promise((resolve, reject) => {
    fs.readFile(imgUrl, (err, inputBuffer) => {
      if (err) reject(err);
      // 如果待转图片 大于 指定的大小size 则转换
      if(inputBuffer.length > size) {
        const toFileName = imgUrl.replace(/\.(png|jpg|jpeg)$/g, '.webp')
        sharp(inputBuffer)
          .webp({quality: Number(quality), speed: 8})
          .toFile(toFileName, (err, info) => {
            if (err) {
              console.log('图片', `${imgUrl}`, '转换失败')
              reject(err)
            }
            else {
              const end = new Date().getTime()
              console.log('图片', `${toFileName} 质量${quality}%`, '转换成功', '耗时', (end - start) / 1000, '秒')
              resolve(info)
            }
          })
      } else {
        console.log('图片', `${imgUrl}`, '小于', size  / 1024, 'kb 无需转换')
        reject(err)
      }
    })
  })
}

// png jep 生成 缩略
function png2thumb(pname = '') {
  const imgUrl = pname;

  if (!pname) return;
  const { height } = sizeOf(imgUrl)

  return new Promise((resolve, reject) => {
    fs.readFile(imgUrl, (err, inputBuffer) => {
      if (err) reject(err);

      if(inputBuffer.length > size) {
        sharp(inputBuffer)
          .resize({fit: sharp.fit.outside, height: parseInt(height / 10)})
          .toFile(imgUrl.replace(/\.(png|jpg|jpeg)$/, $1 => '.s'+ $1), (err, info) => {
            if (err) {
              console.log('图片', `${imgUrl}`, '转换失败')
              reject(err)
            }
            else {
              resolve(info)
            }
          })
      } else {
        reject()
      }
    })
  })
}

// 3 开始转换
function initTransfer(files = [], type = 'avif') {
  if (files.length === 0) return;
  console.log('开始转换')

  const lastFile = files.pop();

  spliceImages(lastFile)

  function spliceImages(file = []) {
    if (!file) {
      console.log('全部转完')
      return;
    }

    console.log('还剩', files.length, '张')

    let p = null

    if (type === 'avif') {
      p = png2avif
    } else if (type === 'webp') {
      p = png2webp
    } else if (type === 'thumb') {
      p = png2thumb
    }

    p && p(file)
      .then((imgInfo) => {
        if (files.length) spliceImages(files.pop())
      })
      .catch(() => {
        if (files.length) spliceImages(files.pop())
      })
  }
}

console.log('=================')
const imgMap = getDirFilenames()
const filterMap = filterNeedTransImages(imgMap)
console.log('共需转换', filterMap.webp.length, '张 webp 图片')
console.log('共需转换', filterMap.avif.length, '张 avif 图片')
console.log('共需转换', filterMap.thumbnail.length, '张 thumbnail 图片')

initTransfer(filterMap.avif, 'avif')
initTransfer(filterMap.webp, 'webp')
initTransfer(filterMap.thumbnail, 'thumb')

console.log('=================')
