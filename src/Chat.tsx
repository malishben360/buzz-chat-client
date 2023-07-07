import React, { useEffect, useState } from "react";

import Avatar from "./Avatar";
import Logo from "./logo";
interface Person {
  id: string;
  username: string;
}

const Chat: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlinePeople, setOnlinePeople] = useState<Record<string, string>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:9000");
    setWs(webSocket);
    webSocket.addEventListener("message", messageHandler);

    // Clean up the WebSocket connection on component unmount
    // return () => {
    //   webSocket.removeEventListener("message", messageHandler);
    //   webSocket.close();
    // };
  }, []);

  const showOnlinePeople = (peopleArray: Person[]): void => {
    const people: Record<string, string> = {};
    peopleArray.forEach(({ id, username }) => {
      people[id] = username;
    });
    setOnlinePeople(people);
  };

  const messageHandler = (e: MessageEvent): void => {
    const messageData: Record<string, Person[]> = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
  };
  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-white">
        <Logo />
        {Object.keys(onlinePeople).map((id) => (
          <div
            className={
              "flex gap-1 py-2 pl-4 items-center border-b-2 border-gray-100 cursor-pointer " +
              (selectedUserId === id ? "bg-blue-50" : "")
            }
            onClick={() => setSelectedUserId(id)}
          >
            <Avatar id={id} username={onlinePeople[id]} />
            <span className="text-gray-700">{onlinePeople[id]}</span>
          </div>
        ))}
      </div>
      <div className="flex p-2 flex-col w-2/3 bg-blue-100">
        <div className="flex-grow">Selected contact messages</div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message here"
            className="bg-white p-2 flex-grow border rounded-md"
          />
          <button className="flex justify-center items-center p-2 bg-blue-500 border rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-12 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
