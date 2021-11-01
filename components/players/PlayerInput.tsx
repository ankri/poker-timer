import { ActionIcon, ColorSwatch, TextInput } from "@mantine/core";
import { Cross1Icon } from "@modulz/radix-icons";
import { useField } from "formik";
import * as React from "react";
import { colors, MINIMUM_NUMBERS_OF_PLAYERS } from "../../config/config";

export const PlayerInput: React.FC<{ index: number; onRemove: () => void }> = ({
  index,
  onRemove,
}) => {
  const [field, meta] = useField(`players.${index}.name`);
  const hasError = meta.touched && meta.error !== undefined;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
      }}
    >
      <TextInput
        required
        maxLength={36}
        autoFocus={index === 0}
        placeholder="Bitte Spielernamen eingeben"
        error={hasError ? meta.error : undefined}
        label={
          <>
            <ColorSwatch
              color={colors[index]}
              size={8}
              style={{ marginRight: "0.25rem" }}
            />
            Spieler {index + 1}
          </>
        }
        {...field}
        styles={{
          root: {
            flexGrow: 1,
          },
          input: {
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
          },
          label: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          },
        }}
        rightSection={
          index > MINIMUM_NUMBERS_OF_PLAYERS - 1 ? (
            <ActionIcon
              onClick={() => {
                onRemove();
              }}
            >
              <Cross1Icon />
            </ActionIcon>
          ) : null
        }
      />
    </div>
  );
};
