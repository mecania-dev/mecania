export function fileToBase64(file: File) {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
    reader.readAsDataURL(file)
  })
}

export function base64ToBlobDynamic(base64Data: string | ArrayBuffer): Blob {
  const [header, base64String] = base64Data.toString().split(',')
  const contentType = header.match(/:(.*?);/)?.[1]
  const byteString = atob(base64String)
  const byteArray = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i)
  }
  return new Blob([byteArray], { type: contentType })
}

export function blobToFile(blob: Blob, fileName: string) {
  return new File([blob], fileName, { type: blob.type })
}
