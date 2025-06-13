export interface AudioTrack {
    id: number
    title: string
    artist: string
    album: string
    duration: number
    coverUrl: string
    audioUrl: string
    lrc?: string
}

export interface LyricLine {
    time: number
    text: string
}

export interface songEntity {
    id: number
    cover: string
    title: string
    artist: string
    album: string
    duration: string
}

export interface pageEntity {
    current: number
    size: number
    total: number
}

export interface SortEntity {
    sortType: string,
    sortOrder: string
}

export interface SearchEntity {
    searchKey: string
}

export interface SourceEntity {
    type: string
    album?: string
    artist?: string
    id?: number
}

export interface AlbumEntity {
    albumName: string
    artistName: string
    albumCover?: string
    songCount: number
}

export interface ArtistEntity {
    artistName: string
    albumCover?: string
    songCount: number
}