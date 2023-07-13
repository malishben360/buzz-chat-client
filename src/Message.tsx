import React from "react";
import axios from "axios";

interface IMessage {
  id: string;
  sender: string;
  recipient: string;
  text: string;
  file: string | null;
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
        <div>
          {message.text}
          {message.file && (
            <span className="flex underline underline-offset-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={
                  "w-5 h-5" + (message.sender === id ? "text-gray-400" : "")
                }
              >
                <path
                  fillRule="evenodd"
                  d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                  clipRule="evenodd"
                />
              </svg>
              <a
                href={axios.defaults.baseURL + "/uploads/" + message.file}
                target="_blank"
                rel="noopener noreferrer"
              >
                s{message.file}
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
