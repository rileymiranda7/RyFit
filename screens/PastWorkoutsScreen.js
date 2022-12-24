import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { fetchCompletedWorkouts } from "../utils/database/fetchFunctions";
import PastWorkoutItem from "../components/ListItems/PastWorkoutItem"

export default function PastWorkoutsScreen() {

  const [loadedWorkouts, setLoadedWorkouts] = useState();

  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadPastWorkouts() {
      const workouts = await fetchCompletedWorkouts();
      setLoadedWorkouts(workouts);
    }

    if (isFocused) {
      loadPastWorkouts();
    }
  }, [isFocused]);

  let renderPastWorkoutItems;
  if (loadedWorkouts !== undefined && loadedWorkouts.length > 0) {
    renderPastWorkoutItems = (
      <FlatList
        data={loadedWorkouts}
        renderItem={(workout) => {
          return (
            <PastWorkoutItem 
              workout={workout.item}
            />
          )
        }}
        keyExtractor={w => w.workoutId}
      />
    )
  } else {
    renderPastWorkoutItems = (
      <Text style={styles.noPastWorkoutsTextStyle}>
        No past workouts found
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>
        Past Workouts
      </Text>
      {renderPastWorkoutItems}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    minWidth: "100%",
    backgroundColor: "black",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginVertical: 5,
  },
  noPastWorkoutsTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    marginVertical: 5,
  },
});
