<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import {usePlayStore} from '@/store/play'
import {useSettingsStore} from '@/store/settings'

import SettingsGroup from '@/components/settings/SettingsGroup.vue'
import SettingsItem from '@/components/settings/SettingsItem.vue'
import LangSwitcher from '@/components/layout/header/components/LangSwitcher.vue'
import SleepTimer from '@/components/settings/components/SleepTimer.vue'
import ShortcutInput from '@/components/settings/components/ShortcutInput.vue'

const {t} = useI18n()
const playStore = usePlayStore()
const settingsStore = useSettingsStore()
</script>

<template>
  <div class="w-full mx-auto p-4 text-white">
    <!-- Group.账户管理 -->
    <SettingsGroup :title="t('settings_group_account')">
      <SettingsItem :label="t('settings_item_username')">
        <template #control>

        </template>
      </SettingsItem>
    </SettingsGroup>

    <!-- Group.播放设置 -->
    <SettingsGroup :title="t('settings_group_play')">
      <!-- 启用顶部歌词 -->
      <SettingsItem :label="t('settings_item_enable_top_lyrics')">
        <template #control>
          <el-switch v-model="settingsStore.showTopLyrics"/>
        </template>
      </SettingsItem>
      <!-- 启用底部控制栏区分 -->
      <SettingsItem :label="t('settings_item_enable_bottom_control_distinct')">
        <template #control>
          <el-switch v-model="settingsStore.distinctFromBottomControl"/>
        </template>
      </SettingsItem>
      <!-- 启用定时播放 -->
      <SettingsItem :label="t('settings_item_enable_sleep_timer')">
        <template #control>
          <sleep-timer/>
        </template>
      </SettingsItem>
      <!-- 智能切换播放列表 -->
      <SettingsItem :label="t('settings_item_switch_playlist')"
                    :description="t('settings_item_desc_switch_playlist')">
        <template #control>
          <el-switch v-model="playStore.switchPlaylist"/>
        </template>
      </SettingsItem>
    </SettingsGroup>

    <!-- Group.通用设置 -->
    <SettingsGroup :title="t('settings_group_general')">
      <!-- 语言设置 -->
      <SettingsItem :label="t('settings_item_language')">
        <template #control>
          <LangSwitcher mode="full"/>
        </template>
      </SettingsItem>
      <!-- 暗色模式 -->
      <SettingsItem :label="t('settings_item_dark')">
        <template #control>
          <el-switch v-model="settingsStore.darkMode"/>
        </template>
      </SettingsItem>
    </SettingsGroup>

    <!-- Group.快捷键设置 -->
    <SettingsGroup :title="t('settings_group_shortcut_keys')">
      <!-- 播放/暂停 -->
      <SettingsItem :label="t('settings_item_play_pause')">
        <template #control>
          <ShortcutInput action="play" />
        </template>
      </SettingsItem>
      <!-- 上一首 -->
      <SettingsItem :label="t('settings_item_prev')">
        <template #control>
          <ShortcutInput action="prev" />
        </template>
      </SettingsItem>
      <!-- 下一首 -->
      <SettingsItem :label="t('settings_item_next')">
        <template #control>
          <ShortcutInput action="next" />
        </template>
      </SettingsItem>
      <!-- 后退 -->
      <SettingsItem :label="t('settings_item_min_time')">
        <template #control>
          <ShortcutInput action="dt" />
        </template>
      </SettingsItem>
      <!-- 快进 -->
      <SettingsItem :label="t('settings_item_plus_time')">
        <template #control>
          <ShortcutInput action="it" />
        </template>
      </SettingsItem>
      <!-- 增加音量 -->
      <SettingsItem :label="t('settings_item_plus_volume')">
        <template #control>
          <ShortcutInput action="iv" />
        </template>
      </SettingsItem>
      <!-- 减少音量 -->
      <SettingsItem :label="t('settings_item_min_volume')">
        <template #control>
          <ShortcutInput action="dv" />
        </template>
      </SettingsItem>
      <!-- 切换播放方式 -->
      <SettingsItem :label="t('settings_item_toggle_play_mode')">
        <template #control>
          <ShortcutInput action="tp" />
        </template>
      </SettingsItem>
    </SettingsGroup>

    <!-- Group.本地文件管理 -->
    <SettingsGroup :title="t('settings_group_local_files')">
      <!-- 本地文件路径 -->
      <SettingsItem :label="t('settings_item_local_file_path')">
        <template #control>
        </template>
      </SettingsItem>
      <!-- 清空全部文件 -->
      <SettingsItem :label="t('settings_item_clear_all_files')">
        <template #control>
        </template>
      </SettingsItem>
    </SettingsGroup>
  </div>
</template>
