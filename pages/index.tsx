import * as React from "react";
import { AppShell, Container } from "@mantine/core";
import type { NextPage } from "next";
import { SettingsForm } from "../components/SettingsForm";
import { AppShellHeader } from "../components/AppShellHeader";

const Home: NextPage = () => {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  } else {
    return (
      <AppShell
        padding="md"
        header={<AppShellHeader />}
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            height: "calc(100vh - 60px)",
          },
        })}
      >
        <Container size="sm">
          <SettingsForm />
        </Container>
      </AppShell>
    );
  }
};

export default Home;
