import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ExerciseOption({
  exerciseName,
  exerciseSelected,
  exerciseDeselected,
}) {
  const [isSelected, setIsSelected] = useState(false);

  const onPress = () => {
    if (!isSelected) {
      exerciseSelected(exerciseName);
    } else if (isSelected) {
      exerciseDeselected(exerciseName);
    }
    setIsSelected(!isSelected);
  };

  let renderThis;

  if (isSelected) {
    renderThis = (
      <Pressable
        style={({ pressed }) => [
          styles.exerciseInListSelected,
          pressed && { opacity: 0.75 },
        ]}
        onPress={onPress}
      >
        <Ionicons name={"radio-button-on-outline"} size={24} color={"white"} />
        <Text style={styles.exerciseItemText}>{exerciseName}</Text>
      </Pressable>
    );
  } else {
    renderThis = (
      <Pressable
        style={({ pressed }) => [
          styles.exerciseInListUnselected,
          pressed && { opacity: 0.75 },
        ]}
        onPress={onPress}
      >
        <Ionicons name={"radio-button-off-outline"} size={24} color={"white"} />
        <Text style={styles.exerciseItemText}>{exerciseName}</Text>
      </Pressable>
    );
  }

  return renderThis;
}

const styles = StyleSheet.create({
  exerciseInListUnselected: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseInListSelected: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6704c3",
  },
  exerciseItemText: {
    fontSize: 20,
    color: "white",
    marginHorizontal: 5,
  },
});
