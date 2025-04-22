import React, { useState } from 'react';
import MusicPlayer from './MusicPlayer';

const MusicList = ({ tracks }) => {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);

  return (
    <div>
      {tracks && tracks.length > 0 ? (
        tracks.map((track) => (
          <MusicPlayer
            key={track.trackId}
            track={track}
            isPlaying={currentlyPlayingId === track.trackId}
            currentlyPlayingId={currentlyPlayingId}
            onPlayPause={setCurrentlyPlayingId}
          />
        ))
      ) : (
        <p>No tracks available</p>
      )}
    </div>
  );
};

export default MusicList;
