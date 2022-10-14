import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

import Exercise from "../components/Exercise";
import PickExerciseModal from "../components/UI/modals/PickExerciseModal";

export default function ActiveWorkoutScreen({
  handleOnSetCompleted,
  endWorkout,
}) {
  const [exerciseList, setExerciseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const route = useRoute();
  const isFocused = useIsFocused();

  const { routineName } = route.params;

  const loadRoutine = async (routineName) => {};

  useEffect(() => {
    if (isFocused && routineName) {
      if (routineName !== "BLANK") {
        loadRoutine(routineName);
      }
    }
  }, [isFocused, routineName]);

  function submitPickedExerciseHandler(exercises) {
    exercises.forEach((exercise) => {
      setExerciseList((curExerciseList) => {
        return [...curExerciseList, exercise];
      });
    });
    setModalVisible(false);
  }

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.exerciseList}>
        <FlatList
          ListHeaderComponent={<Text style={styles.textStyle}>Workout</Text>}
          data={exerciseList}
          renderItem={(exercise) => {
            return (
              <Exercise
                exerciseName={exercise.item.name}
                handleOnSetCompleted={handleOnSetCompleted}
              />
            );
          }}
          keyExtractor={(exercise) => exercise.name}
          ListFooterComponent={
            <>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonOpen,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.textStyle}>Add Exercise</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.endWorkoutButton,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() => endWorkout()}
              >
                <Text style={styles.textStyle}>End Workout</Text>
              </Pressable>
            </>
          }
        />
      </View>
      <View>
        {modalVisible && (
          <PickExerciseModal
            submitPickedExerciseHandler={submitPickedExerciseHandler}
            closeModal={closeModal}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseList: {
    flex: 1,
    minHeight: "100%",
    minWidth: "100%",
    backgroundColor: "black",
    paddingHorizontal: 9,
  },
  container: {
    flex: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 20,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  endWorkoutButton: {
    backgroundColor: "#ff0000",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 30,
  },
  input: {
    fontSize: 25,
    backgroundColor: "#b8bbbe",
    padding: 4,
    minWidth: "78%",
    minHeight: "7%",
  },
  inputContainer: {
    backgroundColor: "#b8bbbe",
    minWidth: "80%",
    height: "8%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});
