import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from 'react-native-gesture-handler';


import BackButton from '../components/UI/BackButton';
import { fetchExercisesFromPastWorkout } from '../utils/database';
import PastExerciseItem from '../components/UI/PastExerciseItem';

export default function PastWorkoutItemScreen() {
  
  const [loadedExercises, setLoadedExercises] = useState();

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  const { workout } = route.params;

  const loadExercises = async () => {
    const exercises = await fetchExercisesFromPastWorkout(workout.workoutId);
    console.log("exercises")
    console.log(exercises)
    setLoadedExercises(exercises);
  };

  useEffect(() => {
    if (isFocused) {
      loadExercises();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.workoutNameStyle}>{workout.name}</Text>
        <BackButton
            onPress={() => {
              navigation.goBack();
            }}
            size={40}
            color={"#6737eb"}
          />
      </View>
      
      <View style={styles.pastExerListContainer}>
        <FlatList
          ListHeaderComponent={
            <>
            <View style={styles.rowContainer}>
        <Ionicons name="calendar-outline" size={30} color="#6737eb" />
        <Text style={styles.infoTextStyle}> {workout.dateFull}</Text>
      </View>
      <View style={styles.rowContainer}>
        <Ionicons name="time-outline" size={30} color="#6737eb" />
        <Text style={styles.infoTextStyle}> {workout.startTime}</Text>
      </View>
      <View style={styles.rowContainer}>
        <Ionicons name="timer-outline" size={30} color="#6737eb" />
        <Text style={styles.infoTextStyle}> {workout.duration}</Text>
      </View>
            </>
          }
          data={loadedExercises}
          renderItem={(en) => {
            return (
              <PastExerciseItem 
                workoutId={workout.workoutId}
                exerciseName={en.item.exerciseName}
              />
            )
          }}
          keyExtractor={(e, index) => index}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3e04c3",
    minWidth: "100%",
    minHeight: "100%",
    flex: 1
  },
  pastExerListContainer: {
    minWidth: "100%",
    minHeight: "100%",
    flex: 1
  },
  workoutNameStyle: {
    color: "white",
    fontSize: 25,
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
  infoTextStyle: {
    color: "white",
    fontSize: 16
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 12,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 4
  },
  pressed: {
    opacity: 0.75,
  },
})