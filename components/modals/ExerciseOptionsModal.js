import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Pressable, 
  Keyboard, 
  TextInput, 
  Button,
  Alert 
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {Picker} from '@react-native-picker/picker';

import { showMessage, hideMessage } from "react-native-flash-message";
import { Colors } from "../../constants/colors";
import { updateExerciseName } from "../../utils/database/updateFunctions";
import { exerciseAlreadyExists } from "../../utils/database/fetchFunctions";

export default function ExerciseOptionsModal({
  closeExerOptionsModal,
  removeExerFromWorkout,
  exercise,
  numSetsInExer,
  numCompletedSetsInExer,
  handleRestTimeSet,
  restTimeAmount,
  changeExerName
}) {

  const [selectedSecondsVal, setSelectedSecondsVal] = useState("00");
  const [selectedMinutesVal, setSelectedMinutesVal] = useState("00");
  const [shouldShowRestTimerPicker, setShouldShowRestTimePicker] = useState(false);
  const [shouldShowChangeExerName, setShouldShowChangeExerName] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [exerciseNameInput, setExerciseNameInput] = useState("");
  const [shouldShowKeyboardDismiss, setShouldShowKeyboardDismiss] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const convertToWholeMinsAndSecs = (amount) => {
    const mins = Math.floor(amount);
    const secs = Math.round((amount - mins) * 60);
    return { mins, secs};
  }

  const onSubmitNewName = async () => {
    // check exercise name is valid and doesn't already exist
    const nameNotAvailable = await exerciseAlreadyExists(exerciseNameInput);
    if (nameNotAvailable) {
      Alert.alert(
        `Exercise with this name already exists!`,
        "",
        [
          {
            text: "Ok",
            onPress: () => {
              return;
            },
            style: "cancel",
          },
        ]
      );
      } else {
        Alert.alert(
          `Change Exercise Name`,
          `Change '${exercise.name.length > 20 ? 
            exercise.name.substring(0,15) + "...": 
            exercise.name}' to '${exerciseNameInput.length > 20 ? 
              exerciseNameInput.substring(0,15) + "...": 
              exerciseNameInput}'?`,
          [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Change",
              onPress: async () => {
                await updateExerciseName(exercise.name, exerciseNameInput);
                changeExerName(exercise.name, exerciseNameInput);
              },
              style: "destructive",
            },
          ]
        );
      }
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      setShouldShowKeyboardDismiss(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setShouldShowKeyboardDismiss(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [])

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
        {!shouldShowChangeExerName && (<Pressable
          style={({ pressed }) => [
            pressed && { opacity: 0.5 },
            styles.pressableRow
          ]}
          onPress={() => {
            setShouldShowRestTimePicker(true);
          }}
        >
          <View style={[styles.pressableRow, {marginTop: 5}]}>
            <Ionicons name="timer-outline" color={"white"} size={24} />
            <Text style={styles.textStyle}>
              {" Set Rest Timer Amount"}
            </Text>
          </View>
        </Pressable>)}
        {!shouldShowRestTimerPicker && (<Pressable
          style={({ pressed }) => [
            pressed && { opacity: 0.5 },
            styles.pressableRow
          ]}
          onPress={() => {
            setShouldShowChangeExerName(true);
          }}
        >
          <View style={[styles.pressableRow, {marginTop: 5}]}>
            <Ionicons name="create-outline" color={"white"} size={24} />
            <Text style={styles.textStyle}>
              {" Change Exercise Name"}
            </Text>
          </View>
        </Pressable>)}
        {shouldShowRestTimerPicker && !shouldShowChangeExerName && (
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
                  pressed && { opacity: 0.5 },
                  styles.button, { backgroundColor: Colors.green3}
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
                    closeExerOptionsModal();
                  }
                }}
              >
                <Text style={styles.textStyle}>Set Rest Time</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  pressed && { opacity: 0.5 },
                  styles.button, { backgroundColor: Colors.red2}
                ]}
                onPress={() => setShouldShowRestTimePicker(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}
        {shouldShowChangeExerName && !shouldShowRestTimerPicker && (
          <View style={{ flex: 1, minWidth: "100%"}}>
            <Text style={styles.exerciseNameTextStyle}>{exercise.name}</Text>
            <TextInput
              style={[
                styles.input, 
                inputFocused && {
                  borderWidth: 2,
                  borderColor: "white"
                },
                { marginBottom: 20}
              ]}
              onChangeText={setExerciseNameInput}
              value={exerciseNameInput}
              placeholder="Enter an Exercise"
              maxLength={50}
              keyboardAppearance='dark'
              onFocus={() => {
                setInputFocused(!inputFocused);
              }}
              onBlur={() => {
                setInputFocused(!inputFocused);
              }}
            />
            <Pressable
                style={({ pressed }) => [
                  pressed && { opacity: 0.5 },
                  styles.button, 
                  { 
                    backgroundColor: Colors.green3,
                    marginBottom: 20
                  }
                ]}
                onPress={async () => {
                  await onSubmitNewName();
                }}
              >
                <Text style={styles.textStyle}>Change Exercise Name</Text>
              </Pressable>
            <Pressable
                style={({ pressed }) => [
                  pressed && { opacity: 0.5 },
                  styles.button, { backgroundColor: Colors.red2}
                ]}
                onPress={() => setShouldShowChangeExerName(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            {shouldShowKeyboardDismiss && (
                <View 
                  style={{
                    position: "absolute",
                    bottom: keyboardHeight - 120,
                    right: "0%",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      Keyboard.dismiss();
                      setShouldShowKeyboardDismiss(false);
                    }}
                  >
                    <Ionicons 
                      name="arrow-down-circle-outline" 
                      size={60} 
                      color={"yellow"} 
                    />
                  </Pressable>
                </View>)}
          </View>
        )}
        {!shouldShowRestTimerPicker && !shouldShowChangeExerName && (
          <View>
            <Pressable
                style={({ pressed }) => [
                  pressed && { opacity: 0.5 },
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
                <Ionicons name="trash" color={Colors.red3} size={24} />
                <Text style={[styles.textStyle, {color: Colors.red3}]}>
                  {" Remove Exercise from Workout"}
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                pressed && { opacity: 0.5 },
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
    backgroundColor: Colors.purple9,
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "black",
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
    marginHorizontal: 5,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.purple8,
    borderRadius: 6,
    minWidth: "95%"
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
  },
  exerciseNameTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginVertical: 5,
  },
  input: {
    fontSize: 22,
    backgroundColor: Colors.gray2,
    padding: 6,
    minWidth: "78%",
    borderRadius: 8
  },
});
