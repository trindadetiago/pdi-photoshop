export function saveImage(base64: string, filename: string = "result.png") {
  const link = document.createElement("a");
  link.href = `data:image/png;base64,${base64}`;
  link.download = filename;
  link.click();
}
