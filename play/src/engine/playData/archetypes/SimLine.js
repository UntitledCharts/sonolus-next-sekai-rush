import {
    approach,
    approach2,
    progressCutoff,
    progressStart,
} from '../../../../../shared/src/engine/data/note.js'
import { perspectiveLayout, QuadLayout } from '../../../../../shared/src/engine/data/utils.js'
import { options } from '../../configuration/options.js'
import { note } from '../note.js'
import { scaledScreen } from '../scaledScreen.js'
import { getZ, layer, skin } from '../skin.js'
import { archetypes } from './index.js'
import { timeToScaledTime, scaledTimeToEarliestTime } from './utils.js'
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
    hiddenTime = this.entityMemory(Number)
    spriteLayout = this.entityMemory(Quad)
    spawnTime = this.entityMemory(Number)
    z = this.entityMemory(Number)
    preprocessOrder = 1
    preprocess() {
        if (!options.simLineEnabled) return
        this.spawnTime = Math.max(this.leftMemory.spawnTime, this.rightMemory.spawnTime)
    }
    spawnOrder() {
        if (!options.simLineEnabled) return 1e6
        return this.spawnTime
    }
    shouldSpawn() {
        if (!options.simLineEnabled) return false
        return time.now >= this.spawnTime
    }
    initialize() {
        this.z = getZ(
            layer.simLine,
            (this.leftMemory.targetTime - this.rightMemory.targetTime) / 2,
            (this.leftImport.lane + this.rightImport.lane) / 2,
            0,
        )
    }
    updateParallel() {
        if (!options.simLineEnabled) {
            this.despawn = true
            return
        }
        if (
            this.leftInfo.state === EntityState.Despawned ||
            this.rightInfo.state === EntityState.Despawned ||
            time.now > this.leftMemory.targetTime
        ) {
            this.despawn = true
            return
        }
        this.render()
        /*const scaledTime = timeToScaledTime(time.now, this.left.timeScaleGroup)
        if (time.now > this.targetTime) this.despawn = true
        if (this.aInfo.state === EntityState.Despawned) this.despawn = true
        if (this.bInfo.state === EntityState.Despawned) this.despawn = true
        if (this.despawn) return
        if (options.hidden > 0 && scaledTime > this.hiddenTime) return*/
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

        /*new Quad({
            x1: ml.x - ort.x * leftScale,
            x2: mr.x - ort.x * rightScale,
            x3: mr.x + ort.x * rightScale,
            x4: ml.x + ort.x * leftScale,
            y1: leftScale,
            y2: rightScale,
            y3: rightScale,
            y4: leftScale,
        })*/
    }
    /*render() {
        let l = this.left.lane
        let r = this.right.lane
        if (
            this.leftMemory.targetScaledTime < this.left.min + note.duration &&
            this.rightMemory.targetScaledTime < this.right.min + note.duration
        )
            return
        this.progress = progress(
            this.leftImport.isAttached,
            this.leftImport.attachHead,
            this.leftImport.attachTail,
            this.leftMemory.targetTime,
            this.leftMemory.targetScaledTime,
            this.leftImport.timeScaleGroup,
        )
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
    }*/
}
