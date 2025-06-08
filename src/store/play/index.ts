// src/store/index.ts
import {defineStore} from 'pinia';
import order from '@/assets/svg/control/order.svg';
import loop from '@/assets/svg/control/loop.svg';
import single from '@/assets/svg/control/single.svg';
import shuffle from '@/assets/svg/control/shuffle.svg';

import type {AudioTrack} from '@/api/interface'
import {parseBlob} from "music-metadata-browser";
import {type LyricLine, parseLRC} from "@/utils/lyricParser.ts";
import {getImageTopBottomColors} from "@/utils/color.ts";

import {useUIStore} from "@/store/ui";

const uiStore = useUIStore();

export const usePlayStore = defineStore('play', {
    state: () => ({
        // 是否播放
        isPlay: false,
        showPlayer: false,
        // 当前播放进度
        currentTime: 0,
        // 当前歌词索引
        currentLyricIndex: 0,
        // 当前播放列表索引
        currentIndex: 0,
        // 当前播放歌曲信息
        currentTrack: {
            title: '未知标题',
            artist: '未知艺术家',
            album: '',
            cover: '',
            duration: 240,
            lrc: [] as LyricLine[],
            url: '',
        },
        // 播放方式 0 顺序，1 列表，2 单曲， 3 随机
        playMode: 0,
        // 播放列表
        playList: [] as AudioTrack[],
        // 音量
        volume: 50,
        tempVolume: 50,
        muted: false,
        // 音频
        audioBlob: null as Blob | null,
        audioUrl: null as string | null,
        audioElement: null as HTMLAudioElement | null,

    }),
    getters: {
        playModeIcon(state) {
            const icons = [order, loop, single, shuffle];
            return icons[state.playMode] || order;
        },
        playModeTitle(state) {
            const titles = ['顺序播放', '列表循环', '单曲循环', '随机播放'];
            return titles[state.playMode] || '顺序播放';
        },
        effectiveVolume(state) {
            return state.muted ? 0 : state.volume / 100;
        }
    },
    actions: {
        _onTimeUpdate() {
            if (this.audioElement) {
                this.currentTime = this.audioElement.currentTime || 0;
                this.currentTrack.duration = this.audioElement.duration || 0;
            }
        },
        _onTrackEnded() {
            this.nextTrack();
        },
        _onTimeUpdateBound() {
            // 初始化为空
        },
        _onTrackEndedBound() {
            // 初始化为空
        },


        /**
         * audios
         */
        // 清理音频
        clearAudio() {
            if (this.audioElement && typeof this.audioElement.pause === 'function') {
                this.audioElement.pause();
                this.audioElement.src = '';
                this.audioElement.load();

                this.audioElement.removeEventListener('timeupdate', this._onTimeUpdateBound);
                this.audioElement.removeEventListener('ended', this._onTrackEndedBound);
                this.audioElement = null;
            }

            if (this.audioUrl) {
                URL.revokeObjectURL(this.audioUrl);
                this.audioUrl = null;
            }

            this.audioBlob = null;
        },
        // 获取音频并播放
        async setAudioBlob(blob: Blob) {
            // 清理上一首音频
            this.clearAudio();

            // 设置Audio
            this.audioBlob = blob;
            this.audioUrl = URL.createObjectURL(blob);

            this.audioElement = new Audio();
            this.audioElement.src = this.audioUrl;
            this.audioElement.volume = this.effectiveVolume;

            // 监听播放进度
            this._onTimeUpdateBound = this._onTimeUpdate.bind(this);
            this.audioElement.addEventListener('timeupdate', this._onTimeUpdateBound);

            // 监听播放完成
            this._onTrackEndedBound = this._onTrackEnded.bind(this);
            this.audioElement.addEventListener('ended', this._onTrackEndedBound);

            // 读取Metadata信息
            await this.parseMetadata(blob);

            // 自动播放
            try {
                this.play();
            } catch (e) {
                console.warn('自动播放失败', e);
            }
        },
        // 获取音频元数据
        async parseMetadata(blob: Blob) {
            try {
                const meta = await parseBlob(blob);
                const picture = meta.common.picture?.[0];
                const coverUrl = picture
                    ? URL.createObjectURL(new Blob([picture.data.buffer], {type: picture.format}))
                    : '';

                if (coverUrl) {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = coverUrl;

                    await new Promise<void>((resolve, reject) => {
                        img.onload = () => {
                            const {topColor, bottomColor} = getImageTopBottomColors(img);
                            uiStore.setGradientColors(topColor, bottomColor);
                            resolve();
                        };
                        img.onerror = reject;
                    });
                }

                let rawLyrics =
                    meta.common.lyrics?.[0] ||
                    meta.native['ID3v2.3']?.find(tag => tag.id === 'USLT')?.value?.text ||
                    meta.native['ID3v2.4']?.find(tag => tag.id === 'USLT')?.value?.text ||
                    meta.native['vorbis']?.find(tag => tag.id.toUpperCase() === 'LYRICS')?.value ||
                    meta.native['vorbis']?.find(tag => tag.id.toUpperCase() === 'UNSYNCEDLYRICS')?.value ||
                    '';

                const lrcLines = parseLRC(rawLyrics);

                if (!lrcLines || lrcLines.length === 0) {
                    lrcLines.push({
                        time: 0,
                        text: '暂无歌词',
                    });
                }

                this.currentTrack = {
                    title: meta.common.title || '未知标题',
                    artist: meta.common.artist || '未知艺术家',
                    album: meta.common.album || '',
                    cover: coverUrl,
                    duration: meta.format.duration || 0,
                    lrc: lrcLines,
                    url: '',
                };
            } catch (err) {
                console.error('解析元数据出错:', err);
            }
        },
        // 播放音乐
        playTrack(direction: number) {
            const total = this.playList.length;
            if (total === 0) return;

            let newIndex = this.currentIndex;

            switch (this.playMode) {
                case 0: // 顺序播放
                    if (direction === 1 && newIndex < total - 1) {
                        newIndex++;
                    } else if (direction === 0 && newIndex > 0) {
                        newIndex--;
                    } else {
                        return; // 播放完毕或无上一首
                    }
                    break;

                case 1: // 列表循环
                    if (direction === 1) {
                        newIndex = (newIndex + 1) % total;
                    } else {
                        newIndex = (newIndex - 1 + total) % total;
                    }
                    break;

                case 2: // 单曲循环
                    // 不变，newIndex = this.currentIndex
                    break;

                case 3: // 随机播放
                    do {
                        newIndex = Math.floor(Math.random() * total);
                    } while (newIndex === this.currentIndex && total > 1); // 避免重复
                    break;
            }

            this.currentIndex = newIndex;
            this.loadCurrentTrack().then();
        },
        // 加载音乐
        async loadCurrentTrack() {
            const track = this.playList[this.currentIndex];
            if (!track) return;

            try {
                const res = await fetch(`/api/audio/${track.id}`);
                const blob = await res.blob();

                // 设置当前播放
                await this.setAudioBlob(blob)
            } catch (e) {
                console.error('加载音频失败', e);
            }
        },

        /**
         * plays
         */
        // 切换播放模式
        togglePlayMode() {
            this.playMode = (this.playMode + 1) % 4;
        },
        // 切换到上一首
        prevTrack() {
            this.playTrack(0);
        },
        // 切换到下一首
        nextTrack() {
            this.playTrack(1);
        },
        // 切换播放
        togglePlay() {
            if (this.isPlay)
                this.pause();
            else
                this.play();
        },
        // 播放音频
        play() {
            if (this.audioElement) {
                this.audioElement.play();
                this.isPlay = true;
            }
        },
        // 暂停音频
        pause() {
            if (this.audioElement) {
                this.audioElement.pause();
                this.isPlay = false;
            }
        },
        // 修改播放进度
        setCurrentTime(time: number) {
            if (this.audioElement) {
                this.audioElement.currentTime = time;
                this.currentTime = time;
            }
        },
        // 设置播放列表
        setPlayList(audioList: AudioTrack[]) {
            this.playList = audioList;
        },

        /**
         * volumes
         */
        // 切换静音
        toggleMute() {
            this.muted = !this.muted;

            if (this.muted)
                this.volume = 0;
            else
                this.volume = this.tempVolume;

            if (this.audioElement) {
                this.audioElement.volume = this.effectiveVolume;
            }
        },
        // 修改音量
        setVolume(value: number) {
            this.volume = value;
            this.tempVolume = value;

            if (value > 0) this.muted = false;

            if (this.audioElement) {
                this.audioElement.volume = this.effectiveVolume;
            }
        },
        // 修改静音
        setMuted(flag: boolean) {
            this.muted = flag;
        },

    },
    persist: true
});
