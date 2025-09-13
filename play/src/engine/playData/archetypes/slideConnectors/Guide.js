import { ease } from '../../../../../../shared/src/engine/data/EaseType.js'
import {
    approach,
    approach2,
    progressCutoff,
    progressStart,
    progressTo,
} from '../../../../../../shared/src/engine/data/note.js'
import { options } from '../../../configuration/options.js'
import { getHitbox } from '../../lane.js'
import { note } from '../../note.js'
import { getZ, layer, skin } from '../../skin.js'
import { disallowEmpty } from '../InputManager.js'
import { archetypes } from '../index.js'
import { NormalHeadTapNote } from '../notes/flatNotes/slideStartNotes/NormalHeadTapNote.js'
import { timeToScaledTime, scaledTimeToEarliestTime } from '../utils.js'
export var VisualType
;(function (VisualType) {
    VisualType[(VisualType['Waiting'] = 0)] = 'Waiting'
    VisualType[(VisualType['NotActivated'] = 1)] = 'NotActivated'
    VisualType[(VisualType['Activated'] = 2)] = 'Activated'
})(VisualType || (VisualType = {}))
export var kind
;(function (kind) {
    kind[(kind['None'] = 0)] = 'None'
    // Slide
    kind[(kind['ActiveNormal'] = 1)] = 'ActiveNormal'
    kind[(kind['ActiveCritical'] = 2)] = 'ActiveCritical'
    kind[(kind['ActiveFakeNormal'] = 51)] = 'ActiveFakeNormal'
    kind[(kind['ActiveFakeCritical'] = 52)] = 'ActiveFakeCritical'
    // Guide
    kind[(kind['GuideNeutral'] = 101)] = 'ActiveNormal'
    kind[(kind['GuideRed'] = 102)] = 'GuideRed'
    kind[(kind['GuideGreen'] = 103)] = 'GuideGreen'
    kind[(kind['GuideBlue'] = 104)] = 'GuideBlue'
    kind[(kind['GuideYellow'] = 105)] = 'GuideYellow'
    kind[(kind['GuidePurple'] = 106)] = 'GuidePurple'
    kind[(kind['GuideCyan'] = 107)] = 'GuideCyan'
    kind[(kind['GuideBlack'] = 108)] = 'GuideBlack'
})(kind || (kind = {}))
export class Guide extends Archetype {
    sprites = {
        normal: {
            active: skin.sprites.normalActiveSlideConnectorNormal,
            normal: skin.sprites.normalActiveSlideConnectorActive,
            fallback: skin.sprites.normalActiveSlideConnectorFallback,
        },
        critical: {
            active: skin.sprites.criticalActiveSlideConnectorNormal,
            normal: skin.sprites.criticalActiveSlideConnectorActive,
            fallback: skin.sprites.criticalActiveSlideConnectorFallback,
        },
        green: {
            normal: skin.sprites.normalSlideConnectorNormal,
        },
        yellow: {
            normal: skin.sprites.criticalSlideConnectorNormal,
        },
    }
    leniency = 1
    import = this.defineImport({
        activeHeadRef: { name: 'activeHead', type: Number },
        activeTailRef: { name: 'activeTail', type: Number },
        headRef: { name: 'head', type: Number },
        tailRef: { name: 'tail', type: Number },
        segmentHeadRef: { name: 'segmentHead', type: Number },
        segmentTailRef: { name: 'segmentTail', type: Number },
    })
    activeHead = this.entityMemory({
        time: Number,
        scaledTime: Number,
        lane: Number,
        timeScaleGroup: Number,
    })
    activeTail = this.entityMemory({
        time: Number,
        scaledTime: Number,
    })
    head = this.entityMemory({
        time: Number,
        lane: Number,
        size: Number,
        scaledTime: Number,
        l: Number,
        r: Number,
        timeScaleGroup: Number,
        connectorEase: Number,
        isAttached: Number,
        attachHead: Number,
        attachTail: Number,
    })
    segmentHead = this.entityMemory({
        time: Number,
        lane: Number,
        size: Number,
        scaledTime: Number,
        l: Number,
        r: Number,
        timeScaleGroup: Number,
        connectorEase: Number,
        segmentKind: Number,
    })
    segmentTail = this.entityMemory({
        time: Number,
        scaledTime: Number,
        timeScaleGroup: Number,
    })
    tail = this.entityMemory({
        time: Number,
        lane: Number,
        size: Number,
        scaledTime: Number,
        timeScaleGroup: Number,
        l: Number,
        r: Number,
        isAttached: Number,
        attachHead: Number,
        attachTail: Number,
    })
    visualTime = this.entityMemory({
        start: Number,
        end: Number,
    })
    hiddenTime = this.entityMemory(Number)
    startTime = this.entityMemory(Number)
    endTime = this.entityMemory(Number)
    inputTime = this.entityMemory({
        start: Number,
        end: Number,
    })
    z = this.entityMemory(Number)
    visual = this.entityMemory(DataType)
    preprocess() {
        this.getActiveHead()
        this.getSegmentHead()
        this.getSegmentTail()
        this.getHead()
        this.getTail()
        this.head.scaledTime = timeToScaledTime(this.head.time, this.head.timeScaleGroup)
        this.tail.scaledTime = timeToScaledTime(this.tail.time, this.tail.timeScaleGroup)
        this.segmentHead.scaledTime = timeToScaledTime(
            this.segmentHead.time,
            this.segmentHead.timeScaleGroup,
        )
        this.segmentTail.scaledTime = timeToScaledTime(
            this.segmentTail.time,
            this.segmentTail.timeScaleGroup,
        )
        this.visualTime.start = Math.min(this.head.time, this.tail.time)
        this.visualTime.end = Math.max(this.head.time, this.tail.time)
        this.inputTime.start = this.visualTime.start + input.offset
        this.inputTime.end = this.visualTime.end + input.offset
        this.startTime = Math.min(
            this.visualTime.start,
            this.inputTime.start,
            archetypes.NormalHeadTapNote.sharedMemory.get(this.import.headRef).startTime,
            archetypes.NormalHeadTapNote.sharedMemory.get(this.import.tailRef).startTime,
        )
        this.endTime = Math.max(this.visualTime.end, this.inputTime.end)
    }
    getActiveHead() {
        switch (entityInfos.get(this.import.activeHeadRef).archetype) {
            case archetypes.NormalHeadTapNote.index:
                this.activeHead.lane = archetypes.NormalHeadTapNote.import.get(
                    this.import.activeHeadRef,
                ).lane
                this.activeHead.time = bpmChanges.at(
                    archetypes.NormalHeadTapNote.import.get(this.import.activeHeadRef).beat,
                ).time
                this.activeHead.timeScaleGroup = archetypes.NormalHeadTapNote.import.get(
                    this.import.activeHeadRef,
                ).timeScaleGroup
                break
            case archetypes.CriticalHeadTapNote.index:
                this.activeHead.lane = archetypes.CriticalHeadTapNote.import.get(
                    this.import.activeHeadRef,
                ).lane
                this.activeHead.time = bpmChanges.at(
                    archetypes.CriticalHeadTapNote.import.get(this.import.activeHeadRef).beat,
                ).time
                this.activeHead.timeScaleGroup = archetypes.CriticalHeadTapNote.import.get(
                    this.import.activeHeadRef,
                ).timeScaleGroup
                break
            case archetypes.NormalHeadTraceNote.index:
                this.activeHead.lane = archetypes.NormalHeadTraceNote.import.get(
                    this.import.activeHeadRef,
                ).lane
                this.activeHead.time = bpmChanges.at(
                    archetypes.NormalHeadTraceNote.import.get(this.import.activeHeadRef).beat,
                ).time
                this.activeHead.timeScaleGroup = archetypes.NormalHeadTraceNote.import.get(
                    this.import.activeHeadRef,
                ).timeScaleGroup
                break
            case archetypes.CriticalHeadTraceNote.index:
                this.activeHead.lane = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.activeHeadRef,
                ).lane
                this.activeHead.time = bpmChanges.at(
                    archetypes.CriticalHeadTraceNote.import.get(this.import.activeHeadRef).beat,
                ).time
                this.activeHead.timeScaleGroup = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.activeHeadRef,
                ).timeScaleGroup
                break
            case archetypes.AnchorNote.index:
                this.activeHead.lane = archetypes.AnchorNote.import.get(
                    this.import.activeHeadRef,
                ).lane
                this.activeHead.time = bpmChanges.at(
                    archetypes.AnchorNote.import.get(this.import.activeHeadRef).beat,
                ).time
                this.activeHead.timeScaleGroup = archetypes.AnchorNote.import.get(
                    this.import.activeHeadRef,
                ).timeScaleGroup
                break
        }
    }
    getSegmentHead() {
        switch (entityInfos.get(this.import.segmentHeadRef).archetype) {
            case archetypes.NormalHeadTapNote.index:
                this.segmentHead.lane = archetypes.NormalHeadTapNote.import.get(
                    this.import.segmentHeadRef,
                ).lane
                this.segmentHead.time = bpmChanges.at(
                    archetypes.NormalHeadTapNote.import.get(this.import.segmentHeadRef).beat,
                ).time
                this.segmentHead.timeScaleGroup = archetypes.NormalHeadTapNote.import.get(
                    this.import.segmentHeadRef,
                ).timeScaleGroup
                this.segmentHead.size = archetypes.NormalHeadTapNote.import.get(
                    this.import.segmentHeadRef,
                ).size
                this.segmentHead.segmentKind = archetypes.NormalHeadTapNote.import.get(
                    this.import.segmentHeadRef,
                ).segmentKind
                break
            case archetypes.CriticalHeadTapNote.index:
                this.segmentHead.lane = archetypes.CriticalHeadTapNote.import.get(
                    this.import.segmentHeadRef,
                ).lane
                this.segmentHead.time = bpmChanges.at(
                    archetypes.CriticalHeadTapNote.import.get(this.import.segmentHeadRef).beat,
                ).time
                this.segmentHead.timeScaleGroup = archetypes.CriticalHeadTapNote.import.get(
                    this.import.segmentHeadRef,
                ).timeScaleGroup
                this.segmentHead.size = archetypes.CriticalHeadTapNote.import.get(
                    this.import.segmentHeadRef,
                ).size
                this.segmentHead.segmentKind = archetypes.CriticalHeadTapNote.import.get(
                    archetypes.CriticalHeadTapNote.import.get(this.import.segmentHeadRef)
                        .attachHead,
                ).segmentKind
                break
            case archetypes.NormalTapNote.index:
                this.segmentHead.lane = archetypes.NormalTapNote.import.get(
                    this.import.segmentHeadRef,
                ).lane
                this.segmentHead.time = bpmChanges.at(
                    archetypes.NormalTapNote.import.get(this.import.segmentHeadRef).beat,
                ).time
                this.segmentHead.timeScaleGroup = archetypes.NormalTapNote.import.get(
                    this.import.segmentHeadRef,
                ).timeScaleGroup
                this.segmentHead.size = archetypes.NormalTapNote.import.get(
                    this.import.segmentHeadRef,
                ).size
                this.segmentHead.segmentKind = archetypes.NormalTapNote.import.get(
                    this.import.segmentHeadRef,
                ).segmentKind
                break
            case archetypes.CriticalTapNote.index:
                this.segmentHead.lane = archetypes.CriticalTapNote.import.get(
                    this.import.segmentHeadRef,
                ).lane
                this.segmentHead.time = bpmChanges.at(
                    archetypes.CriticalTapNote.import.get(this.import.segmentHeadRef).beat,
                ).time
                this.segmentHead.timeScaleGroup = archetypes.CriticalTapNote.import.get(
                    this.import.segmentHeadRef,
                ).timeScaleGroup
                this.segmentHead.size = archetypes.CriticalTapNote.import.get(
                    this.import.segmentHeadRef,
                ).size
                this.segmentHead.segmentKind = archetypes.CriticalTapNote.import.get(
                    this.import.segmentHeadRef,
                ).segmentKind
                break
            case archetypes.NormalHeadTraceNote.index:
                this.segmentHead.lane = archetypes.NormalHeadTraceNote.import.get(
                    this.import.segmentHeadRef,
                ).lane
                this.segmentHead.time = bpmChanges.at(
                    archetypes.NormalHeadTraceNote.import.get(this.import.segmentHeadRef).beat,
                ).time
                this.segmentHead.timeScaleGroup = archetypes.NormalHeadTraceNote.import.get(
                    this.import.segmentHeadRef,
                ).timeScaleGroup
                this.segmentHead.size = archetypes.NormalHeadTraceNote.import.get(
                    this.import.segmentHeadRef,
                ).size
                this.segmentHead.segmentKind = archetypes.NormalHeadTraceNote.import.get(
                    this.import.segmentHeadRef,
                ).segmentKind
                break
            case archetypes.CriticalHeadTraceNote.index:
                this.segmentHead.lane = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.segmentHeadRef,
                ).lane
                this.segmentHead.time = bpmChanges.at(
                    archetypes.CriticalHeadTraceNote.import.get(this.import.segmentHeadRef).beat,
                ).time
                this.segmentHead.timeScaleGroup = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.segmentHeadRef,
                ).timeScaleGroup
                this.segmentHead.size = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.segmentHeadRef,
                ).size
                this.segmentHead.segmentKind = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.segmentHeadRef,
                ).segmentKind
                break
            case archetypes.AnchorNote.index:
                this.segmentHead.lane = archetypes.AnchorNote.import.get(
                    this.import.segmentHeadRef,
                ).lane
                this.segmentHead.time = bpmChanges.at(
                    archetypes.AnchorNote.import.get(this.import.segmentHeadRef).beat,
                ).time
                this.segmentHead.timeScaleGroup = archetypes.AnchorNote.import.get(
                    this.import.segmentHeadRef,
                ).timeScaleGroup
                this.segmentHead.size = archetypes.AnchorNote.import.get(
                    this.import.segmentHeadRef,
                ).size
                this.segmentHead.segmentKind = archetypes.AnchorNote.import.get(
                    this.import.segmentHeadRef,
                ).segmentKind
                break
            case archetypes.NormalTickNote.index:
                this.segmentHead.lane = archetypes.NormalTickNote.import.get(
                    this.import.segmentHeadRef,
                ).lane
                this.segmentHead.time = bpmChanges.at(
                    archetypes.NormalTickNote.import.get(this.import.segmentHeadRef).beat,
                ).time
                this.segmentHead.timeScaleGroup = archetypes.NormalTickNote.import.get(
                    this.import.segmentHeadRef,
                ).timeScaleGroup
                this.segmentHead.size = archetypes.NormalTickNote.import.get(
                    this.import.segmentHeadRef,
                ).size
                this.segmentHead.segmentKind = archetypes.NormalTickNote.import.get(
                    this.import.segmentHeadRef,
                ).segmentKind
                break
            case archetypes.CriticalTickNote.index:
                this.segmentHead.lane = archetypes.CriticalTickNote.import.get(
                    this.import.segmentHeadRef,
                ).lane
                this.segmentHead.time = bpmChanges.at(
                    archetypes.CriticalTickNote.import.get(this.import.segmentHeadRef).beat,
                ).time
                this.segmentHead.timeScaleGroup = archetypes.CriticalTickNote.import.get(
                    this.import.segmentHeadRef,
                ).timeScaleGroup
                this.segmentHead.size = archetypes.CriticalTickNote.import.get(
                    this.import.segmentHeadRef,
                ).size
                this.segmentHead.segmentKind = archetypes.CriticalTickNote.import.get(
                    this.import.segmentHeadRef,
                ).segmentKind
                break
        }
    }
    getSegmentTail() {
        switch (entityInfos.get(this.import.segmentTailRef).archetype) {
            case archetypes.NormalTailReleaseNote.index:
                this.segmentTail.time = bpmChanges.at(
                    archetypes.NormalTailReleaseNote.import.get(this.import.segmentTailRef).beat,
                ).time
                this.segmentTail.timeScaleGroup = archetypes.NormalTailReleaseNote.import.get(
                    this.import.segmentTailRef,
                ).timeScaleGroup
                break
            case archetypes.CriticalTailReleaseNote.index:
                this.segmentTail.time = bpmChanges.at(
                    archetypes.CriticalTailReleaseNote.import.get(this.import.segmentTailRef).beat,
                ).time
                this.segmentTail.timeScaleGroup = archetypes.CriticalTailReleaseNote.import.get(
                    this.import.segmentTailRef,
                ).timeScaleGroup
                break
            case archetypes.NormalTapNote.index:
                this.segmentTail.time = bpmChanges.at(
                    archetypes.NormalTapNote.import.get(this.import.segmentTailRef).beat,
                ).time
                this.segmentTail.timeScaleGroup = archetypes.NormalTapNote.import.get(
                    this.import.segmentTailRef,
                ).timeScaleGroup
                break
            case archetypes.CriticalTapNote.index:
                this.segmentTail.time = bpmChanges.at(
                    archetypes.CriticalTapNote.import.get(this.import.segmentTailRef).beat,
                ).time
                this.segmentTail.timeScaleGroup = archetypes.CriticalTapNote.import.get(
                    this.import.segmentTailRef,
                ).timeScaleGroup
                break
            case archetypes.NormalTailTraceNote.index:
                this.segmentTail.time = bpmChanges.at(
                    archetypes.NormalTailTraceNote.import.get(this.import.segmentTailRef).beat,
                ).time
                this.segmentTail.timeScaleGroup = archetypes.NormalTailTraceNote.import.get(
                    this.import.segmentTailRef,
                ).timeScaleGroup
                break
            case archetypes.CriticalTailTraceNote.index:
                this.segmentTail.time = bpmChanges.at(
                    archetypes.CriticalTailTraceNote.import.get(this.import.segmentTailRef).beat,
                ).time
                this.segmentTail.timeScaleGroup = archetypes.CriticalTailTraceNote.import.get(
                    this.import.segmentTailRef,
                ).timeScaleGroup
                break
            case archetypes.AnchorNote.index:
                this.segmentTail.time = bpmChanges.at(
                    archetypes.AnchorNote.import.get(this.import.segmentTailRef).beat,
                ).time
                this.segmentTail.timeScaleGroup = archetypes.AnchorNote.import.get(
                    this.import.segmentTailRef,
                ).timeScaleGroup
                break
            case archetypes.NormalTickNote.index:
                this.segmentTail.time = bpmChanges.at(
                    archetypes.NormalTickNote.import.get(this.import.segmentTailRef).beat,
                ).time
                this.segmentTail.timeScaleGroup = archetypes.NormalTickNote.import.get(
                    this.import.segmentTailRef,
                ).timeScaleGroup
                break
            case archetypes.CriticalTickNote.index:
                this.segmentTail.time = bpmChanges.at(
                    archetypes.CriticalTickNote.import.get(this.import.segmentTailRef).beat,
                ).time
                this.segmentTail.timeScaleGroup = archetypes.CriticalTickNote.import.get(
                    this.import.segmentTailRef,
                ).timeScaleGroup
                break
        }
    }
    getHead() {
        switch (entityInfos.get(this.import.headRef).archetype) {
            case archetypes.NormalHeadTapNote.index:
                this.head.lane = archetypes.NormalHeadTapNote.import.get(this.import.headRef).lane
                this.head.time = bpmChanges.at(
                    archetypes.NormalHeadTapNote.import.get(this.import.headRef).beat,
                ).time
                this.head.timeScaleGroup = archetypes.NormalHeadTapNote.import.get(
                    this.import.headRef,
                ).timeScaleGroup
                this.head.size = archetypes.NormalHeadTapNote.import.get(this.import.headRef).size
                this.head.connectorEase = archetypes.NormalHeadTapNote.import.get(
                    this.import.headRef,
                ).connectorEase
                this.head.isAttached = archetypes.NormalHeadTapNote.import.get(
                    this.import.headRef,
                ).isAttached
                this.head.attachHead = archetypes.NormalHeadTapNote.import.get(
                    this.import.headRef,
                ).attachHead
                this.head.attachTail = archetypes.NormalHeadTapNote.import.get(
                    this.import.headRef,
                ).attachTail
                break
            case archetypes.CriticalHeadTapNote.index:
                this.head.lane = archetypes.CriticalHeadTapNote.import.get(this.import.headRef).lane
                this.head.time = bpmChanges.at(
                    archetypes.CriticalHeadTapNote.import.get(this.import.headRef).beat,
                ).time
                this.head.timeScaleGroup = archetypes.CriticalHeadTapNote.import.get(
                    this.import.headRef,
                ).timeScaleGroup
                this.head.size = archetypes.CriticalHeadTapNote.import.get(this.import.headRef).size
                this.head.connectorEase = archetypes.CriticalHeadTapNote.import.get(
                    this.import.headRef,
                ).connectorEase
                this.head.isAttached = archetypes.CriticalHeadTapNote.import.get(
                    this.import.headRef,
                ).isAttached
                this.head.attachHead = archetypes.CriticalHeadTapNote.import.get(
                    this.import.headRef,
                ).attachHead
                this.head.attachTail = archetypes.CriticalHeadTapNote.import.get(
                    this.import.headRef,
                ).attachTail
                break
            case archetypes.NormalTapNote.index:
                this.head.lane = archetypes.NormalTapNote.import.get(this.import.headRef).lane
                this.head.time = bpmChanges.at(
                    archetypes.NormalTapNote.import.get(this.import.headRef).beat,
                ).time
                this.head.timeScaleGroup = archetypes.NormalTapNote.import.get(
                    this.import.headRef,
                ).timeScaleGroup
                this.head.size = archetypes.NormalTapNote.import.get(this.import.headRef).size
                this.head.connectorEase = archetypes.NormalTapNote.import.get(
                    this.import.headRef,
                ).connectorEase
                this.head.isAttached = archetypes.NormalTapNote.import.get(
                    this.import.headRef,
                ).isAttached
                this.head.attachHead = archetypes.NormalTapNote.import.get(
                    this.import.headRef,
                ).attachHead
                this.head.attachTail = archetypes.NormalTapNote.import.get(
                    this.import.headRef,
                ).attachTail
                break
            case archetypes.CriticalTapNote.index:
                this.head.lane = archetypes.CriticalTapNote.import.get(this.import.headRef).lane
                this.head.time = bpmChanges.at(
                    archetypes.CriticalTapNote.import.get(this.import.headRef).beat,
                ).time
                this.head.timeScaleGroup = archetypes.CriticalTapNote.import.get(
                    this.import.headRef,
                ).timeScaleGroup
                this.head.size = archetypes.CriticalTapNote.import.get(this.import.headRef).size
                this.head.connectorEase = archetypes.CriticalTapNote.import.get(
                    this.import.headRef,
                ).connectorEase
                this.head.isAttached = archetypes.CriticalTapNote.import.get(
                    this.import.headRef,
                ).isAttached
                this.head.attachHead = archetypes.CriticalTapNote.import.get(
                    this.import.headRef,
                ).attachHead
                this.head.attachTail = archetypes.CriticalTapNote.import.get(
                    this.import.headRef,
                ).attachTail
                break
            case archetypes.NormalHeadTraceNote.index:
                this.head.lane = archetypes.NormalHeadTraceNote.import.get(this.import.headRef).lane
                this.head.time = bpmChanges.at(
                    archetypes.NormalHeadTraceNote.import.get(this.import.headRef).beat,
                ).time
                this.head.timeScaleGroup = archetypes.NormalHeadTraceNote.import.get(
                    this.import.headRef,
                ).timeScaleGroup
                this.head.size = archetypes.NormalHeadTraceNote.import.get(this.import.headRef).size
                this.head.connectorEase = archetypes.NormalHeadTraceNote.import.get(
                    this.import.headRef,
                ).connectorEase
                this.head.isAttached = archetypes.NormalHeadTraceNote.import.get(
                    this.import.headRef,
                ).isAttached
                this.head.attachHead = archetypes.NormalHeadTraceNote.import.get(
                    this.import.headRef,
                ).attachHead
                this.head.attachTail = archetypes.NormalHeadTraceNote.import.get(
                    this.import.headRef,
                ).attachTail
                break
            case archetypes.CriticalHeadTraceNote.index:
                this.head.lane = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.headRef,
                ).lane
                this.head.time = bpmChanges.at(
                    archetypes.CriticalHeadTraceNote.import.get(this.import.headRef).beat,
                ).time
                this.head.timeScaleGroup = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.headRef,
                ).timeScaleGroup
                this.head.size = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.headRef,
                ).size
                this.head.connectorEase = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.headRef,
                ).connectorEase
                this.head.isAttached = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.headRef,
                ).isAttached
                this.head.attachHead = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.headRef,
                ).attachHead
                this.head.attachTail = archetypes.CriticalHeadTraceNote.import.get(
                    this.import.headRef,
                ).attachTail
                break
            case archetypes.AnchorNote.index:
                this.head.lane = archetypes.AnchorNote.import.get(this.import.headRef).lane
                this.head.time = bpmChanges.at(
                    archetypes.AnchorNote.import.get(this.import.headRef).beat,
                ).time
                this.head.timeScaleGroup = archetypes.AnchorNote.import.get(
                    this.import.headRef,
                ).timeScaleGroup
                this.head.size = archetypes.AnchorNote.import.get(this.import.headRef).size
                this.head.connectorEase = archetypes.AnchorNote.import.get(
                    this.import.headRef,
                ).connectorEase
                this.head.isAttached = archetypes.AnchorNote.import.get(
                    this.import.headRef,
                ).isAttached
                this.head.attachHead = archetypes.AnchorNote.import.get(
                    this.import.headRef,
                ).attachHead
                this.head.attachTail = archetypes.AnchorNote.import.get(
                    this.import.headRef,
                ).attachTail
                break
            case archetypes.NormalTickNote.index:
                this.head.lane = archetypes.NormalTickNote.import.get(this.import.headRef).lane
                this.head.time = bpmChanges.at(
                    archetypes.NormalTickNote.import.get(this.import.headRef).beat,
                ).time
                this.head.timeScaleGroup = archetypes.NormalTickNote.import.get(
                    this.import.headRef,
                ).timeScaleGroup
                this.head.size = archetypes.NormalTickNote.import.get(this.import.headRef).size
                this.head.connectorEase = archetypes.NormalTickNote.import.get(
                    this.import.headRef,
                ).connectorEase
                this.head.isAttached = archetypes.NormalTickNote.import.get(
                    this.import.headRef,
                ).isAttached
                this.head.attachHead = archetypes.NormalTickNote.import.get(
                    this.import.headRef,
                ).size
                this.head.attachTail = archetypes.NormalTickNote.import.get(
                    this.import.headRef,
                ).attachTail
                break
            case archetypes.CriticalTickNote.index:
                this.head.lane = archetypes.CriticalTickNote.import.get(this.import.headRef).lane
                this.head.time = bpmChanges.at(
                    archetypes.CriticalTickNote.import.get(this.import.headRef).beat,
                ).time
                this.head.timeScaleGroup = archetypes.CriticalTickNote.import.get(
                    this.import.headRef,
                ).timeScaleGroup
                this.head.size = archetypes.CriticalTickNote.import.get(this.import.headRef).size
                this.head.connectorEase = archetypes.CriticalTickNote.import.get(
                    this.import.headRef,
                ).connectorEase
                this.head.isAttached = archetypes.CriticalTickNote.import.get(
                    this.import.headRef,
                ).isAttached
                this.head.attachHead = archetypes.CriticalTickNote.import.get(
                    this.import.headRef,
                ).attachHead
                this.head.attachTail = archetypes.CriticalTickNote.import.get(
                    this.import.headRef,
                ).attachTail
                break
        }
    }
    getTail() {
        switch (entityInfos.get(this.import.tailRef).archetype) {
            case archetypes.NormalTailReleaseNote.index:
                this.tail.lane = archetypes.NormalTailReleaseNote.import.get(
                    this.import.tailRef,
                ).lane
                this.tail.time = bpmChanges.at(
                    archetypes.NormalTailReleaseNote.import.get(this.import.tailRef).beat,
                ).time
                this.tail.timeScaleGroup = archetypes.NormalTailReleaseNote.import.get(
                    this.import.tailRef,
                ).timeScaleGroup
                this.tail.size = archetypes.NormalTailReleaseNote.import.get(
                    this.import.tailRef,
                ).size
                this.tail.isAttached = archetypes.NormalTailReleaseNote.import.get(
                    this.import.tailRef,
                ).isAttached
                this.tail.attachHead = archetypes.NormalTailReleaseNote.import.get(
                    this.import.tailRef,
                ).attachHead
                this.tail.attachTail = archetypes.NormalTailReleaseNote.import.get(
                    this.import.tailRef,
                ).attachTail
                break
            case archetypes.CriticalTailReleaseNote.index:
                this.tail.lane = archetypes.CriticalTailReleaseNote.import.get(
                    this.import.tailRef,
                ).lane
                this.tail.time = bpmChanges.at(
                    archetypes.CriticalTailReleaseNote.import.get(this.import.tailRef).beat,
                ).time
                this.tail.timeScaleGroup = archetypes.CriticalTailReleaseNote.import.get(
                    this.import.tailRef,
                ).timeScaleGroup
                this.tail.size = archetypes.CriticalTailReleaseNote.import.get(
                    this.import.tailRef,
                ).size
                this.tail.isAttached = archetypes.CriticalTailReleaseNote.import.get(
                    this.import.tailRef,
                ).isAttached
                this.tail.attachHead = archetypes.CriticalTailReleaseNote.import.get(
                    this.import.tailRef,
                ).attachHead
                this.tail.attachTail = archetypes.CriticalTailReleaseNote.import.get(
                    this.import.tailRef,
                ).attachTail
                break
            case archetypes.NormalTapNote.index:
                this.tail.lane = archetypes.NormalTapNote.import.get(this.import.tailRef).lane
                this.tail.time = bpmChanges.at(
                    archetypes.NormalTapNote.import.get(this.import.tailRef).beat,
                ).time
                this.tail.timeScaleGroup = archetypes.NormalTapNote.import.get(
                    this.import.tailRef,
                ).timeScaleGroup
                this.tail.size = archetypes.NormalTapNote.import.get(this.import.tailRef).size
                this.tail.isAttached = archetypes.NormalTapNote.import.get(
                    this.import.tailRef,
                ).isAttached
                this.tail.attachHead = archetypes.NormalTapNote.import.get(
                    this.import.tailRef,
                ).attachHead
                this.tail.attachTail = archetypes.NormalTapNote.import.get(
                    this.import.tailRef,
                ).attachTail
                break
            case archetypes.CriticalTapNote.index:
                this.tail.lane = archetypes.CriticalTapNote.import.get(this.import.tailRef).lane
                this.tail.time = bpmChanges.at(
                    archetypes.CriticalTapNote.import.get(this.import.tailRef).beat,
                ).time
                this.tail.timeScaleGroup = archetypes.CriticalTapNote.import.get(
                    this.import.tailRef,
                ).timeScaleGroup
                this.tail.size = archetypes.CriticalTapNote.import.get(this.import.tailRef).size
                this.tail.isAttached = archetypes.CriticalTapNote.import.get(
                    this.import.tailRef,
                ).isAttached
                this.tail.attachHead = archetypes.CriticalTapNote.import.get(
                    this.import.tailRef,
                ).attachHead
                this.tail.attachTail = archetypes.CriticalTapNote.import.get(
                    this.import.tailRef,
                ).attachTail
                break
            case archetypes.NormalTailTraceNote.index:
                this.tail.lane = archetypes.NormalTailTraceNote.import.get(this.import.tailRef).lane
                this.tail.time = bpmChanges.at(
                    archetypes.NormalTailTraceNote.import.get(this.import.tailRef).beat,
                ).time
                this.tail.timeScaleGroup = archetypes.NormalTailTraceNote.import.get(
                    this.import.tailRef,
                ).timeScaleGroup
                this.tail.size = archetypes.NormalTailTraceNote.import.get(this.import.tailRef).size
                this.tail.isAttached = archetypes.NormalTailTraceNote.import.get(
                    this.import.tailRef,
                ).isAttached
                this.tail.attachHead = archetypes.NormalTailTraceNote.import.get(
                    this.import.tailRef,
                ).attachHead
                this.tail.attachTail = archetypes.NormalTailTraceNote.import.get(
                    this.import.tailRef,
                ).attachTail
                break
            case archetypes.CriticalTailTraceNote.index:
                this.tail.lane = archetypes.CriticalTailTraceNote.import.get(
                    this.import.tailRef,
                ).lane
                this.tail.time = bpmChanges.at(
                    archetypes.CriticalTailTraceNote.import.get(this.import.tailRef).beat,
                ).time
                this.tail.timeScaleGroup = archetypes.CriticalTailTraceNote.import.get(
                    this.import.tailRef,
                ).timeScaleGroup
                this.tail.size = archetypes.CriticalTailTraceNote.import.get(
                    this.import.tailRef,
                ).size
                this.tail.isAttached = archetypes.CriticalTailTraceNote.import.get(
                    this.import.tailRef,
                ).isAttached
                this.tail.attachHead = archetypes.CriticalTailTraceNote.import.get(
                    this.import.tailRef,
                ).attachHead
                this.tail.attachTail = archetypes.CriticalTailTraceNote.import.get(
                    this.import.tailRef,
                ).attachTail
                break
            case archetypes.AnchorNote.index:
                this.tail.lane = archetypes.AnchorNote.import.get(this.import.tailRef).lane
                this.tail.time = bpmChanges.at(
                    archetypes.AnchorNote.import.get(this.import.tailRef).beat,
                ).time
                this.tail.timeScaleGroup = archetypes.AnchorNote.import.get(
                    this.import.tailRef,
                ).timeScaleGroup
                this.tail.size = archetypes.AnchorNote.import.get(this.import.tailRef).size
                this.tail.isAttached = archetypes.AnchorNote.import.get(
                    this.import.tailRef,
                ).isAttached
                this.tail.attachHead = archetypes.AnchorNote.import.get(
                    this.import.tailRef,
                ).attachHead
                this.tail.attachTail = archetypes.AnchorNote.import.get(
                    this.import.tailRef,
                ).attachTail
                break
            case archetypes.NormalTickNote.index:
                this.tail.lane = archetypes.NormalTickNote.import.get(this.import.tailRef).lane
                this.tail.time = bpmChanges.at(
                    archetypes.NormalTickNote.import.get(this.import.tailRef).beat,
                ).time
                this.tail.timeScaleGroup = archetypes.NormalTickNote.import.get(
                    this.import.tailRef,
                ).timeScaleGroup
                this.tail.size = archetypes.NormalTickNote.import.get(this.import.tailRef).size
                this.tail.isAttached = archetypes.NormalTickNote.import.get(
                    this.import.tailRef,
                ).isAttached
                this.tail.attachHead = archetypes.NormalTickNote.import.get(
                    this.import.tailRef,
                ).attachHead
                this.tail.attachTail = archetypes.NormalTickNote.import.get(
                    this.import.tailRef,
                ).attachTail
                break
            case archetypes.CriticalTickNote.index:
                this.tail.lane = archetypes.CriticalTickNote.import.get(this.import.tailRef).lane
                this.tail.time = bpmChanges.at(
                    archetypes.CriticalTickNote.import.get(this.import.tailRef).beat,
                ).time
                this.tail.timeScaleGroup = archetypes.CriticalTickNote.import.get(
                    this.import.tailRef,
                ).timeScaleGroup
                this.tail.size = archetypes.CriticalTickNote.import.get(this.import.tailRef).size
                this.tail.isAttached = archetypes.CriticalTickNote.import.get(
                    this.import.tailRef,
                ).isAttached
                this.tail.attachHead = archetypes.CriticalTickNote.import.get(
                    this.import.tailRef,
                ).attachHead
                this.tail.attachTail = archetypes.CriticalTickNote.import.get(
                    this.import.tailRef,
                ).attachTail
                break
        }
    }
    spawnOrder() {
        return 1000 + this.startTime
    }
    shouldSpawn() {
        return time.now >= this.startTime
    }
    initialize() {
        this.activeHead.scaledTime = timeToScaledTime(
            this.activeHead.time,
            this.activeHead.timeScaleGroup,
        )
        /*this.activeTail.time = bpmChanges.at(this.segmentTail.beat).time
        this.activeTail.scaledTime = timeToScaledTime(
            this.activeTail.time,
            this.segmentTail.timeScaleGroup,
        )*/
        this.head.l = this.head.lane - this.head.size
        this.head.r = this.head.lane + this.head.size
        this.tail.l = this.tail.lane - this.tail.size
        this.tail.r = this.tail.lane + this.tail.size
        if (options.hidden > 0)
            this.hiddenTime = this.tail.scaledTime - note.duration * options.hidden
        this.z = getZ(
            !this.guide ? layer.note.connector : layer.note.guide,
            -this.segmentHead.time,
            -Math.abs(this.segmentHead.lane) + this.critical,
        )
    }
    updateSequential() {
        if (time.now < this.head.time) return
        const s = this.getScale(timeToScaledTime(time.now - input.offset, this.head.timeScaleGroup))
        const hitbox = getHitbox({
            l: this.getL(s),
            r: this.getR(s),
            leniency: this.leniency,
        })
        for (const touch of touches) {
            if (touch.ended) continue
            if (!hitbox.contains(touch.position)) continue
            if (!this.guide) disallowEmpty(touch)
            this.activeHeadMemory.lastActiveTime = time.now
        }
        if (!this.guide) {
            if (this.activeHeadMemory.lastActiveTime === time.now) {
                if (this.activeHeadMemory.exportStartTime !== -1000) return
                streams.set(this.import.activeHeadRef, time.now, 999999)
                this.activeHeadMemory.exportStartTime = time.now
            } else {
                if (this.activeHeadMemory.exportStartTime === -1000) return
                streams.set(
                    this.import.activeHeadRef,
                    this.activeHeadMemory.exportStartTime,
                    time.now,
                )
                this.activeHeadMemory.exportStartTime = -1000
            }
        }
    }
    updateParallel() {
        if (time.now >= this.endTime) {
            this.despawn = true
            return
        }
        if (time.now < this.visualTime.end) {
            if (!this.guide) this.updateVisualType()
            this.renderConnector()
        }
    }
    get activeHeadMemory() {
        return archetypes.NormalHeadTapNote.sharedMemory.get(this.import.activeHeadRef)
    }
    get segmentHeadMemory() {
        return archetypes.NormalHeadTapNote.sharedMemory.get(this.import.segmentHeadRef)
    }
    useFallbackSprite() {
        if (
            this.segmentHead.segmentKind == kind.ActiveNormal ||
            this.segmentHead.segmentKind == kind.ActiveFakeNormal
        )
            return !this.sprites.normal.normal.exists || !this.sprites.normal.active.exists
        else if (
            this.segmentHead.segmentKind == kind.ActiveCritical ||
            this.segmentHead.segmentKind == kind.ActiveFakeCritical
        )
            return !this.sprites.normal.normal.exists || !this.sprites.normal.active.exists
        else if (this.segmentHead.segmentKind == kind.GuideGreen)
            return !this.sprites.normal.normal.exists || !this.sprites.normal.active.exists
        else if (this.segmentHead.segmentKind == kind.GuideYellow)
            return !this.sprites.normal.normal.exists || !this.sprites.normal.active.exists
    }
    get guide() {
        switch (this.segmentHead.segmentKind) {
            case kind.ActiveNormal ||
                kind.ActiveCritical ||
                kind.ActiveFakeNormal ||
                kind.ActiveFakeCritical:
                return 0
            default:
                return 0.15
        }
    }
    get critical() {
        switch (this.segmentHead.segmentKind) {
            case kind.ActiveCritical || kind.ActiveFakeCritical:
                return 1
            default:
                return 0
        }
    }
    updateVisualType() {
        this.visual =
            this.activeHeadMemory.lastActiveTime === time.now
                ? VisualType.Activated
                : time.now >=
                    this.activeHead.time + archetypes.NormalTapNote.windows.good.max + input.offset
                  ? VisualType.NotActivated
                  : VisualType.Waiting
    }
    progress(isAttached, attachHead, attachTail, targetTime, scaledTime, group) {
        if (isAttached) {
            const attachHeadMemory = archetypes.NormalHeadTapNote.sharedMemory.get(attachHead)
            const attachTailMemory = archetypes.NormalHeadTapNote.sharedMemory.get(attachTail)
            const headProgress =
                time.now <
                timeToScaledTime(attachHeadMemory.targetTime, attachHeadMemory.timeScaleGroup)
                    ? progressTo(
                          timeToScaledTime(
                              attachHeadMemory.targetTime,
                              attachHeadMemory.timeScaleGroup,
                          ),
                          attachHeadMemory.timeScaleGroup == 0
                              ? time.now
                              : archetypes['#TIMESCALE_GROUP'].sharedMemory.get(
                                    attachHeadMemory.timeScaleGroup,
                                ).currentScaledTime,
                          options.noteSpeed,
                      )
                    : 1
            const tailProgress = progressTo(
                timeToScaledTime(attachTailMemory.targetTime, attachTailMemory.timeScaleGroup),
                attachTailMemory.timeScaleGroup == 0
                    ? time.now
                    : archetypes['#TIMESCALE_GROUP'].sharedMemory.get(
                          attachTailMemory.timeScaleGroup,
                      ).currentScaledTime,
                options.noteSpeed,
            )
            const headFrac =
                time.now < attachHeadMemory.targetTime
                    ? 0
                    : Math.unlerpClamped(
                          attachHeadMemory.targetTime,
                          attachTailMemory.targetTime,
                          time.now,
                      )
            const tailFrac = 1
            const frac = Math.unlerpClamped(
                attachHeadMemory.targetTime,
                attachTailMemory.targetTime,
                targetTime,
            )
            return Math.remapClamped(headFrac, tailFrac, headProgress, tailProgress, frac)
        } else
            return progressTo(
                scaledTime,
                archetypes['#TIMESCALE_GROUP'].sharedMemory.get(group).currentScaledTime,
                options.noteSpeed,
            )
    }
    renderConnector() {
        if (time.now >= this.tail.time) return
        let startProgress = 0
        let headProgress = 0
        const tailProgress = this.progress(
            this.tail.isAttached,
            this.tail.attachHead,
            this.tail.attachTail,
            this.tail.time,
            this.tail.scaledTime,
            this.tail.timeScaleGroup,
        )
        if (time.now >= this.head.time) {
            const headFrac = Math.unlerpClamped(this.head.time, this.tail.time, time.now)
            headProgress = Math.remap(headFrac, 1, 1, tailProgress, 0)
            startProgress = Math.clamp(1, progressStart, progressCutoff)
        } else {
            headProgress = this.progress(
                this.head.isAttached,
                this.head.attachHead,
                this.head.attachTail,
                this.head.time,
                this.head.scaledTime,
                this.head.timeScaleGroup,
            )
            startProgress = Math.clamp(headProgress, progressStart, progressCutoff)
        }
        const endProgress = Math.clamp(tailProgress, progressStart, progressCutoff)
        const startFrac = Math.unlerpClamped(headProgress, tailProgress, startProgress)
        const endFrac = Math.unlerpClamped(headProgress, tailProgress, endProgress)
        const easedStartFrac = ease(this.head.connectorEase, startFrac)
        const easedEndFrac = ease(this.head.connectorEase, endFrac)
        const startTravel = approach2(startProgress)
        const endTravel = approach2(endProgress)
        const startLane = Math.lerp(this.head.lane, this.tail.lane, easedStartFrac)
        const endLane = Math.lerp(this.head.lane, this.tail.lane, easedEndFrac)
        const startSize = Math.max(1e-3, Math.lerp(this.head.size, this.tail.size, easedStartFrac))
        const endSize = Math.max(1e-3, Math.lerp(this.head.size, this.tail.size, easedEndFrac))
        let lastTravel = startTravel
        let lastLane = startLane
        let lastSize = startSize
        let lastTargetTime = Math.lerp(this.head.time, this.tail.time, startFrac)
        for (let i = 1; i <= 10; i++) {
            const nextFrac = Math.lerp(startFrac, endFrac, i / 10)
            const nextProgress = Math.lerp(startProgress, endProgress, i / 10)
            const nextTravel = approach2(nextProgress)
            const nextLane = Math.lerp(
                this.head.lane,
                this.tail.lane,
                ease(this.head.connectorEase, nextFrac),
            )
            const nextSize = Math.max(1e-3, Math.lerp(this.head.size, this.tail.size, nextFrac))
            const nextTargetTime = Math.lerp(this.head.time, this.tail.time, nextFrac)
            const layout = {
                x1: (lastLane - lastSize) * lastTravel,
                x2: (nextLane - nextSize) * nextTravel,
                x3: (nextLane + nextSize) * nextTravel,
                x4: (lastLane + lastSize) * lastTravel,
                y1: lastTravel,
                y2: nextTravel,
                y3: nextTravel,
                y4: lastTravel,
            }
            const a = this.getAlpha(
                this.segmentHead.scaledTime,
                this.segmentTail.scaledTime,
                lastTargetTime,
            )
            lastTravel = nextTravel
            lastLane = nextLane
            lastSize = nextSize
            lastTargetTime = nextTargetTime
            if (this.useFallbackSprite()) {
                this.sprites.normal.fallback.draw(layout, this.z, a)
                return
            }
            this.drawConnector(layout, a)
        }
    }
    /*renderConnector() {
        const scaled = timeToScaledTime(time.now, this.head.timeScaleGroup)
        if (options.hidden > 0 && scaled > this.hiddenTime) return
        const hiddenDuration = options.hidden > 0 ? note.duration * options.hidden : 0
        const visibleTime = {
            min: Math.max(this.head.scaledTime, scaled + hiddenDuration),
            max: Math.min(this.tail.scaledTime, scaled + note.duration),
        }
        for (let i = 0; i < 10; i++) {
            const scaledTime = {
                min: Math.lerp(visibleTime.min, visibleTime.max, i / 10),
                max: Math.lerp(visibleTime.min, visibleTime.max, (i + 1) / 10),
            }
            const s = {
                min: this.getScale(scaledTime.min),
                max: this.getScale(scaledTime.max),
            }
            const y = {
                min: approach(scaledTime.min - note.duration, scaledTime.min, scaled),
                max: approach(scaledTime.max - note.duration, scaledTime.max, scaled),
            }
            if (y.min < y.max) {
            [y.min, y.max] = [y.max, y.min];
            [s.min, s.max] = [s.max, s.min];
            }
            const layout = {
                x1: this.getL(s.min) * y.min,
                x2: this.getL(s.max) * y.max,
                x3: this.getR(s.max) * y.max,
                x4: this.getR(s.min) * y.min,
                y1: y.min,
                y2: y.max,
                y3: y.max,
                y4: y.min,
            }
            const a = this.getAlpha(
                this.segmentHead.scaledTime,
                this.segmentTail.scaledTime,
                scaledTime.min,
            )
            if (this.useFallbackSprite()) {
                this.sprites.normal.fallback.draw(layout, this.z, a)
                return
            }
            this.drawConnector(layout, a)
        }
    }*/
    getAlpha(a, b, x) {
        return Math.remap(
            a,
            b,
            options.guideAlpha,
            options.guideAlpha * this.getMinAlpha(this.critical),
            x,
        )
    }
    getScale(scaledTime) {
        if (time.now > this.activeHead.time)
            return this.ease(
                Math.unlerpClamped(this.head.scaledTime, this.tail.scaledTime, scaledTime),
            )
        else return this.ease(Math.unlerpClamped(this.head.time, this.tail.scaledTime, scaledTime))
    }
    ease(s) {
        return ease(this.head.connectorEase, s)
    }
    getLane(scale) {
        return Math.lerp(this.head.lane, this.tail.lane, scale)
    }
    getL(scale) {
        return Math.lerp(this.head.l, this.tail.l, scale)
    }
    getR(scale) {
        return Math.lerp(this.head.r, this.tail.r, scale)
    }
    getMinAlpha(critical) {
        if (critical > 0) return 0.2
        else return 0.15
    }
    drawConnector(layout, a) {
        const normalA = (Math.cos((time.now - this.segmentHead.time) * 2 * Math.PI) + 1) / 2
        if (options.connectorAnimation && this.visual === VisualType.Activated && !this.guide) {
            if (
                this.segmentHead.segmentKind == kind.ActiveNormal ||
                this.segmentHead.segmentKind == kind.ActiveFakeNormal
            ) {
                this.sprites.normal.normal.draw(
                    layout,
                    this.z,
                    a * Math.ease('Out', 'Quad', normalA),
                )
                this.sprites.normal.active.draw(layout, this.z, a * 0.9 * (1 - normalA))
            } else if (
                this.segmentHead.segmentKind == kind.ActiveCritical ||
                this.segmentHead.segmentKind == kind.ActiveFakeCritical
            ) {
                this.sprites.critical.normal.draw(
                    layout,
                    this.z,
                    a * Math.ease('Out', 'Quad', normalA),
                )
                this.sprites.critical.active.draw(layout, this.z, a * 0.9 * (1 - normalA))
            } else if (this.segmentHead.segmentKind == kind.GuideGreen) {
                this.sprites.green.normal.draw(layout, this.z, a)
            } else if (this.segmentHead.segmentKind == kind.GuideYellow) {
                this.sprites.yellow.normal.draw(layout, this.z, a)
            }
        } else {
            this.sprites.normal.normal.draw(layout, this.z, a)
        }
    }
}
