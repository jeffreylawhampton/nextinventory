"use client";
import { ColorSwatch, TextInput } from "@mantine/core";
import { updateCategory } from "./api/db";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { inputStyles } from "../lib/styles";
import FormModal from "../components/FormModal";
import FooterButtons from "../components/FooterButtons";
import ColorInput from "../components/ColorInput";

export default function EditCategory({ data, id, opened, close, user }) {
  const [formError, setFormError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [editedCategory, setEditedCategory] = useState({
    id: data?.id || undefined,
    name: data?.name || "",
    color: data?.color || { hex: "#ff4612" },
  });

  const handleSetColor = (e) => {
    setEditedCategory({ ...editedCategory, color: { hex: e } });
  };

  const handleCancel = () => {
    setEditedCategory({ ...editedCategory, color: data.color });
    setShowPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formError) return;
    if (
      editedCategory?.name === data?.name &&
      editedCategory?.color === data?.color
    )
      return close();
    try {
      await mutate(
        `categories${id}`,
        updateCategory({ ...editedCategory, userId: user?.id }),
        {
          optimisticData: {
            ...editedCategory,
            items: data?.items,
            color: { hex: editedCategory.color },
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      close();
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    close();
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  return (
    <FormModal opened={opened} close={close} title="Edit category">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextInput
          name="name"
          label="Name"
          autoFocus
          radius={inputStyles.radius}
          size={inputStyles.size}
          value={editedCategory.name}
          variant={inputStyles.variant}
          onChange={(e) =>
            setEditedCategory({
              ...editedCategory,
              name: e.target.value,
            })
          }
          onBlur={(e) => validateRequired(e)}
          onFocus={() => setFormError(false)}
          error={formError}
          classNames={{
            label: inputStyles.labelClasses,
            input: formError ? "!bg-danger-100" : "",
          }}
        />

        <TextInput
          name="color"
          label="Color"
          radius={inputStyles.radius}
          size={inputStyles.size}
          variant={inputStyles.variant}
          classNames={{
            label: inputStyles.labelClasses,
          }}
          value={editedCategory?.color?.hex}
          onChange={(e) =>
            setEditedCategory({ ...editedCategory, color: { hex: e } })
          }
          onClick={() => setShowPicker(!showPicker)}
          leftSection={
            <ColorSwatch
              color={editedCategory?.color?.hex}
              onClick={() => setShowPicker(!showPicker)}
            />
          }
        />
        {showPicker ? (
          <ColorInput
            color={editedCategory?.color?.hex}
            handleSetColor={handleSetColor}
            setShowPicker={setShowPicker}
            colors={user?.colors?.map((color) => color.hex)}
            handleCancel={handleCancel}
          />
        ) : null}
        <FooterButtons onClick={close} />
      </form>
    </FormModal>
  );
}
