import { options } from '../../../../configuration/options.js'
import { getHitbox } from '../../../lane.js'
import { archetypes } from '../../index.js'
import { disallowEmpty } from '../../InputManager.js'
import { Note } from '../Note.js'
import { getVisualSpawnTime } from '../../utils.js'
import { getAttached } from './utils.js'
export class TransientHiddenTickNote extends Note {
    leniency = 1
    inputTime = this.entityMemory(Number)
    hiddenTime = this.entityMemory(Number)
    visualStartTime = this.entityMemory(Number)
    globalPreprocess() {
        if (this.hasInput) this.life.miss = -40
    }
    preprocess() {
        super.preprocess()
        this.inputTime = this.targetTime - input.offset
        if (!this.import.isAttached) {
            this.sharedMemory.visualStartTime = getVisualSpawnTime(
                this.sharedMemory.targetScaledTime,
                this.import.timeScaleGroup,
            )
            this.spawnTime = Math.min(this.sharedMemory.visualStartTime, this.targetTime)
            this.sharedMemory.spawnTime = this.spawnTime
        }
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
                this.targetTime,
            ))
            this.sharedMemory.visualStartTime = Math.min(
                this.sharedMemory.get(this.import.attachHead).visualStartTime,
                this.sharedMemory.get(this.import.attachTail).visualStartTime,
            )
            this.spawnTime = Math.min(this.sharedMemory.visualStartTime, this.targetTime)
            this.sharedMemory.spawnTime = this.spawnTime
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
    playHitEffects() {
        //None
    }
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
            archetypes.ComboLabel.spawn({
                time: time.now,
                judgment: this.result.judgment,
            })
        }
    }
}
