import request from '@/utils/request.ts'
import type {SongListEntity} from '@/api/interface.ts'

export const getSongListCollection = () =>
    request.get('/songList/list')

export const getSongListSingleton = (id: number) =>
    request.get(`/songList/${id}`)

export const getSongListItems = (id: number) =>
    request.get(`/songList/items/${id}`)

export const createSongListApi = (songList: SongListEntity) =>
    request.post('/songList/create', songList)

export const updateSongListApi = (songList: SongListEntity) =>
    request.post('/songList/update', songList)

export const deleteSongListApi = (ids: Array<number>) =>
    request.post('/songList/delete', ids)