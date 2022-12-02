import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

export default function PastWorkoutItem({ 
  workout
}) {
  return (
    <Pressable
      style={({ pressed }) => [pressed && styles.pressed, styles.container]}
      onPress={() => {}}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.workoutNameStyle}>{workout.name}</Text>
        <Text style={styles.workoutDateTimeStyle}>
          {workout.dateShort + ' | ' + workout.startTime}
        </Text>
      </View>
      {/* {exerciseList.map((exercise, index) => {
        return (
          <Text style={styles.exerciseTextStyle} key={index}>
            {exercise.name}
          </Text>
        );
      })} */}
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