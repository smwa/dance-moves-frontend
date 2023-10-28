import { useEffect, useState } from "react";

import CryptoJS from 'crypto-js';

const CHUNK_SIZE = 250000; // 250KB~

const blobToBinaryString = (blob: Blob): Promise<CryptoJS.lib.WordArray> => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onloadend = async () => {
      const blobAsAny: any = reader.result;
      const blobAsWordArray: CryptoJS.lib.WordArray|null = blobAsAny;
      if (blobAsWordArray === null) return reject();
      return resolve(blobAsWordArray);
    };
    reader.readAsBinaryString(blob);
  });
};

type Props = {
  chunkEndpoint: string,
  chunkEndpointFetchOptions?: RequestInit,
  chunkEndpointFetchOptionsHeaders?: Headers,
  finalEndpointFetchOptions?: RequestInit,
  finalEndpointFetchOptionsHeaders?: Headers,
  finalEndpoint: string,
  formFieldName?: string,
};

const useDjangoFileUpload = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const [file, setFile] = useState<File|undefined>();
  const [totalChunks, setTotalChunks] = useState(0);
  const [chunksProcessed, setChunksProcessed] = useState(0);
  const [md5, setMd5] = useState(CryptoJS.algo.MD5.create());
  const [chunksAddedToMd5, setChunksAddedToMd5] = useState(0);
  const [requestActive, setRequestActive] = useState(false);
  const [uploadId, setUploadId] = useState('');

  const formFieldName = props.formFieldName ?? 'file'; // Defaults to file

  const requestChunk = async (): Promise<globalThis.Response|void> => {
    if (typeof file === 'undefined' || requestActive) {
      return new Promise((resolve) => { resolve(); });
    }
    setRequestActive(true);
    let chunkEndpointFetchOptions: RequestInit = {};
    let chunkEndpointFetchOptionsHeaders: Headers = new Headers();
    if (props.chunkEndpointFetchOptions) {
      chunkEndpointFetchOptions = {...props.chunkEndpointFetchOptions};
    }
    if (props.chunkEndpointFetchOptionsHeaders) {
      props.chunkEndpointFetchOptionsHeaders.forEach((value, key) => {
        chunkEndpointFetchOptionsHeaders.append(key, value);
      });
    }
    chunkEndpointFetchOptions.method = 'POST';
    chunkEndpointFetchOptionsHeaders.append('Content-Range', `bytes ${chunksProcessed * CHUNK_SIZE}-${(chunksProcessed * CHUNK_SIZE) + (CHUNK_SIZE - 1)}/*`);
    chunkEndpointFetchOptionsHeaders.append('Content-Type', 'application/json');
    const chunkEndpointFetchBody: any = {};
    const slice = file.slice((chunksProcessed * CHUNK_SIZE), (chunksProcessed * CHUNK_SIZE) + CHUNK_SIZE);
    if (chunksAddedToMd5 === chunksProcessed) {
      try {
        md5.update(await blobToBinaryString(slice));
        setChunksAddedToMd5(chunksAddedToMd5 + 1);
      }
      catch (e) {
        console.log("Failed to convert to word array");
      }
    }
    chunkEndpointFetchBody[formFieldName] = slice;
    if (uploadId !== '') {
      chunkEndpointFetchBody.upload_id = uploadId;
    }
    chunkEndpointFetchOptions.body = JSON.stringify(chunkEndpointFetchBody);
    chunkEndpointFetchOptions.headers = chunkEndpointFetchOptionsHeaders;
    return fetch(props.chunkEndpoint, chunkEndpointFetchOptions)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.upload_id && uploadId === '') {
          setUploadId(json.upload_id);
        }
      })
      .then(() => {
        setChunksProcessed(chunksProcessed + 1);
      }).finally(() => {
        setRequestActive(false);
      });
  };

  useEffect(() => {
    if (!requestActive) {
      requestChunk();
    }
    else {
      if (totalChunks > 0 && chunksProcessed >= totalChunks) {
        let finalEndpointFetchOptions: RequestInit = {};
        let finalEndpointFetchOptionsHeaders: Headers = new Headers();
        if (props.finalEndpointFetchOptions) {
          finalEndpointFetchOptions = {...props.finalEndpointFetchOptions};
        }
        if (props.finalEndpointFetchOptionsHeaders) {
          props.finalEndpointFetchOptionsHeaders.forEach((value, key) => {
            finalEndpointFetchOptionsHeaders.append(key, value);
          });
        }
        finalEndpointFetchOptions.method = 'POST';
        finalEndpointFetchOptionsHeaders.append('Content-Type', 'application/json');
        const finalEndpointFetchBody: any = {};
        finalEndpointFetchBody.md5 = md5.finalize().toString(CryptoJS.enc.Hex);
        finalEndpointFetchBody.upload_id = uploadId;
        finalEndpointFetchOptions.body = JSON.stringify(finalEndpointFetchBody);
        finalEndpointFetchOptions.headers = finalEndpointFetchOptionsHeaders;

        fetch(props.finalEndpoint, finalEndpointFetchOptions)
          .then((response) => {
            setIsActive(false);
          })
      }
    }
  }, [requestActive]);

  useEffect(() => {
    setTotalChunks(0);
    setChunksProcessed(0);
    setMd5(CryptoJS.algo.MD5.create());
    setChunksAddedToMd5(0);
    setUploadId('');
    setIsActive(false);

    if (typeof file !== 'undefined') {
      setIsActive(true);
      setTotalChunks(Math.ceil(file.size / CHUNK_SIZE));
      requestChunk();
    }
  }, [file]);

  const progress = (Math.max(chunksProcessed / totalChunks, 1.0));
  return { setFile, isActive, progress };
};

export default useDjangoFileUpload;
