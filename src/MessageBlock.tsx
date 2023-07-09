import React from "react";

interface IMessage {
  id: string;
  sender: string;
  recipient: string;
  text: string;
}

interface MessageBlockProps {
  userId: string | null;
  messages: IMessage[];
}
const MessageBlock: React.FC<MessageBlockProps> = ({ userId, messages }) => {
  return (
    <>
      {messages.map((message) => (
        <div
          key={message.id}
          className={message.sender === userId ? "text-right" : "text-left"}
        >
          <div
            className={
              "inline-block p-2 my-2 text-sm text-left rounded-md" +
              " " +
              (message.sender === userId
                ? "bg-white text-gray-600"
                : "bg-blue-500 text-white")
            }
          >
            <div>Sender: {message.sender}</div>
            <div>My id: {userId}</div>
            <div>{message.text}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MessageBlock;
