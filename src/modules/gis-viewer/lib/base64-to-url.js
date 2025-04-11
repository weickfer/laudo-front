export function base64ToBlobUrl(base64) {
  const [prefixo, dados] = base64.split(',');
  const mime = prefixo.match(/:(.*?);/)[1];

  const byteCharacters = atob(dados);
  const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: mime });
  return URL.createObjectURL(blob);
}