import { View, Text, StyleSheet, Pressable } from "react-native";

import { Colors } from "../../../constants/colors";

export default function SetNumber({ 
  children, 
  isWarmupSet, 
  inputChangedHandler,
  type 
}) {

  const onPress = async () => {
    await inputChangedHandler("dont matter");
  }

  return (
    <Pressable
      onPress={async () => await onPress()}
    >
      <View 
        style={[styles.container, 
          {backgroundColor: type === "WARMUP" ? "#F15900" 
            : type === "LEFT" ? "#1300ea"
            : type === "RIGHT" ? "#8000b8"
            : Colors.gray0}
        ]}
      >
        <Text style={styles.text}>{children}{
        type === "WARMUP" ? "W" 
        : type === "LEFT" ? "L" 
        : type === "RIGHT" ? "R" 
        : ""
        }</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    minWidth: 40,
    borderWidth: 2,
    borderColor: "white"
  },
  text: {
    color: "white",
    fontSize: 16,
    padding: 4,
    textAlign: "center",
  },
});
