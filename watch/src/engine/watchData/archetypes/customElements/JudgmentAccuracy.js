import { NormalLayout } from '../../../../../../shared/src/engine/data/utils.js'
import { getZ, layer, skin } from '../../skin.js'
import { archetypes } from '../index.js'
export class JudgmentAccuracy extends SpawnableArchetype({}) {
    preprocessOrder = 5
    check = this.entityMemory(Boolean)
    layout = this.entityMemory(Quad)
    z = this.entityMemory(Number)
    accuracy = this.entityMemory(Number)
    accuracyTime = this.entityMemory(Number)
    spawnTime() {
        return -999999
    }
    despawnTime() {
        return 999999
    }
    initialize() {
        this.z = getZ(layer.judgment, 0, 0, 0)
    }
    updateParallel() {
        if (this.customMemory.get(this.head).fastLate != 0) {
            this.accuracyTime = this.customMemory.get(this.head).time
            this.accuracy = this.customMemory.get(this.head).fastLate
        }
        if (time.now < this.customMemory.get(this.customMemory.get(0).start).time) return
        if (this.accuracyTime + 0.5 < time.now) return
        const h = 0.054 * ui.configuration.judgment.scale
        const w = h * 23.6
        const centerX = 0
        const centerY = 0.723
        const a = ui.configuration.judgment.alpha
        NormalLayout({
            l: centerX - w / 2,
            r: centerX + w / 2,
            t: centerY - h / 2,
            b: centerY + h / 2,
        }).copyTo(this.layout)
        if (this.accuracy == 3) skin.sprites.flick.draw(this.layout, this.z, a)
        else if (this.accuracy == 1) skin.sprites.fast.draw(this.layout, this.z, a)
        else if (this.accuracy == 2) skin.sprites.late.draw(this.layout, this.z, a)
    }
    get head() {
        return archetypes.ComboNumber.searching.get(0).head
    }
    get customMemory() {
        return archetypes.NormalTapNote.customCombo
    }
}
