let zpicIns;

async function compress(data, width, height, quality = 75) {
    if (!zpicIns) {
        zpicIns = await (await import('./zpic')).default;
    }

    return zpicIns.encode(data, width, height, {
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
}

self.addEventListener('message', async ({ data }) => {
    if (data.type === 'job') {
        const { data: imgData, quality = 75 } = data;
        const startTime = Date.now();
        const result = await compress(imgData.data, imgData.width, imgData.height, quality);

        self.postMessage({
            usedTime: Date.now() - startTime,
            buffer: result.buffer,
            src: URL.createObjectURL(new Blob([result.buffer], { type: 'image/jpeg' })),
            size: result.length
        }, [result.buffer]);
    }
});
