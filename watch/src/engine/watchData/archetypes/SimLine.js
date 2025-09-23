import {
    approach,
    approach2,
    progressCutoff,
    progressStart,
} from '../../../../../shared/src/engine/data/note.js'
import { QuadLayout } from '../../../../../shared/src/engine/data/utils.js'
import { options } from '../../configuration/options.js'
import { note } from '../note.js'
import { getZ, layer, skin } from '../skin.js'
import { archetypes } from './index.js'
import { progress } from './utils.js'
export class SimLine extends Archetype {
    import = this.defineImport({
        leftRef: { name: 'left', type: Number },
        rightRef: { name: 'right', type: Number },
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
    visualSpawnTime = this.entityMemory(Number)
    hiddenTime = this.entityMemory(Number)
    initialized = this.entityMemory(Boolean)
    spriteLayout = this.entityMemory(Quad)
    z = this.entityMemory(Number)
    preprocess() {
        if (!options.simLineEnabled) return
        this.visualSpawnTime = Math.max(this.leftMemory.spawnTime, this.rightMemory.spawnTime)
    }
    spawnTime() {
        return this.visualSpawnTime
    }
    despawnTime() {
        return Math.min(this.leftMemory.hitTime, this.rightMemory.hitTime)
    }
    initialize() {
        if (this.initialized) return
        this.initialized = true
        this.globalInitialize()
    }
    updateParallel() {
        this.render()
    }
    get leftImport() {
        return archetypes.NormalTapNote.import.get(this.import.leftRef)
    }
    get leftInfo() {
        return entityInfos.get(this.import.leftRef)
    }
    get leftMemory() {
        return archetypes.NormalTapNote.sharedMemory.get(this.import.leftRef)
    }
    get rightImport() {
        return archetypes.NormalTapNote.import.get(this.import.rightRef)
    }
    get rightInfo() {
        return entityInfos.get(this.import.rightRef)
    }
    get rightMemory() {
        return archetypes.NormalTapNote.sharedMemory.get(this.import.rightRef)
    }
    globalInitialize() {
        this.z = getZ(
            layer.simLine,
            (this.leftMemory.targetTime - this.rightMemory.targetTime) / 2,
            (this.leftImport.lane + this.rightImport.lane) / 2,
            0,
        )
    }
    render() {
        const leftProgress = progress(
            this.leftImport.isAttached,
            this.leftImport.attachHead,
            this.leftImport.attachTail,
            this.leftMemory.targetTime,
            this.leftMemory.targetScaledTime,
            this.leftImport.timeScaleGroup,
        )
        const rightProgress = progress(
            this.rightImport.isAttached,
            this.rightImport.attachHead,
            this.rightImport.attachTail,
            this.rightMemory.targetTime,
            this.rightMemory.targetScaledTime,
            this.rightImport.timeScaleGroup,
        )
        if (leftProgress < progressStart && rightProgress < progressStart) return
        if (leftProgress > progressCutoff && rightProgress > progressCutoff) return
        const adjLeftProgress = Math.clamp(leftProgress, progressStart, progressCutoff)
        const adjRightProgress = Math.clamp(rightProgress, progressStart, progressCutoff)
        let adjLeftLane = this.leftImport.lane
        let adjRightLane = this.rightImport.lane
        if (Math.abs(leftProgress - rightProgress) > 1e-6) {
            const adjLeftFrac = Math.unlerp(leftProgress, rightProgress, adjLeftProgress)
            const adjRightFrac = Math.unlerp(leftProgress, rightProgress, adjRightProgress)
            adjLeftLane = Math.lerp(this.leftImport.lane, this.rightImport.lane, adjLeftFrac)
            adjRightLane = Math.lerp(this.leftImport.lane, this.rightImport.lane, adjRightFrac)
        }
        let adjLeftTravel = approach2(adjLeftProgress)
        let adjRightTravel = approach2(adjRightProgress)
        if (adjLeftLane > adjRightLane) {
            ;[adjLeftLane, adjRightLane] = [adjRightLane, adjLeftLane]
            ;[adjLeftTravel, adjRightTravel] = [adjRightTravel, adjLeftTravel]
        }
        const ml = new Vec(adjLeftLane * 1 * adjLeftTravel, 1 * adjLeftTravel)
        const mr = new Vec(adjRightLane * 1 * adjRightTravel, 1 * adjRightTravel)
        const ort = mr.sub(ml).rotate(90).normalize()
        const layout = QuadLayout({
            bl: ml.add(ort.mul(note.h * adjLeftTravel)),
            br: mr.add(ort.mul(note.h * adjRightTravel)),
            tl: ml.sub(ort.mul(note.h * adjLeftTravel)),
            tr: mr.sub(ort.mul(note.h * adjRightTravel)),
        })
        skin.sprites.simLine.draw(layout, this.z, 1)
    }
}
