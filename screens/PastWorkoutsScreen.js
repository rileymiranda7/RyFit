import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";

import { fetchCompletedWorkouts } from "../utils/database";
import PastWorkoutItem from "../components/UI/PastWorkoutItem"

export default function PastWorkoutsScreen() {

  const [loadedWorkouts, setLoadedWorkouts] = useState();

  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadPastWorkouts() {
      const workouts = await fetchCompletedWorkouts();
      console.log("workouts");
      console.log(workouts)
      setLoadedWorkouts(workouts);
    }

    if (isFocused) {
      loadPastWorkouts();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>
        Past Workouts
      </Text>
      {loadedWorkouts !== undefined && 
      loadedWorkouts.length > 0 && (
        <FlatList
          data={loadedWorkouts}
          renderItem={(workout) => {
          return (
            <PastWorkoutItem 
              workoutId={workout.item.workoutId}
              startTime={workout.item.startTime}
              endTime={workout.item.endTime}
              name={workout.item.name}
            />
          )
          }}
          keyExtractor={w => w.workoutId}
        />
      )}
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
});
