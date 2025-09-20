import { Note } from '../Note.js'
import { getVisualSpawnTime } from '../../utils.js'
import { getAttached } from './utils.js'
export class AnchorNote extends Note {
    hasInput = false
    leniency = 0
    preprocess() {
        super.preprocess()
        if (!this.import.isAttached) {
            this.sharedMemory.visualStartTime = getVisualSpawnTime(
                this.sharedMemory.targetScaledTime,
                this.import.timeScaleGroup,
            )
            this.spawnTime = Math.min(this.sharedMemory.visualStartTime, this.targetTime)
            this.sharedMemory.spawnTime = this.spawnTime
        }
        this.attach()
    }
    attach() {
        if (this.import.isAttached) {
            if (!this.import.isSeparator) {
                this.import.connectorEase = this.import.get(this.import.attachHead).connectorEase
            }
            ;({ lane: this.import.lane, size: this.import.size } = getAttached(
                this.import.connectorEase,
                this.import.get(this.import.attachHead).lane,
                this.import.get(this.import.attachHead).size,
                bpmChanges.at(this.import.get(this.import.attachHead).beat).time,
                this.import.get(this.import.attachTail).lane,
                this.import.get(this.import.attachTail).size,
                bpmChanges.at(this.import.get(this.import.attachTail).beat).time,
                this.targetTime,
            ))
            this.sharedMemory.visualStartTime = Math.min(
                this.sharedMemory.get(this.import.attachHead).visualStartTime,
                this.sharedMemory.get(this.import.attachTail).visualStartTime,
            )
            this.spawnTime = Math.min(this.sharedMemory.visualStartTime, this.targetTime)
            this.sharedMemory.spawnTime = this.spawnTime
        }
    }
    spawnOrder() {
        return 1e8
    }
    shouldSpawn() {
        return false
    }
    terminate() {
        //None
    }
}
