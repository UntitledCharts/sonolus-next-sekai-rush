var EaseType
;(function (EaseType) {
    EaseType[(EaseType['None'] = 0)] = 'None'
    EaseType[(EaseType['Linear'] = 1)] = 'Linear'
})(EaseType || (EaseType = {}))
export const baseTimeToScaledTime = (
    archetypes,
    bpmChanges,
    baseTime,
    tsGroup,
    noCache = false,
) => {
    const tsM = archetypes['#TIMESCALE_GROUP'].timeToScale.get(tsGroup)
    if (baseTime < -2) return baseTime
    if (!noCache && baseTime === tsM.currentTime) {
        return tsM.currentScaledTime
    }
    const tsGroupEntity = archetypes['#TIMESCALE_GROUP'].import.get(tsGroup)
    if (baseTime < tsM.lastTime) {
        tsM.nextRef = tsGroupEntity.firstRef
        tsM.lastTime = -2
        tsM.lastScaledTime = -2
        tsM.lastTimeScale = 1
        tsM.lastEase = EaseType.None
    }
    while (tsM.nextRef > 0) {
        const change = archetypes['#TIMESCALE_CHANGE'].import.get(tsM.nextRef)
        const nextTimeScale = change.timeScale
        const nextTime = bpmChanges.at(change.beat).time
        let nextScaledTime = 0
        switch (tsM.lastEase) {
            case EaseType.None:
                nextScaledTime = tsM.lastScaledTime + (nextTime - tsM.lastTime) * tsM.lastTimeScale
                break
            case EaseType.Linear:
                nextScaledTime =
                    tsM.lastScaledTime +
                    ((nextTime - tsM.lastTime) * (nextTimeScale + tsM.lastTimeScale)) / 2
                break
        }
        const skipScaledTime = (change.timeScaleSkip * 60) / bpmChanges.at(change.beat).bpm
        if (baseTime <= nextTime) {
            if (Math.abs(nextTime - tsM.lastTime) < 1e-6) return tsM.lastScaledTime
            switch (tsM.lastEase) {
                case EaseType.None:
                    return Math.remap(
                        tsM.lastTime,
                        nextTime,
                        tsM.lastScaledTime,
                        nextScaledTime,
                        baseTime,
                    )
                case EaseType.Linear: {
                    const avgTimeScale =
                        (tsM.lastTimeScale +
                            Math.remap(
                                tsM.lastTime,
                                nextTime,
                                tsM.lastTimeScale,
                                nextTimeScale,
                                baseTime,
                            )) /
                        2
                    return tsM.lastScaledTime + (baseTime - tsM.lastTime) * avgTimeScale
                }
            }
        }
        tsM.lastTimeScale = nextTimeScale
        tsM.lastTime = nextTime
        tsM.lastScaledTime = nextScaledTime + skipScaledTime
        tsM.lastEase = change.timeScaleEase
        tsM.nextRef = change.nextRef
    }
    return tsM.lastScaledTime + (baseTime - tsM.lastTime) * tsM.lastTimeScale
}

