import { INPUT_LIMITS, InputLimitsKey } from "@/lib/inputLimits";
import { useCallback } from "react";
// import { CHAR_LIMITS, InputLimitsKey } from "@/lib/limits";

export function useInputLimits(key: InputLimitsKey) {
  const max = INPUT_LIMITS[key];

  const enforce = useCallback(
    (value: string) => {
      return value.length > max ? value.slice(0, max) : value;
    },
    [max]
  );

  return {
    max,
    enforce,
  };
}
