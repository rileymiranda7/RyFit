import { View, Button, StyleSheet, Text, Alert } from "react-native";
import { useState } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { Row } from "react-native-easy-grid";

import TableHeaderRow from "./UI/table/rows/TableHeaderRow";
import IncompleteRow from "./UI/table/rows/IncompleteRow";
import IconButton from "./UI/IconButton";

export default function Exercise({ 
  exerciseName, 
  handleOnSetCompleted, 
  updateNumSetsCompleted 
}) {
  const [currentNumberOfSets, setCurrentNumberOfSets] = useState(1);
  // array of set rows
  const [rowArr, setRowArr] = useState([
    {
      setNumber: 1,
      previous: "",
      lbs: "",
      reps: "",
      status: "IN PROGRESS",
    },
  ]);
  const [restTimeAmount, setRestTimeAmount] = useState("2.25");

  // updates rowArr state when any input on any row is changed
  function inputChangedHandler(inputIdentifier, setNumber, enteredValue) {
    let temp = rowArr;
    let updatedArr = temp.map((set) => {
      if (set.setNumber === setNumber) {
        if (inputIdentifier === "lbs") {
          return {
            setNumber: set.setNumber,
            previous: set.previous,
            lbs: enteredValue,
            reps: set.reps,
            status: set.status,
          };
        } else if (inputIdentifier === "reps") {
          return {
            setNumber: set.setNumber,
            previous: set.previous,
            lbs: set.lbs,
            reps: enteredValue,
            status: set.status,
          };
        } else {
          // inputIdentifier === "status"
          // if set status is currently in progress
          // and we get the signal to try to set to completed
          let shouldStatusBeCompleted;
          if (set.status === "IN PROGRESS") {
            // if lbs and reps are filled out we can set to completed
            if (set.lbs && set.reps) {
              shouldStatusBeCompleted = true;
              handleOnSetCompleted(restTimeAmount);
              updateNumSetsCompleted(true);
            } else {
              shouldStatusBeCompleted = false;
              Alert.alert(
                `Missing Weight and/or Reps`,
                "",
                [
                  {
                    text: "Ok",
                    onPress: () => {},
                    style: "default",
                  }
                ]
              );
            }
          } else {
            shouldStatusBeCompleted = false;
            updateNumSetsCompleted(false);
          }
          return {
            setNumber: set.setNumber,
            previous: set.previous,
            lbs: set.lbs,
            reps: set.reps,
            status: shouldStatusBeCompleted ? "COMPLETED" : "IN PROGRESS",
          };
        }
      }
      return set;
    });
    setRowArr(updatedArr);
  }

  let row = [];
  let prevOpenedRow;

  const renderItem = ({ item, index }, onClick) => {
    //
    const closeRow = (index) => {
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

    const setRowCompleted = () => {

    }

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
          <IncompleteRow
            setNumber={item.setNumber}
            lbsValue={item.lbs}
            repsValue={item.reps}
            setIsCompleted={item.status === "COMPLETED" ? true : false}
            inputChangedHandler={inputChangedHandler}
          />
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
    // remove last set
    let temp = [...rowArr];
    if (setNumberToRemove === currentNumberOfSets) {
      temp.pop();
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
      setRowArr(newArr);
    }
    setCurrentNumberOfSets(currentNumberOfSets - 1);
  }

  const deleteItem = ({ item, index }) => {
    // delete item
    let a = rowArr;
    a.splice(index, 1);
    setRowArr([...a]);
    setCurrentNumberOfSets(currentNumberOfSets - 1);
    // update set numbers of sets after deleted set
    // this code works in reseting the set numbers
    // but any nums in fields aren't deleted right
    let b = a.map((set) => {
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
    });
    setRowArr([...b]);
  };

  return (
    <View>
      <View style={styles.nameAndOptionsRow}>
        <Text
          style={{
            color: "white",
            fontSize: 20,
          }}
        >
          {exerciseName}
        </Text>
        <IconButton
          icon="ellipsis-horizontal-circle-outline"
          size={30}
          color="white"
          onPress={() => {}}
        />
      </View>
      <TableHeaderRow />

      {rowArr.map((item, index) =>
        renderItem({ item, index }, () => {
          deleteItem({ item, index });
        })
      )}

      <Button title="Add Set" onPress={addRowButtonPressedHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  nameAndOptionsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grid: {
    borderRadius: 6,
    backgroundColor: "white",
  },
});
