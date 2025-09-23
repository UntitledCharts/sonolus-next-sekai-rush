import {
    approach,
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
import { progress } from '../../../utils.js'
import { TransientHiddenTickNote } from '../TransientHiddenTickNote.js'
export class VisibleTickNote extends TransientHiddenTickNote {
    hiddenTime = this.entityMemory(Number)
    initialized = this.entityMemory(Boolean)
    spriteLayout = this.entityMemory(Quad)
    progress = this.entityMemory(Number)
    z = this.entityMemory(Number)
    preprocess() {
        super.preprocess()
        if (options.sfxEnabled) {
            if (replay.isReplay && !options.autoSFX) {
                this.scheduleReplaySFX()
            } else {
                this.scheduleSFX()
            }
        }
    }
    spawnTime() {
        return this.visualSpawnTime
    }
    despawnTime() {
        return this.sharedMemory.hitTime
    }
    initialize() {
        if (this.initialized) return
        this.initialized = true
        this.globalInitialize()
    }
    updateParallel() {
        this.render()
    }
    terminate() {
        if (time.skip) return
        this.despawnTerminate()
    }
    get useFallbackSprite() {
        return !this.sprites.tick.exists
    }
    get useFallbackClip() {
        return !this.clips.tick.exists
    }
    globalInitialize() {
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
    scheduleSFX() {
        if (this.useFallbackClip) {
            this.clips.fallback.schedule(this.targetTime, sfxDistance)
        } else {
            this.clips.tick.schedule(this.targetTime, sfxDistance)
        }
    }
    scheduleReplaySFX() {
        if (!this.import.judgment) return
        this.scheduleSFX()
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
        const y = approach2(this.progress) /*approach(
                    this.sharedMemory.visualStartTime,
                    this.endTime,
                    timeToScaledTime(time.now, this.import.timeScaleGroup),
                )*/
        if (this.useFallbackSprite) {
            this.sprites.fallback.draw(this.spriteLayout.mul(y), this.z, 1)
        } else {
            this.sprites.tick.draw(this.spriteLayout.mul(y), this.z, 1)
        }
    }
    despawnTerminate() {
        if (replay.isReplay && !this.import.judgment) return
        if (options.noteEffectEnabled) this.playNoteEffect()
    }
    playNoteEffect() {
        this.effect.spawn(flatEffectLayout({ lane: this.import.lane }), 0.6, false)
    }
}
