import { FlickDirection } from '../../../../../../../../shared/src/engine/data/FlickDirection.js'
import { getArrowSpriteId } from '../../../../../../../../shared/src/engine/data/arrowSprites.js'
import { options } from '../../../../../configuration/options.js'
import { linearEffectLayout } from '../../../../particle.js'
import { scaledScreen } from '../../../../scaledScreen.js'
import { getZ, layer, skin } from '../../../../skin.js'
import { FlatNote } from '../FlatNote.js'
import { archetypes } from '../../../index.js'
export class FlickNote extends FlatNote {
    leniency = 1
    flickImport = this.defineImport({
        direction: { name: 'direction', type: DataType },
    })
    flickExport = this.defineExport({
        accuracyDiff: { name: 'accuracyDiff', type: Number },
        flickWarning: { name: 'flickWarning', type: Boolean },
    })
    arrow = this.entityMemory({
        sprite: SkinSpriteId,
        layout: Quad,
        animation: Vec,
        z: Number,
    })
    check = this.entityMemory(Boolean)
    laneEffectId = levelMemory(Tuple(12, ParticleEffectInstanceId))
    laneEffectLane = levelMemory({ l: Tuple(12, Number), r: Tuple(12, Number) })
    preprocess() {
        super.preprocess()
        if (options.mirror) this.mirrorDirection()
    }
    initialize() {
        super.initialize()
        this.arrow.sprite = getArrowSpriteId(
            this.arrowSprites,
            this.import.size,
            this.changingDirection(this.flickImport.direction),
        )
        if (skin.sprites.exists(this.arrow.sprite)) {
            const w =
                (Math.clamp(this.import.size, 0, 3) *
                    (-this.changingDirection(this.flickImport.direction) || 1)) /
                2
            let b = 1
            let t = 1 - 2 * Math.abs(w) * scaledScreen.wToH
            if (this.checkDirection(this.flickImport.direction) == -1) [b, t] = [t, b]
            new Rect({
                l: this.import.lane - w,
                r: this.import.lane + w,
                b,
                t,
            })
                .toQuad()
                .copyTo(this.arrow.layout)
        } else {
            this.arrow.sprite = this.arrowSprites.fallback.id
            const w = Math.clamp(this.import.size / 2, 1, 2)
            new Rect({ l: -1, r: 1, b: 1, t: -1 })
                .toQuad()
                .rotate((Math.PI / 6) * this.changingDirection(this.flickImport.direction))
                .scale(w, w * scaledScreen.wToH)
                .translate(this.import.lane, 1 - w * scaledScreen.wToH)
                .copyTo(this.arrow.layout)
        }
        if (options.markerAnimation)
            new Vec(
                this.changingDirection(this.flickImport.direction),
                -2 * scaledScreen.wToH,
            ).copyTo(this.arrow.animation)
        this.arrow.z = getZ(layer.note.arrow, -this.targetTime, this.import.lane, 0)
    }
    complete(touch) {
        this.result.judgment = input.judge(touch.time, this.targetTime, this.windows)
        this.result.accuracy = touch.time - this.targetTime
        if (!this.isCorrectDirection(touch)) {
            if (this.result.judgment === Judgment.Perfect) this.result.judgment = Judgment.Great
            if (this.result.accuracy < this.windows.perfect.max) {
                this.flickExport('accuracyDiff', this.result.accuracy - this.windows.perfect.max)
                this.result.accuracy = this.windows.perfect.max
            }
            this.flick = true
            this.flickExport('flickWarning', true)
        }
        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000
        this.playHitEffects(touch.time)
        this.despawn = true
    }
    render() {
        super.render()
        if (options.markerAnimation) {
            const s = Math.mod(time.now, 0.5) / 0.5
            skin.sprites.draw(
                this.arrow.sprite,
                this.arrow.layout.add(this.arrow.animation.mul(s)).mul(this.y),
                this.arrow.z,
                1 - Math.ease('In', 'Cubic', s),
            )
        } else {
            skin.sprites.draw(this.arrow.sprite, this.arrow.layout.mul(this.y), this.arrow.z, 1)
        }
    }
    playNoteEffects() {
        super.playNoteEffects()
        this.playDirectionalNoteEffect()
    }
    playDirectionalNoteEffect() {
        this.directionalEffect.spawn(
            linearEffectLayout({
                lane: this.import.lane,
                shear:
                    (options.version == 1 ? (this.critical ? 2.5 : 1) : 1) *
                    this.changingDirection(this.flickImport.direction),
            }),
            0.32,
            false,
        )
    }
    isCorrectDirection(touch) {
        if (
            this.flickImport.direction === FlickDirection.UpOmni ||
            this.flickImport.direction === FlickDirection.DownOmni
        )
            return true
        const a =
            (Math.PI / 2 - this.changingDirection(this.flickImport.direction)) *
            this.checkDirection(this.flickImport.direction)
        return touch.dx * Math.cos(a) + touch.dy * Math.sin(a) > 0
    }
    get critical() {
        return false
    }
    changingDirection(direction) {
        if (direction == FlickDirection.UpOmni || direction == FlickDirection.DownOmni) return 0
        else if (direction == FlickDirection.UpLeft || direction == FlickDirection.DownLeft)
            return -1
        else return 1
    }
    checkDirection(direction) {
        if (
            direction == FlickDirection.DownLeft ||
            direction == FlickDirection.DownRight ||
            direction == FlickDirection.DownOmni
        )
            return -1
        else return 1
    }
    mirrorDirection() {
        switch (this.flickImport.direction) {
            case FlickDirection.UpOmni:
                this.flickImport.direction = FlickDirection.DownOmni
                break
            case FlickDirection.DownOmni:
                this.flickImport.direction = FlickDirection.UpOmni
                break
            case FlickDirection.UpLeft:
                this.flickImport.direction = FlickDirection.DownLeft
                break
            case FlickDirection.DownLeft:
                this.flickImport.direction = FlickDirection.UpLeft
                break
            case FlickDirection.UpRight:
                this.flickImport.direction = FlickDirection.DownRight
                break
            case FlickDirection.DownRight:
                this.flickImport.direction = FlickDirection.UpRight
                break
        }
    }
}
