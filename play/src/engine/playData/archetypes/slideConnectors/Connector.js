import { perspectiveLayout } from '../../../../../../shared/src/engine/data/utils.js'
import { options } from '../../../configuration/options.js'
import { effect } from '../../effect.js'
import { note } from '../../note.js'
import { circularEffectLayout, linearEffectLayout, particle } from '../../particle.js'
import { scaledScreen } from '../../scaledScreen.js'
import { getZ, layer, skin } from '../../skin.js'
import { archetypes } from '../index.js'
import { Guide, VisualType, kind } from './Guide.js'
export class Connector extends Guide {
    sfxInstanceId = this.entityMemory(LoopedEffectClipInstanceId)
    glowZ = this.entityMemory(Number)
    slideZ = this.entityMemory(Number)
    diamondZ = this.entityMemory(Number)
    slideSprites = {
        NormalTrace: {
            left: skin.sprites.normalTraceNoteLeft,
            middle: skin.sprites.normalTraceNoteMiddle,
            right: skin.sprites.normalTraceNoteRight,
            diamond: skin.sprites.normalTraceNoteDiamond,
            fallback: skin.sprites.normalTraceNoteFallback,
        },
        CriticalTrace: {
            left: skin.sprites.criticalTraceNoteLeft,
            middle: skin.sprites.criticalTraceNoteMiddle,
            right: skin.sprites.criticalTraceNoteRight,
            diamond: skin.sprites.criticalTraceNoteDiamond,
            fallback: skin.sprites.criticalTraceNoteFallback,
        },
        NormalTap: {
            left: skin.sprites.slideNoteLeft,
            middle: skin.sprites.slideNoteMiddle,
            right: skin.sprites.slideNoteRight,
            fallback: skin.sprites.slideNoteFallback,
        },
        CriticalTap: {
            left: skin.sprites.criticalNoteLeft,
            middle: skin.sprites.criticalNoteMiddle,
            right: skin.sprites.criticalNoteRight,
            fallback: skin.sprites.criticalNoteFallback,
        },
    }
    clips = {
        normal: {
            hold: effect.clips.normalHold,
            fallback: effect.clips.normalHold,
        },
        critical: {
            hold: effect.clips.criticalHold,
            fallback: effect.clips.normalHold,
        },
    }
    slideGlowSprite = {
        normal: {
            glow: skin.sprites.normalSlideConnectorSlotGlow,
            fallback: skin.sprites.slideSlotGlow,
        },
        critical: {
            glow: skin.sprites.criticalSlideConnectorSlotGlow,
            fallback: skin.sprites.criticalSlotGlow,
        },
    }
    effects = {
        normal: {
            circular: particle.effects.normalSlideConnectorCircular,
            linear: particle.effects.normalSlideConnectorLinear,
            noneMoveLinear: particle.effects.normalSlideConnectorNoneMoveLinear,
            slotEffects: particle.effects.slotEffectNormalSlideConnector,
        },
        critical: {
            circular: particle.effects.criticalSlideConnectorCircular,
            linear: particle.effects.criticalSlideConnectorLinear,
            noneMoveLinear: particle.effects.criticalSlideConnectorNoneMoveLinear,
            slotEffects: particle.effects.slotEffectCriticalSlideConnector,
        },
    }
    preprocess() {
        super.preprocess()
        if (this.segmentHeadMemory.segmentKind >= 100) return
        if (this.shouldScheduleSFX) this.scheduleSFX()
    }
    initialize() {
        super.initialize()
        if (this.segmentHeadMemory.segmentKind >= 100) return
        this.glowZ = getZ(
            layer.slotGlowEffect,
            -this.activeHeadMemory.targetTime,
            this.activeHeadMemory.lane,
            0,
        )
        this.slideZ = getZ(
            layer.note.body,
            -this.activeHeadMemory.targetTime,
            this.activeHeadMemory.lane,
            0,
        )
        this.diamondZ = getZ(
            layer.note.tick,
            -this.activeHeadMemory.targetTime,
            this.activeHeadMemory.lane,
            0,
        )
    }
    updateParallel() {
        super.updateParallel()
        if (this.import.activeHeadRef <= 0) return
        if (time.now < this.headMemory.targetTime) return
        if (this.visual == VisualType.Activated) {
            debug.log(this.visual)
            if (this.shouldPlaySFX && !this.sfxInstanceId) this.playSFX()
            if (this.shouldPlayCircularEffect && this.activeHeadMemory.circular)
                this.updateCircularEffect()
            if (this.shouldPlayLinearEffect && this.activeHeadMemory.linear)
                this.updateLinearEffect()
        } else {
            if (this.shouldPlaySFX && this.sfxInstanceId) this.stopSFX()
            if (this.shouldPlayCircularEffect && this.activeHeadMemory.circular)
                this.destroyCircularEffect()
            if (this.shouldPlayLinearEffect && this.activeHeadMemory.linear)
                this.destroyLinearEffect()
        }
        this.renderGlow()
        this.renderSlide()
    }
    updateSequential() {
        super.updateSequential()
        if (this.import.activeHeadRef <= 0) return
        if (time.now < this.headMemory.targetTime) return
        if (this.visual === VisualType.Activated) {
            if (this.shouldPlayCircularEffect && !this.activeHeadMemory.circular)
                this.spawnCircularEffect()
            if (this.shouldPlayLinearEffect && !this.activeHeadMemory.linear)
                this.spawnLinearEffect()
            if (
                this.shouldPlayNoneMoveLinearEffect &&
                time.now >= this.activeHeadMemory.noneMoveLinear
            )
                this.spawnNoneMoveLinearEffect()
            if (this.shouldPlaySlotEffects && time.now >= this.activeHeadMemory.slotEffects)
                this.spawnSlotEffects()
        }
        let visualLane = 0
        let visualSize = 0
        ;({ lane: visualLane, size: visualSize } = this.getAttachedParams(time.now))
        this.activeHeadMemory.activeConnectorInfo.visualLane = visualLane
        this.activeHeadMemory.activeConnectorInfo.visualSize = visualSize
        this.activeHeadMemory.activeConnectorInfo.kind = this.segmentHeadMemory.segmentKind
    }
    terminate() {
        if (this.import.activeHeadRef <= 0) return
        if (this.shouldPlaySFX && this.sfxInstanceId) this.stopSFX()
        if (this.import.activeTailRef == this.import.tailRef) {
            if (this.shouldPlayCircularEffect && this.activeHeadMemory.circular)
                this.destroyCircularEffect()
            if (this.shouldPlayLinearEffect && this.activeHeadMemory.linear)
                this.destroyLinearEffect()
        }
    }
    get shouldScheduleSFX() {
        if (
            this.segmentHeadMemory.segmentKind == kind.ActiveNormal ||
            this.segmentHeadMemory.segmentKind == kind.ActiveFakeNormal
        )
            return (
                options.sfxEnabled &&
                (this.useFallbackClip
                    ? this.clips.normal.fallback.exists
                    : this.clips.normal.hold.exists) &&
                options.autoSFX
            )
        else
            return (
                options.sfxEnabled &&
                (this.useFallbackClip
                    ? this.clips.critical.fallback.exists
                    : this.clips.critical.hold.exists) &&
                options.autoSFX
            )
    }
    get shouldPlaySFX() {
        if (
            this.segmentHeadMemory.segmentKind == kind.ActiveNormal ||
            this.segmentHeadMemory.segmentKind == kind.ActiveFakeNormal
        )
            return (
                options.sfxEnabled &&
                (this.useFallbackClip
                    ? this.clips.normal.fallback.exists
                    : this.clips.normal.hold.exists) &&
                !options.autoSFX
            )
        else
            return (
                options.sfxEnabled &&
                (this.useFallbackClip
                    ? this.clips.critical.fallback.exists
                    : this.clips.critical.hold.exists) &&
                !options.autoSFX
            )
    }
    get shouldPlayCircularEffect() {
        if (
            this.segmentHeadMemory.segmentKind == kind.ActiveNormal ||
            this.segmentHeadMemory.segmentKind == kind.ActiveFakeNormal
        )
            return options.noteEffectEnabled && this.effects.normal.circular.exists
        else return options.noteEffectEnabled && this.effects.critical.circular.exists
    }
    get shouldPlayLinearEffect() {
        if (
            this.segmentHeadMemory.segmentKind == kind.ActiveNormal ||
            this.segmentHeadMemory.segmentKind == kind.ActiveFakeNormal
        )
            return options.noteEffectEnabled && this.effects.normal.linear.exists
        else return options.noteEffectEnabled && this.effects.critical.linear.exists
    }
    get shouldPlayNoneMoveLinearEffect() {
        if (
            this.segmentHeadMemory.segmentKind == kind.ActiveNormal ||
            this.segmentHeadMemory.segmentKind == kind.ActiveFakeNormal
        )
            return options.noteEffectEnabled && this.effects.normal.noneMoveLinear.exists
        else return options.noteEffectEnabled && this.effects.critical.noneMoveLinear.exists
    }
    get shouldPlaySlotEffects() {
        if (
            this.segmentHeadMemory.segmentKind == kind.ActiveNormal ||
            this.segmentHeadMemory.segmentKind == kind.ActiveFakeNormal
        )
            return options.slotEffectEnabled && this.effects.normal.slotEffects.exists
        else return options.slotEffectEnabled && this.effects.critical.slotEffects.exists
    }
    get useFallbackSlideSprite() {
        if (
            entityInfos.get(this.import.segmentHeadRef).archetype ==
            archetypes.NormalHeadTapNote.index
        )
            return (
                !this.slideSprites.NormalTap.left.exists ||
                !this.slideSprites.NormalTap.middle.exists ||
                !this.slideSprites.NormalTap.right.exists
            )
        else if (
            entityInfos.get(this.import.segmentHeadRef).archetype ==
            archetypes.CriticalHeadTapNote.index
        )
            return (
                !this.slideSprites.CriticalTap.left.exists ||
                !this.slideSprites.CriticalTap.middle.exists ||
                !this.slideSprites.CriticalTap.right.exists
            )
        else if (
            entityInfos.get(this.import.segmentHeadRef).archetype ==
            archetypes.NormalHeadTraceNote.index
        )
            return (
                !this.slideSprites.NormalTrace.left.exists ||
                !this.slideSprites.NormalTrace.middle.exists ||
                !this.slideSprites.NormalTrace.right.exists
            )
        else
            return (
                !this.slideSprites.CriticalTrace.left.exists ||
                !this.slideSprites.CriticalTrace.middle.exists ||
                !this.slideSprites.CriticalTrace.right.exists
            )
    }
    get useFallbackGlowSprite() {
        if (this.segmentHeadMemory.segmentKind == kind.ActiveNormal)
            return !this.slideGlowSprite.normal.glow.exists
        else return !this.slideGlowSprite.critical.glow.exists
    }
    get useFallbackClip() {
        if (
            this.segmentHeadMemory.segmentKind == kind.ActiveNormal ||
            this.segmentHeadMemory.segmentKind == kind.ActiveFakeNormal
        )
            return !this.clips.normal.hold.exists
        else return !this.clips.critical.hold.exists
    }
    scheduleSFX() {
        const id =
            this.segmentHeadMemory.segmentKind == kind.ActiveNormal ||
            this.segmentHeadMemory.segmentKind == kind.ActiveFakeNormal
                ? this.useFallbackClip
                    ? this.clips.normal.fallback.scheduleLoop(this.headMemory.targetTime)
                    : this.clips.normal.hold.scheduleLoop(this.headMemory.targetTime)
                : this.useFallbackClip
                  ? this.clips.critical.fallback.scheduleLoop(this.headMemory.targetTime)
                  : this.clips.critical.hold.scheduleLoop(this.headMemory.targetTime)
        effect.clips.scheduleStopLoop(id, this.tailMemory.targetTime)
    }
    playSFX() {
        this.sfxInstanceId =
            this.segmentHeadMemory.segmentKind == kind.ActiveNormal ||
            this.segmentHeadMemory.segmentKind == kind.ActiveFakeNormal
                ? this.useFallbackClip
                    ? this.clips.normal.fallback.loop()
                    : this.clips.normal.hold.loop()
                : this.useFallbackClip
                  ? this.clips.critical.fallback.loop()
                  : this.clips.critical.hold.loop()
    }
    stopSFX() {
        effect.clips.stopLoop(this.sfxInstanceId)
        this.sfxInstanceId = 0
    }
    spawnCircularEffect() {
        const segmentKind = this.segmentHeadMemory.segmentKind
        switch (segmentKind) {
            case kind.ActiveNormal || kind.ActiveFakeNormal:
                this.activeHeadMemory.circular = this.effects.normal.circular.spawn(
                    new Quad(),
                    1,
                    true,
                )
                break
            case kind.ActiveCritical || kind.ActiveFakeCritical:
                this.activeHeadMemory.circular = this.effects.critical.circular.spawn(
                    new Quad(),
                    1,
                    true,
                )
                break
        }
    }
    updateCircularEffect() {
        const lane = this.activeHeadMemory.activeConnectorInfo.visualLane
        particle.effects.move(
            this.activeHeadMemory.circular,
            circularEffectLayout({
                lane,
                w: 3.5,
                h: 2.1,
            }),
        )
    }
    destroyCircularEffect() {
        particle.effects.destroy(this.activeHeadMemory.circular)
        archetypes.SlideParticleManager.spawn({
            activeHeadRef: this.import.activeHeadRef,
            function: 0,
        })
    }
    spawnLinearEffect() {
        const segmentKind = this.segmentHeadMemory.segmentKind
        switch (segmentKind) {
            case kind.ActiveNormal:
                this.activeHeadMemory.linear = this.effects.normal.linear.spawn(new Quad(), 1, true)
                break
            case kind.ActiveFakeNormal:
                this.activeHeadMemory.linear = this.effects.normal.linear.spawn(new Quad(), 1, true)
                break
            case kind.ActiveCritical:
                this.activeHeadMemory.linear = this.effects.critical.linear.spawn(
                    new Quad(),
                    1,
                    true,
                )
                break
            case kind.ActiveFakeCritical:
                this.activeHeadMemory.linear = this.effects.critical.linear.spawn(
                    new Quad(),
                    1,
                    true,
                )
                break
        }
    }
    spawnNoneMoveLinearEffect() {
        const lane = this.activeHeadMemory.activeConnectorInfo.visualLane
        const segmentKind = this.segmentHeadMemory.segmentKind
        switch (segmentKind) {
            case kind.ActiveNormal:
                this.effects.normal.noneMoveLinear.spawn(
                    linearEffectLayout({
                        lane,
                        shear: 0,
                    }),
                    0.5,
                    false,
                )
                break
            case kind.ActiveFakeNormal:
                this.effects.normal.noneMoveLinear.spawn(
                    linearEffectLayout({
                        lane,
                        shear: 0,
                    }),
                    0.5,
                    false,
                )
                break
            case kind.ActiveCritical:
                this.effects.critical.noneMoveLinear.spawn(
                    linearEffectLayout({
                        lane,
                        shear: 0,
                    }),
                    0.5,
                    false,
                )
                break
            case kind.ActiveFakeCritical:
                this.effects.critical.noneMoveLinear.spawn(
                    linearEffectLayout({
                        lane,
                        shear: 0,
                    }),
                    0.5,
                    false,
                )
                break
        }
        this.activeHeadMemory.noneMoveLinear = time.now + 0.1
    }
    spawnSlotEffects() {
        const lane = this.activeHeadMemory.activeConnectorInfo.visualLane
        const l = lane - this.activeHeadMemory.activeConnectorInfo.visualSize
        const r = lane + this.activeHeadMemory.activeConnectorInfo.visualSize
        for (let i = l + 0.5; i < r - 0.5; i++) {
            const segmentKind = this.segmentHeadMemory.segmentKind
            switch (segmentKind) {
                case kind.ActiveNormal:
                    this.effects.normal.slotEffects.spawn(
                        linearEffectLayout({
                            lane: i,
                            shear: 0,
                        }),
                        0.5,
                        false,
                    )
                    break
                case kind.ActiveFakeNormal:
                    this.effects.normal.slotEffects.spawn(
                        linearEffectLayout({
                            lane: i,
                            shear: 0,
                        }),
                        0.5,
                        false,
                    )
                    break
                case kind.ActiveCritical:
                    this.effects.critical.slotEffects.spawn(
                        linearEffectLayout({
                            lane: i,
                            shear: 0,
                        }),
                        0.5,
                        false,
                    )
                    break
                case kind.ActiveFakeCritical:
                    this.effects.critical.slotEffects.spawn(
                        linearEffectLayout({
                            lane: i,
                            shear: 0,
                        }),
                        0.5,
                        false,
                    )
                    break
            }
        }
        this.activeHeadMemory.slotEffects = time.now + 0.2
    }
    updateLinearEffect() {
        const lane = this.activeHeadMemory.activeConnectorInfo.visualLane
        particle.effects.move(
            this.activeHeadMemory.linear,
            linearEffectLayout({
                lane,
                shear: 0,
            }),
        )
    }
    destroyLinearEffect() {
        particle.effects.destroy(this.activeHeadMemory.linear)
        archetypes.SlideParticleManager.spawn({
            activeHeadRef: this.import.activeHeadRef,
            function: 1,
        })
    }
    renderGlow() {
        if (!options.slotEffectEnabled) return
        if (this.visual !== VisualType.Activated) return
        const lane = this.activeHeadMemory.activeConnectorInfo.visualLane
        const l = lane - this.activeHeadMemory.activeConnectorInfo.visualSize
        const r = lane + this.activeHeadMemory.activeConnectorInfo.visualSize
        const dynamicHeight =
            options.version == 0
                ? 3 +
                  (Math.cos((time.now - this.activeHeadMemory.targetTime) * 8 * Math.PI) + 1) / 2
                : 4 *
                  ((Math.sin((time.now - this.activeHeadMemory.targetTime) * 2.5 * Math.PI) + 1) /
                      2)
        const h = dynamicHeight * options.slotEffectSize * scaledScreen.wToH
        const shear = 1 + 0.25 * (dynamicHeight / 4) * options.slotEffectSize
        const w = options.version == 0 ? 0.035 * Math.abs(l - r) + 0.08 : 0
        const quadLike = {
            x1: l - w,
            x2: l * shear - w,
            x3: r * shear + w,
            x4: r + w,
            y1: 1,
            y2: 1 - h,
            y3: 1 - h,
            y4: 1,
        }
        const kind = this.segmentHeadMemory.segmentKind
        if (this.useFallbackGlowSprite)
            if (kind == 1)
                this.slideGlowSprite.normal.fallback.draw(
                    quadLike,
                    this.glowZ,
                    options.version == 0
                        ? Math.min(1, (time.now - this.activeHeadMemory.targetTime) * 4) *
                              (options.lightweight ? 0.15 : 0.3)
                        : Math.sin((time.now - this.activeHeadMemory.targetTime) * 2.5 * Math.PI) *
                              (options.lightweight ? 0.15 : 0.3),
                )
            else
                this.slideGlowSprite.critical.fallback.draw(
                    quadLike,
                    this.glowZ,
                    options.version == 0
                        ? Math.min(1, (time.now - this.activeHeadMemory.targetTime) * 4) *
                              (options.lightweight ? 0.15 : 0.3)
                        : Math.sin((time.now - this.activeHeadMemory.targetTime) * 2.5 * Math.PI) *
                              (options.lightweight ? 0.15 : 0.3),
                )
        else if (kind == 1)
            this.slideGlowSprite.normal.glow.draw(
                quadLike,
                this.glowZ,
                options.version == 0
                    ? Math.min(1, (time.now - this.activeHeadMemory.targetTime) * 4) *
                          (options.lightweight ? 0.15 : 0.3)
                    : Math.sin((time.now - this.activeHeadMemory.targetTime) * 2.5 * Math.PI) *
                          (options.lightweight ? 0.15 : 0.3),
            )
        else
            this.slideGlowSprite.critical.glow.draw(
                quadLike,
                this.glowZ,
                options.version == 0
                    ? Math.min(1, (time.now - this.activeHeadMemory.targetTime) * 4) *
                          (options.lightweight ? 0.15 : 0.3)
                    : Math.sin((time.now - this.activeHeadMemory.targetTime) * 2.5 * Math.PI) *
                          (options.lightweight ? 0.15 : 0.3),
            )
    }
    renderSlide() {
        const lane = this.activeHeadMemory.activeConnectorInfo.visualLane
        const l = lane - this.activeHeadMemory.activeConnectorInfo.visualSize
        const r = lane + this.activeHeadMemory.activeConnectorInfo.visualSize
        const b = 1 + note.h
        const t = 1 - note.h
        if (this.useFallbackSlideSprite) {
            if (
                entityInfos.get(this.import.segmentHeadRef).archetype ==
                archetypes.NormalHeadTapNote.index
            )
                this.slideSprites.NormalTap.fallback.draw(
                    perspectiveLayout({ l, r, b, t }),
                    this.slideZ,
                    1,
                )
            else
                this.slideSprites.CriticalTap.fallback.draw(
                    perspectiveLayout({ l, r, b, t }),
                    this.slideZ,
                    1,
                )
        } else {
            const ml = l + 0.25
            const mr = r - 0.25
            const w = note.h / scaledScreen.wToH
            const headArchetype = entityInfos.get(this.import.segmentHeadRef).archetype
            if (headArchetype === archetypes.NormalHeadTapNote.index)
                this.drawingSlide(this.slideSprites.NormalTap, l, r, b, t, ml, mr, lane, w)
            else if (headArchetype === archetypes.CriticalHeadTapNote.index)
                this.drawingSlide(this.slideSprites.CriticalTap, l, r, b, t, ml, mr, lane, w)
            else if (headArchetype === archetypes.NormalHeadTraceNote.index)
                this.drawingSlide(this.slideSprites.NormalTrace, l, r, b, t, ml, mr, lane, w)
            else if (headArchetype === archetypes.CriticalHeadTraceNote.index)
                this.drawingSlide(this.slideSprites.CriticalTrace, l, r, b, t, ml, mr, lane, w)
        }
    }
    drawingSlide(slide, l, r, b, t, ml, mr, lane, w) {
        slide.left.draw(perspectiveLayout({ l, r: ml, b, t }), this.slideZ, 1)
        slide.middle.draw(perspectiveLayout({ l: ml, r: mr, b, t }), this.slideZ, 1)
        slide.right.draw(perspectiveLayout({ l: mr, r, b, t }), this.slideZ, 1)
        if ('diamond' in slide) {
            slide.diamond.draw(
                new Rect({
                    l: lane - w,
                    r: lane + w,
                    b: 1 + note.h,
                    t: 1 - note.h,
                }),
                this.diamondZ,
                1,
            )
        }
    }
}
