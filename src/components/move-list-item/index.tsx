import React, { useEffect, useState } from 'react';
import './index.css';
import { Move } from '../../repositories/getMove';
import { useGet } from '../../contexts/UserContext';
import { Edit } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Tags from '../tags';
import API_HOST from '../../repositories/getApiHost';
import ReactPlayer from 'react-player';
import { OnProgressProps } from 'react-player/base';

function MoveListItem({ move }: { move: Move }) {
  const userResponse = useGet();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<ReactPlayer|null>(null)

  useEffect(() => {
    if (player) {
      player.seekTo(move.video_start_time);
    }
  }, [player]);

  const onVideoLoad = (player: ReactPlayer) => {
    setPlayer(player);
  };

  const onVideoProgress = (progressProps: OnProgressProps) => {
    if (progressProps.playedSeconds > move.video_end_time) {
      if (player) {
        player.seekTo(move.video_start_time);
      }
    }
  };

  return (
    <div className="moveListItem">
      <h2>
        {move.name}
        {
          (userResponse && userResponse.user && move.creator === userResponse?.user.id) ? (
            <button onClick={() => {navigate(`/move/${move.id}/edit`)}}>
              <Edit />
            </button>
          ) : null}
      </h2>
      {move.dancers_in_video ? (<h3><small>{move.dancers_in_video}</small></h3>) : null}

      <ReactPlayer
        url={`${API_HOST}${move.video}`}
        loop={true}
        onReady={onVideoLoad}
        onProgress={onVideoProgress}
        progressInterval={250}
        muted={true}
        wrapper={({children}) => (<div className='videoWrapper'>{children}</div>)}
        controls={true}
        config={{
          file: {
            forceVideo: true,
          },
        }}
      />

      <Tags tags={move.tags} />
    </div>
  );
}

export default MoveListItem;
