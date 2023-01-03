import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  Alert,
  Keyboard
} from "react-native";
import React, { useState, useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import {
  insertExercise,
  insertIntoRoutineExerciseBridge,
} from "../utils/database/insertFunctions";
import { fetchRoutineSize, fetchExercises } from "../utils/database/fetchFunctions";
import { fetchRoutine } from "../utils/database/fetchFunctions";
import ExerciseOption from "../components/ListItems/ExerciseOption";
import { Exercise } from "../models/exercise";
import { RoutineExercise } from "../models/routineExercise";
import IconButton from "../components/IconButton";
import BackButton from "../components/BackButton";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Colors } from "../constants/colors";

export default function PickExerciseForRoutineScreen({ route }) {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseNameInput, setExerciseNameInput] = useState("");
  const [loadedExercises, setLoadedExercises] = useState([]);
  const [loadedRoutineExercises, setLoadedRoutineExercises] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [shouldShowKeyboardDismiss, setShouldShowKeyboardDismiss] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { routineName } = route.params;
  const navigation = useNavigation();

  const submitPickedExerciseHandler = async (exercises) => {
    const loadedRoutineExerNames = loadedRoutineExercises.map((exer) => {
      return exer.name;
    });
    const filteredExercises = exercises.filter(
      (exer) => !loadedRoutineExerNames.includes(exer.name)
    );
    let routineSize = await fetchRoutineSize(routineName) + 1;
    await Promise.all(
      filteredExercises.map(async (exercise, index) => {
        const routineExercise = new RoutineExercise(
          exercise.name, routineName, (routineSize + index)
        );
        await insertIntoRoutineExerciseBridge(routineExercise);
      })
    );
    navigation.goBack();
  };

  const isFocused = useIsFocused();

  async function loadExercises() {
    const exercises = await fetchExercises();
    setLoadedExercises(exercises);
  }

  const loadRoutine = async (routineName) => {
    const routine = await fetchRoutine(routineName);
    setLoadedRoutineExercises(routine.exercises);
  };

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
      exerciseNameInput, "3", null, 0, "", 0, "", 0, "");
    await insertExercise(newExercise);
    submitPickedExerciseHandler([...selectedExercises, newExercise]);
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
          onPress: () => {
            if (exerciseNameInput !== "") {
              addExercise();
            } else {
              submitPickedExerciseHandler(selectedExercises);
            }
          },
        },
      ],
      {userInterfaceStyle: "dark"}
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
    if (isFocused && routineName) {
      loadExercises();
      loadRoutine(routineName);
    }
  }, [isFocused, routineName]);

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

  let pickExerciseList;

  if (loadedExercises && loadedExercises.length > 0) {
    pickExerciseList = (
      <View style={styles.exerciseList}>
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
      </Text>);;
  }

  return (
      <View style={styles.container}>
          <View style={styles.header}>
            <IconButton
              icon="trash"
              onPress={() => {}}
              size={40}
              color={Colors.purple10}
            />
            <Text style={styles.title}>Select Exercises</Text>
            <BackButton
              onPress={() => navigation.goBack()}
              size={40}
              color={Colors.purple12}
            />
          </View>
          <View style={styles.inputContainer}>
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
              returnKeyType="done"
              maxLength={50}
              keyboardAppearance='dark'
              onFocus={() => {
                setInputFocused(!inputFocused);
              }}
              onBlur={() => {
                setInputFocused(!inputFocused);
              }}
            />
          </View>
          {pickExerciseList}
          <View style={styles.addButtonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonClose,
                pressed && { opacity: 0.5 },
              ]}
              onPress={() => {
                if (inputFocused && exerciseNameInput === "") {
                  Keyboard.dismiss();
                } else {
                  combineExercises();
                }
              }}
            >
              <Text style={styles.textStyle}>
                Add to {
                  routineName.length > 20 ? 
                    routineName.substring(0,20) + "...": 
                    routineName
                }
              </Text>
            </Pressable>
          </View>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ minHeight: "100%"}}>
            </View>
          </TouchableWithoutFeedback>
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
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    marginTop: 10,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
  },
  smallTitle: {
    color: "white",
    fontSize: 15,
    textAlign: "center"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 12,
  },
  exerciseList: {
    minWidth: "100%",
    maxHeight: "60%",
    padding: 10,
  },
  container: {
    flex: 1,
    minHeight: "100%",
    minWidth: "100%",
    backgroundColor: Colors.purple10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
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
  input: {
    fontSize: 22,
    backgroundColor: Colors.gray2,
    padding: 6,
    minWidth: "78%",
    borderRadius: 8
  },
  inputContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});