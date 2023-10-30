import React, { createRef } from 'react';
import './index.css';
import { PlusCircle as AddIcon } from 'react-feather';
import { useGet } from '../../contexts/UserContext';
import { DanceStyle } from '../../constants/dance-styles';
import useDjangoFileUpload from '../../hooks/useDjangoFileUpload';
import { useNavigate } from 'react-router-dom';
import API_HOST from '../../repositories/getApiHost';

function NewMove({ style }: { style: DanceStyle }) {

  const { setFile, isActive, progress } = useDjangoFileUpload({
    chunkEndpoint: `${API_HOST}/move/chunk`,
    chunkEndpointFetchOptions: { credentials: 'include' },
    finalEndpoint: `${API_HOST}/move/?style=${style.id}`,
    finalEndpointFetchOptions: { credentials: 'include' },
    formFieldName: 'file',
    onFinish: (responseBody) => {
      navigate(`/move/${responseBody.move.id}/edit`);
    },
  });

  const navigate = useNavigate();
  const hiddenUploadInput = createRef<HTMLInputElement>();
  const userResponse = useGet();

  const onNewMoveClick = () => {
    if (!hiddenUploadInput.current) return;
    hiddenUploadInput.current.click();
  };

  const onNewMoveChange = async () => {
    if (!hiddenUploadInput.current || !hiddenUploadInput.current.files) return;
    const file = hiddenUploadInput.current.files.item(0);
    if (file !== null) {
      setFile(file);
    }
  };

  return (
    <div className="newMove">
      {
        isActive
        ? (
          <div>
            <div>Uploading...</div>
            <progress value={progress}>{Math.ceil(progress * 100)}%</progress>
          </div>
        )
        : (
          userResponse?.user ? (<button className="newMove" onClick={onNewMoveClick} type="button"><AddIcon size={16} /> New Move</button>) : null
        )
      }
      <input accept="video/mp4,video/x-m4v,video/quicktime,video/*" type='file' onChange={onNewMoveChange} className='hiddenupload' ref={hiddenUploadInput} />
    </div>
  );
}

export default NewMove;
