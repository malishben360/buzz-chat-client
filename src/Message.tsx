import React from "react";

interface IMessage {
  id: string;
  sender: string;
  recipient: string;
  text: string;
}

interface MessageProps {
  id: string | null;
  message: IMessage;
}

const Message: React.FC<MessageProps> = ({ id, message }) => {
  return (
    <div className={message.sender === id ? "text-right" : "text-left"}>
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
  );
};

export default Message;
