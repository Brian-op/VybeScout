export const fetchMusic = async (term) => {
    const URL = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=musicTrack&limit=15`;

    try{
        const response = await fetch(URL);
        const data = await response.json();
        return data.results;              
    }
    catch(error){
        console.error("Failed to Fetch Music!!",error)
        return[];
    }
    // This function fetches music data from the iTunes API based on the search term provided.
}