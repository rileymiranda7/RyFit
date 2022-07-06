import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Col, Row, Grid } from "react-native-easy-grid";

import IncompleteSetNumber from "./row/IncompleteSetNumber";
import NumberInput from "./row/NumberInput";
import Previous from "./row/Previous";

export default function IncompleteRow({ setNumber }) {
  return (
    <>
      <Col style={styles.col}>
        <IncompleteSetNumber>{setNumber}</IncompleteSetNumber>
      </Col>
      <Col style={styles.col}>
        <Text>prev</Text>
      </Col>
      <Col style={styles.col}>
        <NumberInput />
      </Col>
      <Col style={styles.col}>
        <NumberInput />
      </Col>
      <Col style={styles.col}>
        <Text>completed</Text>
      </Col>
    </>
  );
}

const styles = StyleSheet.create({
  col: {
    backgroundColor: "green",
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
