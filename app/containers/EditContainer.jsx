"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { updateContainer } from "./api/db";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "../hooks/useUser";

export default function EditContainer({
  data,
  id,
  isOpen,
  onOpenChange,
  onClose,
}) {
  const [formError, setFormError] = useState(false);
  const [containerOptions, setContainerOptions] = useState([]);
  const [editedContainer, setEditedContainer] = useState({
    name: data?.name,
    id: data?.id,
    parentContainerId: data?.parentContainerId,
    locationId: data?.locationId,
  });

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const options = editedContainer.locationId
      ? user?.containers?.filter(
          (container) =>
            container.locationId == editedContainer.locationId &&
            container.id != data.id
        )
      : user?.containers?.filter((container) => container.id != data.id);
    setContainerOptions(options);
  }, [user]);

  const onUpdateContainer = async (e) => {
    e.preventDefault();
    if (!editedContainer?.name) return setFormError(true);
    if (
      editedContainer.name === data.name &&
      editedContainer.parentContainerId === data.parentContainerId
    )
      onOpenChange();
    onClose();
    try {
      await mutate(`container${id}`, updateContainer(editedContainer), {
        optimisticData: editedContainer,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      router.replace(`/containers/${id}?name=${editedContainer.name}`, {
        shallow: true,
      });
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleLocationChange = (e) => {
    setEditedContainer({
      ...editedContainer,
      locationId: e.target.value,
      parentContainerId: null,
    });
    setContainerOptions(
      e.target.value
        ? user?.containers?.filter(
            (container) =>
              container.locationId == e.target.value && container.id != data.id
          )
        : user?.containers?.filter((container) => container.id != data.id)
    );
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  return (
    isOpen && (
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="xl"
          placement="bottom-center"
          backdrop="blur"
          classNames={{
            backdrop: "bg-black bg-opacity-80",
            base: "px-4 py-8",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-xl font-semibold">
                  Edit container
                </ModalHeader>
                <ModalBody>
                  <form
                    onSubmit={onUpdateContainer}
                    className="flex flex-col gap-6"
                  >
                    <Input
                      name="name"
                      size="lg"
                      radius="sm"
                      isRequired
                      aria-label="Name"
                      label="Name"
                      value={editedContainer?.name}
                      onChange={(e) =>
                        setEditedContainer({
                          ...editedContainer,
                          name: e.target.value,
                        })
                      }
                      classNames={{ label: "font-semibold" }}
                      color={formError ? "danger" : "default"}
                      onBlur={(e) => validateRequired(e)}
                      onFocus={() => setFormError(false)}
                      isInvalid={formError}
                      validationBehavior="aria"
                      autoFocus
                    />

                    <Select
                      label="Location"
                      variant="flat"
                      placeholder="Select"
                      size="lg"
                      value={editedContainer.locationId}
                      defaultSelectedKeys={[
                        editedContainer?.locationId?.toString(),
                      ]}
                      onChange={handleLocationChange}
                    >
                      {user?.locations?.map((location) => (
                        <SelectItem key={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Parent container"
                      variant="flat"
                      placeholder="Select"
                      size="lg"
                      isDisabled={!containerOptions.length}
                      value={editedContainer.parentContainerId}
                      defaultSelectedKeys={[
                        editedContainer?.parentContainerId?.toString(),
                      ]}
                      onChange={(e) =>
                        setEditedContainer({
                          ...editedContainer,
                          parentContainerId: e.target.value,
                        })
                      }
                    >
                      {containerOptions.map((container) => (
                        <SelectItem key={container.id}>
                          {container.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <ModalFooter>
                      <Button
                        variant="light"
                        color="danger"
                        onPress={onOpenChange}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" color="primary">
                        Submit
                      </Button>
                    </ModalFooter>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    )
  );
}
