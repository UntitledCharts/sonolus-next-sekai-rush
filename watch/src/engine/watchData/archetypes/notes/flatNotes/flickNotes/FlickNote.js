import { getArrowSpriteId } from '../../../../../../../../shared/src/engine/data/arrowSprites.js'
import { options } from '../../../../../configuration/options.js'
import { linearEffectLayout } from '../../../../particle.js'
import { scaledScreen } from '../../../../scaledScreen.js'
import { getZ, layer, skin } from '../../../../skin.js'
import { FlatNote } from '../FlatNote.js'
import { FlickDirection } from '../../../../../../../../shared/src/engine/data/FlickDirection.js'
export class FlickNote extends FlatNote {
    flickImport = this.defineImport({
        direction: { name: 'direction', type: DataType },
        accuracyDiff: { name: 'accuracyDiff', type: Number },
    })
    arrow = this.entityMemory({
        sprite: SkinSpriteId,
        layout: Quad,
        animation: Vec,
        z: Number,
    })
    lifetime = this.entityMemory(Number)
    check = this.entityMemory(Boolean)
    preprocess() {
        super.preprocess()
        if (options.mirror) {
            this.mirrorDirection()
        }
    }
    globalInitialize() {
        super.globalInitialize()
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
    get hitTime() {
        return (
            this.targetTime +
            (replay.isReplay ? this.import.accuracy + this.flickImport.accuracyDiff : 0)
        )
    }
    render() {
        super.render()
        if (time.now > this.hitTime + time.delta) return
        if (options.markerAnimation) {
            const s = this.checkDirection(this.flickImport.direction)
                ? Math.mod(time.now, 0.5) / 0.5
                : 1 - Math.mod(time.now, 0.5) / 0.5
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
