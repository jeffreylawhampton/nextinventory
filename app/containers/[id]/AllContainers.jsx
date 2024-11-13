import ContainerCard from "@/app/components/ContainerCard";
import { sortObjectArray } from "@/app/lib/helpers";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const AllContainers = ({
  filter,
  showFavorites,
  data,
  handleContainerFavoriteClick,
}) => {
  const allContainerArray = data.containerArray;

  let filteredResults = allContainerArray?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  if (showFavorites) {
    filteredResults = filteredResults.filter((container) => container.favorite);
  }
  const sorted = sortObjectArray(filteredResults);

  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        350: 1,
        800: 2,
        1200: 3,
        1700: 4,
        2200: 5,
      }}
    >
      <Masonry className={`grid-flow-col-dense grow pb-12`} gutter={8}>
        {sorted?.map((container) => {
          return (
            <ContainerCard
              key={container?.name}
              container={container}
              handleFavoriteClick={handleContainerFavoriteClick}
            />
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default AllContainers;
