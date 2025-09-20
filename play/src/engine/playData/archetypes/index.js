import { ComboLabel } from './customElements/ComboLabel.js'
import { ComboNumber } from './customElements/ComboNumber.js'
import { ComboNumberEffect } from './customElements/ComboNumberEffect.js'
import { ComboNumberGlow } from './customElements/ComboNumberGlow.js'
import { Initialization } from './Initialization.js'
import { InputManager } from './InputManager.js'
import { JudgmentAccuracy } from './customElements/JudgmentAccuracy.js'
import { JudgmentText } from './customElements/JudgmentText.js'
import { SimLine } from './SimLine.js'
import { Stage } from './Stage.js'
import { CriticalFlickNote } from './notes/flatNotes/flickNotes/singleFlickNotes/CriticalFlickNote.js'
import { NormalFlickNote } from './notes/flatNotes/flickNotes/singleFlickNotes/NormalFlickNote.js'
import { CriticalTailFlickNote } from './notes/flatNotes/flickNotes/slideTailFlickNotes/CriticalTailFlickNote.js'
import { NormalTailFlickNote } from './notes/flatNotes/flickNotes/slideTailFlickNotes/NormalTailFlickNote.js'
import { CriticalTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/CriticalTraceFlickNote.js'
import { NormalTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/NormalTraceFlickNote.js'
import { CriticalTailReleaseNote } from './notes/flatNotes/slideEndNotes/CriticalTailReleaseNote.js'
import { NormalTailReleaseNote } from './notes/flatNotes/slideEndNotes/NormalTailReleaseNote.js'
import { CriticalHeadTapNote } from './notes/flatNotes/slideStartNotes/CriticalHeadTapNote.js'
import { NormalHeadTapNote } from './notes/flatNotes/slideStartNotes/NormalHeadTapNote.js'
import { CriticalTapNote } from './notes/flatNotes/tapNotes/CriticalTapNote.js'
import { NormalTapNote } from './notes/flatNotes/tapNotes/NormalTapNote.js'
import { CriticalTailTraceNote } from './notes/flatNotes/traceNotes/traceTailNote/CriticalTailTraceNote.js'
import { CriticalTraceNote } from './notes/flatNotes/traceNotes/CriticalTraceNote.js'
import { NormalHeadTraceNote } from './notes/flatNotes/traceNotes/traceHeadNote/NormalHeadTraceNote.js'
import { NormalTraceNote } from './notes/flatNotes/traceNotes/NormalTraceNote.js'
import { TransientHiddenTickNote } from './notes/slideTickNotes/TransientHiddenTickNote.js'
import { AnchorNote } from './notes/slideTickNotes/AnchorNote.js'
import { CriticalTickNote } from './notes/slideTickNotes/visibleTickNotes/CriticalTickNote.js'
import { NormalTickNote } from './notes/slideTickNotes/visibleTickNotes/NormalTickNote.js'
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
import { TimeScaleChange } from './timeScale/TimeScaleChange.js'
import { TimeScaleGroup } from './timeScale/TimeScaleGroup.js'
import { Connector } from './slideConnectors/Connector.js'
import { DamageNote } from './notes/flatNotes/traceNotes/DamageNote.js'
import { NormalHeadFlickNote } from './notes/flatNotes/flickNotes/slideHeadFlickNotes/NormalHeadFlickNote.js'
import { CriticalHeadFlickNote } from './notes/flatNotes/flickNotes/slideHeadFlickNotes/CriticalHeadFlickNote.js'
import { NormalTailTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/slideTailTraceFlickNote/NormalTailTraceFlickNote.js'
import { CriticalTailTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/slideTailTraceFlickNote/CriticalTailTraceFlickNote.js'
import { CriticalHeadTraceNote } from './notes/flatNotes/traceNotes/traceHeadNote/CriticalHeadTraceNote.js'
import { NormalHeadTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/slideHeadTraceFlickNote/NormalHeadTraceFlickNote.js'
import { CriticalHeadTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/slideHeadTraceFlickNote/CriticalHeadTraceFlickNote.js'
import { NormalTailTraceNote } from './notes/flatNotes/traceNotes/traceTailNote/NormalTailTraceNote.js'
import { FakeNormalTapNote } from './notes/flatNotes/tapNotes/FakeNormalTapNote.js'
import { FakeCriticalTapNote } from './notes/flatNotes/tapNotes/FakeCriticalTapNote.js'
import { FakeNormalFlickNote } from './notes/flatNotes/flickNotes/singleFlickNotes/FakeNormalFlickNote.js'
import { FakeCriticalFlickNote } from './notes/flatNotes/flickNotes/singleFlickNotes/FakeCriticalFlickNote.js'
import { FakeNormalTraceNote } from './notes/flatNotes/traceNotes/FakeNormalTraceNote.js'
import { FakeCriticalTraceNote } from './notes/flatNotes/traceNotes/FakeCriticalTraceNote.js'
import { FakeNormalTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/FakeNormalTraceFlickNote.js'
import { FakeCriticalTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/FakeCriticalTraceFlickNote.js'
import { FakeNormalHeadTapNote } from './notes/flatNotes/slideStartNotes/FakeNormalHeadTapNote.js'
import { FakeCriticalHeadTapNote } from './notes/flatNotes/slideStartNotes/FakeCriticalHeadTapNote.js'
import { FakeNormalHeadFlickNote } from './notes/flatNotes/flickNotes/slideHeadFlickNotes/FakeNormalHeadFlickNote.js'
import { FakeCriticalHeadFlickNote } from './notes/flatNotes/flickNotes/slideHeadFlickNotes/FakeCriticalHeadFlickNote.js'
import { FakeNormalHeadTraceNote } from './notes/flatNotes/traceNotes/traceHeadNote/FakeNormalHeadTraceNote.js'
import { FakeCriticalHeadTraceNote } from './notes/flatNotes/traceNotes/traceHeadNote/FakeCriticalHeadTraceNote.js'
import { FakeNormalHeadTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/slideHeadTraceFlickNote/FakeNormalHeadTraceFlickNote.js'
import { FakeCriticalHeadTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/slideHeadTraceFlickNote/FakeCriticalHeadTraceFlickNote.js'
import { FakeNormalTailFlickNote } from './notes/flatNotes/flickNotes/slideTailFlickNotes/FakeNormalTailFlickNote.js'
import { FakeCriticalTailFlickNote } from './notes/flatNotes/flickNotes/slideTailFlickNotes/FakeCriticalTailFlickNote.js'
import { FakeNormalTailTraceNote } from './notes/flatNotes/traceNotes/traceTailNote/FakeNormalTailTraceNote.js'
import { FakeCriticalTailTraceNote } from './notes/flatNotes/traceNotes/traceTailNote/FakeCriticalTailTraceNote.js'
import { FakeNormalTailTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/slideTailTraceFlickNote/FakeNormalTailTraceFlickNote.js'
import { FakeCriticalTailTraceFlickNote } from './notes/flatNotes/flickNotes/traceFlickNotes/slideTailTraceFlickNote/FakeCriticalTailTraceFlickNote.js'
import { FakeNormalTailReleaseNote } from './notes/flatNotes/slideEndNotes/FakeNormalTailReleaseNote.js'
import { FakeCriticalTailReleaseNote } from './notes/flatNotes/slideEndNotes/FakeCriticalTailReleaseNote.js'
import { FakeAnchorNote } from './notes/slideTickNotes/FakeAnchorNote.js'
import { FakeTransientHiddenTickNote } from './notes/slideTickNotes/FakeTransientHiddenTickNote.js'
import { FakeNormalTickNote } from './notes/slideTickNotes/visibleTickNotes/FakeNormalTickNote.js'
import { FakeCriticalTickNote } from './notes/slideTickNotes/visibleTickNotes/FakeCriticalTickNote.js'
import { FakeDamageNote } from './notes/flatNotes/traceNotes/FakeDamageNote.js'
export const archetypes = defineArchetypes({
    '#TIMESCALE_GROUP': TimeScaleGroup,
    '#TIMESCALE_CHANGE': TimeScaleChange,
    Initialization,
    Stage,
    InputManager,
    SimLine,
    Connector,

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
    AnchorNote,
    TransientHiddenTickNote,
    NormalTickNote,
    CriticalTickNote,
    SlideParticleManager,
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
    //extended
    DamageNote,
    //fakeNote
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
    FakeAnchorNote,
    FakeTransientHiddenTickNote,
    FakeNormalTickNote,
    FakeCriticalTickNote,
    FakeDamageNote,
    //custom element
    JudgmentText,
    JudgmentAccuracy,
    ComboNumber,
    ComboNumberGlow,
    ComboNumberEffect,
    ComboLabel,
    Damage,
})
