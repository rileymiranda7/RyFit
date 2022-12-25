import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import BackButton from "../BackButton";
import IconButton from "../IconButton";
import {
  deleteExerciseFromRoutine,
  deleteRoutine,
} from "../../utils/database/deleteFunctions";
import { updateRoutineOrder } from "../../utils/database/updateFunctions";
import { fetchRoutine } from "../../utils/database/fetchFunctions";
import { Colors } from "../../constants/colors";

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
    await deleteExerciseFromRoutine(exerciseName, routineName, loadedExercises);
    loadRoutine(routineName);
  };

  const removeRoutine = async (routineName) => {
    await deleteRoutine(routineName);
    navigation.goBack();
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

  function shouldRemoveRoutine(routineName) {
    Alert.alert("Remove Routine", "Delete Routine?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          removeRoutine(routineName);
        },
      },
    ]);
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="trash"
            onPress={() => {
              shouldRemoveRoutine(routineName);
            }}
            size={40}
            color={Colors.blue4}
          />
          <Text style={styles.routineName}>
            {
              routineName.length > 20 ? 
                routineName.substring(0,10) + "...": 
                routineName
            }
          </Text>
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
            size={40}
            color={Colors.purple11}
          />
        </View>
        <View style={styles.exercises}>
          {(!loadedExercises || loadedExercises.length === 0) && (
            <Text>No exercises found in routine. Click Add Exercise</Text>
          )}
          {(loadedExercises || loadedExercises.length > 0) &&
            <DraggableFlatList 
              onDragEnd={({ data }) => {
                setLoadedExercises(data);
                updateRoutineOrder(routineName, data, true, -1);
              }}
              data={loadedExercises}
              renderItem={({ item, drag, isActive }) => {
                return (
                  <ScaleDecorator>
                    <TouchableOpacity
                      activeOpacity={1}
                      onLongPress={drag}
                      disabled={isActive}
                      style={[
                      /*  styles.rowItem,
                        { backgroundColor: isActive ? "red" : item.backgroundColor }, */
                      ]}
                    >
                      <View style={styles.exerciseRow}>
                        <Pressable
                          style={({ pressed }) => [pressed && { opacity: 0.75 }]}
                        >
                        <IconButton
                          icon="trash"
                          onPress={() => {
                            shouldRemoveExerciseFromRoutine(
                              item.name,
                              routineName
                            );
                          }}
                          size={30}
                      color={Colors.blue4}
                    />
                  </Pressable>
                  <Text style={styles.exerciseTextStyle}>
                    {
                    item.name.length > 27 ? 
                      item.name.substring(0,27) + "...": 
                      item.name
                    }
                  </Text>
                </View>
                    </TouchableOpacity>
                  </ScaleDecorator>
                );
              }}
              keyExtractor={(exercise) => exercise.name}
            />
          }
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.buttonColor,
            pressed && { opacity: 0.75 },
          ]}
          onPress={() =>
            navigation.navigate("PickExerciseForRoutineScreen", {
              routineName: routineName,
            })
          }
        >
          <View style={styles.addButtonRow}>
            <IconButton
              onPress={() =>
                navigation.navigate("PickExerciseForRoutineScreen", {
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
    backgroundColor: Colors.purple11,
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
    backgroundColor: Colors.purple10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
});