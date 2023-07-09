import React from "react";
import Avatar from "./Avatar";

interface ContactProps {
  id: string;
  username: string;
  selectedId: string | null;
  online: boolean;
  onClick: (id: string) => void;
}

const Contact: React.FC<ContactProps> = ({
  id,
  username,
  selectedId,
  online,
  onClick,
}) => {
  // Handle on click event.
  const handleOnClick = () => {
    onClick(id);
  };

  return (
    <div
      onClick={handleOnClick}
      className={
        "flex gap-1 items-center border-b-2 border-gray-100 cursor-pointer " +
        (selectedId === id ? "bg-blue-50" : "")
      }
    >
      <div
        className={
          "w-1 h-12 rounded-tr-full " + (id === selectedId ? "bg-blue-500" : "")
        }
      ></div>
      <div className="flex py-2 pl-4 gap-1 items-center">
        <Avatar id={id} username={username} online={online} />
        <span className="text-gray-700">{username}</span>
      </div>
    </div>
  );
};

export default Contact;
