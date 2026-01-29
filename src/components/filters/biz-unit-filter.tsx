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

const BIZ_UNITS = ['AJ렌터카', 'AJ카플랫', 'AJD'];

interface BizUnitFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function BizUnitFilter({ value, onChange }: BizUnitFilterProps) {
  const handleToggle = (unit: string) => {
    if (value.includes(unit)) {
      onChange(value.filter((v) => v !== unit));
    } else {
      onChange([...value, unit]);
    }
  };

  const handleSelectAll = () => {
    if (value.length === BIZ_UNITS.length) {
      onChange([]);
    } else {
      onChange(BIZ_UNITS);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10">
          사업부
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
          <div className="font-semibold text-sm">사업부</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={value.length === BIZ_UNITS.length}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="font-medium cursor-pointer">
                전체 선택
              </Label>
            </div>
            <div className="h-px bg-gray-200" />
            {BIZ_UNITS.map((unit) => (
              <div key={unit} className="flex items-center space-x-2">
                <Checkbox
                  id={`biz-${unit}`}
                  checked={value.includes(unit)}
                  onCheckedChange={() => handleToggle(unit)}
                />
                <Label htmlFor={`biz-${unit}`} className="cursor-pointer">
                  {unit}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
