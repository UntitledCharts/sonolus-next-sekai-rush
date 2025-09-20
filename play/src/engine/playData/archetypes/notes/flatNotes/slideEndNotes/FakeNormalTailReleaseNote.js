import { NormalTailReleaseNote } from './NormalTailReleaseNote.js'
export class FakeNormalTailReleaseNote extends NormalTailReleaseNote {
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
