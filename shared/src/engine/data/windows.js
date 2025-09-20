const toMs = ({ min, max }) => new Range(Math.round(min * 1000), Math.round(max * 1000))
export const toBucketWindows = (windows) => ({
    perfect: toMs(windows.perfect),
    great: toMs(windows.great),
    good: toMs(windows.good),
})
const fromFrames = (perfect, great, good) => {
    const toWindow = (frames) =>
        typeof frames === 'number'
            ? Range.one.mul(frames).div(60)
            : new Range(-frames[0], frames[1]).div(60)
    return {
        perfect: toWindow(perfect),
        great: toWindow(great),
        good: toWindow(good),
    }
}
export const windows = {
    tapNote: {
        normal: fromFrames(2.5, 5, 7.5),
        critical: fromFrames(3.3, 4.5, 7.5),
    },
    flickNote: {
        normal: fromFrames(2.5, [6.5, 7.5], [7.5, 8.5]),
        critical: fromFrames(3.5, [6.5, 7.5], [7.5, 8.5]),
    },
    traceNote: {
        normal: fromFrames(3.5, 3.5, 3.5),
        critical: fromFrames(3.5, 3.5, 3.5),
    },
    traceFlickNote: {
        normal: fromFrames([6.5, 7.5], [6.5, 7.5], [6.5, 7.5]),
        critical: fromFrames([6.5, 7.5], [6.5, 7.5], [6.5, 7.5]),
    },
    slideTraceNote: {
        normal: fromFrames(3.5, 3.5, 3.5),
        critical: fromFrames(3.5, 3.5, 3.5),
    },
    slideStartNote: {
        normal: fromFrames(2.5, 5, 7.5),
        critical: fromFrames(3.3, 4.5, 7.5),
    },
    slideEndNote: {
        normal: fromFrames([3.5, 4], [6.5, 8], [7.5, 8.5]),
        critical: fromFrames([3.5, 4], [6.5, 8], [7.5, 8.5]),
    },
    slideEndTraceNote: {
        normal: fromFrames([6, 8.5], [6, 8.5], [6, 8.5]),
        critical: fromFrames([6, 8.5], [6, 8.5], [6, 8.5]),
    },
    slideEndFlickNote: {
        normal: fromFrames([3.5, 4], [6.5, 8], [7.5, 8.5]),
        critical: fromFrames([3.5, 4], [6.5, 8], [7.5, 8.5]),
    },
    damageNote: {
        normal: fromFrames([0, 0], [0, 0], [0, 0.1]),
    },
    slideEndLockoutDuration: 0.25,
}
