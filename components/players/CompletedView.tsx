import { ColorSwatch, List } from "@mantine/core";
import * as React from "react";
import { CompletionStatus } from "../../types/CompletionStatus";
import { Player } from "../../types/Player";
import { EditButton } from "../EditButton";

export const CompletedView: React.FC<{
  onStatusChange: (newStatus: CompletionStatus) => void;
  players: Player[];
}> = ({ players, onStatusChange }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <List spacing="sm" center>
        {players.map((player) => (
          <List.Item
            key={player.name}
            icon={<ColorSwatch color={player.color} size={12} />}
          >
            {player.name}
          </List.Item>
        ))}
      </List>
      <EditButton
        onClick={() => {
          onStatusChange("todo");
        }}
      />
    </div>
  );
};
