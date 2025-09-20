import { TransientHiddenTickNote } from './TransientHiddenTickNote.js'
export class FakeTransientHiddenTickNote extends TransientHiddenTickNote {
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
