import { View, Button, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { Col, Row, Grid } from "react-native-easy-grid";

import TableHeaderRow from "./UI/table/rows/TableHeaderRow";
import IncompleteRow from "./UI/table/rows/IncompleteRow";

export default function Exercise({ exerciseName }) {
  const [currentNumberOfSets, setCurrentNumberOfSets] = useState(1);
  const [rowArr, setRowArr] = useState([
    {
      setNumber: 1,
      previous: "",
      lbs: "",
      reps: "",
      status: "IN PROGRESS",
    },
  ]);
  let row = [];
  let prevOpenedRow;

  const renderItem = ({ item, index }, onClick) => {
    //
    const closeRow = (index) => {
      console.log("closerow");
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    };

    const renderRightActions = (progress, dragX, onClick) => {
      return (
        <View
          style={{
            margin: 0,
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Button color="red" onPress={onClick} title="DELETE"></Button>
        </View>
      );
    };

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, onClick)
        }
        onSwipeableOpen={() => closeRow(index)}
        ref={(ref) => (row[index] = ref)}
        rightOpenValue={-100}
        key={item.setNumber}
      >
        <Row
          style={{
            height: 40,
          }}
        >
          <IncompleteRow setNumber={item.setNumber} />
        </Row>
      </Swipeable>
    );
  };

  function addRowButtonPressedHandler() {
    setRowArr((currRowArr) => {
      return [
        ...currRowArr,
        {
          setNumber: currentNumberOfSets + 1,
          previous: "",
          lbs: "",
          reps: "",
          status: "IN PROGRESS",
        },
      ];
    });
    setCurrentNumberOfSets(currentNumberOfSets + 1);
  }

  function deleteSetButtonPressedHandler(setNumberToRemove) {
    console.log("set to remove: " + setNumberToRemove);
    console.log("total sets: " + currentNumberOfSets);
    console.log(rowArr);
    // remove last set
    let temp = [...rowArr];
    if (setNumberToRemove === currentNumberOfSets) {
      temp.pop();
      console.log("temp:");
      console.log(temp);
      setRowArr(temp);
    } else {
      let newArr = temp.map((set) => {
        if (set.setNumber > setNumberToRemove) {
          return {
            setNumber: set.setNumber - 1,
            previous: set.previous,
            lbs: set.lbs,
            reps: set.reps,
            status: set.status,
          };
        } else {
          return set;
        }
      });
      newArr.splice(setNumberToRemove - 1, 1);
      console.log("newArr:");
      console.log(newArr);
      setRowArr(newArr);
    }
    setCurrentNumberOfSets(currentNumberOfSets - 1);
  }

  const deleteItem = ({ item, index }) => {
    console.log(item, index);
    let temp = rowArr;
    let a = rowArr;
    // this code works in reseting the set numbers
    // but any nums in fields aren't deleted right
    /* let a = temp.map((set) => {
      if (set.setNumber > index + 1) {
        return {
          setNumber: set.setNumber - 1,
          previous: set.previous,
          lbs: set.lbs,
          reps: set.reps,
          status: set.status,
        };
      } else {
        return set;
      }
    }); */
    a.splice(index, 1);
    console.log(a);
    setRowArr([...a]);
    setCurrentNumberOfSets(currentNumberOfSets - 1);
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

      {rowArr.map((item, index) =>
        renderItem({ item, index }, () => {
          console.log("pressed delete", { item, index });
          deleteItem({ item, index });
        })
      )}

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
