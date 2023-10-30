import React, { useEffect, useState } from 'react';
import './index.css';
import DanceStyles from '../../../constants/dance-styles';
import { useParams } from 'react-router-dom';

import getMoves, { Response as getMovesResponse } from '../../../repositories/getMoves';
import MoveListItem from '../../move-list-item';
import NewMove from '../../new-move';

function Style() {
  const [moves, setMoves] = useState<getMovesResponse>(null);
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

  return (
    <div className="stylePageContainer defaultPageContainer">
      <h1>{style?.label} Moves</h1>
      <NewMove style={style} />
      <div className="moveItemList">
        {moves === null ? null : moves.map((move) => (
          <MoveListItem move={move} key={move.id} />
        ))}
      </div>
    </div>
  );
}

export default Style;
