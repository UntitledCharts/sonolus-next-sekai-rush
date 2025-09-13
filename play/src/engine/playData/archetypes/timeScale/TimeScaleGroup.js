import { timeToScaledTime } from '../utils.js'

export class TimeScaleGroup extends Archetype {
    import = this.defineImport({
        firstRef: { name: 'first', type: Number },
    })

    sharedMemory = this.defineSharedMemory({
        currentTime: Number,
        currentScaledTime: Number,
    })

    updateSequentialOrder = -2
    updateSequential() {
        this.sharedMemory.get(this.info.index).currentScaledTime = timeToScaledTime(
            time.now,
            this.info.index,
            true,
        )
        this.sharedMemory.get(this.info.index).currentTime = time.now
    }
}
