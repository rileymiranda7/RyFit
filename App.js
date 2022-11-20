import { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";

import PastWorkoutsScreen from "./screens/PastWorkoutsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CurrentWorkoutScreen from "./screens/CurrentWorkoutScreen";
import PickExerciseForRoutineScreen from "./screens/PickExerciseForRoutineScreen";
import HeaderTimer from "./components/UI/timer/HeaderTimer";
import TestCountdown from "./TestCountdown";
import { init } from "./utils/database";
import RoutineModal from "./components/UI/modals/RoutineModal";
import ActiveWorkoutScreen from "./screens/ActiveWorkoutScreen";

const BottomTabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function scheduleNotificationsHandler() {
  const hasPushNotificationPermissionGranted = await allowsNotificationsAsync();

  if (hasPushNotificationPermissionGranted) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Start Next Set!",
      },
      trigger: {
        seconds: 1,
      },
    });
  }
}

async function allowsNotificationsAsync() {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

async function requestPermissionsAsync() {
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
}

// Navigators listed with most nested first
function CurrentWorkoutStackNavigator({ handleOnSetCompleted }) {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: "black" },
        headerTintColor: "white",
        tabBarStyle: { backgroundColor: "pink" },
        tabBarActiveTintColor: "pink",
      })}
    >
      <Stack.Screen
        name="CurrentWorkout"
        component={CurrentWorkoutScreen}
        //component={CurrentWorkoutScreen}
        title="Current Workout"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RoutineModal"
        component={RoutineModal}
        title="Routine"
        options={{
          //presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PickExerciseForRoutineScreen"
        component={PickExerciseForRoutineScreen}
        title="Pick Exercise"
        options={{
          //presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ActiveWorkout"
        children={() => (
          <ActiveWorkoutScreen handleOnSetCompleted={handleOnSetCompleted} />
        )}
        title="Pick Exercise"
        options={{
          //presentation: "modal",
          headerShown: false,
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

function BottomTabsNavigator({ handleOnSetCompleted }) {
  return (
    <BottomTabs.Navigator
      initialRouteName="Drawer"
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: "brown" },
        headerTintColor: "gold",
        tabBarStyle: { backgroundColor: "#2d0689" },
        tabBarActiveTintColor: "red",
      })}
    >
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
        //component={CurrentWorkoutStackNavigator}
        children={() => (
          <CurrentWorkoutStackNavigator
            handleOnSetCompleted={handleOnSetCompleted}
          />
        )}
        options={{
          headerShown: false,
          title: "Start Workout",
        }}
      />
    </BottomTabs.Navigator>
  );
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  requestPermissionsAsync();
  const [showSetTimer, setShowSetTimer] = useState(false);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [restTimerAmount, setRestTimerAmount] = useState("0");
  const [resetTimer, setResetTimer] = useState(false);
  const [showActiveTimerModal, setShowActiveTimerModal] = useState(false);
  const [rndm, setRndm] = useState(0.5);
  const [dbInitialized, setDbInitialized] = useState(false);

  const handleOnSetCompleted = (restTimerAmount) => {
    setRestTimerAmount(restTimerAmount);
    setRndm(Math.random());
  };

  const handleTimerPressed = () => {
    setShowActiveTimerModal(!showActiveTimerModal);
  };

  const handleOnTimerEnd = (timerWasCanceled) => {
    //scheduleNotificationsHandler();
    setTimerIsRunning(!timerIsRunning);
    if (!timerWasCanceled) {
      Alert.alert("Time For Next Set!", "", [
        { text: "OK", onPress: () => {} },
      ]);
    }
  };

  const exitActiveTimerModal = () => {
    setShowActiveTimerModal(false);
  };

  useEffect(() => {
    init()
      .then(() => {
        setDbInitialized(true);
      })
      .catch((err) => {
        console.log(err);
      });

    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Push notifications need the appropriate permissions."
        );
        return;
      }

      /* const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log(pushTokenData); */

      if (Platform.OS === "android)") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }

    configurePushNotifications();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (dbInitialized) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [dbInitialized]);

  if (!dbInitialized) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={({ navigation }) => ({
            drawerStyle: {
              backgroundColor: "#5721d4",
            },
            headerStyle: { backgroundColor: "#2d0689" },
            headerTintColor: "white", // color of elements in header not background
          })}
        >
          <Drawer.Screen
            name="BottomTabs"
            children={() => (
              <BottomTabsNavigator
                handleOnSetCompleted={handleOnSetCompleted}
              />
            )}
            options={{
              title: "RyFit",
              headerRight: () => {
                return (
                  <HeaderTimer restTimerAmount={restTimerAmount} rndm={rndm} />
                );
              },
            }}
          />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
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
