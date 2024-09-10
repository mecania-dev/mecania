import {
  ElementType,
  ComponentProps as ReactComponentProps,
  ComponentPropsWithoutRef as ReactComponentPropsWithoutRef
} from 'react'

import { SlotsToClasses } from '@nextui-org/react'

export type Timer = ReturnType<typeof setTimeout>

export type As<Props = any> = keyof JSX.IntrinsicElements | React.ElementType<Props>

type ExtractClassValues<T extends { [key: string]: unknown }> = T[keyof T]
export type ClassValue = ExtractClassValues<SlotsToClasses<string>>

export type Primitive = null | undefined | string | number | boolean | symbol | bigint
export type LiteralUnion<T, U> = T | (U & { _?: never })
export type LiteralIntersection<T, U> = T & (U & { _?: never })

/**
 * This utility type combines two types and omits specified keys.
 * @template T1 - The first type to be merged.
 * @template T2 - The second type to be merged.
 * @template S - An optional string literal type for keys to omit from the merged type.
 */
export type MergeTypes<T1, T2, OmitKeys extends keyof any = never> = Omit<Omit<T1, keyof T2> & T2, OmitKeys>

export type ComponentProps<T1 extends ElementType<any>, T2, OmitKeys extends keyof any = never> = MergeTypes<
  ReactComponentProps<T1>,
  T2,
  OmitKeys
>

export type ComponentPropsWithoutRef<
  T1 extends ElementType<any>,
  T2 = any,
  OmitKeys extends keyof any = never
> = MergeTypes<ReactComponentPropsWithoutRef<T1>, T2, OmitKeys>
