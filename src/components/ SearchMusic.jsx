import React, { useState } from 'react'
import { fetchMusic } from '../utilities/api'


    function MusicSearch(){
      const [searchMusic, setSearchMusic] = useState("");
      const [music, setMusic] = useState([]);
      const [loading, setLoading] = useState(false);const [error, setError] = useState("");

    
     const handleSubmit = async (event) => {
      event.preventDefault();

      if (searchMusic.trim()!== ""){
        setLoading(true)
        setError("")
        setMusic([])
        
        try {
          const results = await fetchMusic(searchMusic);
          setMusic(results);
        } catch (error) {
          setError("An error has occured while Fetching Music.")          
        }
        finally{
        setLoading(false)
        }
      }   
     }
     
    


  return (
    <div>
      <h1>🔎 Scout Your Vybe</h1>
      <form onSubmit={handleSubmit}>
        <input 
        type="text" 
        placeholder='Search Music'
        value={searchMusic}
        onChange={(event)=>setSearchMusic(event.target.value)}
        />
        <button type='submit'>Scout</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {music.length > 0 &&(
        <div>
          <h2>Results:</h2>
          <ul>
            {music.map((track)=>(
              <li key={track.trackId}>
                {track.trackName.toUpperCase()}by{track.artistName}
              </li>
            ))}
          </ul>

        </div>
      )} 
    </div>
  )
  
};

export default  MusicSearch