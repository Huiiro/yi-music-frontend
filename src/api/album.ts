import request from '@/utils/request.ts'

export const getAlbumList = (sort: string, search: string) => request.get('/album/list', {
    params: {
        sort,
        search
    }
})

export const getAlbumSong = (albumName: string, artistName: string) =>
    request.get('/album/song', {
        params: {
            albumName,
            artistName
        }
    })
