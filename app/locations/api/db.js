"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getLocation({ id }) {
  const { user } = await getSession();
  id = parseInt(id);
  return await prisma.location.findUnique({
    where: {
      id,
    },
    include: {
      locations: true,
      parentLocation: true,
    },
  });
}

export async function getLocations() {
  const { user } = await getSession();
  return await prisma.location.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
    include: {
      locations: true,
      parentLocation: true,
    },
  });
}

export async function createLocation({ name }) {
  const { user } = await getSession();
  await prisma.location.create({
    data: {
      name,
      user: {
        connect: {
          email: user?.email,
        },
      },
    },
  });
  return revalidatePath("/locations");
}

export async function createNewLocation({ name }) {
  const { user } = await getSession();
  await prisma.location.create({
    data: {
      name,
      user: {
        connect: {
          email: user?.email,
        },
      },
    },
  });
}

export async function updateLocation({ name, id }) {
  id = parseInt(id);

  const { user } = await getSession();
  return await prisma.location.update({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
    data: {
      name,
    },
  });
}

export async function deleteLocation({ id }) {
  id = parseInt(id);

  const { user } = await getSession();
  await prisma.location.delete({
    where: {
      id,
      user: {
        email: user?.email,
      },
    },
  });
  return redirect("/locations");
}

export async function removeItemFromContainer({ id }) {
  id = parseInt(id);
  const { user } = await getSession();
  await prisma.item.update({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
    data: {
      container: {
        disconnect: true,
      },
    },
  });
}

export async function removeFromContainer({ id, isContainer }) {
  id = parseInt(id);
  const { user } = await getSession();
  if (isContainer) {
    await prisma.container.update({
      where: {
        id,
        user: {
          email: user.email,
        },
      },
      data: {
        parentContainer: {
          disconnect: true,
        },
      },
    });
  } else {
    await prisma.item.update({
      where: {
        id,
        user: {
          email: user.email,
        },
      },
      data: {
        container: {
          disconnect: true,
        },
      },
    });
  }
}

export async function moveItem({
  itemId,
  destinationId,
  destinationType,
  destinationLocationId,
}) {
  destinationId = parseInt(destinationId);
  destinationLocationId = parseInt(destinationLocationId);
  itemId = parseInt(itemId);

  const data =
    destinationType === "location"
      ? {
          locationId: destinationId,
          containerId: null,
        }
      : { containerId: destinationId, locationId: destinationLocationId };
  const updated = await prisma.item.update({
    where: {
      id: itemId,
    },
    data: data,
  });
  revalidatePath("/locations");
}

export async function moveContainerToLocation({ containerId, locationId }) {
  locationId = parseInt(locationId);
  containerId = parseInt(containerId);

  const updated = await prisma.container.update({
    where: {
      id: containerId,
    },
    data: {
      locationId,
      parentContainerId: null,
      containers: {
        updateMany: {
          where: {
            parentContainerId: containerId,
          },
          data: {
            locationId,
          },
        },
      },
    },
  });

  const items = await prisma.item.updateMany({
    where: {
      OR: [
        { containerId },
        { container: { parentContainerId: containerId } },
        { container: { parentContainer: { parentContainerId: containerId } } },
        {
          container: {
            parentContainer: {
              parentContainer: { parentContainerId: containerId },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: { parentContainerId: containerId },
                },
              },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: { parentContainerId: containerId },
                  },
                },
              },
            },
          },
        },
      ],
    },
    data: {
      locationId,
    },
  });
  revalidatePath("/locations");
}

export async function moveContainerToContainer({
  containerId,
  newContainerId,
  newContainerLocationId,
}) {
  containerId = parseInt(containerId);
  newContainerId = parseInt(newContainerId);
  newContainerLocationId = parseInt(newContainerLocationId);
  if (containerId === newContainerId) return;
  const updated = await prisma.container.update({
    where: {
      id: containerId,
    },
    data: {
      locationId: newContainerLocationId,
      parentContainerId: newContainerId,
      containers: {
        updateMany: {
          where: {
            parentContainerId: containerId,
          },
          data: {
            locationId: newContainerLocationId,
          },
        },
      },
    },
  });

  const items = await prisma.item.updateMany({
    where: {
      OR: [
        { containerId },
        { container: { parentContainerId: containerId } },
        { container: { parentContainer: { parentContainerId: containerId } } },
        {
          container: {
            parentContainer: {
              parentContainer: { parentContainerId: containerId },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: { parentContainerId: containerId },
                },
              },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: {
                    parentContainer: { parentContainerId: containerId },
                  },
                },
              },
            },
          },
        },
      ],
    },
    data: {
      locationId: newContainerLocationId,
    },
  });
  revalidatePath("/locations");
}
