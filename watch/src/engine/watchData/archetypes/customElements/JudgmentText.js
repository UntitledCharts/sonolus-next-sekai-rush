import { NormalLayout } from '../../../../../../shared/src/engine/data/utils.js'
import { options } from '../../../configuration/options.js'
import { getZ, layer, skin } from '../../skin.js'
import { archetypes } from '../index.js'

export class JudgmentText extends SpawnableArchetype({
    hitTime: Number,
    info: Number,
}) {
    preprocessOrder = 5
    check = this.entityMemory(Boolean)
    layout = this.entityMemory(Quad)
    z = this.entityMemory(Number)
    initialize() {
        this.z = getZ(layer.judgment, 0, 0, 0)
    }
    spawnTime() {
        return this.spawnData.hitTime
    }
    despawnTime() {
        if (this.customMemory.get(this.next).time <= this.spawnData.hitTime + 0.5)
            return this.customMemory.get(this.next).time
        else return this.spawnData.hitTime + 0.5
    }
    updateParallel() {
        if (time.now < this.customMemory.get(this.customMemory.get(0).start).time) return
        if (this.customMemory.get(this.spawnData.info).time + 0.5 < time.now) return
        const t = this.customMemory.get(this.spawnData.info).time
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
            switch (this.customMemory.get(this.spawnData.info).judgment) {
                case Judgment.Perfect:
                    skin.sprites.perfect.draw(this.layout, this.z, a)
                    break
                case Judgment.Great:
                    skin.sprites.great.draw(this.layout, this.z, a)
                    break
                case Judgment.Good:
                    if (
                        this.customMemory.get(this.spawnData.info).accuracy >= 0.1083 ||
                        this.customMemory.get(this.spawnData.info).accuracy <= -0.1083
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
    get next() {
        return this.customMemory.get(this.spawnData.info).value
    }
    get customMemory() {
        return archetypes.NormalTapNote.customCombo
    }
}
