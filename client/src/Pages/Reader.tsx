import { useImageFetch } from '@/libs/apis'
import { useOCR } from '@/libs/ocr'
import { usePreprocess } from '@/libs/preprocess'
import { useSearchParams } from 'react-router-dom'

export default function Reader() {
  const [searchParams] = useSearchParams()
  const srcUrl = searchParams.get('src') ?? ''

  const { data, error, isLoading } = useImageFetch(srcUrl)
  const { setImageBlob, ocrText } = useOCR()
  const { canvasRef, setImageSrc } = usePreprocess()
  const execPreProcess = () => setImageSrc(imgUrl)
  const execOCR = () => setImageBlob(data)

  if (error) {
    console.log(error)
    return <div>failed to load</div>
  }
  if (isLoading) return <div>loading...</div>

  const imgUrl = data ? window.URL.createObjectURL(data) : ''

  return (
    <>
      <p>reader page</p>
      <p>src: {srcUrl}</p>
      <img src={imgUrl} />
      <button onClick={execPreProcess}>Exec Preprocess</button>
      <canvas ref={canvasRef} />
      <button onClick={execOCR}>Exec OCR</button>
      <p>OCR text: {ocrText}</p>
    </>
  )
}
