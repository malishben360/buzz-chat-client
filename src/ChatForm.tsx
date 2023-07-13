import React from "react";

interface ChatFormProps {
  text: string;
  setText: (text: string) => void;
  onClick: (
    ev: React.FormEvent<HTMLFormElement>,
    filePayload: IFile | null
  ) => void;
  onChange: (ev: React.FormEvent<HTMLInputElement>) => void;
}

interface IFile {
  name: string | null;
  data: string | null | ArrayBuffer | undefined;
}

const ChatForm: React.FC<ChatFormProps> = ({
  text,
  setText,
  onClick,
  onChange,
}) => {
  const handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    onClick(ev, null);
  };
  const handleFileSubmit = (ev: React.FormEvent<HTMLInputElement>) => {
    onChange(ev);
  };
  return (
    <>
      <form className="flex gap-2" onSubmit={handleFormSubmit}>
        <div className="flex flex-grow bg-white border rounded-md">
          <input
            type="text"
            value={text}
            placeholder="Type your message here"
            className="flex-grow bg-white p-2 rounded-tl-md rounded-bl-md focus: outline-none"
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              setText(ev.currentTarget.value)
            }
          />
          <label
            htmlFor="file"
            className="flex p-2 text-gray-400 items-center border-l border-gray-300 rounded-br-md rounded-tr-md bg-white"
          >
            <input
              type="file"
              name="file"
              id="file"
              className="hidden"
              onChange={handleFileSubmit}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
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
