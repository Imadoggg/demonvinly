'use client'
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import React, { useContext } from "react";


export function CurrentTrack() {
  const { data: session } = useSession()
  const [currentTrack, setCurrentTrack] = useState(null)

  useEffect(() => {
    async function fetchCurrentTrack() {
      if (session?.accessToken) {
        try {
          const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`
            }
          });
          const data = await response.json();
          setCurrentTrack(data.item);
        } catch (error) {
          console.error('Error fetching current track:', error);
        }
      }
    }

    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 10000);

    return () => clearInterval(interval);
  }, [session]);

  if (!currentTrack) return <div>ไม่มีเพลงกำลังเล่น</div>

  return (
    <div>
      <h2>กำลังเล่น</h2>
      <img 
        src={currentTrack.album.images[0]?.url} 
        alt={currentTrack.name} 
        width={200} 
        height={200} 
      />
      <p>เพลง: {currentTrack.name}</p>
      <p>ศิลปิน: {currentTrack.artists.map(artist => artist.name).join(', ')}</p>
    </div>
  )
}