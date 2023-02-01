import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  FlatList,
  Alert,
  SafeAreaView,
  Keyboard
} from "react-native";
import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { fetchExercises } from "../../utils/database/fetchFunctions";
import { insertExercise } from "../../utils/database/insertFunctions";
import ExerciseOption from "../ListItems/ExerciseOption";
import { Exercise } from "../../models/exercise";
import { Colors } from "../../constants/colors";

export default function PickExerciseForActiveWorkoutModal({
  submitPickedExerciseHandler,
  closeModal,
}) {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseNameInput, setExerciseNameInput] = useState("");
  const [loadedExercises, setLoadedExercises] = useState([]);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [shouldShowKeyboardDismiss, setShouldShowKeyboardDismiss] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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
    const newExercise = new Exercise(
      exerciseNameInput, "3", 1, null, 0, "", 0, "", 0, "");
    await insertExercise(newExercise);
    await submitPickedExerciseHandler([...selectedExercises, newExercise]);
  }

  function shouldAddExercise() {
    Alert.alert(
      "Create New Exercise",
      `${exerciseNameInput.length > 20 ? 
        exerciseNameInput.substring(0,15) + "...": 
        exerciseNameInput} not found. Create and add to workout?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Add",
          onPress: async () => {
            if (exerciseNameInput !== "") {
              addExercise();
            } else {
              await submitPickedExerciseHandler(selectedExercises);
            }
          },
        },
      ],
      {userInterfaceStyle: "dark"}
    );
  }

  const combineExercises = async () => {
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
        await submitPickedExerciseHandler([
          ...selectedExercises,
          new Exercise(exerciseNameInput, "3:00", 1, null, null),
        ]);
      } else {
        await submitPickedExerciseHandler(selectedExercises);
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
      <View>
        <Text style={styles.smallTitle}>
        Pick exercises below or type a new or existing exercise above.
          </Text>
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
    pickExerciseList = (
    <Text
      style={{color: "white", padding: 6, textAlign: "center"}}
    >
      No exercises found. {"\n"}Type an exercise in the field above
      and hit Add Exercise to create a new exercise.
    </Text>);
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
    <SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          closeModal();
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Select Exercise</Text>
          <View style={[styles.inputContainer, inputIsFocused && {
                  borderWidth: 2,
                  borderColor: "white"
                }]}>
            <TextInput
              style={styles.input}
              onChangeText={setExerciseNameInput}
              value={exerciseNameInput}
              placeholder="Enter an Exercise"
              returnKeyType="done"
              maxLength={50}
              onFocus={() => {
                setInputIsFocused(!inputIsFocused);
              }}
              onBlur={() => {
                setInputIsFocused(!inputIsFocused);
              }}
            />
          </View>
          <View style={styles.exerciseListContainer}>
            {pickExerciseList}
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonClose,
              pressed && { opacity: 0.5 },
            ]}
            onPress={async () => await combineExercises()}
          >
            <Text style={styles.textStyle}>Add Exercise</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonClose,
              pressed && { opacity: 0.5 },
            ]}
            onPress={() => closeModal()}
          >
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
          {shouldShowKeyboardDismiss && (
          <View 
            style={{
              position: "absolute",
              bottom: keyboardHeight - 30,
              right: "1%",
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
                size={50} 
                color={'rgba(255, 255, 10, 0.5)'} 
              />
            </Pressable>
          </View>)}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  exerciseListContainer: {
    maxHeight: "49%",
    minWidth: "98%",
    padding: 5,
    backgroundColor: Colors.purple9,
    borderRadius: 8
  },
  exerciseItemText: {
    fontSize: 20,
  },
  modalView: {
    margin: "5%",
    marginTop: "14%",
    width: "90%",
    height: "87%",
    backgroundColor: Colors.purple10,
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingVertical: "5%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
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
    backgroundColor: Colors.pink1,
  },
  endWorkoutButton: {
    backgroundColor: Colors.red3,
  },
  buttonClose: {
    backgroundColor: Colors.blue3,
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
    color: "white",
  },
  input: {
    fontSize: 16,
    backgroundColor: Colors.gray2,
    padding: 6,
    minWidth: "78%",
  },
  inputContainer: {
    backgroundColor: Colors.gray2,
    minWidth: "80%",
    height: "8%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    borderRadius: 8
  },
  smallTitle: {
    color: "white",
    fontSize: 15,
    textAlign: "center"
  },
});
