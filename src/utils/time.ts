/**
 * 歌词时间格式化 -- 00:00
 * @param seconds
 */
export function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0')
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0')
    return `${m}:${s}`
}