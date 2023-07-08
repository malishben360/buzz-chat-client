import React, { useContext, useEffect, useRef, useState } from "react";

import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import { uniqBy, times, sample } from "lodash";
interface IPerson {
  id: string;
  username: string;
}
interface IMessage {
  id: string;
  sender: string;
  recipient: string;
  text: string;
}

const Chat: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlinePeople, setOnlinePeople] = useState<Record<string, string>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMesages] = useState<IMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState<string>("");
  const divUnderMessages = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (divUnderMessages.current) {
      divUnderMessages.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const showOnlinePeople = (peopleArray: IPerson[]): void => {
    // Remove dupplicate records.
    const people: Record<string, string> = {};
    peopleArray.forEach(({ id, username }) => {
      people[id] = username;
    });

    // Set online people.
    setOnlinePeople(people);
  };

  // Handle incoming message envent and the  corresponding data.
  const messageHandler = (ev: MessageEvent): void => {
    const messageData: Record<string, IPerson[]> | IMessage = JSON.parse(
      ev.data
    );
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMesages((prev) => [...prev, { ...(messageData as IMessage) }]);
    }
  };

  const sendMessage = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    ws?.send(
      JSON.stringify({
        sender: id,
        recipient: selectedUserId,
        text: newMessageText,
      })
    );

    // Reset form.
    setNewMessageText("");

    // Generate random id for the message.
    const messageId = times(25, () => sample("0123456789abcdef")).join("");
    setMesages((prev) => [
      ...prev,
      {
        id: messageId,
        sender: id,
        recipient: selectedUserId,
        text: newMessageText,
      } as IMessage,
    ]);
  };

  //  Remove current user from the contact list.
  const onlinePeopleExcluded = { ...onlinePeople };
  delete onlinePeopleExcluded[id as string];

  // Remove dupplicate messages.
  const messagesWithoutDups = uniqBy(messages, "id");
  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-white">
        <Logo />
        {/* Contact section */}
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
        {/* End of contact section */}
      </div>
      {/* Chat section */}
      <div className="flex p-2 flex-col w-2/3 bg-blue-100">
        <div className="flex-grow">
          {/* Empty messages section */}
          {!selectedUserId && (
            <div className="flex h-full flex-grow justify-center items-center">
              <div className="text-gray-300">
                &larr; Select a person from the sidebar
              </div>
            </div>
          )}
          {/* End of empty messages section */}
          {/* Messages section */}
          {!!messages && (
            <div className={"relative " + (!!selectedUserId && "h-full")}>
              <div className="overflow-y-scroll absolute inset-0">
                {messagesWithoutDups.map((message) => (
                  <div
                    className={
                      message.sender === id ? "text-right" : "text-left"
                    }
                  >
                    <div
                      className={
                        "inline-block p-2 my-2 text-sm text-left rounded-md" +
                        " " +
                        (message.sender === id
                          ? "bg-white text-gray-600"
                          : "bg-blue-500 text-white")
                      }
                    >
                      <div>Sender: {message.sender}</div>
                      <div>My id: {id}</div>
                      <div>{message.text}</div>
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
          {/* End of messages section */}
        </div>
        {/* Chat form */}
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
        {/* End of chat form */}
      </div>
      {/* End of chat section */}
    </div>
  );
};

export default Chat;
