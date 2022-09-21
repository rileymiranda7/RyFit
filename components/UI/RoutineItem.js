import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function RoutineItem({ routineName, exercises }) {
  return (
    <View style={styles.container}>
      <Text style={styles.routineNameStyle}>{routineName}</Text>
      {exercises.map((exercise, index) => {
        return <Text key={index}>{exercise.exerciseName}</Text>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4e1fbb",
    margin: 10,
    minWidth: "45%",
    minHeight: "45%",
    padding: 4,
    borderRadius: 8,
  },
  routineNameStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
