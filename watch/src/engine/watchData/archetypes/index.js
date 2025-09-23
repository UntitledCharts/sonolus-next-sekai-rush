import { LaneEffectSpawner } from './/notes/flatNotes/flickNotes/LaneEffectSpawner.js'
import { ComboLabel } from './customElements/ComboLabel.js'
import { ComboNumber } from './customElements/ComboNumber.js'
import { Initialization } from './Initialization.js'
import { JudgmentAccuracy } from './customElements/JudgmentAccuracy.js'
import { JudgmentText } from './customElements/JudgmentText.js'
import { SimLine } from './SimLine.js'
import { Stage } from './Stage.js'
import { NormalTapNote } from './notes/flatNotes/tapNotes/NormalTapNote.js'
import { CriticalFlickNote } from './notes/flatNotes/flickNotes/CriticalFlickNote.js'
import { CriticalTailFlickNote } from './notes/flatNotes/flickNotes/CriticalTailFlickNote.js'
import { NormalFlickNote } from './notes/flatNotes/flickNotes/NormalFlickNote.js'
import { NormalTailFlickNote } from './notes/flatNotes/flickNotes/NormalTailFlickNote.js'
import { CriticalTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/CriticalTraceFlickNote.js'
import { NormalTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/NormalTraceFlickNote.js'
import { CriticalHeadTapNote } from './notes/flatNotes/slideStartNotes/CriticalHeadTapNote.js'
import { NormalHeadTapNote } from './notes/flatNotes/slideStartNotes/NormalHeadTapNote.js'
import { CriticalTailTraceNote } from './notes/flatNotes/traceNotes/CriticalTailTraceNote.js'
import { CriticalHeadTraceNote } from './notes/flatNotes/traceNotes/CriticalHeadTraceNote.js'
import { CriticalTraceNote } from './notes/flatNotes/traceNotes/CriticalTraceNote.js'
import { NormalTailTraceNote } from './notes/flatNotes/traceNotes/NormalTailTraceNote.js'
import { NormalHeadTraceNote } from './notes/flatNotes/traceNotes/NormalHeadTraceNote.js'
import { NormalTraceNote } from './notes/flatNotes/traceNotes/NormalTraceNote.js'
import { TransientHiddenTickNote } from './notes/slideTickNotes/TransientHiddenTickNote.js'
import { AnchorNote } from './notes/slideTickNotes/AnchorNote.js'
import { CriticalTickNote } from './notes/slideTickNotes/visibleSlideTickNotes/CriticalTickNote.js'
import { NormalTickNote } from './notes/slideTickNotes/visibleSlideTickNotes/NormalTickNote.js'
import { SlideParticleManager } from './slideConnectors/SlideParticleManager.js'
import { CriticalSlotEffect } from './slotEffects/CriticalSlotEffect.js'
import { FlickSlotEffect } from './slotEffects/FlickSlotEffect.js'
import { NormalSlotEffect } from './slotEffects/NormalSlotEffect.js'
import { SlideSlotEffect } from './slotEffects/SlideSlotEffect.js'
import { CriticalFlickSlotGlowEffect } from './slotGlowEffects/CriticalFlickSlotGlowEffect.js'
import { CriticalSlideNoteSlotGlowEffect } from './slotGlowEffects/CriticalSlideNoteSlotGlowEffect.js'
import { CriticalSlotGlowEffect } from './slotGlowEffects/CriticalSlotGlowEffect.js'
import { FlickSlotGlowEffect } from './slotGlowEffects/FlickSlotGlowEffect.js'
import { NormalSlotGlowEffect } from './slotGlowEffects/NormalSlotGlowEffect.js'
import { SlideSlotGlowEffect } from './slotGlowEffects/SlideSlotGlowEffect.js'
import { Damage } from './customElements/Damage.js'
import { CriticalSlideSlotEffect } from './slotEffects/CriticalSlideSlotEffect.js'
import { CriticalFlickSlotEffect } from './slotEffects/CriticalFlickSlotEffect.js'
import { CriticalTapNote } from './notes/flatNotes/tapNotes/CriticalTapNote.js'
import { NormalTailReleaseNote } from './notes/flatNotes/slideEndNotes/NormalTailReleaseNote.js'
import { CriticalTailReleaseNote } from './notes/flatNotes/slideEndNotes/CriticalTailReleaseNote.js'
import { Connector } from './slideConnectors/Connector.js'
import { TimeScaleGroup } from './timeScale/TimeScaleGroup.js'
import { TimeScaleChange } from './timeScale/TimeScaleChange.js'
import { NormalHeadFlickNote } from './notes/flatNotes/flickNotes/NormalHeadFlickNote.js'
import { CriticalHeadFlickNote } from './notes/flatNotes/flickNotes/CriticalHeadFlickNote.js'
import { NormalHeadTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/NormalHeadTraceFlickNote.js'
import { CriticalHeadTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/CriticalHeadTraceFlickNote.js'
import { NormalTailTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/NormalTailTraceFlickNote.js'
import { CriticalTailTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/CriticalTailTraceFlickNote.js'
import { FakeNormalTapNote } from './notes/flatNotes/tapNotes/FakeNormalTapNote.js'
import { FakeCriticalTapNote } from './notes/flatNotes/tapNotes/FakeCriticalTapNote.js'
import { FakeNormalFlickNote } from './notes/flatNotes/flickNotes/FakeNormalFlickNote.js'
import { FakeCriticalFlickNote } from './notes/flatNotes/flickNotes/FakeCriticalFlickNote.js'
import { FakeNormalTraceNote } from './notes/flatNotes/traceNotes/FakeNormalTraceNote.js'
import { FakeCriticalTraceNote } from './notes/flatNotes/traceNotes/FakeCriticalTraceNote.js'
import { FakeNormalTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/FakeNormalTraceFlickNote.js'
import { FakeCriticalTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/FakeCriticalTraceFlickNote.js'
import { FakeNormalHeadTapNote } from './notes/flatNotes/slideStartNotes/FakeNormalHeadTapNote.js'
import { FakeCriticalHeadTapNote } from './notes/flatNotes/slideStartNotes/FakeCriticalHeadTapNote.js'
import { FakeNormalHeadFlickNote } from './notes/flatNotes/flickNotes/FakeNormalHeadFlickNote.js'
import { FakeCriticalHeadFlickNote } from './notes/flatNotes/flickNotes/FakeCriticalHeadFlickNote.js'
import { FakeNormalHeadTraceNote } from './notes/flatNotes/traceNotes/FakeNormalHeadTraceNote.js'
import { FakeCriticalHeadTraceNote } from './notes/flatNotes/traceNotes/FakeCriticalHeadTraceNote.js'
import { FakeNormalHeadTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/FakeNormalHeadTraceFlickNote.js'
import { FakeCriticalHeadTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/FakeCriticalHeadTraceFlickNote.js'
import { FakeNormalTailFlickNote } from './notes/flatNotes/flickNotes/FakeNormalTailFlickNote.js'
import { FakeCriticalTailFlickNote } from './notes/flatNotes/flickNotes/FakeCriticalTailFlickNote.js'
import { FakeNormalTailTraceNote } from './notes/flatNotes/traceNotes/FakeNormalTailTraceNote.js'
import { FakeCriticalTailTraceNote } from './notes/flatNotes/traceNotes/FakeCriticalTailTraceNote].js'
import { FakeNormalTailTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/FakeNormalTailTraceFlickNote.js'
import { FakeCriticalTailTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/FakeCriticalTailTraceFlickNote.js'
import { FakeNormalTailReleaseNote } from './notes/flatNotes/slideEndNotes/FakeNormalTailReleaseNote.js'
import { FakeCriticalTailReleaseNote } from './notes/flatNotes/slideEndNotes/FakeCriticalTailReleaseNote.js'
import { FakeNormalTickNote } from './notes/slideTickNotes/visibleSlideTickNotes/FakeNormalTickNote.js'
import { FakeCriticalTickNote } from './notes/slideTickNotes/visibleSlideTickNotes/FakeCriticalTickNote.js'
import { FakeAnchorNote } from './notes/slideTickNotes/FakeAnchorNote.js'
import { FakeTransientHiddenTickNote } from './notes/slideTickNotes/FakeTransientHiddenTickNote.js'
export const archetypes = defineArchetypes({
    '#TIMESCALE_GROUP': TimeScaleGroup,
    '#TIMESCALE_CHANGE': TimeScaleChange,
    Initialization,
    Stage,
    Connector,
    SimLine,

    NormalTapNote,
    CriticalTapNote,
    NormalFlickNote,
    CriticalFlickNote,
    NormalTraceNote,
    CriticalTraceNote,
    NormalTraceFlickNote,
    CriticalTraceFlickNote,
    NormalHeadTapNote,
    CriticalHeadTapNote,
    NormalHeadFlickNote,
    CriticalHeadFlickNote,
    NormalHeadTraceNote,
    CriticalHeadTraceNote,
    NormalHeadTraceFlickNote,
    CriticalHeadTraceFlickNote,
    NormalTailFlickNote,
    CriticalTailFlickNote,
    NormalTailTraceNote,
    CriticalTailTraceNote,
    NormalTailTraceFlickNote,
    CriticalTailTraceFlickNote,
    NormalTailReleaseNote,
    CriticalTailReleaseNote,
    NormalTickNote,
    CriticalTickNote,
    AnchorNote,
    TransientHiddenTickNote,

    FakeNormalTapNote,
    FakeCriticalTapNote,
    FakeNormalFlickNote,
    FakeCriticalFlickNote,
    FakeNormalTraceNote,
    FakeCriticalTraceNote,
    FakeNormalTraceFlickNote,
    FakeCriticalTraceFlickNote,
    FakeNormalHeadTapNote,
    FakeCriticalHeadTapNote,
    FakeNormalHeadFlickNote,
    FakeCriticalHeadFlickNote,
    FakeNormalHeadTraceNote,
    FakeCriticalHeadTraceNote,
    FakeNormalHeadTraceFlickNote,
    FakeCriticalHeadTraceFlickNote,
    FakeNormalTailFlickNote,
    FakeCriticalTailFlickNote,
    FakeNormalTailTraceNote,
    FakeCriticalTailTraceNote,
    FakeNormalTailTraceFlickNote,
    FakeCriticalTailTraceFlickNote,
    FakeNormalTailReleaseNote,
    FakeCriticalTailReleaseNote,
    FakeNormalTickNote,
    FakeCriticalTickNote,
    FakeAnchorNote,
    FakeTransientHiddenTickNote,

    NormalSlotEffect,
    SlideSlotEffect,
    FlickSlotEffect,
    CriticalSlotEffect,
    CriticalFlickSlotEffect,
    CriticalSlideSlotEffect,
    NormalSlotGlowEffect,
    SlideSlotGlowEffect,
    FlickSlotGlowEffect,
    CriticalSlotGlowEffect,
    CriticalSlideNoteSlotGlowEffect,
    CriticalFlickSlotGlowEffect,
    LaneEffectSpawner,
    SlideParticleManager,
    JudgmentText,
    JudgmentAccuracy,
    ComboNumber,
    ComboLabel,
    Damage,
})
