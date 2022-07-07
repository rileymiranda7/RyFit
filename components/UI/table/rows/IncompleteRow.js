import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Col, Row, Grid } from "react-native-easy-grid";

import IncompleteSetNumber from "../row-elements/IncompleteSetNumber";
import NumberInput from "../row-elements/NumberInput";
import Previous from "../row-elements/Previous";

export default function IncompleteRow({ setNumber }) {
  return (
    <>
      <Col style={styles.set}>
        <IncompleteSetNumber>{setNumber}</IncompleteSetNumber>
      </Col>
      <Col style={styles.previous}>
        <Text>prev</Text>
      </Col>
      <Col style={styles.lbs}>
        <NumberInput />
      </Col>
      <Col style={styles.reps}>
        <NumberInput />
      </Col>
      <Col style={styles.completed}>
        <Text>completed</Text>
      </Col>
    </>
  );
}

const styles = StyleSheet.create({
  set: {
    flex: 2,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  previous: {
    flex: 3,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  lbs: {
    flex: 2,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
  },
  reps: {
    flex: 2,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
  completed: {
    flex: 1,
    backgroundColor: "gold",
    alignItems: "center",
    justifyContent: "center",
  },
});
