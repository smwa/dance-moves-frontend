import API_HOST from './getApiHost';

type Response = {
  success: boolean,
  move_id: number,
}

const createMove = async (fileInputElement: HTMLInputElement, danceStyle: string): Promise<Response> => {
  if (!fileInputElement === null || fileInputElement.files === null || fileInputElement.files.length < 1) {
    const _response: Response = {
      success: false,
      move_id: 0,
    };
    return _response;
  }
  const data = new FormData();
  data.append('file', fileInputElement.files[0]);
  let response;
  try {
    response = await fetch(`${API_HOST}/move/?style=${danceStyle}`, {credentials: 'include', method: 'POST', body: data});
  } catch (e) {
    console.error(e);
    const _response: Response = {
      success: false,
      move_id: 0,
    };
    return _response;
  }

  response = await response.json();
  const _response: Response = {
    success: true,
    move_id: response.move.id,
  };
  return _response;

};

export default createMove;
export type { Response };
