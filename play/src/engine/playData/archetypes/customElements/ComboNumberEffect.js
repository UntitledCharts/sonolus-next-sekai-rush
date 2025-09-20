import { options } from '../../../configuration/options.js'
import { getZ, layer } from '../../skin.js'
import { comboNumberLayout } from './comboNumberLayout.js'
export class ComboNumberEffect extends SpawnableArchetype({
    time: Number,
    judgment: Number,
}) {
    layout = this.entityMemory(Quad)
    z = this.entityMemory(Number)
    check = this.entityMemory(Boolean)
    combo = this.entityMemory(Number)
    comboCheck = levelMemory(Number)
    ap = levelMemory(Boolean)
    initialize() {
        this.z = getZ(layer.judgment, this.spawnData.time, 0)
    }
    updateParallel() {
        if (this.combo != this.comboCheck) {
            this.despawn = true
            return
        }
        if (this.combo == 0) {
            this.despawn = true
            return
        }
        const c = this.combo
        const digits = [
            Math.floor(c / 1000000) % 10,
            Math.floor(c / 100000) % 10,
            Math.floor(c / 10000) % 10,
            Math.floor(c / 1000) % 10,
            Math.floor(c / 100) % 10,
            Math.floor(c / 10) % 10,
            c % 10,
        ]
        const firstDigitIndex = digits.findIndex((digit) => digit !== 0)
        const digitCount = firstDigitIndex === -1 ? 1 : digits.length - firstDigitIndex
        const h = 0.15886 * ui.configuration.combo.scale
        const digitWidth = h * 0.79 * 7
        const centerX = 5.337
        const centerY = 0.585
        const s =
            0.769 +
            0.231 *
                Math.unlerpClamped(
                    this.spawnData.time + 0.112,
                    this.spawnData.time + 0.192,
                    time.now,
                )
        const a =
            time.now >= this.spawnData.time + 0.112
                ? ui.configuration.combo.alpha *
                  Math.unlerp(this.spawnData.time + 0.192, this.spawnData.time + 0.112, time.now)
                : 0
        const digitGap = digitWidth * options.comboDistance
        const totalWidth = digitCount * digitWidth + (digitCount - 1) * digitGap
        const startX = centerX - totalWidth / 2
        comboNumberLayout.numberLayout(
            this.ap,
            this.z,
            digits,
            digitCount,
            digitWidth,
            digitGap,
            s,
            a,
            h,
            centerX,
            centerY,
            startX,
        )
    }
    updateSequential() {
        if (this.check) return
        this.check = true
        if (this.spawnData.judgment == Judgment.Good || this.spawnData.judgment == Judgment.Miss) {
            this.comboCheck = 0
            this.combo = this.comboCheck
        } else {
            this.comboCheck += 1
            this.combo = this.comboCheck
        }
        if (this.spawnData.judgment != Judgment.Perfect) this.ap = true
    }
    terminate() {
        this.check = false
        this.combo = 0
        this.z = 0
    }
}
