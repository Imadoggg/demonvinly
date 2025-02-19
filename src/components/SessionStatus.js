
'use client'
import { useSession } from "next-auth/react"
import React, { useContext } from "react";


export function SessionStatus() {
  const { data: session } = useSession()

  if (session) {
    return <div>Logged in as {session.user.email}</div>
  }
  
  return <div>Not logged in</div>
}