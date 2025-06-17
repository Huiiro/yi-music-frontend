import request from '@/utils/request.ts'
import type {LibraryEntity} from '@/api/interface.ts'

export const getLibraryCollection = () =>
    request.get('/library/list')

export const getLibrarySingleton = (id: number) =>
    request.get(`/library/${id}`)

export const getLibraryItems = (id: number) =>
    request.get(`/library/items/${id}`)

export const createLibraryApi = (library: LibraryEntity) =>
    request.post('/library/create', library)

export const updateLibraryApi = (library: LibraryEntity) =>
    request.post('/library/update', library)

export const deleteLibraryApi = (ids: Array<number>) =>
    request.post('/library/delete', ids)