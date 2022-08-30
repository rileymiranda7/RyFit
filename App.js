import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";

import PastWorkoutsScreen from "./screens/PastWorkoutsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CurrentWorkoutScreen from "./screens/CurrentWorkoutScreen";
import PickExerciseScreen from "./screens/PickExerciseScreen";
import IconButton from "./components/UI/IconButton";
import SetTimerModal from "./components/UI/SetTimerModal";
import HeaderTimer from "./components/UI/HeaderTimer";

const BottomTabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Navigators listed with most nested first
function CurrentWorkoutStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CurrentWorkout"
        component={CurrentWorkoutScreen}
        title="Current Workout"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PickExercise"
        component={PickExerciseScreen}
        title="Add Exercise"
        options={{
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}

function PastWorkoutsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PastWorkoutsStack"
        component={PastWorkoutsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function BottomTabsNavigator({ showSetTimer }) {
  return (
    <BottomTabs.Navigator initialRouteName="Drawer">
      <BottomTabs.Screen
        name="PastWorkoutsBottomTabs"
        component={PastWorkoutsStackNavigator}
        options={{
          headerShown: false,
          title: "Past Workouts",
        }}
      />
      <BottomTabs.Screen
        name="Drawer"
        component={CurrentWorkoutStackNavigator}
        options={{
          headerShown: false,
          title: "Start Workout",
        }}
      />
    </BottomTabs.Navigator>
  );
}

export default function App() {
  const [showSetTimer, setShowSetTimer] = useState(false);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [timerAmount, setTimerAmount] = useState(5);

  const toggleShowSetTimer = () => {
    setShowSetTimer(!showSetTimer);
  };

  const handleOnTimerAmountSet = (timerAmount) => {
    setTimerAmount(Number(timerAmount));
    setShowSetTimer(!showSetTimer);
    setTimerIsRunning(!timerIsRunning);
  };

  const handleOnTimerEnd = () => {
    setTimerIsRunning(!timerIsRunning);
  };

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            name="BottomTabs"
            component={BottomTabsNavigator}
            options={{
              title: "RyFit",
              headerRight: () => {
                return (
                  <>
                    {showSetTimer ? (
                      <SetTimerModal
                        modalVisible={showSetTimer}
                        closeModal={toggleShowSetTimer}
                        handleOnTimerAmountSet={handleOnTimerAmountSet}
                      />
                    ) : timerIsRunning ? (
                      <HeaderTimer
                        timerAmount={timerAmount}
                        onTimerEnd={handleOnTimerEnd}
                      />
                    ) : (
                      <IconButton
                        onPress={toggleShowSetTimer}
                        icon={showSetTimer ? "timer" : "timer-outline"}
                        color="blue"
                        size={30}
                      />
                    )}
                  </>
                );
              },
            }}
          />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
