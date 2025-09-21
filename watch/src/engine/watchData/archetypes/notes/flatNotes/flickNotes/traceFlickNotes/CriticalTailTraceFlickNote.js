import { windows } from '../../../../../../../../../shared/src/engine/data/windows.js'
import { buckets } from '../../../../../buckets.js'
import { effect } from '../../../../../effect.js'
import { particle } from '../../../../../particle.js'
import { skin } from '../../../../../skin.js'
import { archetypes } from '../../../../index.js'
import { TraceFlickNote } from './TraceFlickNote.js'
import { options } from '../../../../../../configuration/options.js'

export class CriticalTailTraceFlickNote extends TraceFlickNote {
    sprites = {
        left: skin.sprites.criticalTraceNoteLeft,
        middle: skin.sprites.criticalTraceNoteMiddle,
        right: skin.sprites.criticalTraceNoteRight,
        diamond: skin.sprites.criticalTraceNoteDiamond,
        fallback: skin.sprites.criticalTraceNoteFallback,
    }
    clips = {
        perfect: effect.clips.criticalFlick,
        fallback: effect.clips.flickPerfect,
    }
    effects = {
        circular: particle.effects.criticalNoteCircular,
        linear: particle.effects.criticalNoteLinear,
    }
    arrowSprites = {
        up: [
            skin.sprites.criticalArrowUp1,
            skin.sprites.criticalArrowUp2,
            skin.sprites.criticalArrowUp3,
            skin.sprites.criticalArrowUp4,
            skin.sprites.criticalArrowUp5,
            skin.sprites.criticalArrowUp6,
        ],
        left: [
            skin.sprites.criticalArrowLeft1,
            skin.sprites.criticalArrowLeft2,
            skin.sprites.criticalArrowLeft3,
            skin.sprites.criticalArrowLeft4,
            skin.sprites.criticalArrowLeft5,
            skin.sprites.criticalArrowLeft6,
        ],
        down: [
            skin.sprites.criticalArrowDown1,
            skin.sprites.criticalArrowDown2,
            skin.sprites.criticalArrowDown3,
            skin.sprites.criticalArrowDown4,
            skin.sprites.criticalArrowDown5,
            skin.sprites.criticalArrowDown6,
        ],
        downLeft: [
            skin.sprites.criticalArrowDownLeft1,
            skin.sprites.criticalArrowDownLeft2,
            skin.sprites.criticalArrowDownLeft3,
            skin.sprites.criticalArrowDownLeft4,
            skin.sprites.criticalArrowDownLeft5,
            skin.sprites.criticalArrowDownLeft6,
        ],
        fallback: skin.sprites.criticalArrowFallback,
    }
    directionalEffect = particle.effects.criticalNoteDirectional
    windows = windows.traceFlickNote.critical
    bucket = buckets.criticalTraceFlickNote
    get slotEffect() {
        return archetypes.CriticalSlotEffect
    }
    playLaneEffects() {
        //None
    }
    preprocess() {
        super.preprocess()
        const lane = this.import.lane
        const l = lane - this.import.size
        const r = lane + this.import.size
        const t = this.hitTime
        if (options.laneEffectEnabled)
            archetypes.LaneEffectSpawner.spawn({
                l,
                r,
                lane,
                t: t,
                j: this.import.judgment,
            })
    }
    get critical() {
        return true
    }
}
