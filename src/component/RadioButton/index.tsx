import type { VFC } from "react";
import { useCallback } from "react";
import type { TodoType } from "src/lib/SupabaseClient";

type Style = {
  centerColor: string;
  handleEditIsComplete: (
    itemId: number,
    itemiscomplete: boolean
  ) => Promise<void>;
  item: TodoType;
};

export const RadioButton: VFC<Style> = (props) => {
  const { centerColor, handleEditIsComplete, item } = props;
  const bgColor: string = item.iscomplete
    ? centerColor
    : "bg-white dark:bg-[#22272E]";

  const handleJudgeCompleted = useCallback(() => {
    handleEditIsComplete(item.id, !item.iscomplete);
  }, [item.iscomplete, item.id, handleEditIsComplete]);

  return (
    <>
      <div
        onClick={handleJudgeCompleted}
        className="absolute top-2 left-0 mr-2 h-[24px]"
      >
        <input
          type="radio"
          className={`${bgColor} radio border-gray-200 outline-none focus:outline-none checked:outline-none`}
          readOnly
          checked={item.iscomplete}
        ></input>
      </div>
    </>
  );
};
