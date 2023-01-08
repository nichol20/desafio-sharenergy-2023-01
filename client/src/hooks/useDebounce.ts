import { useEffect, useState } from "react";
import { UseDebounce } from "../types/hooks";

export const useDebounce: UseDebounce = (value, delay) => {
  const [ debouncedValue, setDebouncedValue ] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [value])

  return debouncedValue
}