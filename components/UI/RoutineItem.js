import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";

import { Exercise } from "../../models/exercise";
import IconButton from "./IconButton";
import RoutineModal from "./modals/RoutineModal";
import { createWorkout } from "../../utils/database";

export default function RoutineItem({ routineName, exercises }) {
  let exerciseList;

  const navigation = useNavigation();

  function shouldBeginRoutine(routineName) {
    Alert.alert(
      `Begin ${routineName} ?`,
      "Start workout with this exercise routine?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Start",
          onPress: async () => {
            const workoutId = await createWorkout(routineName);
            navigation.navigate("ActiveWorkout", {
              routineName: routineName,
              workoutId: workoutId
            });
          },
        },
      ]
    );
  }

  if (exercises.length > 4) {
    let shortenedList = exercises.slice(0, 4);
    shortenedList.push(new Exercise("..."));
    exerciseList = shortenedList;
  } else {
    exerciseList = exercises;
  }

  return (
    <Pressable
      style={({ pressed }) => [pressed && styles.pressed, styles.container]}
      onPress={() => {
        shouldBeginRoutine(routineName);
      }}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.routineNameStyle}>{routineName}</Text>
        <IconButton
          icon="ellipsis-horizontal-circle-outline"
          size={35}
          color="white"
          onPress={() => {
            navigation.navigate("RoutineModal", {
              routineName: routineName,
            });
          }}
        />
      </View>
      {exerciseList.map((exercise, index) => {
        return (
          <Text style={styles.exerciseTextStyle} key={index}>
            {
              exercise.name.length > 20 ? 
                exercise.name.substring(0,15) + "...": 
                exercise.name
            }
          </Text>
        );
      })}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4e1fbb",
    margin: 10,
    minWidth: "45%",
    padding: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  routineNameStyle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  exerciseTextStyle: {
    color: "white",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
