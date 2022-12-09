import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {Picker} from '@react-native-picker/picker';

export default function ExerciseOptionsModal({
  closeExerOptionsModal,
  removeExerFromWorkout,
  exercise,
  numSetsInExer,
  numCompletedSetsInExer
}) {

  const [selectedRestTimeAmount, setSelectedRestTimeAmount] = useState();
  const [selectedSecondsVal, setSelectedSecondsVal] = useState();

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
        <Text style={styles.textStyle}>
          Set Rest Timer Amount
        </Text>
        <View style={styles.pressableRow}>
          <Picker
            style={{ minWidth: "30%" }}
            itemStyle={{ color: "white" }}
            selectedValue={selectedRestTimeAmount}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedRestTimeAmount(itemValue);
              if (itemValue === "10") {
                setSelectedSecondsVal("00");
              } else {
              }
            }
            }>
            <Picker.Item label="0" value="00" />
            <Picker.Item label="1" value="01" />
            <Picker.Item label="2" value="02" />
            <Picker.Item label="3" value="03" />
            <Picker.Item label="4" value="04" />
            <Picker.Item label="5" value="05" />
            <Picker.Item label="6" value="06" />
            <Picker.Item label="7" value="07" />
            <Picker.Item label="8" value="08" />
            <Picker.Item label="9" value="09" />
            <Picker.Item label="10" value="10" />
          </Picker>
          <Text style={styles.textStyle}>
          m
        </Text>
          <Picker
            style={{ minWidth: "30%" }}
            itemStyle={{ color: "white" }}
            selectedValue={selectedSecondsVal}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedSecondsVal(itemValue);
              console.log(itemValue);
            }
            }>
            <Picker.Item label="0" value="00" />
            <Picker.Item label="5" value="05" />
            <Picker.Item label="10" value="10" />
            <Picker.Item label="15" value="15" />
            <Picker.Item label="20" value="20" />
            <Picker.Item label="25" value="25" />
            <Picker.Item label="30" value="30" />
            <Picker.Item label="35" value="35" />
            <Picker.Item label="40" value="40" />
            <Picker.Item label="45" value="45" />
            <Picker.Item label="50" value="50" />
            <Picker.Item label="55" value="55" />
          </Picker>
          <Text style={styles.textStyle}>
          s
        </Text>
        </View>
        <Pressable
            style={({ pressed }) => [
              pressed && { opacity: 0.75 },
              styles.pressableRow
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
            <View style={styles.pressableRow}>
              <Ionicons name="trash" color={"#fff"} size={24} />
              <Text style={styles.textStyle}>
                Remove Exercise from Workout
              </Text>
            </View>
          </Pressable>
        <Pressable
          style={({ pressed }) => [
            pressed && { opacity: 0.75 },
            styles.pressableRow
          ]}
          onPress={() => closeExerOptionsModal()}
        >
            <Text style={styles.textStyle}>Close</Text>
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
    fontSize: 16,
  },
  input: {
    fontSize: 25,
    backgroundColor: "#b8bbbe",
    padding: 4,
    minWidth: "78%",
    minHeight: "7%",
  },
  pressableRow: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  }
});
