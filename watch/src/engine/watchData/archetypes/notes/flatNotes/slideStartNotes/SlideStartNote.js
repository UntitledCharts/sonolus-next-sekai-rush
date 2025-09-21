import { FlatNote } from '../FlatNote.js'
export class SlideStartNote extends FlatNote {
    render() {
        if (time.now > this.hitTime + time.delta) return
        super.render()
    }
}
