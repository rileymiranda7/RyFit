import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Alert
} from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { useStopwatch } from 'react-timer-hook';

import Exercise from "../components/Exercise";
import PickExerciseModal from "../components/UI/modals/PickExerciseModal";
import { fetchRoutine } from "../utils/database";
import IconButton from "../components/UI/IconButton";

export default function ActiveWorkoutScreen({
  handleOnSetCompleted,
}) {
  const [exerciseList, setExerciseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState(
    routineName ? routineName : "Today's Workout"
  );

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

  const { routineName } = route.params;

  const loadRoutine = async (routineName) => {
    const routine = await fetchRoutine(routineName);
    console.log(routine);
    setExerciseList(routine.exercises);
  };

  useEffect(() => {
    if (isFocused && routineName) {
      if (routineName !== "BLANK") {
        loadRoutine(routineName);
        setWorkoutName(routineName);
      }
    }
  }, [isFocused, routineName]);

  function submitPickedExerciseHandler(exercises) {
    exercises.forEach((exercise) => {
      setExerciseList((curExerciseList) => {
        return [...curExerciseList, exercise];
      });
    });
    setModalVisible(false);
  }

  const closeModal = () => {
    setModalVisible(false);
  };

  const endWorkout = () => {
    if (hours < 1 && minutes < 1) {
      Alert.alert(
        `End Current Workout?`,
        "Workouts under a minute long will not be saved!",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "End Workout",
            onPress: () => {
              navigation.navigate("CurrentWorkout");
            },
          },
        ]
      );
      return;
    }
    // insert check here for completed sets
    /* else if (noSetsCompleted) {
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
            onPress: () => {
              navigation.navigate("CurrentWorkout");
            },
          },
        ]
      );
      return;
    } */
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
            onPress: () => {
              navigation.navigate("CurrentWorkout");
            },
          },
        ]
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.exerciseList}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.rowSpread}>
              <View style={styles.rowTogether}>
                <TextInput
                  style={styles.textStyle}
                  onChangeText={setWorkoutName}
                  value={workoutName}
                  maxLength={12}
                />
                <IconButton
                  icon="create"
                  size={25}
                  color={"white"}
                  onPress={() => {}}
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
          renderItem={(exercise) => {
            return (
              <Exercise
                exerciseName={exercise.item.name}
                handleOnSetCompleted={handleOnSetCompleted}
              />
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
          <PickExerciseModal
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
