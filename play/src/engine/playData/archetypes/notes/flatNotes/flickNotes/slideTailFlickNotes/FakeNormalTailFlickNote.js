import { NormalTailFlickNote } from './NormalTailFlickNote.js'
export class FakeNormalTailFlickNote extends NormalTailFlickNote {
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
