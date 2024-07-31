"use client";
import { useState } from "react";
import { Button, CircularProgress, Spinner } from "@nextui-org/react";
import { deleteLocation } from "../api/db";
import Link from "next/link";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import EditLocation from "../EditLocation";
import { Pencil } from "lucide-react";

const fetchLocation = async (id) => {
  try {
    const res = await fetch(`/locations/api/${id}`);
    const data = await res.json();
    return data.location;
  } catch (e) {
    throw new Error(e);
  }
};

const Page = ({ params: { id } }) => {
  const [showEditLocation, setShowEditLocation] = useState(false);

  const { isLoading, isError, data, isFetching } = useQuery({
    queryKey: ["location"],
    queryFn: () => fetchLocation(id),
  });

  if (isFetching)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  if (isError) return <div>failed to load</div>;
  if (isLoading) return <Spinner />;

  return (
    <div>
      {showEditLocation ? (
        <EditLocation data={data} setShowEditLocation={setShowEditLocation} />
      ) : (
        <>
          <div className="flex gap-3 items-center">
            <h1 className="font-bold text-3xl pb-0">{data?.name}</h1>
            <Pencil onClick={() => setShowEditLocation(true)} />
          </div>
          {data?.items?.map((item) => {
            return (
              <li key={item.name}>
                <Link href={`/${item.id}`}>{item.name}</Link>
              </li>
            );
          })}
          <Button
            onPress={() =>
              deleteLocation({ id }).then(toast.success("Deleted"))
            }
          >
            Delete location
          </Button>
          <Button onPress={() => setShowEditLocation(true)}>Edit</Button>
        </>
      )}
    </div>
  );
};

export default Page;
