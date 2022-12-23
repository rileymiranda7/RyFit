import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { useStopwatch } from 'react-timer-hook';
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import Exercise from "../components/Exercise";
import PickExerciseForActiveWorkoutModal from "../components/UI/modals/PickExerciseForActiveWorkoutModal";
import { 
  deleteAllExerciseInstancesFromWorkout,
  deleteAllSetsFromCurrentExercise,
  deleteAllSetsFromWorkout,
  deleteExerciseInstance,
  deleteExerciseInstancesWithNoCompletedSets,
  deleteIncompleteSetsFromWorkout,
  deleteWorkout, 
  fetchAllSetsFromAllExerciseInstances, 
  fetchCompletedWorkouts, 
  fetchRoutine,
  insertExerciseInstance, 
  insertSet, 
  updateExerciseNumberInWorkout, 
  updateRecords, 
  updateWorkoutDuration, 
  updateWorkoutExerciseOrder, 
  updateWorkoutName 
} from "../utils/database";
import { ExerciseInstance } from "../models/exerciseInstance";
import Set from "../models/set";

export default function ActiveWorkoutScreen({
  handleOnSetCompleted,
}) {

  const [exerAndInstList, setExerAndInstList] = useState([]);
  /* {
    exer: {
      name,
      restTime,
      notes 
    },
    inst: {
      name,
      workoutId,
      numSetsCompleted,
      numberInWorkout
    },
    firstSet: {
      previous: {}
    }
  } */

  const [pickExerModalVisible, setPickExerModalVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState(
    routineName ? routineName : "New Workout");
  const [numSetsCompleted, setNumSetsCompleted] = useState(0);
  const [numSets, setNumSets] = useState(0);

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });

  const route = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const { routineName, workoutId } = route.params;

  const loadRoutine = async (routineName) => {
    console.log(await fetchCompletedWorkouts());
    const routine = await fetchRoutine(routineName);
    // insert exerciseInstances
    // update exerAndInstList
    // insert sets for each exercise
    let tempExerAndInstList = [];
    let numberOfSets = 0;
    await Promise.all(
      routine.exercises.map(async (exercise, index) => {

        const exerciseInstance = new ExerciseInstance(
          exercise.name, workoutId, 0, -1
        );
        
        await insertExerciseInstance(exerciseInstance);

        // get previous set of this exercise from the previous workout
        // if it exists
        let previousSet = {
          weight: "",
          reps: ""
        }
        // get all previous sets of this exercise
        const pastInstancesSets = await fetchAllSetsFromAllExerciseInstances(
          exercise.name, workoutId);
          console.log("pastInstancesSets");
          console.log(pastInstancesSets);
        if (pastInstancesSets?.length > 0) {
          // get last completed wkt id with this exercise
          let currentWktId = pastInstancesSets[0]?.workoutId;
          for (let set of pastInstancesSets) {
            if (set.workoutId === currentWktId) {
              // if there is a set number that matches the number
              // of the set we are adding
              // we are adding exercise so this is first set
              if (set.setNumber ===  1) {
                previousSet = set;
              }
            }
          }
        }

        await insertSet(new Set(
          1, -1, -1, "WORKING", "IN PROGRESS", 
          exercise.name, workoutId, 0, 0, 0,
          previousSet));

        tempExerAndInstList.push({ 
          exer: exercise, inst: exerciseInstance, 
          firstSet: {
            previous: previousSet
          }
        });

        numberOfSets = index + 1;
      })
    );
    setNumSets(numberOfSets);
    setExerAndInstList(tempExerAndInstList);
  };

  async function submitPickedExerciseHandler(exercises) {
    // add new Exercise and ExerciseInstance to exerAndInstList
    // insert new exercise instances
    // insert new sets for new exercises
    // update set counter
    let curExerciseNames = [];
    exerAndInstList.forEach((exerAndInst) => {
      curExerciseNames.push(exerAndInst.exer.name);
    });
    let tempExerAndInstList = exerAndInstList;
    let numberOfSets = 0;
    await Promise.all(
      exercises.map(async (exercise, index) => {
        if (!curExerciseNames.includes(exercise.name)) {
          const exerciseInstance = new ExerciseInstance(
            exercise.name, workoutId, 0, -1
          );
          await insertExerciseInstance(exerciseInstance);

          // get previous set of this exercise from the previous workout
          // if it exists
          let previousSet = {
            weight: "",
            reps: ""
          }
          // get all previous sets of this exercise
          const pastInstancesSets = await fetchAllSetsFromAllExerciseInstances(
            exercise.name, workoutId);
          if (pastInstancesSets?.length > 0) {
            // get last completed wkt id with this exercise
            let currentWktId = pastInstancesSets[0]?.workoutId;
            for (let set of pastInstancesSets) {
              if (set.workoutId === currentWktId) {
                // if there is a set number that matches the number
                // of the set we are adding
                // we are adding exercise so this is first set
                if (set.setNumber ===  1) {
                  previousSet = set;
                }
              }
            }
          }

          await insertSet(new Set(
            1, -1, -1, "WORKING", "IN PROGRESS", 
            exercise.name, workoutId, 0, 0, 0,
            previousSet));
            
          numberOfSets++;

          tempExerAndInstList.push({ 
            exer: exercise, inst: exerciseInstance, 
            firstSet: {
              previous: previousSet
            }
          });
        }
      })
    );
    setNumSets(numberOfSets);
    setExerAndInstList(tempExerAndInstList);
    setPickExerModalVisible(false);
  }
  
  const closePickExerModal = () => {
    setPickExerModalVisible(false);
  };
  
  const endWorkout = () => {
    console.log("numSets: " + numSets);
    console.log("numSetsCompleted: " + numSetsCompleted);
    const exerList = exerAndInstList.map((exerInst) => {
      return exerInst.exer; });
    if (numSetsCompleted < 1) {
      Alert.alert(
        `End Current Workout?`,
        "Workouts with no completed sets will not be saved!",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "End Workout",
            onPress: async () => {
              await deleteAllSetsFromWorkout(workoutId);
              await deleteWorkout(workoutId);
              await deleteExerciseInstancesWithNoCompletedSets(
                workoutId, exerList);
              navigation.navigate("CurrentWorkout", {
                workoutWasCompleted: false
              });
            },
            style: "destructive",
          },
        ]
      );
      return;
    } else if (numSets - numSetsCompleted > 0) {
      Alert.alert(
        `End Current Workout?`,
        "There are some sets still in progress!",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "End Workout",
            onPress: async () => {
              const duration = hours + "h " + minutes + "m"
              await updateWorkoutDuration(duration, workoutId);
              await updateWorkoutExerciseOrder(exerAndInstList, workoutId, true, -1);
              await updateRecords(workoutId, exerList);
              await deleteExerciseInstancesWithNoCompletedSets(
                workoutId, exerList);
              await deleteIncompleteSetsFromWorkout(workoutId);
              navigation.navigate("CurrentWorkout", {
                workoutWasCompleted: true
              });
            },
            style: "destructive",
          },
        ]
        );
    }
    else {
      Alert.alert(
        `End Current Workout?`,
        "",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "End Workout",
            onPress: async () => {
              await updateWorkoutExerciseOrder(exerAndInstList, workoutId, true, -1);
              const duration = hours + "h " + minutes + "m";
              await updateWorkoutDuration(duration, workoutId);
              await updateRecords(workoutId, exerList);
              navigation.navigate("CurrentWorkout", {
                workoutWasCompleted: true
              });
            },
          },
        ]
        );
      }
    }

    const cancelWorkout = async () => {
      Alert.alert(
        `Cancel Workout?`,
        "All workout data will be deleted",
        [
          {
            text: "Continue Workout",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Cancel Workout",
            onPress: async () => {
              await deleteAllSetsFromWorkout(workoutId);
              await deleteAllExerciseInstancesFromWorkout(workoutId);
              await deleteWorkout(workoutId);
              navigation.navigate("CurrentWorkout", {
                workoutWasCompleted: false
              });
            },
            style: "destructive",
          },
        ]
      );
    }

  const updateNumSetsCompleted = (shouldAddOneSet) => {
    if (shouldAddOneSet) {
      setNumSetsCompleted(numSetsCompleted + 1);
    } else {
      setNumSetsCompleted(numSetsCompleted - 1);
    }
  }

  const updateNumSets = (shouldAddOneSet) => {
    if (shouldAddOneSet) {
      setNumSets(numSets + 1);
    } else {
      setNumSets(numSets - 1);
    }
  }
  
  const resetWorkoutName = async () => {
    await updateWorkoutName(workoutId, workoutName);
  }

  const removeExerFromWorkout = async (
    exerciseNameToBeDeleted, numSetsInExer, numCompletedSetsInExer) => {
      console.log(exerciseNameToBeDeleted);
    // delete exer and inst from exerAndInstList
    let tempExerAndInstList = exerAndInstList;
    tempExerAndInstList = tempExerAndInstList.filter((exerInst) => 
      exerInst.exer.name !== exerciseNameToBeDeleted);
    console.log("tempExerAndInstList");
    console.log(tempExerAndInstList);
    setExerAndInstList(tempExerAndInstList);
    
    // delete ExerciseInstance from db
    await deleteExerciseInstance(exerciseNameToBeDeleted, workoutId);
    
    // delete sets from db
    await deleteAllSetsFromCurrentExercise(workoutId, exerciseNameToBeDeleted);

    // subtract sets from counters
    setNumSets(numSets - numSetsInExer);
    setNumSetsCompleted(numSetsCompleted - numCompletedSetsInExer);
  }



  useEffect(() => {
    if (isFocused && routineName) {
      if (routineName !== "BLANK") {
        loadRoutine(routineName);
        setWorkoutName(routineName);
      }
      console.log("new workout workoutId: " + workoutId);
    }
  }, [isFocused, routineName]);



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.exerciseList}>
        <DraggableFlatList
        onDragEnd={async ({ data }) => {
          setExerAndInstList(data);
          await updateWorkoutExerciseOrder(data, workoutId, true, -1);
        }}
          ListHeaderComponent={
            <View style={[styles.rowSpread, { marginBottom: 12}]}>
                <TextInput
                  style={[styles.textStyle, styles.textInput]}
                  onChangeText={setWorkoutName}
                  onBlur={() => resetWorkoutName()}
                  value={workoutName}
                  maxLength={20}
                />
              <View style={styles.timerContainer}>
                <Text style={styles.timerDigit}>{
                  hours < 10 ? 0 : hours % 10
                }</Text>
                <Text style={styles.timerDigit}>{
                  hours >= 10 ? Math.floor(hours / 10) : hours
                }</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.timerDigit}>{
                  minutes < 10 ? 0 : minutes % 10
                }</Text>
                <Text style={styles.timerDigit}>{
                  minutes >= 10 ? Math.floor(minutes / 10) : minutes
                }</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.timerDigit}>{
                  seconds < 10 ? 0 : Math.floor(seconds / 10)
                }</Text>
                <Text style={styles.timerDigit}>{
                  seconds >= 10 ? seconds % 10 : seconds
                }</Text>
              </View>
            </View>
          }
          data={exerAndInstList}
          renderItem={({ item, drag, isActive }) => {
            return (
              <ScaleDecorator>
                <TouchableOpacity
                  activeOpacity={1}
                  onLongPress={drag}
                  disabled={isActive}
                  style={[
                  /*  styles.rowItem,
                    { backgroundColor: isActive ? "red" : item.backgroundColor }, */
                  ]}
                >
                  <Exercise
                    exer={item.exer}
                    inst={item.inst}
                    previous={item.firstSet.previous}
                    handleOnSetCompleted={handleOnSetCompleted}
                    updateNumSetsCompletedInWkt={updateNumSetsCompleted}
                    updateNumSetsInWkt={updateNumSets}
                    workoutId={workoutId}
                    removeExerFromWorkout={removeExerFromWorkout}
                  />
                </TouchableOpacity>
              </ScaleDecorator>
            );
          }}
          keyExtractor={(exerAndInst) => exerAndInst.exer.name}
          ListFooterComponent={
            <>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonOpen,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => setPickExerModalVisible(true)}
              >
                <Text style={styles.textStyle}>Add Exercise</Text>
              </Pressable>
              <View style={{ flexDirection: "row", justifyContent: "center"}}>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.endWorkoutButton,
                    pressed && { opacity: 0.75 },
                  ]}
                  onPress={() => endWorkout()}
                >
                  <Text style={styles.buttonTextStyle}>End Workout</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.cancelWorkoutButton,
                    pressed && { opacity: 0.75 },
                  ]}
                  onPress={() => cancelWorkout()}
                >
                  <Text style={styles.buttonTextStyle}>Cancel Workout</Text>
                </Pressable>

              </View>
              <View style={{ marginBottom: 100}}></View>
            </>
          }
        />
      </View>
      <View>
        {pickExerModalVisible && (
          <PickExerciseForActiveWorkoutModal
            submitPickedExerciseHandler={submitPickedExerciseHandler}
            closeModal={closePickExerModal}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  rowSpread: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exerciseList: {
    flex: 1,
    minHeight: "100%",
    minWidth: "100%",
    backgroundColor: "black",
    paddingHorizontal: 9,
    paddingTop: 5,
  },
  container: {
    flex: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 20,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  endWorkoutButton: {
    backgroundColor: "green",
    margin: 5
  },
  cancelWorkoutButton: {
    backgroundColor: "#ff0000",
    margin: 5
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  buttonTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 19,
  },
  textInput: {
    minWidth: "50%",
    maxWidth: "71%",
    textAlign: "left"
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 30,
  },
  input: {
    fontSize: 25,
    backgroundColor: "#b8bbbe",
    padding: 4,
    minWidth: "78%",
    minHeight: "7%",
  },
  inputContainer: {
    backgroundColor: "#b8bbbe",
    minWidth: "80%",
    height: "8%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    marginRight: 0
  },
  timerText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  timerDigit: {
    fontSize: 18,
    color: "white",
    minWidth: "4%",
    padding: 0,
    margin: 0,
    textAlign: "center",
  },
  colon: {
    fontSize: 18,
    color: "white",
    padding: 0,
    margin: 0,
    textAlign: "center",
    fontWeight: "bold",
  },
});
