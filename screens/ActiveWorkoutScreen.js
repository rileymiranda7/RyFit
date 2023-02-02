import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { useStopwatch } from 'react-timer-hook';
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Ionicons } from "@expo/vector-icons";

import ExerciseItemInActiveWorkout 
  from "../components/ListItems/ExerciseItemInActiveWorkout";
import PickExerciseForActiveWorkoutModal 
  from "../components/modals/PickExerciseForActiveWorkoutModal";
import { 
  deleteAllExerciseInstancesFromWorkout,
  deleteAllSetsFromCurrentExercise,
  deleteAllSetsFromWorkout,
  deleteExerciseInstance,
  deleteExerciseInstancesWithNoCompletedSets,
  deleteIncompleteSetsFromWorkout,
  deleteWorkout, 
} from "../utils/database/deleteFunctions";
import {insertExerciseInstance, insertSet } from "../utils/database/insertFunctions";
import { 
  updateRecords, 
  updateWorkoutDuration, 
  updateWorkoutExerciseOrder, 
  updateWorkoutName 
} from "../utils/database/updateFunctions";
import { fetchRoutine, fetchAllSetsFromAllExerciseInstances, fetchSetsFromExerciseInstance } 
  from "../utils/database/fetchFunctions";
import { ExerciseInstance } from "../models/exerciseInstance";
import Set from "../models/set";
import { Colors } from "../constants/colors";

