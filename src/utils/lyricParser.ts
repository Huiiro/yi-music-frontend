import type {LyricLine} from '@/api/interface.ts'

/**
 * 读取并处理歌词
 * @param raw
 */
export function parseLRC(raw: string): LyricLine[] {
    const lines = raw
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0)

    const timeReg = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?]/

    const result: LyricLine[] = []

    for (const line of lines) {
        const match = timeReg.exec(line)
        if (match) {
            const min = parseInt(match[1])
            const sec = parseInt(match[2])
            const ms = parseInt(match[3] || '0')
            const time = min * 60 + sec + ms / 1000

            const text = line.replace(timeReg, '').trim()
            result.push({time, text})
        }
    }

    return result.sort((a, b) => a.time - b.time)
}

/**
 * 根据当前播放时间获取当前歌词行索引
 */
export function findCurrentLineIndex(lyrics: LyricLine[], currentTime: number): number {
    for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
            return i
        }
    }
    return 0
}
