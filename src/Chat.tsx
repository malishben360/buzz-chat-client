import React, { useContext, useEffect, useState } from "react";

import Avatar from "./Avatar";
import Logo from "./logo";
import { UserContext } from "./UserContext";
interface Person {
  id: string;
  username: string;
}
interface Message {
  text: string;
  isOur: boolean;
}

interface IncomingMessage {
  sender: string;
  text: string;
}

const Chat: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlinePeople, setOnlinePeople] = useState<Record<string, string>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMesages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState<string>("");
  const { id } = useContext(UserContext);

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

  const messageHandler = (ev: MessageEvent): void => {
    const messageData: Record<string, Person[]> | IncomingMessage = JSON.parse(
      ev.data
    );
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else {
      const message = messageData as IncomingMessage;
      setMesages((prev) => [...prev, { text: message.text, isOur: true }]);
    }
  };

  const sendMessage = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    ws?.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
      })
    );
    setNewMessageText("");
    setMesages((prev) => [...prev, { text: newMessageText, isOur: true }]);
  };

  // Exclude the current user from the contact list.
  const onlinePeopleExcluded = { ...onlinePeople };
  delete onlinePeopleExcluded[id as string];
  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-white">
        <Logo />
        {Object.keys(onlinePeopleExcluded).map((id) => (
          <div
            key={id}
            className={
              "flex gap-1 items-center border-b-2 border-gray-100 cursor-pointer " +
              (selectedUserId === id ? "bg-blue-50" : "")
            }
            onClick={() => setSelectedUserId(id)}
          >
            <div
              className={
                "w-1 h-12 rounded-tr-full " +
                (id === selectedUserId ? "bg-blue-500" : "")
              }
            ></div>
            <div className="flex py-2 pl-4 gap-1 items-center">
              <Avatar id={id} username={onlinePeople[id]} />
              <span className="text-gray-700">{onlinePeople[id]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex p-2 flex-col w-2/3 bg-blue-100">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="h-full flex justify-center items-center">
              <div className="text-gray-300">
                &larr; Select a person from the sidebar
              </div>
            </div>
          )}
          {!!messages && (
            <div>
              {messages.map((message) => (
                <div>{message.text}</div>
              ))}
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessageText}
              placeholder="Type your message here"
              className="bg-white p-2 flex-grow border rounded-md"
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                setNewMessageText(ev.currentTarget.value)
              }
            />
            <button
              type="submit"
              className="flex justify-center items-center p-2 bg-blue-500 border rounded-md"
            >
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
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
