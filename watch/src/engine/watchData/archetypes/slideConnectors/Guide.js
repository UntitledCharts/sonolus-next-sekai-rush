import { ease } from '../../../../../../shared/src/engine/data/EaseType.js'
import {
    approach,
    approach2,
    progressCutoff,
    progressStart,
} from '../../../../../../shared/src/engine/data/note.js'
import { options } from '../../../configuration/options.js'
import { note } from '../../note.js'
import { getZ, layer } from '../../skin.js'
import { archetypes } from '../index.js'
import { skin } from '../../skin.js'
import { progress } from '../utils.js'
import { scaledScreen } from '../../scaledScreen.js'
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
    import = this.defineImport({
        activeHeadRef: { name: 'activeHead', type: Number },
        activeTailRef: { name: 'activeTail', type: Number },
        headRef: { name: 'head', type: Number },
        tailRef: { name: 'tail', type: Number },
        segmentHeadRef: { name: 'segmentHead', type: Number },
        segmentTailRef: { name: 'segmentTail', type: Number },
    })
    initialized = this.entityMemory(Boolean)
    activeHead = this.entityMemory({
        time: Number,
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
    visualSpawnTime = this.entityMemory(Number)
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
        this.visualSpawnTime = Math.min(
            this.visualTime.start,
            this.headMemory.spawnTime,
            this.tailMemory.spawnTime,
        )
        this.endTime = this.visualTime.end
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
    get activeHeadImport() {
        return archetypes.NormalHeadTapNote.import.get(this.import.activeHeadRef)
    }
    get activeTailImport() {
        return archetypes.NormalHeadTapNote.import.get(this.import.activeTailRef)
    }
    get segmentHeadImport() {
        return archetypes.NormalHeadTapNote.import.get(this.import.segmentHeadRef)
    }
    get segmentTailImport() {
        return archetypes.NormalHeadTapNote.import.get(this.import.segmentTailRef)
    }
    get headImport() {
        return archetypes.NormalHeadTapNote.import.get(this.import.headRef)
    }
    get tailImport() {
        return archetypes.NormalHeadTapNote.import.get(this.import.tailRef)
    }
    spawnTime() {
        return this.visualSpawnTime
    }
    despawnTime() {
        return this.endTime
    }
    initialize() {
        if (this.initialized) return
        this.initialized = true
        this.globalInitialize()
    }
    updateParallel() {
        if (this.segmentHeadImport.segmentKind < 100) this.updateVisualType()
        this.renderConnector()
    }
    get useFallbackSprite() {
        if (
            this.segmentHeadImport.segmentKind == kind.ActiveNormal ||
            this.segmentHeadImport.segmentKind == kind.ActiveFakeNormal
        )
            return !this.sprites.normal.normal.exists || !this.sprites.normal.active.exists
        else if (
            this.segmentHeadImport.segmentKind == kind.ActiveCritical ||
            this.segmentHeadImport.segmentKind == kind.ActiveFakeCritical
        )
            return !this.sprites.critical.normal.exists || !this.sprites.critical.active.exists
        else if (this.segmentHeadImport.segmentKind == kind.GuideGreen)
            return !this.sprites.guide.green.exists
        else if (this.segmentHeadImport.segmentKind == kind.GuideYellow)
            return !this.sprites.guide.yellow.exists
        else if (this.segmentHeadImport.segmentKind == kind.GuideBlack) {
            return !this.sprites.guide.black.exists
        } else if (this.segmentHeadImport.segmentKind == kind.GuideBlue) {
            return !this.sprites.guide.blue.exists
        } else if (this.segmentHeadImport.segmentKind == kind.GuideCyan) {
            return !this.sprites.guide.cyan.exists
        } else if (this.segmentHeadImport.segmentKind == kind.GuideNeutral) {
            return !this.sprites.guide.neutral.exists
        } else if (this.segmentHeadImport.segmentKind == kind.GuidePurple) {
            return !this.sprites.guide.purple.exists
        } else return !this.sprites.guide.red.exists
    }
    globalInitialize() {
        this.activeHead.time = this.activeHeadMemory.targetTime
        if (this.segmentHeadImport.segmentKind == 0) this.z = 0
        else if (this.segmentHeadImport.segmentKind < 100)
            this.z = getZ(
                layer.note.connector,
                -this.segmentHeadMemory.targetTime,
                this.segmentHeadImport.lane,
                this.critical,
            )
        else
            this.z = getZ(
                layer.note.guide,
                -this.segmentHeadMemory.targetTime,
                this.segmentHeadImport.lane,
                this.segmentHeadImport.segmentKind - kind.GuideNeutral,
            )
    }
    get critical() {
        if (this.segmentHeadImport.segmentKind > 100) return 0
        switch (this.segmentHeadImport.segmentKind) {
            case kind.ActiveNormal || kind.ActiveFakeNormal:
                return 10
            default:
                return 0
        }
    }
    updateVisualType() {
        if (!replay.isReplay) {
            this.visual =
                time.now >= this.activeHead.time ? VisualType.Activated : VisualType.Waiting
            return
        }
        const startTime = streams.getPreviousKey(this.import.activeHeadRef, time.now)
        if (startTime < time.now) {
            const endTime = streams.getValue(this.import.activeHeadRef, startTime)
            if (time.now < endTime) {
                this.visual = VisualType.Activated
                return
            }
        }
        this.visual =
            time.now >= this.activeHead.time + this.activeHeadMemory.windows + input.offset
                ? VisualType.NotActivated
                : VisualType.Waiting
    }
    renderConnector() {
        if (time.now >= this.tailMemory.targetTime + time.delta) return
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
            this.tailImport.isAttached,
            this.tailImport.attachHead,
            this.tailImport.attachTail,
            this.tailMemory.targetTime,
            this.tail.scaledTime,
            this.tailImport.timeScaleGroup,
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
                this.headImport.isAttached,
                this.headImport.attachHead,
                this.headImport.attachTail,
                this.headMemory.targetTime,
                this.head.scaledTime,
                this.headImport.timeScaleGroup,
            )
            startProgress = Math.clamp(headProgress, progressStart, progressCutoff)
        }
        const endProgress = Math.clamp(tailProgress, progressStart, progressCutoff)
        const startFrac = Math.unlerpClamped(headProgress, tailProgress, startProgress)
        const endFrac = Math.unlerpClamped(headProgress, tailProgress, endProgress)
        const easedStartFrac = ease(this.headImport.connectorEase, startFrac)
        const easedEndFrac = ease(this.headImport.connectorEase, endFrac)
        const startTravel = approach2(startProgress)
        const endTravel = approach2(endProgress)
        const startLane = Math.lerp(this.headImport.lane, this.tailImport.lane, easedStartFrac)
        const endLane = Math.lerp(this.headImport.lane, this.tailImport.lane, easedEndFrac)
        const startSize = Math.max(
            1e-3,
            Math.lerp(this.headImport.size, this.tailImport.size, easedStartFrac),
        )
        const endSize = Math.max(
            1e-3,
            Math.lerp(this.headImport.size, this.tailImport.size, easedEndFrac),
        )
        const startAlpha = Math.lerp(headAlpha, tailAlpha, startFrac)
        const endAlpha = Math.lerp(headAlpha, tailAlpha, endFrac)
        let posOffset = 0
        for (const [sl, el, hl, tl] of [
            [
                startLane - startSize,
                endLane - endSize,
                this.headImport.lane - this.headImport.size,
                this.tailImport.lane - this.tailImport.size,
            ],
            [
                startLane + startSize,
                endLane + endSize,
                this.headImport.lane + this.headImport.size,
                this.tailImport.lane + this.tailImport.size,
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
                const lane = Math.lerp(hl, tl, ease(this.headImport.connectorEase, frac))
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
                this.headImport.lane,
                this.tailImport.lane,
                ease(this.headImport.connectorEase, nextFrac),
            )
            let nextSize = Math.max(
                1e-3,
                Math.lerp(
                    this.headImport.size,
                    this.tailImport.size,
                    ease(this.headImport.connectorEase, nextFrac),
                ),
            )
            const nextAlpha = Math.lerp(headAlpha, tailAlpha, nextFrac)
            const nextTargetTime = Math.lerp(
                this.headMemory.targetTime,
                this.tailMemory.targetTime,
                nextFrac,
            )
            let alpha = 0
            if (this.segmentHeadImport.segmentKind > 100) alpha = options.guideAlpha
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
            if (this.useFallbackSprite) {
                this.sprites.normal.fallback.draw(layout, this.z, a)
                return
            }
            this.drawConnector(layout, a)
        }
    }
    getAttachedParams(targetTime) {
        return getAttached(
            this.headImport.connectorEase,
            this.headImport.lane,
            this.headImport.size,
            this.headMemory.targetTime,
            this.tailImport.lane,
            this.tailImport.size,
            this.tailMemory.targetTime,
            targetTime,
        )
    }
    drawConnector(layout, a) {
        const normalA =
            (Math.cos((time.now - this.segmentHeadMemory.targetTime) * 2 * Math.PI) + 1) / 2
        if (options.connectorAnimation && this.segmentHeadImport.segmentKind < 100) {
            if (this.visual === VisualType.NotActivated) a *= 0.5
            if (
                this.segmentHeadImport.segmentKind == kind.ActiveNormal ||
                this.segmentHeadImport.segmentKind == kind.ActiveFakeNormal
            ) {
                this.sprites.normal.normal.draw(
                    layout,
                    this.z,
                    a * Math.ease('Out', 'Quad', normalA),
                )
                this.sprites.normal.active.draw(layout, this.z, a * 0.9 * (1 - normalA))
            } else if (
                this.segmentHeadImport.segmentKind == kind.ActiveCritical ||
                this.segmentHeadImport.segmentKind == kind.ActiveFakeCritical
            ) {
                this.sprites.critical.normal.draw(
                    layout,
                    this.z,
                    a * Math.ease('Out', 'Quad', normalA),
                )
                this.sprites.critical.active.draw(layout, this.z, a * 0.9 * (1 - normalA))
            }
        } else if (this.segmentHeadImport.segmentKind == kind.GuideGreen) {
            this.sprites.guide.green.draw(layout, this.z, a)
        } else if (this.segmentHeadImport.segmentKind == kind.GuideYellow) {
            this.sprites.guide.yellow.draw(layout, this.z, a)
        } else if (this.segmentHeadImport.segmentKind == kind.GuideBlack) {
            this.sprites.guide.black.draw(layout, this.z, a)
        } else if (this.segmentHeadImport.segmentKind == kind.GuideBlue) {
            this.sprites.guide.blue.draw(layout, this.z, a)
        } else if (this.segmentHeadImport.segmentKind == kind.GuideCyan) {
            this.sprites.guide.cyan.draw(layout, this.z, a)
        } else if (this.segmentHeadImport.segmentKind == kind.GuideNeutral) {
            this.sprites.guide.neutral.draw(layout, this.z, a)
        } else if (this.segmentHeadImport.segmentKind == kind.GuidePurple) {
            this.sprites.guide.purple.draw(layout, this.z, a)
        } else this.sprites.guide.red.draw(layout, this.z, a)
    }
    ease(s) {
        return ease(this.headImport.connectorEase, s)
    }
}
