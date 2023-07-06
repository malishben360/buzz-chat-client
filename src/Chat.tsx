import React from "react";

const Chat: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-white">contacts</div>
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
              stroke-width="1.5"
              stroke="currentColor"
              className="w-12 h-6 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
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
