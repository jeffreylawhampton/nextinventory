import {
  IconBox,
  IconClipboardList,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";

const CountPills = ({
  containerCount,
  itemCount,
  transparent,
  textClasses,
  showEmpty = true,
  showItems,
  showContainers,
  showFavorite,
  handleFavoriteClick,
  handleContainerClick,
  handleCategoryClick,
  item,
}) => {
  const pillClasses = `flex gap-[3px] justify-center items-center ${textClasses} ${
    transparent ? `bg-white !bg-opacity-25` : "bg-white"
  } rounded-full px-3 py-[1px] font-semibold point`;

  const wrapperClasses = "flex gap-1 pl-0 @sm:pl-2 h-[27px]";

  const clickableClasses =
    "relative hover:!bg-opacity-35 active:!bg-opacity-40";

  const empty = showEmpty ? "opacity-70" : "";

  return (
    <div
      className={
        (showItems && showContainers) || (showItems && showFavorite)
          ? wrapperClasses
          : null
      }
    >
      {showFavorite ? (
        <button
          onClick={() => handleFavoriteClick(item)}
          className={`${pillClasses} ${
            handleFavoriteClick && clickableClasses
          } ${!transparent && "text-bluegray-700"}`}
        >
          {item?.favorite ? (
            <IconHeartFilled size={17} aria-label="Favorite" />
          ) : (
            <IconHeart size={17} strokeWidth={2} aria-label="Not a favorite" />
          )}
        </button>
      ) : null}

      {showContainers ? (
        <button
          onClick={handleContainerClick}
          className={`${pillClasses} ${
            handleContainerClick && clickableClasses
          } ${!containerCount && !transparent && "text-bluegray-700"}`}
        >
          <IconBox
            size={18}
            strokeWidth={1.5}
            className={containerCount ? "" : empty}
          />{" "}
          <span className={containerCount ? "" : empty}>{containerCount}</span>
        </button>
      ) : null}
      {showItems ? (
        <button
          onClick={
            handleContainerClick
              ? handleContainerClick
              : handleCategoryClick
              ? () => handleCategoryClick(item)
              : null
          }
          className={`${pillClasses} ${
            handleContainerClick && clickableClasses
          } ${!itemCount && !transparent && "text-bluegray-700"}`}
        >
          <IconClipboardList
            size={18}
            strokeWidth={1.5}
            className={itemCount ? "" : empty}
          />
          <span className={itemCount ? "" : empty}>{itemCount}</span>
        </button>
      ) : null}
    </div>
  );
};

export default CountPills;
