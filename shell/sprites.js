/**
 * 雪碧图制作脚本
 * 将指定目录下 png 图合为雪碧图并生成对应 less 文件
 * */
const fs = require('fs')
const path = require('path')
const Spritesmith = require('spritesmith')
const { _resolve } = require("./common")

// 入口目录 (相对当前目录.)
const entryDir = '../images/live/tabbar'

// 根据输入路径获取目录下所有png图片
function getFilenames(startDir) {
  const images = []
  const filepath = fs.readdirSync(startDir).map(file => path.join(startDir, file));

  filepath.forEach(filePath => {
    // 如果是 png 图片 push 到 imgMap
    // 排除雪碧图
    (/\.png$/.test(filePath) && !/sprite\.png$/.test(filePath)) && images.push(filePath)
  })

  return images
}

/**
 * css 模板
 * options: {
 *   sprite_path: string 图片路径
 *   sprite_width: number 合成图宽
 *   sprite_height: number 合成图高
 *   sprites: [
 *    {
 *      name: string 图片名,
 *      with: number 图片宽 px,
 *      height: number 图片高 px,
 *      x: number x轴坐标 px,
 *      y: number y轴坐标 px
 *    }
 *   ]
 * }
 * */
function lessTempFun(options = {}) {
  // rem = 50px * 2倍图
  const className = path.basename(entryDir)
  const rem = 50 * 2
  const S_W = options.sprite_width / rem;
  const S_H = options.sprite_height / rem;
  const preSprites = options.sprites.map(sprite => {
    const N = sprite.name;
    const W = sprite.width / rem;
    const H = sprite.height / rem;
    const Y = sprite.y / rem;

    return `&.${N} {
      width: ${W}rem;
      height: ${H}rem;
      background-position:left -${Y}rem;
    }`;
  })

  return`.${className} {
    display: inline-block;
    vertical-align:middle;
    .bg-image('${options.sprite_path}');
    background-size: ${S_W}rem ${S_H}rem;
    \n
    ${preSprites.join('\n')}
  }`;
}

function transformCoordinates(obj = {}) {
  let arr = []
  for (const key in obj) {
    const {x, y, width, height } = obj[key];
    arr.push({
      name: path.basename(key, '.png'),
      width,
      height,
      x,
      y,
    })
  }
  return arr
}

function createSprite() {
  // 图片数组
  const sprites = getFilenames(_resolve(entryDir))

  // 如果为空数组报错处理
  if(!sprites.length) {
    throw(`${entryDir} 目录下没有 待转png图片`)
  }

  // 启动转换
  Spritesmith.run({
    src: sprites,
    // algorithm: 'top-down',
    algorithm: 'top-down',
    // algorithm: 'left-right',
    padding: 2,
  }, (err, result) => {
    if (err) throw err;
    const { image, coordinates, properties } = result
    const output = _resolve(`${entryDir}/sprite.png`)

    // 将组合完成的雪碧图输出到入口目录
    fs.writeFileSync(output, image);

    // 组合 options
    const options = {
      sprite_path: `/sprites/${path.basename(entryDir)}/sprite.png`,
      sprite_width: properties.width,
      sprite_height: properties.height,
      sprites: transformCoordinates(coordinates)
    }

    // 生成css文件
    const lessStr = lessTempFun(options)

    // 将less 输入到入口目录(记得自己复制到项目中)
    fs.writeFileSync(_resolve(`${entryDir}/sprite.less`), lessStr);
  });
}

createSprite()
