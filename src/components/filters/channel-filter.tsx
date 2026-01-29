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

const CHANNELS = ['카카오톡', 'SMS', '이메일', '푸시', 'LMS'];

interface ChannelFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ChannelFilter({ value, onChange }: ChannelFilterProps) {
  const handleToggle = (channel: string) => {
    if (value.includes(channel)) {
      onChange(value.filter((v) => v !== channel));
    } else {
      onChange([...value, channel]);
    }
  };

  const handleSelectAll = () => {
    if (value.length === CHANNELS.length) {
      onChange([]);
    } else {
      onChange(CHANNELS);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10">
          채널
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
          <div className="font-semibold text-sm">채널</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all-channel"
                checked={value.length === CHANNELS.length}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all-channel" className="font-medium cursor-pointer">
                전체 선택
              </Label>
            </div>
            <div className="h-px bg-gray-200" />
            {CHANNELS.map((channel) => (
              <div key={channel} className="flex items-center space-x-2">
                <Checkbox
                  id={`channel-${channel}`}
                  checked={value.includes(channel)}
                  onCheckedChange={() => handleToggle(channel)}
                />
                <Label htmlFor={`channel-${channel}`} className="cursor-pointer">
                  {channel}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
