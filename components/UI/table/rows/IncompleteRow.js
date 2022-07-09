import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Col, Row, Grid } from "react-native-easy-grid";

import IncompleteSetNumber from "../row-elements/IncompleteSetNumber";
import NumberInput from "../row-elements/NumberInput";
import Previous from "../row-elements/Previous";

export default function IncompleteRow({
  setNumber,
  lbsValue,
  repsValue,
  numberInputChangedHandler,
}) {
  return (
    <>
      <Col style={styles.set}>
        <IncompleteSetNumber>{setNumber}</IncompleteSetNumber>
      </Col>
      <Col style={styles.previous}>
        <Previous />
      </Col>
      <Col style={styles.lbs}>
        <NumberInput
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: numberInputChangedHandler.bind(
              this,
              "lbs",
              setNumber
            ),
            value: lbsValue,
          }}
        />
      </Col>
      <Col style={styles.reps}>
        <NumberInput
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: numberInputChangedHandler.bind(
              this,
              "reps",
              setNumber
            ),
            value: repsValue,
          }}
        />
      </Col>
      <Col style={styles.completed}>
        <Ionicons name="checkbox" size={28} color="white" />
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
