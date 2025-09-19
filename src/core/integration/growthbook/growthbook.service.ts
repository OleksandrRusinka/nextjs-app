import { configureCache, GrowthBook, setPolyfills } from '@growthbook/growthbook'

// interface
interface IGrowthBookService {
  atr: { [key: string]: string }
  value: string
}

// growthbook instance
const gb = new GrowthBook({
  apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
  clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
  decryptionKey: process.env.NEXT_PUBLIC_GROWTHBOOK_DECRYPTION_KEY,
});

// growthbook config
export const growthBookConfig = async () => {
  setPolyfills({
    fetch: (url: Parameters<typeof fetch>[0], opts: Parameters<typeof fetch>[1]) =>
      fetch(url, {
        ...opts,
        next: { revalidate: 60, tags: ['growthbook'] },
      }),
  })

  configureCache({ disableCache: true })

  await gb.init({ timeout: 1000 })

  return gb
}

// growthbook get value
export const growthBookGetValue = async <T>(
  props: IGrowthBookService,
  fallback: string | number | boolean = 'fallback',
): Promise<T> => {
  const gb = await growthBookConfig()

  const existingAttributes = gb.getAttributes()

  await gb.setAttributes({ ...existingAttributes, ...props.atr })

  const value = gb.getFeatureValue<T>(props.value, fallback as T)

  gb.destroy()

  return value as T
}
