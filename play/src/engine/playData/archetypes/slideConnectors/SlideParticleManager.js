import { particle } from '../../particle'
import { archetypes } from '../index'
export class SlideParticleManager extends SpawnableArchetype({
    activeHeadRef: Number,
    function: Number,
}) {
    updateSequential() {
        if (this.spawnData.function == 0) {
            particle.effects.destroy(this.startSharedMemory.circular)
            this.startSharedMemory.circular = 0
        }
        if (this.spawnData.function == 1) {
            particle.effects.destroy(this.startSharedMemory.linear)
            this.startSharedMemory.linear = 0
        }
        if (
            (this.startSharedMemory.circular == 0 && this.spawnData.function == 0) ||
            (this.startSharedMemory.linear == 0 && this.spawnData.function == 1)
        ) {
            this.despawn = true
            return
        }
    }
    get startSharedMemory() {
        return archetypes.NormalHeadTapNote.sharedMemory.get(this.spawnData.activeHeadRef)
    }
}
