import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

import { fetchExercises, insertExercise } from "../../../utils/database";
import ExerciseOption from "../ExerciseOption";
import { Exercise } from "../../../models/exercise";

export default function PickExerciseModal({
  submitPickedExerciseHandler,
  closeModal,
}) {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseNameInput, setExerciseNameInput] = useState("");
  const [loadedExercises, setLoadedExercises] = useState([]);

  const isFocused = useIsFocused();

  async function loadExercises() {
    const exercises = await fetchExercises();
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
        />
      </View>
    );
  } else {
    pickExerciseList = <Text>here</Text>;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        closeModal();
      }}
    >
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
              styles.buttonClose,
              pressed && { opacity: 0.75 },
            ]}
            onPress={() => closeModal()}
          >
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  exerciseList: {
    minHeight: "45%",
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
    margin: 20,
    marginTop: "14%",
    width: "90%",
    height: "87%",
    backgroundColor: "#3e04c3",
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
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
});