export default function ActiveWorkoutScreen({
  handleOnSetCompleted,
}) {

  const [exerAndInstList, setExerAndInstList] = useState([]);
  /* {
    exer: {
      name,
      restTime,
      notes,
      setTimerOn
    },
    inst: {
      name,
      workoutId,
      numSetsCompleted,
      numberInWorkout
    },
    firstSet: {
      previous: {}
    },
    heightInfo: {
      numSets,
      exerNotesHeight,
      instNotesHeight
    }, 
    restoredSetsArr: [
      setNumber={item.setNumber}
      lbsValue={item.weight}
      repsValue={item.reps}
      setIsCompleted={item.status === "COMPLETED"}
      inputChangedHandler={inputChangedHandler}
      isWarmupSet={item.type === "WARMUP"}
      type={item.type}
      previous={item.previous}
    ]
  } */

  const [pickExerModalVisible, setPickExerModalVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState(
    routineName ? routineName : "New Workout");
  const [numSetsCompleted, setNumSetsCompleted] = useState(0);
  const [numSets, setNumSets] = useState(0);
  const [shouldShowKeyboardDismiss, setShouldShowKeyboardDismiss] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardY, setKeyboardY] = useState(517);
  const [isValidLeaveScreenAttempt, setIsValidLeaveScreenAttempt] = useState(false);
  const [workoutStatus, setWorkoutStatus] = useState("IN PROGRESS")

  const flatlistRef = useRef();

  
  const route = useRoute();
  const { routineName, workoutId, restoringWorkout, workout,
    exersAndInsts, diffInMins} = route.params;
    
  let offset = new Date();
  let diffInSeconds = (diffInMins * 60)
  offset.setSeconds(offset.getSeconds() + diffInSeconds);
  
  const {
    seconds,
    minutes,
    hours,
    start
  } = useStopwatch({ autoStart: false,
    offsetTimestamp: offset
  });
  
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const loadRoutine = async (routineName) => {
    const routine = await fetchRoutine(routineName);
    // insert exerciseInstances
    // update exerAndInstList
    // insert sets for each exercise
    let tempExerAndInstList = [];
    let numberOfSets = 0;
    await Promise.all(
      routine.exercises.map(async (exercise, index) => {

        const exerciseInstance = new ExerciseInstance(
          exercise.name, workoutId, 0, -1
        );
        
        await insertExerciseInstance(exerciseInstance);

        // get previous set of this exercise from the previous workout
        // if it exists
        let previousSet = {
          weight: "",
          reps: ""
        }
        // get all previous sets of this exercise
        const pastInstancesSets = await fetchAllSetsFromAllExerciseInstances(
          exercise.name, workoutId);
        if (pastInstancesSets?.length > 0) {
          // get last completed wkt id with this exercise
          let currentWktId = pastInstancesSets[0]?.workoutId;
          for (let set of pastInstancesSets) {
            if (set.workoutId === currentWktId) {
              // if there is a set number that matches the number
              // of the set we are adding
              // we are adding exercise so this is first set
              if (set.setNumber ===  1) {
                previousSet = set;
              }
            }
          }
        }

        await insertSet(new Set(
          1, -1, -1, "WORKING", "IN PROGRESS", 
          exercise.name, workoutId, 0, 0, 0,
          previousSet));

        tempExerAndInstList.push({ 
          exer: exercise, inst: exerciseInstance, 
          firstSet: {
            previous: previousSet
          },
          heightInfo: {
            numSets: 1,
            exerNotesHeight: 0,
            instNotesHeight: 0
          }
        });

        numberOfSets = index + 1;
      })
    );
    setNumSets(numberOfSets);
    setExerAndInstList(tempExerAndInstList);
  };

  async function submitPickedExerciseHandler(exercises) {
    // add new Exercise and ExerciseInstance to exerAndInstList
    // insert new exercise instances
    // insert new sets for new exercises
    // update set counter
    let curExerciseNames = [];
    exerAndInstList.forEach((exerAndInst) => {
      curExerciseNames.push(exerAndInst.exer.name);
    });
    let tempExerAndInstList = exerAndInstList;
    let numberOfSets = 0;
    await Promise.all(
      exercises.map(async (exercise, index) => {
        if (!curExerciseNames.includes(exercise.name)) {
          const exerciseInstance = new ExerciseInstance(
            exercise.name, workoutId, 0, -1
          );
          await insertExerciseInstance(exerciseInstance);

          // get previous set of this exercise from the previous workout
          // if it exists
          let previousSet = {
            weight: "",
            reps: ""
          }
          // get all previous sets of this exercise
          const pastInstancesSets = await fetchAllSetsFromAllExerciseInstances(
            exercise.name, workoutId);
          if (pastInstancesSets?.length > 0) {
            // get last completed wkt id with this exercise
            let currentWktId = pastInstancesSets[0]?.workoutId;
            for (let set of pastInstancesSets) {
              if (set.workoutId === currentWktId) {
                // if there is a set number that matches the number
                // of the set we are adding
                // we are adding exercise so this is first set
                if (set.setNumber ===  1) {
                  previousSet = set;
                }
              }
            }
          }

          await insertSet(new Set(
            1, -1, -1, "WORKING", "IN PROGRESS", 
            exercise.name, workoutId, 0, 0, 0,
            previousSet));
            
          numberOfSets++;
          console.log("exercise setTimerOn", exercise.setTimerOn);
          tempExerAndInstList.push({ 
            exer: exercise, inst: exerciseInstance, 
            firstSet: {
              previous: previousSet
            },
            heightInfo: {
              numSets: 1,
              exerNotesHeight: 0,
              instNotesHeight: 0
            }
          });
        }
      })
    );
    setNumSets(numberOfSets);
    setExerAndInstList(tempExerAndInstList);
    setPickExerModalVisible(false);
  }
  
  const closePickExerModal = () => {
    setPickExerModalVisible(false);
  };
  
  const endWorkout = () => {
    const exerList = exerAndInstList.map((exerInst) => {
      return exerInst.exer; });
    if (numSetsCompleted < 1) {
      Alert.alert(
        `End Current Workout?`,
        "Workouts with no completed sets will not be saved!",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "End Workout",
            onPress: async () => {
              setWorkoutStatus("WORKOUT CANCELED");
              setIsValidLeaveScreenAttempt(true);
              await deleteAllSetsFromWorkout(workoutId);
              await deleteWorkout(workoutId);
              await deleteExerciseInstancesWithNoCompletedSets(
                workoutId, exerList);
              navigation.navigate("CurrentWorkout", {
                workoutWasCompleted: false
              });
            },
            style: "destructive",
          },
        ],
        {userInterfaceStyle: "dark"}
      );
      return;
    } else if (numSets - numSetsCompleted > 0) {
      Alert.alert(
        `End Current Workout?`,
        "There are some sets still in progress!",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "End Workout",
            onPress: async () => {
              setWorkoutStatus("WORKOUT COMPLETED");
              setIsValidLeaveScreenAttempt(true);
              const duration = hours + "h " + minutes + "m"
              await updateWorkoutDuration(duration, workoutId);
              await updateWorkoutExerciseOrder(exerAndInstList, workoutId, true, -1);
              await updateRecords(workoutId, exerList);
              await deleteExerciseInstancesWithNoCompletedSets(
                workoutId, exerList);
              await deleteIncompleteSetsFromWorkout(workoutId);
              navigation.navigate("CurrentWorkout", {
                workoutWasCompleted: true
              });
            },
            style: "destructive",
          },
        ],
        {userInterfaceStyle: "dark"}
        );
    }
    else {
      Alert.alert(
        `End Current Workout?`,
        "",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "End Workout",
            onPress: async () => {
              setWorkoutStatus("WORKOUT COMPLETED");
              setIsValidLeaveScreenAttempt(true);
              await updateWorkoutExerciseOrder(exerAndInstList, workoutId, true, -1);
              const duration = hours + "h " + minutes + "m";
              await updateWorkoutDuration(duration, workoutId);
              await updateRecords(workoutId, exerList);
              navigation.navigate("CurrentWorkout", {
                workoutWasCompleted: true
              });
            },
          },
        ],
        {userInterfaceStyle: "dark"}
        );
      }
    }

  const cancelWorkout = async () => {
    Alert.alert(
      `Cancel Workout?`,
      "All workout data will be deleted",
      [
        {
          text: "Continue Workout",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Cancel Workout",
          onPress: async () => {
            setIsValidLeaveScreenAttempt(true);
            await deleteAllSetsFromWorkout(workoutId);
            await deleteAllExerciseInstancesFromWorkout(workoutId);
            await deleteWorkout(workoutId);
            navigation.navigate("CurrentWorkout", {
              workoutWasCompleted: false
            });
          },
          style: "destructive",
        },
      ],
      {userInterfaceStyle: "dark"}
    );
  }

  const updateNumSetsCompleted = (shouldAddOneSet) => {
    if (shouldAddOneSet) {
      setNumSetsCompleted(numSetsCompleted + 1);
    } else {
      setNumSetsCompleted(numSetsCompleted - 1);
    }
  }

  const updateNumSets = (shouldAddOneSet) => {
    if (shouldAddOneSet) {
      setNumSets(numSets + 1);
    } else {
      setNumSets(numSets - 1);
    }
  }
  
  const resetWorkoutName = async () => {
    await updateWorkoutName(workoutId, workoutName);
  }

  const removeExerFromWorkout = async (
    exerciseNameToBeDeleted, numSetsInExer, numCompletedSetsInExer) => {
    // delete exer and inst from exerAndInstList
    let tempExerAndInstList = exerAndInstList;
    tempExerAndInstList = tempExerAndInstList.filter((exerInst) => 
      exerInst.exer.name !== exerciseNameToBeDeleted);
    setExerAndInstList(tempExerAndInstList);
    
    // delete ExerciseInstance from db
    await deleteExerciseInstance(exerciseNameToBeDeleted, workoutId);
    
    // delete sets from db
    await deleteAllSetsFromCurrentExercise(workoutId, exerciseNameToBeDeleted);

    // subtract sets from counters
    setNumSets(numSets - numSetsInExer);
    setNumSetsCompleted(numSetsCompleted - numCompletedSetsInExer);
  }

  const changeExerName = (oldName, newName) => {
    let temp = [...exerAndInstList];
    temp = temp.map((exerInst) => {
      if (exerInst.exer.name === oldName) {
        return {
          ...exerInst,
          exer: {
            ...exerInst.exer,
            name: newName
          },
          inst: {
            ...exerInst.inst,
            name: newName
          }
        } 
      } else {
        return exerInst;
      }
    });
    setExerAndInstList(temp);
  }

  const onExerNumSetsChanged = (exerName, newNumSets) => {
    let temp = [...exerAndInstList];
    temp = temp.map((exerInst) => {
      if (exerInst.exer.name === exerName) {
        return {
          ...exerInst,
          heightInfo: {
            ...exerInst.heightInfo,
            numSets: newNumSets
          }
        } 
      } else {
        return exerInst;
      }
    });
    setExerAndInstList(temp);
  }

  const onExerNotesHeightChanged = (exerName, newHeight) => {
    let temp = [...exerAndInstList];
    temp = temp.map((exerInst) => {
      if (exerInst.exer.name === exerName) {
        return {
          ...exerInst,
          heightInfo: {
            ...exerInst.heightInfo,
            exerNotesHeight: newHeight
          }
        } 
      } else {
        return exerInst;
      }
    });
    setExerAndInstList(temp);
  }

  const onInstNotesHeightChanged = (exerName, newHeight) => {
    let temp = [...exerAndInstList];
    temp = temp.map((exerInst) => {
      if (exerInst.exer.name === exerName) {
        return {
          ...exerInst,
          heightInfo: {
            ...exerInst.heightInfo,
            instNotesHeight: newHeight
          }
        } 
      } else {
        return exerInst;
      }
    });
    setExerAndInstList(temp);
  }

  const handleGotRowY = (rowY, exerNumInList, setNumber) => {
    // if focused input is near or below where keyboard will cover
    if (rowY + 20 >= keyboardY) {
      // calculate total offset from top
      // of list to focused set row
      let targetOffset = 30; // workout name row height
      targetOffset += (exerNumInList + 1) * 32;// exer name row height
      targetOffset += (exerNumInList + 1) * 34;// notes header height
      targetOffset += (exerNumInList + 1) * 25.7;// set header height
      targetOffset += (exerNumInList) * 42.3;// add set height
      exerAndInstList.map((exerInst, index) => {
        if (index <= exerNumInList) {
          targetOffset += exerInst.heightInfo.exerNotesHeight;
          targetOffset += exerInst.heightInfo.instNotesHeight;
          if (index < exerNumInList) {
            // sets before focused exercise
            targetOffset += exerInst.heightInfo.numSets * 40; 
          } else {
            // focused exercise sets
            // want offset on previous set to focused set
            targetOffset += (setNumber - 1) * 40;
          }
        }
      });
      targetOffset -= 300;
      setTimeout(() => {
        flatlistRef.current.scrollToOffset({offset: targetOffset, animated: true})
      }, 700)
    }
  } 

  async function restoreWorkout() {
    console.log("wkt", workout)
    setWorkoutName(workout.name);
    console.log("diffInMins", diffInMins)
    exersAndInsts.map(async (exerInst) => {
      let sets = await fetchSetsFromExerciseInstance(exerInst.exerciseName, workoutId);
      let completedSets = 0;
      for (let set of sets) {
        if (set.status === "COMPLETED") {
          completedSets++;
        }
      }
      const arrItem = {
        exer: {
          name: exerInst.exerciseName,
          restTime: exerInst.restTime,
          notes: exerInst.exerciseNotes,
          setTimerOn: exerInst.setTimerOn
        },
        inst: {
          name: exerInst.exerciseName,
          workoutId: workoutId,
          numSetsCompleted: completedSets,
          numberInWorkout: exerInst.numberInWorkout,
          exerInstNotes: exerInst.exerInstNotes
        },
        firstSet: { // don't use in restoring; sets already have this
          previous: {}
        },
        heightInfo: {
          numSets: sets.length,
          exerNotesHeight: 0,
          instNotesHeight: 0
        }, 
        restoredSetsArr: sets
      }
      exerAndInstList.push(arrItem);
    });
  }
  
  useEffect(() => {
    if (isFocused && routineName) {
      if (routineName !== "BLANK") {
        loadRoutine(routineName);
        setWorkoutName(routineName);
      }
    }
  }, [isFocused, routineName]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      setKeyboardY(event.endCoordinates.screenY);
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

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        if (!isValidLeaveScreenAttempt) {
          e.preventDefault();
        }
      }),
    [navigation, isValidLeaveScreenAttempt]
  );

  useEffect(() => {
    (async () => {
      if (restoringWorkout) {
        await restoreWorkout();
        start();
      } else {
        start();
      }
    })();
  }, [restoringWorkout])



  return (
    <View
      style={styles.container}
    >
      <View style={styles.exerciseList}>
        <DraggableFlatList
          onDragEnd={async ({ data }) => {
            setExerAndInstList(data);
            await updateWorkoutExerciseOrder(data, workoutId, true, -1);
          }}
          ListHeaderComponent={
            <View style={[styles.rowSpread, { marginBottom: 12}]}>
              <TextInput
                style={[styles.textStyle, styles.textInput]}
                onChangeText={setWorkoutName}
                onBlur={() => resetWorkoutName()}
                value={workoutName}
                maxLength={20}
              />
              <View style={styles.timerContainer}>
                <Text style={styles.timerDigit}>{
                  hours < 10 ? 0 : hours % 10
                }</Text>
                <Text style={styles.timerDigit}>{
                  hours >= 10 ? Math.floor(hours / 10) : hours
                }</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.timerDigit}>{
                  minutes >= 60 || minutes < 10 ? 0 : Math.floor(minutes / 10)
                }</Text>
                <Text style={styles.timerDigit}>{
                  minutes >= 10 ? minutes % 10 : minutes
                }</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.timerDigit}>{
                  seconds < 10 ? 0 : Math.floor(seconds / 10)
                }</Text>
                <Text style={styles.timerDigit}>{
                  seconds >= 10 ? seconds % 10 : seconds
                }</Text>
              </View>
            </View>
          }
          data={exerAndInstList}
          renderItem={({ item, index, drag, isActive }) => {
            return (
              <ScaleDecorator>
                <TouchableOpacity
                  activeOpacity={1}
                  onLongPress={drag}
                  disabled={isActive}
                  style={[
                  /*  styles.rowItem,
                    { backgroundColor: isActive ? "red" : item.backgroundColor }, */
                  ]}
                >
                  <ExerciseItemInActiveWorkout
                    exer={item.exer}
                    inst={item.inst}
                    restoredSetsArr={item?.restoredSetsArr}
                    previous={item?.firstSet?.previous}
                    heightInfo={item.heightInfo}
                    handleOnSetCompleted={handleOnSetCompleted}
                    updateNumSetsCompletedInWkt={updateNumSetsCompleted}
                    updateNumSetsInWkt={updateNumSets}
                    workoutId={workoutId}
                    removeExerFromWorkout={removeExerFromWorkout}
                    changeExerName={changeExerName}
                    flatlistRef={this.flatlistRef}
                    exerNumInList={index}
                    handleGotRowY={handleGotRowY}
                    onExerNumSetsChanged={onExerNumSetsChanged}
                    onExerNotesHeightChanged={onExerNotesHeightChanged}
                    onInstNotesHeightChanged={onInstNotesHeightChanged}
                    workoutStatus={workoutStatus}
                  />
                </TouchableOpacity>
              </ScaleDecorator>
            );
          }}
          keyExtractor={(exerAndInst) => exerAndInst.exer.name}
          ref={flatlistRef}
          onScroll={(e) => {
            console.log("onscroll")
            //this.fscrollOffset = e.nativeEvent.contentOffset.y;
            //setScrollOffset(e.nativeEvent.contentOffset.y);
            console.log("scrollOffset here");
            console.log(e.nativeEvent.contentOffset.y)
          }}
          scrollToOverflowEnabled={true}
          ListFooterComponent={
            <>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonOpen,
                  pressed && { opacity: 0.5 },
                ]}
                onPress={() => setPickExerModalVisible(true)}
              >
                <Text style={styles.textStyle}>Add Exercise</Text>
              </Pressable>
              <View style={{ flexDirection: "row", justifyContent: "center"}}>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.endWorkoutButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => endWorkout()}
                >
                  <Text style={styles.buttonTextStyle}>End Workout</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.cancelWorkoutButton,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => cancelWorkout()}
                >
                  <Text style={styles.buttonTextStyle}>Cancel Workout</Text>
                </Pressable>

              </View>
              <View style={{ marginBottom: 200}}></View>
            </>
          }
        />
      </View>
      <View>
        {pickExerModalVisible && (
          <PickExerciseForActiveWorkoutModal
            submitPickedExerciseHandler={submitPickedExerciseHandler}
            closeModal={closePickExerModal}
          />
        )}
      </View>
      {shouldShowKeyboardDismiss && (
      <View 
        style={{
          position: "absolute",
          bottom: keyboardHeight,
          right: "25%",
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
            size={40} 
            color={'rgba(255, 255, 10, 0.5)'} 
          />
        </Pressable>
      </View>)}
    </View>
  );
}

