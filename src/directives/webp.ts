import { Directive } from 'vue';
import { checkWebp } from '@/utils/common';

// 给支持webp的浏览器设置标识，供css背景图片使用
const isWebp:boolean = checkWebp()

const webp: Directive = {
    beforeMount(el: HTMLImageElement) {
        const src: string | null = el.getAttribute('src');

        let origin_source: string = '';
        if (!src) return '';

        // 如果是绝对路径 不做修改
        if (/^http|https:/g.test(src)) origin_source = src;

        // 如果是图片并且浏览器支持webp
        else if (/.(png|jpg|hpeg)$/.test(src) && isWebp) {
            origin_source = src.replace(/\.(png|jpe?g)$/g, '.webp')
        }

        el.setAttribute('src', origin_source + '?v=' + __VERSION__);
    }
};

export default webp;