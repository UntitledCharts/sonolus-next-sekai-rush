import { NormalTailTraceFlickNote } from './NormalTailTraceFlickNote.js'
export class FakeNormalTailTraceFlickNote extends NormalTailTraceFlickNote {
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
