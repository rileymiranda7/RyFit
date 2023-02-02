import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import InsetShadow from "react-native-inset-shadow";

import { Exercise } from "../../models/exercise";
import IconButton from "../IconButton";
import { createWorkout } from "../../utils/database/insertFunctions";
import { Colors } from "../../constants/colors";
import ShadowContainer from "../ShadowContainer";

export default function RoutineItem({ routineName, exercises }) {
  let exerciseList;

  const navigation = useNavigation();

  function shouldBeginRoutine(routineName) {
    Alert.alert(
      `Begin ${routineName} ?`,
      "Start workout with this exercise routine?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Start",
          onPress: async () => {
            const workoutId = await createWorkout(routineName);
            navigation.navigate("ActiveWorkout", {
              restoringWorkout: false,
              routineName: routineName,
              workoutId: workoutId
            });
          },
        },
      ],
      {userInterfaceStyle: "dark"}
    );
  }

  let renderList;
  if (exercises.length === 0) {
    renderList = (
      <Text style={styles.exerciseTextStyle}>
        no exercises yet...
      </Text>
    );
  } else if (exercises.length > 4) {
    let shortenedList = exercises.slice(0, 4);
    shortenedList.push(new Exercise("..."));
    exerciseList = shortenedList;
    renderList = exerciseList.map((exercise, index) => {
      return (
        <Text style={styles.exerciseTextStyle} key={index}>
          {
            exercise.name.length > 20 ? 
              exercise.name.substring(0,15) + "...": 
              exercise.name
          }
        </Text>
      );
    });
  } else {
    exerciseList = exercises;
    renderList = exerciseList.map((exercise, index) => {
      return (
        <Text style={styles.exerciseTextStyle} key={index}>
          {
            exercise.name.length > 20 ? 
              exercise.name.substring(0,15) + "...": 
              exercise.name
          }
        </Text>
      );
    });
  }



  return (
    <Pressable
      style={({ pressed }) => [pressed && styles.pressed, styles.container]}
      onPress={() => {
        shouldBeginRoutine(routineName);
      }}
    >
      <ShadowContainer
        lightShadowColor={"#5405ff"}
        darkShadowColor={"#28037d"}
        margin={2}
      >
        <View style={styles.headerContainer}>
          <Text 
            style={styles.routineNameStyle}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {routineName}
          </Text>
          <View style={styles.buttonContainer}>
            <IconButton
              icon="ellipsis-horizontal-circle-outline"
              size={35}
              color="white"
              onPress={() => {
                navigation.navigate("RoutineModal", {
                  routineName: routineName,
                });
              }}
            />
          </View>
        </View>
        <View style={{paddingBottom: 5}}>
          {renderList}
        </View>
      </ShadowContainer>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 4,
    minWidth: "48%",
    maxWidth: "48%",
    borderRadius: 5,
  },
  routineNameStyle: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: "60%",
    textAlign: "left",
    padding: 5
  },
  exerciseTextStyle: {
    color: "white",
    paddingHorizontal: 5
  },
  buttonContainer: {
    paddingTop: 5,
    paddingRight: 5
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pressed: {
    opacity: 0.5,
  },
});
