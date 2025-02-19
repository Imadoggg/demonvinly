"use client";
import React, { useState, useEffect } from "react";
import { Play, Pause, Volume2, Volume1, VolumeX, SkipForward, SkipBack, Music2 } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

const VinylPlayer = () => {
  const { data: session, status } = useSession();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTrack, setCurrentTrack] = useState({
    title: "No track playing",
    artist: "Select a track",
    albumArt: "/placeholder.jpg"
  });
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (session?.accessToken) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new window.Spotify.Player({
          name: 'Vinyl Player Web App',
          getOAuthToken: cb => { cb(session.accessToken); },
          volume: volume / 100
        });

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              device_ids: [device_id],
              play: false,
            }),
          });
        });

        spotifyPlayer.addListener('player_state_changed', state => {
          if (state) {
            setCurrentTrack({
              title: state.track_window.current_track.name,
              artist: state.track_window.current_track.artists[0].name,
              albumArt: state.track_window.current_track.album.images[0].url
            });
            setIsPlaying(!state.paused);
          }
        });

        spotifyPlayer.connect();
        setPlayer(spotifyPlayer);
      };
    }
  }, [session]);

  const handlePlayPause = async () => {
    if (!player) return;
    await player.togglePlay();
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = async () => {
    if (!player) return;
    await player.nextTrack();
  };

  const handlePreviousTrack = async () => {
    if (!player) return;
    await player.previousTrack();
  };

  const handleVolumeChange = async (newVolume) => {
    if (!player) return;
    await player.setVolume(newVolume / 100);
    setVolume(newVolume);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[80rem] bg-white/5 backdrop-blur-xl rounded-2xl p-12 shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-rose-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/30 rounded-full blur-3xl"></div>

        {/* Layout แยก 2 คอลัมน์ */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          {/* Album Art Section - ด้านซ้าย */}
          <div className="flex-1 relative z-10">
            <div className="w-80 lg:w-96 h-80 lg:h-96 relative rounded-lg overflow-hidden shadow-2xl 
                         ring-1 ring-white/10 transition-all duration-300 hover:ring-rose-500/50">
              {!currentTrack.albumArt || currentTrack.albumArt === "/placeholder.jpg" ? (
                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                  <Music2 size={60} className="text-zinc-700" />
                </div>
              ) : (
                <img
                  src={currentTrack.albumArt}
                  alt="Album cover"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Vinyl Player Section - ด้านขวา */}
          <div className="flex-1 relative">
            {/* Record Player Arm */}
            <div className={`w-32 h-6 bg-gradient-to-r from-zinc-700 to-zinc-600 absolute 
                         -left-16 top-20 transform rotate-45 transition-all duration-700
                         ${isPlaying ? 'translate-x-28' : 'translate-x-0'}`} 
                 style={{
                   borderRadius: '4px',
                   transformOrigin: 'left center',
                   zIndex: 20,
                   boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                 }}>
              <div className="w-3 h-12 bg-gradient-to-b from-zinc-600 to-zinc-700 
                           absolute right-3 bottom-0 transform rotate-45 rounded-full">
              </div>
            </div>

            {/* Vinyl Record */}
            <div className="w-80 lg:w-96 h-80 lg:h-96 relative">
              <div className={`w-full h-full ${isPlaying ? 'animate-spin' : ''}`}
                   style={{
                     animationDuration: '2.5s',
                     animationTimingFunction: 'linear',
                     animationIterationCount: 'infinite'
                   }}>
                <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800 
                             rounded-full shadow-2xl ring-1 ring-white/10">
                  {/* Vinyl Grooves */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute border border-zinc-800/40 rounded-full"
                      style={{
                        inset: `${(i + 1) * 10}px`,
                        background: `radial-gradient(circle at center, 
                                   rgba(255,255,255,0.1) ${i * 4}%, 
                                   transparent ${i * 4 + 1}%)`
                      }}
                    />
                  ))}
                  {/* Center Label */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                               w-24 h-24 bg-gradient-to-br from-rose-400 to-rose-500 
                               rounded-full flex items-center justify-center shadow-lg 
                               ring-1 ring-white/20">
                    <div className="w-5 h-5 bg-zinc-900 rounded-full ring-2 ring-zinc-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="mt-12 flex flex-col items-center gap-6">
          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-6">
            {session ? (
              <>
                <button
                  onClick={handlePreviousTrack}
                  className="text-white/80 hover:text-rose-400 transition-colors transform hover:scale-110"
                >
                  <SkipBack size={28} />
                </button>
                
                <button
                  onClick={handlePlayPause}
                  className="bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-400 hover:to-rose-500 
                           text-white px-10 py-4 rounded-full flex items-center gap-3 
                           transition-all duration-300 shadow-lg hover:shadow-rose-500/25 
                           transform hover:scale-105"
                >
                  {isPlaying ? (
                    <>
                      <Pause size={24} />
                      <span className="font-medium">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play size={24} />
                      <span className="font-medium">Play</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="text-white/80 hover:text-rose-400 transition-colors transform hover:scale-110"
                >
                  <SkipForward size={28} />
                </button>

                <button
                  onClick={() => signOut()}
                  className="ml-6 bg-zinc-800/50 hover:bg-zinc-700/50 text-white/80 hover:text-white 
                           px-6 py-3 rounded-full transition-all duration-300 shadow-lg 
                           border border-white/5 hover:border-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('spotify', { callbackUrl: '/vinylplayer' })}
                className="bg-[#1DB954] hover:bg-[#1ed760] text-white px-10 py-4 rounded-full 
                         flex items-center gap-3 transition-all duration-300 shadow-lg 
                         transform hover:scale-105"
              >
                <span className="font-medium">Login with Spotify</span>
              </button>
            )}
          </div>

          {/* Volume Controls */}
          {session && (
            <div className="flex items-center justify-center gap-6 pt-4">
              <button
                onClick={() => handleVolumeChange(Math.max(0, volume - 10))}
                className="text-white/70 hover:text-rose-400 transition-colors"
              >
                <Volume1 size={22} />
              </button>
              
              <div className="w-48 h-2 bg-zinc-800/50 rounded-full relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full"
                  style={{ width: `${volume}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
                  style={{ left: `${volume}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>
              
              <button
                onClick={() => handleVolumeChange(Math.min(100, volume + 10))}
                className="text-white/70 hover:text-rose-400 transition-colors"
              >
                <Volume2 size={22} />
              </button>

              <button
                onClick={() => handleVolumeChange(0)}
                className="text-white/70 hover:text-rose-400 transition-colors"
              >
                <VolumeX size={22} />
              </button>
            </div>
          )}

          {/* Track Info */}
          <div className="text-center space-y-2">
            <h2 className="text-white text-2xl font-medium tracking-wide">
              {currentTrack?.title || "No track playing"}
            </h2>
            <p className="text-zinc-400 text-lg">
              {currentTrack?.artist || "Select a track"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VinylPlayer;