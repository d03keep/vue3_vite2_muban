const fs = require('fs')
const path = require('path')
/**
 * 获取命令行参数
 */
function getCommandParams() {
    // CLI参数从第三个开始获取
    const args = process.argv.slice(2);
    const result = {};
    const REG = /^--([^-]+)/;

    for (let i = 0; i < args.length; i++) {
        const match = REG.exec(args[i]);
        // 判断当前参数是否--开头，如果--开头才算合法参数
        if (match) {
            const key = match[1];
            // 如果下个参数也是--开头，本参数则值为空
            if (REG.test(match[i + 1])) {
                // 下一个参数
                result[key] = '';
            } else {
                // 直接跳过下一个参数
                i++;
                result[key] = (args[i] === 'true' ? true : args[i] === 'false' ? false : args[i]) || '';
            }
        }
    }

    return result;
}

/**
 * 判断 path 路径是否为文件夹
 */
const isDir = path => fs.lstatSync(path).isDirectory();

const getBuildVersion = () => {
    const date = new Date();
    const M = date.getMonth() + 1
    const d = date.getDate()
    const h = date.getHours()
    const m = date.getMinutes()


    return [M, d, h, m].join('.');
}

const _resolve = filePath => path.resolve(__dirname, filePath);


module.exports = {
    getCommandParams,
    isDir,
    getBuildVersion,
    _resolve
}
