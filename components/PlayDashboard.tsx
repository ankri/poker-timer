import {
  ActionIcon,
  Button,
  Card,
  ColorSwatch,
  Divider,
  Group,
  Space,
  Tab,
  Table,
  Tabs,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";

import * as React from "react";
import { Settings } from "../types/Settings";
import {
  DEFAULT_THEME,
  hexToRgba,
  useCss,
  useMantineTheme,
} from "@mantine/styles";
import {
  PauseIcon,
  PlayIcon,
  ResumeIcon,
  TrackNextIcon,
  TrackPreviousIcon,
} from "@modulz/radix-icons";
import { Player } from "../types/Player";
import { useTimer } from "react-timer-hook";

const COLOR_DIMMED = DEFAULT_THEME.colors.gray[6];

export const PlayDashboard: React.FC<{ settings: Settings }> = ({
  settings,
}) => {
  const theme = useMantineTheme();
  const [round, setRound] = React.useState(1);
  const [blindRound, setBlindRound] = React.useState<number>(0);
  const expiryTimestamp = React.useMemo(() => {
    const date = new Date();
    date.setSeconds(
      date.getSeconds() + settings.durationSettings.changeEveryXMinutes * 60
    );
    return date;
  }, [settings.durationSettings.changeEveryXMinutes]);

  const { minutes, seconds, isRunning, restart, resume, pause } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire: () => {
      setTimeout(() => {
        const time = new Date();
        time.setSeconds(
          time.getSeconds() + settings.durationSettings.changeEveryXMinutes + 60
        );

        restart(time);
        setBlindRound((currentRound) => currentRound + 1);
      });
    },
  });

  const { css } = useCss();

  if (settings) {
    const bigBlind: Player = settings.players.at(
      (round - 1) % settings.players.length
    ) as Player;
    const smallBlind: Player = settings.players.at(
      round % settings.players.length
    ) as Player;

    return (
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
        })}
      >
        <Card style={{ marginBottom: 8 }}>
          <Title order={4}>
            Runde {round}{" "}
            {isRunning ? null : (
              <Text style={{ display: "inline" }} color="dimmed">
                (pausiert)
              </Text>
            )}
          </Title>
        </Card>
        <Group grow>
          <Card style={{ flexGrow: 1 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text size="xs">Big Blind</Text>
                <Title order={3} style={{ color: bigBlind.color }}>
                  {bigBlind.name}
                </Title>
              </div>
              <Title style={{ color: bigBlind.color }}>
                {settings.bigBlinds[blindRound]}
              </Title>
            </div>
          </Card>
          <Card style={{ flexGrow: 1 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text size="xs">Small Blind</Text>
                <Title order={3} style={{ color: smallBlind.color }}>
                  {smallBlind.name}
                </Title>
              </div>
              <Title style={{ color: smallBlind.color }}>
                {Math.floor(settings.bigBlinds[blindRound] / 2)}
              </Title>
            </div>
          </Card>
        </Group>
        <Card style={{ flexGrow: 1, marginTop: 8, marginBottom: 8 }}>
          <Text size="xs">Blindwechsel in</Text>
          <Title
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "inline" }}>
              {minutes > 0 ? `${minutes}min` : null}{" "}
              {seconds > 0 ? `${seconds}s` : null}
              {isRunning ? null : (
                <Text style={{ display: "inline" }} color="dimmed">
                  (pausiert)
                </Text>
              )}
            </div>
            <div style={{ display: "inline" }}>
              {isRunning ? (
                <ActionIcon
                  variant="outline"
                  onClick={() => {
                    pause();
                  }}
                >
                  <PauseIcon />
                </ActionIcon>
              ) : (
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={() => {
                    resume();
                  }}
                >
                  <ResumeIcon />
                </ActionIcon>
              )}
            </div>
          </Title>
        </Card>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />

        <Button
          disabled={!isRunning}
          styles={{
            root: {
              flexGrow: 1,
            },
          }}
          leftIcon={<TrackNextIcon />}
          onClick={() => {
            setRound((prevRound) => prevRound + 1);
          }}
        >
          Nächste Runde
        </Button>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />

        <Tabs grow styles={{ body: { paddingTop: 0 } }}>
          <Tab label="Spieler">
            <Card style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Group direction="column" grow>
                {settings.players.map((player, index) => {
                  const isBigBlind =
                    (round - 1) % settings.players.length === index;
                  const isSmallBlind =
                    round % settings.players.length === index;

                  return (
                    <div
                      key={`player-${index}-${player.name}`}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        backgroundColor: isBigBlind
                          ? theme.colorScheme === "dark"
                            ? theme.colors.gray[8]
                            : theme.colors.orange[1]
                          : undefined,
                        paddingLeft: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          minWidth: "50%",
                        }}
                      >
                        <ColorSwatch
                          color={
                            !isSmallBlind && !isBigBlind
                              ? hexToRgba(player.color, 0.65)
                              : player.color
                          }
                          style={{ marginRight: 8 }}
                          size={18}
                        />
                        <Title
                          style={{
                            color:
                              !isSmallBlind && !isBigBlind
                                ? COLOR_DIMMED
                                : undefined,
                          }}
                        >
                          {player.name}
                        </Title>
                      </div>
                      <div
                        className={css({
                          display: "flex",
                          alignItems: "center",
                        })}
                      >
                        {isBigBlind ? (
                          <>
                            <Text weight={800} style={{ marginRight: 8 }}>
                              {settings.bigBlinds[blindRound]}
                            </Text>
                            <Text size="sm" color="dimmed">
                              Big Blind
                            </Text>
                          </>
                        ) : null}
                        {isSmallBlind ? (
                          <>
                            <Text weight={800} style={{ marginRight: 8 }}>
                              {Math.floor(settings.bigBlinds[blindRound] / 2)}
                            </Text>
                            <Text size="sm" color="dimmed">
                              Small Blind
                            </Text>
                          </>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </Group>
            </Card>
          </Tab>
          <Tab label="Blinds">
            <Card style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Table>
                <thead>
                  <tr>
                    <th>Blindstufe</th>
                    <th style={{ textAlign: "center" }}>Small Blind</th>
                    <th style={{ textAlign: "center" }}>Big Blind</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {settings.bigBlinds.map((bigBlind, index) => (
                    <tr
                      key={`big-blind-${index}`}
                      style={{
                        backgroundColor:
                          index === blindRound
                            ? theme.colorScheme === "dark"
                              ? theme.colors.gray[8]
                              : theme.colors.orange[1]
                            : undefined,
                      }}
                    >
                      <td>{index + 1}</td>
                      <td className="center">{Math.floor(bigBlind / 2)}</td>
                      <td className="center">{bigBlind}</td>
                      <td style={{ width: 16 }}>
                        <Tooltip label="Zu dieser Runde springen" withArrow>
                          <ActionIcon
                            onClick={() => {
                              setBlindRound(index);
                              const time = new Date();
                              time.setSeconds(
                                time.getSeconds() +
                                  settings.durationSettings
                                    .changeEveryXMinutes *
                                    60
                              );
                              restart(time);
                            }}
                          >
                            <PlayIcon />
                          </ActionIcon>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tab>
        </Tabs>

        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
        <Button
          disabled={!isRunning}
          styles={{
            root: {
              flexGrow: 1,
            },
          }}
          leftIcon={<TrackNextIcon />}
          onClick={() => {
            setRound((prevRound) => prevRound + 1);
          }}
        >
          Nächste Runde
        </Button>
        <div
          className={css({
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            flexDirection: "row",
            marginTop: 8,
          })}
        >
          <Button
            leftIcon={<TrackPreviousIcon />}
            disabled={round === 1 || !isRunning}
            variant="outline"
            color="gray"
            onClick={() => {
              setRound((prevRound) => {
                if (prevRound > 1) {
                  return prevRound - 1;
                } else {
                  return prevRound;
                }
              });
            }}
            styles={{
              root: {
                flexGrow: 1,
              },
            }}
          >
            Runde rückgängig machen
          </Button>
          {isRunning ? (
            <Button
              leftIcon={<PauseIcon />}
              variant="outline"
              color="gray"
              onClick={() => {
                pause();
              }}
              styles={{
                root: {
                  flexGrow: 1,
                },
              }}
            >
              Spiel pausieren
            </Button>
          ) : (
            <Button
              leftIcon={<ResumeIcon />}
              onClick={() => {
                resume();
              }}
              styles={{
                root: {
                  flexGrow: 1,
                },
              }}
            >
              Spiel fortsetzen
            </Button>
          )}
        </div>
        <Space h="xl" />
      </div>
    );
  } else {
    return null;
  }
};
