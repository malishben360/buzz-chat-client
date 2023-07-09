import React from "react";
import Avatar from "./Avatar";

interface ContactDisplayProps {
  users: Record<string, string>;
  selectedUserId: string | null;
  online: boolean;
  selectUserId: (id: string) => void;
}

const ContactDisplay: React.FC<ContactDisplayProps> = ({
  users,
  selectedUserId,
  online,
  selectUserId,
}) => {
  return (
    <>
      {Object.keys(users).map((id) => (
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
            <Avatar id={id} username={users[id]} online={online} />
            <span className="text-gray-700">{users[id]}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default ContactDisplay;
