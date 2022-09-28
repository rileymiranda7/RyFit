import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import BackButton from "../BackButton";
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
    loadRoutine(routineName);
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
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="trash"
            onPress={() => {}}
            size={40}
            color={"#1f0263"}
          />
          <Text style={styles.routineName}>{routineName}</Text>
          <BackButton
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
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 12,
  },
  container: {
    flex: 1,
    minHeight: "100%",
    minWidth: "100%",
    backgroundColor: "#3e04c3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
});
