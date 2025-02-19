'use client'
import { signIn } from "next-auth/react"
import React, { useContext } from "react";


export function SpotifyLoginButton() {
  const handleLogin = () => {
    signIn('spotify', { 
      callbackUrl: '/' 
    })
  }

  return (
    <button 
      onClick={handleLogin} 
      className="bg-green-500 text-white px-4 py-2 rounded"
    >
      Login with Spotify
    </button>
  )
}