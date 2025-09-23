import { NormalLayout } from '../../../../../../shared/src/engine/data/utils'
import { drawDigit } from './drawDigit'
import { getZ, layer } from '../../skin'
export const comboNumberLayout = {
    numberLayout(
        ap,
        z,
        digits,
        digitCount,
        digitWidth,
        digitWidth2,
        digitGap,
        digitGap2,
        s,
        s2,
        a,
        a2,
        a3,
        h,
        h2,
        centerX,
        centerY,
        startX,
        startX2,
    ) {
        if (digitCount === 1) {
            const digitLayout = NormalLayout({
                l: s * (centerX - digitWidth / 2) + (1 - s) * centerX,
                r: s * (centerX + digitWidth / 2) + (1 - s) * centerX,
                t: s * (centerY - h / 2) + (1 - s) * centerY,
                b: s * (centerY + h / 2) + (1 - s) * centerY,
            })
            const digitLayout2 = NormalLayout({
                l: s2 * (centerX - digitWidth2 / 2) + (1 - s2) * centerX,
                r: s2 * (centerX + digitWidth2 / 2) + (1 - s2) * centerX,
                t: s2 * (centerY - h2 / 2) + (1 - s2) * centerY,
                b: s2 * (centerY + h2 / 2) + (1 - s2) * centerY,
            })
            drawDigit.drawAp(ap, digits[6], digitLayout, getZ(layer.judgment + 2, 0, 0, 0), a3)
            drawDigit.drawDigit(ap, digits[6], digitLayout, getZ(layer.judgment, 0, 0, 0), a)
            drawDigit.drawDigit(ap, digits[6], digitLayout2, getZ(layer.judgment + 1, 0, 0, 0), a2)
            return
        }

        const top = s * (centerY - h / 2) + (1 - s) * centerY
        const bottom = s * (centerY + h / 2) + (1 - s) * centerY
        const top2 = s2 * (centerY - h2 / 2) + (1 - s2) * centerY
        const bottom2 = s2 * (centerY + h2 / 2) + (1 - s2) * centerY

        const drawNthDigit = (positionIndex, digit) => {
            const offset = positionIndex * (digitWidth + digitGap)
            const offset2 = positionIndex * (digitWidth2 + digitGap2)
            const digitLayout = NormalLayout({
                l: s * (startX + offset) + (1 - s) * centerX,
                r: s * (startX + offset + digitWidth) + (1 - s) * centerX,
                t: top,
                b: bottom,
            })
            const digitLayout2 = NormalLayout({
                l: s2 * (startX2 + offset2) + (1 - s2) * centerX,
                r: s2 * (startX2 + offset2 + digitWidth2) + (1 - s2) * centerX,
                t: top2,
                b: bottom2,
            })
            drawDigit.drawAp(ap, digit, digitLayout, getZ(layer.judgment + 2, 0, 0, 0), a3)
            drawDigit.drawDigit(ap, digit, digitLayout, getZ(layer.judgment, 0, 0, 0), a)
            drawDigit.drawDigit(ap, digit, digitLayout2, getZ(layer.judgment + 1, 0, 0, 0), a2)
        }
        switch (digitCount) {
            case 2:
                drawNthDigit(0, digits[5])
                drawNthDigit(1, digits[6])
                break
            case 3:
                drawNthDigit(0, digits[4])
                drawNthDigit(1, digits[5])
                drawNthDigit(2, digits[6])
                break
            case 4:
                drawNthDigit(0, digits[3])
                drawNthDigit(1, digits[4])
                drawNthDigit(2, digits[5])
                drawNthDigit(3, digits[6])
                break
            case 5:
                drawNthDigit(0, digits[2])
                drawNthDigit(1, digits[3])
                drawNthDigit(2, digits[4])
                drawNthDigit(3, digits[5])
                drawNthDigit(4, digits[6])
                break
            case 6:
                drawNthDigit(0, digits[1])
                drawNthDigit(1, digits[2])
                drawNthDigit(2, digits[3])
                drawNthDigit(3, digits[4])
                drawNthDigit(4, digits[5])
                drawNthDigit(5, digits[6])
                break
            case 7:
                drawNthDigit(0, digits[0])
                drawNthDigit(1, digits[1])
                drawNthDigit(2, digits[2])
                drawNthDigit(3, digits[3])
                drawNthDigit(4, digits[4])
                drawNthDigit(5, digits[5])
                drawNthDigit(6, digits[6])
                break
        }
    },
}
