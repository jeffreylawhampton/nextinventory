import { useState } from "react";
import ContainerAccordion from "@/app/components/ContainerAccordion";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import DraggableItemCard from "@/app/components/DraggableItemCard";
import MasonryContainer from "@/app/components/MasonryContainer";
import { sortObjectArray } from "@/app/lib/helpers";
import { moveItem, moveContainerToContainer } from "../api/db";
import Loading from "@/app/components/Loading";

const Nested = ({ data, mutate, isLoading }) => {
  const [activeItem, setActiveItem] = useState(null);
  const items = sortObjectArray(data?.items)?.filter(
    (item) => item?.containerId === data?.id
  );
  const containers = sortObjectArray(data?.containers);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    const destination = over?.data?.current?.item;
    const source = active.data.current.item;

    if (source.type === "container" && destination?.type === "container") {
      if (
        source.parentContainerId === destination.id ||
        source.id === destination.id
      ) {
        return setActiveItem(null);
      }
      await mutate(
        `container${data.id}`,
        moveContainerToContainer({
          containerId: source.id,
          newContainerId: destination.id,
          newContainerLocationId: destination.locationId,
        })
      );
    }

    if (
      !source.type === "container" &&
      destination?.name === source?.container?.name
    ) {
      return setActiveItem(null);
    }

    if (!destination) {
      if (
        source?.parentContainerId === data.id ||
        source?.containerId === data.id
      ) {
        return setActiveItem(null);
      }

      source?.type === "container"
        ? await mutate(
            `container${data.id}`,
            moveContainerToContainer({
              containerId: source.id,
              newContainerId: data.id,
              newContainerLocationId: data.locationId,
            })
          )
        : await mutate(
            `container${data.id}`,
            moveItem({
              itemId: source.id,
              containerId: data.id,
              containerLocationId: data?.locationId,
            })
          );
    }

    if (destination?.type === "container") {
      if (
        destination?.id === source.id ||
        source?.containerId === destination.id
      ) {
        return setActiveItem(null);
      }
      source.type === "container"
        ? await mutate(
            `container${data.id}`,
            moveContainerToContainer({
              containerId: source.id,
              newContainerId: destination.id,
              newContainerLocationId: destination.locationId,
            })
          )
        : await mutate(
            `container${data.id}`,
            moveItem({
              itemId: source.id,
              containerId: destination.id,
              containerLocationId: destination?.locationId,
            })
          );
    }

    setActiveItem(null);
  };

  function handleDragStart(event) {
    setActiveItem(event.active.data.current.item);
  }

  if (isLoading) return <Loading />;

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <MasonryContainer>
        {items?.map((item) => {
          return (
            <DraggableItemCard
              key={item?.name}
              activeItem={activeItem}
              item={item}
              bgColor="!bg-bluegray-200"
            />
          );
        })}
        {containers?.map((container) => {
          return (
            <ContainerAccordion
              key={container?.name}
              container={container}
              bgColor="!bg-bluegray-200"
              activeItem={activeItem}
            />
          );
        })}
      </MasonryContainer>
      <DragOverlay>
        {activeItem ? (
          activeItem.hasOwnProperty("parentContainerId") ? (
            <ContainerAccordion
              container={activeItem}
              dragging
              bgColor="!bg-bluegray-200"
              shadow="!drop-shadow-lg"
            />
          ) : (
            <DraggableItemCard
              item={activeItem}
              overlay
              bgColor="!bg-bluegray-200"
              shadow="!drop-shadow-lg"
            />
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Nested;
