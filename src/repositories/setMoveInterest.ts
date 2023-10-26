import API_HOST from './getApiHost';

const setMoveInterest = async (move_id: number, interest: number) => {
  try {
    await fetch(`${API_HOST}/interest/${move_id}`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({interest}),
    });
  } catch (e) {
    console.error(e);
    throw new Error();
  }
};

export default setMoveInterest;
