import {
  Accordion,
  Button,
  ColorSwatch,
  Divider,
  Group,
  Space,
  Text,
} from "@mantine/core";
import { AccordionState } from "@mantine/core/lib/src/components/Accordion/use-accordion-state/use-accordion-state";
import { PlayIcon, CheckIcon } from "@modulz/radix-icons";
import { useRouter } from "next/dist/client/router";
import * as React from "react";
import {
  colors,
  DEFAULT_DURATION_OF_ROUND,
  DEFAULT_TOTAL_DURATION,
  DEFAULT_TOTAL_NUMBER_OF_CHIPS,
  STORAGE_KEY,
} from "../config/config";
import { CompletionStatus } from "../types/CompletionStatus";
import { Settings } from "../types/Settings";
import { calculateBigBlinds } from "../utils/calculateBigBlinds";
import { calculateNumberOfRounds } from "../utils/calculateNumberOfRounds";
import { formatDuration } from "../utils/formatDuration";
import { BlindsInputForm } from "./BlindsInputForm";
import { DurationInputForm } from "./DurationInputForm";
import { PlayerInputForm } from "./players/PlayerInputForm";

const CompletionIcon: React.FC<{ status: CompletionStatus | "editing" }> = ({
  status,
}) => {
  switch (status) {
    case "completed":
      return (
        <ColorSwatch
          color="green"
          size={14}
          style={{ marginTop: 13, color: "#FFF" }}
        >
          <CheckIcon width={12} height={12} />
        </ColorSwatch>
      );
    case "editing":
      return <ColorSwatch color="blue" size={14} style={{ marginTop: 13 }} />;
    case "error":
      return <ColorSwatch color="red" size={14} style={{ marginTop: 13 }} />;
    case "todo":
      return <ColorSwatch color="gray" size={14} style={{ marginTop: 13 }} />;
  }
};

const AccordionLabel: React.FC<{
  status: CompletionStatus;
  label: string;
  completedText: string;
  errorText: string;
  isActive: boolean;
}> = ({ status, label, completedText, errorText, isActive }) => {
  return (
    <Group noWrap style={{ marginLeft: 0 }} align="flex-start">
      <div>
        <CompletionIcon
          status={status === "todo" && isActive ? "editing" : status}
        />
      </div>
      <div>
        <Text>{label}</Text>
        {status === "completed" && !isActive ? (
          <Text size="sm" color="dimmed" weight={400}>
            {completedText}
          </Text>
        ) : null}
        {status === "error" && !isActive ? (
          <Text size="sm" color="red" weight={400}>
            {errorText}
          </Text>
        ) : null}
      </div>
    </Group>
  );
};

