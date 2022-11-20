import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import {
  fetchExercises,
  fetchRoutine,
  fetchRoutineSize,
  insertExercise,
  insertIntoRoutineExerciseBridge,
} from "../utils/database";
import ExerciseOption from "../components/UI/ExerciseOption";
import { Exercise } from "../models/exercise";
import { RoutineExercise } from "../models/routineExercise";
import IconButton from "../components/UI/IconButton";
import BackButton from "../components/UI/BackButton";

export default function PickExerciseForRoutineScreen({ route }) {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseNameInput, setExerciseNameInput] = useState("");
  const [loadedExercises, setLoadedExercises] = useState([]);
  const [loadedRoutineExercises, setLoadedRoutineExercises] = useState([]);

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
        console.log("numberInRoutine for " + exercise.name + ": " + (routineSize + index))
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
    if (isFocused && routineName) {
      loadExercises();
      loadRoutine(routineName);
    }
  }, [isFocused, routineName]);

  let pickExerciseList;

  if (loadedExercises && loadedExercises.length > 0) {
    pickExerciseList = (
      <View style={styles.exerciseList}>
        <Text style={styles.smallTitle}>Pick Exercises Below</Text>
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
    pickExerciseList = <Text>no exercises found</Text>;
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="trash"
            onPress={() => {}}
            size={40}
            color={"#3e04c3"}
          />
          <Text style={styles.title}>Select Exercises</Text>
          <BackButton
            onPress={() => navigation.goBack()}
            size={40}
            color={"#7145eb"}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setExerciseNameInput}
            value={exerciseNameInput}
            placeholder="Enter an Exercise"
          />
        </View>
        {pickExerciseList}
        <View style={styles.addButtonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonClose,
              pressed && { opacity: 0.75 },
            ]}
            onPress={() => combineExercises()}
          >
            <Text style={styles.textStyle}>
              {routineName ? "Add to " + routineName : "Add to Workout"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    marginVertical: 10,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
  },
  smallTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 12,
  },
  exerciseList: {
    flex: 1,
    minWidth: "100%",
    padding: 10,
  },
  container: {
    flex: 1,
    minHeight: "100%",
    minWidth: "100%",
    backgroundColor: "#3e04c3",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
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
  input: {
    fontSize: 25,
    backgroundColor: "#b8bbbe",
    padding: 4,
    minWidth: "78%",
    minHeight: "7%",
  },
  inputContainer: {
    backgroundColor: "#b8bbbe",
    height: "8%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    marginHorizontal: 35,
  },
});
