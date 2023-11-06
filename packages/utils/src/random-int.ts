const randomInt = (minimum?: number, maximum?: number): number => {
  if (minimum !== undefined && maximum !== undefined) {
    // If both minimum and maximum are provided
    if (minimum > maximum) {
      [minimum, maximum] = [maximum, minimum];
    }
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  } else if (minimum !== undefined && maximum === undefined) {
    // If only minimum is provided, treat it as the maximum and default to 0 as the minimum
    return Math.floor(Math.random() * (minimum + 1));
  } else if (minimum === undefined && maximum !== undefined) {
    // If only maximum is provided, treat it as the maximum and default to 0 as the minimum
    return Math.floor(Math.random() * (maximum + 1));
  } else {
    // No parameters are provided, return any integer within the safe integer range
    const RANGE = Number.MAX_SAFE_INTEGER - Number.MIN_SAFE_INTEGER;
    return Math.floor(Math.random() * RANGE) + Number.MIN_SAFE_INTEGER;
  }
};

export default randomInt;
