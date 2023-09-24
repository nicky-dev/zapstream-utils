'use client'
import { AccountContext } from '@/contexts/AccountContext'
import { NostrContext } from '@/contexts/NostrContext'
import { useSubscribe } from '@/hooks/useSubscribe'
import { Box, Typography } from '@mui/material'
import { NDKEvent, NDKFilter, NDKKind } from '@nostr-dev-kit/ndk'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'

let timeoutHandler: NodeJS.Timeout
export default function Page() {
  const { ndk } = useContext(NostrContext)
  const { user } = useContext(AccountContext)
  const [ev, setEv] = useState<NDKEvent>()
  const filter = useMemo<NDKFilter | undefined>(() => {
    if (!user?.hexpubkey) return
    return {
      kinds: [30311 as NDKKind],
      authors: [user.hexpubkey],
    }
  }, [user])

  const [items] = useSubscribe(filter)

  useEffect(() => {
    const event = items.filter(
      (item) => item.tagValue('status') === 'live',
    )?.[0]
    const streamId = event?.tagValue('d')
    setEv((prev) => {
      const id = prev?.tagValue('d')
      if (id === streamId) return prev
      return event
    })
  }, [items])

  const fetchStatsUrl = useMemo(() => {
    const streamingUrl = ev?.tagValue('streaming')
    if (!streamingUrl) return
    const url = new URL(streamingUrl)
    const streamKey = streamingUrl?.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
    )?.[0]
    return `${url.protocol}//${url.host}/api/v3/widget/process/restreamer-ui:ingest:${streamKey}`
  }, [ev])

  const fetchStats = useCallback(async () => {
    if (!fetchStatsUrl) return
    try {
      const result = await fetch(fetchStatsUrl)
      const jsonResult = await result.json()
      return {
        viewers: jsonResult.current_sessions,
        uptime: jsonResult.uptime,
      }
    } catch (err) {
      console.log(err)
    }
  }, [fetchStatsUrl])

  const createEvent = useCallback(() => {
    if (!ndk || !ev) return
    const ndkEvent = new NDKEvent(ndk)
    ndkEvent.content = ev.content
    ndkEvent.kind = ev.kind
    ndkEvent.author = ev.author
    ndkEvent.tags = ev.tags
    return ndkEvent
  }, [ndk, ev])

  const updateLiveStats = useCallback(
    async (ev: NDKEvent) => {
      try {
        const stats = await fetchStats().catch((err) => console.error(err))
        if (!stats) return
        let currentPaticipants = ev.tagValue('current_participants') || '0'
        if (currentPaticipants === stats.viewers?.toString()) return
        if (!currentPaticipants) return
        currentPaticipants = stats.viewers?.toString()
        const ndkEvent = createEvent()
        if (!ndkEvent) return
        ndkEvent.removeTag('current_participants')
        ndkEvent.tags.push(['current_participants', currentPaticipants])
        ev.removeTag('current_participants')
        ev.tags.push(['current_participants', currentPaticipants])
        await ndkEvent.publish()
      } catch (err) {
      } finally {
        timeoutHandler = setTimeout(() => {
          updateLiveStats(ev)
        }, 5000)
      }
    },
    [fetchStats, createEvent],
  )

  useEffect(() => {
    clearTimeout(timeoutHandler)
    if (!ev) return
    updateLiveStats(ev)
    return () => {
      clearTimeout(timeoutHandler)
    }
  }, [ev, updateLiveStats])

  return (
    <Box className="flex-1 flex flex-col">
      {ev ? (
        <>
          <Typography>Title: {ev?.tagValue('title')}</Typography>
          <Typography>Summary: {ev?.tagValue('summary')}</Typography>
          <Typography>
            Viewers: {ev?.tagValue('current_participants')}
          </Typography>
        </>
      ) : (
        <Typography>No Live Event.</Typography>
      )}
    </Box>
  )
}
