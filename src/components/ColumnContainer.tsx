import { FC, useMemo, useState } from "react";
import { Column, ID, Task } from "../types";
import { Plus, Trash } from "@phosphor-icons/react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "./TaskCard";
import { ColorPicker } from "./ColorPicker";
import { twMerge } from "tailwind-merge";
import { Popconfirm } from "./PopConfirm";

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: ID) => void;
  updateColumn: (id: ID, title: string) => void;
  tasks: Task[];
  createTask: (columnId: ID) => void;
  updateTask: (id: ID, content: string) => void;
  deleteTask: (id: ID) => void;
}

export const ColumnContainer: FC<ColumnContainerProps> = ({
  column,
  deleteColumn,
  updateColumn,
  tasks,
  createTask,
  updateTask,
  deleteTask,
}) => {
  const [currentColor, setCurrentColor] = useState<string>("bg-mainBgColor");

  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="bg-mainBgColor w-80 h-[500px] max-h-[500px] flex flex-col  border border-rose-500"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-80 h-[500px] max-h-[500px] flex flex-col bg-columnBgColor"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className={twMerge(
          "flex items-center justify-between  h-14 cursor-grab p-3 font-bold",
          currentColor
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex justify-center items-center bg-columnBgColor px-2 py-1">
            {tasks.length ?? 0}
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border outline-none px-2 w-full mr-1.5"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditMode(false);
                }
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-4">
          <ColorPicker onSelectColor={(color) => setCurrentColor(color)} />
          <Popconfirm onConfirm={() => deleteColumn(column.id)}>
            <Trash
              size={24}
              className="text-white hover:text-white/80 transition-all cursor-pointer z-10"
            />
          </Popconfirm>
        </div>
      </div>

      <div className="flex flex-grow flex-col gap-2 px-2 py-4 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateTask={updateTask}
              deleteTask={deleteTask}
              currentColor={currentColor}
            />
          ))}
        </SortableContext>
      </div>

      <button
        onClick={() => createTask(column.id)}
        className="flex gap-2 items-center justify-center border-columnBgColor border  py-2 hover:bg-mainBgColor hover:text-rose-500 active:bg-black"
      >
        <Plus />
        New task
      </button>
    </div>
  );
};
