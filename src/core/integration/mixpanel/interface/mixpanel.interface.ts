import { Config } from 'mixpanel-browser'

export interface MixpanelExtendedConfig extends Partial<Config> {
  record_heatmap_data?: boolean
}
