import API_HOST from './getApiHost';

type Move = {
  id: number,
  creator: string,
  dance_style: string,
  dancers_in_video: string,
  name: string,
  created: Date,
  video: string,
  is_video_processed: boolean,
  video_start_time: number,
  video_end_time: number,
  tags: string[],
  comments: {
    author: string,
    created: Date,
    message: string,
  }[],
  interest: number,
};

type Response = Move|null;

const parseApiMoveToObject: (arg0: any) => Move = (response: any) => ({
  id: response.id,
  creator: response.creator,
  dance_style: response.dance_style,
  dancers_in_video: response.dancers_in_video,
  name: response.name,
  created: new Date(response.created),
  video: response.video,
  is_video_processed: response.is_video_processed,
  video_start_time: response.video_start_time,
  video_end_time: response.video_end_time,
  tags: response.tags,
  comments: response.comments.map((comment: any) => {
    return {
      author: comment.author,
      created: new Date(comment.created),
      message: comment.message,
    };
  }),
  interest: response.interest,
});

const getMove = async (move_id: number): Promise<Response> => {
  let response;
  try {
    response = await fetch(`${API_HOST}/move/${move_id}`, {credentials: 'include'});
  } catch (e) {
    console.error(e);
    return null;
  }

  response = await response.json();
  return parseApiMoveToObject(response);
};

export default getMove;
export { parseApiMoveToObject };
export type { Response, Move };
