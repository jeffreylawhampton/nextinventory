import ItemCard from "@/app/components/ItemCard";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { sortObjectArray } from "@/app/lib/helpers";
import EmptyCard from "@/app/components/EmptyCard";

const AllItems = ({
  data,
  filter,
  handleAdd,
  handleItemFavoriteClick,
  showFavorites,
  setShowCreateItem,
}) => {
  const itemList = [...data?.items];

  data?.containers?.forEach((container) =>
    container?.items?.forEach(
      (item) => !itemList.includes(item) && itemList.push(item)
    )
  );
  let filteredResults = itemList?.filter((item) =>
    item?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  if (showFavorites)
    filteredResults = filteredResults?.filter((i) => i.favorite);

  const sorted = sortObjectArray(filteredResults);

  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        350: 1,
        600: 2,
        1000: 3,
        1400: 4,
        2000: 5,
      }}
    >
      <Masonry className={`grid-flow-col-dense grow`} gutter={14}>
        {itemList?.length ? (
          sorted?.map((item) => {
            return (
              <ItemCard
                key={item?.name}
                item={item}
                handleFavoriteClick={handleItemFavoriteClick}
              />
            );
          })
        ) : (
          <EmptyCard add={() => setShowCreateItem(true)} move={handleAdd} />
        )}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default AllItems;
