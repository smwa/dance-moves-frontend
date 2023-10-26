import API_HOST from './getApiHost';

type _User = {
  email: string;
};

type UserResponse = {
  user: null|_User;
  login_url?: string;
  logout_url?: string;
}

const get = async (): Promise<UserResponse> => {
  return fetch(`${API_HOST}/user/`, {credentials: 'include'}).then((res) => res.json());
};

export { get };
export type { UserResponse };
