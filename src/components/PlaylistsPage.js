'use client'
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import React, { useContext } from "react";


async function getSpotifyPlaylists(accessToken) {
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return response.json();
}

export function PlaylistsPage() {
  const { data: session } = useSession()
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    async function fetchPlaylists() {
      if (session?.accessToken) {
        const data = await getSpotifyPlaylists(session.accessToken)
        setPlaylists(data.items)
      }
    }
    fetchPlaylists()
  }, [session])

  if (!session) return <div>กรุณาเข้าสู่ระบบก่อน</div>

  return (
    <div>
      <h1>เพลย์ลิสต์ของคุณ</h1>
      {playlists.map(playlist => (
        <div key={playlist.id}>
          <h2>{playlist.name}</h2>
          <img 
            src={playlist.images[0]?.url} 
            alt={playlist.name} 
            width={100} 
            height={100} 
          />
        </div>
      ))}
    </div>
  )
}