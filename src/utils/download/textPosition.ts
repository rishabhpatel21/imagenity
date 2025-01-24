import { TextElement } from '../../types';

const TEXT_VERTICAL_OFFSET = 5; // Adjust this value to move text up/down

export function adjustTextPosition(y: number): number {
  return y + TEXT_VERTICAL_OFFSET;
}