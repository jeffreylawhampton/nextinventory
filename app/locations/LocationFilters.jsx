import { Button, Chip } from "@mantine/core";
import { v4 } from "uuid";

const LocationFilters = ({ locationList, filters, setFilters }) => {
  return (
    <div className="flex flex-wrap gap-1 mb-3">
      <Chip.Group multiple value={filters} onChange={setFilters}>
        {locationList?.map((location) => {
          return (
            <Chip
              key={v4()}
              value={location.name}
              size="xs"
              variant="filled"
              classNames={{
                label: "font-semibold !text-[12px] xl:!py-2 xl:!px-3",
              }}
            >
              {location?.name}
            </Chip>
          );
        })}
      </Chip.Group>
      <Button
        size="sm"
        radius="xl"
        variant="subtle"
        classNames={{
          label: "font-medium !text-[14px] p-0",
          root: "mt-[-4px]",
        }}
        onClick={() =>
          setFilters(locationList.map((location) => location.name))
        }
      >
        Show all
      </Button>
      <Button
        size="sm"
        radius="xl"
        variant="subtle"
        classNames={{
          label: "font-medium !text-[14px] p-0",
          root: "mt-[-4px]",
        }}
        onClick={() => setFilters([])}
      >
        Clear
      </Button>
    </div>
  );
};

export default LocationFilters;
