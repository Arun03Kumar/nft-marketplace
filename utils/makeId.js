export const makeId = (Length) => {
    let res = ''
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const charLen = chars.length

    for(let i = 0; i < Length; i++) {
        res += chars.charAt(Math.floor(Math.random() * charLen))
    }
    return res
}