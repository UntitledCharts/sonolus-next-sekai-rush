/** @type {import('@sonolus/sonolus.js').SonolusCLIConfig} */
export default {
    type: 'tutorial',
    esbuild(options) {
        return {
            ...options,
            treeShaking: true,
            minifyWhitespace: true,
        }
    },
    workerCount: 6,
}
