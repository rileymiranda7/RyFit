import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';

import { fetchSetsFromCompletedExercise } from '../../utils/database';

export default function PastExerciseItem({ workoutId, exerciseName }) {

  const [loadedSets, setLoadedSets] = useState();

  const isFocused = useIsFocused();

  const loadSets = async () => {
    const sets = 
      await fetchSetsFromCompletedExercise(exerciseName, workoutId);
    setLoadedSets(sets);
  };

  useEffect(() => {
    if (isFocused) {
      loadSets();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.exerciseTitleStyle}>{exerciseName}</Text>
      {loadedSets !== undefined && loadedSets.length > 0 && 
      (loadedSets.map((set, index) => {
        return (
          <Text style={styles.setTextStyle} key={index}>
            {set.setNumber}    {set.weight} x {set.reps}
          </Text>
        );
      }))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minWidth: "100%",
    minHeight: "100%",
    flex: 1,
    margin: 10,
    padding: 5
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
  exerciseTitleStyle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  setTextStyle: {
    color: "white",
    fontSize: 18
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 12,
  },
  pressed: {
    opacity: 0.75,
  },
})