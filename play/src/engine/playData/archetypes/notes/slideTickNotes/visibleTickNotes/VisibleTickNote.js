import {
    approach2,
    progressCutoff,
    progressStart,
} from '../../../../../../../../shared/src/engine/data/note.js'
import { perspectiveLayout } from '../../../../../../../../shared/src/engine/data/utils.js'
import { options } from '../../../../../configuration/options.js'
import { sfxDistance } from '../../../../effect.js'
import { note } from '../../../../note.js'
import { flatEffectLayout } from '../../../../particle.js'
import { scaledScreen } from '../../../../scaledScreen.js'
import { getZ, layer } from '../../../../skin.js'
import { TransientHiddenTickNote } from '../TransientHiddenTickNote.js'
import { progress } from '../../../utils.js'
export class VisibleTickNote extends TransientHiddenTickNote {
    spriteLayout = this.entityMemory(Quad)
    z = this.entityMemory(Number)
    y = this.entityMemory(Number)
    progress = this.entityMemory(Number)
    preprocess() {
        super.preprocess()
        if (this.shouldScheduleSFX) this.scheduleSFX()
    }
    initialize() {
        super.initialize()
        const b = 1 + note.h
        const t = 1 - note.h
        if (this.useFallbackSprite) {
            const l = this.import.lane - this.import.size
            const r = this.import.lane + this.import.size
            perspectiveLayout({ l, r, b, t }).copyTo(this.spriteLayout)
        } else {
            const w = note.h / scaledScreen.wToH
            new Rect({
                l: this.import.lane - w,
                r: this.import.lane + w,
                b,
                t,
            })
                .toQuad()
                .copyTo(this.spriteLayout)
        }
        this.z = getZ(layer.note.tick, -this.targetTime, this.import.lane, 0)
    }
    updateParallel() {
        super.updateParallel()
        if (this.despawn) return
        if (time.now < this.sharedMemory.visualStartTime) return
        this.render()
    }
    get shouldScheduleSFX() {
        return options.sfxEnabled && options.autoSFX
    }
    get shouldPlaySFX() {
        return options.sfxEnabled && !options.autoSFX
    }
    get useFallbackSprite() {
        return !this.sprites.tick.exists
    }
    get useFallbackClip() {
        return !this.clips.tick.exists
    }
    scheduleSFX() {
        if (this.useFallbackClip) {
            this.clips.fallback.schedule(this.targetTime, sfxDistance)
        } else {
            this.clips.tick.schedule(this.targetTime, sfxDistance)
        }
    }
    render() {
        this.progress = progress(
            this.import.isAttached,
            this.import.attachHead,
            this.import.attachTail,
            this.targetTime,
            this.sharedMemory.targetScaledTime,
            this.import.timeScaleGroup,
        )
        if (progressStart > this.progress || this.progress > progressCutoff) return
        //const travel = approach2(progressed)
        this.y = approach2(this.progress) /*approach(
                    this.sharedMemory.visualStartTime,
                    this.endTime,
                    timeToScaledTime(time.now, this.import.timeScaleGroup),
                )*/
        if (this.useFallbackSprite) {
            this.sprites.fallback.draw(this.spriteLayout.mul(this.y), this.z, 1)
        } else {
            this.sprites.tick.draw(this.spriteLayout.mul(this.y), this.z, 1)
        }
    }
    playHitEffects() {
        if (this.shouldPlaySFX) this.playSFX()
        if (options.noteEffectEnabled) this.playNoteEffect()
    }
    playSFX() {
        if (this.useFallbackClip) {
            this.clips.fallback.play(sfxDistance)
        } else {
            this.clips.tick.play(sfxDistance)
        }
    }
    playNoteEffect() {
        this.effect.spawn(flatEffectLayout({ lane: this.import.lane }), 0.6, false)
    }
}
