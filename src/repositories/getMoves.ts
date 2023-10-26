import API_HOST from './getApiHost';
import { Move, parseApiMoveToObject } from './getMove';

type Response = Move[]|null;

const getMoves = async (): Promise<Response> => {
  let response;
  try {
    response = await fetch(`${API_HOST}/move/`, {credentials: 'include'});
  } catch (e) {
    console.error(e);
    return null;
  }

  response = await response.json();
  return response.moves.map(parseApiMoveToObject);
};

export default getMoves;
export type { Response };
