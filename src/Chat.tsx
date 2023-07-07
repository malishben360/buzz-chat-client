import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";

interface Person {
  id: string;
  username: string;
}

const Chat: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlinePeople, setOnlinePeople] = useState<Record<string, string>>({});
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
      <div className="w-1/3 pl-4 pt-4 bg-white">
        <div className="flex mb-4 text-md font-bold text-blue-700 gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" />
            <path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 001.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.915V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0014 6z" />
          </svg>
          BuzzChat
        </div>
        {Object.keys(onlinePeople).map((id) => (
          <div className="flex gap-1 py-2 items-center mb-2 border-b-2 border-gray-100 cursor-pointer">
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
