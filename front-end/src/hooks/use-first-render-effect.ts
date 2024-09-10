import { EffectCallback, useEffect } from 'react'

export function useFirstRenderEffect(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
