import { useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import ExerciseList from "./ExerciseList";

export default function ActiveWorkout() {
  const [exerciseList, setExerciseList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseNameInput, onChangeText] = useState();
  const navigation = useNavigation();
  const route = useRoute();
  const exerciseName = route.params?.exerciseName;

  function addExercisePressedHandler() {
    //navigation.navigate("PickExercise");
    setIsModalVisible(true);
  }

  function submitPickedExerciseHandler() {}

  function closeModal() {
    setIsModalVisible(false);
  }

  /*  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>Your Workout</Text>
      <ExerciseList exerciseList={exerciseList} />
      <Button title="Add Exercise" onPress={addExercisePressedHandler} />
      <View style={styles.modal}>
        <Modal visible={isModalVisible} animationType={"slide"}>
          <Text>modal</Text>
          <Button style={styles.modalText} title="close" onPress={closeModal} />
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 25,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  container: {
    flex: 1,
    marginTop: 22,
  },
  modalText: {
    textAlign: "center",
    marginBottom: 15,
  },
}); */

  return (
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
            <Text style={styles.modalText}>Hello World!</Text>
            <TextInput
              style={{ backgroundColor: "red", minWidth: 100 }}
              onChangeText={onChangeText}
              value={exerciseNameInput}
            />
            <Button
              title="Add Exercise"
              onPress={submitPickedExerciseHandler}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 130,
    paddingVertical: 300,
    alignItems: "center",
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
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
