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

  let renderList;
  if (exercises.length === 0) {
    renderList = (
      <Text style={styles.exerciseTextStyle}>
        no exercises yet...
      </Text>
    );
  } else if (exercises.length > 4) {
    let shortenedList = exercises.slice(0, 4);
    shortenedList.push(new Exercise("..."));
    exerciseList = shortenedList;
    renderList = exerciseList.map((exercise, index) => {
      return (
        <Text style={styles.exerciseTextStyle} key={index}>
          {
            exercise.name.length > 20 ? 
              exercise.name.substring(0,15) + "...": 
              exercise.name
          }
        </Text>
      );
    });
  } else {
    exerciseList = exercises;
    renderList = exerciseList.map((exercise, index) => {
      return (
        <Text style={styles.exerciseTextStyle} key={index}>
          {
            exercise.name.length > 20 ? 
              exercise.name.substring(0,15) + "...": 
              exercise.name
          }
        </Text>
      );
    });
  }



  return (
    <Pressable
      style={({ pressed }) => [pressed && styles.pressed, styles.container]}
      onPress={() => {
        shouldBeginRoutine(routineName);
      }}
    >
      <View style={styles.headerContainer}>
        <Text 
          style={styles.routineNameStyle}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {routineName}
        </Text>
        <View style={styles.buttonContainer}>
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
      </View>
      <View style={{paddingBottom: 5}}>
        {renderList}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4e1fbb",
    margin: 2,
    minWidth: "49%",
    maxWidth: "49%",
    borderRadius: 5
  },
  routineNameStyle: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: "60%",
    textAlign: "left",
    padding: 5
  },
  exerciseTextStyle: {
    color: "white",
    paddingHorizontal: 5
  },
  buttonContainer: {
    paddingTop: 5,
    paddingRight: 5
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pressed: {
    opacity: 0.75,
  },
});
