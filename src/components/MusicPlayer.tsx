import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

// Dynamically import all MP3 files from public/music folder
const musicFiles = import.meta.glob('/public/music/*.mp3', { eager: true, query: '?url', import: 'default' });

interface MusicPlayerProps {
  isMidnight: boolean;
}

export default function MusicPlayer({ isMidnight: _isMidnight }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Get list of available tracks
  const availableTracks = Object.entries(musicFiles).map(([path, url]) => ({
    name: path.split('/').pop()?.replace('.mp3', '') || 'Unnamed Track',
    url: url as string,
    path: path.replace('/public', '')
  }));

  const currentTrack = availableTracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % availableTracks.length);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + availableTracks.length) % availableTracks.length);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (availableTracks.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-4 shadow-glow">
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-5 h-5 text-[#d4af37]" />
          <h3 className="text-lg font-semibold text-[#d4af37]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
            Music Player
          </h3>
        </div>
        <div className="text-center py-6 text-[#d4af37]/50 text-sm">
          <p className="mb-2">No music files found!</p>
          <p className="text-xs">Add MP3 files to <code className="bg-black/40 px-2 py-0.5 rounded">public/music/</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-4 shadow-glow">
      <div className="flex items-center gap-2 mb-3">
        <Music className="w-5 h-5 text-[#d4af37]" />
        <h3 className="text-lg font-semibold text-[#d4af37]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
          Music Player
        </h3>
      </div>

      {/* Track Info */}
      <div className="mb-4">
        <div className="text-sm font-medium text-[#ddc3a5] truncate mb-1">
          {currentTrack?.name}
        </div>
        <div className="text-xs text-[#d4af37]/60">
          Track {currentTrackIndex + 1} of {availableTracks.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
        />
        <div className="flex justify-between text-xs text-[#d4af37]/60 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full bg-[#cd7f32] text-[#1a120d] hover:bg-[#b8941e] transition-all shadow-md"
          disabled={availableTracks.length <= 1}
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={handlePlayPause}
          className="p-3 rounded-full bg-[#d4af37] text-[#1a120d] hover:bg-[#cd7f32] transition-all shadow-md"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-[#cd7f32] text-[#1a120d] hover:bg-[#b8941e] transition-all shadow-md"
          disabled={availableTracks.length <= 1}
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-[#d4af37] hover:text-[#cd7f32] transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="flex-1 h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
        />
      </div>

      {/* Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.path}
          preload="metadata"
        />
      )}
    </div>
  );
}
