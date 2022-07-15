interface EncodeOptions {
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

export function compress(
    /** 图片数据 */
    data: BufferSource,
    /** 期望宽度 */
    width: number,
    /** 期望高度 */
    height: number,
    /** 期望质量 1~100, 默认75 */
    quality?: number
): Uint8Array;
