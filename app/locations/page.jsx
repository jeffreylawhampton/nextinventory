"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { sortObjectArray } from "../lib/helpers";
import NewLocation from "./NewLocation";
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
// import LocationFilters from "./LocationFilters";
import ContainerAccordion from "../components/ContainerAccordion";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { IconExternalLink, IconX } from "@tabler/icons-react";
import LocationFilters from "../containers/LocationFilters";
import Tooltip from "../components/Tooltip";

const fetcher = async () => {
  const res = await fetch("/locations/api");
  const data = await res.json();
  return data?.locations;
};

export default function Page() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data, error, isLoading, mutate } = useSWR("locations", fetcher);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState();
  const [activeItem, setActiveItem] = useState(null);
  const [filters, setFilters] = useSessionStorage(
    "filters",
    data?.map((loc) => loc.id)
  );

  const router = useRouter();

  // const {
  //   dimensions: { width },
  // } = useContext(DeviceContext);

  let locationList = [];
  if (data?.length) {
    locationList = data;
  }

  useEffect(() => {
    setFilters(data?.map((location) => location.id));
    setActiveFilters(data?.map((location) => location.id));
  }, [data]);

  const filteredResults = sortObjectArray(locationList).filter((location) =>
    activeFilters?.includes(location.id)
  );

  const handleCheck = (locId) => {
    setActiveFilters((prev) =>
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
      (source.type === destination?.type && source.id == destination.id)
    ) {
      return setActiveItem(null);
    }

    // todo: expand logic to handle all cancel scenarios

    if (source.type === "item") {
      console.log("here");
      if (
        !destination ||
        (destination?.type === "location" &&
          !source?.containerId &&
          destination.id === source.locationId) ||
        (destination.type === "container" &&
          destination.id === source.containerId)
      ) {
        return setActiveItem(null);
      } else {
        await mutate(
          moveItem({
            itemId: source.id,
            destinationType: destination.type,
            destinationId: destination.id,
            destinationLocationId:
              destination.type === "container" ? destination.locationId : null,
          })
        );
      }
    }

    if (destination.type === "location") {
      if (
        (source.type === "item" && destination.id === source.locationId) ||
        (source.type === "container" &&
          !source.parentContainerId &&
          source.locationId === destination.id)
      )
        return setActiveItem(null);

      if (source.type === "container") {
        await mutate(
          moveContainerToLocation({
            containerId: source.id,
            locationId: destination.id,
          })
        );
      }
    } else if (source.type === "item") {
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

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  return (
    <div className="pb-0 min-xl:overflow-y-hidden h-[99vh] fixed top-0 max-lg:overflow-y-auto !overflow-x-auto pr-8 xl:pr-12 max-lg:w-screen w-[92vw]">
      <h1 className="font-bold text-3xl pt-6 pb-3">Locations</h1>
      <LocationFilters
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        showCounts={false}
      />
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
      >
        <div className="mt-2 bg-white dropContainer">
          {filteredResults.map((location) => {
            const combined = location?.items?.concat(location?.containers);
            return (
              <Droppable
                key={v4()}
                id={location.name}
                item={location}
                className="relative cursor-pointer flex flex-col gap-4 px-3 py-5 rounded-xl overlay-y scroll-smooth !overflow-x-hidden bg-bluegray-200 dropWidth"
              >
                <div className="flex w-full justify-between items-center">
                  <h2 className="font-semibold text-xl">{location.name}</h2>
                  <div className="flex gap-2">
                    <Tooltip label={`Hide ${location?.name}`} delay={300}>
                      <IconX
                        aria-label={`Hide ${location?.name}`}
                        className="hover:scale-[115%] transition-all"
                        onClick={() => handleCheck(location.id)}
                      />
                    </Tooltip>
                    <Tooltip label={`Go to ${location?.name}`} delay={300}>
                      <IconExternalLink
                        aria-label={`Go to ${location?.name}`}
                        className="hover:scale-[115%] transition-all"
                        onClick={() => router.push(`/locations/${location.id}`)}
                      />
                    </Tooltip>
                  </div>
                </div>

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
        </div>

        <DragOverlay modifiers={[snapCenterToCursor]}>
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
