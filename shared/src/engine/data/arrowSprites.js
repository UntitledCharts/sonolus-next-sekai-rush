export const getArrowSpriteId = (arrowSprites, size, direction) => {
    const getId = (index) => {
        if (direction == 0) return arrowSprites.up[index].id
        else if (direction < 3) return arrowSprites.left[index].id
        else if (direction == 3) return arrowSprites.down[index].id
        else return arrowSprites.downLeft[index].id
    }
    switch (Math.clamp(Math.round(size * 2), 1, 6)) {
        case 1:
            return getId(0)
        case 2:
            return getId(1)
        case 3:
            return getId(2)
        case 4:
            return getId(3)
        case 5:
            return getId(4)
        default:
            return getId(5)
    }
}
