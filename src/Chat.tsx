import React, { useContext, useEffect, useRef, useState } from "react";

import Logo from "./Logo";
import ChatForm from "./ChatForm";
import ContactDisplay from "./ContactDisplay";
import { UserContext } from "./UserContext";
import { uniqBy, times, sample } from "lodash";
import axios, { type AxiosResponse, type AxiosError } from "axios";
import MessageBlock from "./MessageBlock";
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
        <ContactDisplay
          users={onlineUsersExcluded}
          selectedUserId={selectedUserId}
          online={true}
          selectUserId={selectUserId}
        />
        <ContactDisplay
          users={offlineUsers}
          selectedUserId={selectedUserId}
          online={false}
          selectUserId={selectUserId}
        />
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
                <MessageBlock userId={id} messages={messagesWithoutDups} />
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
            submitHandler={sendMessage}
          />
        )}
        {/* End of chat form */}
      </div>
      {/* End of chat section */}
    </div>
  );
};

export default Chat;
