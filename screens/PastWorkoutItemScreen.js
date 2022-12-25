import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from 'react-native-gesture-handler';


import BackButton from '../components/BackButton';
import { fetchExersAndInstsFromPastWorkout } from '../utils/database/fetchFunctions';
import PastExerciseItem from '../components/ListItems/PastExerciseItem';
import { Colors } from '../constants/colors';

export default function PastWorkoutItemScreen() {
  
  const [loadedExersAndInsts, setLoadedExersAndInsts] = useState();

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  const { workout } = route.params;
  const { width: windowWidth } = useWindowDimensions();

  const loadExercises = async () => {
    const exercisesAndInsts = await 
      fetchExersAndInstsFromPastWorkout(workout.workoutId);
    setLoadedExersAndInsts(exercisesAndInsts);
  };

  useEffect(() => {
    if (isFocused) {
      loadExercises();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 10}}>
        <FlatList
          ListHeaderComponent={
            <>
            <View style={styles.headerContainer}>
              <Text 
                style={styles.workoutNameStyle}
              >
                {workout.name}
              </Text>
              <BackButton
                onPress={() => {
                  navigation.goBack();
                }}
                size={40}
                color={Colors.purple11}
              />
            </View>
              <View style={styles.rowContainer}>
                <Ionicons name="calendar-outline" size={30} color={Colors.purple11} />
                <Text style={styles.infoTextStyle}> {workout.dateFull}</Text>
              </View>
              <View style={styles.rowContainer}>
                <Ionicons name="time-outline" size={30} color={Colors.purple11} />
                <Text style={styles.infoTextStyle}> {workout.startTime}</Text>
              </View>
              <View style={styles.rowContainer}>
                <Ionicons name="timer-outline" size={30} color={Colors.purple11} />
                <Text style={styles.infoTextStyle}> {workout.duration}</Text>
              </View>
            </>
          }
          data={loadedExersAndInsts}
          renderItem={(exerInst) => {
            return (
              <PastExerciseItem 
                workoutId={workout.workoutId}
                exerciseName={exerInst.item.exerciseName}
                exerNotes={exerInst.item.exerciseNotes}
                exerInstNotes={exerInst.item.exerInstNotes}
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
    backgroundColor: Colors.purple10,
    minWidth: "100%",
    minHeight: "100%",
    flex: 1,
  },
  workoutNameStyle: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    maxWidth: "80%"
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