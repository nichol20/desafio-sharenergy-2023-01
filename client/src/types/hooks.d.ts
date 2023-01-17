import { AxiosInstance } from "axios"

export type UseDebounce = <T>(value: T, delay: number) => T
export type UseHttpPrivate = () => AxiosInstance