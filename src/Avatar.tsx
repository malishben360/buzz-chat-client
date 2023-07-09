import React from "react";

interface AvatarProps {
  id: string;
  username: string;
  online: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ id, username, online }) => {
  const colors = [
    "bg-blue-200",
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-yellow-200",
    "bg-teal-200",
  ];

  const idBase10 = Number.parseInt(id, 16);
  const colorIndex = (idBase10 * 100) % colors.length;
  const color = colors[colorIndex];
  return (
    <div
      className={"relative flex items-center w-8 h-8 rounded-full ".concat(
        color
      )}
    >
      <div className="w-full font-bold text-center opacity-50">
        {username[0].toLocaleUpperCase()}
      </div>
      {online && (
        <div className="absolute w-2 h-2 bg-green-500 rounded-full bottom-0 right-0"></div>
      )}
    </div>
  );
};

export default Avatar;
