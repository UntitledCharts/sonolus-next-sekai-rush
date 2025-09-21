import { lane } from '../../../../../../../shared/src/engine/data/lane.js'
import {
    approach,
    approach2,
    progressCutoff,
    progressStart,
} from '../../../../../../../shared/src/engine/data/note.js'
import { perspectiveLayout } from '../../../../../../../shared/src/engine/data/utils.js'
import { toBucketWindows } from '../../../../../../../shared/src/engine/data/windows.js'
import { options } from '../../../../configuration/options.js'
import { sfxDistance } from '../../../effect.js'
import { note } from '../../../note.js'
import { circularEffectLayout, linearEffectLayout, particle } from '../../../particle.js'
import { getZ, layer } from '../../../skin.js'
import { getVisualSpawnTime, progress } from '../../utils.js'
import { Note } from '../Note.js'
import { getAttached } from '../slideTickNotes/utils.js'
export class FlatNote extends Note {
    layer = layer.note.body
    visualSpawnTime = this.entityMemory(Number)
    hiddenTime = this.entityMemory(Number)
    initialized = this.entityMemory(Boolean)
    spriteLayouts = this.entityMemory({
        left: Quad,
        middle: Quad,
        right: Quad,
    })
    progress = this.entityMemory(Number)
    z = this.entityMemory(Number)
    y = this.entityMemory(Number)
    globalPreprocess() {
        this.bucket.set(toBucketWindows(this.windows))
        this.life.miss = -80
    }
    preprocess() {
        super.preprocess()
        if (options.sfxEnabled) {
            if (replay.isReplay && !options.autoSFX) {
                this.scheduleReplaySFX()
            } else {
                this.scheduleSFX()
            }
        }
        if (options.slotEffectEnabled && (!replay.isReplay || this.import.judgment)) {
            this.spawnSlotEffects(this.hitTime)
        }
        if (!replay.isReplay) {
            this.result.bucket.index = this.bucket.index
        } else if (this.import.judgment) {
            this.result.bucket.index = this.bucket.index
            this.result.bucket.value = this.import.accuracy * 1000
        }
        if (this.import.isAttached == 0) {
            this.sharedMemory.visualStartTime = getVisualSpawnTime(
                this.sharedMemory.targetScaledTime,
                this.import.timeScaleGroup,
            )
            this.visualSpawnTime = Math.min(this.sharedMemory.visualStartTime, this.targetTime)
            this.sharedMemory.spawnTime = this.visualSpawnTime
        }
        this.attach()
    }
    attach() {
        if (this.import.isAttached == 1) {
            if (!this.import.isSeparator) {
                this.import.connectorEase = this.import.get(this.import.attachHead).connectorEase
            }
            ;({ lane: this.import.lane, size: this.import.size } = getAttached(
                this.import.connectorEase,
                this.import.get(this.import.attachHead).lane,
                this.import.get(this.import.attachHead).size,
                bpmChanges.at(this.import.get(this.import.attachHead).beat).time,
                this.import.get(this.import.attachTail).lane,
                this.import.get(this.import.attachTail).size,
                bpmChanges.at(this.import.get(this.import.attachTail).beat).time,
                this.targetTime,
            ))
            this.sharedMemory.visualStartTime = Math.min(
                this.sharedMemory.get(this.import.attachHead).visualStartTime,
                this.sharedMemory.get(this.import.attachTail).visualStartTime,
            )
            this.visualSpawnTime = Math.min(this.sharedMemory.visualStartTime, this.targetTime)
            this.sharedMemory.spawnTime = this.visualSpawnTime
        }
    }
    spawnTime() {
        return this.visualSpawnTime
    }
    despawnTime() {
        return this.sharedMemory.hitTime
    }
    initialize() {
        if (this.initialized) return
        this.initialized = true
        this.globalInitialize()
    }
    updateParallel() {
        if (time.now < this.sharedMemory.visualStartTime) return
        this.render()
    }
    terminate() {
        if (time.skip) return
        this.despawnTerminate()
    }
    get useFallbackSprites() {
        return (
            !this.sprites.left.exists || !this.sprites.middle.exists || !this.sprites.right.exists
        )
    }
    get useFallbackClip() {
        return (
            !this.clips.perfect.exists ||
            ('great' in this.clips && !this.clips.great.exists) ||
            ('good' in this.clips && !this.clips.good.exists)
        )
    }
    get circularEffectId() {
        return 'circularFallback' in this.effects && !this.effects.circular.exists
            ? this.effects.circularFallback.id
            : this.effects.circular.id
    }
    get linearEffectId() {
        return 'linearFallback' in this.effects && !this.effects.linear.exists
            ? this.effects.linearFallback.id
            : this.effects.linear.id
    }
    get slotEffectId() {
        return this.effects.slotEffects.id
    }
    get hitTime() {
        return this.targetTime + (replay.isReplay ? this.import.accuracy : 0)
    }
    globalInitialize() {
        const l = this.import.lane - this.import.size
        const r = this.import.lane + this.import.size
        const b = 1 + note.h
        const t = 1 - note.h
        if (this.useFallbackSprites) {
            perspectiveLayout({ l, r, b, t }).copyTo(this.spriteLayouts.middle)
        } else {
            const ml = l + 0.3
            const mr = r - 0.3
            perspectiveLayout({ l, r: ml, b, t }).copyTo(this.spriteLayouts.left)
            perspectiveLayout({ l: ml, r: mr, b, t }).copyTo(this.spriteLayouts.middle)
            perspectiveLayout({ l: mr, r, b, t }).copyTo(this.spriteLayouts.right)
        }
        this.z = getZ(this.layer, -this.targetTime, this.import.lane, 0)
    }
    scheduleSFX() {
        if ('fallback' in this.clips && this.useFallbackClip) {
            this.clips.fallback.schedule(this.targetTime, sfxDistance)
        } else {
            this.clips.perfect.schedule(this.targetTime, sfxDistance)
        }
    }
    scheduleReplaySFX() {
        if (!this.import.judgment) return
        if ('fallback' in this.clips && this.useFallbackClip) {
            this.clips.fallback.schedule(this.hitTime, sfxDistance)
        } else if ('great' in this.clips && 'good' in this.clips) {
            switch (this.import.judgment) {
                case Judgment.Perfect:
                    this.clips.perfect.schedule(this.hitTime, sfxDistance)
                    break
                case Judgment.Great:
                    this.clips.great.schedule(this.hitTime, sfxDistance)
                    break
                case Judgment.Good:
                    this.clips.good.schedule(this.hitTime, sfxDistance)
                    break
            }
        } else {
            this.clips.perfect.schedule(this.hitTime, sfxDistance)
        }
    }
    render() {
        if (time.now > this.hitTime + time.delta) return
        this.progress = progress(
            this.import.isAttached,
            this.import.attachHead,
            this.import.attachTail,
            this.targetTime,
            this.sharedMemory.targetScaledTime,
            this.import.timeScaleGroup,
        )
        if (progressStart > this.progress || this.progress > progressCutoff) return
        this.y = approach2(this.progress) /*approach(
            this.sharedMemory.visualStartTime,
            this.endTime,
            timeToScaledTime(time.now, this.import.timeScaleGroup),
        )*/
        if (this.useFallbackSprites) {
            this.sprites.fallback.draw(this.spriteLayouts.middle.mul(this.y), this.z, 1)
        } else {
            this.sprites.left.draw(this.spriteLayouts.left.mul(this.y), this.z, 1)
            this.sprites.middle.draw(this.spriteLayouts.middle.mul(this.y), this.z, 1)
            this.sprites.right.draw(this.spriteLayouts.right.mul(this.y), this.z, 1)
        }
    }
    despawnTerminate() {
        if (replay.isReplay && !this.import.judgment) return
        if (time.now < this.hitTime - note.duration) return
        if (time.now > this.hitTime + time.delta) return
        if (options.noteEffectEnabled) this.playNoteEffects()
        if (options.slotEffectEnabled) this.playSlotLinears()
        if (options.laneEffectEnabled) this.playLaneEffects()
    }
    playNoteEffects() {
        this.playLinearNoteEffect()
        this.playCircularNoteEffect()
    }
    playLinearNoteEffect() {
        particle.effects.spawn(
            this.linearEffectId,
            linearEffectLayout({
                lane: this.import.lane,
                shear: 0,
            }),
            0.5,
            false,
        )
    }
    playCircularNoteEffect() {
        particle.effects.spawn(
            this.circularEffectId,
            circularEffectLayout({
                lane: this.import.lane,
                w: 1.75,
                h: 1.05,
            }),
            0.6,
            false,
        )
    }
    playLaneEffects() {
        if (particle.effects.noteLane.exists) {
            particle.effects.noteLane.spawn(
                perspectiveLayout({
                    l: this.import.lane - this.import.size,
                    r: this.import.lane + this.import.size,
                    b: lane.b,
                    t: lane.t,
                }),
                1,
                false,
            )
        } else {
            particle.effects.lane.spawn(
                perspectiveLayout({
                    l: this.import.lane - this.import.size,
                    r: this.import.lane + this.import.size,
                    b: lane.b,
                    t: lane.t,
                }),
                0.45,
                false,
            )
        }
    }
    playSlotLinears() {
        if (this.effects.slotEffects.exists) {
            const start = Math.floor(this.import.lane - this.import.size)
            const end = Math.ceil(this.import.lane + this.import.size)
            for (let i = start; i < end; i++) {
                particle.effects.spawn(
                    this.slotEffectId,
                    linearEffectLayout({
                        lane: i + 0.5,
                        shear: 0,
                    }),
                    0.5,
                    false,
                )
            }
        }
    }
    spawnSlotEffects(startTime) {
        const start = Math.floor(this.import.lane - this.import.size)
        const end = Math.ceil(this.import.lane + this.import.size)
        for (let i = start; i < end; i++) {
            this.slotEffect.spawn({
                startTime,
                lane: i + 0.5,
            })
        }
        this.slotGlowEffect.spawn({
            startTime,
            lane: this.import.lane,
            size: this.import.size,
        })
    }
}
