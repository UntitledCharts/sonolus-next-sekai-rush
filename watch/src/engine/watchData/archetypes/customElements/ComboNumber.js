import { options } from '../../../configuration/options.js'
import { getZ, layer } from '../../skin.js'
import { comboNumberLayout } from './comboNumberLayout.js'
import { archetypes } from '../index.js'
export class ComboNumber extends SpawnableArchetype({
    hitTime: Number,
    info: Number,
}) {
    preprocessOrder = 4
    check = this.entityMemory(Boolean)
    z = this.entityMemory(Number)
    z2 = this.entityMemory(Number)
    head = this.entityMemory(Number)
    searching = this.defineSharedMemory({
        head: Number,
    })
    initialize() {
        this.z = getZ(layer.judgment, 0, 0, 0)
    }
    spawnTime() {
        return this.spawnData.hitTime
    }
    despawnTime() {
        if (this.customMemory.get(this.next).time >= this.spawnData.hitTime)
            return this.customMemory.get(this.next).time
        else return 999999
    }
    updateParallel() {
        if (!options.customCombo || (options.auto && !replay.isReplay)) return
        if (time.now < this.customMemory.get(this.customMemory.get(0).start).time) return
        if (this.customMemory.get(this.spawnData.info).combo == 0) return
        const c = this.customMemory.get(this.spawnData.info).combo
        const t = this.customMemory.get(this.spawnData.info).time
        if (c != 0) {
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
            const h = 0.1222 * ui.configuration.combo.scale
            const h2 = 0.15886 * ui.configuration.combo.scale
            const digitWidth = h * 0.79 * 7
            const digitWidth2 = h2 * 0.79 * 7
            const centerX = 5.337
            const centerY = 0.585
            // 애니메이션 = s * (원래좌표) + (1 - s) * centerX, s * (원래좌표) + (1 - s) * centerY
            const s = 0.6 + 0.4 * Math.unlerpClamped(t, t + 0.112, time.now)
            const s2 = 0.769 + 0.231 * Math.unlerpClamped(t + 0.112, t + 0.192, time.now)
            const a = ui.configuration.combo.alpha
            const a2 =
                time.now >= t + 0.112
                    ? ui.configuration.combo.alpha * Math.unlerp(t + 0.192, t + 0.112, time.now)
                    : 0
            const a3 = ui.configuration.combo.alpha * 0.8 * ((Math.cos(time.now * Math.PI) + 1) / 2)
            const digitGap = digitWidth * options.comboDistance
            const digitGap2 = digitWidth2 * options.comboDistance
            const totalWidth = digitCount * digitWidth + (digitCount - 1) * digitGap
            const totalWidth2 = digitCount * digitWidth2 + (digitCount - 1) * digitGap2
            const startX = centerX - totalWidth / 2
            const startX2 = centerX - totalWidth2 / 2
            comboNumberLayout.numberLayout(
                this.head,
                this.customMemory,
                digits,
                digitCount,
                digitWidth,
                digitWidth2,
                digitGap,
                digitGap2,
                s,
                s2,
                a,
                a2,
                a3,
                h,
                h2,
                centerX,
                centerY,
                startX,
                startX2,
            )
        }
    }
    get next() {
        return this.customMemory.get(this.spawnData.info).value
    }
    get customMemory() {
        return archetypes.NormalTapNote.customCombo
    }
}
