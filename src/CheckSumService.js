import CryptoJS from 'crypto-js';

const _sleep = (ms_to_sleep) => {
  return Promise((resolve) => {
    setTimeout(resolve, ms_to_sleep);
  });
};

class ChecksumService {

  async md5(file) {
    const _md5 = CryptoJS.algo.MD5.create();
    const sliceSize = 256 * 1024; // 256KB
    let start = 0;

    while (start < file.size) {
      const slice = await this.readSlice(file, start, sliceSize);
      await _sleep(10);
      const wordArray = CryptoJS.lib.WordArray.create(slice);
      _md5.update(wordArray);
      start += sliceSize;
    }

    return _md5.finalize().toString(CryptoJS.enc.Hex);
  }

  async readSlice(file, start, size) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      const slice = file.slice(start, start + size);

      fileReader.onload = () => resolve(new Uint8Array(fileReader.result));
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(slice);
    });
  }

}

export default ChecksumService;
