import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  FaPlay, FaPause, FaForward, FaBackward,
  FaVolumeMute, FaVolumeUp, FaRandom, FaRedo
} from 'react-icons/fa';
import { fetchMusic } from './api'; 

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [searchTerm] = useState('Mw3ndw4, Ariana Grande..'); 

  useEffect(() => {
    const loadMusic = async () => {
      const results = await fetchMusic(searchTerm);
      const formatted = results.map((track, index) => ({
        id: index,
        title: track.trackName,
        artist: track.artistName,
        src: track.previewUrl,
        artwork: track.artworkUrl100
      }));
      setPlaylist(formatted);
    };

    loadMusic();
  }, [searchTerm]);

  const currentTrack = playlist[currentTrackIndex];

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => {
      if (playlist.length === 0) return prevIndex;
      if (shuffleMode) {
        let next;
        do {
          next = Math.floor(Math.random() * playlist.length);
        } while (next === prevIndex);
        return next;
      }
      return (prevIndex + 1) % playlist.length;
    });
  }, [shuffleMode, playlist]);

  const previousTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (repeatMode) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [repeatMode, nextTrack]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const setPlayerVolume = (level) => {
    const volumeLevel = parseFloat(level);
    audioRef.current.volume = volumeLevel;
    setVolume(volumeLevel);
  };

  const mute = () => {
    audioRef.current.muted = true;
    setIsMuted(true);
  };

  const unmute = () => {
    audioRef.current.muted = false;
    setIsMuted(false);
  };

  const seek = (time) => {
    const newTime = parseFloat(time);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!currentTrack) return <div>Loading music...</div>;

  return (
    <div className="music-player">
      <audio ref={audioRef} src={currentTrack.src} />

      <div className="track-info">
        <img src={currentTrack.artwork} alt={currentTrack.title} />
        <div>
          <h4>{currentTrack.title}</h4>
          <p>{currentTrack.artist}</p>
        </div>
      </div>

      <div className="controls">
        <button onClick={previousTrack}><FaBackward /></button>
        <button onClick={togglePlay}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
        <button onClick={nextTrack}><FaForward /></button>
        <button onClick={() => setShuffleMode((prev) => !prev)}>
          <FaRandom color={shuffleMode ? 'gold' : 'white'} />
        </button>
        <button onClick={() => setRepeatMode((prev) => !prev)}>
          <FaRedo color={repeatMode ? 'gold' : 'white'} />
        </button>
        <button onClick={isMuted ? unmute : mute}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setPlayerVolume(e.target.value)}
        />
      </div>

      <div className="progress">
        <span>{Math.floor(currentTime)} / {Math.floor(audioRef.current?.duration || 0)} sec</span>
        <input
          type="range"
          min="0"
          max={audioRef.current?.duration || 1}
          value={currentTime}
          onChange={(e) => seek(e.target.value)}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;