import { View, Text, StyleSheet } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";

import SetNumber from "../row-elements/SetNumber";
import NumberInput from "../row-elements/NumberInput";
import Previous from "../row-elements/Previous";
import CompletedButton from "../row-elements/CompletedButton";

export default function IncompleteRow({
  setNumber,
  lbsValue,
  repsValue,
  inputChangedHandler,
}) {
  return (
    <>
      <Col style={styles.set}>
        <SetNumber>{setNumber}</SetNumber>
      </Col>
      <Col style={styles.previous}>
        <Previous />
      </Col>
      <Col style={styles.lbs}>
        <NumberInput
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "lbs", setNumber),
            value: lbsValue,
          }}
        />
      </Col>
      <Col style={styles.reps}>
        <NumberInput
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "reps", setNumber),
            value: repsValue,
          }}
        />
      </Col>
      <Col style={styles.completed}>
        <CompletedButton
          inputChangedHandler={inputChangedHandler.bind(
            this,
            "status",
            setNumber
          )}
        />
      </Col>
    </>
  );
}

const styles = StyleSheet.create({
  set: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  previous: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  lbs: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  reps: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  completed: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
