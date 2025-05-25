import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to convert an array of objects to a comma-separated string
 * Can extract a specific property from each object in the array
 */
@Pipe({
  name: 'arrayToString'
})
export class ArrayToStringPipe implements PipeTransform {
  /**
   * Transform an array of objects to a string
   * @param value The array to transform
   * @param property The property to extract from each item (optional)
   * @param separator The separator to use between items (default: ', ')
   * @returns A string representation of the array
   */
  transform(value: any[], property?: string, separator: string = ', '): string {
    if (!value || !Array.isArray(value) || value.length === 0) {
      return '';
    }

    // If a property is specified, extract that property from each item
    if (property) {
      return value
        .filter(item => item && item[property])
        .map(item => item[property])
        .join(separator);
    }

    // Otherwise, convert each item to string directly
    return value.join(separator);
  }
}
