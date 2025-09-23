import { archetypes } from './archetypes'

export const merge = {
    searching(cache, customCombo, ap) {
        let entityCount = 0
        while (entityInfos.get(entityCount).index == entityCount) {
            entityCount += 1
        }
        let next = 0,
            lineLength = 0
        for (let i = 0; i < entityCount; i++) {
            let ii = entityCount - 1 - i
            let archetypeIndex = entityInfos.get(ii).archetype
            if (
                archetypeIndex == archetypes.NormalTapNote.index ||
                archetypeIndex == archetypes.CriticalTapNote.index ||
                archetypeIndex == archetypes.NormalFlickNote.index ||
                archetypeIndex == archetypes.CriticalFlickNote.index ||
                archetypeIndex == archetypes.NormalTraceNote.index ||
                archetypeIndex == archetypes.CriticalTraceNote.index ||
                archetypeIndex == archetypes.NormalTraceFlickNote.index ||
                archetypeIndex == archetypes.CriticalTraceFlickNote.index ||
                archetypeIndex == archetypes.NormalHeadTapNote.index ||
                archetypeIndex == archetypes.CriticalHeadTapNote.index ||
                archetypeIndex == archetypes.NormalHeadTraceNote.index ||
                archetypeIndex == archetypes.CriticalHeadTraceNote.index ||
                archetypeIndex == archetypes.NormalHeadTraceFlickNote.index ||
                archetypeIndex == archetypes.CriticalHeadTraceFlickNote.index ||
                archetypeIndex == archetypes.NormalTailFlickNote.index ||
                archetypeIndex == archetypes.CriticalTailFlickNote.index ||
                archetypeIndex == archetypes.NormalTailTraceNote.index ||
                archetypeIndex == archetypes.CriticalTailTraceNote.index ||
                archetypeIndex == archetypes.NormalTailTraceFlickNote.index ||
                archetypeIndex == archetypes.CriticalTailTraceFlickNote.index ||
                archetypeIndex == archetypes.NormalTailReleaseNote.index ||
                archetypeIndex == archetypes.CriticalTailReleaseNote.index ||
                archetypeIndex == archetypes.NormalTickNote.index ||
                archetypeIndex == archetypes.CriticalTickNote.index ||
                archetypeIndex == archetypes.TransientHiddenTickNote.index
            ) {
                lineLength += 1
                customCombo.get(ii).value = next
                next = ii
            }
        }
        let currentEntity = next
        for (let i = 0; i < lineLength; i++) {
            let currentHead = currentEntity
            currentEntity = customCombo.get(currentEntity).value
            for (let j = 0; j < 32; j++) {
                if (cache.get(j) == 0) {
                    cache.set(j, currentHead)
                    break
                }
                let A = cache.get(j)
                let B = currentHead
                cache.set(j, 0)
                currentHead = this.merge(customCombo, A, B, Math.pow(2, j), Math.pow(2, j))
            }
        }
        let head = -1
        let currentLen = 0
        for (let i = 0; i < 32; i++) {
            if (cache.get(i) == 0) continue
            if (head == -1) {
                head = cache.get(i)
                currentLen = Math.pow(2, i)
                continue
            }
            let A = head
            let B = cache.get(i)
            let Asize = currentLen
            let Bsize = Math.pow(2, i)
            cache.set(i, 0)
            head = this.merge(customCombo, A, B, Asize, Bsize)
            currentLen = Asize + Bsize
        }
        customCombo.get(0).start = head
        customCombo.get(0).length = lineLength
        let idx = 0
        let ptr = head
        let combo = 0
        while (idx < lineLength && ptr != customCombo.get(customCombo.get(0).tail).value) {
            if ((replay.isReplay && customCombo.get(ptr).ap == true) || ap == true) {
                ap = true
                customCombo.get(ptr).ap = true
            }
            if (
                replay.isReplay &&
                (customCombo.get(ptr).judgment == Judgment.Good ||
                    customCombo.get(ptr).judgment == Judgment.Miss)
            )
                combo = 0
            else combo += 1
            customCombo.get(ptr).combo = combo
            ptr = customCombo.get(ptr).value
            idx++
        }
    },
    merge(customCombo, a, b, Asize, Bsize) {
        let Alen = 0
        let Blen = 0
        let A = a
        let B = b
        let newHead = customCombo.get(A).time > customCombo.get(B).time ? B : A
        let pointer = newHead
        if (customCombo.get(A).time > customCombo.get(B).time) {
            Blen += 1
            B = customCombo.get(B).value
        } else {
            Alen += 1
            A = customCombo.get(A).value
        }
        while (Alen < Asize && Blen < Bsize) {
            if (customCombo.get(A).time > customCombo.get(B).time) {
                customCombo.get(pointer).value = B
                pointer = B
                B = customCombo.get(B).value
                Blen += 1
            } else {
                customCombo.get(pointer).value = A
                pointer = A
                A = customCombo.get(A).value
                Alen += 1
            }
        }
        return newHead
    },
}
