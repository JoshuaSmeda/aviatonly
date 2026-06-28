"use client";

import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { AllassignedTo, TaskProperties } from "@/app/api/kanban/kanban-data";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

function EditTaskModal({ show, onHide, editedTask, onSave }: any) {
  const [tempEditedTask, setTempEditedTask] = useState(editedTask);
  const [newtaskImage, setNewtaskImage] = useState(editedTask?.taskImage || "");
  const [imagePreview, setImagePreview] = useState(editedTask?.taskImage || "");
  const [assignedUsers, setAssignedUsers] = useState(
    editedTask?.assignedTo || []
  );

  useEffect(() => {
    // setTempEditedTask(editedTask);
    setTempEditedTask({
      ...editedTask,
      priority: editedTask.priority || "", // default to empty string
    });
    setNewtaskImage(editedTask?.taskImage || "");
    setImagePreview(editedTask?.taskImage || "");
    setAssignedUsers(editedTask?.assignedTo || []);
  }, [editedTask]);

  // Function to handle changes in the task input fields
  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setTempEditedTask({ ...tempEditedTask, [name]: value });
  };
  // Function to handle changes in the task property
  const handlePropertyChange = (property: string) => {
    setTempEditedTask({ ...tempEditedTask, priority: property });
  };

  // Function to handle saving the changes made to the task and hiding the modal
  const handleSaveChanges = () => {
    const updatedTask = {
      ...tempEditedTask,
      taskImage: newtaskImage,
      assignedTo: assignedUsers,
    };
    onSave(updatedTask);
    onHide();
  };

  // Function to handle new image URL input
  const handleNewtaskImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNewtaskImage(url);
    setImagePreview(url);
  };

  return (
    <Dialog open={show} onOpenChange={onHide}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-0">
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-5 py-4">
          {/* Task Title */}
          <div className="col-span-12">
            <Label htmlFor="task" className="mb-2 block capitalize">
              Task
            </Label>
            <Input
              name="taskTitle"
              id="task"
              value={tempEditedTask.taskTitle}

              onChange={handleChange}
            />
          </div>

          {/* Task Text or Image */}
          <div className="col-span-12">
            {tempEditedTask.taskImage ? (
              <>
                {/* Image URL Input */}
                <div className="mb-5">
                  <Label htmlFor="taskImage" className="mb-2 block capitalize">
                    Image URL
                  </Label>
                  <Input
                    id="taskImage"

                    value={newtaskImage}
                    onChange={handleNewtaskImageChange}
                  />
                </div>
                {/* Image Preview */}
                {imagePreview && (
                  <div>
                    <Label htmlFor="taskImage">Image Preview:</Label>
                    <Image
                      src={imagePreview}
                      alt="Selected"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        marginTop: "8px",
                        borderRadius: "4px",
                      }}
                      width={243}
                      height={172}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <Label htmlFor="tasktext" className="mb-2 block capitalize">
                  Description
                </Label>
                <Input
                  name="taskText"
                  id="tasktext"

                  value={tempEditedTask.taskText}
                  onChange={handleChange}
                />
              </>
            )}
          </div>

          {/* Category Select */}
          <div className="col-span-12">
            <Label htmlFor="taskProperty" className="mb-2 block capitalize">
              Category
            </Label>
            <Select
              value={tempEditedTask?.priority}
              onValueChange={handlePropertyChange}
            >
              <SelectTrigger className="w-full" id="taskProperty">
                {tempEditedTask?.priority || "Select Category"}
              </SelectTrigger>

              <SelectContent>
                {TaskProperties.map((property) => (
                  <SelectItem key={property} value={property}>
                    {property}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assign Users */}
          <div className="col-span-12 w-fit flex flex-col gap-2">
            <Label>Assign To</Label>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                {assignedUsers.map((user: any, idx: number) => (
                  <div key={idx} className="relative">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      title={user.name}
                      width={36}
                      height={36}
                      className="rounded-full bg-muted  border border-white dark:border-white/40"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setAssignedUsers(
                          assignedUsers.filter((_: any, i: number) => i !== idx)
                        )
                      }
                      className="absolute top-0 right-0 bg-destructive text-white rounded-full w-4 h-4 flex items-center justify-center -mt-1 -mr-1 hover:cursor-pointer"
                    >
                      <Icon
                        icon={"solar:close-circle-line-duotone"}
                        width={36}
                        height={36}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New User */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span>
                    <div className="btn-circle-hover p-0">
                      <Icon
                        icon={"solar:add-circle-linear"}
                        width={30}
                        height={30}
                      />
                    </div>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-40 overflow-y-auto">
                  {AllassignedTo.map((user, index) => {
                    const isChecked = assignedUsers.some(
                      (u: { name: string; avatar: string }) =>
                        u.name === user.name && u.avatar === user.avatar
                    );
                    return (
                      <DropdownMenuItem key={index}>
                        <div className="flex items-center gap-2 cursor-pointer w-full">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAssignedUsers([...assignedUsers, user]);
                              } else {
                                setAssignedUsers(
                                  assignedUsers.filter(
                                    (u: { name: string; avatar: string }) =>
                                      !(
                                        u.name === user.name &&
                                        u.avatar === user.avatar
                                      )
                                  )
                                );
                              }
                            }}
                          />
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={36}
                            height={36}
                            className="rounded-full bg-muted  border border-white dark:border-white/40"
                          />
                          <h6 className="text-sm">{user.name}</h6>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button variant={"destructive"}>Close</Button>
          </DialogClose>
          <Button onClick={handleSaveChanges} className={"text-white"}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default EditTaskModal;
