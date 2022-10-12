const SVGIcons2SVGFontStream = require('svgicons2svgfont');
const svg2ttf = require('svg2ttf');
const fs = require('fs');
const path = require("path");
const {_resolve, getBuildVersion} = require("./common");

// 输入目录(目录下所有的svg都会转为字体文件)
// const entryDir = '../images/T01/svg-icons'
const entryDir = '../public/images/live/font'

// 输出目录
// const outDir = '../font/T01'
const outDir = '../public/font'

// 字体名称
const fontName = 'iconfont'

/**
 * svg转ttf字体文件
 * */
function toTTF() {
  let ttf = svg2ttf(fs.readFileSync(`${outDir}/${fontName}.svg`, 'utf8'), {});
  fs.writeFile(`${outDir}/${fontName}.ttf`, new Buffer(ttf.buffer), (err, data) => {
    if (err) {
      console.log(err);
      return false;
    }
    console.log('svgfont.ttf 生成成功')
  });
}

/**
 * 生成唯一 unicode 码
 * */
function toChatCode(str = '') {
  let sum = 10000;
  const ln = str.length;
  for (let i = 0; i < ln; i++) {
    sum += str.charCodeAt(i)
  }
  return String.fromCharCode(sum)
}

/**
* 生成 iconfont less
 * */
function createLess(icons = []) {
  const iconClass = icons.map(icon => `&.icon-${icon.name}:before { content: "${icon.unicode}"; }`)
  const lessTemp = `
    @font-face {
      font-family: "iconfont";
      src: url('@{fontRoot}/${path.basename(outDir)}/${fontName}.ttf?v=${getBuildVersion()}') format('truetype'); /* IE9*/
    }
    
    [class^="icon-"], [class*=" icon-"] {
      display: inline-block;
      line-height: 1;
      font-family: '${fontName}' !important;
      font-style:normal;
      vertical-align: center;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      ${iconClass.join('\n')}
    }
  `

  // 将less 输入到输出目录(记得自己复制到项目中)
  fs.writeFileSync(_resolve(`${outDir}/${fontName}.less`), lessTemp);
}


function createSvgToIconFont() {
  // 获取输入目录下所有 svg 图标路径
  const paths = fs.readdirSync(entryDir).map(file => path.join(entryDir, file));

  // 存储 svg icon信息
  let iconsData = []

  // 创建读写流
  const fontStream = new SVGIcons2SVGFontStream({
    fontName: fontName,
    normalize: true,
    fontHeight: 25
  });

  fontStream
    .pipe(fs.createWriteStream(`${outDir}/${fontName}.svg`))
    .on('finish', () => {
      console.log('svg 合并成功!');
      // 生成TTF字体文件
      toTTF()

      // 生成less
      createLess(iconsData)
    })
    .on('error', function (err) {
      console.log(err);
    });

  paths.forEach(p => {
    const svg_name = path.basename(p, '.svg')
    const glyph = fs.createReadStream(p);
    const unicode = [toChatCode(svg_name)];
    iconsData.push({
      unicode: unicode[0],
      name: svg_name
    })
    glyph.metadata = {
      unicode,
      name: svg_name
    }

    fontStream.write(glyph);
  })

  fontStream.end();
}

createSvgToIconFont()
