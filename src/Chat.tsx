import React, { useContext, useEffect, useRef, useState } from "react";

import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import { uniqBy, times, sample } from "lodash";
import axios, { type AxiosResponse, type AxiosError } from "axios";
interface IUser {
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
  const [onlineUsers, setOnlineUsers] = useState<Record<string, string>>({});
  const [offlineUsers, setOfflineUsers] = useState<Record<string, string>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    localStorage.getItem("selectedUserId") || null
  );
  const [messages, setMesages] = useState<IMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState<string>("");
  const divUnderMessages = useRef<HTMLDivElement>(null);
  const { id } = useContext(UserContext);

  useEffect(() => {
    connectToWebSocket(receiveMessage);
  }, []);

  useEffect(() => {
    // Don't send request when selected user id is null.
    if (selectedUserId !== null) {
      axios("/messages/" + selectedUserId)
        .then((res: AxiosResponse) => {
          const data = res.data;
          setMesages(() => data);
        })
        .catch((err: AxiosError) => {
          console.log("Error: ", err);
        });
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (divUnderMessages.current) {
      divUnderMessages.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  useEffect(() => {
    axios
      .get("/users")
      .then((res: AxiosResponse) => {
        // Filter out online users.
        const usersArray = res.data.filter(
          (user: IUser) => !Object.keys(onlineUsers).includes(user.id)
        );

        const users: Record<string, string> = {};
        usersArray.forEach((user: IUser) => {
          users[user.id] = user.username;
        });

        setOfflineUsers(users);
      })
      .catch((err) => {
        console.log("Fetch users failed", err);
      });
  }, [onlineUsers, id]);

  const connectToWebSocket = (receiveMessage: (ev: MessageEvent) => void) => {
    const webSocket = new WebSocket("ws://localhost:9000");
    setWs(webSocket);
    webSocket.addEventListener("message", receiveMessage);
    webSocket.addEventListener("close", () => {
      setTimeout(() => {
        connectToWebSocket(receiveMessage);
      }, 1000);
    });
  };

  const showonlineUsers = (usersArray: IUser[]): void => {
    // Remove dupplicate records.
    const users: Record<string, string> = {};
    usersArray.forEach(({ id, username }) => {
      users[id] = username;
    });

    // Set online users.
    setOnlineUsers(users);
  };

  // Handle incoming message envent and the  corresponding data.
  const receiveMessage = (ev: MessageEvent): void => {
    const messageData: Record<string, IUser[]> | IMessage = JSON.parse(ev.data);

    if ("online" in messageData) {
      showonlineUsers(messageData.online);
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

  const selectUserId = (id: string): void => {
    setSelectedUserId(() => id);
    localStorage.setItem("selectedUserId", id);
  };

  //  Remove current user from the contact list.
  const onlineUsersExcluded = { ...onlineUsers };
  delete onlineUsersExcluded[id as string];

  // Remove dupplicate messages.
  const messagesWithoutDups = uniqBy(messages, "id");
  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-white">
        <Logo />
        {/* Contact section */}
        {Object.keys(onlineUsersExcluded).map((id) => (
          <div
            key={id}
            className={
              "flex gap-1 items-center border-b-2 border-gray-100 cursor-pointer " +
              (selectedUserId === id ? "bg-blue-50" : "")
            }
            onClick={() => selectUserId(id)}
          >
            <div
              className={
                "w-1 h-12 rounded-tr-full " +
                (id === selectedUserId ? "bg-blue-500" : "")
              }
            ></div>
            <div className="flex py-2 pl-4 gap-1 items-center">
              <Avatar id={id} username={onlineUsers[id]} online={true} />
              <span className="text-gray-700">{onlineUsers[id]}</span>
            </div>
          </div>
        ))}
        {Object.keys(offlineUsers).map((id) => (
          <div
            key={id}
            className={
              "flex gap-1 items-center border-b-2 border-gray-100 cursor-pointer " +
              (selectedUserId === id ? "bg-blue-50" : "")
            }
            onClick={() => selectUserId(id)}
          >
            <div
              className={
                "w-1 h-12 rounded-tr-full " +
                (id === selectedUserId ? "bg-blue-500" : "")
              }
            ></div>
            <div className="flex py-2 pl-4 gap-1 items-center">
              <Avatar id={id} username={offlineUsers[id]} online={false} />
              <span className="text-gray-700">{offlineUsers[id]}</span>
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
