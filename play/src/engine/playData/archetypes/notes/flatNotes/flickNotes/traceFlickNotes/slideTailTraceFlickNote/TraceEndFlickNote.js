import { getHitbox } from '../../../../../../lane.js'
import { minFlickVR } from '../../../../../../flick.js'
import { archetypes } from '../../../../../index.js'
import { TraceFlickNote } from '../TraceFlickNote.js'
export class TraceEndFlickNote extends TraceFlickNote {
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
}
