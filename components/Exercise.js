import { View, Button, StyleSheet, Text, Animated } from "react-native";
import { useState } from "react";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Swipeable } from "react-native-gesture-handler";

import IncompleteRow from "./UI/table/rows/IncompleteRow";
import TableHeaderRow from "./UI/table/rows/TableHeaderRow";

export default function Exercise({ exerciseName }) {
  const [i, setI] = useState(1);
  const [rowArr, setRowArr] = useState([1]);

  function addRowButtonPressedHandler() {
    setRowArr((currRowArr) => {
      return [...currRowArr, i + 1];
    });
    setI(i + 1);
  }

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <Button style={styles} title="rightbutton">
        <Animated.Text
          style={[
            styles,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Archive
        </Animated.Text>
      </Button>
    );
  };
  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <Button style={styles} title="leftbutton">
        <Animated.Text
          style={[
            styles,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Archive
        </Animated.Text>
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "white",
          fontSize: 25,
        }}
      >
        {exerciseName}
      </Text>
      <TableHeaderRow />

      {rowArr.map((element, index) => {
        return (
          <Swipeable
            renderRightActions={renderRightActions}
            renderLeftActions={renderLeftActions}
            key={index + 1}
          >
            <Row
              style={{
                height: 40,
              }}
            >
              <IncompleteRow setNumber={index + 1} />
            </Row>
          </Swipeable>
        );
      })}

      <Button title="Add Set" onPress={addRowButtonPressedHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  grid: {
    borderRadius: 6,
    backgroundColor: "white",
  },
});
