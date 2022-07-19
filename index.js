const wasmFile = 'zpic.wasm';
const glueFile = 'zpic.min.js';
const MAX_WORKER = navigator.hardwareConcurrency || 4;
let defaultCDN = 'https://cdn.plog.top/libs/';
let glueUrl, wasmBuffer;

class WorkerPool {
    static list = [];
    static add(worker) {
        worker.postMessage({ type: 'init', buffer: wasmBuffer });
        worker.addEventListener('message', ({ data }) => {
            switch (data.type) {
                case 'close':
                    this.del(worker);
                    worker = null;
                    break;
                case 'error':
                    this.del(worker);
                    worker = null;
                    break;
                default:
                    worker.isWorking = false;
            }
        });
        WorkerPool.list.push(worker);
    }
    static del(worker) {
        const index = WorkerPool.list.indexOf(worker);

        if (~index) {
            worker.terminate();
            WorkerPool.list.splice(index, 1);
            worker = null;
        }
    }
    static get() {
        for (const worker of WorkerPool.list) {
            if (!worker.isWorking) {
                return worker;
            }
        }
    }
    static async job(data, quality) {
        const { resolve, promise } = genPromise();
        const handler = ({ data }) => {
            if (!data.type) {
                resolve(data);
                worker.removeEventListener('message', handler);
                worker = null;
            }
        };
        let worker = WorkerPool.get();

        if (!worker) {
            worker = await createWorker();
        }
        if (!worker) {
            console.log('O_O, 线程不够用了, 请等一下');
            await new Promise(r => setTimeout(r, 200));
            return await WorkerPool.job(data, quality);
        }

        worker.isWorking = true;
        worker.postMessage({ type: 'job', data, quality });
        worker.addEventListener('message', handler);

        return promise;
    }
    static size() {
        return WorkerPool.list.length;
    }
}

/**
 * 刷新Worker依赖的BufferSource
 */
export function refreshBufferSource(origin, key) {
    defaultCDN = origin;

    return fetch(new URL(key, origin).toString())
        .then(res => res.arrayBuffer())
        .then(buffer => {
            addLibsCache(key, buffer);

            return buffer;
        });
}

/** 初始化Worker依赖的BufferSource */
async function initBufferSource() {
    if (!glueUrl) {
        let buffer = await getLibsCache(glueFile);

        if (!buffer) {
            buffer = await refreshBufferSource(defaultCDN, glueFile);
        }

        glueUrl = URL.createObjectURL(new Blob([buffer], { type: 'text/javascript' }));
    }
    if (!wasmBuffer) {
        wasmBuffer = await getLibsCache(wasmFile);

        if (!wasmBuffer) {
            wasmBuffer = await refreshBufferSource(defaultCDN, wasmFile);
        }
    }
}
async function createWorker() {
    await initBufferSource();

    if (WorkerPool.size() < MAX_WORKER) {
        const worker = new Worker(glueUrl);
        WorkerPool.add(worker);
    
        return worker;
    }
}

function genPromise() {
    let resolve;
    let reject;
    const promise = new Promise((success, error) => {
        resolve = success;
        reject = error;
    });

    return {
        resolve,
        reject,
        promise
    };
}
function initFileCache() {
    if (!initFileCache.promise) {
        /** [fix webkit bug](https://bugs.webkit.org/show_bug.cgi?id=226547) */
        indexedDB.open('__test', 1);
        const idbReq = indexedDB.open('fileCache', 1);
        const { resolve, reject, promise } = genPromise();
        initFileCache.promise = promise;

        idbReq.onupgradeneeded = ({ oldVersion }) => {
            if (oldVersion !== 1) {
                idbReq.result.createObjectStore('libs');
            }
        };
        idbReq.onsuccess = () => resolve(idbReq.result);
        idbReq.onerror = () => reject(idbReq.error);
    }

    return initFileCache.promise;
}
function addLibsCache(key, buffer) {
    const { resolve, reject, promise } = genPromise();

    initFileCache().then(idb => {
        const transaction = idb.transaction('libs', 'readwrite');
        const request = transaction.objectStore('libs').put(buffer, key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    return promise;
}
function getLibsCache(key) {
    const { resolve, reject, promise } = genPromise();

    initFileCache().then(idb => {
        const transaction = idb.transaction('libs', 'readonly');
        const libs = transaction.objectStore('libs');
        const request = libs.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    return promise;
}

export function compress(data, quality) {
    return WorkerPool.job(data, quality);
}
