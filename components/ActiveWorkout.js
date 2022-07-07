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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import ExerciseList from "./ExerciseList";

export default function ActiveWorkout() {
  const [exerciseList, setExerciseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseNameInput, onChangeText] = useState();

  function submitPickedExerciseHandler() {
    setExerciseList((curExerciseList) => {
      return [...curExerciseList, { name: exerciseNameInput }];
    });
    onChangeText(null);
    setModalVisible(!modalVisible);
  }

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      <Text style={styles.textStyle}>Workout</Text>
      {exerciseList.length !== 0 && (
        <ExerciseList exerciseList={exerciseList} />
      )}
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Add Exercise</Text>
      </Pressable>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Select Exercise</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={onChangeText}
                  value={exerciseNameInput}
                />
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => submitPickedExerciseHandler()}
              >
                <Text style={styles.textStyle}>Add Exercise</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: "90%",
    height: "90%",
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
    backgroundColor: "red",
    padding: 4,
    minWidth: "78%",
    minHeight: "7%",
  },
  inputContainer: {
    backgroundColor: "red",
    minWidth: "80%",
    height: "8%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});
