import { ease } from '../../../../../../../../../shared/src/engine/data/EaseType.js'
import { minFlickVR } from '../../../../../flick.js'
import { getHitbox } from '../../../../../lane.js'
import { archetypes } from '../../../../index.js'
import { FlickNote } from '../FlickNote.js'
export class SlideEndFlickNote extends FlickNote {
    earlyInputTime = this.entityMemory(Number)
    initialize() {
        super.initialize()
        this.earlyInputTime = this.targetTime + input.offset
    }
    touch() {
        if (time.now < this.inputTime.min) return
        if (this.startInfo.state === EntityState.Active) return
        if (time.now < this.earlyInputTime) {
            this.earlyTouch()
        } else {
            this.lateTouch()
        }
    }
    get startSharedMemory() {
        return archetypes.NormalHeadTapNote.sharedMemory.get(this.import.activeHeadRef)
    }
    get activeConnectorInfo() {
        return archetypes.NormalHeadTapNote.sharedMemory.get(this.import.activeHeadRef)
            .activeConnectorInfo
    }
    get startInfo() {
        return entityInfos.get(this.activeConnectorInfo.info)
    }
    earlyTouch() {
        if (this.startSharedMemory.lastActiveTime === time.now) return
        const hitbox = getHitbox({
            l: this.activeConnectorInfo.inputLane - this.activeConnectorInfo.inputSize,
            r: this.activeConnectorInfo.inputLane + this.activeConnectorInfo.inputSize,
            leniency: this.leniency,
        })
        for (const touch of touches) {
            if (touch.vr < minFlickVR) continue
            if (!hitbox.contains(touch.lastPosition)) continue
            if (!touch.ended && hitbox.contains(touch.position)) continue
            this.complete(touch)
            return
        }
    }
    lateTouch() {
        for (const touch of touches) {
            if (touch.vr < minFlickVR) continue
            if (!this.fullHitbox.contains(touch.lastPosition)) continue
            this.complete(touch)
            return
        }
    }
}
