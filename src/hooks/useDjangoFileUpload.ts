import { useEffect, useState } from "react";

import ChecksumService from "../CheckSumService";

const CHUNK_SIZE = 250000; // 250KB~

type Props = {
  chunkEndpoint: string,
  chunkEndpointFetchOptions?: RequestInit,
  chunkEndpointFetchOptionsHeaders?: Headers,
  finalEndpointFetchOptions?: RequestInit,
  finalEndpointFetchOptionsHeaders?: Headers,
  finalEndpoint: string,
  formFieldName?: string,
  onFinish?: (responseBody: any) => void,
};

const useDjangoFileUpload = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const [activeRequest, setActiveRequest] = useState(false);
  const [file, setFile] = useState<File|undefined>();
  const [totalChunks, setTotalChunks] = useState(0);
  const [chunksProcessed, setChunksProcessed] = useState(0);
  const [md5, setMd5] = useState("");
  const [uploadId, setUploadId] = useState('');

  const formFieldName = props.formFieldName ?? 'file'; // Defaults to file

  useEffect(() => {
    if (
      typeof file === 'undefined'
      || !isActive
      || activeRequest
      || totalChunks < 1
    ) {
      return;
    }

    if (totalChunks > 0 && chunksProcessed >= totalChunks) {
      if (md5 === "") {
        return; // Wait for md5 processing to finish
      }
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

      const finalEndpointFetchBody = new FormData();
      finalEndpointFetchBody.append('md5', md5);
      finalEndpointFetchBody.append('upload_id', uploadId);
      finalEndpointFetchOptions.body = finalEndpointFetchBody;
      finalEndpointFetchOptions.headers = finalEndpointFetchOptionsHeaders;

      setActiveRequest(true);
      fetch(props.finalEndpoint, finalEndpointFetchOptions)
      .then((response) => {
        if (response.status >= 300) {
          console.error(response.body);
          throw new Error("Upload finish request failed");
        }
        setIsActive(false);
        if (props.onFinish) {
          response.json().then(props.onFinish);
        }
      })
      .finally(() => {
        setActiveRequest(false);
      })
      return;
    }

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
    const slice_start = chunksProcessed * CHUNK_SIZE;
    const slice_end = Math.min(((chunksProcessed * CHUNK_SIZE) + (CHUNK_SIZE)), file.size);
    chunkEndpointFetchOptionsHeaders.append('Content-Range', `bytes ${slice_start}-${slice_end - 1}/${file.size}`);
    const slice = file.slice(slice_start, slice_end, file.type);

    const chunkEndpointFetchBody = new FormData();
    chunkEndpointFetchBody.append(formFieldName, slice, file.name);
    if (uploadId !== '') {
      chunkEndpointFetchBody.append('upload_id', uploadId);
    }
    chunkEndpointFetchOptions.body = chunkEndpointFetchBody;
    chunkEndpointFetchOptions.headers = chunkEndpointFetchOptionsHeaders;
    
    setActiveRequest(true);
    fetch(props.chunkEndpoint, chunkEndpointFetchOptions)
      .then((res) => {
        if (res.status >= 300) {
          console.error(res.body);
          throw new Error("Chunk upload request failed");
        }
        return res.json();
      })
      .then((json) => {
        if (json.upload_id && uploadId === '') {
          setUploadId(json.upload_id);
        }
      })
      .then(() => {
        setChunksProcessed(chunksProcessed + 1);
      }).finally(() => {
        setActiveRequest(false);
      });
  }, [isActive, activeRequest, file, totalChunks, chunksProcessed, md5, uploadId, props, formFieldName]);

  const _setFile = (file: File|undefined) => {
    setFile(file);
    setChunksProcessed(0);
    setMd5("");
    setUploadId('');

    if (typeof file !== 'undefined') {
      setIsActive(true);
      setTotalChunks(Math.ceil(file.size / CHUNK_SIZE));
      setTimeout(() => {
        (new ChecksumService()).md5(file).then(setMd5);
      });
    }
    else {
      setIsActive(false);
      setTotalChunks(0);
    }
  };

  const progress = (Math.min(chunksProcessed / totalChunks, 1.0));
  return { setFile: _setFile, isActive, progress };
};

export default useDjangoFileUpload;
