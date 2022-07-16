let zpicIns;

export async function compress(data, width, height, quality = 75) {
    if (!zpicIns) {
        zpicIns = await (await import('./zpic')).default;
    }

    const startTime = Date.now();
    const result = await zpicIns.encode(data, width, height, {
        quality,
        baseline: false,
        arithmetic: false,
        progressive: true,
        optimize_coding: true,
        smoothing: 0,
        color_space: 3,
        quant_table: 3,
        trellis_multipass: false,
        trellis_opt_zero: false,
        trellis_opt_table: false,
        trellis_loops: 1,
        auto_subsample: true,
        chroma_subsample: 2,
        separate_chroma_quality: false,
        chroma_quality: 75,
    });

    return {
        usedTime: Date.now() - startTime,
        buffer: result.buffer,
        src: URL.createObjectURL(new Blob([result.buffer], { type: 'image/jpeg' })),
        size: result.length
    };
}

export function compressWorker() {
    let url;

    if (import.meta.env.DEV) {
        url = new URL('./functor.js', import.meta.url).pathname;
    }
    else {
        // 1. 直接加载 CORS worker, 估计不行
        // 2. fetch拉取文件ArrayBuffer -> Blob -> 本地链接(blob:http?s://xxx)
    }

    return new Worker(url);
}
