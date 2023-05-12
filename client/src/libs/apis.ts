import { Fetcher } from 'swr'
import useSWR from 'swr'

const imageFetcher: Fetcher<Blob> = (imageUrl: string) =>
  fetch(`http://localhost:3000/api/image?src=${imageUrl}`)
    .then(res => res.blob())
    .then(blob => {
      return blob
    })

export const useImageFetch = (imageUrl: string) =>
  useSWR<Blob, Error>(imageUrl, imageFetcher)
