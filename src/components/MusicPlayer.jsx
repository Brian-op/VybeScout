import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FaBackward, FaForward, FaVolumeMute, FaVolumeUp, FaRandom, FaRedo } from 'react-icons/fa';
import { fetchMusic } from '../utilities/api'; 
import PlayButton from './PlayButton'; 

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
  const [duration, setDuration] = useState(0);
  const [searchTerm] = useState('Mw3ndw4, Ariana Grande..');
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const loadMusic = async () => {
      try {
        const results = await fetchMusic(searchTerm);
        const formatted = results
          .filter(track => track.previewUrl) 
          .map((track, index) => ({
            id: index,
            title: track.trackName,
            artist: track.artistName,
            src: track.previewUrl,
            artwork: track.artworkUrl100
          }));
        setPlaylist(formatted);
      } catch (err) {
        console.error("Failed to fetch music:", err);
      }
    };

    loadMusic();
  }, [searchTerm]);

  const handleTrackChange = (newTrack) => {
    if (audioRef.current) {
      // Pause and reset the previous track when a new one is selected
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setCurrentTrack(newTrack);
    setIsPlaying(true); // Automatically play the new track
  };

  const handlePlay = (track) => {
    if (currentTrack && currentTrack.trackId === track.trackId) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause(); 
        audioRef.current.currentTime = 0; 
      }
      setCurrentTrack(track); 
      setIsPlaying(true); // Automatically play the new track
    }
  };

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
    const handleLoadedMetadata = () => setDuration(audio.duration);
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
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [repeatMode, nextTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const playAudio = async () => {
      audio.load();
      if (isPlaying) {
        try {
          await audio.play();
        } catch (err) {
          console.error("Playback error:", err);
        }
      }
    };

    playAudio();
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch (err) {
        console.error("Playback error on toggle:", err);
      }
    }
    setIsPlaying((prev) => !prev);
  };

  const setPlayerVolume = (level) => {
    const volumeLevel = parseFloat(level);
    if (audioRef.current) audioRef.current.volume = volumeLevel;
    setVolume(volumeLevel);
  };

  const mute = () => {
    if (audioRef.current) audioRef.current.muted = true;
    setIsMuted(true);
  };

  const unmute = () => {
    if (audioRef.current) audioRef.current.muted = false;
    setIsMuted(false);
  };

  const seek = (time) => {
    const newTime = parseFloat(time);
    if (audioRef.current) audioRef.current.currentTime = newTime;
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
        <PlayButton clickToPlay={togglePlay} /> 
        <button onClick={nextTrack}><FaForward /></button>
        <button onClick={() => setShuffleMode(prev => !prev)}>
          <FaRandom color={shuffleMode ? 'gold' : 'white'} />
        </button>
        <button onClick={() => setRepeatMode(prev => !prev)}>
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
        <span>{Math.floor(currentTime)} / {Math.floor(duration)} sec</span>
        <input
          type="range"
          min="0"
          max={duration || 1}
          step="0.1"
          value={currentTime}
          onChange={(e) => seek(e.target.value)}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
