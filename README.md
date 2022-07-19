# Util of image compressing `zpic`

## Power by [Mozjpeg](https://github.com/mozilla/mozjpeg)

 - `Worker + WebAssembly` 本地压图, 图片压缩无网络传输
 - support in browser (ios 10+, chrome 82+)

## How to use

使用`indexedDB`缓存了Worker所需的BufferSource, 默认从私人CDN: `https://cdn.plog.top/libs` 导入。
需要替换为你自己的CDN, 或者你可以修改源码为加载本地文件的形式。**后续流量大了私人CDN将关闭！**

### 同步导入

```ts
import { compress } from 'zpic';

// attention: src must be a same-origin source
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
const result = await compress(image.data, image.width, image.height, 92);
const url = URL.createObjectURL(new Blob([result.buffer], { type: 'image/jpeg' }));
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
