import {
    baseScaledTimeToEarliestTime,
    baseTimeToScaledTime,
} from './../../../../../shared/src/engine/data/timeScale.js'
import { archetypes } from './index.js'

export const scaledTimeToEarliestTime = (baseTime, tsGroup) =>
    baseScaledTimeToEarliestTime(archetypes, bpmChanges, baseTime, tsGroup)
export const timeToScaledTime = (baseTime, tsGroup, noCache = false) =>
    baseTimeToScaledTime(archetypes, bpmChanges, baseTime, tsGroup, noCache)
