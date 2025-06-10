// src/types/track.ts

export interface AudioTrack {
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: number;
    coverUrl: string;
    audioUrl: string;
    lrc?: string;
}

export interface LyricLine {
    time: number;
    text: string;
}

export interface songEntity {
    id: number;
    cover: string;
    title: string;
    artist: string;
    album: string;
    duration: string;
}

export interface pageEntity {
    current: number;
    size: number;
    total: number;
}

export interface SortEntity {
    sortType: string,
    sortOrder: string
}

export interface SearchEntity {

}

export interface SourceEntity {

}