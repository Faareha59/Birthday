import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Wind, RotateCcw, Play, Pause, Volume2, VolumeX, Music, Upload } from 'lucide-react';
import { BirthdayConfig } from '../types';
import { HAMSTER_IMAGES } from '../utils/constants';
import { sound } from '../utils/audio';
import { saveSongToDB, loadSongFromDB } from '../utils/audioStorage';
import {
  CuteCakeEmoji,
  CuteGiftEmoji,
  CuteBalloonEmoji,
  CuteBalloonClusterEmoji,
  CuteSparkleEmoji,
  CutePartyEmoji,
} from './CuteEmojis';

interface HamsterBirthdayStageProps {
  config: BirthdayConfig;
  onUpdateConfig?: (newConfig: BirthdayConfig) => void;
}

interface SmokeParticle {
  id: number;
  candleIdx: number;
  startX: number;
}

export const HamsterBirthdayStage: React.FC<HamsterBirthdayStageProps> = () => {
  // Navigation stage: 'prompt' (Hamster + want to accept? Yes/No) or 'cake' (Cake + blow the candles + confetti + music)
  const [stage, setStage] = useState<'prompt' | 'cake'>('prompt');

  // Music playback state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [songName, setSongName] = useState<string | null>(null);
  const [hasLoadedSong, setHasLoadedSong] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Runaway "No" button state
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [noButtonText, setNoButtonText] = useState('no ❌');

  // Cake stage candles state (5 colorful birthday candles)
  const [candles, setCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [blowingIdx, setBlowingIdx] = useState<number | null>(null);
  const [isGustActive, setIsGustActive] = useState(false);
  const [smokeList, setSmokeList] = useState<SmokeParticle[]>([]);
  const [isPointerBlowing, setIsPointerBlowing] = useState(false);

  const cakeContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize and load saved custom song from IndexedDB on mount
  useEffect(() => {
    loadSongFromDB().then((stored) => {
      if (stored && stored.dataUrl) {
        sound.setCustomAudioSource(stored.dataUrl);
        setSongName(stored.name || 'Your Song');
        setHasLoadedSong(true);
      }
    });
  }, []);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      if (result) {
        await saveSongToDB(result, file.name);
        sound.setCustomAudioSource(result);
        setSongName(file.name);
        setHasLoadedSong(true);
        sound.playPop();
        sound.startBirthdayBGM();
        setIsPlayingMusic(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleMusicPlay = () => {
    if (isPlayingMusic) {
      sound.stopBirthdayBGM();
      setIsPlayingMusic(false);
    } else {
      sound.startBirthdayBGM();
      setIsPlayingMusic(true);
    }
  };

  const toggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const funnyNoTexts = [
    'no ❌',
    'wait no! 🙈',
    'cant click me! 🏃‍♂️💨',
    'are u sure?! 🐹',
    'too slow! ✨',
    'nuh-uh! 😜',
    'wrong button! 😂',
    'try again! 🏃‍♀️',
    'yes is over there 👉',
  ];

  // Run away when trying to click or hover "No"
  const handleNoRunaway = () => {
    sound.playHamsterSqueak();

    // Pick random positions within bounds
    const randomX = (Math.random() - 0.5) * 260;
    const randomY = (Math.random() - 0.5) * 160;

    setNoPosition({ x: randomX, y: randomY });
    const nextCount = noHoverCount + 1;
    setNoHoverCount(nextCount);
    setNoButtonText(funnyNoTexts[nextCount % funnyNoTexts.length]);
  };

  // Click "Yes" -> go to cake stage, trigger confetti and play Happy Birthday song
  const handleAcceptYes = () => {
    sound.playPop();
    sound.playHamsterSqueak();
    setStage('cake');

    // Start Happy Birthday song right away
    sound.startBirthdayBGM();
    setIsPlayingMusic(true);

    // Big confetti blast
    triggerConfetti();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6, x: 0.25 },
      colors: ['#e58e26', '#b96a1e', '#78a287', '#d97d54', '#f1c40f', '#e84393', '#00cec9'],
    });
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6, x: 0.75 },
      colors: ['#e58e26', '#b96a1e', '#78a287', '#d97d54', '#f1c40f', '#6c5ce7', '#fd79a8'],
    });
  };

  // Add smoke wisps for a blown candle
  const spawnSmoke = (idx: number) => {
    const newSmoke: SmokeParticle = {
      id: Date.now() + Math.random(),
      candleIdx: idx,
      startX: idx,
    };
    setSmokeList((prev) => [...prev.slice(-10), newSmoke]);
  };

  // Blow single candle with animated gust reaction
  const blowCandle = (idx: number) => {
    if (!candles[idx]) return;

    setBlowingIdx(idx);
    sound.playBlowSound();
    spawnSmoke(idx);

    setTimeout(() => {
      setCandles((prev) => {
        const updated = [...prev];
        updated[idx] = false;
        if (updated.every((c) => !c)) {
          handleAllCandlesBlown();
        }
        return updated;
      });
      setBlowingIdx(null);
    }, 140);
  };

  // Creative gust blow: blows candles one-by-one in an animated sweep wave
  const blowAllInWave = () => {
    if (isGustActive) return;
    setIsGustActive(true);
    sound.playBlowSound();

    candles.forEach((isLit, idx) => {
      if (isLit) {
        setTimeout(() => {
          setBlowingIdx(idx);
          sound.playBlowSound();
          spawnSmoke(idx);

          setTimeout(() => {
            setCandles((prev) => {
              const updated = [...prev];
              updated[idx] = false;
              if (updated.every((c) => !c)) {
                handleAllCandlesBlown();
              }
              return updated;
            });
            setBlowingIdx(null);
          }, 120);
        }, idx * 160);
      }
    });

    setTimeout(() => {
      setIsGustActive(false);
    }, candles.length * 170 + 200);
  };

  const handleAllCandlesBlown = () => {
    sound.playHamsterSqueak();
    sound.playAirhorn();
    triggerConfetti();
    setTimeout(() => {
      triggerConfetti();
    }, 350);
  };

  const relightCandles = () => {
    sound.playPop();
    setCandles([true, true, true, true, true]);
    setSmokeList([]);
  };

  // Interactive swipe/hover across candles
  const handlePointerEnterCandle = (idx: number) => {
    if (isPointerBlowing && candles[idx]) {
      blowCandle(idx);
    }
  };

  // Clean up BGM on unmount
  useEffect(() => {
    return () => {
      sound.stopBirthdayBGM();
    };
  }, []);

  const allBlown = candles.every((c) => !c);

  const candleColors = [
    { stick: 'bg-gradient-to-t from-[#8c6d48] to-[#c5a880]', flame: 'from-[#e17055] via-[#fdcb6e] to-[#ffffff]' },
    { stick: 'bg-gradient-to-t from-[#c59b27] to-[#f4d06f]', flame: 'from-[#e17055] via-[#fdcb6e] to-[#ffffff]' },
    { stick: 'bg-gradient-to-t from-[#a6593b] to-[#e08e6d]', flame: 'from-[#e17055] via-[#fdcb6e] to-[#ffffff]' },
    { stick: 'bg-gradient-to-t from-[#c59b27] to-[#f4d06f]', flame: 'from-[#e17055] via-[#fdcb6e] to-[#ffffff]' },
    { stick: 'bg-gradient-to-t from-[#8c6d48] to-[#c5a880]', flame: 'from-[#e17055] via-[#fdcb6e] to-[#ffffff]' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center select-none text-[#2c221a] font-crayon">
      {/* Hidden File Input for Custom Song Selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {/* ================= PAGE 1: PROMPT ("WANT TO ACCEPT?") ================= */}
        {stage === 'prompt' && (
          <motion.div
            key="prompt-page"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full bg-[#fdfbf7] border-2 border-[#d8c7b3] rounded-3xl p-6 sm:p-9 shadow-sm text-center relative crayon-border"
          >
            {/* Header Badge & Title */}
            <div className="mb-4 flex flex-col items-center justify-center">
              <span className="text-sm font-crayon font-bold text-[#b96a1e] bg-[#f5ede4] px-4 py-1 rounded-full mb-2 crayon-border">
                special celebration
              </span>
              <h1 className="text-3xl sm:text-5xl font-crayon font-bold text-[#2c221a] tracking-wide crayon-text leading-tight">
                happy birthday twin!
              </h1>
            </div>

            {/* Hamster Card */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="relative w-64 sm:w-72 aspect-[4/5] bg-white border-2 border-[#d8c7b3] rounded-2xl p-3 flex flex-col items-center justify-center shadow-xs crayon-border">
                <div className="w-full flex items-center justify-center pb-2 text-base font-crayon font-bold text-[#b96a1e]">
                  for twin
                </div>
                <div className="w-full flex-1 relative overflow-hidden rounded-xl bg-[#faf7f2] flex items-center justify-center border border-[#eee7dd]">
                  <img
                    src={HAMSTER_IMAGES.twinDoodle}
                    alt="Happy Birthday Hamster"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>
            </div>

            {/* Prompt Question */}
            <div className="mt-5 mb-6">
              <p className="text-2xl sm:text-3xl font-crayon font-bold text-[#2c221a] crayon-text">
                want to accept?
              </p>
            </div>

            {/* Yes & Runaway No Buttons */}
            <div className="relative h-18 flex items-center justify-center gap-4">
              {/* YES BUTTON */}
              <button
                type="button"
                onClick={handleAcceptYes}
                className="px-8 py-3.5 rounded-2xl bg-[#2c221a] hover:bg-[#3d3025] text-[#fdfbf7] font-crayon font-bold text-xl sm:text-2xl shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer flex items-center gap-2 z-10 crayon-border"
              >
                <span>yes!</span>
                <span className="text-base">✨</span>
              </button>

              {/* RUNAWAY NO BUTTON */}
              <motion.button
                type="button"
                onMouseEnter={handleNoRunaway}
                onTouchStart={handleNoRunaway}
                onPointerDown={handleNoRunaway}
                onClick={(e) => {
                  e.preventDefault();
                  handleNoRunaway();
                }}
                animate={{
                  x: noPosition.x,
                  y: noPosition.y,
                  rotate: noHoverCount % 2 === 0 ? 4 : -4,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="px-6 py-3 rounded-2xl bg-white hover:bg-[#faf5ed] border-2 border-[#d8c7b3] text-[#7a6452] font-crayon font-bold text-lg sm:text-xl shadow-xs cursor-pointer select-none whitespace-nowrap crayon-border"
              >
                <span>{noButtonText}</span>
              </motion.button>
            </div>

            {/* One-click Audio file loader if no song stored in browser yet */}
            {!hasLoadedSong && (
              <div className="mt-6 pt-4 border-t-2 border-dashed border-[#ece3d6] flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-full bg-white hover:bg-[#faf5ed] border border-[#d8c7b3] text-sm font-crayon text-[#2c221a] hover:text-[#b96a1e] font-bold cursor-pointer flex items-center gap-2 shadow-2xs transition-colors"
                >
                  <Music className="w-4 h-4 text-[#b96a1e]" />
                  <span>choose custom song file</span>
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ================= PAGE 2: CAKE + BLOW THE CANDLES ================= */}
        {stage === 'cake' && (
          <motion.div
            key="cake-page"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full bg-[#fdfbf7] border-2 border-[#d8c7b3] rounded-3xl p-6 sm:p-9 shadow-sm text-center relative overflow-hidden crayon-border"
            onPointerDown={() => setIsPointerBlowing(true)}
            onPointerUp={() => setIsPointerBlowing(false)}
            onPointerLeave={() => setIsPointerBlowing(false)}
          >
            {/* Top Header */}
            <div className="mb-3">
              <h2 className="text-3xl sm:text-5xl font-crayon font-bold text-[#2c221a] tracking-wide crayon-text leading-tight">
                happy birthday twin!
              </h2>
              <p className="text-base sm:text-xl font-doodle text-[#b96a1e] font-bold mt-1">
                {allBlown ? 'all candles blown ✨' : 'tap or blow the candles'}
              </p>
            </div>

            {/* DEDICATED HAPPY BIRTHDAY SONG PLAYER CARD */}
            <div className="my-3.5 bg-white/95 border-2 border-[#e0d3c1] rounded-2xl p-3 sm:p-3.5 shadow-2xs flex items-center justify-between gap-3 text-left crayon-border">
              {/* Song info and visualizer */}
              <div className="flex items-center gap-3">
                <div
                  onClick={toggleMusicPlay}
                  className="w-11 h-11 rounded-full bg-[#2c221a] hover:bg-[#3d3025] text-white flex items-center justify-center cursor-pointer shadow-xs transition-transform active:scale-95 shrink-0"
                  title={isPlayingMusic ? 'Pause song' : 'Play Song'}
                >
                  {isPlayingMusic ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </div>

                <div className="flex flex-col">
                  <div className="font-crayon font-bold text-base text-[#2c221a] flex items-center gap-2">
                    <span>{songName ? songName : 'Birthday Melody 🎶'}</span>
                    {isPlayingMusic && (
                      <span className="flex items-center gap-0.5 text-xs text-[#b96a1e]">
                        <span className="w-1 h-3 bg-[#b96a1e] rounded-full animate-bounce" />
                        <span className="w-1 h-4 bg-[#e58e26] rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1 h-2 bg-[#78a287] rounded-full animate-bounce [animation-delay:0.3s]" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-doodle text-[#7a6452]">
                    {!hasLoadedSong ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#b96a1e] hover:text-[#2c221a] underline cursor-pointer font-bold flex items-center gap-1 mt-0.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Select your song file to play</span>
                      </button>
                    ) : (
                      <span>{isPlayingMusic ? 'Now Playing 🎵' : 'Paused • Tap to play'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sound & Mute controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2.5 rounded-xl bg-[#faf5ee] hover:bg-[#f0e6d8] border border-[#e8dfd5] text-[#5e4d3f] cursor-pointer transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-[#d63031]" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Cake Section with Clean Modern Flame Glows */}
            <div
              ref={cakeContainerRef}
              className="relative my-6 sm:my-8 flex flex-col items-center justify-center select-none"
            >
              {/* Wind Gust Wave Animation Effect */}
              <AnimatePresence>
                {isGustActive && (
                  <motion.div
                    initial={{ x: -180, opacity: 0 }}
                    animate={{ x: 180, opacity: [0, 1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                    className="absolute top-4 z-30 pointer-events-none flex items-center gap-3 text-2xl text-[#8c6d48]/70 font-medium"
                  >
                    <span className="h-1 w-32 bg-gradient-to-r from-transparent via-[#8c6d48] to-transparent rounded-full blur-2xs" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rising Wispy Smoke Particles */}
              <AnimatePresence>
                {smokeList.map((smoke) => {
                  const xOffsets = [-80, -40, 0, 40, 80];
                  const posX = xOffsets[smoke.candleIdx] || 0;
                  return (
                    <motion.div
                      key={smoke.id}
                      initial={{ opacity: 0.8, y: 0, x: posX, scale: 0.6, rotate: 0 }}
                      animate={{
                        opacity: 0,
                        y: -50,
                        x: posX + (Math.random() * 20 - 10),
                        scale: 1.6,
                        rotate: (Math.random() - 0.5) * 30,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="absolute top-2 z-30 pointer-events-none flex flex-col items-center"
                    >
                      <div className="w-3 h-3 rounded-full bg-[#bdc3c7]/60 blur-xs" />
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <div className="relative w-72 sm:w-84 flex flex-col items-center">
                {/* 5 CANDLES ON TOP OF CAKE */}
                <div className="flex items-end justify-center gap-4 sm:gap-5 mb-[-4px] z-20">
                  {candles.map((isLit, idx) => {
                    const isBlowingThis = blowingIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => blowCandle(idx)}
                        onPointerEnter={() => handlePointerEnterCandle(idx)}
                        className="flex flex-col items-center cursor-pointer group p-1 transition-transform active:scale-90"
                        title="Click or swipe to blow candle"
                      >
                        {/* FLAME / BLOWING ANIMATION */}
                        {isLit ? (
                          <motion.div
                            animate={
                              isBlowingThis || (isGustActive && idx <= (blowingIdx ?? -1))
                                ? {
                                    scaleX: 1.5,
                                    scaleY: 0.4,
                                    rotate: 45,
                                    x: 6,
                                    opacity: 0.4,
                                  }
                                : {
                                    scale: [1, 1.18, 0.96, 1.12, 1],
                                    rotate: [-3, 3, -2, 2, 0],
                                    y: [0, -1.2, 0.8, 0],
                                  }
                            }
                            transition={
                              isBlowingThis
                                ? { duration: 0.12 }
                                : { repeat: Infinity, duration: 0.75, ease: 'easeInOut' }
                            }
                            className={`w-3.5 h-6 bg-gradient-to-t ${candleColors[idx].flame} rounded-full filter drop-shadow-[0_0_10px_rgba(253,203,110,0.9)] relative flex items-center justify-center`}
                          >
                            <div className="w-1.5 h-2.5 bg-white rounded-full opacity-70 blur-2xs" />
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0.8, y: 0, scale: 0.7 }}
                            animate={{ opacity: 0.3, y: -4, scale: 1 }}
                            className="h-6 flex items-center justify-center text-xs text-[#95a5a6]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7f8c8d]/60 blur-2xs" />
                          </motion.div>
                        )}

                        {/* WICK */}
                        <div className="w-0.5 h-1.5 bg-[#2d3436]" />

                        {/* CANDLE STICK */}
                        <div
                          className={`w-3 sm:w-3.5 h-10 sm:h-12 ${candleColors[idx].stick} rounded-t-sm border border-[#2c221a]/15 shadow-xs relative overflow-hidden transition-all group-hover:brightness-105`}
                        >
                          {/* Elegant subtle metallic sheen */}
                          <div className="absolute inset-0 opacity-25 bg-gradient-to-r from-transparent via-white to-transparent" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CAKE TOP TIER - Gourmet Vanilla & Chantilly Cream */}
                <div className="w-48 sm:w-56 h-18 bg-gradient-to-b from-[#ffffff] to-[#faf5ee] border border-[#dfd4c4] rounded-t-2xl relative flex flex-col items-center justify-center shadow-xs overflow-visible">
                  {/* Chantilly Cream Rosettes along Top Rim */}
                  <div className="absolute -top-2.5 inset-x-0 flex justify-around px-3 z-10 pointer-events-none">
                    <div className="w-3.5 h-3.5 rounded-full bg-white border border-[#dfd4c4] shadow-xs flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#c59b27]" />
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-white border border-[#dfd4c4] shadow-xs flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#c59b27]" />
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-white border border-[#dfd4c4] shadow-xs flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#c59b27]" />
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-white border border-[#dfd4c4] shadow-xs flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#c59b27]" />
                    </div>
                  </div>

                  {/* Caramel Gold Glaze Trim */}
                  <div className="absolute top-0 inset-x-0 h-2.5 bg-[#ecdcc9] rounded-t-2xl opacity-60" />

                  {/* Top Tier Subtle Stars */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#8c6d48] font-medium">
                    <span>✨</span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#8c6d48]">Celebration</span>
                    <span>✨</span>
                  </div>
                </div>

                {/* CAKE MIDDLE / BASE TIER (Rich Cream with Clean "happy birthday" Inscription) */}
                <div className="w-64 sm:w-76 h-24 bg-gradient-to-b from-[#faf5ee] to-[#f4ede2] border border-[#dfd4c4] rounded-t-xl relative flex flex-col items-center justify-center shadow-xs overflow-visible mt-[-1px]">
                  {/* Subtle Cream Piping Border */}
                  <div className="absolute top-0 inset-x-0 h-2 bg-[#ecdcc9] opacity-70" />

                  {/* Elegant "happy birthday ahsen" Inscription */}
                  <div className="text-lg sm:text-xl font-bold text-[#2c221a] tracking-tight flex items-center justify-center gap-2 z-10 px-4 py-1">
                    <span className="text-[#8c6d48] text-sm">✦</span>
                    <span className="font-extrabold tracking-tight">happy birthday ahsen</span>
                    <span className="text-[#8c6d48] text-sm">✦</span>
                  </div>

                  {/* Subtle Gold Pearl Accents */}
                  <div className="absolute left-6 bottom-2.5 w-1.5 h-1.5 rounded-full bg-[#c59b27]/60" />
                  <div className="absolute right-6 bottom-2.5 w-1.5 h-1.5 rounded-full bg-[#c59b27]/60" />
                  <div className="absolute left-16 bottom-2 w-1 h-1 rounded-full bg-[#8c6d48]/40" />
                  <div className="absolute right-16 bottom-2 w-1 h-1 rounded-full bg-[#8c6d48]/40" />
                </div>

                {/* CAKE PEDESTAL / STAND */}
                <div className="w-72 sm:w-84 h-3.5 bg-gradient-to-r from-[#ece4d8] via-[#ffffff] to-[#ece4d8] border border-[#d8cbb8] rounded-full mt-[-1px] shadow-xs" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 my-3">
              {!allBlown ? (
                <button
                  type="button"
                  onClick={blowAllInWave}
                  disabled={isGustActive}
                  className="px-7 py-3.5 rounded-2xl bg-[#2c221a] hover:bg-[#3d3025] text-[#fdfbf7] font-crayon font-bold text-lg sm:text-xl flex items-center gap-2.5 shadow-sm transition-all active:scale-95 cursor-pointer crayon-border disabled:opacity-75"
                >
                  <Wind className="w-5 h-5 text-[#fdcb6e]" />
                  <span>blow the candles</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={relightCandles}
                  className="px-6 py-3 rounded-2xl bg-white hover:bg-[#faf5ed] border-2 border-[#2c221a] text-[#2c221a] font-crayon font-bold text-lg sm:text-xl flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer crayon-border"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>relight candles</span>
                </button>
              )}

              <button
                type="button"
                onClick={triggerConfetti}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-[#faf5ed] border-2 border-[#d8c7b3] text-[#2c221a] font-crayon font-bold text-base sm:text-lg flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer crayon-border"
              >
                <span>🎉</span>
                <span>confetti</span>
              </button>
            </div>

            {/* Interaction Hint */}
            {!allBlown && (
              <p className="font-doodle text-xs sm:text-sm text-[#8c7764] mt-1">
                tip: click the button, or tap & swipe across candles to blow them out!
              </p>
            )}

            {/* Celebration Card Message */}
            {allBlown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-5 rounded-2xl bg-white border-2 border-[#d8c7b3] text-center crayon-border"
              >
                <div className="font-crayon font-bold text-xl sm:text-2xl text-[#b96a1e] flex items-center justify-center gap-2">
                  <span>🎉</span>
                  <span>happy birthday twin!</span>
                  <span>✨</span>
                </div>
                <p className="font-doodle text-base sm:text-lg text-[#5e4d3f] mt-1.5 max-w-md mx-auto leading-relaxed">
                  wishing you the happiest day filled with sweet cake, joy, laughter, and zero troubles!
                </p>
              </motion.div>
            )}

            {/* Back to Prompt */}
            <div className="mt-5 pt-3 border-t-2 border-dashed border-[#ece3d6]">
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  sound.stopBirthdayBGM();
                  setIsPlayingMusic(false);
                  setStage('prompt');
                  setCandles([true, true, true, true, true]);
                  setSmokeList([]);
                }}
                className="font-crayon text-sm sm:text-base text-[#8c7764] hover:text-[#2c221a] underline cursor-pointer"
              >
                ← back to invitation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
