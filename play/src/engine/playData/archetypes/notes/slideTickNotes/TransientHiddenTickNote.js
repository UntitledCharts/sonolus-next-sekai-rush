import { SlideTickNote } from './SlideTickNote.js'
import { getAttached } from './utils.js'
export class TransientHiddenTickNote extends SlideTickNote {
    preprocessOrder = 1
    preprocess() {
        super.preprocess()
    }
}
