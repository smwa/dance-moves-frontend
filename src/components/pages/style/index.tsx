import React, { createRef } from 'react';
import './index.css';
import DanceStyles from '../../../constants/dance-styles';
import { useNavigate, useParams } from 'react-router-dom';

import { PlusCircle as AddIcon } from 'react-feather';
import { useGet } from '../../../contexts/UserContext';
import createMove from '../../../repositories/createMove';

function Style() {
  const navigate = useNavigate();
  const hiddenUploadInput = createRef<HTMLInputElement>();
  const userResponse = useGet();
  const { styleId } = useParams();
  const style = DanceStyles.filter((style) => style.id === styleId)[0];

  const onNewMoveClick = () => {
    if (!hiddenUploadInput.current) return;
    hiddenUploadInput.current.click();
  };

  const onNewMoveChange = async () => {
    if (!hiddenUploadInput.current) return;
    const result = await createMove(hiddenUploadInput.current, style.id);
    if (!result.success) {
      console.error(result)
      alert("Something went wrong. Reload the page and try again."); // TODO
      // TODO Refresh moves cache and wait for it to finish
      navigate(`/move/${result.move_id}`);
    }
  };

  return (
    <div className="stylePageContainer defaultPageContainer">
      <h1>{style?.label} Moves</h1>
      {userResponse?.user ? (<button className="newMove" onClick={onNewMoveClick} type="button"><AddIcon size={16} /> New Move</button>) : null}
      <input type='file' onChange={onNewMoveChange} className='hiddenupload' ref={hiddenUploadInput} />
      <div>
        ..list of moves.. TODO
      </div>
    </div>
  );
}

export default Style;
