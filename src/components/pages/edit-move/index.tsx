import React, { ChangeEvent, FormEvent, KeyboardEventHandler, useEffect, useState } from 'react';
import './index.css';
import { useNavigate, useParams } from 'react-router-dom';
import getMove, { Response as getMoveResponse } from '../../../repositories/getMove';
import ReactPlayer from 'react-player';
import API_HOST from '../../../repositories/getApiHost';
import { OnProgressProps } from 'react-player/base';
import DanceStyles from '../../../constants/dance-styles';
import Tags from '../../tags';
import updateMove from '../../../repositories/updateMove';

function EditMove() {
  const navigate = useNavigate();
  const { moveId } = useParams();
  const [move, setMove] = useState<getMoveResponse>(null);
  const [videoDuration, setVideoDuration] = useState<number>(10000);
  const [videoPosition, setVideoPosition] = useState<number>(0);
  const [newTag, setNewTag] = useState<string>('');

  const [startTime, setStartTime] = useState<string>('0');
  const [endTime, setEndTime] = useState<string>('0');
  const [name, setName] = useState<string>('');
  const [dancersInVideo, setDancersInVideo] = useState<string>('');
  const [danceStyle, setDanceStyle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const moveIdInt = parseInt(moveId ?? '-1', 10);
    getMove(moveIdInt).then(setMove);
  }, [moveId]);

  useEffect(() => {
    if (move) {
      setStartTime(move.video_start_time.toFixed(1));
      setEndTime(move.video_end_time.toFixed(1));
      setName(move.name)
      setDancersInVideo(move.dancers_in_video)
      setDanceStyle(move.dance_style);
      setTags(move.tags);
    }
  }, [move]);

  if (move === null) {
    return null;
  }

  const onVideoLoad = (player: ReactPlayer) => {
    let duration = player.getDuration();
    if (duration !== null) {
      duration = (Math.floor(duration * 10.0) / 10.0);
      setVideoDuration(duration);
      if (move.video_end_time < 0.1) {
        setEndTime(duration.toFixed(1));
      }
    }
  };

  const onVideoProgress = (prpgressProps: OnProgressProps) => {
    setVideoPosition(prpgressProps.playedSeconds);
  };

  const onDanceStyleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDanceStyle(e.target.value);
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    const _move = {...move};
    _move.video_start_time = parseFloat(startTime);
    _move.video_end_time = parseFloat(endTime);
    _move.name = name;
    _move.dancers_in_video = dancersInVideo;
    _move.dance_style = danceStyle;
    _move.tags = tags;
    try {
      await updateMove(_move);
    }
    catch (e) {
      alert(e);
      return;
    }
    navigate(`/move/${move.id}`);
  };

  const newTagKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      addNewTag();
      e.preventDefault();

    }
  }

  const addNewTag = () => {
    if (newTag === '') return;
    setTags(Array.from(new Set([...tags, newTag])));
    setNewTag("");
  };

  return (
    <form onSubmit={onSave}>
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
        <div className="inputRowContainer">
          <input type="number" min={0} max={videoDuration - 0.2} value={startTime} onChange={(e) => {setStartTime(e.target.value)}} />
          <button type="button" onClick={() => {setStartTime(videoPosition.toFixed(1))}}>Set to current clip time</button>
        </div>

        <h3>End of clip</h3>
        <div className="inputRowContainer">
          <input type="number" min={startTime + 0.1} max={videoDuration} value={endTime} onChange={(e) => {setEndTime(e.target.value)}} />
          <button type="button" onClick={() => {setEndTime(videoPosition.toFixed(1))}}>Set to current clip time</button>
        </div>

        <h3>Name</h3>
        <input required type="text" placeholder='Type Name Here' value={name} className="standalone-textinput" onChange={(e) => {setName(e.target.value)}} />

        <h3>Dancers</h3>
        <input type="text" placeholder='Type Names of Dancers Here' className="standalone-textinput" value={dancersInVideo} onChange={(e) => {setDancersInVideo(e.target.value)}} />

        <h3>Dance Style</h3>
        <select onChange={onDanceStyleChange} value={danceStyle}>
          {DanceStyles.map((option, index) => {
            return (
              <option value={option.id} key={index}>
                {option.label}
              </option>
            );
          })}
        </select>

        <h3>Tags</h3>
        <Tags tags={tags} onChange={setTags} />

        <div className="inputRowContainer">
          <input type="text" onKeyDown={newTagKeyDown} placeholder='Type New Tag Here' value={newTag} onChange={(e) => {setNewTag(e.target.value)}} />
          <button type="button" onClick={addNewTag}>Add Tag</button>
        </div>

        <button type="submit">Save</button>

      </div>
    </form>
  );
}

export default EditMove;
