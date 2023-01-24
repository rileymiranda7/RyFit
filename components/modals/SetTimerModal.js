import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import TimerInput from "../timer/input-timer/TimerInput";
import {Picker} from '@react-native-picker/picker';
import { showMessage, hideMessage } from "react-native-flash-message";

import { Colors } from "../../constants/colors";

export default function SetTimerModal({
  modalVisible,
  closeModal,
  handleOnTimerAmountSet,
}) {

  const [selectedSecondsVal, setSelectedSecondsVal] = useState("00");
  const [selectedMinutesVal, setSelectedMinutesVal] = useState("00");

  const convertToMinutes = (input) => {
    const minutes = Number(input.substring(0, 2));
    const seconds = Number(input.substring(2, 4));
    return minutes + seconds / 60;
  };

  return (
    <SafeAreaView>
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
            {/* <TimerInput handleTimerAmountChanged={handleOnChange} /> */}
            <View style={styles.pickerContainer}>
              <Picker
                style={{ minWidth: "30%" }}
                itemStyle={{ color: "white" }}
                selectedValue={selectedMinutesVal}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedMinutesVal(itemValue);
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
              <Text style={styles.textStyle}>min</Text>
              <Picker
                style={{ minWidth: "30%" }}
                itemStyle={{ color: "white" }}
                selectedValue={selectedSecondsVal}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedSecondsVal(itemValue);
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
              <Text style={styles.textStyle}>s</Text>
            </View>
            <View style={styles.timerButtonsContainer}>
              <View style={styles.startButtonRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.startButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={async () => {
                    if (selectedMinutesVal === "10" && 
                    selectedSecondsVal !== "00") {
                      showMessage({
                        message: "Auto Rest Timer has max of 10 min!",
                        type: "danger",
                      });
                  } else if (selectedMinutesVal === "00" && 
                  selectedSecondsVal === "00") {
                    showMessage({
                      message: "Auto Rest Timer cannot be 0 min 0 s!",
                      type: "danger",
                      
                    });
                  } else {
                    handleOnTimerAmountSet(
                      convertToMinutes(selectedMinutesVal + selectedSecondsVal)
                    );
                  }
                  }}
                >
                  <Text style={styles.textStyle}>Start Timer</Text>
                </Pressable>
              </View>
              <View style={styles.timerButtonsRow1}>
                <Pressable
                  style={({ pressed }) => [
                    styles.timerButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => handleOnTimerAmountSet(1)}
                >
                  <Text style={styles.textStyle}>1:00</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.timerButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => handleOnTimerAmountSet(1.5)}
                >
                  <Text style={styles.textStyle}>1:30</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.timerButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => handleOnTimerAmountSet(2)}
                >
                  <Text style={styles.textStyle}>2:00</Text>
                </Pressable>
              </View>
              <View style={styles.timerButtonsRow2}>
                <Pressable
                  style={({ pressed }) => [
                    styles.timerButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => handleOnTimerAmountSet(3)}
                >
                  <Text style={styles.textStyle}>3:00</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.timerButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => handleOnTimerAmountSet(3.5)}
                >
                  <Text style={styles.textStyle}>3:30</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.timerButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => handleOnTimerAmountSet(4)}
                >
                  <Text style={styles.textStyle}>4:00</Text>
                </Pressable>
              </View>
              <View style={styles.timerButtonsRow3}>
                <Pressable
                  style={({ pressed }) => [
                    styles.timerButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => handleOnTimerAmountSet(4.5)}
                >
                  <Text style={styles.textStyle}>4:30</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.timerButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => handleOnTimerAmountSet(5)}
                >
                  <Text style={styles.textStyle}>5:00</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.timerButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => handleOnTimerAmountSet(7)}
                >
                  <Text style={styles.textStyle}>7:00</Text>
                </Pressable>
              </View>
              <View style={styles.closeButtonRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => closeModal()}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: "5%",
    marginTop: "26%",
    width: "90%",
    height: "85%",
    backgroundColor: Colors.purple10,
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerContainer: {
    marginHorizontal: 5,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.purple10,
    borderRadius: 6,
    minWidth: "95%"
  },
  inputContainer: {
    backgroundColor: Colors.purple10,
    minWidth: "80%",
    height: "8%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  startButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.green3,
  },
  timerButton: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "white",
    minWidth: "22%",
    padding: 10,
    elevation: 2,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.blue3,
  },
  cancelButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.red2,
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  titleText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  input: {
    fontSize: 25,
    backgroundColor: Colors.gray2,
    padding: 4,
    minWidth: "78%",
    minHeight: "7%",
    textAlign: "center",
  },
  timerButtonsContainer: {
    flex: 1,
    minWidth: "80%",
    maxWidth: "90%",
    minHeight: "15%",
    maxHeight: "50%"
  },
  startButtonRow: {
    minHeight: "5%",
    maxHeight: "13%",
    minWidth: "4%",
    flexDirection: "row",
    justifyContent: "center",
  },
  timerButtonsRow1: {
    minHeight: "13%",
    minWidth: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timerButtonsRow2: {
    minHeight: "13%",
    minWidth: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timerButtonsRow3: {
    minHeight: "13%",
    minWidth: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closeButtonRow: {
    minHeight: "5%",
    maxHeight: "13%",
    minWidth: "4%",
    flexDirection: "row",
    justifyContent: "center",
  },
});
