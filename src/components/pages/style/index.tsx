import React, { createRef, useEffect, useState } from 'react';
import './index.css';
import DanceStyles from '../../../constants/dance-styles';
import { useNavigate, useParams } from 'react-router-dom';

import { PlusCircle as AddIcon } from 'react-feather';
import { useGet } from '../../../contexts/UserContext';
import createMove from '../../../repositories/createMove';
import getMoves, { Response as getMovesResponse } from '../../../repositories/getMoves';
import MoveListItem from '../../move-list-item';

function Style() {
  const [moves, setMoves] = useState<getMovesResponse>(null);
  const navigate = useNavigate();
  const hiddenUploadInput = createRef<HTMLInputElement>();
  const userResponse = useGet();
  const { styleId } = useParams();
  const style = DanceStyles.filter((style) => style.id === styleId)[0];

  useEffect(() => {
    getMoves().then((moves) => {
      if (moves === null) {
        setMoves(moves);
        return;
      }
      setMoves(moves.filter((move) => move.dance_style === styleId));
    });
  }, [styleId]);

  const onNewMoveClick = () => {
    if (!hiddenUploadInput.current) return;
    hiddenUploadInput.current.click();
  };

  const onNewMoveChange = async () => {
    if (!hiddenUploadInput.current) return;
    const result = await createMove(hiddenUploadInput.current, style.id);
    if (!result.success) {
      console.error(result)
      alert("Something went wrong. Reload the page and try again.");
      return;
    }
    navigate(`/move/${result.move_id}/edit`);
  };

  return (
    <div className="stylePageContainer defaultPageContainer">
      <h1>{style?.label} Moves</h1>
      {userResponse?.user ? (<button className="newMove" onClick={onNewMoveClick} type="button"><AddIcon size={16} /> New Move</button>) : null}
      <input accept="video/mp4,video/x-m4v,video/quicktime,video/*" type='file' onChange={onNewMoveChange} className='hiddenupload' ref={hiddenUploadInput} />
      <div className="moveItemList">
        {moves === null ? null : moves.map((move) => (
          <MoveListItem move={move} key={move.id} />
        ))}
      </div>
    </div>
  );
}

export default Style;
