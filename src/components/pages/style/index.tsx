import React, { useEffect, useState } from 'react';
import './index.css';
import DanceStyles from '../../../constants/dance-styles';
import { Link, useParams } from 'react-router-dom';

import { PlusCircle as AddIcon } from 'react-feather';
import { useGet } from '../../../contexts/UserContext';

function Style() {
  const userResponse = useGet();
  const { styleId } = useParams();
  const style = DanceStyles.filter((style) => style.id === styleId)[0];

  return (
    <div className="stylePageContainer defaultPageContainer">
      <h1>{style?.label} Moves</h1>
      {userResponse?.user ? (<Link to="/move/new"><AddIcon size={16} /> New Move</Link>) : null}
      <div>
        ..list of moves.. TODO
      </div>
    </div>
  );
}

export default Style;
