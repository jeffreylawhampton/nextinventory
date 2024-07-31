"use client";
import { Button, CircularProgress, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import NewLocation from "./NewLocation";

const fetchAllLocations = async () => {
  try {
    const res = await fetch("/locations/api");
    const data = await res.json();
    return data?.locations;
  } catch (e) {
    throw new Error(e);
  }
};

export default function Page() {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchAllLocations,
  });

  if (isPending) return <CircularProgress />;
  if (error) return "Something went wrong";

  return (
    <div>
      <ul>
        {data?.map((location) => (
          <Link
            href={`/locations/${location.id}`}
            key={location.id}
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["location"] })
            }
          >
            <li>{location.name}</li>
          </Link>
        ))}
      </ul>
      <NewLocation
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />
      <Button onPress={onOpen}>Create new location</Button>
    </div>
  );
}
