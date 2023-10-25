type _User = {
  email: string;
};

type UserResponse = {
  user: null|_User;
  login_url?: string;
  logout_url?: string;
}

const get = async (): Promise<UserResponse> => {
  return fetch("http://localhost:8000/user/", {credentials: 'include'}).then((res) => res.json()); // TODO fix url
};

export { get };
export type { UserResponse };
