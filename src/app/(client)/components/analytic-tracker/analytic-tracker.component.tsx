'use client'

import { useEffect, useRef } from 'react'
import { growthBookConfig } from '@/core/integration/growthbook'
import { mixpanelClient } from '@/core/integration/mixpanel'

// interface
interface IProps {}

// component
const AnalyticTrackerComponent = () => {
  const analyticInit = useRef(false)

  const handleInitAnalytics = async () => {
    if (analyticInit.current) return

    try {
      // Initialize GrowthBook
      const gb = await growthBookConfig()
      await gb.setAttributes({})
      gb.destroy()

      // Initialize Mixpanel
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
        mixpanelClient.startSessionRecording()
      }

      analyticInit.current = true
    } catch (error) {
      console.error('Failed to initialize analytics:', error)
    }
  }

  useEffect(() => {
    handleInitAnalytics()
  }, [])

  return null
}

export default AnalyticTrackerComponent
