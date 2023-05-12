import { OCRClient, supportsFastBuild } from 'tesseract-wasm'
import { useEffect, useRef, useState } from 'react'

const wasmCorePath = 'tesseract-wasm-files/tesseract-core.wasm'
const wasmCoreFallbackPath = 'tesseract-wasm-files/tesseract-core-fallback.wasm'
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
        'https://raw.githubusercontent.com/tesseract-ocr/tessdata_best/main/eng.traineddata'
      )
    }

    const ocr = ocrClient.current

    try {
      console.log('Loading image')
      await ocr.loadImage(imageBitmap)

      console.log('Getting text')
      const text = await ocr.getText()
      setOcrText(text)
    } catch (err) {
      console.log(err)
    }
  }

  const newOCRClient = async () => {
    const wasmPath = supportsFastBuild() ? wasmCorePath : wasmCoreFallbackPath

    return new OCRClient({
      wasmBinary: await (await fetch(wasmPath)).arrayBuffer(),
      workerURL: workerPath
    })
  }

  return { setImageBlob, ocrText }
}
