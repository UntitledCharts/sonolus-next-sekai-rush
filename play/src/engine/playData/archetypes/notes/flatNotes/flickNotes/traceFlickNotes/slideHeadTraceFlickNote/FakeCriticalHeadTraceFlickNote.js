import { CriticalHeadTraceFlickNote } from './CriticalHeadTraceFlickNote.js'
export class FakeCriticalHeadTraceFlickNote extends CriticalHeadTraceFlickNote {
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
