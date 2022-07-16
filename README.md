# 压图工具`zpic`

## Power by [Mozjpeg](https://github.com/mozilla/mozjpeg)

```ts
import { compress } from 'zpic';

async function getImgData(src: string) {
    const img = new Image();
    img.src = src;
    await new Promise(resolve => img.load = resolve);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    [canvas.width, canvas.height] = [img.width, img.height];
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const imgSrc = '<base64>/uri';
const image = await getImgData(imgSrc);
const imgData = await compress(image.data, image.width, image.height, 92);
const url = URL.createObjectURL(
    new Blob([imgData], { type: 'image/jpeg' })
);
```


### 异步导入

```ts
let util: typeof import('zpic').compress;
async function initCompressor() {
    if (!util) {
        util = (await import('zpic')).compress;
    }

    return util;
}

async function compressImg() {
    await initCompressor();

    // do your job
}
```

### Worker中使用

- 开发环境引用本地Worker, 生产环境引用CDN Worker

```ts
import { compressWorker } from 'zpic';

const worker = compressWorker();
const image = await getImgData(imgSrc); // 请传递图片源(请保证图片时同源的)

worker.postMessage({
    type: 'job',
    data: image, // { data: ArrayBuffer, width, height }
    quality: 75  // 可选图片质量, 默认75
});

worker.addEventListener('message', ({ data }) => {
    /**
     * {
     *     buffer: Uint8Array(105715) [...]
     *     size: 105715
     *     src: "blob:http://192.168.31.244:3000/7ff5dc98-6ba5-42e8-be1a-365aba45e63c"
     *     usedTime: 710
     * }
     */
});
```
