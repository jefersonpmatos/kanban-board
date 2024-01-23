import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { Plus } from "@phosphor-icons/react";
import { Column, ID, Task } from "../types";
import { ColumnContainer } from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCard } from "./TaskCard";

export const KanbanBoard = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const columnsID = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const tasksToRender = useMemo(
    () => (columnId: ID) => tasks.filter((task) => task.columnId === columnId),
    [tasks]
  );

  const createColumn = () => {
    const newColumn: Column = {
      id: nanoid(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, newColumn]);
  };

  const updateColumn = (id: ID, title: string) => {
    const newColumns = columns.map((column) => {
      if (column.id === id) {
        return {
          ...column,
          title,
        };
      }
      return column;
    });

    setColumns(newColumns);
  };

  const deleteColumn = (id: ID) => {
    setColumns(columns.filter((column) => column.id !== id));
    setTasks(tasks.filter((task) => task.columnId !== id));
  };

  const createTask = (columnId: ID) => {
    const newTask: Task = {
      id: nanoid(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: ID, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          content,
        };
      }
      return task;
    });

    setTasks(newTasks);
  };

  const deleteTask = (id: ID) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setSelectedColumn(event.active.data.current?.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setSelectedTask(event.active.data.current?.task);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setSelectedColumn(null);
    setSelectedTask(null);
    const { active, over } = event;

    if (!over) return;

    const selectedColumnId = active.id;
    const overColumnId = over.id;

    if (selectedColumnId === overColumnId) return;

    setColumns((columns) => {
      const selectedColumnIndex = columns.findIndex(
        (column) => column.id === selectedColumnId
      );
      const overColumnIndex = columns.findIndex(
        (column) => column.id === overColumnId
      );

      return arrayMove(columns, selectedColumnIndex, overColumnIndex);
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const selectedId = active.id;
    const overId = over.id;

    if (selectedId === overId) return;

    const isSelectedATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isSelectedATask) return;

    //drop task over another task
    if (isSelectedATask && isOverATask) {
      setTasks((tasks) => {
        const selectedTaskIndex = tasks.findIndex(
          (task) => task.id === selectedId
        );
        const overTaskIndex = tasks.findIndex((task) => task.id === overId);

        tasks[selectedTaskIndex].columnId = tasks[overTaskIndex].columnId;

        return arrayMove(tasks, selectedTaskIndex, overTaskIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // drop task over column

    if (isSelectedATask && isOverAColumn) {
      setTasks((tasks) => {
        const selectedTaskIndex = tasks.findIndex(
          (task) => task.id === selectedId
        );

        tasks[selectedTaskIndex].columnId = overId;

        return arrayMove(tasks, selectedTaskIndex, selectedTaskIndex);
      });
    }
  };

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-10">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        sensors={sensors}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsID}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  updateColumn={updateColumn}
                  deleteColumn={deleteColumn}
                  tasks={tasksToRender(column.id)}
                  createTask={createTask}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            className=" py-1 px-4 h-10 cursor-pointer bg-mainBgColor border border-columnBgColor hover:border-red-500  flex gap-4 items-center min-w-fit"
            onClick={createColumn}
          >
            <Plus /> New column
          </button>
          {createPortal(
            <DragOverlay>
              {selectedColumn && (
                <ColumnContainer
                  column={selectedColumn}
                  updateColumn={updateColumn}
                  deleteColumn={deleteColumn}
                  tasks={tasksToRender(selectedColumn.id)}
                  createTask={createTask}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              )}
              {selectedTask && (
                <TaskCard
                  task={selectedTask}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  currentColor="bg-mainBgColor"
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </div>
      </DndContext>
    </div>
  );
};
