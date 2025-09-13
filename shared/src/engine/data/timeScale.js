export const baseTimeToScaledTime = (
    archetypes,
    bpmChanges,
    baseTime,
    tsGroup,
    noCache = false,
) => {
    const tsGroupSharedMemory = archetypes['#TIMESCALE_GROUP'].sharedMemory.get(tsGroup)
    if (!noCache && baseTime === tsGroupSharedMemory.currentTime) {
        return tsGroupSharedMemory.currentScaledTime
    }

    const tsGroupEntity = archetypes['#TIMESCALE_GROUP'].import.get(tsGroup)
    let ret = 0
    let nextRef = tsGroupEntity.firstRef

    if (nextRef <= 0) return baseTime

    const firstTsChange = archetypes['#TIMESCALE_CHANGE'].import.get(nextRef)
    const firstTsChangeTime = bpmChanges.at(firstTsChange.beat).time
    if (baseTime < firstTsChangeTime) {
        return baseTime
    }
    ret = firstTsChangeTime

    while (nextRef >= 0) {
        const tsChangeStart = archetypes['#TIMESCALE_CHANGE'].import.get(nextRef)
        if (tsChangeStart.timeScaleGroup !== tsGroup) {
            nextRef = tsChangeStart.nextRef
            continue
        }
        const tsChangeStartTime = bpmChanges.at(tsChangeStart.beat).time

        const nextNextRef = tsChangeStart.nextRef
        if (!nextNextRef) {
            return ret + (baseTime - tsChangeStartTime) * tsChangeStart.timeScale
        }

        const tsChangeEnd = archetypes['#TIMESCALE_CHANGE'].import.get(nextNextRef)
        const tsChangeEndTime = bpmChanges.at(tsChangeEnd.beat).time

        if (baseTime < tsChangeEndTime) {
            return ret + (baseTime - tsChangeStartTime) * tsChangeStart.timeScale
        }

        const timeDiff = tsChangeEndTime - tsChangeStartTime
        ret += timeDiff * tsChangeStart.timeScale
        nextRef = nextNextRef
    }

    return baseTime
}

export const baseScaledTimeToEarliestTime = (archetypes, bpmChanges, time, tsGroup) => {
    const tsGroupEntity = archetypes['#TIMESCALE_GROUP'].import.get(tsGroup)
    let nextRef = tsGroupEntity.firstRef
    let currentTime = 0

    if (nextRef <= 0) return time

    const firstTsChange = archetypes['#TIMESCALE_CHANGE'].import.get(nextRef)
    const firstTsChangeTime = bpmChanges.at(firstTsChange.beat).time
    if (time < firstTsChangeTime) {
        return time
    }
    currentTime = firstTsChangeTime

    while (nextRef >= 0) {
        const tsChangeStart = archetypes['#TIMESCALE_CHANGE'].import.get(nextRef)
        if (tsChangeStart.timeScaleGroup !== tsGroup) {
            nextRef = tsChangeStart.nextRef
            continue
        }
        const tsChangeStartTime = bpmChanges.at(tsChangeStart.beat).time

        const nextNextRef = tsChangeStart.nextRef
        if (!nextNextRef) {
            return tsChangeStartTime + (time - currentTime) / tsChangeStart.timeScale
        }

        const tsChangeEnd = archetypes['#TIMESCALE_CHANGE'].import.get(nextRef)
        const tsChangeEndTime = bpmChanges.at(tsChangeEnd.beat).time

        const timeDiff = tsChangeEndTime - tsChangeStartTime
        const scaledTimeDiff = timeDiff * tsChangeStart.timeScale
        if (time <= currentTime + scaledTimeDiff) {
            return tsChangeStartTime + (time - currentTime) / tsChangeStart.timeScale
        }
        currentTime += scaledTimeDiff
        nextRef = nextNextRef
    }

    return time
}
