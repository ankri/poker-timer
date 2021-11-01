import {
  Alert,
  Button,
  Divider,
  Group,
  NumberInput,
  Text,
} from "@mantine/core";
import { CheckIcon } from "@modulz/radix-icons";
import { Form, Formik, useField } from "formik";
import * as React from "react";
import { CompletionStatus } from "../types/CompletionStatus";
import { DurationSettings } from "../types/DurationSettings";
import { calculateNumberOfRounds } from "../utils/calculateNumberOfRounds";
import { formatDuration } from "../utils/formatDuration";
import { EditButton } from "./EditButton";

interface DurationInputFormProps {
  status: CompletionStatus;
  onStatusChange: (newStatus: CompletionStatus) => void;
  durationSettings: DurationSettings;
  onComplete: (durationSettings: DurationSettings) => void;
}

const DurationInput = () => {
  const [field, _, helpers] = useField<number>("totalDurationInMinutes");
  const [hours, setHours] = React.useState<number>(
    Math.floor(field.value / 60)
  );
  const [minutes, setMinutes] = React.useState<number>(field.value % 60);

  return (
    <div>
      <Text>Wie lang soll das Spiel in etwa dauern?</Text>
      <Group grow style={{ marginBottom: 8 }}>
        <NumberInput
          label="Stunden"
          value={hours}
          min={0}
          max={12}
          step={1}
          onBlur={(event) => {
            field.onBlur(event);
            helpers.setValue(hours * 60 + minutes);
          }}
          onChange={(newValue) => {
            setHours(newValue);
          }}
        />
        <NumberInput
          label="Minuten"
          value={minutes}
          min={0}
          max={59}
          step={5}
          onChange={(newValue) => {
            setMinutes(newValue);
          }}
          onBlur={(event) => {
            field.onBlur(event);
            helpers.setValue(hours * 60 + minutes);
          }}
        />
      </Group>
    </div>
  );
};

const RoundDurationInput = () => {
  const [field, _, helpers] = useField<number>("changeEveryXMinutes");
  return (
    <div>
      <Text>Alle wie viel Minuten sollen die Blinds erhöht werden?</Text>
      <NumberInput
        name={field.name}
        label={`Alle ${field.value} Minuten`}
        value={field.value}
        min={2}
        max={59}
        step={5}
        onChange={(newValue) => {
          helpers.setValue(newValue);
        }}
        onBlur={field.onBlur}
      />
    </div>
  );
};

export const DurationInputForm: React.FC<DurationInputFormProps> = ({
  onStatusChange,
  status,
  onComplete,
  durationSettings,
}) => {
  if (status === "completed") {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Alert styles={{ root: { marginBottom: 8 } }}>
          Das Spiel dauert etwa{" "}
          <strong>
            {formatDuration(durationSettings.totalDurationInMinutes)}
          </strong>
          , dabei werden die Blinds werden alle{" "}
          <strong>
            {formatDuration(durationSettings.changeEveryXMinutes)}
          </strong>{" "}
          gewechselt. Es werden ca.{" "}
          <strong>{calculateNumberOfRounds(durationSettings)} Runden</strong>{" "}
          gespielt.
        </Alert>
        <EditButton
          onClick={() => {
            onStatusChange("todo");
          }}
        />
      </div>
    );
  } else {
    return (
      <Formik
        enableReinitialize
        initialValues={durationSettings}
        validate={(values) => {
          let errors: Partial<Record<keyof DurationSettings, string>> = {};

          if (values.totalDurationInMinutes === 0) {
            errors.totalDurationInMinutes =
              "Bitte gebe die Dauer des Spiels an";
          }

          if (values.changeEveryXMinutes === 0) {
            errors.changeEveryXMinutes = "Bitte gebe die Dauer der Runde an";
          }

          return errors;
        }}
        onSubmit={(values, formikHelpers) => {
          onComplete(values);
          onStatusChange("completed");
        }}
      >
        {({ values }) => (
          <Form noValidate style={{ display: "flex", flexDirection: "column" }}>
            <DurationInput />
            <RoundDurationInput />
            <Alert color="blue" style={{ marginTop: 8, marginBottom: 8 }}>
              Mit den aktuellen Einstellungen werden die Blinds{" "}
              <strong>
                {Math.floor(
                  values.totalDurationInMinutes / values.changeEveryXMinutes
                )}{" "}
                mal
              </strong>{" "}
              erhöht
            </Alert>
            <Divider style={{}} />
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
              Dauer bestätigen
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
};
