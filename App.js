import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

import StartWorkoutScreen from "./screens/StartWorkoutScreen";
import PastWorkoutsScreen from "./screens/PastWorkoutsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CurrentWorkoutScreen from "./screens/CurrentWorkoutScreen";
import "react-native-gesture-handler";

const BottomTabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="StartWorkout"
        component={StartWorkoutScreen}
        options={{
          title: "Start Workout",
        }}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <BottomTabs.Navigator initialRouteName="Drawer">
          <BottomTabs.Screen
            name="PastWorkouts"
            component={PastWorkoutsScreen}
            options={{
              title: "Past Workouts",
            }}
          />
          <BottomTabs.Screen
            name="Drawer"
            component={DrawerNavigator}
            options={{
              headerShown: false,
              title: "Start Workout",
            }}
          />
          <BottomTabs.Screen
            name="CurrentWorkout"
            component={CurrentWorkoutScreen}
            options={{
              title: "Current Workout",
            }}
          />
        </BottomTabs.Navigator>
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
