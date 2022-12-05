import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  TouchableOpacity
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
  deleteExerciseInstancesWithNoCompletedSets,
  deleteIncompleteSets,
  deleteWorkout, 
  fetchCompletedWorkouts, 
  fetchRoutine,
  insertExerciseInstance, 
  insertSet, 
  updateExerciseNumberInWorkout, 
  updateWorkoutDuration, 
  updateWorkoutExerciseOrder, 
  updateWorkoutName 
} from "../utils/database";
import { ExerciseInstance } from "../models/exerciseInstance";
import Set from "../models/set";

export default function ActiveWorkoutScreen({
  handleOnSetCompleted,
}) {
  const [exerciseList, setExerciseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState(
    routineName ? routineName : "New Workout"
  );
  const [numSetsCompleted, setNumSetsCompleted] = useState(0);
  const [numSets, setNumSets] = useState(0)
  const [exerciseStateList, setExerciseStateList] = useState([]);

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
    console.log("here")
    console.log(await fetchCompletedWorkouts());
    const routine = await fetchRoutine(routineName);
    setExerciseList(routine.exercises);
    // insert exerciseInstances
    // update exerciseStateList
    // insert sets for each exercise
    let exerciseStateList = [];
    let numberOfSets = 0;
    await Promise.all(
      routine.exercises.map(async (exercise, index) => {
        const exerciseInstance = new ExerciseInstance(
          exercise.name, workoutId, 0, index + 1
        );
        await insertExerciseInstance(exerciseInstance);
        exerciseStateList.push(exerciseInstance);
        await insertSet(new Set(
          1, -1, -1, "WORKING", "IN PROGRESS", 
          exercise.name, workoutId));
        numberOfSets = index + 1;
      })
    );
    setNumSets(numberOfSets);
    setExerciseStateList(exerciseStateList);
  };

  async function submitPickedExerciseHandler(exercises) {
    // update exerciseList and exerciseStateList with new
    // exercises
    // insert new exercise instances
    // insert new sets for new exercises
    let curExerciseNames = [];
    exerciseList.forEach((exercise) => {
      curExerciseNames.push(exercise.name);
    });
    let tempExerList = exerciseList;
    let tempExerStateList = exerciseStateList;
    let numberOfSets = 0;
    await Promise.all(
      exercises.map(async (exercise, index) => {
        if (!curExerciseNames.includes(exercise.name)) {
          tempExerList.push(exercise);
          const exerciseInstance = new ExerciseInstance(
            exercise.name, workoutId, 0, index + 1
          );
          await insertExerciseInstance(exerciseInstance);
          await insertSet(new Set(
            1, -1, -1, "WORKING", "IN PROGRESS", 
            exercise.name, workoutId));
            numberOfSets = index + 1;
          tempExerStateList.push(exerciseInstance);
        }
      })
    );
    setNumSets(numberOfSets);
    setExerciseList(tempExerList);
    setExerciseStateList(tempExerStateList);
    setModalVisible(false);
  }
  
  const closeModal = () => {
    setModalVisible(false);
  };
  
  const endWorkout = () => {
    console.log("numSets: " + numSets);
    console.log("numSetsCompleted: " + numSetsCompleted);
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
              await deleteIncompleteSets(workoutId);
              await deleteWorkout(workoutId);
              await deleteExerciseInstancesWithNoCompletedSets(
                workoutId, exerciseList);
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
              await deleteIncompleteSets(workoutId);
              await deleteExerciseInstancesWithNoCompletedSets(
                workoutId, exerciseList);
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
              const duration = hours + "h " + minutes + "m"
              await updateWorkoutDuration(duration, workoutId);
              navigation.navigate("CurrentWorkout", {
                workoutWasCompleted: true
              });
            },
          },
        ]
        );
      }
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
    <View style={styles.container}>
      <View style={styles.exerciseList}>
        <DraggableFlatList
        onDragEnd={async ({ data }) => {
          setExerciseList(data);
          await updateWorkoutExerciseOrder(data, workoutId, true, -1);
        }}
          ListHeaderComponent={
            <View style={[styles.rowSpread, { marginBottom: 12}]}>
              <View style={styles.rowTogether}>
                <TextInput
                  style={[styles.textStyle, styles.textInput]}
                  onChangeText={setWorkoutName}
                  onBlur={() => resetWorkoutName()}
                  value={workoutName}
                  maxLength={14}
                />
              </View>
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
          data={exerciseList}
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
                    exerciseName={item.name}
                    handleOnSetCompleted={handleOnSetCompleted}
                    updateNumSetsCompleted={updateNumSetsCompleted}
                    updateNumSets={updateNumSets}
                    workoutId={workoutId}
                  />
                </TouchableOpacity>
              </ScaleDecorator>
            );
          }}
          keyExtractor={(exercise) => exercise.name}
          ListFooterComponent={
            <>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonOpen,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.textStyle}>Add Exercise</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.endWorkoutButton,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => endWorkout()}
              >
                <Text style={styles.textStyle}>End Workout</Text>
              </Pressable>
            </>
          }
        />
      </View>
      <View>
        {modalVisible && (
          <PickExerciseForActiveWorkoutModal
            submitPickedExerciseHandler={submitPickedExerciseHandler}
            closeModal={closeModal}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowTogether: {
    flexDirection: "row",
  },
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
    backgroundColor: "#ff0000",
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
  textInput: {
    minWidth: "50%",
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
