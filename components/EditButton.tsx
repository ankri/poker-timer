import { Button } from "@mantine/core";
import { Pencil1Icon } from "@modulz/radix-icons";
import * as React from "react";

export const EditButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      leftIcon={<Pencil1Icon />}
      variant="outline"
      styles={{ root: { marginTop: 8 } }}
    >
      Bearbeiten
    </Button>
  );
};
