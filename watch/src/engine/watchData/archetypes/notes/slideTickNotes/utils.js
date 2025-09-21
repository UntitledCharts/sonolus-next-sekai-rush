import { ease } from '../../../../../../../shared/src/engine/data/EaseType.js'
export const getAttached = (
    easeType,
    headLane,
    headSize,
    headTargetTime,
    tailLane,
    tailSize,
    tailTargetTime,
    targetTime,
) => {
    let frac = 0
    if (Math.abs(headTargetTime + tailTargetTime) < 1e-6) frac = 0.5
    else frac = Math.remapClamped(headTargetTime, tailTargetTime, 0, 1, targetTime)
    const easedFrac = ease(easeType, frac)
    return {
        lane: Math.lerp(headLane, tailLane, easedFrac),
        size: Math.lerp(headSize, tailSize, easedFrac),
    }
}
