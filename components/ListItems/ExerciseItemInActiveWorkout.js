import { View, Button, StyleSheet, Text, Alert, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { Swipeable, TextInput } from "react-native-gesture-handler";
import { Row } from "react-native-easy-grid";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import TableHeaderRow from "../table/rows/TableHeaderRow";
import IncompleteRow from "../table/rows/IncompleteRow";
import IconButton from "../IconButton";
import { deleteAllSetsFromCurrentExercise } from "../../utils/database/deleteFunctions";
import { fetchAllSetsFromAllExerciseInstances } from "../../utils/database/fetchFunctions";
import { insertSet } from "../../utils/database/insertFunctions";
import {
  updateExerciseNotes, 
  updateExerciseRestTime, 
  updateExerciseSetTimerOn, 
  updateExerInstNotes, 
  updateSetOrder, 
  updateSetReps, 
  updateSetStatus, 
  updateSetType, 
  updateSetWeight
} from "../../utils/database/updateFunctions";
import Set from "../../models/set";
import ExerciseOptionsModal from "../modals/ExerciseOptionsModal";
import { Colors } from "../../constants/colors";

export default function ExerciseItemInActiveWorkout({ 
  exer,
  inst,
  restoredSetsArr,
  handleOnSetCompleted, 
  previous,
  heightInfo,
  updateNumSetsCompletedInWkt,
  updateNumSetsInWkt,
  workoutId,
  removeExerFromWorkout,
  changeExerName,
  flatlistRef,
  exerNumInList,
  handleGotRowY,
  onExerNumSetsChanged,
  onExerNotesHeightChanged,
  onInstNotesHeightChanged,
  workoutStatus
}) {
  // array of set rows
  const [rowArr, setRowArr] = useState(restoredSetsArr ? restoredSetsArr : 
    [
      {
        setNumber: 1,
        previous: previous,
        weight: "",
        reps: "",
        status: "IN PROGRESS",
        type: "WORKING",
        isWeightRecord: 0,
        isRepsRecord: 0,
        isVolumeRecord: 0
      },
    ]
  );
  const [restTimeAmount, setRestTimeAmount] = useState(
    exer?.restTime ? exer.restTime : "2.25");
  const [setTimerOn, setSetTimerOn] = useState(exer?.setTimerOn === 1 ? true : false);
  const [exerOptionsModalVisible, setExerOptionsModalVisible] = useState(false);
  // set counters for exercise
  const [currentNumberOfSets, setCurrentNumberOfSets] = useState(1);
  const [numCompletedSetsInExer, setNumCompletedSetsInExer] = useState(0);

  const [exerciseNotes, setExerciseNotes] = useState(exer.notes);
  const [exerInstNotes, setExerInstNotes] = useState(inst.exerInstNotes);
  const [exerNoteInputFocused, setExerNoteInputFocused] = useState(false);
  const [exerInstNoteInputFocused, setExerInstNoteInputFocused] = useState(false);

  const navigation = useNavigation();

  const originalExerNotes = exer.notes;

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // updates rowArr state when any input on any row is changed
  async function inputChangedHandler(inputIdentifier, setNumber, enteredValue) {
    let temp = rowArr;
    const updatedArr = await Promise.all(
      temp.map(async (set) => {
        if (set.setNumber === setNumber) {
          if (inputIdentifier === "lbs") {
            await updateSetWeight(setNumber, workoutId, exer.name, enteredValue);
              await updateSetStatus(setNumber, workoutId, exer.name, "IN PROGRESS");
            return {
              ...set,
              weight: enteredValue,
              status: "IN PROGRESS"
            };
          } else if (inputIdentifier === "reps") {
            await updateSetReps(setNumber, workoutId, exer.name, enteredValue);
            await updateSetStatus(setNumber, workoutId, exer.name, "IN PROGRESS");
            return {
              ...set,
              reps: enteredValue,
              status: "IN PROGRESS"
            };
          } else if (inputIdentifier === "status") {
            // If set status is currently IN PROGRESS
            // and we get the signal to try to set to completed
            // Sets are created with default status IN PROGRESS
            let shouldStatusBeCompleted;
            if (set.status === "IN PROGRESS") {
              // if weight and reps are filled out and valid we can 
              // set to completed
              if (set.weight && set.reps && 
                isNumeric(set.weight) && isNumeric(set.reps)) {
                shouldStatusBeCompleted = true;
                if (setTimerOn) {
                  handleOnSetCompleted(restTimeAmount);
                }
                updateNumSetsCompletedInWkt(true);
                setNumCompletedSetsInExer(numCompletedSetsInExer + 1);
              } else {
                shouldStatusBeCompleted = false;
                Alert.alert(
                  `Invalid/Missing Weight and/or Reps`,
                  "",
                  [
                    {
                      text: "Ok",
                      onPress: () => {},
                      style: "default",
                    }
                  ],
                  {userInterfaceStyle: "dark"}
                );
              }
            } else {
              shouldStatusBeCompleted = false;
              updateNumSetsCompletedInWkt(false);
              setNumCompletedSetsInExer(numCompletedSetsInExer - 1);
            }
            const newStatus = shouldStatusBeCompleted ? 
              "COMPLETED" : "IN PROGRESS";
            await updateSetStatus(setNumber, workoutId, exer.name, newStatus);
            await updateSetWeight(setNumber, workoutId, exer.name, 
              Number(set.weight).toString());
            await updateSetReps(setNumber, workoutId, exer.name, 
              Number(set.reps).toString());
            return {
              ...set,
              weight: shouldStatusBeCompleted ? Number(set.weight).toString() : set.weight,
              reps: shouldStatusBeCompleted ? Number(set.reps).toString() : set.reps,
              status: newStatus,
            };
          } else {
            // inputIdentifier === "setType"
            // If set type is currently WORKING
            // and we get the signal to try to set to WARMUP
            // Sets are created with default type WORKING
            
            const newType = set.type === "WORKING" ? "WARMUP" 
              : set.type === "WARMUP" ? "LEFT"
              : set.type === "LEFT" ? "RIGHT"
              : "WORKING" // set.type === "RIGHT"
            await updateSetType(setNumber, workoutId, exer.name, newType)
            return {
              ...set,
              type: newType
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
            lbsValue={item.weight}
            repsValue={item.reps}
            setIsCompleted={item.status === "COMPLETED"}
            inputChangedHandler={inputChangedHandler}
            isWarmupSet={item.type === "WARMUP"}
            type={item.type}
            previous={item.previous}
            flatlistRef={flatlistRef}
            exerNumInList={exerNumInList}
            handleGotRowY={handleGotRowY}
          />
        </Row>
      </Swipeable>
    );
  };

  function addRowButtonPressedHandler(previousSet) {
    setRowArr((currRowArr) => {
      return [
        ...currRowArr,
        {
          setNumber: currentNumberOfSets + 1,
          previous: previousSet,
          weight: "",
          reps: "",
          status: "IN PROGRESS",
          isWeightRecord: 0,
          isRepsRecord: 0,
          isVolumeRecord: 0
        },
      ];
    });
  }

  const deleteItem = async ({ item, index }) => {
    const setNumberToBeDeleted = index + 1;
    updateNumSetsInWkt(false);
    onExerNumSetsChanged(exer.name, heightInfo.numSets - 1);

    if (rowArr[index].status === "COMPLETED") {
      updateNumSetsCompletedInWkt(false);
    }
    // delete item
    let a = rowArr;
    a.splice(index, 1);
    //setRowArr([...a]);
    setCurrentNumberOfSets(currentNumberOfSets - 1);
    // update set numbers of sets after deleted set
    // this code works in reseting the set numbers
    // but any nums in fields aren't deleted right
    let b = a.map((set) => {
      if (set.setNumber > setNumberToBeDeleted) {
        return {
          ...set,
          setNumber: set.setNumber - 1,
        };
      } else {
        return set;
      }
    });
    setRowArr([...b]);
    await deleteAllSetsFromCurrentExercise(workoutId, exer.name);
    await updateSetOrder(
      workoutId, exer.name, b);
  };

  const openExerOptionsModal = () => {
    setExerOptionsModalVisible(true);
  }
  const closeExerOptionsModal = () => {
    setExerOptionsModalVisible(false);
  };

  const handleRestTimeSet = async (restTime) => {
    const restTimeInMin = (convertToMinutes(restTime)).toString();
    setRestTimeAmount(restTimeInMin);
    await updateExerciseRestTime(exer.name, restTimeInMin);
  }

  const convertToMinutes = (input) => {
    const minutes = Number(input.substring(0, 2));
    const seconds = Number(input.substring(2, 4));
    return minutes + seconds / 60;
  };

  const handleSetTimerStatusChanged = async () => {
    setSetTimerOn(!setTimerOn);
    await updateExerciseSetTimerOn(exer.name, !setTimerOn === true ? 1 : 0);
  }



  useEffect(() => {
    (async () => {
      if (workoutStatus === "WORKOUT CANCELED") {
        await updateExerciseNotes(originalExerNotes, exer.name);
      }
    })();
  }, [workoutStatus])
  


  return (
    <View>
      <View style={styles.nameAndOptionsRow}>
        <Pressable 
          style={({ pressed }) => [
            styles.exerciseName,
            styles.nameBox,
            pressed && { opacity: 0.5 }
          ]}
          onPress={() => {
            navigation.navigate("ExerciseScreen", {
              exer: exer,
              workoutId: workoutId
            });
          }}
        >
          <Text
            style={styles.exerciseTitleStyle}
            numberOfLines={1}
          >{exer.name}</Text>
        </Pressable>
        <View style={{ 
          flex: 1, 
          backgroundColor: "#140438", 
          borderRadius: 8, 
          margin: 2,
          justifyContent: "center",
          alignItems: "center"
          }}>
          <Ionicons name="swap-vertical-outline" color="white" size={20} />
        </View>
        <View style={styles.ellipsesBox}>
          <IconButton
            icon="ellipsis-horizontal-circle-outline"
            size={30}        
            color="white"
            onPress={() => {
              openExerOptionsModal();
            }}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", marginLeft: "1%", alignItems: "center",
        padding: 5}}>
        <Ionicons name="document-text-outline" color={"white"} size={20} />
        <Text style={{color: "white", fontSize: 16,}}>Exercise Notes</Text>
      </View>

      <TextInput 
        style={[styles.exerNoteInput, exerNoteInputFocused && { 
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "white" 
        }]}
        multiline={true}
        scrollEnabled={false}
        keyboardAppearance='dark'
        placeholder="notes to always show when doing this exercise:
          technique, machine settings, etc"
        maxLength={250}
        placeholderTextColor={Colors.purple3}
        onChangeText={async (text) => {
          setExerciseNotes(text);
          updateExerciseNotes(text, exer.name)
        }}
        defaultValue={exer.notes}
        value={exerciseNotes}
        onFocus={() => {
          setExerNoteInputFocused(!exerNoteInputFocused);
        }}
        onBlur={() => {
          setExerNoteInputFocused(!exerNoteInputFocused);
        }}
        onLayout={(e) => {
          onExerNotesHeightChanged(exer.name, e.nativeEvent.layout.height)
        }}
      />
      <TextInput 
        style={[styles.instNoteInput, exerInstNoteInputFocused && { 
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "white" 
        }]}
        multiline={true}
        scrollEnabled={false}
        keyboardAppearance='dark'
        placeholder="notes just for this workout: soreness, tiredness,
          mood, etc"
        maxLength={250}
        placeholderTextColor={Colors.purple4}
        onChangeText={async (text) => {
          setExerInstNotes(text);
          await updateExerInstNotes(text, exer.name, workoutId)
        }}
        defaultValue={inst.exerInstNotes}
        value={exerInstNotes}
        onFocus={() => {
          setExerInstNoteInputFocused(!exerInstNoteInputFocused);
        }}
        onBlur={() => {
          setExerInstNoteInputFocused(!exerInstNoteInputFocused);
        }}
        onLayout={(e) => {
          onInstNotesHeightChanged(exer.name, e.nativeEvent.layout.height)
        }}
      />

      <TableHeaderRow />

      {rowArr.map((item, index) =>
        renderItem({ item, index }, async () => {
          await deleteItem({ item, index });
        })
      )}
      <Button 
        title="Add Set" 
        onPress={async () => {
          onExerNumSetsChanged(exer.name, heightInfo.numSets + 1);
          // get previous set of this exercise from the previous workout
          // if it exists
          let previousSet = {
            weight: "",
            reps: ""
          }
          // get all previous sets of this exercise
          const pastInstancesSets = await fetchAllSetsFromAllExerciseInstances(
            exer.name, workoutId);
          if (pastInstancesSets?.length > 0) {
            // get last completed wkt id with this exercise
            let currentWktId = pastInstancesSets[0]?.workoutId;
            for (let set of pastInstancesSets) {
              if (set.workoutId === currentWktId) {
                // if there is a set number that matches the number
                // of the set we are adding
                if (set.setNumber === currentNumberOfSets + 1) {
                  previousSet = set;
                }
              }
            }
          }
          addRowButtonPressedHandler(previousSet);
          await insertSet(new Set(
            currentNumberOfSets + 1,
            -1, -1,
            "WORKING",
            "IN PROGRESS",
            exer.name,
            workoutId,
            0, 0, 0,
            previousSet
          ));
          setCurrentNumberOfSets(currentNumberOfSets + 1);
          updateNumSetsInWkt(true);
        }}
      />

        <View>
          {exerOptionsModalVisible && (
            <ExerciseOptionsModal 
              closeExerOptionsModal={closeExerOptionsModal}
              removeExerFromWorkout={removeExerFromWorkout}
              exercise={exer}
              numSetsInExer={currentNumberOfSets}
              numCompletedSetsInExer={numCompletedSetsInExer}
              handleRestTimeSet={handleRestTimeSet}
              restTimeAmount={restTimeAmount}
              changeExerName={changeExerName}
              setTimerOn={setTimerOn}
              handleSetTimerStatusChanged={handleSetTimerStatusChanged}
            />
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nameBox: {
    flex: 8,
  },
  ellipsesBox: {
    flex: 1
  },
  nameAndOptionsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exerciseName: {
  },
  grid: {
    borderRadius: 6,
    backgroundColor: "white",
  },
  exerNoteInput: {
    backgroundColor: Colors.purple6,
    padding: 5,
    color: "white",
    minWidth: 65,
    fontSize: 15,
    marginLeft: "4%",
    borderRadius: 8,
    marginBottom: 2
  },
  instNoteInput: {
    backgroundColor: Colors.purple5,
    padding: 5,
    color: "white",
    minWidth: 65,
    fontSize: 15,
    marginLeft: "4%",
    borderRadius: 8,
  },
  exerciseTitleStyle: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold"
  }
});
