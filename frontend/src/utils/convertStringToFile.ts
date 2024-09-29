export const convertStringToFile = (base64Data: string, fileName: string, fileType: string) => {
  // base64 데이터를 디코딩
  const byteString = atob(base64Data);
  let n = byteString.length;
  const u8arr = new Uint8Array(n);

  // byteString을 Uint8Array에 할당
  while (n--) {
    u8arr[n] = byteString.charCodeAt(n);
  }

  // Uint8Array를 사용하여 File 객체를 생성하고 반환
  return new File([u8arr], fileName, { type: fileType });
};
