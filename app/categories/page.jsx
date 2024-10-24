"use client";
import NewCategory from "./NewCategory";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import useSWR from "swr";
import { sortObjectArray } from "../lib/helpers";
import SearchFilter from "../components/SearchFilter";
import CreateButton from "../components/CreateButton";
import { useDisclosure } from "@mantine/hooks";
import Loading from "../components/Loading";
import { DeviceContext } from "../layout";
import { toggleFavorite } from "../lib/db";
import toast from "react-hot-toast";
import FavoriteFilterButton from "../components/FavoriteFilterButton";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import ColorCard from "../components/ColorCard";
import { v4 } from "uuid";

const fetcher = async () => {
  const res = await fetch(`/categories/api`);
  const data = await res.json();
  return data.categories;
};

export default function Page() {
  const [filter, setFilter] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [opened, { open, close }] = useDisclosure();
  const {
    dimensions: { width },
  } = useContext(DeviceContext);
  const { data, error, isLoading, mutate } = useSWR("categories", fetcher);

  const router = useRouter();

  if (isLoading) return <Loading />;
  if (error) return "Something went wrong";

  let categoryList = [];
  if (data.length) {
    categoryList = data;
  }

  let filteredResults = sortObjectArray(categoryList).filter((category) =>
    category?.name?.toLowerCase().includes(filter?.toLowerCase())
  );

  if (showFavorites) {
    filteredResults = filteredResults.filter((cat) => cat.favorite);
  }

  const handleFavoriteClick = async (category) => {
    const add = !category.favorite;
    const categoryArray = [...data];
    const categoryToUpdate = categoryArray.find(
      (i) => i.name === category.name
    );
    categoryToUpdate.favorite = !category.favorite;

    try {
      await mutate(toggleFavorite({ type: "category", id: category.id, add }), {
        optimisticData: categoryArray,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success(
        add
          ? `Added ${category.name} to favorites`
          : `Removed ${category.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    close();
  };

  return (
    <>
      <h1 className="font-bold text-3xl pb-5 pt-8">Categories</h1>
      <SearchFilter
        label={"Search for a category"}
        onChange={(e) => setFilter(e.target.value)}
        filter={filter}
      />
      <FavoriteFilterButton
        label="Favorites"
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        rootClasses="mt-1 mb-4"
      />

      <ResponsiveMasonry
        columnsCountBreakPoints={{
          350: 1,
          700: 2,
          1200: 3,
          1600: 4,
          2200: 5,
        }}
      >
        <Masonry className={`grid-flow-col-dense grow pb-12`} gutter={12}>
          {filteredResults.map((category) => {
            return (
              <ColorCard
                key={v4()}
                item={category}
                handleFavoriteClick={handleFavoriteClick}
                type="categories"
              />
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
      <NewCategory
        categoryList={categoryList}
        opened={opened}
        close={close}
        open={open}
      />
      <CreateButton tooltipText={"Add new category"} onClick={open} />
    </>
  );
}
