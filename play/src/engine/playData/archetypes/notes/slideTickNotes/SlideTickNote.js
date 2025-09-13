import { options } from '../../../../configuration/options.js'
import { getHitbox } from '../../../lane.js'
import { archetypes } from '../../index.js'
import { disallowEmpty } from '../../InputManager.js'
import { Note } from '../Note.js'
import { timeToScaledTime, scaledTimeToEarliestTime } from '../../utils.js'
import { getAttached } from './utils.js'
import { note } from '../../../note.js'
export class SlideTickNote extends Note {
    leniency = 1
    inputTime = this.entityMemory(Number)
    hiddenTime = this.entityMemory(Number)
    visualStartTime = this.entityMemory(Number)
    endTime = this.entityMemory(Number)
    globalPreprocess() {
        if (this.hasInput) this.life.miss = -40
    }
    preprocess() {
        super.preprocess()
        this.inputTime = this.targetTime - input.offset
        this.endTime = timeToScaledTime(this.inputTime, this.import.timeScaleGroup)
        this.visualStartTime = this.endTime - note.duration
        this.sharedMemory.get(this.info.index).startTime = this.visualStartTime
        this.startTime = scaledTimeToEarliestTime(
            Math.min(this.visualStartTime, this.endTime),
            this.import.timeScaleGroup,
        )
        this.attach()
    }
    attach() {
        if (this.import.isAttached) {
            if (!this.import.isSeparator) {
                this.import.connectorEase = this.import.get(this.import.attachHead).connectorEase
            }
            ;({ lane: this.import.lane, size: this.import.size } = getAttached(
                this.import.connectorEase,
                this.import.get(this.import.attachHead).lane,
                this.import.get(this.import.attachHead).size,
                bpmChanges.at(this.import.get(this.import.attachHead).beat).time,
                this.import.get(this.import.attachTail).lane,
                this.import.get(this.import.attachTail).size,
                bpmChanges.at(this.import.get(this.import.attachTail).beat).time,
                this.inputTime,
            ))
        }
    }
    initialize() {
        getHitbox({
            l: this.import.lane - this.import.size,
            r: this.import.lane + this.import.size,
            leniency: this.leniency,
        }).copyTo(this.fullHitbox)
        this.result.accuracy = 0.125
    }
    touch() {
        if (time.now < this.inputTime) return
        for (const touch of touches) {
            if (!this.fullHitbox.contains(touch.position)) continue
            this.complete(touch)
            return
        }
    }
    updateParallel() {
        if (time.now > this.inputTime) this.despawn = true
    }
    complete(touch) {
        disallowEmpty(touch)
        this.result.judgment = Judgment.Perfect
        this.result.accuracy = 0
        this.playHitEffects()
        this.despawn = true
    }
    playHitEffects() {}
    terminate() {
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
