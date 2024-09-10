interface AverageColorConfigs {
  sx?: number | ((canvas: HTMLCanvasElement) => number)
  sy?: number | ((canvas: HTMLCanvasElement) => number)
  sw?: number | ((canvas: HTMLCanvasElement) => number)
  sh?: number | ((canvas: HTMLCanvasElement) => number)
}

export function getAverageColor(image: HTMLImageElement, { sx, sy, sw, sh }: AverageColorConfigs = {}) {
  return new Promise<string>((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')

    if (!canvas || !ctx) {
      reject(new Error('Failed to create canvas or context'))
      return
    }

    const calculateAverage = () => {
      // Draw the image on the canvas
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

      const sxValue = (typeof sx === 'function' ? sx(canvas) : sx) ?? 0
      const syValue = (typeof sy === 'function' ? sy(canvas) : sy) ?? 0
      const swValue = (typeof sw === 'function' ? sw(canvas) : sw) ?? canvas.width
      const shValue = (typeof sh === 'function' ? sh(canvas) : sh) ?? canvas.height

      // Get the pixel data
      const imageData = ctx.getImageData(sxValue, syValue, swValue, shValue)
      const data = imageData.data

      // Calculate the average color
      const average = { r: 0, g: 0, b: 0 }
      const pixels = data.length / 4

      for (let i = 0; i < data.length; i += 4) {
        average.r += data[i]
        average.g += data[i + 1]
        average.b += data[i + 2]
      }

      average.r = Math.floor(average.r / pixels)
      average.g = Math.floor(average.g / pixels)
      average.b = Math.floor(average.b / pixels)

      const averageColor = `rgb(${average.r},${average.g},${average.b})`
      resolve(averageColor)
    }

    if (image.complete) {
      calculateAverage()
    } else {
      image.onload = calculateAverage
      image.onloadeddata = calculateAverage
      image.onloadedmetadata = calculateAverage
      image.onloadstart = calculateAverage
      image.onerror = () => {
        reject(new Error('Failed to load the image'))
      }
    }
  })
}
