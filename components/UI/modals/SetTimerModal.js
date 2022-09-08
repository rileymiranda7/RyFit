import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import TimerInput from "../timer/input-timer/TimerInput";

export default function SetTimerModal({
  modalVisible,
  closeModal,
  handleOnTimerAmountSet,
}) {
  const [timerAmount, setTimerAmount] = useState("5");

  const convertToMinutes = (input) => {
    const minutes = Number(input.substring(0, 2));
    const seconds = Number(input.substring(2, 4));
    return minutes + seconds / 60;
  };

  const handleOnChange = (updatedText) => {
    setTimerAmount(convertToMinutes(updatedText));
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          closeModal();
        }}
      >
        <View>
          <View style={styles.modalView}>
            <Text style={styles.titleText}>
              Enter Timer Amount{"\n"}(Max 10 min)
            </Text>
            <TimerInput handleTimerAmountChanged={handleOnChange} />
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonClose,
                pressed && { opacity: 0.75 },
              ]}
              onPress={() => handleOnTimerAmountSet(timerAmount)}
            >
              <Text style={styles.textStyle}>Start Timer</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonClose,
                pressed && { opacity: 0.75 },
              ]}
              onPress={() => closeModal()}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    marginTop: "10%",
    width: "90%",
    height: "88%",
    backgroundColor: "#3e04c3",
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
  titleText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#2196F3",
    margin: 10,
    padding: 4,
  },
  input: {
    fontSize: 25,
    backgroundColor: "#b8bbbe",
    padding: 4,
    minWidth: "78%",
    minHeight: "7%",
    textAlign: "center",
  },
});
