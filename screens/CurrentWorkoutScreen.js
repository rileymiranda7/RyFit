import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Alert,
  Keyboard
} from "react-native";
import React, { useState, useEffect } from "react";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { createWorkout, insertEmptyRoutine } from "../utils/database/insertFunctions";
import { fetchRoutines } from "../utils/database/fetchFunctions";
import RoutineItem from "../components/ListItems/RoutineItem";

export default function CurrentWorkoutScreen() {
  const [loadedRoutines, setLoadedRoutines] = useState();
  const [addingRoutine, setAddingRoutine] = useState(false);
  const [routineName, setRoutineName] = useState("");
  const [shouldShowKeyboardDismiss, setShouldShowKeyboardDismiss] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const isFocused = useIsFocused();

  const navigation = useNavigation();
  const route = useRoute();
  

  const loadRoutines = async () => {
    const routines = await fetchRoutines();
    setLoadedRoutines(routines);
  };

  
  const showRoutineInput = () => {
    setAddingRoutine(!addingRoutine);
  };
  
  const createRoutine = async () => {
    if (routineName != "") {
      await insertEmptyRoutine(routineName);
      loadRoutines();
      setAddingRoutine(false);
    }
    setRoutineName("");
  };

  useEffect(() => {
    if (isFocused) {
      loadRoutines();
    }
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.workoutWasCompleted) {
        Alert.alert(
          `Workout Completed!`,
          "You can view it in Past Workouts",
          [
            {
              text: "Ok",
              onPress: () => {},
            },
          ]
        );
        workoutWasCompleted = false;
    }
  }, [route.params?.workoutWasCompleted]);

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

  let createRoutineRender;

  if (addingRoutine) {
    createRoutineRender = (
      <View>
        <TextInput
          style={styles.input}
          onChangeText={setRoutineName}
          value={routineName}
          placeholder="Enter Routine Name"
          maxLength={25}
          keyboardAppearance='dark'
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

  let renderRoutines;
  if (loadedRoutines !== undefined && loadedRoutines.length > 0) {
    renderRoutines = (
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
    );
  } else {
    renderRoutines = (<View style={styles.routinesContainer}>
      <Text style={styles.noRoutinesTextStyle}>No routines found{"\n"}Create one above</Text>
    </View>)
  }

  let workoutNotStartedScreen = (
    <View style={styles.container}>
      <Text style={styles.textStyle}>
        Choose Routine or Start Empty Workout
      </Text>
      <Button
        title="Begin Empy Workout"
        onPress={async () => {
          const workoutId = await createWorkout('New Workout');
          navigation.navigate("ActiveWorkout", {
            routineName: "BLANK",
            workoutId: workoutId
          });
        }}
      />
      {createRoutineRender}
      {renderRoutines}
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
    marginVertical: 5,
  },
  noRoutinesTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
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