const styles = StyleSheet.create({
  rowSpread: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exerciseList: {
    flex: 1,
    minHeight: "100%",
    minWidth: "100%",
    backgroundColor: "black",
    paddingHorizontal: 9,
    paddingTop: 5,
  },
  container: {
    flex: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 20,
  },
  buttonOpen: {
    backgroundColor: Colors.pink1,
  },
  endWorkoutButton: {
    backgroundColor: "green",
    margin: 5
  },
  cancelWorkoutButton: {
    backgroundColor: Colors.red3,
    margin: 5
  },
  buttonClose: {
    backgroundColor: Colors.blue3,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  buttonTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 19,
  },
  textInput: {
    minWidth: "50%",
    maxWidth: "71%",
    textAlign: "left"
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 30,
  },
  input: {
    fontSize: 25,
    backgroundColor: Colors.gray2,
    padding: 4,
    minWidth: "78%",
    minHeight: "7%",
  },
  inputContainer: {
    backgroundColor: Colors.gray2,
    minWidth: "80%",
    height: "8%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    marginRight: 0
  },
  timerText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  timerDigit: {
    fontSize: 18,
    color: "white",
    minWidth: "4%",
    padding: 0,
    margin: 0,
    textAlign: "center",
  },
  colon: {
    fontSize: 18,
    color: "white",
    padding: 0,
    margin: 0,
    textAlign: "center",
    fontWeight: "bold",
  },
});
