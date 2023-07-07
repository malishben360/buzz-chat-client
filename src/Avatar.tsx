import React from "react";

interface AvatarProps {
  id: string;
  username: string;
}

const Avatar: React.FC<AvatarProps> = ({ id, username }) => {
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
  console.log(colorIndex);
  return (
    <div className={"flex items-center w-8 h-8 rounded-full ".concat(color)}>
      <div className="w-full font-bold text-center opacity-50">
        {username[0].toLocaleUpperCase()}
      </div>
    </div>
  );
};

export default Avatar;