export const baseScaledTimeToEarliestTime = (archetypes, bpmChanges, time, tsGroup) => {
    const tsGroupEntity = archetypes['#TIMESCALE_GROUP'].import.get(tsGroup)
    const tsM = archetypes['#TIMESCALE_GROUP'].scaleToTime.get(tsGroup)
    if (time < tsM.lastQueryScaledTime || tsM.lastQueryScaledTime < -2) {
        tsM.nextRef = tsGroupEntity.firstRef
        tsM.lastTime = -2
        tsM.lastTimeScale = 1
        tsM.lastScaledTime = -2
        tsM.lastEase = EaseType.None
        tsM.lastQueryScaledTime = -2
    }
    tsM.lastQueryScaledTime = time
    while (tsM.nextRef > 0) {
        const change = archetypes['#TIMESCALE_CHANGE'].import.get(tsM.nextRef)
        const nextTimeScale = change.timeScale
        const nextTime = bpmChanges.at(change.beat).time
        let nextScaledTime = 0
        switch (tsM.lastEase) {
            case EaseType.None:
                nextScaledTime = tsM.lastScaledTime + (nextTime - tsM.lastTime) * tsM.lastTimeScale
                if (
                    (tsM.lastScaledTime <= time &&
                        time <= nextScaledTime &&
                        tsM.lastTimeScale > 0) ||
                    (tsM.lastScaledTime >= time && time >= nextScaledTime && tsM.lastTimeScale < 0)
                ) {
                    if (Math.abs(nextScaledTime - tsM.lastScaledTime) < 1e-6) return tsM.lastTime
                    return Math.remap(
                        tsM.lastScaledTime,
                        nextScaledTime,
                        tsM.lastTime,
                        nextTime,
                        time,
                    )
                }
                break
            case EaseType.Linear:
                nextScaledTime =
                    tsM.lastScaledTime +
                    ((nextTime - tsM.lastTime) * (nextTimeScale + tsM.lastTimeScale)) / 2
                if (Math.abs(nextTime - tsM.lastTime) < 1e-6) {
                    const loScaledTime = Math.min(tsM.lastScaledTime, nextScaledTime)
                    const hiScaledTime = Math.max(tsM.lastScaledTime, nextScaledTime)
                    if (loScaledTime <= time && time <= hiScaledTime) return tsM.lastTime
                } else {
                    const a = (nextTimeScale - tsM.lastTimeScale) / (nextTime - tsM.lastTime)
                    const b = tsM.lastTimeScale
                    const c = tsM.lastScaledTime - time

                    let firstTime = 1e6
                    let foundTime = false

                    if (Math.abs(a) < 1e-6) {
                        if (Math.abs(b) > 1e-6) {
                            const dt = -c / b
                            if (0 <= dt && dt <= nextTime - tsM.lastTime) {
                                firstTime = Math.min(firstTime, tsM.lastTime + dt)
                                foundTime = true
                            }
                        }
                    } else {
                        const discriminant = b * b - 2 * a * c
                        if (discriminant >= 0) {
                            const sqrtDiscriminant = Math.sqrt(discriminant)
                            const solutions = [
                                (-b + sqrtDiscriminant) / a,
                                (-b - sqrtDiscriminant) / a,
                            ]

                            for (const dt of solutions) {
                                if (0 <= dt && dt <= nextTime - tsM.lastTime) {
                                    firstTime = Math.min(firstTime, tsM.lastTime + dt)
                                    foundTime = true
                                }
                            }
                        }
                    }
                    if (foundTime) return firstTime
                }
                break
        }
        const skipScaledTime = (change.timeScaleSkip * 60) / bpmChanges.at(change.beat).bpm
        if (
            (nextScaledTime <= time && time <= nextScaledTime + change.timeScaleSkip) ||
            (nextScaledTime + change.timeScaleSkip <= time && time <= nextScaledTime)
        )
            return nextTime
        tsM.lastTimeScale = nextTimeScale
        tsM.lastTime = nextTime
        tsM.lastScaledTime = nextScaledTime + skipScaledTime
        tsM.lastEase = change.timeScaleEase
        tsM.nextRef = change.nextRef
    }
    if (tsM.lastTimeScale == 0) return 1e6
    const additionalTime = (time - tsM.lastScaledTime) / tsM.lastTimeScale
    if (additionalTime < 0) return 1e6
    return tsM.lastTime + additionalTime
}
export const baseScaledTimeToEarliestTime2 = (archetypes, bpmChanges, time, tsGroup) => {
    const tsGroupEntity = archetypes['#TIMESCALE_GROUP'].import.get(tsGroup)
    const tsM = archetypes['#TIMESCALE_GROUP'].scaleToTime2.get(tsGroup)
    if (time < tsM.lastQueryScaledTime || tsM.lastQueryScaledTime < -2) {
        tsM.nextRef = tsGroupEntity.firstRef
        tsM.lastTime = -2
        tsM.lastTimeScale = 1
        tsM.lastScaledTime = -2
        tsM.lastEase = EaseType.None
        tsM.lastQueryScaledTime = -2
    }
    tsM.lastQueryScaledTime = time
    while (tsM.nextRef > 0) {
        const change = archetypes['#TIMESCALE_CHANGE'].import.get(tsM.nextRef)
        const nextTimeScale = change.timeScale
        const nextTime = bpmChanges.at(change.beat).time
        let nextScaledTime = 0
        switch (tsM.lastEase) {
            case EaseType.None:
                nextScaledTime = tsM.lastScaledTime + (nextTime - tsM.lastTime) * tsM.lastTimeScale
                if (
                    (tsM.lastScaledTime <= time &&
                        time <= nextScaledTime &&
                        tsM.lastTimeScale > 0) ||
                    (tsM.lastScaledTime >= time && time >= nextScaledTime && tsM.lastTimeScale < 0)
                ) {
                    if (Math.abs(nextScaledTime - tsM.lastScaledTime) < 1e-6) return tsM.lastTime
                    return Math.remap(
                        tsM.lastScaledTime,
                        nextScaledTime,
                        tsM.lastTime,
                        nextTime,
                        time,
                    )
                }
                break
            case EaseType.Linear:
                nextScaledTime =
                    tsM.lastScaledTime +
                    ((nextTime - tsM.lastTime) * (nextTimeScale + tsM.lastTimeScale)) / 2
                if (Math.abs(nextTime - tsM.lastTime) < 1e-6) {
                    const loScaledTime = Math.min(tsM.lastScaledTime, nextScaledTime)
                    const hiScaledTime = Math.max(tsM.lastScaledTime, nextScaledTime)
                    if (loScaledTime <= time && time <= hiScaledTime) return tsM.lastTime
                } else {
                    const a = (nextTimeScale - tsM.lastTimeScale) / (nextTime - tsM.lastTime)
                    const b = tsM.lastTimeScale
                    const c = tsM.lastScaledTime - time

                    let firstTime = 1e6
                    let foundTime = false

                    if (Math.abs(a) < 1e-6) {
                        if (Math.abs(b) > 1e-6) {
                            const dt = -c / b
                            if (0 <= dt && dt <= nextTime - tsM.lastTime) {
                                firstTime = Math.min(firstTime, tsM.lastTime + dt)
                                foundTime = true
                            }
                        }
                    } else {
                        const discriminant = b * b - 2 * a * c
                        if (discriminant >= 0) {
                            const sqrtDiscriminant = Math.sqrt(discriminant)
                            const solutions = [
                                (-b + sqrtDiscriminant) / a,
                                (-b - sqrtDiscriminant) / a,
                            ]

                            for (const dt of solutions) {
                                if (0 <= dt && dt <= nextTime - tsM.lastTime) {
                                    firstTime = Math.min(firstTime, tsM.lastTime + dt)
                                    foundTime = true
                                }
                            }
                        }
                    }
                    if (foundTime) return firstTime
                }
                break
        }
        const skipScaledTime = (change.timeScaleSkip * 60) / bpmChanges.at(change.beat).bpm
        if (
            (nextScaledTime <= time && time <= nextScaledTime + change.timeScaleSkip) ||
            (nextScaledTime + change.timeScaleSkip <= time && time <= nextScaledTime)
        )
            return nextTime
        tsM.lastTimeScale = nextTimeScale
        tsM.lastTime = nextTime
        tsM.lastScaledTime = nextScaledTime + skipScaledTime
        tsM.lastEase = change.timeScaleEase
        tsM.nextRef = change.nextRef
    }
    if (tsM.lastTimeScale == 0) return 1e6
    const additionalTime = (time - tsM.lastScaledTime) / tsM.lastTimeScale
    if (additionalTime < 0) return 1e6
    return tsM.lastTime + additionalTime
}
