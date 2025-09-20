import { CriticalHeadTapNote } from './CriticalHeadTapNote.js'
export class FakeCriticalHeadTapNote extends CriticalHeadTapNote {
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
