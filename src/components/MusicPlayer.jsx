import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaSpinner } from 'react-icons/fa';

const MusicPlayer = ({ track, isPlaying, onPlayPause, currentlyPlayingId }) => {
  const audioRef = useRef(null);
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);


  
  useEffect(() => {
    if (!track) return;


    if (track.trackId !== currentlyPlayingId && audioRef.current) {
      audioRef.current.pause();
      setIsTrackPlaying(false);
    }
  }, [currentlyPlayingId, track]);


  const togglePlayPause = () => {
    if (!track || !audioRef.current) return;

    if (isTrackPlaying) {
      audioRef.current.pause();
      setIsTrackPlaying(false);
      onPlayPause(null); 
    } else {
      audioRef.current.play();
      setIsTrackPlaying(true);
      onPlayPause(track.trackId); 
    }
  };

 
  const handleAudioLoading = () => {
    setIsBuffering(true);
  };

 
  const handleAudioPlaying = () => {
    setIsBuffering(false);
  };

 

  const handleAudioEnded = () => {
    setIsTrackPlaying(false);
    onPlayPause(null); 
  };

  if (!track) return null;

  return (
    <div className="music-player">
      <div className="track-info">
        <img src={track.artworkUrl100} alt={track.trackName} />
        <div>
          <h4>{track.trackName}</h4>
          <p>{track.artistName}</p>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={track.previewUrl} 
        onPlay={handleAudioPlaying}
        onWaiting={handleAudioLoading}
        onEnded={handleAudioEnded}
      />

      <button onClick={togglePlayPause} disabled={isBuffering}>
        {isBuffering ? (
          <FaSpinner className="spinner" />
        ) : isTrackPlaying && currentlyPlayingId === track.trackId ? (
          <FaPause />
        ) : (
          <FaPlay />
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
