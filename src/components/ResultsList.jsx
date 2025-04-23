import React from 'react';
import MusicPlayer from './MusicPlayer';

const ResultsList = ({ results, currentlyPlayingId, setCurrentlyPlayingId }) => {
  return (
    <div className="results-list">
      {results.length > 0 ? (
        results.map((track) => (
          <div key={track.trackId}>
            <div className="track-info">
              <h3>{track.trackName}</h3>
              <p>{track.artistName}</p>
            </div>
            <MusicPlayer 
              track={track}
              isPlaying={currentlyPlayingId === track.trackId}
              currentlyPlayingId={currentlyPlayingId}
              onPlayPause={setCurrentlyPlayingId}
            />
          </div>
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default ResultsList;