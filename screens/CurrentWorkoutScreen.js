import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

import ActiveWorkout from "../components/ActiveWorkout";
import Exercise from "../components/Exercise";
import SetTimerModal from "../components/UI/modals/SetTimerModal";
import { fetchRoutines, fetchRoutine } from "../utils/database";
import RoutineItem from "../components/UI/RoutineItem";

export default function CurrentWorkoutScreen({ handleOnSetCompleted }) {
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [loadedRoutines, setLoadedRoutines] = useState();

  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadRoutines() {
      const routines = await fetchRoutines();
      console.log(routines);
      setLoadedRoutines(routines);
    }

    if (isFocused) {
      loadRoutines();
    }
  }, [isFocused]);

  const beginWorkoutPressedHandler = () => {
    setWorkoutInProgress(true);
  };

  const onEndedWorkout = () => {
    setWorkoutInProgress(false);
  };

  if (!loadedRoutines || loadedRoutines.length === 0) {
    return (
      <View>
        <Text style={{ color: "white" }}>No routines found</Text>
      </View>
    );
  }

  let workoutNotStartedScreen = (
    <View style={styles.container}>
      <Text style={styles.textStyle}>
        Choose Routine or Start Empty Workout
      </Text>
      <Button title="Begin Empy Workout" onPress={beginWorkoutPressedHandler} />
      {loadedRoutines !== undefined && loadedRoutines.length > 0 && (
        <FlatList
          data={loadedRoutines}
          keyExtractor={(e) => e.name}
          renderItem={(routine) => {
            return (
              <RoutineItem
                routineName={routine.item.name}
                exercises={routine.item.exercises}
              />
              /* <>
                <Text style={{ color: "white" }}>{routine.item.name}</Text>
                <Text style={{ color: "white" }}>
                  {routine.item.exercises[0].exerciseName}
                </Text>
              </> */
            );
          }}
          numColumns={2}
        />
      )}
    </View>
  );

  let workoutInProgressScreen = (
    <View style={styles.activeWorkoutContainer}>
      <ActiveWorkout
        handleOnSetCompleted={handleOnSetCompleted}
        endWorkout={onEndedWorkout}
      />
    </View>
  );

  return (
    <View>
      {workoutInProgress ? workoutInProgressScreen : workoutNotStartedScreen}
    </View>
  );
}

const styles = StyleSheet.create({
  activeWorkoutContainer: {
    flex: 1,
    minWidth: "100%",
    minHeight: "100%",
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "black",
    minWidth: "100%",
    minHeight: "100%",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 20,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
});
