import { Button, Checkbox, Group, Popover, Table, Text } from "@mantine/core";
import { InfoCircledIcon } from "@modulz/radix-icons";
import { useField } from "formik";
import * as React from "react";

export const DefaultSettingsCheckbox: React.FC = () => {
  const [isBlindInfoPopOverOpened, setIsBlindInfoPopOverOpened] =
    React.useState(false);
  const [field, _, helpers] = useField<boolean>("useDefaultSettings");

  return (
    <Checkbox
      name={field.name}
      checked={field.value}
      onChange={(event) => {
        helpers.setValue(event.target.checked);
      }}
      styles={{
        root: {
          marginTop: 8,
          marginBottom: 8,
          alignItems: "flex-start",
        },
        input: {
          marginTop: 3,
        },
        icon: {
          marginTop: 9,
        },
      }}
      label={
        <Group spacing="xs">
          <div>
            <Text color={field.value ? undefined : "dimmed"}>
              Schnellstart mit Turnierregeln
            </Text>
          </div>
          <div>
            <Text color={field.value ? undefined : "dimmed"}>
              Wenn ausgewählt dauert das Spiel in etwa <strong>3h</strong>. Die
              Blinds werden alle <strong>20min</strong> erhöht.
            </Text>
          </div>
          <div>
            <Popover
              opened={isBlindInfoPopOverOpened}
              onClose={() => {
                setIsBlindInfoPopOverOpened(false);
              }}
              position="top"
              withArrow
              target={
                <Button
                  variant="outline"
                  compact
                  leftIcon={<InfoCircledIcon />}
                  onClick={() => {
                    setIsBlindInfoPopOverOpened((isOpened) => !isOpened);
                  }}
                >
                  Blindstruktur
                </Button>
              }
            >
              <Table striped>
                <thead>
                  <tr>
                    <th>Blindstufe</th>
                    <th>Small Blind</th>
                    <th>Big Blind</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>10</td>
                    <td>20</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>20</td>
                    <td>40</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>30</td>
                    <td>60</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>50</td>
                    <td>100</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>100</td>
                    <td>200</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>150</td>
                    <td>300</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>200</td>
                    <td>400</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>400</td>
                    <td>800</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>800</td>
                    <td>1600</td>
                  </tr>
                </tbody>
              </Table>
            </Popover>
          </div>
        </Group>
      }
    />
  );
};
