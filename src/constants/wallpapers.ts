/**
 * Default wallpapers (bundled in public/images/wallpapers, see CREDITS.md there).
 * All photos were published on Unsplash under CC0 and are mirrored on Wikimedia Commons.
 * One is picked at random on every page load when the user has not uploaded their own background.
 */
export interface Wallpaper {
  file: string
  title: string
  author: string
  source: string
}

export const WALLPAPERS: Wallpaper[] = [
  { file: 'sainte-marie-sunset.jpg', title: 'Sunset on Sainte-Marie-de-Ré coast', author: 'Sweet Ice Cream Photography', source: 'https://unsplash.com/photos/Uke5QBVdyXo' },
  { file: 'blue-mountain-folds.jpg', title: 'Blue mountain folds', author: 'Paul Gilmore', source: 'https://unsplash.com/photos/mqO0Rf-PUMs' },
  { file: 'mountain-reflection.jpg', title: 'Beautiful mountain reflection', author: 'Johannes Plenio', source: 'https://unsplash.com/photos/U_BPsXzsHQQ' },
  { file: 'san-lorenzo-sunset.jpg', title: 'San Lorenzo sunset reflected in the sea', author: 'Camille Minouflet', source: 'https://unsplash.com/photos/d7M5Xramf8g' },
  { file: 'palm-coast-aerial.jpg', title: 'Palm Coast, United States', author: 'Lance Asper', source: 'https://unsplash.com/photos/W785zpEXZZo' },
  { file: 'braies-boathouse.jpg', title: 'Boathouse on a mountain lake', author: 'Luca Bravo', source: 'https://unsplash.com/photos/zAjdgNXsMeg' },
  { file: 'rolling-clouds.jpg', title: 'Sunbathed Rolling Clouds', author: 'Dan Chung', source: 'https://unsplash.com/photos/0C3kpEe6HMk' },
  { file: 'clouds-sea.jpg', title: 'Clouds sea', author: 'Alexandre Godreau', source: 'https://unsplash.com/photos/QjLyDHFEXFU' },
]

export const wallpaperUrl = (w: Wallpaper) => `${import.meta.env.BASE_URL}images/wallpapers/${w.file}`

export function randomWallpaperIndex(exclude = -1): number {
  if (WALLPAPERS.length < 2) return 0
  let i = exclude
  while (i === exclude) i = Math.floor(Math.random() * WALLPAPERS.length)
  return i
}
