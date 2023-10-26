import API_HOST from './getApiHost';
import { Move } from './getMove';

const updateMove = async (move: Move) => {
  try {
    await fetch(`${API_HOST}/move/${move.id}`, {
      credentials: 'include',
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dance_style: move.dance_style,
        name: move.name,
        dancers_in_video: move.dancers_in_video,
        video_start_time: move.video_start_time,
        video_end_time: move.video_end_time,
        tags: move.tags,
      }),
    });
  } catch (e) {
    console.error(e);
    throw new Error();
  }
};

export default updateMove;
