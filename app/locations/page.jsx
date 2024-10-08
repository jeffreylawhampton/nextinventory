"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { sortObjectArray } from "../lib/helpers";
import NewLocation from "./NewLocation";
import Link from "next/link";
import Droppable from "./Droppable";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import DraggableItemCard from "../components/DraggableItemCard";
import {
  moveItem,
  moveContainerToLocation,
  moveContainerToContainer,
} from "./api/db";
import Loading from "../components/Loading";
import { useDisclosure, useSessionStorage } from "@mantine/hooks";
import CreateButton from "../components/CreateButton";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import LocationFilters from "./LocationFilters";
import ContainerAccordion from "../components/ContainerAccordion";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const fetcher = async () => {
  const res = await fetch("/locations/api");
  const data = await res.json();
  return data?.locations;
};

export default function Page() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data, error, isLoading, mutate } = useSWR("locations", fetcher);
  const [showFilters, setShowFilters] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [filters, setFilters] = useSessionStorage(
    "filters",
    data?.map((loc) => loc.id)
  );

  const router = useRouter();

  let locationList = [];
  if (data?.length) {
    locationList = data;
  }

  useEffect(() => {
    setFilters(data?.map((location) => location.id));
  }, [data]);

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  const filteredResults = sortObjectArray(locationList).filter((location) =>
    filters?.includes(location.id)
  );

  const handleCheck = (locId) => {
    setFilters((prev) =>
      prev?.includes(locId)
        ? prev?.filter((loc) => loc != locId)
        : [...prev, locId]
    );
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over?.data) {
      setActiveItem(null);
      return;
    }
    const destination = over.data.current.item;
    const source = active.data.current.item;

    if (
      (source?.type === destination?.type &&
        source.parentContainerId == destination.id) ||
      source.id == destination.id
    ) {
      return setActiveItem(null);
    }

    // todo: expand logic to handle all cancel scenarios

    if (destination.type === "location") {
      if (
        (source.type === "item" && destination.id === source.locationId) ||
        (source.type === "container" &&
          !source.parentContainerId &&
          source.locationId === destination.id)
      )
        return setActiveItem(null);

      source.type === "item"
        ? await mutate(
            moveItem({
              itemId: source.id,
              destinationType: destination.type,
              destinationId: destination.id,
              destinationLocationId:
                destination.type === "container"
                  ? destination.locationId
                  : null,
            })
          )
        : await mutate(
            moveContainerToLocation({
              containerId: source.id,
              locationId: destination.id,
            })
          );
    } else {
      destination.type === "container"
        ? await mutate(
            moveContainerToContainer({
              containerId: source.id,
              newContainerId: destination.id,
              newContainerLocationId: destination.locationId,
            })
          )
        : await mutate(
            moveContainerToLocation({
              containerId: source.id,
              locationId: destination.id,
            })
          );
    }
    setActiveItem(null);
  };

  function handleDragStart(event) {
    setActiveItem(event.active.data.current.item);
  }

  return (
    <div className="pb-64">
      <h1 className="font-bold text-3xl  ">Locations</h1>
      <LocationFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        locationList={locationList}
        filters={filters}
        setFilters={setFilters}
        handleCheck={handleCheck}
      />
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
      >
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            350: 1,
            840: 2,
            1400: 3,
            1800: 4,
          }}
        >
          <Masonry className=" grid-flow-col-dense grow pb-32" gutter={16}>
            {filteredResults.map((location) => {
              const combined = location?.items?.concat(location?.containers);
              return (
                <Droppable
                  key={v4()}
                  id={location.name}
                  item={location}
                  className="relative cursor-pointer flex flex-col gap-4 p-6 rounded-xl min-h-32 bg-bluegray-200 hover:bg-bluegray-300"
                >
                  <div
                    className="w-full h-full absolute top-0 left-0 z-0"
                    onClick={() => router.push(`/locations/${location.id}`)}
                  />
                  <Link href={`/locations/${location.id}`}>
                    <h2 className="font-semibold text-xl w-fit">
                      {location.name}
                    </h2>
                  </Link>

                  {combined?.map((container) => {
                    return container.hasOwnProperty("parentContainerId") ? (
                      <ContainerAccordion
                        key={container.name}
                        container={container}
                        activeItem={activeItem}
                      />
                    ) : (
                      <DraggableItemCard
                        key={container.name}
                        item={container}
                        id={container.name}
                        activeItem={activeItem}
                        bgColor="!bg-bluegray-100"
                      />
                    );
                  })}
                </Droppable>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>

        <DragOverlay>
          {activeItem ? (
            activeItem.hasOwnProperty("parentContainerId") ? (
              <ContainerAccordion container={activeItem} dragging />
            ) : (
              <DraggableItemCard
                item={activeItem}
                overlay
                bgColor="!bg-bluegray-100"
                shadow="!drop-shadow-md"
              />
            )
          ) : null}
        </DragOverlay>
      </DndContext>

      <NewLocation opened={opened} close={close} locationList={locationList} />

      <CreateButton tooltipText="Create new location" onClick={open} />
    </div>
  );
}
