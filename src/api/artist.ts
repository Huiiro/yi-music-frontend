import request from '@/utils/request.ts'

export const getArtistList = (sort: string, search: string) => request.get('/artist/list', {
    params: {
        sort,
        search
    }
})

export const getArtistSong = (artist: string) =>
    request.get('/artist/song', {
        params: {
            artist
        }
    })
