// lib/internals/cn.ts
import clsx, { type ClassValue } from 'clsx'; // Import ClassValue para tipado
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de CSS con clsx y las fusiona con tailwind-merge.
 * Esta es una utilidad interna y no debe ser importada directamente por los
 * consumidores de la librería.
 * @internal
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}