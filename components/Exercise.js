import { View, Button, StyleSheet, Text, Alert } from "react-native";
import { useState } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { Row } from "react-native-easy-grid";
import { useNavigation } from "@react-navigation/native";

import TableHeaderRow from "./UI/table/rows/TableHeaderRow";
import IncompleteRow from "./UI/table/rows/IncompleteRow";
import { deleteAllSetsFromCurrentExercise, insertSet, updateSetOrder, updateSetReps, updateSetStatus, updateSetWeight } from "../utils/database";
import Set from "../models/set";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

export default function Exercise({ 
  exerciseName, 
  handleOnSetCompleted, 
  updateNumSetsCompleted,
  updateNumSets,
  workoutId
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

  const navigation = useNavigation();

  // updates rowArr state when any input on any row is changed
  async function inputChangedHandler(inputIdentifier, setNumber, enteredValue) {
    let temp = rowArr;
    const updatedArr = await Promise.all(
      temp.map(async (set) => {
        if (set.setNumber === setNumber) {
          if (inputIdentifier === "lbs") {
            await updateSetWeight(setNumber, workoutId, exerciseName, enteredValue);
            return {
              setNumber: set.setNumber,
              previous: set.previous,
              lbs: enteredValue,
              reps: set.reps,
              status: set.status,
            };
          } else if (inputIdentifier === "reps") {
            await updateSetReps(setNumber, workoutId, exerciseName, enteredValue);
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
            const newStatus = shouldStatusBeCompleted ? 
              "COMPLETED" : "IN PROGRESS";
            await updateSetStatus(setNumber, workoutId, exerciseName, newStatus)
            return {
              setNumber: set.setNumber,
              previous: set.previous,
              lbs: set.lbs,
              reps: set.reps,
              status: newStatus,
            };
          }
        }
        return set;
      })
    );
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

  const deleteItem = async ({ item, index }) => {
    const setNumberToBeDeleted = index + 1;
    updateNumSets(false);
    if (rowArr[index].status === "COMPLETED") {
      updateNumSetsCompleted(false);
    }
    // delete item
    let a = rowArr;
    a.splice(index, 1);
    setRowArr([...a]);
    setCurrentNumberOfSets(currentNumberOfSets - 1);
    // update set numbers of sets after deleted set
    // this code works in reseting the set numbers
    // but any nums in fields aren't deleted right
    let b = a.map((set) => {
      if (set.setNumber > setNumberToBeDeleted) {
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
    await deleteAllSetsFromCurrentExercise(workoutId, exerciseName);
    await updateSetOrder(
      workoutId, exerciseName, b);
  };

  return (
    <View>
      <View>
        <Pressable 
          style={({ pressed }) => [
            styles.exerciseName,
            pressed && { opacity: 0.75 }
          ]}
          onPress={() => {
            navigation.navigate("ExerciseScreen", {
              exerciseName: exerciseName
            });
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
            }}
          >
            {exerciseName}
          </Text>
        </Pressable>
      </View>
      <TableHeaderRow />

      {rowArr.map((item, index) =>
        renderItem({ item, index }, async () => {
          await deleteItem({ item, index });
        })
      )}

      <Button 
        title="Add Set" 
        onPress={async () => {
          addRowButtonPressedHandler();
          await insertSet(new Set(
            currentNumberOfSets + 1,
            -1, -1,
            "WORKING",
            "IN PROGRESS",
            exerciseName,
            workoutId
          ));
          setCurrentNumberOfSets(currentNumberOfSets + 1);
          updateNumSets(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  nameRow: {
    flex: 1,
  },
  exerciseName: {
  },
  grid: {
    borderRadius: 6,
    backgroundColor: "white",
  },
});
