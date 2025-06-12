/**
 * 静态路由
 */
export const constRoutes = [
    {
        path: '/',
        redirect: '/song',
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    },
    {
        path: '/',
        name: 'layout',
        component: () => import('@/components/layout/Index.vue'),
        children: [
            {
                name: '404',
                path: '/404',
                meta: {},
                component: () => import('@/views/404.vue')
            },
            {
                path: '/song',
                name: "Song",
                meta: {title: '歌曲'},
                component: () => import('@/views/Song.vue')
            },
            {
                path: '/artist',
                name: "Artist",
                meta: {title: '歌手'},
                component: () => import('@/views/Artist.vue')
            },
            {
                path: '/artist/detail',
                name: "ArtistDetail",
                meta: {title: '歌手详情'},
                component: () => import('@/views/ArtistDetail.vue')
            },
            {
                path: '/album',
                name: "Album",
                meta: {title: '专辑'},
                component: () => import('@/views/Album.vue')
            },
            {
                path: '/album/detail',
                name: "AlbumDetail",
                meta: {title: '专辑详情'},
                component: () => import('@/views/AlbumDetail.vue')
            },
            {
                path: '/library/:id',
                name: 'Library',
                meta: {title: '曲库详情'},
                component: () => import('@/views/Library.vue'),
            },
            {
                path: '/playlist/:id',
                name: 'Playlist',
                meta: {title: '歌单详情'},
                component: () => import('@/views/Playlist.vue'),
            },
            {
                path: '/history/',
                name: 'History',
                meta: {title: '播放历史'},
                component: () => import('@/views/History.vue'),
            },
            {
                path: '/settings',
                name: 'Settings',
                meta: {title: '设置'},
                component: () => import('@/views/Settings.vue'),
            },
        ]
    }
]

/**
 * 放行白名单
 * 不需要认证 token
 */
export const whiteList = ["/"]

/**
 * 校验是否在白名单内
 * @param next
 */
export const checkInWhiteList = (next: string) => {
    return whiteList.includes(next);
}