export const SettingsForm: React.FC = () => {
  const Router = useRouter();
  const [settings, setSettings] = React.useState<Settings>({
    players: [
      {
        name: "",
        color: colors[0],
      },
      {
        name: "",
        color: colors[1],
      },
      {
        name: "",
        color: colors[2],
      },
    ],
    useDefaultSettings: true,
    durationSettings: {
      changeEveryXMinutes: DEFAULT_DURATION_OF_ROUND,
      totalDurationInMinutes: DEFAULT_TOTAL_DURATION,
    },
    bigBlinds: [],
    totalNumberOfChips: DEFAULT_TOTAL_NUMBER_OF_CHIPS,
  });
  const [status, setStatus] = React.useState<{
    players: CompletionStatus;
    durationSettings: CompletionStatus;
    blinds: CompletionStatus;
  }>({
    players: "todo",
    durationSettings: "todo",
    blinds: "todo",
  });
  const [accordionOpenState, setAccordionOpenState] =
    React.useState<AccordionState>({
      0: true,
      1: false,
      2: false,
    });

  React.useEffect(() => {
    if (window && window.localStorage) {
      const maybeSettings = window.localStorage.getItem(STORAGE_KEY);
      if (maybeSettings) {
        try {
          const settings = JSON.parse(maybeSettings) as Settings;
          setSettings(settings);
        } catch (error) {
          console.error("Tried to load settings from localStorage but failed");
        }
      }
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Accordion
        state={accordionOpenState}
        onChange={(state) => {
          setAccordionOpenState(state);
        }}
        styles={{
          contentInner: { padding: 0 },
          content: { padding: 0 },
          control: { paddingLeft: 0 },
        }}
        iconPosition="right"
      >
        <Accordion.Item
          label={
            <AccordionLabel
              label="Schritt 1: Spieler"
              completedText={`${
                settings.players.length
              } Spieler: ${settings.players
                .map((player) => player.name)
                .join(", ")}`}
              errorText="Fehler: Bitte Namen eingeben"
              isActive={accordionOpenState[0]}
              status={status.players}
            />
          }
        >
          <PlayerInputForm
            playerSettings={{
              players: settings.players,
              useDefaultSettings: settings.useDefaultSettings,
            }}
            status={status.players}
            onStatusChange={(status: CompletionStatus) => {
              setStatus((prevStatus) => ({ ...prevStatus, players: status }));
            }}
            onComplete={(settings) => {
              setSettings((prevSettings) => ({
                ...prevSettings,
                players: settings.players,
                useDefaultSettings: settings.useDefaultSettings,
              }));

              if (settings.useDefaultSettings) {
                setSettings((prevSettings) => ({
                  ...prevSettings,
                  durationSettings: {
                    changeEveryXMinutes: 20,
                    totalDurationInMinutes: 180,
                  },
                  bigBlinds: [20, 40, 60, 100, 200, 300, 400, 800, 1600],
                }));

                setStatus({
                  players: "completed",
                  durationSettings: "completed",
                  blinds: "completed",
                });

                setAccordionOpenState({
                  0: false,
                  1: false,
                  2: true,
                });
              } else {
                setAccordionOpenState({
                  0: false,
                  1: true,
                  2: false,
                });
              }
            }}
          />
        </Accordion.Item>
        <Accordion.Item
          label={
            <AccordionLabel
              label="Schritt 2: Dauer"
              completedText={`Gesamtdauer etwa ${formatDuration(
                settings.durationSettings.totalDurationInMinutes
              )}. Blinds werden alle ${
                settings.durationSettings.changeEveryXMinutes
              } Minuten erhöht.`}
              errorText=""
              isActive={accordionOpenState[1]}
              status={status.durationSettings}
            />
          }
        >
          <DurationInputForm
            durationSettings={settings.durationSettings}
            status={status.durationSettings}
            onStatusChange={(status: CompletionStatus) => {
              setStatus((prevStatus) => ({
                ...prevStatus,
                durationSettings: status,
              }));
            }}
            onComplete={(durationSettings) => {
              setSettings((prevSettings) => {
                const numberOfRounds =
                  calculateNumberOfRounds(durationSettings);
                const newBigBlinds = calculateBigBlinds(
                  DEFAULT_TOTAL_NUMBER_OF_CHIPS,
                  numberOfRounds
                );

                const bigBlinds =
                  prevSettings.bigBlinds.length === 0 ||
                  prevSettings.bigBlinds.length !== newBigBlinds.length
                    ? newBigBlinds
                    : prevSettings.bigBlinds;

                return {
                  ...prevSettings,
                  durationSettings,
                  bigBlinds,
                };
              });
              setAccordionOpenState({
                0: false,
                1: false,
                2: true,
              });
            }}
          />
        </Accordion.Item>
        <Accordion.Item
          label={
            <AccordionLabel
              label="Schritt 3: Blinds"
              completedText={`Big Blinds: ${settings.bigBlinds.join(", ")}`}
              errorText=""
              isActive={accordionOpenState[2]}
              status={status.blinds}
            />
          }
        >
          <BlindsInputForm
            blindSettings={{
              bigBlinds: settings.bigBlinds,
              totalNumberOfChips: settings.totalNumberOfChips,
            }}
            durationSettings={settings.durationSettings}
            status={status.blinds}
            onComplete={(blindSettings) => {
              setSettings((prevSettings) => ({
                ...prevSettings,
                bigBlinds: blindSettings.bigBlinds,
                totalNumberOfChips: blindSettings.totalNumberOfChips,
              }));
              setStatus((prevStatus) => ({
                ...prevStatus,
                blinds: "completed",
              }));
              setAccordionOpenState({
                0: false,
                1: false,
                2: false,
              });
            }}
            onStatusChange={(newStatus) => {
              setStatus((prevStatus) => ({
                ...prevStatus,
                blinds: newStatus,
              }));
            }}
          />
        </Accordion.Item>
      </Accordion>
      <Divider style={{ marginTop: 8 }} />
      <Button
        color="teal"
        disabled={Object.values(status).some(
          (status) => status !== "completed"
        )}
        leftIcon={<PlayIcon />}
        styles={{
          root: {
            marginTop: 8,
            flexGrow: 1,
          },
        }}
        onClick={() => {
          if (window && window.localStorage) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            Router.push("play");
          }
        }}
      >
        Spiel starten
      </Button>
      <Space h="xl" />
    </div>
  );
};
