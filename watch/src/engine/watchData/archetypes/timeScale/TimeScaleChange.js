import { EngineArchetypeDataName } from '@sonolus/core'
import { archetypes } from '..'

export class TimeScaleChange extends Archetype {
    import = this.defineImport({
        timeScaleGroup: { name: '#TIMESCALE_GROUP', type: Number },
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        timeScale: { name: EngineArchetypeDataName.TimeScale, type: Number },
        nextRef: { name: 'next', type: Number },
        timeScaleSkip: { name: '#TIMESCALE_SKIP', type: Number },
        timeScaleEase: { name: '#TIMESCALE_EASE', type: Number },
    })
}
