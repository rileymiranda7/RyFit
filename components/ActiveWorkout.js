import { useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import ExerciseList from "./ExerciseList";
import Exercise from "./Exercise";
import PickExerciseModal from "./UI/modals/PickExerciseModal";

export default function ActiveWorkout({ handleOnSetCompleted, endWorkout }) {
  const [exerciseList, setExerciseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  function submitPickedExerciseHandler(exerciseNames) {
    exerciseNames.forEach((exerciseName) => {
      setExerciseList((curExerciseList) => {
        return [...curExerciseList, { name: exerciseName }];
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
    backgroundColor: "black",
    paddingHorizontal: 9,
  },
  container: {
    flex: 1,
    paddingVertical: 5,
  },
  modalView: {
    margin: 20,
    marginTop: "10%",
    width: "90%",
    height: "88%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
