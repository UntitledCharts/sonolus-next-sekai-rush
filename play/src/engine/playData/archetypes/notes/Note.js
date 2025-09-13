import { EngineArchetypeDataName } from '@sonolus/core'
import { options } from '../../../configuration/options.js'
import { archetypes } from '../index.js'
import { getAttached } from './slideTickNotes/utils.js'
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
        timeScaleGroup: Number,
        startTime: Number,
    })
    targetTime = this.entityMemory(Number)
    startTime = this.entityMemory(Number)
    hitbox = this.entityMemory(Rect)
    fullHitbox = this.entityMemory(Rect)
    preprocess() {
        this.sharedMemory.lastActiveTime = -1000
        this.sharedMemory.exportStartTime = -1000
        this.sharedMemory.get(this.info.index).targetTime = bpmChanges.at(this.import.beat).time
        this.sharedMemory.get(this.info.index).timeScaleGroup = this.import.timeScaleGroup
        this.targetTime = this.sharedMemory.get(this.info.index).targetTime
        if (options.mirror) {
            this.import.lane *= -1
        }
    }
    spawnOrder() {
        return 1000 + this.startTime
    }
    shouldSpawn() {
        return time.now >= this.startTime
    }
    updateSequentialOrder = 2
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
                flick: this.sharedMemory.get(this.info.index).flick,
            })
        if (options.customCombo) {
            archetypes.ComboNumber.spawn({
                time: time.now,
                judgment: this.result.judgment,
            })
            archetypes.ComboNumberEffect.spawn({
                time: time.now,
                judgment: this.result.judgment,
            })
            archetypes.ComboNumberGlow.spawn({
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
