import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

export default function ExerciseOption({
  exercise,
  exerciseSelected,
  exerciseDeselected,
}) {
  const [isSelected, setIsSelected] = useState(false);

  const onPress = () => {
    if (!isSelected) {
      exerciseSelected(exercise);
    } else if (isSelected) {
      exerciseDeselected(exercise);
    }
    setIsSelected(!isSelected);
  };

  let renderThis;

  if (isSelected) {
    renderThis = (
      <Pressable
        style={({ pressed }) => [
          styles.exerciseInListSelected,
          pressed && { opacity: 0.5 },
        ]}
        onPress={onPress}
      >
        <View style={{ flex: 1 }}>
          <Ionicons name={"radio-button-on-outline"} size={24} color={"white"} />
        </View>
        <View style={{ flex: 9 }}>
          <Text 
            style={styles.exerciseItemText}
            numberOfLines={1}
          >
            {
              exercise.name
            }
          </Text>
        </View>
      </Pressable>
    );
  } else {
    renderThis = (
      <Pressable
        style={({ pressed }) => [
          styles.exerciseInListUnselected,
          pressed && { opacity: 0.5 },
        ]}
        onPress={onPress}
      >
        <View style={{ flex: 1}}>
          <Ionicons name={"radio-button-off-outline"} size={24} color={"white"} />
        </View>
        <View style={{ flex: 9 }}>
          <Text 
            style={styles.exerciseItemText}
            numberOfLines={1}
          >
            {
              exercise.name
            }
          </Text>
        </View>
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
    backgroundColor: Colors.purple6,
  },
  exerciseItemText: {
    fontSize: 15,
    color: "white",
    marginHorizontal: 5,
  },
});
