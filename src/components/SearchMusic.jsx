import React, { useState } from 'react';
import { fetchMusic } from '../utilities/api';

function MusicSearch() {
  const [searchMusic, setSearchMusic] = useState('');
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (searchMusic.trim() !== '') {
      setLoading(true);
      setError('');
      setMusic([]);

      try {
        const results = await fetchMusic(searchMusic);
        if (results && results.length > 0) {
          setMusic(results);
        } else {
          setError('No results found.');
        }
      } catch (error) {
        setError('An error has occurred while fetching music.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>🔎 Scout Your Vybe</h1>
      <div className="search-box">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search Music"
            value={searchMusic}
            onChange={(event) => setSearchMusic(event.target.value)}
          />
          <br />
          <br />
          <button className="search-button" type="submit">
            Scout
          </button>
        </form>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {music.length > 0 && (
        <div>
          <h2>Results:</h2>
          <ul>
            {music.map((track) => (
              <li key={track.trackId}>
                <strong>{track.trackName.toUpperCase()}</strong> by{' '}
                {track.artistName}
                {track.artworkUrl100 && (
                  <img
                    src={track.artworkUrl100}
                    alt={track.trackName}
                    width="50"
                    height="50"
                  />
                )}
                <br />
                <audio controls>
                  <source src={track.previewUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </li>
            ))}
          </ul>
        </div>
      )}
      {music.length === 0 && !loading && !error && (
        <p>No music results yet. Try searching for something!</p>
      )}
    </div>
  );
}

export default MusicSearch;
