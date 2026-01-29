'use client';

import { useState } from 'react';

export interface FilterState {
  bizUnits: string[];
  channels: string[];
  reactions: string[];
  searchQuery: string;
}

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>({
    bizUnits: [],
    channels: [],
    reactions: [],
    searchQuery: '',
  });

  const setBizUnits = (bizUnits: string[]) => {
    setFilters((prev) => ({ ...prev, bizUnits }));
  };

  const setChannels = (channels: string[]) => {
    setFilters((prev) => ({ ...prev, channels }));
  };

  const setReactions = (reactions: string[]) => {
    setFilters((prev) => ({ ...prev, reactions }));
  };

  const setSearchQuery = (searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  };

  const resetFilters = () => {
    setFilters({
      bizUnits: [],
      channels: [],
      reactions: [],
      searchQuery: '',
    });
  };

  return {
    filters,
    setBizUnits,
    setChannels,
    setReactions,
    setSearchQuery,
    resetFilters,
  };
}
