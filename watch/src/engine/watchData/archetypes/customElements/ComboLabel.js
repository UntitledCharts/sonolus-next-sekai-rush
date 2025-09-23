import { NormalLayout } from '../../../../../../shared/src/engine/data/utils.js'
import { options } from '../../../configuration/options.js'
import { getZ, layer, skin } from '../../skin.js'
import { archetypes } from '../index.js'
export class ComboLabel extends SpawnableArchetype({
    hitTime: Number,
    info: Number,
}) {
    preprocessOrder = 5
    check = this.entityMemory(Boolean)
    z = this.entityMemory(Number)
    z2 = this.entityMemory(Number)
    initialize() {
        this.z = getZ(layer.judgment, 0, 0, 0)
        this.z2 = getZ(layer.judgment - 1, 0, 0, 0)
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
        if (time.now < this.customMemory.get(this.customMemory.get(0).start).time) return
        if (this.customMemory.get(this.spawnData.info).combo == 0) return
        const h = 0.04225 * ui.configuration.combo.scale
        const w = h * 3.22 * 6.65
        const centerX = 5.337
        const centerY = 0.485
        const a = ui.configuration.combo.alpha * 0.8 * ((Math.cos(time.now * Math.PI) + 1) / 2)
        const layout = NormalLayout({
            l: centerX - w / 2,
            r: centerX + w / 2,
            t: centerY - h / 2,
            b: centerY + h / 2,
        })
        if (this.customMemory.get(this.spawnData.info).ap == true || !options.ap)
            skin.sprites.combo.draw(layout, this.z, ui.configuration.combo.alpha)
        else {
            skin.sprites.apCombo.draw(layout, this.z, ui.configuration.combo.alpha)
            skin.sprites.glowCombo.draw(layout, this.z2, a)
        }
    }
    get next() {
        return this.customMemory.get(this.spawnData.info).value
    }
    get customMemory() {
        return archetypes.NormalTapNote.customCombo
    }
}
