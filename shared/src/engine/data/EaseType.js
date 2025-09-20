export var EaseType
;(function (EaseType) {
    EaseType[(EaseType['None'] = 0)] = 'None'
    EaseType[(EaseType['Linear'] = 1)] = 'Linear'
    EaseType[(EaseType['In'] = 2)] = 'In'
    EaseType[(EaseType['Out'] = 3)] = 'Out'
    EaseType[(EaseType['InOut'] = 4)] = 'InOut'
    EaseType[(EaseType['OutIn'] = 5)] = 'OutIn'
})(EaseType || (EaseType = {}))
export const ease = (ease, s) => {
    switch (ease) {
        case EaseType.None:
            return s <= 1 ? 0 : 1
        case EaseType.In:
            return Math.ease('In', 'Quad', s)
        case EaseType.Out:
            return Math.ease('Out', 'Quad', s)
        case EaseType.InOut:
            return Math.ease('InOut', 'Quad', s)
        case EaseType.OutIn:
            return Math.ease('OutIn', 'Quad', s)
        default:
            return s
    }
}
