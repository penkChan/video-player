'use client'

import { useEffect } from 'react'
import { usePlayerStore } from '@/stores/player.store'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    usePlayerStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}
