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

function BottomTabsNavigator() {
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
