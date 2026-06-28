"use client";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import TaskData from "./task-data";
import EditCategoryModal from "./task-modal/editcategory-modal";
import AddNewTaskModal from "./task-modal/addnewtask-modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // adjust path as needed
import {
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
  Tooltip,
} from "@/components/ui/tooltip";
import { KanbanDataContext } from "@/app/context/kanban-context/index";
import { postFetcher } from "@/app/api/global-fetcher";
import { mutate } from "swr";
import { Icon } from "@iconify/react/dist/iconify.js";

function CategoryTaskList({ id }: { id: string }) {
  const { todoCategories, deleteCategory, clearAllTasks, setTodoCategories } =
    useContext(KanbanDataContext);

  const category = todoCategories.find((cat) => cat.id === id) as any;

  const [allTasks, setAllTasks] = useState(category ? category.child : []);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(category.name);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showContainer, setShowContainer] = useState(true);
  const [anchorEl, setAnchorEl] = useState(false);

  // Find the category and update tasks
  useEffect(() => {
    const category = todoCategories.find((cat) => cat.id === id);
    if (category) {
      setAllTasks(category.child);
    }
  }, [todoCategories, id]);

  const [newTaskData, setNewTaskData] = useState({
    taskTitle: "",
    taskText: "",
    priority: "",
    dueDate: "",
    taskImage: "/images/blog/blog-img3.jpg",
    assignedTo: [],
    attachments: [
      {
        url: "https://adminmart.github.io/template_api/images/website-template/endeavor/endeavor-nextjs-14-website-template.jpg",
      },
    ],
    comments: [],
    subtasks: [],
  });

  //Shows the modal for adding a new task.
  const handleShowModal = () => {
    setShowModal(true);
  };
  // Closes the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };
  //  Shows the modal for editing a category.
  const handleShowEditCategoryModal = () => setShowEditCategoryModal(true);
  //Closes the modal for editing a category.
  const handleCloseEditCategoryModal = () => setShowEditCategoryModal(false);

  //Updates the category name
  const handleUpdateCategory = async (
    updatedName: SetStateAction<string | any>
  ) => {
    try {
      const response = await mutate(
        "/api/kanban",
        postFetcher("/api/kanban", {
          categoryId: id,
          categoryName: updatedName,
        }),
        false
      );
      if (response?.status === 200) {
        setNewCategoryName(updatedName);

        const updatedCategories = todoCategories.map((cat) => {
          if (cat.id === id) {
            return { ...cat, name: updatedName };
          }
          return cat;
        });
        setTodoCategories(updatedCategories);
      } else {
        throw new Error("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  //Adds a new task to the category.

  const handleAddTask = async () => {
    let counter = 0;
    function generateUniqueNumber() {
      const timestamp = Date.now();
      counter = (counter + 1) % 1000;
      return `${timestamp}${counter.toString().padStart(3, "0")}`;
    }

    const newTask = {
      ...newTaskData,
      id: generateUniqueNumber(),
    };

    try {
      const response = await mutate(
        "/api/kanban",
        postFetcher("/api/kanban", {
          categoryId: id,
          newTaskData: newTask,
        }),
        false
      );

      if (response.status === 200) {
        handleCloseModal();

        const newUpdatedValue = todoCategories.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              child: [...item.child, newTask],
            };
          }
          return item;
        });

        setTodoCategories(newUpdatedValue);
        setAllTasks([...allTasks, newTask]);

        // Optional: Reset form
        setNewTaskData({
          taskTitle: "",
          taskText: "",
          priority: "",
          dueDate: "",
          taskImage: "",
          assignedTo: [],
          attachments: [
            {
              url: "https://adminmart.github.io/template_api/images/website-template/endeavor/endeavor-nextjs-14-website-template.jpg",
            },
          ],
          comments: [],
          subtasks: [],
        });
      } else {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Clears all tasks from the current category.
  const handleClearAll = () => {
    clearAllTasks(id);
    setAllTasks([]);
    let remainingTodos = todoCategories.map((item) => {
      if (item.name === category.name) {
        return {
          id: item.id,
          name: item.name,

          child: [],
        };
      } else {
        return item;
      }
    });
    setTodoCategories(remainingTodos);
  };
  // Deletes a specific task.
  const handleDeleteTask = (
    taskId: number | any,
    category: { name: string }
  ) => {
    // deleteTodo(taskId);
    setAllTasks((prevTasks: { id: number }[]) =>
      prevTasks.filter((task: { id: number }) => task.id !== taskId)
    );
    let remainingTodos = todoCategories.map((item) => {
      if (item.name === category.name) {
        let updatedChild = item.child.filter(
          (task: { id: any }) => task.id !== taskId
        );
        return {
          id: item.id,
          name: item.name,

          child: updatedChild,
        };
      } else {
        return item;
      }
    });
    setTodoCategories(remainingTodos);
  };
  //Handles the deletion of the current category.
  const handleDeleteClick = () => {
    setShowContainer(false);
    deleteCategory(id);
  };

  const backgroundColor =
    category.name === "Complete" ? "bg-chart-2/12 " : "bg-primary/5 ";

  const badgeColor =
    category.name === "New Request"
      ? "destructive"
      : category.name === "In Progress"
        ? "chart-5"
        : category.name === "Complete"
          ? "chart-2"
          : category.name === "BackLog"
            ? "muted-foreground"
            : "primary";

  return (
    <TooltipProvider>
      {showContainer && category && (
        <div className={`rounded-lg w-[290px] p-1.5 ${backgroundColor}`}>
          <div className="flex justify-between items-center px-3">
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full bg-${badgeColor}`} />
              <h6 className="text-base">{newCategoryName}</h6>
              <p className="text-sm font-medium text-muted-foreground">
                {allTasks.length}
              </p>
            </div>
            <div className="flex items-center">
              <div>
                {category.name === "New Request" && (
                  <>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className="btn-circle-hover"
                          onClick={handleShowModal}
                        >
                          <Icon
                            icon={"solar:add-circle-linear"}
                            width={24}
                            height={24}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Add Task</TooltipContent>
                    </Tooltip>
                    <AddNewTaskModal
                      show={showModal}
                      onHide={handleCloseModal}
                      onSave={handleAddTask}
                      newTaskData={newTaskData}
                      setNewTaskData={setNewTaskData}
                      updateTasks={() =>
                        setAllTasks([...allTasks, newTaskData])
                      }
                    />
                  </>
                )}
                <EditCategoryModal
                  showModal={showEditCategoryModal}
                  handleCloseModal={handleCloseEditCategoryModal}
                  initialCategoryName={newCategoryName}
                  handleUpdateCategory={handleUpdateCategory}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className="btn-circle-hover">
                    <EllipsisVertical size={20} />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer" onClick={handleShowEditCategoryModal}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleDeleteClick}>
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleClearAll}>
                    Clear All
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-3">
            {allTasks?.map((task: { id: any }, index: number) => (
              <TaskData
                key={task?.id ?? index}
                task={task}
                onDeleteTask={() => handleDeleteTask(task.id, category)}
                index={index}
                category={category}
              />
            ))}
          </div>
          {category.name === "New Request" && (
            <div className="mt-3.5 w-fit px-3">
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className="flex items-center gap-2.5 cursor-pointer hover:text-primary"
                    onClick={handleShowModal}
                  >
                    <div>
                      <Icon
                        icon={"solar:add-circle-linear"}
                        width={24}
                        height={24}
                      />
                    </div>
                    <p>Add Task</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Add Task</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      )}
    </TooltipProvider>
  );
}
export default CategoryTaskList;
