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
