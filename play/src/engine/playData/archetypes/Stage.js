import { perspectiveLayout } from '../../../../../shared/src/engine/data/utils.js'
import { options } from '../../configuration/options.js'
import { effect, sfxDistance } from '../effect.js'
import { lane } from '../lane.js'
import { note } from '../note.js'
import { particle } from '../particle.js'
import { scaledScreen } from '../scaledScreen.js'
import { layer, skin } from '../skin.js'
import { canEmpty } from './InputManager.js'
export class Stage extends SpawnableArchetype({}) {
    hitbox = this.entityMemory(Rect)
    spawnOrder() {
        return -1e8
    }
    shouldSpawn() {
        return true
    }
    initialize() {
        new Rect(lane.hitbox).transform(skin.transform).copyTo(this.hitbox)
    }
    touchOrder = 2
    touch() {
        for (const touch of touches) {
            if (!this.hitbox.contains(touch.position)) continue
            if (!canEmpty(touch)) continue
            if (touch.started) {
                this.onEmptyStart(touch)
            } else {
                this.onEmptyMove(touch)
            }
        }
    }
    updateParallel() {
        if (!options.showLane) return
        if (this.useFallbackStage) {
            this.drawFallbackStage()
        } else {
            this.drawSekaiStage()
        }
        this.drawStageCover()
    }
    get useFallbackStage() {
        return !skin.sprites.sekaiStage.exists
    }
    onEmptyStart(touch) {
        this.playEmptyEffects(this.xToL(touch.position.x))
    }
    onEmptyMove(touch) {
        const l = this.xToL(touch.position.x)
        const oldL = this.xToL(touch.lastPosition.x)
        if (l === oldL) return
        this.playEmptyEffects(l)
    }
    xToL(x) {
        return Math.floor(Math.unlerp(this.hitbox.l, this.hitbox.r, x) * 12 - 6)
    }
    playEmptyEffects(l) {
        streams.set(l, time.now, 0)
        if (options.sfxEnabled) this.playEmptySFX()
        if (options.laneEffectEnabled) this.playEmptyLaneEffects(l)
    }
    playEmptySFX() {
        effect.clips.stage.play(sfxDistance)
    }
    playEmptyLaneEffects(l) {
        particle.effects.lane.spawn(
            perspectiveLayout({ l, r: l + 1, b: lane.b, t: lane.t }),
            0.3,
            false,
        )
    }
    drawSekaiStage() {
        const w = ((2048 / 1420) * 12) / 2
        const h = 1176 / 850
        const layout = new Rect({ l: -w, r: w, t: lane.t, b: lane.t + h })
        skin.sprites.sekaiStageLane.draw(layout, layer.stage, 1)
        skin.sprites.sekaiStageCover.draw(layout, layer.stage - 0.01, options.laneAlpha)
    }
    drawFallbackStage() {
        skin.sprites.stageLeftBorder.draw(
            perspectiveLayout({ l: -6.5, r: -6, b: lane.b, t: lane.t }),
            layer.stage,
            !options.showLane ? 0 : 1,
        )
        skin.sprites.stageRightBorder.draw(
            perspectiveLayout({ l: 6, r: 6.5, b: lane.b, t: lane.t }),
            layer.stage,
            !options.showLane ? 0 : 1,
        )
        for (let i = 0; i < 6; i++) {
            skin.sprites.lane.draw(
                perspectiveLayout({ l: i * 2 - 6, r: i * 2 - 4, b: lane.b, t: lane.t }),
                layer.stage,
                !options.showLane ? 0 : 1,
            )
        }
        skin.sprites.judgmentLine.draw(
            perspectiveLayout({ l: -6, r: 6, b: 1 + note.h, t: 1 - note.h }),
            layer.judgmentLine,
            !options.showLane ? 0 : 1,
        )
    }
    drawStageCover() {
        if (options.stageCover <= 0) return
        skin.sprites.cover.draw(
            new Rect({
                l: scaledScreen.l,
                r: scaledScreen.r,
                t: scaledScreen.t,
                b: Math.lerp(lane.t, 1, options.stageCover),
            }),
            layer.cover,
            !options.showLane ? 0 : 1,
        )
    }
}
