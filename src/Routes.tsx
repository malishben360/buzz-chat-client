import React, { useContext } from "react";

import LoginOrRegisterForm from "./LoginOrRegisterForm";
import Chat from "./Chat";
import { UserContext } from "./UserContext";

const Routes: React.FC = () => {
  const { username } = useContext(UserContext);

  if (username) {
    return (
      <div>
        <Chat />
      </div>
    );
  } else {
    return (
      <div>
        <LoginOrRegisterForm />
      </div>
    );
  }
};

export default Routes;
