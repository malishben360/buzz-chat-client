import { useContext, useState } from "react";
import axios from "axios";

import { UserContext } from "./UserContext";

const LoginOrRegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const { setUsername: setLoggedUsername, setId } = useContext(UserContext);

  const submitHandler = async () => {
    const url =
      isLoginOrRegister === "register" ? "/auth/register" : "/auth/login";
    const { data } = await axios.post(url, {
      username: username,
      password: password,
    });

    if (data.id) {
      setLoggedUsername(username);
      setId(data.id);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="flex items-center bg-blue-50 h-screen">
      <form className="w-64 mx-auto">
        <input
          type="text"
          name="username"
          value={username}
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
          autoComplete="true"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(event.currentTarget.value)
          }
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
          autoComplete="true"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(event.currentTarget.value)
          }
        />
        <button
          type="submit"
          className="bg-blue-500 text-white block w-full rounded-sm p-2 mb-2 border"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            submitHandler();
          }}
        >
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-4">
          {isLoginOrRegister === "register" && (
            <div>
              Already a member?{" "}
              <button
                className="text-blue-500"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  setIsLoginOrRegister("login");
                }}
              >
                Login
              </button>
            </div>
          )}
          {isLoginOrRegister === "login" && (
            <div>
              Don't have an account?{" "}
              <button
                className="text-blue-500"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  setIsLoginOrRegister("register");
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginOrRegisterForm;
