import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import React from "react";

export default function ExerciseOptionsModal({
  closeExerOptionsModal,
  removeExerFromWorkout,
  exercise,
  numSetsInExer,
  numCompletedSetsInExer
}) {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          closeExerOptionsModal();
        }}
      >
      <View style={styles.modalView}>
        <Pressable
            style={({ pressed }) => [
              pressed && { opacity: 0.75 },
            ]}
            onPress={() => {
              removeExerFromWorkout(
                exercise.name, 
                numSetsInExer,
                numCompletedSetsInExer
              );
              closeExerOptionsModal();
            }
          }
            
          >
            <Text style={styles.textStyle}>
              Remove Exercise from Workout
            </Text>
          </Pressable>
        <Pressable
          style={({ pressed }) => [
            pressed && { opacity: 0.75 },
          ]}
          onPress={() => closeExerOptionsModal()}
        >
            <Text style={styles.textStyle}>X</Text>
          </Pressable>
      </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    marginTop: "80%",
    width: "90%",
    height: "50%",
    backgroundColor: "#3305a0",
    borderRadius: 20,
    padding: 10,
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
  inputContainer: {
    backgroundColor: "#2196F3",
    minWidth: "80%",
    height: "8%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 20,
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
  input: {
    fontSize: 25,
    backgroundColor: "#b8bbbe",
    padding: 4,
    minWidth: "78%",
    minHeight: "7%",
  },
});
