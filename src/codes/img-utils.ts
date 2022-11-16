export type OCREngine = '1' | '2' | '3' | '5';

export function getBase64ImagePngFromCanvas(canvas: HTMLCanvasElement) {
  const dataURL = canvas.toDataURL('image/png');
  return dataURL;
}

export function getCanvasFromImg(imgElem: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = imgElem.naturalWidth;
  canvas.height = imgElem.naturalHeight;
  canvas.getContext('2d').drawImage(imgElem, 0, 0);
  return canvas;
}

export async function ocr(
  apiKey: string,
  base64Img: string,
  ocrEngine?: OCREngine
): Promise<string> {
  const fd = new FormData();
  fd.append('base64Image', base64Img);
  fd.append('language', 'ita');
  fd.append('scale', 'true');
  fd.append('isTable', 'true');
  fd.append('OCREngine', ocrEngine || '2');
  return await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: {
      apikey: apiKey,
    },
    body: fd,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(
          `Error during OCR API call: status code ${res.status}.`
        );
      }
      return res.json();
    })
    .then((json) =>
      json.ParsedResults && json.ParsedResults.length > 0
        ? json.ParsedResults[0]
        : { ParsedText: '' }
    )
    .then((r) => r.ParsedText);
}
