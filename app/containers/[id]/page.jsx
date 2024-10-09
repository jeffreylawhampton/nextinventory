"use client";
import { useState, useEffect } from "react";
import { useUserColors } from "@/app/hooks/useUserColors";
import useSWR, { mutate } from "swr";
import { updateContainerColor, deleteContainer } from "../api/db";
import { toggleFavorite } from "@/app/lib/db";
import toast from "react-hot-toast";
import EditContainer from "../EditContainer";
import ContextMenu from "@/app/components/ContextMenu";
import AddRemoveModal from "@/app/components/AddRemoveModal";
import Nested from "./Nested";
import AllItems from "./AllItems";
import AllContainers from "./AllContainers";
import { useDisclosure } from "@mantine/hooks";
import { Anchor, Breadcrumbs, ColorSwatch } from "@mantine/core";
import SearchFilter from "@/app/components/SearchFilter";
import ViewToggle from "@/app/components/ViewToggle";
import UpdateColor from "@/app/components/UpdateColor";
import Loading from "@/app/components/Loading";
import Tooltip from "@/app/components/Tooltip";
import LocationCrumbs from "@/app/components/LocationCrumbs";
import {
  IconBox,
  IconChevronRight,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";
import { breadcrumbStyles } from "@/app/lib/styles";
import CreateItem from "./CreateItem";
import NewContainer from "../NewContainer";
import FavoriteFilterButton from "@/app/components/FavoriteFilterButton";

const fetcher = async (id) => {
  const res = await fetch(`/containers/api/${id}`);
  const data = await res.json();
  return data?.container;
};

const Page = ({ params: { id } }) => {
  const { data, error, isLoading } = useSWR(`container${id}`, () =>
    fetcher(id)
  );
  const [filter, setFilter] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [showCreateContainer, setShowCreateContainer] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [color, setColor] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [view, setView] = useState(0);

  const [opened, { open, close }] = useDisclosure();
  const { user } = useUserColors();

  const handleRemove = () => {
    setIsRemove(true);
    setShowItemModal(true);
  };

  const handleAdd = () => {
    setIsRemove(false);
    setShowItemModal(true);
  };

  const handleFavoriteClick = async () => {
    const add = !data.favorite;
    try {
      await mutate(
        `container${id}`,
        toggleFavorite({ type: "container", id: data.id, add }),
        {
          optimisticData: {
            ...data,
            favorite: add,
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(
        add
          ? `Added ${data.name} to favorites`
          : `Removed ${data.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${data?.name || "this container"}?`
      )
    )
      return;
    try {
      await mutate("containers", deleteContainer({ id }), {
        optimisticData: user?.containers?.filter(
          (container) => container.id != id
        ),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success("Deleted");
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  const handleSetColor = async () => {
    if (data?.color?.hex == color) return setShowPicker(false);

    try {
      await mutate(
        `container${id}`,
        updateContainerColor({
          id: data.id,
          color,
          userId: data.userId,
        }),
        {
          optimisticData: { ...data, color: { hex: color } },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );

      toast.success("Color updated");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    setShowPicker(false);
  };

  useEffect(() => {
    setColor(data?.color?.hex);
  }, [data]);

  if (error) return <div>failed to fetch</div>;
  if (isLoading) return <Loading />;

  const ancestors = [];
  const getAncestors = (container) => {
    if (container?.parentContainerId) {
      ancestors.unshift(container.parentContainer);
      if (container?.parentContainer?.parentContainerId) {
        getAncestors(container.parentContainer);
      }
    }
  };
  getAncestors(data);

  if (isLoading) return <Loading />;

  return (
    <>
      {data?.location?.id || ancestors?.length ? (
        <LocationCrumbs
          name={data?.name}
          location={data?.location}
          ancestors={ancestors}
          type="container"
        />
      ) : (
        <Breadcrumbs
          separatorMargin={6}
          separator={
            <IconChevronRight
              size={breadcrumbStyles.separatorSize}
              className={breadcrumbStyles.separatorClasses}
              strokeWidth={breadcrumbStyles.separatorStroke}
            />
          }
          classNames={breadcrumbStyles.breadCrumbClasses}
        >
          <Anchor href={"/containers"}>
            <IconBox
              size={24}
              aria-label="Containers"
              className={breadcrumbStyles.iconColor}
            />{" "}
            All containers
          </Anchor>
          <span>
            {" "}
            <IconBox size={22} aria-label="Containers" />
            {data?.name}
          </span>
        </Breadcrumbs>
      )}

      <div className="flex gap-3 items-center pb-4">
        <Tooltip
          label="Update color"
          textClasses={showPicker ? "hidden" : "!text-black font-medium"}
        >
          <ColorSwatch
            color={color}
            size={24}
            onClick={() => setShowPicker(!showPicker)}
            className="cursor-pointer !mt-[-.6rem]"
          />
        </Tooltip>
        <h1 className="font-semibold text-3xl pb-3 flex gap-2 items-center">
          {data?.name}{" "}
          <div onClick={handleFavoriteClick}>
            {data?.favorite ? (
              <IconHeartFilled size={26} className="text-danger-400" />
            ) : (
              <IconHeart className="text-bluegray-500 hover:text-danger-200" />
            )}
          </div>
        </h1>

        {showPicker ? (
          <UpdateColor
            data={data}
            handleSetColor={handleSetColor}
            color={color}
            colors={user?.colors?.map((color) => color.hex)}
            setColor={setColor}
            setShowPicker={setShowPicker}
          />
        ) : null}
      </div>

      <ViewToggle
        active={view}
        setActive={setView}
        data={["Nested", "All items", "All containers"]}
      />
      {view != 0 && (
        <div className="mb-3">
          <SearchFilter
            label={`Search for an ${view === 1 ? "item" : "container"}`}
            onChange={(e) => setFilter(e.target.value)}
            filter={filter}
          />
          <FavoriteFilterButton
            label="Favorites"
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
          />
        </div>
      )}

      {!view ? (
        <Nested data={data} filter={filter} handleAdd={handleAdd} />
      ) : null}

      {view === 1 ? (
        <AllItems
          filter={filter}
          handleAdd={handleAdd}
          id={id}
          showFavorites={showFavorites}
        />
      ) : null}

      {view === 2 ? (
        <AllContainers filter={filter} id={id} showFavorites={showFavorites} />
      ) : null}

      <EditContainer
        data={data}
        id={id}
        opened={opened}
        open={open}
        close={close}
      />

      <ContextMenu
        type="container"
        onDelete={handleDelete}
        onEdit={open}
        onAdd={handleAdd}
        onCreateItem={() => setShowCreateItem(true)}
        onCreateContainer={() => setShowCreateContainer(true)}
        onRemove={data?.items?.length ? handleRemove : null}
      />

      <AddRemoveModal
        showItemModal={showItemModal}
        setShowItemModal={setShowItemModal}
        type="container"
        name={data?.name}
        itemList={data?.items}
        isRemove={isRemove}
      />

      {showCreateContainer ? (
        <NewContainer
          opened={showCreateContainer}
          close={() => setShowCreateContainer(false)}
          hidden={["locationId", "containerId"]}
          containerId={data?.id}
          locationId={data?.locationId}
          containerList={data?.containers}
          mutateKey={`container${id}`}
          data={data}
        />
      ) : null}

      {showCreateItem ? (
        <CreateItem
          data={data}
          showCreateItem={showCreateItem}
          setShowCreateItem={setShowCreateItem}
          mutate={mutate}
        />
      ) : null}
    </>
  );
};

export default Page;
