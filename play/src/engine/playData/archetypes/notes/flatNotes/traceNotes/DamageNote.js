import { options } from '../../../../../configuration/options.js'
import { effect, sfxDistance } from '../../../../effect.js'
import { particle } from '../../../../particle.js'
import { skin } from '../../../../skin.js'
import { archetypes } from '../../../index.js'
import { TraceNote } from './TraceNote.js'
import { windows } from '../../../../../../../../shared/src/engine/data/windows.js'

export class DamageNote extends TraceNote {
    bucket = { index: -1 }
    leniency = 0
    windows = windows.damageNote.normal

    sprites = {
        left: skin.sprites.damageNoteLeft,
        middle: skin.sprites.damageNoteMiddle,
        right: skin.sprites.damageNoteRight,
        fallback: skin.sprites.damageNoteFallback,
    }

    clips = {
        perfect: effect.clips.normalGood,
    }

    effects = {
        circular: particle.effects.damageNoteCircular,
        linear: particle.effects.damageNoteLinear,
    }

    damageExport = this.defineExport({
        hitTime: { name: 'hitTime', type: Number },
    })

    get slotEffect() {
        return archetypes.NormalSlotEffect
    }

    get slotGlowEffect() {
        return archetypes.NormalSlotGlowEffect
    }

    shouldQuit = this.entityMemory(Boolean)

    globalPreprocess() {
        this.life.miss = -40
    }

    touch() {
        for (const touch of touches) {
            if (time.now < this.targetTime) continue
            if (!this.hitbox.contains(touch.position)) continue

            this.complete()
            return
        }
    }

    updateParallel() {
        super.updateParallel()
        if (this.shouldQuit) {
            this.result.judgment = Judgment.Perfect
            this.result.accuracy = 0
            this.despawn = true
        }
        if (time.now > this.targetTime) {
            this.shouldQuit = true
        }
    }
    drawDiamond() {
        //none
    }
    complete() {
        this.result.judgment = Judgment.Miss
        this.result.accuracy = 0
        this.damageExport('hitTime', time.now)

        this.playHitEffects(time.now)

        this.despawn = true
    }

    playSFX() {
        effect.clips.normalGood.play(sfxDistance)
    }
    playHitEffects(hitTime) {
        if (options.sfxEnabled && !options.autoSFX) this.playSFX()
        super.playHitEffects(hitTime)
    }

    terminate() {
        // Noop
    }

    playSlotEffects(startTime) {
        const start = Math.floor(this.import.lane - this.import.size)
        const end = Math.ceil(this.import.lane + this.import.size)

        for (let i = start; i < end; i++) {
            this.slotEffect.spawn({
                startTime,
                lane: i + 0.5,
            })
        }
    }
    get useFallbackSprites() {
        return (
            !this.sprites.left.exists || !this.sprites.middle.exists || !this.sprites.right.exists
        )
    }
}
