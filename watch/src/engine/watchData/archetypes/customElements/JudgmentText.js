import { NormalLayout } from '../../../../../../shared/src/engine/data/utils.js'
import { options } from '../../../configuration/options.js'
import { getZ, layer, skin } from '../../skin.js'
import { archetypes } from '../index.js'

export class JudgmentText extends SpawnableArchetype({}) {
    preprocessOrder = 5
    check = this.entityMemory(Boolean)
    layout = this.entityMemory(Quad)
    z = this.entityMemory(Number)
    initialize() {
        this.z = getZ(layer.judgment, 0, 0, 0)
    }
    spawnTime() {
        return -999999
    }
    despawnTime() {
        return 999999
    }
    updateParallel() {
        if (time.now < this.customMemory.get(this.customMemory.get(0).start).time) return
        if (this.customMemory.get(this.head).time + 0.5 < time.now) return
        const t = this.customMemory.get(this.head).time
        const h = 0.09 * ui.configuration.judgment.scale
        const w = h * 27.3
        const centerX = 0
        const centerY = 0.792
        const s = Math.unlerpClamped(t, t + 0.064, time.now)
        const a = ui.configuration.judgment.alpha * Math.unlerpClamped(t, t + 0.064, time.now)
        NormalLayout({
            l: centerX - (w * s) / 2,
            r: centerX + (w * s) / 2,
            t: centerY - (h * s) / 2,
            b: centerY + (h * s) / 2,
        }).copyTo(this.layout)
        if (replay.isReplay) {
            switch (this.customMemory.get(this.head).judgment) {
                case Judgment.Perfect:
                    skin.sprites.perfect.draw(this.layout, this.z, a)
                    break
                case Judgment.Great:
                    skin.sprites.great.draw(this.layout, this.z, a)
                    break
                case Judgment.Good:
                    if (
                        this.customMemory.get(this.head).accuracy >= 0.1083 ||
                        this.customMemory.get(this.head).accuracy <= -0.1083
                    )
                        skin.sprites.bad.draw(this.layout, this.z, a)
                    else skin.sprites.good.draw(this.layout, this.z, a)
                    break
                case Judgment.Miss:
                    skin.sprites.miss.draw(this.layout, this.z, a)
                    break
            }
        } else {
            if (options.auto) skin.sprites.auto.draw(this.layout, this.z, a)
            else skin.sprites.perfect.draw(this.layout, this.z, a)
        }
    }
    get head() {
        return archetypes.ComboNumber.searching.get(0).head
    }
    get customMemory() {
        return archetypes.NormalTapNote.customCombo
    }
}
