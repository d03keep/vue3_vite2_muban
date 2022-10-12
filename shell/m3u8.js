const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const path = require('path')

ffmpeg.setFfmpegPath(ffmpegPath);

// const videoName = 'login_bg'
const videoName = 'a03-promotion'
const filePath = path.join(__dirname, `../video/${videoName}.mp4`); // 视频地址


ffmpeg(filePath)
    .videoCodec('libx264') // 设置视频编解码器
    // .videoCodec('libx265') // 设置视频编解码器
    // .audioCodec('libfaac') // 设置 音频解码器
    .format('hls') // 输出视频格式
    .outputOptions('-hls_list_size 0') //  -hls_list_size n:设置播放列表保存的最多条目，设置为0会保存有所片信息，默认值为5
    .outputOption('-hls_time 1') // -hls_time n: 设置每片的长度，默认值为2。单位为秒
    .output(path.join(__dirname, `../video/${videoName}.m3u8`)) // 输出文件
    .on('progress', (progress) => { // 监听切片进度
        console.log(progress.timemark)
    })
    .on('end', () => { // 监听结束
        console.log("视频切片完成");
    })
    .run(); // 执行