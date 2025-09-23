import { windows } from '../../../../../../../../../shared/src/engine/data/windows.js'
import { buckets } from '../../../../../buckets.js'
import { effect } from '../../../../../effect.js'
import { particle } from '../../../../../particle.js'
import { skin } from '../../../../../skin.js'
import { archetypes } from '../../../../index.js'
import { TraceFlickNote } from './TraceFlickNote.js'
export class NormalHeadTraceFlickNote extends TraceFlickNote {
    sprites = {
        left: skin.sprites.traceFlickNoteLeft,
        middle: skin.sprites.traceFlickNoteMiddle,
        right: skin.sprites.traceFlickNoteRight,
        diamond: skin.sprites.traceFlickNoteDiamond,
        fallback: skin.sprites.traceFlickNoteFallback,
    }
    clips = {
        perfect: effect.clips.flickPerfect,
        great: effect.clips.flickGreat,
        good: effect.clips.flickGood,
    }
    effects = {
        circular: particle.effects.flickNoteCircular,
        linear: particle.effects.flickNoteLinear,
    }
    arrowSprites = {
        up: [
            skin.sprites.flickArrowUp1,
            skin.sprites.flickArrowUp2,
            skin.sprites.flickArrowUp3,
            skin.sprites.flickArrowUp4,
            skin.sprites.flickArrowUp5,
            skin.sprites.flickArrowUp6,
        ],
        left: [
            skin.sprites.flickArrowLeft1,
            skin.sprites.flickArrowLeft2,
            skin.sprites.flickArrowLeft3,
            skin.sprites.flickArrowLeft4,
            skin.sprites.flickArrowLeft5,
            skin.sprites.flickArrowLeft6,
        ],
        down: [
            skin.sprites.flickArrowDown1,
            skin.sprites.flickArrowDown2,
            skin.sprites.flickArrowDown3,
            skin.sprites.flickArrowDown4,
            skin.sprites.flickArrowDown5,
            skin.sprites.flickArrowDown6,
        ],
        downLeft: [
            skin.sprites.flickArrowDownLeft1,
            skin.sprites.flickArrowDownLeft2,
            skin.sprites.flickArrowDownLeft3,
            skin.sprites.flickArrowDownLeft4,
            skin.sprites.flickArrowDownLeft5,
            skin.sprites.flickArrowDownLeft6,
        ],
        fallback: skin.sprites.flickArrowFallback,
    }
    directionalEffect = particle.effects.flickNoteDirectional
    windows = windows.traceFlickNote.normal
    bucket = buckets.normalTraceFlickNote
    get slotEffect() {
        return archetypes.FlickSlotEffect
    }
    get slotGlowEffect() {
        return archetypes.FlickSlotGlowEffect
    }
}
