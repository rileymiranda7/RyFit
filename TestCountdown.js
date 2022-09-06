import { View, Button, Text, StyleSheet } from "react-native";
import { useCountdownTimer } from "use-countdown-timer";

export default function TestCountdown() {
  const { countdown, start, reset, pause, isRunning } = useCountdownTimer({
    timer: 1000 * 5,
  });

  return (
    <View style={styles.container}>
      <Text>{countdown}</Text>
      <Button onPress={reset} title="Reset"></Button>
      {isRunning ? (
        <Button onPress={pause} title="Pause"></Button>
      ) : (
        <Button onPress={start} title="Start"></Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
