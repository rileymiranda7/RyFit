import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { Exercise } from "../../models/exercise";
import IconButton from "./IconButton";
import RoutineModal from "./modals/RoutineModal";

export default function RoutineItem({ routineName, exercises }) {
  let exerciseList;

  const navigation = useNavigation();

  if (exercises.length > 4) {
    let shortenedList = exercises.slice(0, 4);
    shortenedList.push(new Exercise("..."));
    exerciseList = shortenedList;
  } else {
    exerciseList = exercises;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.routineNameStyle}>{routineName}</Text>
        <IconButton
          icon="ellipsis-horizontal-circle-outline"
          size={27}
          color="white"
          onPress={() => {
            navigation.navigate("RoutineModal", {
              routineName: routineName,
            });
          }}
        />
      </View>
      {exerciseList.map((exercise, index) => {
        return (
          <Text style={styles.exerciseTextStyle} key={index}>
            {exercise.name}
          </Text>
        );
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
    padding: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  routineNameStyle: {
    color: "white",
    fontSize: 16,
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
});
