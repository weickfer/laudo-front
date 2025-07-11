export function dataURLtoFile(dataURL, filename) {
  var arr = dataURL.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }

  const [, extension] = mime.split('/')

  return new File([u8arr], `${filename}.${extension}`, {type:mime});
}