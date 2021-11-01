import { ActionIcon, Group, Header, Title } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/styles";
import { MoonIcon, SunIcon } from "@modulz/radix-icons";
import * as React from "react";

export const AppShellHeader = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Header height={60} padding="xs">
      <Group
        style={{
          height: "100%",
          marginTop: 0,
          marginBottom: 0,
          paddingLeft: 20,
          paddingRight: 20,
        }}
        position="apart"
      >
        <Title order={4}>Poker Timer</Title>
        <ActionIcon
          variant="default"
          onClick={() => {
            toggleColorScheme();
          }}
          size={30}
        >
          {colorScheme === "dark" ? <SunIcon /> : <MoonIcon />}
        </ActionIcon>
      </Group>
    </Header>
  );
};
