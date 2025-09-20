import { timeToScaledTime } from '../utils.js'

export class TimeScaleGroup extends Archetype {
    import = this.defineImport({
        firstRef: { name: 'first', type: Number },
    })
    timeToScale = this.defineSharedMemory({
        currentTime: Number,
        currentScaledTime: Number,
        lastTime: Number,
        lastTimeScale: Number,
        lastScaledTime: Number,
        lastEase: DataType,
        lastQueryScaledTime: Number,
        nextRef: Number,
    })
    scaleToTime = this.defineSharedMemory({
        currentTime: Number,
        currentScaledTime: Number,
        lastTime: Number,
        lastTimeScale: Number,
        lastScaledTime: Number,
        lastEase: DataType,
        lastQueryScaledTime: Number,
        nextRef: Number,
    })
    scaleToTime2 = this.defineSharedMemory({
        currentTime: Number,
        currentScaledTime: Number,
        lastTime: Number,
        lastTimeScale: Number,
        lastScaledTime: Number,
        lastEase: DataType,
        lastQueryScaledTime: Number,
        nextRef: Number,
    })
    spawnOrder() {
        return -1e8
    }
    shouldSpawn() {
        return true
    }
    preprocessOrder = -2
    preprocess() {
        this.timeToScale.nextRef = this.import.firstRef
        this.timeToScale.lastTime = -2
        this.timeToScale.lastScaledTime = -2
        this.timeToScale.lastTimeScale = 1
        this.timeToScale.lastEase = 0
        this.timeToScale.lastQueryScaledTime = -2
        this.scaleToTime.nextRef = this.import.firstRef
        this.scaleToTime.lastTime = -2
        this.scaleToTime.lastScaledTime = -2
        this.scaleToTime.lastTimeScale = 1
        this.scaleToTime.lastEase = 0
        this.scaleToTime.lastQueryScaledTime = -2
        this.scaleToTime2.nextRef = this.import.firstRef
        this.scaleToTime2.lastTime = -2
        this.scaleToTime2.lastScaledTime = -2
        this.scaleToTime2.lastTimeScale = 1
        this.scaleToTime2.lastEase = 0
        this.scaleToTime2.lastQueryScaledTime = -2
    }
    updateSequentialOrder = -2
    updateSequential() {
        this.timeToScale.currentScaledTime = timeToScaledTime(time.now, this.info.index, true)
    }
}
