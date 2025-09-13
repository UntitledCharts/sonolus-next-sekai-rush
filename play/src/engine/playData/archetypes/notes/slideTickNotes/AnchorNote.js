import { Note } from '../Note.js'
import { SlideTickNote } from './SlideTickNote.js'
export class AnchorNote extends Note {
    hasInput = false
    leniency = 0
    spawnOrder() {
        return 999999
    }
    shouldSpawn() {
        return false
    }
    terminate() {
        //None
    }
}
