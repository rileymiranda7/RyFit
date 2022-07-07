import { View, Text, FlatList, StyleSheet } from "react-native";

import Exercise from "./Exercise";
{
  /* <View style={styles.container}>
  <Text style={{ color: "black" }}>ExerciseList</Text>
  {exerciseList.map((element, index) => {
    return <Exercise exerciseName={element.name} />;
  })}
</View> */
}

export default function ExerciseList({ exerciseList }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={exerciseList}
        renderItem={(exercise) => {
          return <Exercise exerciseName={exercise.item.name} />;
        }}
        keyExtractor={(exercise) => exercise.name}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
  },
});
