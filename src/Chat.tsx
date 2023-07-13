import React, { useContext, useEffect, useRef, useState } from "react";

import Logo from "./Logo";
import ChatForm from "./ChatForm";
import Message from "./Message";
import Contact from "./Contact";
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
  file: string | null;
}

interface IFile {
  name: string | null;
  data: string | null | ArrayBuffer | undefined;
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
  const { id, username, setId, setUsername } = useContext(UserContext);

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
  }, [onlineUsers]);

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

  const sendFile = (ev: React.FormEvent<HTMLInputElement>) => {
    const file = ev.currentTarget?.files && ev.currentTarget.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const fileBase64 = reader.result;
      const filePayload = {
        name: file?.name as string,
        data: fileBase64,
      };

      sendMessage(null, filePayload);
    };

    if (file) {
      reader.readAsDataURL(file as Blob);
    }
  };

  const sendMessage = async (
    ev: React.FormEvent<HTMLFormElement> | null,
    filePayload: IFile | null
  ): Promise<void> => {
    // Prevent default behavour when submit button is clicked.
    if (!filePayload) {
      ev?.preventDefault();
    }

    const message = {
      sender: id,
      recipient: selectedUserId,
      text: newMessageText,
      file: filePayload,
    };

    ws?.send(JSON.stringify(message));

    // Reset form.
    setNewMessageText("");

    if (filePayload) {
      console.log("Hey! I have a file with me.");
      axios("/messages/" + selectedUserId)
        .then((res: AxiosResponse) => {
          const data = res.data;
          setMesages(() => data);
        })
        .catch((err: AxiosError) => {
          console.log("Error: ", err);
        });
    } else {
      console.log("Ooh! no I do not have a file with me!");
      // Generate random id for the message.
      const messageId = times(25, () => sample("0123456789abcdef")).join("");
      setMesages((prev) => [
        ...prev,
        {
          id: messageId,
          sender: id,
          recipient: selectedUserId,
          text: newMessageText,
          file: null,
        } as IMessage,
      ]);
    }
  };

  const selectUserId = (id: string): void => {
    setSelectedUserId(() => id);
    localStorage.setItem("selectedUserId", id);
  };

  const logout = async () => {
    await axios
      .post("/auth/logout")
      .then(() => {
        localStorage.removeItem("selectedUserId");
        setWs(null);
        setId(null);
        setUsername(null);
      })
      .catch((err: AxiosError) => console.log("Logout Error: ", err));
  };

  //  Remove current user from the contact list.
  const onlineUsersExcluded = { ...onlineUsers };
  delete onlineUsersExcluded[id as string];

  // Remove dupplicate messages.
  const messagesWithoutDups = uniqBy(messages, "id");

  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-1/3 bg-white">
        <Logo />
        {/* Contact section */}
        <div className="flex-grow">
          {Object.keys(onlineUsersExcluded).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              username={onlineUsersExcluded[userId]}
              selectedId={selectedUserId}
              online={true}
              onClick={selectUserId}
            />
          ))}
          {Object.keys(offlineUsers).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              username={offlineUsers[userId]}
              selectedId={selectedUserId}
              online={false}
              onClick={selectUserId}
            />
          ))}
        </div>
        {/* End of contact section */}
        <div className="flex p-3 space-x-2 justify-center bg-blue-50">
          <span className="flex text-sm text-gray-600 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>

            {username}
          </span>
          <button
            className="p-1 px-2 text-sm border text-gray-600 border-blue-300 bg-blue-200 rounded-sm cursor-pointer"
            onClick={logout}
          >
            Logout
          </button>
        </div>
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
                  <Message key={message.id} id={id} message={message} />
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
          {/* End of messages section */}
        </div>
        {/* Chat form */}
        {!!selectedUserId && (
          <ChatForm
            text={newMessageText}
            setText={setNewMessageText}
            onClick={sendMessage}
            onChange={sendFile}
          />
        )}
        {/* End of chat form */}
      </div>
      {/* End of chat section */}
    </div>
  );
};

export default Chat;
