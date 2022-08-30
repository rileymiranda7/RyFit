import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import React, { useState, useLayoutEffect } from "react";

import ActiveWorkout from "../components/ActiveWorkout";
import Exercise from "../components/Exercise";
import SetTimerModal from "../components/UI/SetTimerModal";

export default function CurrentWorkoutScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  /* const [workoutInProgress, setWorkoutInProgress] = useState(false);

  function beginWorkoutPressedHandler() {
    setWorkoutInProgress((workoutInProgress) => !workoutInProgress);
  }

  let workoutNotStartedScreen = (
    <View>
      <Text>No workout in progress.</Text>
      <Button title="Begin Workout" onPress={beginWorkoutPressedHandler} />
    </View>
  );

  let workoutInProgressScreen = (
    <View>
      <Text>Workout in progress</Text>
      <ActiveWorkout />
    </View>
  );

  return (
    <View>
      {workoutInProgress ? workoutInProgressScreen : workoutNotStartedScreen}
    </View>
  ); */

  const closeModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      {/* <ActiveWorkout /> */}
      {modalVisible && (
        <SetTimerModal modalVisible={modalVisible} closeModal={closeModal} />
      )}
      <Pressable onPress={() => setModalVisible(!modalVisible)}>
        <Text style={styles.textStyle}>Set Timer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: "100%",
    backgroundColor: "black",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
});
