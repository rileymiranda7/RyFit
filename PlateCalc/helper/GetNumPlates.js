/**
 * returns {
 * numFortyFives: num,
 * numThirtyFives: num,
 * numTwentyFives: num,
 * numTens: num,
 * numFives: num,
 * numTwoPointFives: num
 * }
 */
export default function getNumPlates(totalWeight, useThirtyFives, barbellMode) {
  let num45s = 0;
  let num35s = 0;
  let num25s = 0;
  let num10s = 0;
  let num5s = 0;
  let numTwoPointFives = 0;

  if (totalWeight == 0) {
    return {
      numFortyFives: num45s,
      numThirtyFives: num35s,
      numTwentyFives: num25s,
      numTens: num10s,
      numFives: num5s,
      numTwoPointFives: numTwoPointFives,
    };
  }

  let plateWeight = barbellMode ? (totalWeight - 45) / 2 : totalWeight;
  if (plateWeight == 0) {
    // just bar or no weight
    return {
      numFortyFives: num45s,
      numThirtyFives: num35s,
      numTwentyFives: num25s,
      numTens: num10s,
      numFives: num5s,
      numTwoPointFives: numTwoPointFives,
    };
  }

  if (barbellMode) {
    if (plateWeight > 477.5) {
      plateWeight = 477.5;
    }
  } else {
    if (plateWeight > 500) {
      plateWeight = 500;
    }
  }

  num45s = Math.floor(plateWeight / 45);
  plateWeight = plateWeight % 45;

  if (plateWeight == 0) {
    return {
      numFortyFives: num45s,
      numThirtyFives: num35s,
      numTwentyFives: num25s,
      numTens: num10s,
      numFives: num5s,
      numTwoPointFives: numTwoPointFives,
    };
  }

  if (useThirtyFives) {
    num35s = Math.floor(plateWeight / 35);
    plateWeight = plateWeight % 35;

    if (plateWeight == 0) {
      return {
        numFortyFives: num45s,
        numThirtyFives: num35s,
        numTwentyFives: num25s,
        numTens: num10s,
        numFives: num5s,
        numTwoPointFives: numTwoPointFives,
      };
    }
  }

  num25s = Math.floor(plateWeight / 25);
  plateWeight = plateWeight % 25;

  if (plateWeight == 0) {
    return {
      numFortyFives: num45s,
      numThirtyFives: num35s,
      numTwentyFives: num25s,
      numTens: num10s,
      numFives: num5s,
      numTwoPointFives: numTwoPointFives,
    };
  }

  num10s = Math.floor(plateWeight / 10);
  plateWeight = plateWeight % 10;

  if (plateWeight == 0) {
    return {
      numFortyFives: num45s,
      numThirtyFives: num35s,
      numTwentyFives: num25s,
      numTens: num10s,
      numFives: num5s,
      numTwoPointFives: numTwoPointFives,
    };
  }

  num5s = Math.floor(plateWeight / 5);
  plateWeight = plateWeight % 5;

  if (plateWeight == 0) {
    return {
      numFortyFives: num45s,
      numThirtyFives: num35s,
      numTwentyFives: num25s,
      numTens: num10s,
      numFives: num5s,
      numTwoPointFives: numTwoPointFives,
    };
  }

  numTwoPointFives = Math.floor(plateWeight / 2.5);
  return {
    numFortyFives: num45s,
    numThirtyFives: num35s,
    numTwentyFives: num25s,
    numTens: num10s,
    numFives: num5s,
    numTwoPointFives: numTwoPointFives,
  };
}
