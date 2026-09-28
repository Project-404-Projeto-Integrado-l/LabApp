"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Howl } from "howler";

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

// Direct CDN audio maps to avoid 404 HEAD probing requests to localhost
const SFX_MAP: Record<string, string> = {
  "click": "https://reactsounds.sfo3.cdn.digitaloceanspaces.com/v1/ui/button_medium.f1076ea.mp3",
  "open": "https://reactsounds.sfo3.cdn.digitaloceanspaces.com/v1/ui/popup_open.97597a8.mp3",
  "close": "https://reactsounds.sfo3.cdn.digitaloceanspaces.com/v1/ui/popup_close.1bd2a1b.mp3",
  "toggle_on": "https://reactsounds.sfo3.cdn.digitaloceanspaces.com/v1/ui/toggle_on.2f87bf7.mp3",
  "toggle_off": "https://reactsounds.sfo3.cdn.digitaloceanspaces.com/v1/ui/toggle_off.7103845.mp3",
};

// Cache for Howl instances
const howlCache: Record<string, Howl> = {};

const getHowl = (key: string, url: string, volume = 0.25) => {
  if (typeof window === "undefined") return null;
  if (!howlCache[key]) {
    howlCache[key] = new Howl({
      src: [url],
      html5: true,
      volume: volume,
    });
  } else {
    howlCache[key].volume(volume);
  }
  return howlCache[key];
};

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
      gain.gain.setValueAtTime(0.06, now);
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
      gain.gain.setValueAtTime(0.05, now);
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
      gain.gain.setValueAtTime(0.05, now);
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
      gain.gain.setValueAtTime(0.05, now);
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
  const [soundEffectsEnabled, setSoundEffectsEnabledState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const storedSFX = localStorage.getItem(LS_SOUND_EFFECTS_KEY);
      return storedSFX !== null ? storedSFX === "true" : true;
    } catch {
      return true;
    }
  });

  const [backgroundMusicEnabled, setBackgroundMusicEnabledState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const storedBGM = localStorage.getItem(LS_BG_MUSIC_KEY);
      return storedBGM !== null ? storedBGM === "true" : true;
    } catch {
      return true;
    }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundEffectsEnabledRef = useRef<boolean>(soundEffectsEnabled);
  const backgroundMusicEnabledRef = useRef<boolean>(backgroundMusicEnabled);
  const initialDelayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync ref with state
  useEffect(() => {
    soundEffectsEnabledRef.current = soundEffectsEnabled;
  }, [soundEffectsEnabled]);

  useEffect(() => {
    backgroundMusicEnabledRef.current = backgroundMusicEnabled;
  }, [backgroundMusicEnabled]);

  // Background Music Controller with 2.5 seconds initial delay on page enter
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      const audio = new Audio("/audio/bg-music.mp3");
      audio.loop = true;
      audio.volume = 0.15;
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    audio.volume = 0.15;

    if (backgroundMusicEnabled) {
      // Start background music after 2.5s delay upon entering the site
      if (initialDelayTimerRef.current) {
        clearTimeout(initialDelayTimerRef.current);
      }

      initialDelayTimerRef.current = setTimeout(() => {
        if (backgroundMusicEnabledRef.current && audio.paused) {
          audio.play().catch(() => {
            // Autoplay policy prevented playback until user interaction
          });
        }
      }, 2500);
    } else {
      if (initialDelayTimerRef.current) {
        clearTimeout(initialDelayTimerRef.current);
      }
      audio.pause();
    }

    return () => {
      if (initialDelayTimerRef.current) {
        clearTimeout(initialDelayTimerRef.current);
      }
    };
  }, [backgroundMusicEnabled]);

  // Autoplay unlocker on first user interaction (click, touch, keydown, pointerdown, scroll, mousemove)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const unlockAudio = () => {
      if (backgroundMusicEnabledRef.current && audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 0.15;
        audioRef.current.play().catch(() => {});
      }
    };

    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("scroll", unlockAudio, { once: true });
    window.addEventListener("mousemove", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("scroll", unlockAudio);
      window.removeEventListener("mousemove", unlockAudio);
    };
  }, []);

  const setSoundEffectsEnabled = (enabled: boolean) => {
    setSoundEffectsEnabledState(enabled);
    soundEffectsEnabledRef.current = enabled;
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

    // Immediately trigger playback if enabled by user click
    if (enabled && audioRef.current && audioRef.current.paused) {
      if (initialDelayTimerRef.current) {
        clearTimeout(initialDelayTimerRef.current);
      }
      audioRef.current.volume = 0.15;
      audioRef.current.play().catch(() => {});
    }
  };

  const playClick = () => {
    if (!soundEffectsEnabledRef.current) return;
    playSynthSound("click");
    const sound = getHowl("click", SFX_MAP.click, 0.25);
    sound?.play();
  };

  const playPopupOpen = () => {
    if (!soundEffectsEnabledRef.current) return;
    playSynthSound("open");
    const sound = getHowl("open", SFX_MAP.open, 0.3);
    sound?.play();
  };

  const playPopupClose = () => {
    if (!soundEffectsEnabledRef.current) return;
    playSynthSound("close");
    const sound = getHowl("close", SFX_MAP.close, 0.3);
    sound?.play();
  };

  const playToggle = (on?: boolean) => {
    if (!soundEffectsEnabledRef.current) return;
    playSynthSound("toggle");
    const key = on ? "toggle_on" : "toggle_off";
    const sound = getHowl(key, SFX_MAP[key], 0.25);
    sound?.play();
  };

  const playSound = (soundName: string) => {
    if (!soundEffectsEnabledRef.current) return;
    const url = SFX_MAP[soundName];
    if (url) {
      const sound = getHowl(soundName, url, 0.25);
      sound?.play();
    } else {
      playSynthSound("click");
    }
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
