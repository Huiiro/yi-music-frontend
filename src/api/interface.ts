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

export const demoData: AudioTrack[] = [
    {
        id: 1,
        title: 'song1',
        artist: 'artist1',
        album: 'album1',
        duration: 240,
        coverUrl: 'string2',
        audioUrl: 'string2',
        lrc: ''
    }, {
        id: 2,
        title: 'song2',
        artist: 'artist2',
        album: 'album2',
        duration: 240,
        coverUrl: 'string33',
        audioUrl: 'string33',
        lrc: ''
    }, {
        id: 3,
        title: 'song2',
        artist: 'artist2',
        album: 'album2',
        duration: 240,
        coverUrl: 'string33',
        audioUrl: 'string33',
        lrc: ''
    }
]