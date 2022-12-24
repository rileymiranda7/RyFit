import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useRef } from "react";

const CODE_LENGTH = 4;

export default function TimerInput({ handleTimerAmountChanged }) {
  const [code, setCode] = useState("");
  const [containerIsFocused, setContainerIsFocused] = useState(false);

  const codeDigitsArray = new Array(CODE_LENGTH).fill(0);

  const ref = useRef();

  const handleOnChange = (updatedCode) => {
    setCode(updatedCode);
    handleTimerAmountChanged(updatedCode);
  };

  const handleOnPress = () => {
    setContainerIsFocused(true);
    ref?.current?.focus();
  };

  const handleOnBlur = () => {
    setContainerIsFocused(false);
  };

  const toDigitInput = (_value, idx) => {
    const emptyInputChar = " ";
    const digit = code[idx] || emptyInputChar;

    const isCurrentDigit = idx === code.length;
    const isLastDigit = idx === CODE_LENGTH - 1;
    const isCodeFull = code.length === CODE_LENGTH;

    const isFocused = isCurrentDigit || (isLastDigit && isCodeFull);

    const containerStyle =
      containerIsFocused && isFocused
        ? { ...style.inputContainer, ...style.inputContainerFocused }
        : style.inputContainer;

    return (
      <View key={idx} style={containerStyle}>
        <Text style={style.inputText}>{digit}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <Pressable style={style.inputsContainer} onPress={handleOnPress}>
        {codeDigitsArray.map(toDigitInput)}
      </Pressable>
      <TextInput
        ref={ref}
        value={code}
        onChangeText={handleOnChange}
        onSubmitEditing={handleOnBlur}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        maxLength={CODE_LENGTH}
        style={style.hiddenCodeInput}
      />
      <View style={style.colon}>
        <Text style={style.colonText}>:</Text>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputsContainer: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    borderColor: "#cccccc",
    borderWidth: 2,
    borderRadius: 4,
    padding: 12,
    minWidth: "14%",
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainerFocused: {
    borderColor: "#0f5181",
  },
  inputText: {
    fontSize: 24,
    color: "#ffffff",
    textAlign: "center",
  },
  hiddenCodeInput: {
    position: "absolute",
    height: 0,
    width: 0,
    opacity: 0,
  },
  colon: {
    position: "absolute",
    top: "30%",
    left: "37.7%",
    justifyContent: "center",
    alignItems: "center",
  },
  colonText: {
    color: "#ffffff",
    fontSize: 40,
  },
});
