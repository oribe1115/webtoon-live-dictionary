import { useEffect, useRef, useState } from 'react'

// 参考資料
// https://www.smashingmagazine.com/2021/06/image-text-conversion-react-tesseract-js-ocr/
// https://dev.to/mathewthe2/using-javascript-to-preprocess-images-for-ocr-1jc

export const usePreprocess = () => {
  const canvasRef = useRef(null)
  const [imageSrc, setImageSrc] = useState<string>()
  const [preprocessedImage, setPreprocessedImage] = useState<ImageBitmap>()

  useEffect(() => {
    if (!canvasRef.current || !imageSrc) {
      return
    }

    const ctx = getContext()

    const image = new Image()
    image.src = imageSrc
    ctx.drawImage(image, 0, 0)

    const { width, heigh } = getCanvasSize()
    const imageData = binarizeImage(ctx, width, heigh)
    ctx.putImageData(imageData, 0, 0)

    updatePreprocessedImage(imageData)
  }, [canvasRef, imageSrc])

  const getContext = (): CanvasRenderingContext2D => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canvas: any = canvasRef.current

    return canvas.getContext('2d')
  }

  const getCanvasSize = (): { width: number; heigh: number } => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canvas: any = canvasRef.current

    return canvas.width, canvas.height
  }

  const binarizeImage = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const level = 0.5

    const image = ctx.getImageData(0, 0, width, height)
    thresholdFilter(image.data, level)

    return image
  }

  const thresholdFilter = (pixels: Uint8ClampedArray, level: number) => {
    const thresh = Math.floor(level * 255)
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b
      let val
      if (gray >= thresh) {
        val = 255
      } else {
        val = 0
      }
      pixels[i] = pixels[i + 1] = pixels[i + 2] = val
    }
  }

  const updatePreprocessedImage = async (imageData: ImageData) => {
    const image = await createImageBitmap(imageData)
    setPreprocessedImage(image)
  }

  return { canvasRef, setImageSrc, preprocessedImage }
}
