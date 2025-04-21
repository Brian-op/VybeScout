export const fetchMusic = async (term) => {
    const URL = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=musicTrack&limit=200`;

    try{
        const response = await fetch(URL);
        const data = await response.json();
        return data.results;              
    }
    catch(error){
        console.error("Failed to Fetch Music!!",error)
        return[];
    }
    
}