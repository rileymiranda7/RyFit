import { View, Button, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { Col, Row, Grid } from "react-native-easy-grid";

import IncompleteRow from "./UI/table/IncompleteRow";
import TableHeaderRow from "./UI/table/TableHeaderRow";

export default function Exercise({ exerciseName }) {
  const [i, setI] = useState(1);
  const [rowArr, setRowArr] = useState([1]);

  function addRowButtonPressedHandler() {
    setRowArr((currRowArr) => {
      return [...currRowArr, i + 1];
    });
    setI(i + 1);
  }

  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>{exerciseName}</Text>
      <TableHeaderRow />
      <Grid>
        {rowArr.map((element, index) => {
          return (
            <Row
              style={{
                backgroundColor: "red",
                borderWidth: 2,
                borderColor: "white",
                height: 40,
                marginVertical: 10,
              }}
              key={index + 1}
            >
              <IncompleteRow setNumber={index + 1} />
            </Row>
          );
        })}
      </Grid>
      <Button title="Add row" onPress={addRowButtonPressedHandler}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
