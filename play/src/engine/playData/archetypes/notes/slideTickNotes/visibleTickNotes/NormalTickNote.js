import { effect } from '../../../../effect.js'
import { particle } from '../../../../particle.js'
import { skin } from '../../../../skin.js'
import { VisibleSlideTickNote } from './VisibleTickNote.js'
export class NormalTickNote extends VisibleSlideTickNote {
    sprites = {
        tick: skin.sprites.normalSlideTickNote,
        fallback: skin.sprites.normalSlideTickNoteFallback,
    }
    clips = {
        tick: effect.clips.normalTick,
        fallback: effect.clips.normalPerfect,
    }
    effect = particle.effects.normalSlideTickNote
}
