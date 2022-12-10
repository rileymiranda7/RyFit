import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {Picker} from '@react-native-picker/picker';
import { showMessage, hideMessage } from "react-native-flash-message";

export default function ExerciseOptionsModal({
  closeExerOptionsModal,
  removeExerFromWorkout,
  exercise,
  numSetsInExer,
  numCompletedSetsInExer,
  handleRestTimeSet,
  restTimeAmount
}) {

  const [selectedSecondsVal, setSelectedSecondsVal] = useState("00");
  const [selectedMinutesVal, setSelectedMinutesVal] = useState("00");
  const [shouldShowRestTimerPicker, setShouldShowRestTimePicker] = useState(false);

    const convertToWholeMinsAndSecs = (amount) => {
    const mins = Math.floor(amount);
    const secs = (amount - mins) * 60;
    return { mins, secs};
  }

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
            styles.pressableRow
          ]}
          onPress={() => {
            setShouldShowRestTimePicker(true);
          }}
        >
          <View style={styles.pressableRow}>
            <Ionicons name="timer-outline" color={"#fff"} size={24} />
            <Text style={styles.textStyle}>
              {" Set Rest Timer Amount"}
            </Text>
          </View>
        </Pressable>
        {shouldShowRestTimerPicker && (
          <View style={{ flex: 1, minWidth: "100%"}}>
            <Text style={styles.textStyle}>
              {
                "Current Rest Time: " +
                convertToWholeMinsAndSecs(restTimeAmount).mins +
                " min " +
                convertToWholeMinsAndSecs(restTimeAmount).secs + 
                " s"
              }
            </Text>
            <View style={styles.pressableRow}>
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
            <View style={styles.buttonsRow}>
              <Pressable
                style={({ pressed }) => [
                  pressed && { opacity: 0.75 },
                  styles.button, { backgroundColor: "#1db643"}
                ]}
                onPress={async () => {
                  if (selectedMinutesVal === "10" && 
                    selectedSecondsVal !== "00") {
                      showMessage({
                        message: "Auto Rest Timer has max of 10 min!",
                        type: "danger",
                        statusBarHeight: 50
                      });
                  } else if (selectedMinutesVal === "00" && 
                  selectedSecondsVal === "00") {
                    showMessage({
                      message: "Auto Rest Timer cannot be 0 min 0 s!",
                      type: "danger",
                      statusBarHeight: 50
                    });
                  } else {
                    await handleRestTimeSet(selectedMinutesVal + selectedSecondsVal);
                    setShouldShowRestTimePicker(false);
                  }
                }}
              >
                <Text style={styles.textStyle}>Set Rest Time</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  pressed && { opacity: 0.75 },
                  styles.button, { backgroundColor: "#f32121"}
                ]}
                onPress={() => setShouldShowRestTimePicker(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}
        {!shouldShowRestTimerPicker && (
          <View>
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
                  {" Remove Exercise from Workout"}
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
        )}
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
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  pressableRow: {
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsRow: {
    margin: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    minWidth: "70%"
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  }
});
