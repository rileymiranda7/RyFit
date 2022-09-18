import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { fetchExercises } from "../../../utils/database";
import ExerciseOption from "../ExerciseOption";

export default function PickExerciseModal({
  submitPickedExerciseHandler,
  closeModal,
}) {
  const [exerciseNamesArr, setExerciseNamesArr] = useState([]);
  const [exerciseNameInput, setExerciseNameInput] = useState("");
  const [loadedExercises, setLoadedExercises] = useState([]);

  const isFocused = useIsFocused();

  const exerciseSelected = (exerciseName) => {
    setExerciseNamesArr((currArr) => {
      return [...currArr, exerciseName];
    });
  };

  const exerciseDeselected = (exerciseName) => {
    setExerciseNamesArr(
      exerciseNamesArr.filter((exercise) => exercise !== exerciseName)
    );
  };

  const combineExercises = () => {
    if (exerciseNameInput !== "") {
      submitPickedExerciseHandler([...exerciseNamesArr, exerciseNameInput]);
    } else {
      submitPickedExerciseHandler(exerciseNamesArr);
    }
  };

  useEffect(() => {
    async function loadExercises() {
      const exercises = await fetchExercises();
      setLoadedExercises(exercises);
    }

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
                exerciseName={e.item.name}
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
