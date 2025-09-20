import { ease } from '../../../../../../shared/src/engine/data/EaseType.js'
import {
    approach2,
    progressCutoff,
    progressStart,
} from '../../../../../../shared/src/engine/data/note.js'
import { archetypes } from '../index.js'
import { options } from '../../../configuration/options.js'
import { getHitbox } from '../../lane.js'
import { note } from '../../note.js'
import { scaledScreen } from '../../scaledScreen.js'
import { getZ, layer, skin } from '../../skin.js'
import { disallowEmpty } from '../InputManager.js'
import { timeToScaledTime, progress } from '../utils.js'
import { QuadLayout } from '../../../../../../shared/src/engine/data/utils.js'
import { getAttached } from '../notes/slideTickNotes/utils.js'
export var VisualType
;(function (VisualType) {
    VisualType[(VisualType['Waiting'] = 0)] = 'Waiting'
    VisualType[(VisualType['NotActivated'] = 1)] = 'NotActivated'
    VisualType[(VisualType['Activated'] = 2)] = 'Activated'
})(VisualType || (VisualType = {}))
export var kind
;(function (kind) {
    kind[(kind['None'] = 0)] = 'None'
    // Slide
    kind[(kind['ActiveNormal'] = 1)] = 'ActiveNormal'
    kind[(kind['ActiveCritical'] = 2)] = 'ActiveCritical'
    kind[(kind['ActiveFakeNormal'] = 51)] = 'ActiveFakeNormal'
    kind[(kind['ActiveFakeCritical'] = 52)] = 'ActiveFakeCritical'
    // Guide
    kind[(kind['GuideNeutral'] = 101)] = 'GuideNeutral'
    kind[(kind['GuideRed'] = 102)] = 'GuideRed'
    kind[(kind['GuideGreen'] = 103)] = 'GuideGreen'
    kind[(kind['GuideBlue'] = 104)] = 'GuideBlue'
    kind[(kind['GuideYellow'] = 105)] = 'GuideYellow'
    kind[(kind['GuidePurple'] = 106)] = 'GuidePurple'
    kind[(kind['GuideCyan'] = 107)] = 'GuideCyan'
    kind[(kind['GuideBlack'] = 108)] = 'GuideBlack'
})(kind || (kind = {}))
export class Guide extends Archetype {
    sprites = {
        normal: {
            active: skin.sprites.normalActiveSlideConnectorNormal,
            normal: skin.sprites.normalActiveSlideConnectorActive,
            fallback: skin.sprites.normalActiveSlideConnectorFallback,
        },
        critical: {
            active: skin.sprites.criticalActiveSlideConnectorNormal,
            normal: skin.sprites.criticalActiveSlideConnectorActive,
            fallback: skin.sprites.criticalActiveSlideConnectorFallback,
        },
        guide: {
            green: skin.sprites.guideGreen,
            yellow: skin.sprites.guideYellow,
            blue: skin.sprites.guideBlue,
            neutral: skin.sprites.guideNeutral,
            red: skin.sprites.guideRed,
            cyan: skin.sprites.guideCyan,
            purple: skin.sprites.guidePurple,
            black: skin.sprites.guideBlack,
        },
    }
    leniency = 1
    import = this.defineImport({
        activeHeadRef: { name: 'activeHead', type: Number },
        activeTailRef: { name: 'activeTail', type: Number },
        headRef: { name: 'head', type: Number },
        tailRef: { name: 'tail', type: Number },
        segmentHeadRef: { name: 'segmentHead', type: Number },
        segmentTailRef: { name: 'segmentTail', type: Number },
    })
    activeHead = this.entityMemory({
        scaledTime: Number,
    })
    activeTail = this.entityMemory({
        time: Number,
        scaledTime: Number,
    })
    head = this.entityMemory({
        scaledTime: Number,
        l: Number,
        r: Number,
    })
    segmentHead = this.entityMemory({
        scaledTime: Number,
        l: Number,
        r: Number,
        alpha: Number,
    })
    segmentTail = this.entityMemory({
        scaledTime: Number,
        alpha: Number,
    })
    tail = this.entityMemory({
        scaledTime: Number,
        l: Number,
        r: Number,
    })
    visualTime = this.entityMemory({
        start: Number,
        end: Number,
    })
    hiddenTime = this.entityMemory(Number)
    spawnTime = this.entityMemory(Number)
    endTime = this.entityMemory(Number)
    inputTime = this.entityMemory({
        start: Number,
        end: Number,
    })
    z = this.entityMemory(Number)
    visual = this.entityMemory(DataType)
    preprocessOrder = 2
    preprocess() {
        this.activeHeadMemory.activeConnectorInfo.info = this.info.index
        this.head.scaledTime = this.headMemory.targetScaledTime
        this.tail.scaledTime = this.tailMemory.targetScaledTime
        this.segmentHead.scaledTime = this.segmentHeadMemory.targetScaledTime
        this.segmentTail.scaledTime = this.segmentTailMemory.targetScaledTime
        this.activeHead.scaledTime = this.activeHeadMemory.targetScaledTime
        this.visualTime.start = Math.min(this.headMemory.targetTime, this.tailMemory.targetTime)
        this.visualTime.end = Math.max(this.headMemory.targetTime, this.tailMemory.targetTime)
        this.inputTime.start = this.visualTime.start + input.offset
        this.inputTime.end = this.visualTime.end + input.offset
        this.spawnTime = Math.min(
            this.visualTime.start,
            this.inputTime.start,
            this.headMemory.spawnTime,
            this.tailMemory.spawnTime,
        )
        this.endTime = Math.max(this.visualTime.end, this.inputTime.end)
    }
    get activeHeadMemory() {
        return archetypes.NormalHeadTapNote.sharedMemory.get(this.import.activeHeadRef)
    }
    get activeTailMemory() {
        return archetypes.NormalHeadTapNote.sharedMemory.get(this.import.activeTailRef)
    }
    get segmentHeadMemory() {
        return archetypes.NormalHeadTapNote.sharedMemory.get(this.import.segmentHeadRef)
    }
    get segmentTailMemory() {
        return archetypes.NormalHeadTapNote.sharedMemory.get(this.import.segmentTailRef)
    }
    get headMemory() {
        return archetypes.NormalHeadTapNote.sharedMemory.get(this.import.headRef)
    }
    get tailMemory() {
        return archetypes.NormalHeadTapNote.sharedMemory.get(this.import.tailRef)
    }
    spawnOrder() {
        return this.spawnTime
    }
    shouldSpawn() {
        return time.now >= this.spawnTime
    }
    initialize() {
        this.head.l = this.headMemory.lane - this.headMemory.size
        this.head.r = this.headMemory.lane + this.headMemory.size
        this.tail.l = this.tailMemory.lane - this.tailMemory.size
        this.tail.r = this.tailMemory.lane + this.tailMemory.size
        if (options.hidden > 0)
            this.hiddenTime = this.tail.scaledTime - note.duration * options.hidden
        if (this.segmentHeadMemory.segmentKind == 0) this.z = 0
        else if (this.segmentHeadMemory.segmentKind < 100)
            this.z = getZ(
                layer.note.connector,
                -this.segmentHeadMemory.targetTime,
                this.segmentHeadMemory.lane,
                this.critical,
            )
        else
            this.z = getZ(
                layer.note.guide,
                -this.segmentHeadMemory.targetTime,
                this.segmentHeadMemory.lane,
                this.segmentHeadMemory.segmentKind - kind.GuideNeutral,
            )
    }
    updateSequentialOrder = 1
    updateSequential() {
        if (time.now < this.headMemory.targetTime) return
        if (this.import.activeHeadRef <= 0) return
        let inputLane = 0
        let inputSize = 0
        ;({ lane: inputLane, size: inputSize } = this.getAttachedParams(time.now - input.offset))
        this.activeHeadMemory.activeConnectorInfo.prevInputLane =
            this.activeHeadMemory.activeConnectorInfo.inputLane
        this.activeHeadMemory.activeConnectorInfo.prevInputSize =
            this.activeHeadMemory.activeConnectorInfo.inputSize
        this.activeHeadMemory.activeConnectorInfo.inputLane = inputLane
        this.activeHeadMemory.activeConnectorInfo.inputSize = inputSize
        const hitbox = getHitbox({
            l: inputLane - inputSize,
            r: inputLane + inputSize,
            leniency: this.leniency,
        })
        for (const touch of touches) {
            if (touch.ended) continue
            if (!hitbox.contains(touch.position)) continue
            if (this.segmentHeadMemory.segmentKind < 100) disallowEmpty(touch)
            this.activeHeadMemory.lastActiveTime = time.now
        }
        if (this.segmentHeadMemory.segmentKind < 100) {
            if (this.activeHeadMemory.lastActiveTime === time.now) {
                if (this.activeHeadMemory.exportStartTime !== -1000) return
                streams.set(this.import.activeHeadRef, time.now, 999999)
                this.activeHeadMemory.exportStartTime = time.now
            } else {
                if (this.activeHeadMemory.exportStartTime === -1000) return
                streams.set(
                    this.import.activeHeadRef,
                    this.activeHeadMemory.exportStartTime,
                    time.now,
                )
                this.activeHeadMemory.exportStartTime = -1000
            }
        }
    }
    updateParallel() {
        if (time.now >= this.endTime) {
            this.despawn = true
            return
        }
        if (time.now < this.visualTime.end) {
            if (this.segmentHeadMemory.segmentKind < 100) this.updateVisualType()
            this.renderConnector()
        }
    }
    useFallbackSprite() {
        if (
            this.segmentHeadMemory.segmentKind == kind.ActiveNormal ||
            this.segmentHeadMemory.segmentKind == kind.ActiveFakeNormal
        )
            return !this.sprites.normal.normal.exists || !this.sprites.normal.active.exists
        else if (
            this.segmentHeadMemory.segmentKind == kind.ActiveCritical ||
            this.segmentHeadMemory.segmentKind == kind.ActiveFakeCritical
        )
            return !this.sprites.critical.normal.exists || !this.sprites.critical.active.exists
        else if (this.segmentHeadMemory.segmentKind == kind.GuideGreen)
            return !this.sprites.guide.green.exists
        else if (this.segmentHeadMemory.segmentKind == kind.GuideYellow)
            return !this.sprites.guide.yellow.exists
        else if (this.segmentHeadMemory.segmentKind == kind.GuideBlack) {
            return !this.sprites.guide.black.exists
        } else if (this.segmentHeadMemory.segmentKind == kind.GuideBlue) {
            return !this.sprites.guide.blue.exists
        } else if (this.segmentHeadMemory.segmentKind == kind.GuideCyan) {
            return !this.sprites.guide.cyan.exists
        } else if (this.segmentHeadMemory.segmentKind == kind.GuideNeutral) {
            return !this.sprites.guide.neutral.exists
        } else if (this.segmentHeadMemory.segmentKind == kind.GuidePurple) {
            return !this.sprites.guide.purple.exists
        } else if (this.segmentHeadMemory.segmentKind == kind.GuideRed) {
            return !this.sprites.guide.red.exists
        }
    }
    get critical() {
        if (this.segmentHeadMemory.segmentKind > 100) return 0
        switch (this.segmentHeadMemory.segmentKind) {
            case kind.ActiveNormal || kind.ActiveFakeNormal:
                return 10
            default:
                return 0
        }
    }
    updateVisualType() {
        this.visual =
            this.activeHeadMemory.lastActiveTime === time.now
                ? VisualType.Activated
                : time.now >=
                    this.activeHeadMemory.targetTime +
                        archetypes.NormalTapNote.windows.good.max +
                        input.offset
                  ? VisualType.NotActivated
                  : VisualType.Waiting
        debug.log(this.visual)
    }
    renderConnector() {
        if (time.now >= this.tailMemory.targetTime) return
        const headAlpha = Math.remapClamped(
            this.segmentHeadMemory.targetTime,
            this.segmentTailMemory.targetTime,
            this.segmentHeadMemory.segmentAlpha,
            this.segmentTailMemory.segmentAlpha,
            this.headMemory.targetTime,
        )
        const tailAlpha = Math.remapClamped(
            this.segmentHeadMemory.targetTime,
            this.segmentTailMemory.targetTime,
            this.segmentHeadMemory.segmentAlpha,
            this.segmentTailMemory.segmentAlpha,
            this.tailMemory.targetTime,
        )
        let startProgress = 0
        let headProgress = 0
        const tailProgress = progress(
            this.tailMemory.isAttached,
            this.tailMemory.attachHead,
            this.tailMemory.attachTail,
            this.tailMemory.targetTime,
            this.tail.scaledTime,
            this.tailMemory.timeScaleGroup,
        )
        if (time.now >= this.headMemory.targetTime) {
            const headFrac = Math.unlerpClamped(
                this.headMemory.targetTime,
                this.tailMemory.targetTime,
                time.now,
            )
            headProgress = Math.remap(headFrac, 1, 1, tailProgress, 0)
            startProgress = Math.clamp(1, progressStart, progressCutoff)
        } else {
            headProgress = progress(
                this.headMemory.isAttached,
                this.headMemory.attachHead,
                this.headMemory.attachTail,
                this.headMemory.targetTime,
                this.head.scaledTime,
                this.headMemory.timeScaleGroup,
            )
            startProgress = Math.clamp(headProgress, progressStart, progressCutoff)
        }
        const endProgress = Math.clamp(tailProgress, progressStart, progressCutoff)
        const startFrac = Math.unlerpClamped(headProgress, tailProgress, startProgress)
        const endFrac = Math.unlerpClamped(headProgress, tailProgress, endProgress)
        const easedStartFrac = ease(this.headMemory.connectorEase, startFrac)
        const easedEndFrac = ease(this.headMemory.connectorEase, endFrac)
        const startTravel = approach2(startProgress)
        const endTravel = approach2(endProgress)
        const startLane = Math.lerp(this.headMemory.lane, this.tailMemory.lane, easedStartFrac)
        const endLane = Math.lerp(this.headMemory.lane, this.tailMemory.lane, easedEndFrac)
        const startSize = Math.max(
            1e-3,
            Math.lerp(this.headMemory.size, this.tailMemory.size, easedStartFrac),
        )
        const endSize = Math.max(
            1e-3,
            Math.lerp(this.headMemory.size, this.tailMemory.size, easedEndFrac),
        )
        const startAlpha = Math.lerp(headAlpha, tailAlpha, startFrac)
        const endAlpha = Math.lerp(headAlpha, tailAlpha, endFrac)
        let posOffset = 0
        for (const [sl, el, hl, tl] of [
            [
                startLane - startSize,
                endLane - endSize,
                this.headMemory.lane - this.headMemory.size,
                this.tailMemory.lane - this.tailMemory.size,
            ],
            [
                startLane + startSize,
                endLane + endSize,
                this.headMemory.lane + this.headMemory.size,
                this.tailMemory.lane + this.tailMemory.size,
            ],
        ]) {
            const startRef = new Vec({
                x: sl * startTravel * scaledScreen.w,
                y: startTravel * scaledScreen.h + scaledScreen.t2,
            })
            const endRef = new Vec({
                x: el * endTravel * scaledScreen.w,
                y: endTravel * scaledScreen.h + scaledScreen.t2,
            })
            let posOffsetThisSide = 0
            for (const r of [0.25, 0.5, 0.75]) {
                const frac = Math.lerp(startFrac, endFrac, r)
                const progress = Math.lerp(startProgress, endProgress, r)
                const travel = approach2(progress)
                const lane = Math.lerp(hl, tl, ease(this.headMemory.connectorEase, frac))
                const pos = new Vec({
                    x: lane * travel * scaledScreen.w,
                    y: travel * scaledScreen.h + scaledScreen.t2,
                })
                const refPos = new Vec(
                    Math.lerp(
                        startRef.x,
                        endRef.x,
                        Math.unlerpClamped(startTravel, endTravel, travel),
                    ),
                    Math.lerp(
                        startRef.y,
                        endRef.y,
                        Math.unlerpClamped(startTravel, endTravel, travel),
                    ),
                )
                posOffsetThisSide += Math.abs(pos.x - refPos.x)
            }
            posOffset = Math.max(posOffset, posOffsetThisSide)
        }
        const startPosY = new Vec({
            x: startLane * startTravel * scaledScreen.w,
            y: startTravel * scaledScreen.h + scaledScreen.t2,
        }).y
        const endPosY = new Vec({
            x: endLane * endTravel * scaledScreen.w,
            y: endTravel * scaledScreen.h + scaledScreen.t2,
        }).y
        const curveChangeScale = posOffset ** 0.4 * 1.6
        const alphaChangeScale = Math.max(
            Math.abs(startAlpha - endAlpha) ** 0.8 * 3,
            Math.abs(startAlpha - endAlpha) ** 0.5 * Math.abs(startPosY - endPosY) * 3,
        )
        const segmentCount = Math.max(
            1,
            Math.ceil(Math.max(curveChangeScale, alphaChangeScale) * 1 * 10),
        )
        let lastTravel = startTravel
        let lastLane = startLane
        let lastSize = startSize
        let lastAlpha = startAlpha
        let lastTargetTime = Math.lerp(
            this.headMemory.targetTime,
            this.tailMemory.targetTime,
            startFrac,
        )
        for (let i = 1; i <= segmentCount; i++) {
            const nextFrac = Math.lerp(startFrac, endFrac, i / segmentCount)
            const nextProgress = Math.lerp(startProgress, endProgress, i / segmentCount)
            let nextTravel = approach2(nextProgress)
            let nextLane = Math.lerp(
                this.headMemory.lane,
                this.tailMemory.lane,
                ease(this.headMemory.connectorEase, nextFrac),
            )
            let nextSize = Math.max(
                1e-3,
                Math.lerp(
                    this.headMemory.size,
                    this.tailMemory.size,
                    ease(this.headMemory.connectorEase, nextFrac),
                ),
            )
            const nextAlpha = Math.lerp(headAlpha, tailAlpha, nextFrac)
            const nextTargetTime = Math.lerp(
                this.headMemory.targetTime,
                this.tailMemory.targetTime,
                nextFrac,
            )
            let alpha = 0
            if (this.segmentHeadMemory.segmentKind > 100) alpha = options.guideAlpha
            else alpha = options.connectorAlpha
            const a = ((lastAlpha + nextAlpha) / 2) * alpha
            if (lastTravel < nextTravel) {
                ;[lastLane, nextLane] = [nextLane, lastLane]
                ;[lastSize, nextSize] = [nextSize, lastSize]
                ;[lastTravel, nextTravel] = [nextTravel, lastTravel]
            }
            const layout = QuadLayout({
                bl: new Vec(lastLane - lastSize, 1).mul(lastTravel),
                br: new Vec(lastLane + lastSize, 1).mul(lastTravel),
                tl: new Vec(nextLane - nextSize, 1).mul(nextTravel),
                tr: new Vec(nextLane + nextSize, 1).mul(nextTravel),
            })
            lastTravel = nextTravel
            lastLane = nextLane
            lastSize = nextSize
            lastAlpha = nextAlpha
            lastTargetTime = nextTargetTime
            if (this.useFallbackSprite()) {
                this.sprites.normal.fallback.draw(layout, this.z, a)
                return
            }
            this.drawConnector(layout, a)
        }
    }
    getAttachedParams(targetTime) {
        return getAttached(
            this.headMemory.connectorEase,
            this.headMemory.lane,
            this.headMemory.size,
            this.headMemory.targetTime,
            this.tailMemory.lane,
            this.tailMemory.size,
            this.tailMemory.targetTime,
            targetTime,
        )
    }
    getScale(scaledTime) {
        if (time.now > this.activeHeadMemory.targetTime)
            return this.ease(
                Math.unlerpClamped(this.head.scaledTime, this.tail.scaledTime, scaledTime),
            )
        else
            return this.ease(
                Math.unlerpClamped(this.headMemory.targetTime, this.tail.scaledTime, scaledTime),
            )
    }
    ease(s) {
        return ease(this.headMemory.connectorEase, s)
    }
    drawConnector(layout, a) {
        const normalA =
            (Math.cos((time.now - this.segmentHeadMemory.targetTime) * 2 * Math.PI) + 1) / 2
        if (options.connectorAnimation && this.segmentHeadMemory.segmentKind < 100) {
            if (this.visual === VisualType.NotActivated) a *= 0.5
            if (
                this.segmentHeadMemory.segmentKind == kind.ActiveNormal ||
                this.segmentHeadMemory.segmentKind == kind.ActiveFakeNormal
            ) {
                this.sprites.normal.normal.draw(
                    layout,
                    this.z,
                    a * Math.ease('Out', 'Quad', normalA),
                )
                this.sprites.normal.active.draw(layout, this.z, a * 0.9 * (1 - normalA))
            } else if (
                this.segmentHeadMemory.segmentKind == kind.ActiveCritical ||
                this.segmentHeadMemory.segmentKind == kind.ActiveFakeCritical
            ) {
                this.sprites.critical.normal.draw(
                    layout,
                    this.z,
                    a * Math.ease('Out', 'Quad', normalA),
                )
                this.sprites.critical.active.draw(layout, this.z, a * 0.9 * (1 - normalA))
            }
        } else if (this.segmentHeadMemory.segmentKind == kind.GuideGreen) {
            this.sprites.guide.green.draw(layout, this.z, a)
        } else if (this.segmentHeadMemory.segmentKind == kind.GuideYellow) {
            this.sprites.guide.yellow.draw(layout, this.z, a)
        } else if (this.segmentHeadMemory.segmentKind == kind.GuideBlack) {
            this.sprites.guide.black.draw(layout, this.z, a)
        } else if (this.segmentHeadMemory.segmentKind == kind.GuideBlue) {
            this.sprites.guide.blue.draw(layout, this.z, a)
        } else if (this.segmentHeadMemory.segmentKind == kind.GuideCyan) {
            this.sprites.guide.cyan.draw(layout, this.z, a)
        } else if (this.segmentHeadMemory.segmentKind == kind.GuideNeutral) {
            this.sprites.guide.neutral.draw(layout, this.z, a)
        } else if (this.segmentHeadMemory.segmentKind == kind.GuidePurple) {
            this.sprites.guide.purple.draw(layout, this.z, a)
        } else if (this.segmentHeadMemory.segmentKind == kind.GuideRed) {
            this.sprites.guide.red.draw(layout, this.z, a)
        }
    }
}
