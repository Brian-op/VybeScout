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
     
    };


  return (
    <div> SearchBar</div>
  )


export default  SearchMusic