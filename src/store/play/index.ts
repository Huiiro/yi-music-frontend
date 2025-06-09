// src/store/index.ts
import {defineStore} from 'pinia';
import order from '@/assets/svg/control/order.svg';
import loop from '@/assets/svg/control/loop.svg';
import single from '@/assets/svg/control/single.svg';
import shuffle from '@/assets/svg/control/shuffle.svg';
import defaultCover from '@/assets/svg/default/default-cover.svg';

import type {AudioTrack, LyricLine} from '@/api/interface'
import {parseBlob} from "music-metadata-browser";
import {parseLRC} from "@/utils/lyricParser.ts";
import {getImageTopBottomColors} from "@/utils/color.ts";
import {useUIStore} from "@/store/ui";
import {shuffleArray} from "@/utils/array.ts";
import {fetchSongAudioBlob} from "@/api/song.ts";

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
        // 播放列表 (随机打乱)
        shuffleList: [] as AudioTrack[],
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

        // 切换到上一首
        prevTrack() {
            this.setPlaylistCurrentIndex(0);
        },

        // 切换到下一首
        nextTrack() {
            this.setPlaylistCurrentIndex(1);
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

        // 修改当前音频播放进度
        setCurrentTime(time: number) {
            if (this.audioElement) {
                this.audioElement.currentTime = time;
                this.currentTime = time;
            }
        },

        // 修改当前播放列表播放索引
        setPlaylistCurrentIndex(direction: number) {
            const total = this.playMode === 3 ? this.shuffleList.length : this.playList.length;
            if (total === 0) return;

            let newIndex = this.currentIndex;

            switch (this.playMode) {
                case 0: // 顺序播放
                    if (direction === 1 && newIndex < total - 1) {
                        newIndex++;
                    } else if (direction === 0 && newIndex > 0) {
                        newIndex--;
                    } else {
                        return;
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
                    break;

                case 3: // 随机播放
                    if (direction === 1) {
                        newIndex = (newIndex + 1) % total;
                    } else {
                        newIndex = (newIndex - 1 + total) % total;
                    }
                    break;
            }

            this.currentIndex = newIndex;
            this.setCurrentTrack().then();
        },

        // 根据歌曲ID更新播放列表索引
        updatePlaylistIndexBySongId(songId: number) {
            if (this.playMode === 3) {
                const index = this.shuffleList.findIndex(song => song.id === songId);
                if (index >= 0) {
                    this.currentIndex = index;
                }
            } else {
                const index = this.playList.findIndex(song => song.id === songId);
                if (index >= 0) {
                    this.currentIndex = index;
                }
            }
        },

        // 加载当前播放音乐
        async setCurrentTrack() {
            const list = this.playMode === 3 ? this.shuffleList : this.playList;
            const track = list[this.currentIndex];
            if (!track) return;

            try {
                const res = await fetch(`/api/audio/${track.id}`);
                const blob = await res.blob();

                await this.setAudioBlobAndPlay(blob, true)
            } catch (e) {
                console.error('加载音频失败', e);
            }
        },

        // 获取音频并播放
        async setAudioBlobAndPlay(blob: Blob, autoPlay: boolean) {
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
            if (autoPlay) {
                try {
                    this.play();
                } catch (e) {
                    this.pause();
                    console.warn('自动播放失败', e);
                }
            } else {
                // 非自动播放情况
                // 只适配刷新后丢失信息情况 此时 autoPlay 为 false
                this.audioElement.currentTime = this.currentTime;
            }
        },

        // 核心对外接口 根据歌曲ID 播放
        async playSongById(id: number, autoPlay: boolean) {
            const response = await fetchSongAudioBlob(id);
            // 更新播放音频
            await this.setAudioBlobAndPlay(response.data, autoPlay);
            // 更新播放列表索引
            this.updatePlaylistIndexBySongId(id);
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
                } else {
                    // 为默认封面设置单独背景样式
                    uiStore.setGradientColors('#454545', '#222222');
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
                    cover: coverUrl || defaultCover,
                    duration: meta.format.duration || 0,
                    lrc: lrcLines,
                    url: '',
                };
            } catch (err) {
                console.error('解析元数据出错:', err);
            }
        },

        // 设置播放列表
        setPlayList(audioList: AudioTrack[]) {
            this.playList = audioList;

            if (this.playMode === 3 && audioList.length > 0) {
                const current = audioList[0]; // 默认第一首为当前播放
                const rest = audioList.slice(1);
                const shuffled = shuffleArray(rest);
                this.shuffleList = [current, ...shuffled];
                this.currentIndex = 0;
            } else {
                // 正常模式下同步索引
                this.shuffleList = [];
                this.currentIndex = 0;
            }
        },

        // 清空播放列表
        clearPlayList() {
            this.playList = [];
            this.shuffleList = [];
            this.setAudioBlobAndPlay(new Blob(), true).then(() => {
            });
            this.currentIndex = 0;
        },

        // 从播放列表移除歌曲
        removeTrackFromPlaylist(id: number) {
            this.playList = this.playList.filter(t => t.id !== id);
            this.shuffleList = this.shuffleList.filter(t => t.id !== id);
            if (this.currentIndex >= this.playList.length) this.currentIndex = 0;
        },

        // 切换播放模式
        togglePlayMode() {
            const prevMode = this.playMode;
            this.playMode = (this.playMode + 1) % 4;

            // 切换为随机播放
            if (this.playMode === 3) {
                const currentTrack = this.playList[this.currentIndex];
                const remainingTracks = [...this.playList];
                remainingTracks.splice(this.currentIndex, 1);

                const shuffled = shuffleArray(remainingTracks);
                this.shuffleList = [currentTrack, ...shuffled];
                this.currentIndex = 0;
            }

            // 从随机切回顺序/循环/单曲播放
            if (prevMode === 3 && this.playMode !== 3) {
                const currentTrack = this.shuffleList[this.currentIndex];
                const indexInPlayList = this.playList.findIndex(track => track.id === currentTrack.id);
                if (indexInPlayList !== -1) {
                    this.currentIndex = indexInPlayList;
                } else {
                    console.warn('播放列表中找不到当前曲目，重置为0');
                    this.currentIndex = 0;
                }
            }
        },

        // 切换播放
        togglePlay() {
            if (this.isPlay)
                this.pause();
            else
                this.play();
        },

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

        // 检测是否需要重新初始化
        // 由于浏览器播放策略，设置为关闭自动播放
        async checkInit() {
            this.isPlay = false;
            if (this.playMode === 3) {
                // 随机模式
                await this.playSongById(this.shuffleList[this.currentIndex].id, false);
            } else {
                // 一般模式
                await this.playSongById(this.playList[this.currentIndex].id, false);
            }
        }
    },
    persist: true
});
