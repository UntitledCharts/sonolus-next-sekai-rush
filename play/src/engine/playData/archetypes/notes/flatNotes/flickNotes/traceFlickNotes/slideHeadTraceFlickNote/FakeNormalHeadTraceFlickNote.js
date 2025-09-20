import { NormalHeadTraceFlickNote } from './NormalHeadTraceFlickNote.js'
export class FakeNormalHeadTraceFlickNote extends NormalHeadTraceFlickNote {
    hasInput = false
    updateSequential() {
        //none
    }
    updateParallel() {
        super.updateParallel()
        if (time.now >= this.targetTime) {
            this.despawn = true
            return
        }
    }
    touch() {
        //none
    }
    terminate() {
        //none
    }
}
