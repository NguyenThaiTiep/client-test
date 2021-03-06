import API from "../..";
import { UserInputDto } from "../../user/user/dto";
import { Account } from "./dto/account";

const baseUrl = "/authenticate";
const login = (input: Account) => {
  return API.post(`${baseUrl}/login`, { account: input });
};
const logout = () => {
  return API.post(`${baseUrl}/logout`);
};

const resigter = (input: UserInputDto) => {
  return API.post(`${baseUrl}/register`, { account: input });
};
const forgetPassWord = (email: string) => {
  return API.put(`${baseUrl}/resetPassword`, { email: email });
};
export const AuthApi = { login, logout, resigter, forgetPassWord };
