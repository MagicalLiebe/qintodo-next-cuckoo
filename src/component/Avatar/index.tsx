import Image from "next/image";
import type { VFC } from "react";

type Props = {
  image: string;
  size: "small" | "large";
  isRounded: boolean;
  onClick?: VoidFunction;
};

export const Avatar: VFC<Props> = (props) => {
  const { image, isRounded, onClick, size } = props;

  return (
    <div
      className={`bg-gradient-to-br from-pink-300 via-yellow-300 to-sky-300
      ${size == "small" ? "p-1" : "p-2"}
      ${isRounded && "rounded-full"}`}
    >
      <div
        className={`aspect-square bg-white rounded-full ${
          size == "small" ? "w-10 h-10" : "w-24 h-24"
        }`}
      >
        <Image
          className="rounded-full cursor-pointer"
          src={image ? image : "/avatar.svg"}
          width={size == "small" ? 40 : 128}
          height={size == "small" ? 40 : 128}
          alt="avatar"
          onClick={onClick}
        />
      </div>
    </div>
  );
};
