import ENV from "../environment/env";

class UserService {
  findAll() {
    return fetch(`${ENV.API_URL}/auth/usuarios`).then((res) => res.json());
  }
}

const userService = new UserService();

export default userService;
