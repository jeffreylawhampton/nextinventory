"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { checkLuminance } from "../lib/helpers";

export default function Droppable({ item, id, className, children }) {
  const type = item.hasOwnProperty("parentContainerId")
    ? "container"
    : "location";
  item = { ...item, type };

  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { item, type },
  });
  const style = {
    // backgroundColor: isOver ? "#ececec" : item?.color || "#f8f8f8",
    color: item?.color ? checkLuminance(item.color) : "black",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={` ${className} ${isOver && "!bg-bluegray-400"}`}
    >
      {children}
    </div>
  );
}
