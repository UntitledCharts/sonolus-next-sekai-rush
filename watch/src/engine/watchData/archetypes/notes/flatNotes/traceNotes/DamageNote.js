import { effect } from '../../../../effect.js'
import { particle } from '../../../../particle.js'
import { options } from '../../../../../configuration/options.js'
import { TraceNote } from './TraceNote.js'
import { skin } from '../../../../skin.js'
import { archetypes } from '../../../index.js'

export class DamageNote extends TraceNote {
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

    get slotEffect() {
        return archetypes.NormalSlotEffect
    }

    get slotGlowEffect() {
        return archetypes.NormalSlotGlowEffect
    }

    globalPreprocess() {
        this.life.miss = -40
    }

    preprocess() {
        super.preprocess()
        if (replay.isReplay && options.sfxEnabled && !this.import.judgment) {
            this.scheduleReplaySFX()
        }
    }
}
