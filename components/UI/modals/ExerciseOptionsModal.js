import { View, Text } from "react-native";
import React from "react";

export default function ExerciseOptionsModal() {
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
            <Text style={styles.textStyle}>Enter Timer Amount In Seconds</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={setTimerAmount}
                value={timerAmount}
              />
            </View>
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
