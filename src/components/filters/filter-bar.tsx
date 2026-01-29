'use client';

import { Button } from '@/components/ui/button';
import { SearchInput } from './search-input';
import { BizUnitFilter } from './biz-unit-filter';
import { ChannelFilter } from './channel-filter';
import { ReactionFilter } from './reaction-filter';
import { X } from 'lucide-react';

interface FilterBarProps {
  bizUnits: string[];
  channels: string[];
  reactions: string[];
  searchQuery: string;
  onBizUnitsChange: (value: string[]) => void;
  onChannelsChange: (value: string[]) => void;
  onReactionsChange: (value: string[]) => void;
  onSearchQueryChange: (value: string) => void;
  onReset: () => void;
}

export function FilterBar({
  bizUnits,
  channels,
  reactions,
  searchQuery,
  onBizUnitsChange,
  onChannelsChange,
  onReactionsChange,
  onSearchQueryChange,
  onReset,
}: FilterBarProps) {
  const hasActiveFilters =
    bizUnits.length > 0 ||
    channels.length > 0 ||
    reactions.length > 0 ||
    searchQuery.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* 검색 */}
          <div className="flex-1 min-w-[200px]">
            <SearchInput
              value={searchQuery}
              onChange={onSearchQueryChange}
              placeholder="캠페인명 검색..."
            />
          </div>

          {/* 필터들 */}
          <BizUnitFilter value={bizUnits} onChange={onBizUnitsChange} />
          <ChannelFilter value={channels} onChange={onChannelsChange} />
          <ReactionFilter value={reactions} onChange={onReactionsChange} />

          {/* 초기화 버튼 */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4 mr-1" />
              초기화
            </Button>
          )}
        </div>

        {/* 활성 필터 요약 */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>활성 필터:</span>
            {bizUnits.length > 0 && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                사업부 {bizUnits.length}개
              </span>
            )}
            {channels.length > 0 && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                채널 {channels.length}개
              </span>
            )}
            {reactions.length > 0 && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                반응도 {reactions.length}개
              </span>
            )}
            {searchQuery && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                검색: {searchQuery}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
