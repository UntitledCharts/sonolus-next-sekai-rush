import { CriticalTailReleaseNote } from './CriticalTailReleaseNote.js'
export class FakeCriticalTailReleaseNote extends CriticalTailReleaseNote {
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
