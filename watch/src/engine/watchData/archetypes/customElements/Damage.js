import { NormalLayout } from '../../../../../../shared/src/engine/data/utils.js'
import { getZ, layer, skin } from '../../skin.js'
import { scaledScreen } from '../../scaledScreen.js'
import { archetypes } from '../index.js'

export class Damage extends SpawnableArchetype({}) {
    preprocessOrder = 5
    check = this.entityMemory(Boolean)
    z = this.entityMemory(Number)
    missTime = this.entityMemory(Number)
    initialize() {
        this.z = getZ(layer.damage, 0, 0, 0)
        this.missTime = -1
    }
    spawnTime() {
        return -999999
    }
    despawnTime() {
        return 999999
    }
    updateParallel() {
        if (this.customMemory.get(this.head).judgment == Judgment.Miss) {
            this.missTime = this.customMemory.get(this.head).time
        }
        if (time.now < this.customMemory.get(this.customMemory.get(0).start).time) return
        if (this.missTime + 0.35 < time.now) return
        if (this.missTime == -1) return
        const t = Math.unlerp(this.missTime, this.missTime + 0.35, time.now)
        const a = 0.768 * Math.pow(t, 0.1) * Math.pow(1 - t, 1.35)
        const layout1 = NormalLayout({
            l: scaledScreen.l,
            r: 0,
            t: scaledScreen.t + scaledScreen.wToH,
            b: scaledScreen.b + scaledScreen.wToH,
        })
        const layout2 = NormalLayout({
            l: -scaledScreen.l,
            r: 0,
            t: scaledScreen.t + scaledScreen.wToH,
            b: scaledScreen.b + scaledScreen.wToH,
        })
        const layout3 = NormalLayout({
            l: scaledScreen.l,
            r: 0,
            t: scaledScreen.b - scaledScreen.t + scaledScreen.wToH,
            b: scaledScreen.b + scaledScreen.wToH,
        })
        const layout4 = NormalLayout({
            l: -scaledScreen.l,
            r: 0,
            t: scaledScreen.b - scaledScreen.t + scaledScreen.wToH,
            b: scaledScreen.b + scaledScreen.wToH,
        })
        skin.sprites.damage.draw(layout1, this.z, a)
        skin.sprites.damage.draw(layout2, this.z, a)
        skin.sprites.damage.draw(layout3, this.z, a)
        skin.sprites.damage.draw(layout4, this.z, a)
    }
    get head() {
        return archetypes.ComboNumber.searching.get(0).head
    }
    get customMemory() {
        return archetypes.NormalTapNote.customCombo
    }
}
