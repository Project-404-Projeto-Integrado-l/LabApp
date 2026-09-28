"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { playSound as playReactSound, setSoundEnabled } from "react-sounds";

interface SoundContextType {
  soundEffectsEnabled: boolean;
  backgroundMusicEnabled: boolean;
  setSoundEffectsEnabled: (enabled: boolean) => void;
  setBackgroundMusicEnabled: (enabled: boolean) => void;
  playClick: () => void;
  playPopupOpen: () => void;
  playPopupClose: () => void;
  playToggle: (on?: boolean) => void;
  playSound: (soundName: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const LS_SOUND_EFFECTS_KEY = "labapp_sound_effects";
const LS_BG_MUSIC_KEY = "labapp_background_music";

// Fallback Web Audio API Sound Synthesizer for instant zero-latency UI sounds
const playSynthSound = (type: "click" | "open" | "close" | "toggle") => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === "open") {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(480, now + 0.07);
      osc2.frequency.setValueAtTime(480, now + 0.07);
      osc2.frequency.exponentialRampToValueAtTime(640, now + 0.14);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.07);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.15);
    } else if (type === "close") {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(540, now);
      osc1.frequency.exponentialRampToValueAtTime(380, now + 0.07);
      osc2.frequency.setValueAtTime(380, now + 0.07);
      osc2.frequency.exponentialRampToValueAtTime(240, now + 0.14);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.07);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.15);
    } else if (type === "toggle") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Audio Context missing or disabled
  }
};

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEffectsEnabled, setSoundEffectsEnabledState] = useState<boolean>(true);
  const [backgroundMusicEnabled, setBackgroundMusicEnabledState] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundEffectsEnabledRef = useRef<boolean>(true);
  const backgroundMusicEnabledRef = useRef<boolean>(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const storedSFX = localStorage.getItem(LS_SOUND_EFFECTS_KEY);
      if (storedSFX !== null) {
        const val = storedSFX === "true";
        setSoundEffectsEnabledState(val);
        soundEffectsEnabledRef.current = val;
        setSoundEnabled(val);
      }

      const storedBGM = localStorage.getItem(LS_BG_MUSIC_KEY);
      if (storedBGM !== null) {
        const val = storedBGM === "true";
        setBackgroundMusicEnabledState(val);
        backgroundMusicEnabledRef.current = val;
      }
    } catch {
      // localStorage error fallback
    }
  }, []);

  // Sync ref with state
  useEffect(() => {
    soundEffectsEnabledRef.current = soundEffectsEnabled;
    setSoundEnabled(soundEffectsEnabled);
  }, [soundEffectsEnabled]);

  useEffect(() => {
    backgroundMusicEnabledRef.current = backgroundMusicEnabled;
  }, [backgroundMusicEnabled]);

  // Handle Background Music HTMLAudioElement
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = 0.35;
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    const playBGM = async () => {
      if (backgroundMusicEnabled) {
        try {
          if (!audio.src || audio.src === "") {
            audio.src = "/audio/bg-music.mp3";
          }
          await audio.play();
        } catch {
          // Fallback check if user places file as trilha-sonora.mp3
          if (audio.src.includes("bg-music.mp3")) {
            audio.src = "/audio/trilha-sonora.mp3";
            audio.play().catch(() => {
              // Music file not yet provided by user
            });
          }
        }
      } else {
        audio.pause();
      }
    };

    playBGM();
  }, [backgroundMusicEnabled]);

  // Autoplay unlocker on first user interaction
  useEffect(() => {
    if (typeof window === "undefined") return;

    const unlockAudio = () => {
      if (backgroundMusicEnabledRef.current && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {
          // Music file not present yet
        });
      }
    };

    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  const setSoundEffectsEnabled = (enabled: boolean) => {
    setSoundEffectsEnabledState(enabled);
    soundEffectsEnabledRef.current = enabled;
    setSoundEnabled(enabled);
    try {
      localStorage.setItem(LS_SOUND_EFFECTS_KEY, String(enabled));
    } catch {
      // ignore localStorage errors
    }
  };

  const setBackgroundMusicEnabled = (enabled: boolean) => {
    setBackgroundMusicEnabledState(enabled);
    backgroundMusicEnabledRef.current = enabled;
    try {
      localStorage.setItem(LS_BG_MUSIC_KEY, String(enabled));
    } catch {
      // ignore localStorage errors
    }
  };

  const playClick = () => {
    if (!soundEffectsEnabledRef.current) return;
    playSynthSound("click");
    playReactSound("ui/button_medium", { volume: 0.5 }).catch(() => {});
  };

  const playPopupOpen = () => {
    if (!soundEffectsEnabledRef.current) return;
    playSynthSound("open");
    playReactSound("ui/popup_open", { volume: 0.6 }).catch(() => {});
  };

  const playPopupClose = () => {
    if (!soundEffectsEnabledRef.current) return;
    playSynthSound("close");
    playReactSound("ui/popup_close", { volume: 0.6 }).catch(() => {});
  };

  const playToggle = (on?: boolean) => {
    if (!soundEffectsEnabledRef.current) return;
    playSynthSound("toggle");
    const soundName = on ? "ui/toggle_on" : "ui/toggle_off";
    playReactSound(soundName, { volume: 0.5 }).catch(() => {});
  };

  const playSound = (soundName: string) => {
    if (!soundEffectsEnabledRef.current) return;
    playReactSound(soundName, { volume: 0.5 }).catch(() => {});
  };

  // Global Click Event Interceptor for site-wide click sounds
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleGlobalClick = (event: MouseEvent) => {
      if (!soundEffectsEnabledRef.current) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest<HTMLElement>(
        'button, a, input[type="button"], input[type="submit"], [role="button"], [role="switch"], .cursor-pointer, [data-sound]'
      );

      if (interactiveEl) {
        const soundAttr = interactiveEl.getAttribute("data-sound");
        if (soundAttr === "none") return;

        if (soundAttr === "open") {
          playPopupOpen();
          return;
        }

        if (soundAttr === "close") {
          playPopupClose();
          return;
        }

        if (interactiveEl.getAttribute("role") === "switch") {
          // Handled explicitly by toggle switch onClick
          return;
        }

        playClick();
      }
    };

    window.addEventListener("click", handleGlobalClick, true);
    return () => window.removeEventListener("click", handleGlobalClick, true);
  }, []);

  return (
    <SoundContext.Provider
      value={{
        soundEffectsEnabled,
        backgroundMusicEnabled,
        setSoundEffectsEnabled,
        setBackgroundMusicEnabled,
        playClick,
        playPopupOpen,
        playPopupClose,
        playToggle,
        playSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundEffects() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSoundEffects must be used within a SoundProvider");
  }
  return context;
}
