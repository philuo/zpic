export interface EncodeOptions {
    quality: number;
    baseline: boolean;
    arithmetic: boolean;
    progressive: boolean;
    optimize_coding: boolean;
    smoothing: number;
    color_space: 1 | 2 | 3;
    quant_table: number;
    trellis_multipass: boolean;
    trellis_opt_zero: boolean;
    trellis_opt_table: boolean;
    trellis_loops: number;
    auto_subsample: boolean;
    chroma_subsample: number;
    separate_chroma_quality: boolean;
    chroma_quality: number;
}

export interface CompressResult {
    /** 压缩文件的内存数据 */
    buffer: ArrayBuffer;
    /** 压缩耗时(ms) */
    usedTime: number;
    /** 压缩后的文件体积(Byte) */
    size: number;
}

/**
 * 新建压图线程(Worker)
 */
export function compress(data: ImageData, quality?: number): Promise<CompressResult>;

/**
 * 刷新Worker依赖的BufferSource
 * @param origin CDN链接 https://cdn.plog.top/libs
 * @param key 指定文件名 zpic.min.js | zpic.js | zpic.wasm
 */
export function refreshBufferSource(origin: string, key: string): Promise<ArrayBuffer>;
