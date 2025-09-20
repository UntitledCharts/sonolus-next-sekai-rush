import { NormalLayout } from '../../../../../../shared/src/engine/data/utils'
import { drawDigit } from './drawDigit'

export const comboNumberLayout = {
    numberLayout(
        ap,
        z,
        digits,
        digitCount,
        digitWidth,
        digitGap,
        s,
        a,
        h,
        centerX,
        centerY,
        startX,
        glow,
    ) {
        if (digitCount === 1) {
            const digitLayout = NormalLayout({
                l: s * (centerX - digitWidth / 2) + (1 - s) * centerX,
                r: s * (centerX + digitWidth / 2) + (1 - s) * centerX,
                t: s * (centerY - h / 2) + (1 - s) * centerY,
                b: s * (centerY + h / 2) + (1 - s) * centerY,
            })
            if (glow) {
                drawDigit.drawAp(ap, digits[6], digitLayout, z, a)
            } else {
                drawDigit.drawDigit(ap, digits[6], digitLayout, z, a)
            }
            return
        }

        const top = s * (centerY - h / 2) + (1 - s) * centerY
        const bottom = s * (centerY + h / 2) + (1 - s) * centerY

        const drawNthDigit = (positionIndex, digit) => {
            const offset = positionIndex * (digitWidth + digitGap)
            const digitLayout = NormalLayout({
                l: s * (startX + offset) + (1 - s) * centerX,
                r: s * (startX + offset + digitWidth) + (1 - s) * centerX,
                t: top,
                b: bottom,
            })
            if (glow) {
                drawDigit.drawAp(ap, digit, digitLayout, z, a)
            } else {
                drawDigit.drawDigit(ap, digit, digitLayout, z, a)
            }
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
