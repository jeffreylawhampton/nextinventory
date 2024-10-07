import { IconChevronDown, IconClipboardList } from "@tabler/icons-react";
import Tooltip from "./Tooltip";

const ItemCountPill = ({ itemCount, transparent, isOpen }) => {
  return (
    <Tooltip
      label={isOpen ? "Hide items" : "Show items"}
      position="top"
      delay={700}
      hidden={!itemCount}
    >
      <div
        className={`flex gap-[4px] h-[27px] justify-center items-center ${
          transparent ? "bg-white !bg-opacity-30" : "bg-white"
        } rounded-full ${itemCount && "cursor-pointer pl-3 pr-2"}`}
      >
        <div
          className={`font-semibold flex gap-[2px] items-center justify-center ${
            !itemCount && "opacity-60 px-3"
          }`}
        >
          <IconClipboardList size={18} strokeWidth={2} className="mt-[-2px]" />
          {itemCount}
        </div>
        {itemCount ? (
          <IconChevronDown
            size={20}
            strokeWidth={1.5}
            className={`transition ${isOpen ? "rotate-180" : ""} `}
          />
        ) : null}
      </div>
    </Tooltip>
  );
};

export default ItemCountPill;