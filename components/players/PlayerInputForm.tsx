import { Button, Divider, Group } from "@mantine/core";
import { PlusIcon, CheckIcon } from "@modulz/radix-icons";
import { FieldArray, Formik, Form } from "formik";
import * as React from "react";
import { colors, MAXIMUM_NUMBERS_OF_PLAYERS } from "../../config/config";
import { CompletionStatus } from "../../types/CompletionStatus";
import { Player } from "../../types/Player";
import { CompletedView } from "./CompletedView";
import { PlayerInput } from "./PlayerInput";
import { DefaultSettingsCheckbox } from "./UseDefaultSettingsCheckbox";

type PlayerInputFormProps = {
  status: CompletionStatus;
  onStatusChange: (newStatus: CompletionStatus) => void;
  playerSettings: { players: Player[]; useDefaultSettings: boolean };
  onComplete: ({
    players,
    useDefaultSettings,
  }: {
    players: Player[];
    useDefaultSettings: boolean;
  }) => void;
};

export const validatePlayers = (players: Player[]): boolean => {
  return players.some(
    (player) => player.name === undefined || player.name.length === 0
  );
};

export const PlayerInputForm: React.FC<PlayerInputFormProps> = ({
  status,
  onStatusChange,
  playerSettings,
  onComplete,
}) => {
  if (status === "completed") {
    return (
      <CompletedView
        onStatusChange={onStatusChange}
        players={playerSettings.players}
      />
    );
  } else {
    return (
      <Formik
        enableReinitialize
        initialValues={{
          players: playerSettings.players,
          useDefaultSettings: playerSettings.useDefaultSettings,
        }}
        validate={(values) => {
          const errors = {
            players: values.players.map((player) => ({
              name:
                player.name === undefined || player.name.length === 0
                  ? "Bitte Namen eingeben"
                  : undefined,
            })),
          };
          const hasErrors = validatePlayers(values.players);

          if (hasErrors) {
            onStatusChange("error");
          } else {
            onStatusChange("todo");
          }

          return hasErrors ? errors : undefined;
        }}
        onSubmit={(values) => {
          onComplete({
            players: values.players,
            useDefaultSettings: values.useDefaultSettings,
          });
          onStatusChange("completed");
        }}
      >
        {({ values }) => (
          <Form style={{ display: "flex", flexDirection: "column" }}>
            <FieldArray name="players">
              {({ remove, push }) => {
                return (
                  <Group direction="column" grow>
                    {values.players.map((player, index) => {
                      return (
                        <div key={`player-${index + 1}`}>
                          <PlayerInput
                            index={index}
                            onRemove={() => {
                              remove(index);
                            }}
                          />
                        </div>
                      );
                    })}
                    {values.players.length < MAXIMUM_NUMBERS_OF_PLAYERS ? (
                      <Button
                        leftIcon={<PlusIcon />}
                        variant="outline"
                        onClick={() => {
                          const selectedColors = values.players.map(
                            (player) => player.color
                          );
                          const availableColors = colors.filter(
                            (color) => !selectedColors.includes(color)
                          );

                          push({
                            name: "",
                            color:
                              availableColors[
                                Math.floor(
                                  Math.random() * availableColors.length
                                )
                              ],
                          });
                        }}
                      >
                        Spieler hinzufügen
                      </Button>
                    ) : null}
                  </Group>
                );
              }}
            </FieldArray>
            <Divider style={{ marginTop: 8 }} />
            <DefaultSettingsCheckbox />
            <Divider style={{ marginTop: 8 }} />
            <Button
              type="submit"
              color="teal"
              leftIcon={<CheckIcon />}
              styles={{
                root: {
                  marginTop: 8,
                  marginBottom: 8,
                  flexGrow: 1,
                },
              }}
            >
              Spieler bestätigen
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
};
