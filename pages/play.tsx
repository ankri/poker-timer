import * as React from "react";
import { AppShell, Container } from "@mantine/core";
import type { NextPage } from "next";
import { AppShellHeader } from "../components/AppShellHeader";
import { PlayDashboard } from "../components/PlayDashboard";
import { STORAGE_KEY } from "../config/config";
import { Settings } from "../types/Settings";
import { useRouter } from "next/dist/client/router";

const Home: NextPage = () => {
  const Router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);
  const [settings, setSettings] = React.useState<Settings>();
  React.useEffect(() => {
    setIsMounted(true);
    if (window && window.localStorage) {
      try {
        const maybeSettings = window.localStorage.getItem(STORAGE_KEY);
        if (maybeSettings) {
          const settings = JSON.parse(maybeSettings) as Settings;
          setSettings(settings);
        } else {
          console.log("No settings found yet");
          Router.replace("/");
        }
      } catch (error) {
        console.error(error);
        Router.replace("/");
      }
    }
  }, []);

  if (!isMounted || !settings) {
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
        <Container size="xs">
          <PlayDashboard settings={settings} />
        </Container>
      </AppShell>
    );
  }
};

export default Home;
