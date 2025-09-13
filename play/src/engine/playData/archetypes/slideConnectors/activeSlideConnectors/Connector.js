import { perspectiveLayout } from '../../../../../../../shared/src/engine/data/utils.js'
import { options } from '../../../../configuration/options.js'
import { effect } from '../../../effect.js'
import { note } from '../../../note.js'
import { circularEffectLayout, linearEffectLayout, particle } from '../../../particle.js'
import { scaledScreen } from '../../../scaledScreen.js'
import { getZ, layer, skin } from '../../../skin.js'
import { archetypes } from '../../index.js'
import { Guide, VisualType } from '../Guide.js'
import { kind } from '../Guide.js'
import { timeToScaledTime } from '../../utils.js'
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
        1: {
            hold: effect.clips.normalHold,
            fallback: effect.clips.normalHold,
        },
        2: {
            hold: effect.clips.criticalHold,
            fallback: effect.clips.normalHold,
        },
    }
    slideGlowSprite = {
        1: {
            glow: skin.sprites.criticalSlideConnectorSlotGlow,
            fallback: skin.sprites.criticalSlotGlow,
        },
        2: {
            glow: skin.sprites.normalSlideConnectorSlotGlow,
            fallback: skin.sprites.slideSlotGlow,
        },
    }
    effects = {
        normal: {
            circular: particle.effects.criticalSlideConnectorCircular,
            linear: particle.effects.criticalSlideConnectorLinear,
            noneMoveLinear: particle.effects.criticalSlideConnectorNoneMoveLinear,
            slotEffects: particle.effects.slotEffectCriticalSlideConnector,
        },
        critical: {
            circular: particle.effects.normalSlideConnectorCircular,
            linear: particle.effects.normalSlideConnectorLinear,
            noneMoveLinear: particle.effects.normalSlideConnectorNoneMoveLinear,
            slotEffects: particle.effects.slotEffectNormalSlideConnector,
        },
    }
    preprocess() {
        super.preprocess()
        if (this.guide) return
        if (this.shouldScheduleSFX) this.scheduleSFX()
    }
    initialize() {
        super.initialize()
        if (this.guide) return
        this.glowZ = getZ(
            layer.connectorSlotGlowEffect,
            -this.activeHead.time,
            -Math.abs(this.activeHead.lane) + this.critical,
        )
        this.slideZ = getZ(
            layer.note.slide,
            -this.activeHead.time,
            -Math.abs(this.activeHead.lane) + this.critical,
        )
        this.diamondZ = getZ(
            layer.note.tick,
            -this.activeHead.time,
            -Math.abs(this.activeHead.lane) + this.critical,
        )
    }
    updateParallel() {
        super.updateParallel()
        if (this.guide) return
        if (time.now < this.head.time) return
        if (this.visual === VisualType.Activated) {
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
        if (this.guide) return
        if (time.now < this.head.time) return
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
    }
    terminate() {
        if (this.guide) return
        if (this.shouldPlaySFX && this.sfxInstanceId) this.stopSFX()
        if (this.import.activeTailRef == this.import.tailRef) {
            if (this.shouldPlayCircularEffect && this.activeHeadMemory.circular)
                this.destroyCircularEffect()
            if (this.shouldPlayLinearEffect && this.activeHeadMemory.linear)
                this.destroyLinearEffect()
        }
    }
    shouldScheduleSFX() {
        const kind = this.segmentHead.segmentKind
        return (
            options.sfxEnabled &&
            (this.useFallbackClip
                ? this.clips[kind].fallback.exists
                : this.clips[kind].hold.exists) &&
            options.autoSFX
        )
    }
    shouldPlaySFX() {
        const kind = this.segmentHead.segmentKind
        return (
            options.sfxEnabled &&
            (this.useFallbackClip
                ? this.clips[kind].fallback.exists
                : this.clips[kind].hold.exists) &&
            !options.autoSFX
        )
    }
    shouldPlayCircularEffect() {
        const effects = this.effects()
        return options.noteEffectEnabled && effects.circular.exists
    }
    shouldPlayLinearEffect() {
        return options.noteEffectEnabled && this.effects().linear.exists
    }
    shouldPlayNoneMoveLinearEffect() {
        return options.noteEffectEnabled && this.effects().noneMoveLinear.exists
    }
    shouldPlaySlotEffects() {
        return options.slotEffectEnabled && this.effects().slotEffects.exists
    }
    useFallbackSlideSprite() {
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
                !this.slideSprites.NormalTap.left.exists ||
                !this.slideSprites.NormalTap.middle.exists ||
                !this.slideSprites.NormalTap.right.exists
            )
    }
    useFallbackGlowSprite() {
        const kind = this.segmentHead.segmentKind
        return !this.slideGlowSprite[kind].glow.exists
    }
    useFallbackClip() {
        const kind = this.segmentHead.segmentKind
        return !this.clips[kind].hold.exists
    }
    scheduleSFX() {
        const kind = this.segmentHead.segmentKind
        const id =
            kind === 1
                ? this.useFallbackClip
                    ? this.clips[1].fallback.scheduleLoop(this.head.time)
                    : this.clips[1].hold.scheduleLoop(this.head.time)
                : this.useFallbackClip
                  ? this.clips[2].fallback.scheduleLoop(this.head.time)
                  : this.clips[2].hold.scheduleLoop(this.head.time)
        effect.clips.scheduleStopLoop(id, this.tail.time)
    }
    playSFX() {
        const kind = this.segmentHead.segmentKind
        this.sfxInstanceId =
            kind === 1
                ? this.useFallbackClip
                    ? this.clips[1].fallback.loop()
                    : this.clips[1].hold.loop()
                : this.useFallbackClip
                  ? this.clips[2].fallback.loop()
                  : this.clips[2].hold.loop()
    }
    stopSFX() {
        effect.clips.stopLoop(this.sfxInstanceId)
        this.sfxInstanceId = 0
    }
    spawnCircularEffect() {
        const segmentKind = this.segmentHead.segmentKind
        let circular = 0
        switch (segmentKind) {
            case kind.ActiveNormal:
                circular = this.effects.normal.circular.spawn(new Quad(), 1, true)
                break
            case kind.ActiveFakeNormal:
                circular = this.effects.normal.circular.spawn(new Quad(), 1, true)
                break
            case kind.ActiveCritical:
                circular = this.effects.critical.circular.spawn(new Quad(), 1, true)
                break
            case kind.ActiveFakeCritical:
                circular = this.effects.critical.circular.spawn(new Quad(), 1, true)
                break
        }
        this.activeHeadMemory.circular = circular
    }
    updateCircularEffect() {
        const scaled = timeToScaledTime(time.now, this.head.timeScaleGroup)
        const s = this.getScale(scaled)
        const lane = this.getLane(s)
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
        const segmentKind = this.segmentHead.segmentKind
        let linear = 0
        switch (segmentKind) {
            case kind.ActiveNormal:
                linear = this.effects.normal.linear.spawn(new Quad(), 1, true)
                break
            case kind.ActiveFakeNormal:
                linear = this.effects.normal.linear.spawn(new Quad(), 1, true)
                break
            case kind.ActiveCritical:
                linear = this.effects.critical.linear.spawn(new Quad(), 1, true)
                break
            case kind.ActiveFakeCritical:
                linear = this.effects.critical.linear.spawn(new Quad(), 1, true)
                break
        }
        this.activeHeadMemory.linear = linear
    }
    spawnNoneMoveLinearEffect() {
        const scaled = timeToScaledTime(time.now, this.head.timeScaleGroup)
        const s = this.getScale(scaled)
        const lane = this.getLane(s)
        const segmentKind = this.segmentHead.segmentKind
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
        const scaled = timeToScaledTime(time.now, this.head.timeScaleGroup)
        const s = this.getScale(scaled)
        const l = this.getL(s)
        const r = this.getR(s)
        for (let i = l + 0.5; i < r - 0.5; i++) {
            const segmentKind = this.segmentHead.segmentKind
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
        const scaled = timeToScaledTime(time.now, this.head.timeScaleGroup)
        const s = this.getScale(scaled)
        const lane = this.getLane(s)
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
    getAlpha() {
        return this.visual === VisualType.NotActivated
            ? options.connectorAlpha * 0.5
            : options.connectorAlpha
    }
    renderGlow() {
        if (!options.slotEffectEnabled) return
        if (this.visual !== VisualType.Activated) return
        const scaled = timeToScaledTime(time.now, this.head.timeScaleGroup)
        const s = this.getScale(scaled)
        const l = this.getL(s)
        const r = this.getR(s)
        const dynamicHeight =
            options.version == 0
                ? 3 + (Math.cos((time.now - this.activeHead.time) * 8 * Math.PI) + 1) / 2
                : 4 * ((Math.sin((time.now - this.activeHead.time) * 2.5 * Math.PI) + 1) / 2)
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
        const kind = this.segmentHead.segmentKind
        if (this.useFallbackGlowSprite)
            if (kind == 1)
                this.slideGlowSprite[1].fallback.draw(
                    quadLike,
                    this.glowZ,
                    options.version == 0
                        ? Math.min(1, (time.now - this.activeHead.time) * 4) *
                              (options.lightweight ? 0.15 : 0.3)
                        : Math.sin((time.now - this.activeHead.time) * 2.5 * Math.PI) *
                              (options.lightweight ? 0.15 : 0.3),
                )
            else
                this.slideGlowSprite[2].fallback.draw(
                    quadLike,
                    this.glowZ,
                    options.version == 0
                        ? Math.min(1, (time.now - this.activeHead.time) * 4) *
                              (options.lightweight ? 0.15 : 0.3)
                        : Math.sin((time.now - this.activeHead.time) * 2.5 * Math.PI) *
                              (options.lightweight ? 0.15 : 0.3),
                )
        else if (kind == 1)
            this.slideGlowSprite[1].glow.draw(
                quadLike,
                this.glowZ,
                options.version == 0
                    ? Math.min(1, (time.now - this.activeHead.time) * 4) *
                          (options.lightweight ? 0.15 : 0.3)
                    : Math.sin((time.now - this.activeHead.time) * 2.5 * Math.PI) *
                          (options.lightweight ? 0.15 : 0.3),
            )
        else
            this.slideGlowSprite[2].glow.draw(
                quadLike,
                this.glowZ,
                options.version == 0
                    ? Math.min(1, (time.now - this.activeHead.time) * 4) *
                          (options.lightweight ? 0.15 : 0.3)
                    : Math.sin((time.now - this.activeHead.time) * 2.5 * Math.PI) *
                          (options.lightweight ? 0.15 : 0.3),
            )
    }
    renderSlide() {
        const scaled = timeToScaledTime(time.now, this.head.timeScaleGroup)
        const s = this.getScale(scaled)
        const l = this.getL(s)
        const r = this.getR(s)
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
            const lane = this.getLane(s)
            {
                this.slideSprites.left.draw(perspectiveLayout({ l, r: ml, b, t }), this.slideZ, 1)
                this.slideSprites.middle.draw(
                    perspectiveLayout({ l: ml, r: mr, b, t }),
                    this.slideZ,
                    1,
                )
                this.slideSprites.right.draw(perspectiveLayout({ l: mr, r, b, t }), this.slideZ, 1)
                this.slideSprites.diamond.draw(
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
}
