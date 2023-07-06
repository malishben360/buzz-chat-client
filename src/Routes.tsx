import React, { useContext } from "react";

import LoginOrRegisterForm from "./LoginOrRegisterForm";
import Chat from "./Chat";
import { UserContext } from "./UserContext";

const Routes: React.FC = () => {
  const { id, username } = useContext(UserContext);

  if (username) {
    return (
      <div>
        <Chat />
      </div>
    );
  }
  return (
    <div>
      <LoginOrRegisterForm />
    </div>
  );
};

export default Routes;
