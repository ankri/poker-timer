import { Button, Divider, NumberInput, Table, Text } from "@mantine/core";
import { CheckIcon, MagicWandIcon, Pencil1Icon } from "@modulz/radix-icons";
import { FieldArray, Form, Formik, useField, useFormikContext } from "formik";
import * as React from "react";
import { DEFAULT_STARTING_BLIND } from "../config/config";
import { CompletionStatus } from "../types/CompletionStatus";
import { DurationSettings } from "../types/DurationSettings";
import { calculateBigBlinds } from "../utils/calculateBigBlinds";
import { calculateNumberOfRounds } from "../utils/calculateNumberOfRounds";
import { formatDuration } from "../utils/formatDuration";
import { EditButton } from "./EditButton";

interface BlindsInputFormProps {
  blindSettings: { bigBlinds: number[]; totalNumberOfChips: number };
  durationSettings: DurationSettings;
  status: CompletionStatus;
  onStatusChange: (newStatus: CompletionStatus) => void;
  onComplete: (newSettings: {
    bigBlinds: number[];
    totalNumberOfChips: number;
  }) => void;
}

const BigBlindInput: React.FC<{ index: number; totalNumberOfChips: number }> =
  ({ index, totalNumberOfChips }) => {
    const [field, _, helpers] = useField<number>(`bigBlinds.${index}`);
    const { values } = useFormikContext<{ bigBlinds: number[] }>();
    const min =
      index === 0
        ? DEFAULT_STARTING_BLIND + 10
        : values.bigBlinds[index - 1] + 10;

    return (
      <NumberInput
        name={field.name}
        value={field.value}
        onBlur={field.onBlur}
        onChange={(newNumber) => {
          helpers.setValue(newNumber);
        }}
        min={min}
        max={totalNumberOfChips}
        step={10}
      />
    );
  };

const MaxNumbersOfChipsInput: React.FC = () => {
  const [field, _, helpers] = useField<number>("totalNumberOfChips");
  return (
    <NumberInput
      name={field.name}
      value={field.value}
      onBlur={field.onBlur}
      onChange={(newNumber) => {
        helpers.setValue(newNumber);
      }}
      label="Gesamtanzahl der Chips"
      min={100}
      max={100000}
      step={10}
      styles={{
        root: {
          flexGrow: 1,
          marginRight: 8,
        },
      }}
    />
  );
};

export const BlindsInputForm: React.FC<BlindsInputFormProps> = ({
  blindSettings,
  durationSettings,
  status,
  onComplete,
  onStatusChange,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <Formik
      initialValues={{
        bigBlinds: blindSettings.bigBlinds,
        totalNumberOfChips: blindSettings.totalNumberOfChips,
      }}
      onSubmit={() => {}}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <Form style={{ display: "flex", flexDirection: "column" }} noValidate>
          {status !== "completed" ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <MaxNumbersOfChipsInput />
                <Button
                  leftIcon={<MagicWandIcon />}
                  onClick={() => {
                    const numberOfRounds =
                      calculateNumberOfRounds(durationSettings);

                    const newBigBlinds = calculateBigBlinds(
                      values.totalNumberOfChips,
                      numberOfRounds
                    );

                    setFieldValue("bigBlinds", newBigBlinds);
                  }}
                >
                  Blinds neu berechnen
                </Button>
              </div>
              <Divider style={{ marginTop: 8 }} />
            </>
          ) : null}
          <FieldArray name="bigBlinds">
            {() => (
              <Table>
                <thead>
                  <tr>
                    <th>Blindstufe</th>
                    <th style={{ textAlign: "center" }}>Small Blind</th>
                    <th style={{ textAlign: "center" }}>Big Blind</th>
                  </tr>
                </thead>
                <tbody>
                  {values.bigBlinds.map((bigBlind, index) => (
                    <tr key={`big-blind-${index}`}>
                      <td>
                        {index + 1}{" "}
                        {index > 0 ? (
                          <Text
                            style={{ display: "inline" }}
                            size="xs"
                            color="dimmed"
                          >
                            (nach{" "}
                            {formatDuration(
                              durationSettings.changeEveryXMinutes * index
                            )}
                            )
                          </Text>
                        ) : null}
                      </td>
                      <td className="center">{Math.floor(bigBlind / 2)}</td>
                      <td className="center">
                        {isEditing ? (
                          <BigBlindInput
                            index={index}
                            totalNumberOfChips={values.totalNumberOfChips}
                          />
                        ) : (
                          bigBlind
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </FieldArray>
          {status === "completed" ? (
            <EditButton
              onClick={() => {
                onStatusChange("todo");
              }}
            />
          ) : (
            <>
              {!isEditing ? (
                <>
                  <Divider style={{ marginTop: 8 }} />
                  <Button
                    styles={{ root: { marginBottom: 8 } }}
                    variant="outline"
                    leftIcon={<Pencil1Icon />}
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    Blinds individuell einstellen
                  </Button>
                </>
              ) : null}
              <Divider style={{ marginTop: 8 }} />
              <Button
                styles={{ root: { marginBottom: 8 } }}
                leftIcon={<CheckIcon />}
                color="teal"
                onClick={() => {
                  setIsEditing(false);
                  onComplete({
                    bigBlinds: values.bigBlinds,
                    totalNumberOfChips: values.totalNumberOfChips,
                  });

                  onStatusChange("completed");
                }}
              >
                Blinds bestätigen
              </Button>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
};
