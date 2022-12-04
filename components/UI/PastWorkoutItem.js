import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useState, useEffect } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { fetchExercisesFromPastWorkout } from '../../utils/database';

export default function PastWorkoutItem({ 
  workout
}) {

  const [loadedExercises, setLoadedExercises] = useState();

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const loadExercises = async () => {
    const exercises = await fetchExercisesFromPastWorkout(workout.workoutId);
    setLoadedExercises(exercises);
  };

  useEffect(() => {
    if (isFocused) {
      loadExercises();
    }
  }, [isFocused]);

  return (
    <Pressable
      style={({ pressed }) => [pressed && styles.pressed, styles.container]}
      onPress={() => {
        navigation.navigate("PastWorkoutItemScreen", {
          workout: workout
        });
      }}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.workoutNameStyle}>{workout.name}</Text>
        <Text style={styles.workoutDateTimeStyle}>
          {workout.dateShort + ' | ' + workout.startTime}
        </Text>
      </View>
      {loadedExercises !== undefined && loadedExercises.length > 0 && 
      (loadedExercises.map((en, index) => {
        return (
          <Text style={styles.exerciseTextStyle} key={index}>
            {en.exerciseName}
          </Text>
        );
      }))}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4e1fbb",
    margin: 10,
    minWidth: '80%',
    padding: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  workoutNameStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  workoutDateTimeStyle: {
    color: "white",
    fontSize: 14,
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
})