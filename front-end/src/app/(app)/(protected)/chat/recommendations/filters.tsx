import { useState } from 'react'
import { LuFilter, LuX } from 'react-icons/lu'

import { Button } from '@/components/button'
import { SearchInput } from '@/components/input/search'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { Checkbox, CheckboxGroup, Skeleton, Slider, tv } from '@nextui-org/react'
import { random, range } from 'lodash'

import { useChat } from '../use-chat'

interface ChatRecommendationsFiltersProps {
  className?: string
}

const filtersClasses = tv({
  base: 'flex gap-3 px-6'
})

export function ChatRecommendationsFilters({ className }: ChatRecommendationsFiltersProps) {
  const cities = useSWRCustom<string[]>('addresses/cities')
  const { recommendations: recs } = useChat()
  const { searchQuery, setSearchQuery, filters, setFilters, isFilterOpen, setIsFilterOpen } = recs
  const [isFilterOpenComplete, setIsFilterOpenComplete] = useState(false)
  const Filter = isFilterOpen ? LuX : LuFilter

  function toggleFilter() {
    setIsFilterOpen(!isFilterOpen)
    setIsFilterOpenComplete(false)
  }

  function onTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (e.propertyName === 'bottom') {
      setIsFilterOpenComplete(isFilterOpen)
    }
  }

  function onRatingsChange(value: number | number[]) {
    const values = typeof value === 'number' ? [0, value] : value
    setFilters(prev => ({ ...prev, ratings: { min: values[0], max: values[1] } }))
  }

  function onDistancesChange(value: number | number[]) {
    const values = typeof value === 'number' ? [0, value] : value
    setFilters(prev => ({ ...prev, distance: { min: values[0], max: values[1] } }))
  }

  function onCitiesChange(value: string[]) {
    setFilters(prev => ({ ...prev, cities: value }))
  }

  return (
    <div className={filtersClasses({ className })}>
      <SearchInput placeholder="Buscar por nome..." value={searchQuery} onValueChange={setSearchQuery} />
      <Button
        color="default"
        className="z-30 bg-default-100 p-2.5 hover:bg-default-200"
        onPress={toggleFilter}
        isIconOnly
      >
        <Filter className="h-full w-full" />
      </Button>
      <div
        data-open={isFilterOpen}
        data-open-complete={isFilterOpenComplete}
        className="absolute inset-x-0 bottom-full top-0 z-20 space-y-6 overflow-hidden rounded-large bg-white transition-[bottom_0.8s_ease] data-[open=true]:bottom-0 data-[open-complete=true]:overflow-auto data-[open=true]:pl-6 data-[open=true]:pr-[5rem] dark:bg-default-50"
        onTransitionEnd={onTransitionEnd}
      >
        <Slider
          label="Avaliação"
          value={[filters.ratings.min, filters.ratings.max]}
          step={0.5}
          minValue={0}
          maxValue={5}
          showSteps={true}
          className="max-w-md"
          onChange={onRatingsChange}
        />
        <Slider
          label="Distância"
          value={[filters.distance.min, filters.distance.max]}
          getValue={distance => `${typeof distance === 'number' ? distance : distance.join('-')} km`}
          step={1}
          minValue={0}
          maxValue={10}
          showSteps={true}
          className="max-w-md"
          onChange={onDistancesChange}
        />
        <CheckboxGroup label="Cidades" value={filters.cities} onChange={onCitiesChange}>
          {!cities.state.isLoading && !cities.state.data?.length && (
            <p className="text-default-400">Nenhuma cidade encontrada</p>
          )}
          {cities.state.isLoading &&
            range(10).map(i => (
              <Checkbox key={i} isReadOnly>
                <Skeleton className="w- h-5 rounded-md">{range(random(12, 16)).map(i => i)}</Skeleton>
              </Checkbox>
            ))}
          {cities.state.data?.map(city => (
            <Checkbox value={city} key={city}>
              {city}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    </div>
  )
}
