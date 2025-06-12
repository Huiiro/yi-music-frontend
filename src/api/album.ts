import request from '@/utils/request.ts'

export const getAlbumList = () => request.get('/album/list')

export const getAlbumSong = (albumName: string, artistName: string) =>
    request.get('/album/song', {
        params: {
            albumName,
            artistName
        }
    })
