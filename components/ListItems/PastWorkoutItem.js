import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native'
import { useState, useEffect } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { fetchExercisesFromPastWorkout } from '../../utils/database/fetchFunctions';
import { Colors } from '../../constants/colors';
import ShadowContainer from '../ShadowContainer';

export default function PastWorkoutItem({ 
  workout
}) {

  const [loadedExercises, setLoadedExercises] = useState();

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

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
      <ShadowContainer
        lightShadowColor={"#6a2afe"}
        darkShadowColor={"#321478"}
        margin={7}
      >
        <View style={styles.headerContainer}>
          <Text 
            numberOfLines={1}
            ellipsizeMode="clip"
            style={styles.workoutNameStyle}
          >
            {workout.name}
          </Text>
          <Text style={styles.workoutDateTimeStyle}>
            {workout.dateShort + ' | ' + workout.startTime}
          </Text>
        </View>
        {loadedExercises !== undefined && loadedExercises.length > 0 && 
        (loadedExercises.map((en, index) => {
          return (
            <Text 
              style={[styles.exerciseTextStyle]} 
              key={index}
              numberOfLines={1}
            >
              {
                en.exerciseName
              }
            </Text>
          );
        }))}
      </ShadowContainer>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.purple8,
    margin: 10,
    minWidth: '80%',
    borderRadius: 8,
  },
  workoutNameStyle: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: "55%",
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
    opacity: 0.5,
  },
})