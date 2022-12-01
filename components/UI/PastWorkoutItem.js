import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

export default function PastWorkoutItem({ 
  workoutId, 
  startTime, 
  endTime, 
  name 
}) {
  return (
    <Pressable
      style={({ pressed }) => [pressed && styles.pressed, styles.container]}
      onPress={() => {}}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.workoutTextStyle}>{name}</Text>
        <Text style={styles.workoutTextStyle}>{startTime}</Text>
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
  workoutTextStyle: {
    color: "white",
    fontSize: 14,
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
})