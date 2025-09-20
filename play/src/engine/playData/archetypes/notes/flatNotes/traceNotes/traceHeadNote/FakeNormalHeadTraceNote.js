import { NormalHeadTraceNote } from './NormalHeadTraceNote.js'
export class FakeNormalHeadTraceNote extends NormalHeadTraceNote {
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
