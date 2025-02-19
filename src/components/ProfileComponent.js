'use client'
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import React, { useContext } from "react";


export function ProfileComponent() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        <h2>ยินดีต้อนรับ {session.user.name}</h2>
        <img 
          src={session.user.image} 
          alt="Profile" 
          width={50} 
          height={50} 
        />
        <p>อีเมล: {session.user.email}</p>
        <button 
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          ออกจากระบบ
        </button>
      </div>
    )
  }
  
  return <div>ยังไม่ได้เข้าสู่ระบบ</div>
}