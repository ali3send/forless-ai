export type StateUpdater<T> = (value: T | ((prev: T) => T)) => void;
