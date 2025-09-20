import { CriticalHeadTraceNote } from './CriticalHeadTraceNote.js'
export class FakeCriticalHeadTraceNote extends CriticalHeadTraceNote {
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
