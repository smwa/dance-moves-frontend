type _User = {
  email: string;
};

type UserResponse = {
  user: null|_User;
  login_url?: string;
  logout_url?: string;
}

let prod = true;
if (parseInt(window.location.port, 10) >= 444 || parseInt(window.location.port, 10) <= 442) {
  prod = false;
}

const api_host = (prod ? 'https://dance-moves-api.mechstack.dev' : 'http://localhost:8000');

const get = async (): Promise<UserResponse> => {
  return fetch(`${api_host}/user/`, {credentials: 'include'}).then((res) => res.json());
};

export { get };
export type { UserResponse };
