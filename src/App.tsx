import axios from "axios";

import Routes from "./Routes";

import { UserContextProvider } from "./UserContext";

const App: React.FC = () => {
  axios.defaults.baseURL = "http://localhost:9000/api/v1";
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
};

export default App;
