import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

import ActiveWorkout from "../components/ActiveWorkout";
import Exercise from "../components/Exercise";
import SetTimerModal from "../components/UI/modals/SetTimerModal";
import { fetchRoutines } from "../utils/database";

export default function CurrentWorkoutScreen({ handleOnSetCompleted }) {
  const [workoutInProgress, setWorkoutInProgress] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadRoutines() {
      await fetchRoutines();
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

  let workoutNotStartedScreen = (
    <View style={styles.container}>
      <Text style={styles.textStyle}>
        Choose Routine or Start Empty Workout
      </Text>
      <Button title="Begin Empy Workout" onPress={beginWorkoutPressedHandler} />
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
