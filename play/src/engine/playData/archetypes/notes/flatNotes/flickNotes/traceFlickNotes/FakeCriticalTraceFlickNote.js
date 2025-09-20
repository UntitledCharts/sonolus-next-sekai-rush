import { CriticalTraceFlickNote } from './CriticalTraceFlickNote.js'
export class FakeCriticalTraceFlickNote extends CriticalTraceFlickNote {
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
