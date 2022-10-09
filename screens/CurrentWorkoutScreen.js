import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { fetchRoutines, insertEmptyRoutine } from "../utils/database";
import RoutineItem from "../components/UI/RoutineItem";

export default function CurrentWorkoutScreen() {
  const [loadedRoutines, setLoadedRoutines] = useState();
  const [addingRoutine, setAddingRoutine] = useState(false);
  const [routineName, setRoutineName] = useState("");

  const isFocused = useIsFocused();

  const navigation = useNavigation();

  const loadRoutines = async () => {
    const routines = await fetchRoutines();
    setLoadedRoutines(routines);
  };

  useEffect(() => {
    if (isFocused) {
      loadRoutines();
    }
  }, [isFocused]);

  const showRoutineInput = () => {
    setAddingRoutine(!addingRoutine);
  };

  const createRoutine = async () => {
    if (routineName != "") {
      await insertEmptyRoutine(routineName);
      loadRoutines();
      setAddingRoutine(false);
    }
  };

  let createRoutineRender;

  if (addingRoutine) {
    createRoutineRender = (
      <View>
        <TextInput
          style={styles.input}
          onChangeText={setRoutineName}
          value={routineName}
          placeholder="Enter Routine Name"
        />
        <View style={styles.routineInputRow}>
          <Pressable
            style={styles.routineButton}
            onPress={() => setAddingRoutine(false)}
          >
            <Text style={styles.routineButtonText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={styles.routineButton}
            onPress={() => createRoutine()}
          >
            <Text style={styles.routineButtonText}>Add</Text>
          </Pressable>
        </View>
      </View>
    );
  } else {
    createRoutineRender = (
      <Button title="Create New Routine" onPress={showRoutineInput} />
    );
  }

  let workoutNotStartedScreen = (
    <View style={styles.container}>
      <Text style={styles.textStyle}>
        Choose Routine or Start Empty Workout
      </Text>
      <Button
        title="Begin Empy Workout"
        onPress={() => {
          navigation.navigate("ActiveWorkout", {
            routineName: "BLANK",
          });
        }}
      />
      {createRoutineRender}
      {loadedRoutines !== undefined && loadedRoutines.length > 0 && (
        <View style={styles.routinesContainer}>
          <FlatList
            data={loadedRoutines}
            keyExtractor={(e) => e.name}
            renderItem={(routine) => {
              return (
                <RoutineItem
                  routineName={routine.item.name}
                  exercises={routine.item.exercises}
                  refreshRoutines={loadRoutines}
                />
              );
            }}
            numColumns={2}
          />
        </View>
      )}
    </View>
  );

  return workoutNotStartedScreen;
}

const styles = StyleSheet.create({
  routineButton: {
    padding: 6,
    margin: 5,
    minWidth: "20%",
    borderRadius: 20,
  },
  routineButtonText: {
    color: "#007AFF",
    fontSize: 20,
    textAlign: "center",
  },
  routineInputRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  activeWorkoutContainer: {
    flex: 1,
    minWidth: "100%",
    minHeight: "100%",
    backgroundColor: "black",
  },
  routinesContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: "black",
    minWidth: "100%",
    minHeight: "100%",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginVertical: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 20,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  input: {
    fontSize: 20,
    backgroundColor: "#b8bbbe",
    padding: 4,
    minWidth: "70%",
    minHeight: "7%",
  },
});
