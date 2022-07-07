import { View, Text, FlatList, StyleSheet } from "react-native";

import Exercise from "./Exercise";

export default function ExerciseList({ exerciseList }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={exerciseList}
        renderItem={(exercise) => {
          return <Exercise exerciseName={exercise.item.name} />;
        }}
        keyExtractor={(exercise) => exercise.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
  },
});
