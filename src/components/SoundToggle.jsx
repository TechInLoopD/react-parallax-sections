import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.__soundEnabled__) setEnabled(true);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      if (window.soundManager) window.soundManager.enableAudio();
      window.__soundEnabled__ = true;
    } else {
      // we don't fully stop audio tracks here to avoid cross-browser issues,
      // just mark disabled; soundManager.play will check isEnabled.
      window.__soundEnabled__ = false;
      if (window.soundManager) window.soundManager.isEnabled = false;
    }
  };

  return (
    <button
      onClick={toggle}
      className={`fixed top-5 right-5 z-[9999] w-10 h-10 flex items-center justify-center rounded-full transition-transform
        ${enabled ? "bg-white/10 border border-white/20" : "bg-white/5 border border-white/10"}`}
      aria-label="Toggle sound"
    >
      {enabled ? <Volume2 size={18} color="#fff" /> : <VolumeX size={18} color="#fff" />}
      <div className="ml-2 hidden" />
      {/* visually present the animated dots (kept small) */}
      <div className={`sound-dots absolute`} style={{ right: -28 }}>
        <div className="sound-dot animated" />
        <div className="sound-dot animated" />
        <div className="sound-dot animated" />
        <div className="sound-dot animated" />
      </div>
    </button>
  );
}
