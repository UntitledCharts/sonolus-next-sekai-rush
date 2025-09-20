import { preemptTime, progressTo } from '../../../../../shared/src/engine/data/note.js'
import { options } from '../../configuration/options.js'
import { scaledScreen } from '../scaledScreen.js'
import {
    baseScaledTimeToEarliestTime,
    baseScaledTimeToEarliestTime2,
    baseTimeToScaledTime,
} from './../../../../../shared/src/engine/data/timeScale.js'
import { archetypes } from './index.js'

export const scaledTimeToEarliestTime = (baseTime, tsGroup) =>
    baseScaledTimeToEarliestTime(archetypes, bpmChanges, baseTime, tsGroup)
export const timeToScaledTime = (baseTime, tsGroup, noCache = false) =>
    baseTimeToScaledTime(archetypes, bpmChanges, baseTime, tsGroup, noCache)
export const getVisualSpawnTime = (baseTime, tsGroup) => {
    const progress = progressTo(baseTime, -2, options.noteSpeed)
    return Math.min(
        baseScaledTimeToEarliestTime(
            archetypes,
            bpmChanges,
            baseTime - preemptTime(options.noteSpeed),
            tsGroup,
        ),
        baseScaledTimeToEarliestTime2(
            archetypes,
            bpmChanges,
            baseTime + preemptTime(options.noteSpeed),
            tsGroup,
        ),
        0 <= progress && progress <= 2 ? -2 : 1e8,
    )
}
export const progress = (isAttached, attachHead, attachTail, targetTime, scaledTime, group) => {
    if (isAttached) {
        const attachHeadMemory = archetypes.NormalHeadTapNote.sharedMemory.get(attachHead)
        const attachTailMemory = archetypes.NormalHeadTapNote.sharedMemory.get(attachTail)
        const headProgress =
            time.now < attachHeadMemory.targetTime
                ? progressTo(
                      attachHeadMemory.targetScaledTime,
                      archetypes['#TIMESCALE_GROUP'].timeToScale.get(
                          attachHeadMemory.timeScaleGroup,
                      ).currentScaledTime,
                      options.noteSpeed,
                  )
                : 1
        const tailProgress = progressTo(
            attachTailMemory.targetScaledTime,
            archetypes['#TIMESCALE_GROUP'].timeToScale.get(attachTailMemory.timeScaleGroup)
                .currentScaledTime,
            options.noteSpeed,
        )
        const headFrac =
            time.now < attachHeadMemory.targetTime
                ? 0
                : Math.unlerpClamped(
                      attachHeadMemory.targetTime,
                      attachTailMemory.targetTime,
                      time.now,
                  )
        const tailFrac = 1
        const frac = Math.unlerpClamped(
            attachHeadMemory.targetTime,
            attachTailMemory.targetTime,
            targetTime,
        )
        return Math.remapClamped(headFrac, tailFrac, headProgress, tailProgress, frac)
    } else
        return progressTo(
            scaledTime,
            archetypes['#TIMESCALE_GROUP'].timeToScale.get(group).currentScaledTime,
            options.noteSpeed,
        )
}
