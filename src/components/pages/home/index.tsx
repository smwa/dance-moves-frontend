import React from 'react';
import './index.css';
import DanceStyles from '../../../constants/dance-styles';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="homePageContainer">
      {DanceStyles.map((danceStyle) => (<>
        <Link to={`/style/${danceStyle.id}`}>
          <div className="label">{danceStyle.label}</div>
          {danceStyle.picture !== '' ? (
            <>
              <img src={danceStyle.picture} alt="" />
              <div className="image-overlay" />
            </>
          ) : null}
        </Link>
      </>))}
    </div>
  );
}

export default Home;
