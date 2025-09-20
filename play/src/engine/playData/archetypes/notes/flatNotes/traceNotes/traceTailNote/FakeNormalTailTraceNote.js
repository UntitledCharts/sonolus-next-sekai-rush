import { NormalTailTraceNote } from './NormalTailTraceNote.js'
export class FakeNormalTailTraceNote extends NormalTailTraceNote {
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
