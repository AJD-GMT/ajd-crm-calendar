'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const REACTIONS = [
  { value: 'HIGH', label: '높음' },
  { value: 'MID', label: '중간' },
  { value: 'LOW', label: '낮음' },
];

interface ReactionFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ReactionFilter({ value, onChange }: ReactionFilterProps) {
  const handleToggle = (reaction: string) => {
    if (value.includes(reaction)) {
      onChange(value.filter((v) => v !== reaction));
    } else {
      onChange([...value, reaction]);
    }
  };

  const handleSelectAll = () => {
    if (value.length === REACTIONS.length) {
      onChange([]);
    } else {
      onChange(REACTIONS.map((r) => r.value));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10">
          예상 반응도
          {value.length > 0 && (
            <span className="ml-1 rounded-full bg-gray-900 text-white text-xs px-2 py-0.5">
              {value.length}
            </span>
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start">
        <div className="space-y-3">
          <div className="font-semibold text-sm">예상 반응도</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all-reaction"
                checked={value.length === REACTIONS.length}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all-reaction" className="font-medium cursor-pointer">
                전체 선택
              </Label>
            </div>
            <div className="h-px bg-gray-200" />
            {REACTIONS.map((reaction) => (
              <div key={reaction.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`reaction-${reaction.value}`}
                  checked={value.includes(reaction.value)}
                  onCheckedChange={() => handleToggle(reaction.value)}
                />
                <Label htmlFor={`reaction-${reaction.value}`} className="cursor-pointer">
                  {reaction.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
