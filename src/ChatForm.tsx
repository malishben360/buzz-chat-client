import React from "react";

interface ChatFormProps {
  text: string;
  setText: (text: string) => void;
  submitHandler: (ev: React.FormEvent<HTMLFormElement>) => void;
}

const ChatForm: React.FC<ChatFormProps> = ({
  text,
  setText,
  submitHandler,
}) => {
  return (
    <>
      <form className="flex gap-2" onSubmit={submitHandler}>
        <input
          type="text"
          value={text}
          placeholder="Type your message here"
          className="bg-white p-2 flex-grow border rounded-md"
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
            setText(ev.currentTarget.value)
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
    </>
  );
};

export default ChatForm;
