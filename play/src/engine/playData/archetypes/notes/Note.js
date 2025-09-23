import { EngineArchetypeDataName } from '@sonolus/core'
import { options } from '../../../configuration/options.js'
import { archetypes } from '../index.js'
import { getAttached } from './slideTickNotes/utils.js'
import { timeToScaledTime } from '../utils.js'
export class Note extends Archetype {
    hasInput = true
    import = this.defineImport({
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        lane: { name: 'lane', type: Number },
        size: { name: 'size', type: Number },
        timeScaleGroup: { name: '#TIMESCALE_GROUP', type: Number },
        isAttached: { name: 'isAttached', type: Number },
        isSeparator: { name: 'isSeparator', type: Number },
        connectorEase: { name: 'connectorEase', type: Number },
        segmentKind: { name: 'segmentKind', type: Number },
        segmentAlpha: { name: 'segmentAlpha', type: Number },
        nextRef: { name: 'next', type: Number },
        attachHead: { name: 'attachHead', type: Number },
        attachTail: { name: 'attachTail', type: Number },
        activeHeadRef: { name: 'activeHead', type: Number },
    })
    accuracyExport = this.defineExport({
        fast: { name: 'fast', type: Number },
        late: { name: 'late', type: Number },
    })
    sharedMemory = this.defineSharedMemory({
        lastActiveTime: Number,
        exportStartTime: Number,
        circular: ParticleEffectInstanceId,
        linear: ParticleEffectInstanceId,
        noneMoveLinear: Number,
        slotEffects: Number,
        flick: Boolean,
        targetTime: Number,
        targetScaledTime: Number,
        timeScaleGroup: Number,
        spawnTime: Number,
        visualStartTime: Number,
        lane: Number,
        size: Number,
        segmentKind: Number,
        connectorEase: Number,
        isAttached: Number,
        attachHead: Number,
        attachTail: Number,
        segmentAlpha: Number,
        activeConnectorInfo: {
            prevInputLane: Number,
            prevInputSize: Number,
            inputLane: Number,
            inputSize: Number,
            visualLane: Number,
            visualSize: Number,
            kind: Number,
            info: Number,
        },
    })
    targetTime = this.entityMemory(Number)
    spawnTime = this.entityMemory(Number)
    hitbox = this.entityMemory(Rect)
    fullHitbox = this.entityMemory(Rect)
    flick = this.entityMemory(Boolean)
    preprocessOrder = -1
    preprocess() {
        this.sharedMemory.lastActiveTime = -1000
        this.sharedMemory.exportStartTime = -1000
        this.sharedMemory.targetTime = bpmChanges.at(this.import.beat).time
        this.targetTime = bpmChanges.at(this.import.beat).time
        this.sharedMemory.targetScaledTime = timeToScaledTime(
            this.targetTime,
            this.import.timeScaleGroup,
        )
        this.sharedMemory.timeScaleGroup = this.import.timeScaleGroup
        this.sharedMemory.lane = this.import.lane
        this.sharedMemory.size = this.import.size
        this.sharedMemory.segmentKind = this.import.segmentKind
        this.sharedMemory.connectorEase = this.import.connectorEase
        this.sharedMemory.isAttached = this.import.isAttached
        this.sharedMemory.attachHead = this.import.attachHead
        this.sharedMemory.attachTail = this.import.attachTail
        this.sharedMemory.segmentAlpha =
            this.import.segmentKind < 100 && this.import.segmentKind > 0
                ? 1
                : this.import.segmentAlpha
        if (options.mirror) {
            this.import.lane *= -1
        }
    }
    spawnOrder() {
        return this.spawnTime
    }
    shouldSpawn() {
        return time.now >= this.spawnTime
    }
    terminate() {
        this.accuracyExport('fast', this.windows.perfect.min)
        this.accuracyExport('late', this.windows.perfect.max)
        if (options.hideCustom) return
        if (this.result.judgment == Judgment.Miss && options.customDamage)
            archetypes.Damage.spawn({
                time: time.now,
            })
        if (options.customJudgment)
            archetypes.JudgmentText.spawn({
                time: time.now,
                judgment: this.result.judgment,
                accuracy: this.result.accuracy,
            })
        if (
            options.fastLate &&
            this.result.judgment != Judgment.Perfect &&
            this.result.judgment != Judgment.Miss
        )
            archetypes.JudgmentAccuracy.spawn({
                time: time.now,
                judgment: this.result.judgment,
                accuracy: this.result.accuracy,
                min: this.windows.perfect.min,
                max: this.windows.perfect.max,
                flick: this.flick,
            })
        if (options.customCombo) {
            archetypes.ComboNumber.spawn({
                time: time.now,
                judgment: this.result.judgment,
            })
            archetypes.ComboLabel.spawn({
                time: time.now,
                judgment: this.result.judgment,
            })
        }
    }
}
