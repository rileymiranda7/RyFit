import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import CloseButton from "../CloseButton";
import IconButton from "../IconButton";
import {
  deleteExerciseFromRoutine,
  fetchRoutine,
} from "../../../utils/database";

export default function RoutineModal({ navigation, route }) {
  const [loadedExercises, setLoadedExercises] = useState([]);

  const isFocused = useIsFocused();
  const { routineName } = route.params;

  const loadRoutine = async (routineName) => {
    const routine = await fetchRoutine(routineName);
    setLoadedExercises(routine.exercises);
  };

  useEffect(() => {
    if (isFocused && routineName) {
      loadRoutine(routineName);
    }
  }, [routineName, isFocused]);

  const removeExerciseFromRoutine = async (exerciseName, routineName) => {
    await deleteExerciseFromRoutine(exerciseName, routineName);
  };

  function shouldRemoveExerciseFromRoutine(exerciseName, routineName) {
    Alert.alert("Remove Exercise", "Remove exercise from routine?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Remove",
        onPress: () => {
          removeExerciseFromRoutine(exerciseName, routineName);
        },
      },
    ]);
  }

  if (!loadedExercises || loadedExercises.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView>
      <View style={styles.modalView}>
        <View style={styles.header}>
          <IconButton
            icon="trash"
            onPress={() => {}}
            size={40}
            color={"#1f0263"}
          />
          <Text style={styles.routineName}>{routineName}</Text>
          <CloseButton
            onPress={() => navigation.goBack()}
            size={40}
            color={"#6737eb"}
          />
        </View>
        <View style={styles.exercises}>
          {loadedExercises.map((exercise, index) => {
            return (
              <View style={styles.exerciseRow} key={index}>
                <Pressable
                  style={({ pressed }) => [pressed && { opacity: 0.75 }]}
                >
                  <IconButton
                    icon="trash"
                    onPress={() => {
                      shouldRemoveExerciseFromRoutine(
                        exercise.name,
                        routineName
                      );
                    }}
                    size={30}
                    color={"#1f0263"}
                  />
                </Pressable>
                <Text style={styles.exerciseTextStyle}>{exercise.name}</Text>
              </View>
            );
          })}
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.buttonColor,
            pressed && { opacity: 0.75 },
          ]}
          onPress={() =>
            navigation.navigate("PickExerciseModal", {
              routineName: routineName,
            })
          }
        >
          <View style={styles.addButtonRow}>
            <IconButton
              onPress={() =>
                navigation.navigate("PickExerciseModal", {
                  routineName: routineName,
                })
              }
              icon="add-circle"
              size={40}
              color={"green"}
            />
            <Text style={styles.textStyle}>Add Exercise</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonColor: {
    backgroundColor: "#6737eb",
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    elevation: 2,
    marginVertical: 20,
    marginHorizontal: 50,
  },
  addButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  exercises: {
    margin: 10,
  },
  exerciseTextStyle: {
    color: "white",
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  routineName: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 8,
    marginVertical: 12,
  },
  modalView: {
    flex: 1,
    minHeight: "100%",
    minWidth: "100%",
    backgroundColor: "#3e04c3",
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    backgroundColor: "#2196F3",
    minWidth: "80%",
    height: "8%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  startButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1db643",
  },
  timerButton: {
    borderRadius: 26,
    borderWidth: 3,
    borderColor: "#ffffff",
    minWidth: "22%",
    padding: 10,
    elevation: 2,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
  },
  cancelButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f32121",
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
    textAlign: "center",
  },
  timerButtonsContainer: {
    flex: 1,
    minWidth: "80%",
    minHeight: "15%",
  },
  timerButtonsRow1: {
    minHeight: "13%",
    minWidth: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timerButtonsRow2: {
    minHeight: "13%",
    minWidth: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timerButtonsRow3: {
    minHeight: "13%",
    minWidth: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
