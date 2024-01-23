import { FC, useState } from "react";
import { ID, Task } from "../types";
import { Trash } from "@phosphor-icons/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { twMerge } from "tailwind-merge";
import { Popconfirm } from "./PopConfirm";

interface TaskCardProps {
  task: Task;
  updateTask: (id: ID, content: string) => void;
  deleteTask: (id: ID) => void;
  currentColor: string;
}

export const TaskCard: FC<TaskCardProps> = ({
  task,
  updateTask,
  deleteTask,
  currentColor,
}) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-mainBgColor min-h-10 max-h-32 p-2 flex items-center text-left border border-rose-500 cursor-grab relative opacity-30"
      />
    );
  }

  if (editMode) {
    return (
      <div
        className="bg-mainBgColor p-2 flex items-center text-left border border-mainBgColor hover:border-rose-500 cursor-grab relative"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <textarea
          className="w-full h-fit bg-transparent text-white focus:outline-none"
          value={task.content}
          onChange={(e) => updateTask(task.id, e.target.value)}
          autoFocus
          placeholder="Enter task"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              toggleEditMode();
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      onClick={toggleEditMode}
      className={twMerge(
        "min-h-10 max-h-32 p-2 flex items-center text-left  border border-mainBgColor hover:border-rose-500 cursor-grab",
        currentColor
      )}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <p className="my-auto w-full h-full overflow-x-hidden overflow-y-auto whitespace-pre-wrap task">
        {task.content}
      </p>

      {mouseIsOver && (
        <Popconfirm onConfirm={() => deleteTask(task.id)}>
          <Trash
            size={20}
            className="text-white hover:text-white/80 transition-all cursor-pointer"
          />
        </Popconfirm>
      )}
    </div>
  );
};
