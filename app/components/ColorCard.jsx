"use client";
import { Card } from "@mantine/core";
import CountPills from "./CountPills";
import Link from "next/link";
import { getTextColor, getCounts } from "../lib/helpers";

const ColorCard = ({ item, handleFavoriteClick, type }) => {
  const { itemCount, containerCount } = getCounts(item);

  return (
    <Card
      classNames={{ root: "@container hover:brightness-90 !p-3 !rounded-md" }}
      styles={{
        root: {
          backgroundColor: item?.color?.hex || "#ececec",
          color: getTextColor(item?.color?.hex) || "black",
        },
      }}
    >
      <Link
        href={`/${type}/${item.id}`}
        className="w-full h-full absolute top-0 left-0"
      />

      <div className="flex flex-col @xs:flex-row gap-x-0 gap-y-3 w-full @xs:justify-between @xs:items-center h-full">
        <h1 className="!text-[15px] pl-1 pr-2  font-semibold leading-tight hyphens-auto text-pretty !break-words w-full @xs:w-1/2">
          {item?.name}
        </h1>

        <CountPills
          containerCount={type === "containers" ? containerCount : null}
          itemCount={type === "containers" ? itemCount : item?._count?.items}
          textClasses={"text-sm font-medium"}
          verticalMargin="my-0 !pl-0"
          transparent
          showContainers={type === "containers"}
          showFavorite
          showItems
          showEmpty={false}
          item={item}
          handleFavoriteClick={handleFavoriteClick}
          type={type}
        />
      </div>
    </Card>
  );
};

export default ColorCard;