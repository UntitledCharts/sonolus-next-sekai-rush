export const note = {
    h: 75 / 850 / 2,
}
export const approach = (fromTime, toTime, now) =>
    1.06 ** (45 * Math.remap(fromTime, toTime, -1, 0, now))

export const approach2 = (progress) => (1.06 ** -45) ** (1 - progress)

export const progressTo = (toTime, scaledNow, noteSpeed) =>
    Math.unlerp(toTime - preemptTime(noteSpeed), toTime, scaledNow)
export const preemptTime = (noteSpeed) => Math.lerp(0.35, 4, Math.unlerp(12, 1, noteSpeed) ** 1.31)
export const progressStart = 0
export const progressCutoff = 1 - Math.log(2.5) / Math.log(1.06 ** -45)
