import { Accordion, ScrollArea } from "@mantine/core";
import { getFontColor } from "../lib/helpers";
import Droppable from "./Droppable";
import Tooltip from "./Tooltip";
import Draggable from "./Draggable";
import DraggableItemCard from "./DraggableItemCard";
import { useContext } from "react";
import { AccordionContext } from "../layout";
import { hexToHsl } from "../lib/helpers";
import { IconExternalLink, IconMapPin, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

const ContainerAccordion = ({ container, activeItem, first = true }) => {
  const { openContainers, setOpenContainers, itemsVisible, setItemsVisible } =
    useContext(AccordionContext);
  const fontColor = getFontColor(container?.color?.hex);
  const isOpen = openContainers?.includes(container?.name);

  const { h, s } = hexToHsl(container.color.hex);

  const handleContainerClick = () => {
    setOpenContainers(
      openContainers?.includes(container.name)
        ? openContainers.filter((name) => name != container.name)
        : [...openContainers, container.name]
    );
  };

  const handleItemsClick = () => {
    setItemsVisible(itemsVisible === container.name ? "" : container.name);
  };

  return (
    <Draggable id={container.id} item={container}>
      <Droppable id={container.id} item={container}>
        <Accordion
          value={openContainers}
          onChange={handleContainerClick}
          classNames={{
            root: `${
              activeItem?.name === container.name ? "opacity-0" : ""
            } relative !p-0 !my-0 !py-0 drop-shadow-md w-full`,
            chevron: `${fontColor} `,
            control: "!p-4 !pl-12 !text-lg hover:brightness-[90%] rounded-lg",
            content: ` !pl-4 ${first ? "!pr-2" : "!pr-1"} flex flex-col gap-3 ${
              isOpen ? "!h-fit" : !"h-0"
            }`,
            panel: "rounded-b-lg",
          }}
          styles={{
            panel: {
              backgroundColor: `hsl(${h}, ${s * 0.5}%, 85%)`,
            },
            control: { backgroundColor: container?.color?.hex || "#ececec" },
          }}
        >
          <Accordion.Item
            key={container.name}
            id={container.name}
            value={container.name}
            className="!border-none"
          >
            <Accordion.Control>
              <span className={`${fontColor} font-semibold flex gap-2`}>
                {container.name}
              </span>
            </Accordion.Control>
            <Accordion.Panel>
              <Accordion
                value={itemsVisible}
                onChange={handleItemsClick}
                variant="contained"
                classNames={{
                  item: "!bg-transparent !border-none",
                  content: "!p-0",
                  root: "!px-1",
                }}
              >
                <Accordion.Item value={container.name}>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-4 font-semibold text-xl px-2 py-3">
                      <Tooltip
                        delay={200}
                        position="top"
                        textClasses={
                          container.items?.length
                            ? "!text-black font-medium"
                            : "hidden"
                        }
                        label={
                          itemsVisible === container.name
                            ? "Hide items"
                            : "Show items"
                        }
                      >
                        <span
                          className={`flex items-center gap-1 cursor-pointer ${
                            container.items?.length ? "" : "opacity-50"
                          }`}
                          onClick={
                            container.items?.length ? handleItemsClick : null
                          }
                        >
                          <IconPlus
                            size={28}
                            data-rotate={itemsVisible === container.name}
                            className="transition data-[rotate=true]:rotate-45"
                          />
                          {container.items?.length}
                        </span>
                      </Tooltip>
                      <Tooltip
                        delay={200}
                        position="top"
                        label="Go to container page"
                      >
                        <Link href={`/containers/${container.id}`}>
                          <IconExternalLink size={28} className="text-black" />
                        </Link>
                      </Tooltip>
                    </div>
                  </div>
                  <Accordion.Panel>
                    <ScrollArea.Autosize
                      mah={600}
                      classNames={{ scrollbar: "mr-[-4px]" }}
                    >
                      <div className="flex flex-col gap-2">
                        {container?.items?.map((item) => (
                          <DraggableItemCard
                            item={item}
                            activeItem={activeItem}
                            key={item.name}
                          />
                        ))}
                      </div>
                    </ScrollArea.Autosize>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              {container?.containers &&
                container.containers.map((childContainer) => (
                  <ContainerAccordion
                    container={childContainer}
                    first={false}
                    key={childContainer.name}
                    activeItem={activeItem}
                    openContainers={openContainers}
                    handleContainerClick={handleContainerClick}
                  />
                ))}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Droppable>
    </Draggable>
  );
};

export default ContainerAccordion;