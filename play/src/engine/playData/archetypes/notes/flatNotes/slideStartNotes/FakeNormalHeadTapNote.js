import { NormalHeadTapNote } from './NormalHeadTapNote.js'
export class FakeNormalHeadTapNote extends NormalHeadTapNote {
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
