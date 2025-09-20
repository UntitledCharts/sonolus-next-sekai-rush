import { CriticalHeadFlickNote } from './CriticalHeadFlickNote.js'
export class FakeCriticalHeadFlickNote extends CriticalHeadFlickNote {
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
