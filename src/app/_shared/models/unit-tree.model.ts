import { UnitModel } from './unit.model';

/**
 * Interface for unit transfer operations
 */
export interface TransferredUnit {
  _id: string;
  name: string;
}

/**
 * Interface for unit selection results
 */
export interface UnitSelectionResult {
  selectedUnits: UnitModel[];
  selectedIds: string[];
}

/**
 * Interface for tree traversal callback functions
 */
export type UnitTreeCallback<T> = (unit: UnitModel, parent?: UnitModel) => T | null | undefined;
