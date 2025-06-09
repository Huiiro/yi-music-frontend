import request from '@/utils/request.ts';
import qs from 'qs';
import type {pageEntity, songEntity} from "@/api/interface.ts";


/**
 * 获取歌曲列表
 * @param song
 * @param page
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
    });

/**
 * 获取所有歌曲至播放列表
 */
export const getSongList2Playlist = () =>
    request.get('/song/playlist/all');

/**
 * 获取歌曲
 */
export const fetchSongAudioBlob = (id: number) =>
    request.get(`audio/${id}`, {
        responseType: 'blob'
    })