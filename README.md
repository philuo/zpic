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
const imgData = await compress(await getImgData(imgSrc), 0, 0, 92);
const url = URL.createObjectURL(
    new Blob([imgData], { type: 'image/jpeg' })
);
```
