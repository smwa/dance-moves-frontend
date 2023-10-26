import React, { Fragment, useEffect, useState } from 'react';
import './index.css';
import { useParams } from 'react-router-dom';
import getMove, { Response as getMoveResponse } from '../../../repositories/getMove';
import ReactPlayer from 'react-player';
import API_HOST from '../../../repositories/getApiHost';
import { OnProgressProps } from 'react-player/base';

function EditMove() {
  const { moveId } = useParams();
  const [move, setMove] = useState<getMoveResponse>(null);
  const [videoDuration, setVideoDuration] = useState<number>(10000);
  const [videoPosition, setVideoPosition] = useState<number>(0);

  const [startTime, setStartTime] = useState<string>('0');
  const [endTime, setEndTime] = useState<string>('0');

  useEffect(() => {
    const moveIdInt = parseInt(moveId ?? '-1', 10);
    getMove(moveIdInt).then(setMove);
  }, [moveId]);

  useEffect(() => {
    setStartTime(move?.video_start_time.toFixed(1) ?? '0');
    setEndTime(move?.video_end_time.toFixed(1) ?? '0');
  }, [move]);

  if (move === null) {
    return null;
  }

  const onVideoLoad = (player: ReactPlayer) => {
    const duration = player.getDuration();
    if (duration !== null) {
      setVideoDuration(duration);
      if (move.video_end_time < 0.1) {
        setEndTime(duration.toFixed(1));
      }
    }
  };

  const onVideoProgress = (prpgressProps: OnProgressProps) => {
    setVideoPosition(prpgressProps.playedSeconds);
  };

  return (
    <div className="editMovePageContainer defaultPageContainer">
      <ReactPlayer
        url={`${API_HOST}${move.video}`}
        loop={true}
        onReady={onVideoLoad}
        onProgress={onVideoProgress}
        progressInterval={100}
        controls={true}
        config={{
          file: {
            forceVideo: true,
          },
        }}
      />

      <h3>Start of clip</h3>
      <div className="timeContainer">
        <input type="number" min={0} max={videoDuration - 1} value={startTime} onChange={(e) => {setStartTime(e.target.value)}} />
        <button type="button" onClick={() => {setStartTime(videoPosition.toFixed(1))}}>Set to current clip time</button>
      </div>

      <h3>End of clip</h3>
      <div className="timeContainer">
        <input type="number" min={0} max={videoDuration} value={endTime} onChange={(e) => {setEndTime(e.target.value)}} />
        <button type="button" onClick={() => {setEndTime(videoPosition.toFixed(1))}}>Set to current clip time</button>
      </div>

    </div>
  );
}

export default EditMove;
