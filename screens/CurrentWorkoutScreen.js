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
import {
  fetchRoutines,
  insertIntoRoutineExerciseBridge,
} from "../utils/database";
import RoutineItem from "../components/UI/RoutineItem";
import { RoutineExercise } from "../models/routineExercise";

export default function CurrentWorkoutScreen({ handleOnSetCompleted }) {
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [loadedRoutines, setLoadedRoutines] = useState();

  const isFocused = useIsFocused();

  const loadRoutines = async () => {
    /* insertIntoRoutineExerciseBridge(
      new RoutineExercise("Lateral Raise", "Lower A")
    ); */
    const routines = await fetchRoutines();
    setLoadedRoutines(routines);
  };

  useEffect(() => {
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
        <Text style={{ color: "black" }}>No routines found</Text>
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
        <View style={styles.routinesContainer}>
          <FlatList
            data={loadedRoutines}
            contentContainerStyle={styles.list}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            keyExtractor={(e) => e.name}
            renderItem={(routine) => {
              return (
                <RoutineItem
                  routineName={routine.item.name}
                  exercises={routine.item.exercises}
                  refreshRoutines={loadRoutines}
                />
              );
            }}
            numColumns={2}
          />
        </View>
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
  list: {},
  activeWorkoutContainer: {
    flex: 1,
    minWidth: "100%",
    minHeight: "100%",
    backgroundColor: "black",
  },
  routinesContainer: {
    flex: 1,
  },
  container: {
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
    marginVertical: 5,
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
