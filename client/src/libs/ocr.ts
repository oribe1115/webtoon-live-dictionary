import { OCRClient } from 'node_modules/tesseract-wasm/dist'
import { useEffect, useRef, useState } from 'react'

export const useOCR = () => {
  const ocrClient = useRef<OCRClient>()
  const [imageBlob, setImageBlob] = useState<Blob>()
  const [ocrText, setOcrText] = useState<string>()

  useEffect(() => {
    if (!imageBlob) {
      return
    }

    doOCR()
  }, [imageBlob])

  const doOCR = async () => {
    if (!imageBlob) {
      return
    }

    const imageBitmap = await createImageBitmap(imageBlob)

    if (!ocrClient.current) {
      ocrClient.current = new OCRClient()

      console.log('Fetching text recognition model')
      await ocrClient.current.loadModel(
        'https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/eng.traineddata'
      )
    }

    const ocr = ocrClient.current

    try {
      console.log('Loading image')
      await ocr.loadImage(imageBitmap)

      const text = await ocr.getText()
      setOcrText(text)
    } catch (err) {
      console.log(err)
    }
  }

  return { setImageBlob, ocrText }
}
