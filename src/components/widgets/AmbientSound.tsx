"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

type SoundType = "off" | "rain" | "wind" | "waves";

export const AmbientSound: React.FC = () => {
  const [activeSound, setActiveSound] = useState<SoundType>("off");
  const [volume, setVolume] = useState(0.4);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode[]>([]);

  const stopAudio = () => {
    sourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {}
    });
    sourcesRef.current = [];

    lfoRef.current.forEach((lfo) => {
      try {
        lfo.stop();
      } catch {}
    });
    lfoRef.current = [];

    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.suspend();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Update volume when slider moves
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 0.1);
    }
  }, [volume]);

  // Noise Buffer Generator
  const createNoiseBuffer = (ctx: AudioContext, type: "white" | "pink" | "brown", duration = 2) => {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === "white") {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === "brown") {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain compensation
      }
    } else {
      // Pink noise approximation
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; // Gain compensation
        b6 = white * 0.115926;
      }
    }
    return buffer;
  };

  const startAudio = async (type: SoundType) => {
    stopAudio();

    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxRef.current = new AudioCtxClass();
      }
    }

    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    // Master Gain node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    if (type === "rain") {
      // 1. Deep background rain (Brown noise lowpassed)
      const rainBuffer = createNoiseBuffer(ctx, "brown", 3);
      const rainSrc = ctx.createBufferSource();
      rainSrc.buffer = rainBuffer;
      rainSrc.loop = true;

      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = "lowpass";
      lpFilter.frequency.setValueAtTime(650, ctx.currentTime);

      const hpFilter = ctx.createBiquadFilter();
      hpFilter.type = "highpass";
      hpFilter.frequency.setValueAtTime(80, ctx.currentTime);

      rainSrc.connect(lpFilter);
      lpFilter.connect(hpFilter);
      hpFilter.connect(masterGain);

      // 2. High patters (White noise bandpassed, modulated for droplets)
      const patterBuffer = createNoiseBuffer(ctx, "white", 2);
      const patterSrc = ctx.createBufferSource();
      patterSrc.buffer = patterBuffer;
      patterSrc.loop = true;

      const bpFilter = ctx.createBiquadFilter();
      bpFilter.type = "bandpass";
      bpFilter.frequency.setValueAtTime(1200, ctx.currentTime);
      bpFilter.Q.setValueAtTime(2.0, ctx.currentTime);

      const patterGain = ctx.createGain();
      patterGain.gain.setValueAtTime(0.08, ctx.currentTime);

      // Slow LFO to modulate rain density
      const rainLfo = ctx.createOscillator();
      rainLfo.type = "sine";
      rainLfo.frequency.setValueAtTime(0.2, ctx.currentTime); // 5 sec cycles

      const rainLfoGain = ctx.createGain();
      rainLfoGain.gain.setValueAtTime(0.04, ctx.currentTime);

      rainLfo.connect(rainLfoGain);
      rainLfoGain.connect(patterGain.gain);

      patterSrc.connect(bpFilter);
      bpFilter.connect(patterGain);
      patterGain.connect(masterGain);

      rainSrc.start();
      patterSrc.start();
      rainLfo.start();

      sourcesRef.current.push(rainSrc, patterSrc);
      lfoRef.current.push(rainLfo);

    } else if (type === "wind") {
      // Procedural Wind (Pink noise with sweeping filter frequency)
      const windBuffer = createNoiseBuffer(ctx, "pink", 4);
      const windSrc = ctx.createBufferSource();
      windSrc.buffer = windBuffer;
      windSrc.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(350, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      // LFO to sweep wind frequency (gusts)
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // 12 sec cycles

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(220, ctx.currentTime); // sweeps +/- 220Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      windSrc.connect(filter);
      filter.connect(masterGain);

      windSrc.start();
      lfo.start();

      sourcesRef.current.push(windSrc);
      lfoRef.current.push(lfo);

    } else if (type === "waves") {
      // Ocean Waves (Pink noise lowpassed, with swelling volume LFO)
      const waveBuffer = createNoiseBuffer(ctx, "pink", 5);
      const waveSrc = ctx.createBufferSource();
      waveSrc.buffer = waveBuffer;
      waveSrc.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(280, ctx.currentTime);

      const swellGain = ctx.createGain();
      swellGain.gain.setValueAtTime(0.3, ctx.currentTime);

      // Wave swell LFO (12 seconds per wave)
      const swellLfo = ctx.createOscillator();
      swellLfo.type = "sine";
      swellLfo.frequency.setValueAtTime(0.08, ctx.currentTime);

      const swellLfoGain = ctx.createGain();
      swellLfoGain.gain.setValueAtTime(0.25, ctx.currentTime); // volume sweeps +/- 0.25

      swellLfo.connect(swellLfoGain);
      swellLfoGain.connect(swellGain.gain);

      waveSrc.connect(filter);
      filter.connect(swellGain);
      swellGain.connect(masterGain);

      waveSrc.start();
      swellLfo.start();

      sourcesRef.current.push(waveSrc);
      lfoRef.current.push(swellLfo);
    }
  };

  const handleSelectSound = (type: SoundType) => {
    if (type === activeSound) {
      stopAudio();
      setActiveSound("off");
    } else {
      setActiveSound(type);
      startAudio(type);
    }
  };

  return (
    <div className="flex items-center gap-3 select-none text-xs text-foreground/40 bg-white/[0.02] border border-white/[0.04] px-3.5 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all">
      {/* Soundwave animation */}
      {activeSound !== "off" ? (
        <div className="flex gap-0.5 items-end h-3 w-4 shrink-0 pb-0.5">
          <div className="w-0.5 h-full bg-foreground/60 rounded-full animate-wave1" />
          <div className="w-0.5 h-full bg-foreground/60 rounded-full animate-wave2" />
          <div className="w-0.5 h-full bg-foreground/60 rounded-full animate-wave3" />
          <div className="w-0.5 h-full bg-foreground/60 rounded-full animate-wave4" />
        </div>
      ) : (
        <VolumeX size={13} className="shrink-0 text-foreground/25" />
      )}

      {/* Buttons */}
      <div className="flex items-center gap-2 font-medium">
        <button
          onClick={() => handleSelectSound("rain")}
          className={`cursor-pointer hover:text-foreground/80 transition-colors uppercase text-[10px] ${
            activeSound === "rain" ? "text-foreground font-bold" : ""
          }`}
        >
          🌧️ Rain
        </button>
        <span className="opacity-30">·</span>
        <button
          onClick={() => handleSelectSound("wind")}
          className={`cursor-pointer hover:text-foreground/80 transition-colors uppercase text-[10px] ${
            activeSound === "wind" ? "text-foreground font-bold" : ""
          }`}
        >
          🍃 Wind
        </button>
        <span className="opacity-30">·</span>
        <button
          onClick={() => handleSelectSound("waves")}
          className={`cursor-pointer hover:text-foreground/80 transition-colors uppercase text-[10px] ${
            activeSound === "waves" ? "text-foreground font-bold" : ""
          }`}
        >
          🌊 Waves
        </button>
      </div>

      {activeSound !== "off" && (
        <>
          <span className="opacity-30">·</span>
          {/* Vol slider */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Volume2 size={11} className="text-foreground/30" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-12 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer outline-none accent-foreground/60 [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground/70"
            />
          </div>
        </>
      )}

      {/* Custom wave anim styles */}
      <style jsx>{`
        .animate-wave1 { animation: wave 1.2s ease-in-out infinite; }
        .animate-wave2 { animation: wave 0.8s ease-in-out infinite 0.2s; }
        .animate-wave3 { animation: wave 1.4s ease-in-out infinite 0.4s; }
        .animate-wave4 { animation: wave 0.9s ease-in-out infinite 0.1s; }

        @keyframes wave {
          0%, 100% { height: 2px; }
          50% { height: 10px; }
        }
      `}</style>
    </div>
  );
};
