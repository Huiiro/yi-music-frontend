import request from '@/utils/request.ts'

export const getArtistList = () => request.get('/artist/list')

export const getArtistSong = (artist: string) =>
    request.get('/artist/song', {
        params: {
            artist
        }
    })
