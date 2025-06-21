<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { add2SongList, addSong2SongList } from '@/api/songList.ts'
import {useI18n} from 'vue-i18n'
import defaultCover from '@/assets/svg/default/default-cover.svg'

const props = defineProps<{
  songId: number
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue',  'close'])
const {t} = useI18n()
const visible = ref(props.modelValue)
watch(() => props.modelValue, val => (visible.value = val))
watch(visible, val => emit('update:modelValue', val))

interface SongListInVo {
  songListId: number
  userId: number
  songListName: string
  songListCover: string
  songListDesc: string
  isInSongList: boolean
}

const songLists = ref<SongListInVo[]>([])

const fetchSongLists = async () => {
  try {
    const { data } = await add2SongList(props.songId)
    songLists.value = data
  } catch {
    ElMessage.error(t('get_song_list_fail'))
  }
}

const addToList = async (list: SongListInVo) => {
  if (list.isInSongList) return
  try {
    const { data } = await addSong2SongList(props.songId, list.songListId)
    if (data) {
      list.isInSongList = true
      ElMessage.success(t('add_success'))
      emit('close')
    } else {
      ElMessage.warning(t('add_fail_exists'))
    }
  } catch {
    ElMessage.error(t('add_fail_unknown'))
  }
}

watch(visible, (val) => {
  if (val) fetchSongLists()
})
</script>

<template>
  <el-dialog v-model="visible" :title="t('add_song_list_dialog_header')" width="360px">
    <div class="flex flex-col gap-2 max-h-96 overflow-y-auto">
      <div
          v-for="list in songLists"
          :key="list.songListId"
          class="flex items-center p-2 bg-bg-light rounded
          hover:bg-bg-hover cursor-pointer text-text"
          @click="addToList(list)"
      >
        <img
            :src="list.songListCover || defaultCover"
            alt=""
            class="w-8 h-8 rounded object-cover mr-3"
        />
        <div class="flex-1 overflow-hidden">
          <div class="font-medium text-sm truncate">
            {{ list.songListName }}
          </div>
        </div>
        <div
            v-if="list.isInSongList"
            class="text-xs text-green-400 ml-2 whitespace-nowrap"
        >
          {{t('added')}}
        </div>
      </div>
    </div>

    <template #footer>
      <button
          v-if="false"
          @click="visible = false"
          class="px-4 py-1.5 rounded bg-bg-hover text-text text-sm hover:bg-bg-hover-light transition"
      >
        {{ t('close_alt') }}
      </button>
    </template>
  </el-dialog>
</template>
