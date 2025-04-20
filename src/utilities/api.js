export const fetchMusic = async (term) => {
    const URL = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=musicTrack&limit=10`;

    try{
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data);        
    }
    catch(error){
        console.error("Failed to Fetch Music!!")
    }
    
}