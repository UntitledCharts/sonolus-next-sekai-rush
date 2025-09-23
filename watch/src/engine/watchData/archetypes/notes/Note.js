import { EngineArchetypeDataName } from '@sonolus/core'
import { options } from '../../../configuration/options.js'
import { timeToScaledTime } from '../utils.js'
import { archetypes } from '../index.js'
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
        judgment: { name: EngineArchetypeDataName.Judgment, type: DataType },
        accuracy: { name: EngineArchetypeDataName.Accuracy, type: Number },
        flickWarning: { name: 'flickWarning', type: Boolean },
        fast: { name: 'fast', type: Number },
        late: { name: 'late', type: Number },
    })
    sharedMemory = this.defineSharedMemory({
        circular: ParticleEffectInstanceId,
        linear: ParticleEffectInstanceId,
        noneMoveLinear: Number,
        slotEffects: Number,
        targetTime: Number,
        targetScaledTime: Number,
        hitTime: Number,
        hitScaledTime: Number,
        spawnTime: Number,
        visualStartTime: Number,
        segmentAlpha: Number,
        activeConnectorInfo: {
            visualLane: Number,
            visualSize: Number,
            kind: Number,
            info: Number,
        },
        windows: Number,
    })
    customCombo = this.defineSharedMemory({
        value: Number,
        time: Number,
        length: Number,
        start: Number,
        combo: Number,
        judgment: DataType,
        tail: Number,
        ap: Boolean,
        accuracy: Number,
        fastLate: Number,
    })
    targetTime = this.entityMemory(Number)
    preprocessOrder = -1
    preprocess() {
        this.sharedMemory.targetTime = bpmChanges.at(this.import.beat).time
        this.targetTime = bpmChanges.at(this.import.beat).time
        this.sharedMemory.targetScaledTime = timeToScaledTime(
            this.targetTime,
            this.import.timeScaleGroup,
        )
        this.sharedMemory.hitTime = this.hitTime
        this.sharedMemory.hitScaledTime = timeToScaledTime(this.hitTime, this.import.timeScaleGroup)
        this.sharedMemory.segmentAlpha =
            this.import.segmentKind < 100 && this.import.segmentKind > 0
                ? 1
                : this.import.segmentAlpha
        if (options.mirror) this.import.lane *= -1
        if (this.hasInput) this.result.time = this.targetTime
        this.setCustomElement()
        this.customElement()
        this.getWindows()
    }
    get hitTime() {
        return this.targetTime + (replay.isReplay ? this.import.accuracy : 0)
    }
    getWindows() {
        this.sharedMemory.windows = this.windows.good.max
    }
    setCustomElement() {
        if (options.customJudgment || options.customCombo) {
            this.customCombo.time = this.hitTime
            this.customCombo.judgment = this.import.judgment
            this.customCombo.accuracy = this.import.accuracy
            this.customCombo.ap = replay.isReplay
                ? this.import.judgment != Judgment.Perfect
                    ? true
                    : false
                : false
            this.customCombo.fastLate =
                this.import.judgment != Judgment.Miss
                    ? this.import.flickWarning == true
                        ? 3
                        : this.import.fast > this.import.accuracy
                          ? 1
                          : this.import.late < this.import.accuracy
                            ? 2
                            : 0
                    : 0
        }
    }
    customElement() {
        if (options.hideCustom) return
        archetypes.ComboNumber.spawn({ hitTime: this.hitTime, info: this.info.index })
        if (options.customDamage && replay.isReplay && this.import.judgment != Judgment.Miss)
            archetypes.Damage.spawn({ hitTime: this.hitTime, info: this.info.index })
        if (options.customJudgment) {
            archetypes.JudgmentText.spawn({ hitTime: this.hitTime, info: this.info.index })
            if (
                options.fastLate &&
                replay.isReplay &&
                this.import.judgment != Judgment.Perfect &&
                this.import.judgment != Judgment.Miss
            ) {
                archetypes.JudgmentAccuracy.spawn({ hitTime: this.hitTime, info: this.info.index })
            }
        }
        if (options.customCombo && (!options.auto || replay.isReplay)) {
            archetypes.ComboLabel.spawn({ hitTime: this.hitTime, info: this.info.index })
        }
    }
}
