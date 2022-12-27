// NOT USING


import { View, Text, StyleSheet, TextInput, Keyboard, Pressable, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from "@expo/vector-icons";

import { Colors } from '../constants/colors'
import { fetchExercise } from '../utils/database/fetchFunctions';

export default function ExerciseSettingsTabScreen({ exer }) {

  const [inputFocused, setInputFocused] = useState(false);
  const [exerciseNameInput, setExerciseNameInput] = useState("");
  const [shouldShowKeyboardDismiss, setShouldShowKeyboardDismiss] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onSubmitNewName = async () => {
    // check exercise name is valid and doesn't already exist
    const nameAlreadyExists = await fetchExercise(exerciseNameInput);
    if (nameAlreadyExists) {
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
    } else {
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
    }
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      setShouldShowKeyboardDismiss(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setShouldShowKeyboardDismiss(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.exerciseNameTextStyle}>{exer.name}</Text>
      <TextInput
        style={[
          styles.input, 
          inputFocused && {
            borderWidth: 2,
            borderColor: "white"
          }
        ]}
        onChangeText={setExerciseNameInput}
        value={exerciseNameInput}
        placeholder="Enter an Exercise"
        maxLength={50}
        keyboardAppearance='dark'
        onFocus={() => {
          setInputFocused(!inputFocused);
        }}
        onBlur={() => {
          setInputFocused(!inputFocused);
        }}
      />
      <Button
        title="Change Exercise Name"
        onPress={async () => {
          await onSubmitNewName();
        }}
      />
      {shouldShowKeyboardDismiss && (
          <View 
            style={{
              position: "absolute",
              bottom: keyboardHeight + 20,
              right: "8%",
            }}
          >
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                setShouldShowKeyboardDismiss(false);
              }}
            >
              <Ionicons 
                name="arrow-down-circle-outline" 
                size={60} 
                color={"yellow"} 
              />
            </Pressable>
          </View>)}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    minWidth: "100%",
    minHeight: "100%",
    backgroundColor: Colors.purple10,
  },
  exerciseNameTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginVertical: 5,
  },
  input: {
    fontSize: 22,
    backgroundColor: Colors.gray2,
    padding: 6,
    minWidth: "78%",
    borderRadius: 8
  },
})