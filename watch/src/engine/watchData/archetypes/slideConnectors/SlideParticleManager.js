import { particle } from '../../particle.js'
import { archetypes } from '../index'
export class SlideParticleManager extends SpawnableArchetype({
    activeHeadRef: Number,
    t: Number,
}) {
    spawnTime() {
        return this.spawnData.t
    }
    despawnTime() {
        return this.spawnData.t + 1
    }
    updateSequential() {
        if (
            this.startSharedMemory.circular == 0 &&
            this.startSharedMemory.linear == 0 &&
            this.startSharedMemory.slotEffects == 0 &&
            this.startSharedMemory.noneMoveLinear == 0
        )
            return
        particle.effects.destroy(this.startSharedMemory.circular)
        particle.effects.destroy(this.startSharedMemory.linear)
        this.startSharedMemory.circular = 0
        this.startSharedMemory.linear = 0
        this.startSharedMemory.slotEffects = 0
        this.startSharedMemory.noneMoveLinear = 0
    }
    get startSharedMemory() {
        return archetypes.NormalHeadTapNote.sharedMemory.get(this.spawnData.activeHeadRef)
    }
}
