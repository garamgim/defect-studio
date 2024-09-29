export const convertStringToFile = (base64Data: string, fileName: string) => {
  try {
    const arr = base64Data.split(',');
    if (arr.length < 2) {
      throw new Error('Invalid Base64 string.');
    }

    const mime = arr[0]?.match(/:(.*?);/)?.[1];
    if (!mime) {
      throw new Error('Invalid MIME type.');
    }

    const bstr = atob(arr[1]); // Base64 디코딩 시도
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  } catch (error) {
    console.error('Error converting Base64 string to file:', error);
    // 에러 발생 시 빈 파일을 반환
    return new File([], fileName, { type: 'text/plain' });
  }
};
