import { lane } from '../../../../../../../../shared/src/engine/data/lane.js'
import { perspectiveLayout } from '../../../../../../../../shared/src/engine/data/utils.js'
import { particle } from '../../../../particle.js'
import { SharedLaneEffectUtils } from './SharedLaneEffectUtils.js'

export class LaneEffectSpawner extends SpawnableArchetype({
    l: Number,
    r: Number,
    lane: Number,
    t: Number,
    j: DataType,
}) {
    laneEffectId = levelMemory(Tuple(12, ParticleEffectInstanceId))
    laneEffectLane = levelMemory({ l: Tuple(12, Number), r: Tuple(12, Number) })
    check = this.entityMemory(Boolean)
    spawnTime() {
        return this.spawnData.t
    }
    despawnTime() {
        return this.spawnData.t + 1
    }
    terminate() {
        this.check = false
    }
    updateSequential() {
        if (time.now < this.spawnData.t) return
        if (this.check) return
        this.check = true
        if (!replay.isReplay || this.spawnData.j != Judgment.Miss) {
            const id = particle.effects.criticalFlickLane.spawn(
                perspectiveLayout({
                    l: this.spawnData.l,
                    r: this.spawnData.r,
                    b: lane.b,
                    t: lane.t,
                }),
                1,
                false,
            )
            SharedLaneEffectUtils.playAndHandleLaneEffect(
                id,
                this.spawnData.lane,
                this.spawnData.l,
                this.spawnData.r,
                this.laneEffectId,
                this.laneEffectLane,
            )
        }
    }
}
