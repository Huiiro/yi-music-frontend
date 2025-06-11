import request from '@/utils/request.ts'
import qs from 'qs'
import type {pageEntity, SearchEntity, songEntity, SortEntity, SourceEntity} from '@/api/interface.ts'


/**
 * 获取歌曲列表
 * @param song
 * @param page
 * @deprecated
 */
export const getSongList = (song: songEntity | null, page: pageEntity) =>
    request.get('/song/list', {
        params: {
            ...(song || {}),
            ...page
        },
        paramsSerializer: function (params) {
            return qs.stringify(params, {arrayFormat: 'comma'})
        }
    })

/**
 * 获取所有歌曲至播放列表
 */
export const getSongList2Playlist = () =>
    request.get('/song/playlist/all')

/**
 * 聚合排序查询
 * @param sortEntity
 * @param sourceEntity
 * @param page
 */
export const aggregationSort = (sortEntity: SortEntity | null,
                                sourceEntity: SourceEntity | null,
                                page: pageEntity) =>
    request.get('song/aggregation/sort', {
        params: {
            ...(sortEntity || {}),
            ...(sourceEntity || {}),
            ...page
        }
    })

/**
 * 聚合排序查询
 * @param searchEntity
 * @param sourceEntity
 * @param page
 */
export const aggregationSearch = (searchEntity: SearchEntity | null,
                                  sourceEntity: SourceEntity | null,
                                  page: pageEntity) =>
    request.get('song/aggregation/search', {
        params: {
            ...(searchEntity || {}),
            ...(sourceEntity || {}),
            ...page
        }
    })

/**
 * 获取歌曲
 */
export const fetchSongAudioBlob = (id: number) =>
    request.get(`audio/${id}`, {
        responseType: 'blob'
    })
