import { approach } from '../../../../../shared/src/engine/data/note.js'
import { perspectiveLayout } from '../../../../../shared/src/engine/data/utils.js'
import { options } from '../../configuration/options.js'
import { note } from '../note.js'
import { getZ, layer, skin } from '../skin.js'
import { archetypes } from './index.js'
import { timeToScaledTime, scaledTimeToEarliestTime } from './utils.js'
export class SimLine extends Archetype {
    import = this.defineImport({
        aRef: { name: 'left', type: Number },
        bRef: { name: 'right', type: Number },
    })
    left = this.entityMemory({
        min: Number,
        max: Number,
        lane: Number,
        timeScaleGroup: Number,
    })
    right = this.entityMemory({
        min: Number,
        max: Number,
        lane: Number,
        timeScaleGroup: Number,
    })
    targetTime = this.entityMemory(Number)
    hiddenTime = this.entityMemory(Number)
    spriteLayout = this.entityMemory(Quad)
    spawnTime = this.entityMemory(Number)
    z = this.entityMemory(Number)
    preprocess() {
        if (!options.simLineEnabled) return
        this.targetTime = bpmChanges.at(this.aImport.beat).time
        if (this.aImport.lane < this.bImport.lane) {
            this.left.lane = this.aImport.lane
            this.left.timeScaleGroup = this.aImport.timeScaleGroup
            this.right.lane = this.bImport.lane
            this.right.timeScaleGroup = this.bImport.timeScaleGroup
        } else {
            this.left.lane = this.bImport.lane
            this.left.timeScaleGroup = this.bImport.timeScaleGroup
            this.right.lane = this.aImport.lane
            this.right.timeScaleGroup = this.aImport.timeScaleGroup
        }
        this.left.max = timeToScaledTime(this.targetTime, this.left.timeScaleGroup)
        this.right.max = timeToScaledTime(this.targetTime, this.right.timeScaleGroup)
        this.left.min = this.left.max - note.duration
        this.right.min = this.right.max - note.duration
        this.spawnTime = Math.max(
            scaledTimeToEarliestTime(this.left.min, this.left.timeScaleGroup),
            scaledTimeToEarliestTime(this.right.min, this.right.timeScaleGroup),
        )
    }
    spawnOrder() {
        if (!options.simLineEnabled) return 999999
        return 1000 + this.spawnTime
    }
    shouldSpawn() {
        if (!options.simLineEnabled) return false
        return time.now >= this.spawnTime
    }
    initialize() {
        if (options.hidden > 0) this.hiddenTime = this.left.max - note.duration * options.hidden
        let l = this.aImport.lane
        let r = this.bImport.lane
        if (l > r) [l, r] = [r, l]
        const b = 1 + note.h
        const t = 1 - note.h
        perspectiveLayout({ l, r, b, t }).copyTo(this.spriteLayout)
        this.z = getZ(layer.simLine, this.targetTime, l)
    }
    updateParallel() {
        const scaledTime = timeToScaledTime(time.now, this.left.timeScaleGroup)
        if (time.now > this.targetTime) this.despawn = true
        if (this.aInfo.state === EntityState.Despawned) this.despawn = true
        if (this.bInfo.state === EntityState.Despawned) this.despawn = true
        if (this.despawn) return
        if (options.hidden > 0 && scaledTime > this.hiddenTime) return
        this.render()
    }
    get aImport() {
        return archetypes.NormalTapNote.import.get(this.import.aRef)
    }
    get aInfo() {
        return entityInfos.get(this.import.aRef)
    }
    get bImport() {
        return archetypes.NormalTapNote.import.get(this.import.bRef)
    }
    get bInfo() {
        return entityInfos.get(this.import.bRef)
    }
    render() {
        let l = this.left.lane
        let r = this.right.lane
        const leftScaledTime = timeToScaledTime(time.now, this.left.timeScaleGroup)
        const rightScaledTime = timeToScaledTime(time.now, this.right.timeScaleGroup)

        if (
            leftScaledTime < this.left.min + note.duration &&
            rightScaledTime < this.right.min + note.duration
        )
            return
        const y = {
            l: approach(this.left.min, this.left.max, leftScaledTime),
            r: approach(this.right.min, this.right.max, rightScaledTime),
        }
        const minY = approach(0, 1, 0)
        if (y.l < minY) {
            l = Math.remap(y.l, y.r, l, r, minY)
            y.l = minY
        } else if (y.r < minY) {
            r = Math.remap(y.l, y.r, l, r, minY)
            y.r = minY
        }
        const layout = new Quad({
            x1: l * (y.l - note.h),
            x2: l * (y.l + note.h),
            x3: r * (y.r + note.h),
            x4: r * (y.r - note.h),
            y1: y.l - note.h,
            y2: y.l + note.h,
            y3: y.r + note.h,
            y4: y.r - note.h,
        })
        skin.sprites.simLine.draw(layout, 900 - this.targetTime, 1)
    }
}
