import mixpanel, { Dict } from 'mixpanel-browser'

// interface
interface ITrackParams {
  eventName: string
  props?: Dict
}

// mixpanel client service
class MixpanelClientService {
  constructor() {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
    const debug = process.env.NEXT_PUBLIC_MIXPANEL_DEBUG === 'true'

    if (!token) {
      console.warn('Mixpanel token not found. ')
      return
    }

    mixpanel.init(token, {
      debug,
      track_pageview: true,
      persistence: 'localStorage',
      record_sessions_percent: 1, //records 1% of all sessions
      record_heatmap_data: true,
    })
  }

  identify(id: string) {
    mixpanel.identify(id)
  }

  peopleSetOnce(value: Dict) {
    mixpanel.people.set_once(value)
  }

  peopleSet(value: Dict) {
    mixpanel.people.set(value)
  }

  peopleGetDistinctId() {
    const distinctId = mixpanel.get_distinct_id()
    if (distinctId) {
      return distinctId.split(':').at(-1)
    }
    return ''
  }

  peopleGetProperty(value: string) {
    return mixpanel.get_property(value)
  }

  track(values: ITrackParams) {
    const { eventName, props } = values

    mixpanel.track(eventName, props)
  }

  startSessionRecording() {
    const sessionRecordingProperties = mixpanel.get_session_recording_properties()

    if (!('$mp_replay_id' in sessionRecordingProperties) || !sessionRecordingProperties.$mp_replay_id) {
      mixpanel.start_session_recording()
    }
  }

  stopSessionRecording() {
    mixpanel.stop_session_recording()
  }

  reset() {
    mixpanel.reset()
  }
}

const mixpanelClient = new MixpanelClientService()

export default mixpanelClient
