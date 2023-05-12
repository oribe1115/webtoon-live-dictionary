import { OCRClient } from 'node_modules/tesseract-wasm/dist'
import { useEffect, useRef, useState } from 'react'

const wasmPath = 'tesseract-wasm-files/tesseract-core.wasm'
// const wasmFallbackPath = 'tesseract-wasm-files/tesseract-core-fallback.wasm'
const workerPath = 'tesseract-wasm-files/tesseract-worker.js'

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
      ocrClient.current = await newOCRClient()

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

  const newOCRClient = async () => {
    // TODO: supportsFastBuildを使っての分岐
    return new OCRClient({
      wasmBinary: await (await fetch(wasmPath)).arrayBuffer(),
      workerURL: workerPath
    })
  }

  return { setImageBlob, ocrText }
}
