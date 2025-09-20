import { CriticalTailFlickNote } from './CriticalTailFlickNote.js'
export class FakeCriticalTailFlickNote extends CriticalTailFlickNote {
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
