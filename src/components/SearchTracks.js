'use client'
import { useState } from "react"
import { useSession } from "next-auth/react"

export function SearchTracks() {
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState([])

  const searchTracks = async () => {
    if (session?.accessToken) {
      try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
        const data = await response.json();
        setTracks(data.tracks.items);
      } catch (error) {
        console.error('Error searching tracks:', error);
      }
    }
  }

  return (
    <div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ค้นหาเพลง"
        className="border p-2 mr-2"
      />
      <button 
        onClick={searchTracks}
        className="bg-blue-500 text-white p-2"
      >
        ค้นหา
      </button>

      <div>
        {tracks.map(track => (
          <div key={track.id} className="flex items-center my-2">
            <img 
              src={track.album.images[0]?.url} 
              alt={track.name} 
              width={50} 
              height={50} 
              className="mr-2"
            />
            <div>
              <p>{track.name}</p>
              <p className="text-gray-500">
                {track.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}