import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

import {
  fetchExercises,
  insertExercise,
  insertIntoRoutineExerciseBridge,
} from "../utils/database";
import ExerciseOption from "../components/UI/ExerciseOption";
import { Exercise } from "../models/exercise";
import { RoutineExercise } from "../models/routineExercise";

export default function PickExerciseScreen({ navigation: { goBack }, route }) {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseNameInput, setExerciseNameInput] = useState("");
  const [loadedExercises, setLoadedExercises] = useState([]);

  const { routineName } = route.params;

  const submitPickedExerciseHandler = async (exercises) => {
    await Promise.all(
      exercises.map(async (exercise) => {
        const routineExercise = new RoutineExercise(exercise.name, routineName);
        await insertIntoRoutineExerciseBridge(routineExercise);
      })
    );
    goBack();
  };

  const isFocused = useIsFocused();

  async function loadExercises() {
    const exercises = await fetchExercises();
    console.log("loadedExercises: ");
    console.log(JSON.stringify(exercises));
    setLoadedExercises(exercises);
  }

  const exerciseSelected = (exercise) => {
    setSelectedExercises((currArr) => {
      return [...currArr, exercise];
    });
  };

  const exerciseDeselected = (exercise) => {
    setSelectedExercises(
      selectedExercises.filter((e) => e.name !== exercise.name)
    );
  };

  async function addExercise() {
    const newExercise = new Exercise(exerciseNameInput, "3:00", null);
    await insertExercise(newExercise);
    submitPickedExerciseHandler([...selectedExercises, newExercise]);
  }

  function shouldAddExercise() {
    Alert.alert(
      "Create New Exercise",
      `${exerciseNameInput} not found. Create and add to workout?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Add",
          onPress: () => {
            if (exerciseNameInput !== "") {
              addExercise();
            } else {
              submitPickedExerciseHandler(selectedExercises);
            }
          },
        },
      ]
    );
  }

  const combineExercises = () => {
    // get arr of loaded exercise names
    let loadedNamesArr = [];
    loadedExercises.forEach((exercise) => {
      loadedNamesArr.push(exercise.name);
    });
    // get arr of selected exercise names
    let selectedNamesArr = [];
    selectedExercises.forEach((exercise) => {
      selectedNamesArr.push(exercise.name);
    });
    // if exercise not in db
    if (
      exerciseNameInput !== "" &&
      !loadedNamesArr.includes(exerciseNameInput)
    ) {
      shouldAddExercise();
    } else {
      // if inputted exercise not already selected
      if (
        exerciseNameInput !== "" &&
        !selectedNamesArr.includes(exerciseNameInput)
      ) {
        submitPickedExerciseHandler([
          ...selectedExercises,
          new Exercise(exerciseNameInput, "3:00", null, null),
        ]);
      } else {
        submitPickedExerciseHandler(selectedExercises);
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadExercises();
    }
  }, [isFocused]);

  let pickExerciseList;

  if (loadedExercises && loadedExercises.length > 0) {
    pickExerciseList = (
      <View style={styles.exerciseList}>
        <Text>Pick Exercise Below</Text>
        <FlatList
          data={loadedExercises}
          renderItem={(e) => {
            return (
              <ExerciseOption
                exercise={e.item}
                exerciseSelected={exerciseSelected}
                exerciseDeselected={exerciseDeselected}
              />
            );
          }}
          keyExtractor={(e) => e.name}
          ListFooterComponent={
            <View>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonClose,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => combineExercises()}
              >
                <Text style={styles.textStyle}>Add Exercise</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonCancel,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => goBack()}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          }
        />
      </View>
    );
  } else {
    pickExerciseList = <Text>no exercises found</Text>;
  }

  return (
    <View>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Select Exercise</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setExerciseNameInput}
            value={exerciseNameInput}
            placeholder="Enter an Exercise"
          />
        </View>
        {pickExerciseList}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseList: {
    minWidth: "80%",
  },
  exerciseItemText: {
    fontSize: 20,
  },
  container: {
    flex: 1,
    paddingVertical: 5,
  },
  modalView: {
    flex: 1,
    minHeight: "100%",
    minWidth: "100%",
    backgroundColor: "#3e04c3",
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
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
  buttonCancel: {
    borderWidth: 2,
    borderColor: "white",
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
});
