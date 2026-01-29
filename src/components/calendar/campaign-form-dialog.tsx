'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { campaignSchema, type CampaignFormValues } from '@/features/campaigns/schemas';
import { extractDateFromISO, extractTimeFromISO } from '@/lib/utils/date';
import { BIZ_UNIT_LIST, CHANNEL_LIST } from '@/constants';
import type { Campaign } from '@/features/campaigns/types';

interface CampaignFormDialogProps {
  campaign?: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CampaignFormValues) => Promise<void>;
  isLoading?: boolean;
}

const REACTIONS = [
  { value: 'HIGH', label: '높음' },
  { value: 'MID', label: '중간' },
  { value: 'LOW', label: '낮음' },
];

export function CampaignFormDialog({
  campaign,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CampaignFormDialogProps) {
  const isEdit = !!campaign;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: '',
      send_at: '',
      biz_unit: '',
      channel: '',
      audience_size: 0,
      expected_reaction: 'MID',
      cs_memo: '',
    },
  });

  // 날짜/시간 별도 상태 관리
  const [sendDate, setSendDate] = useState('');
  const [sendTime, setSendTime] = useState('');

  // 사업부 복수 선택 상태
  const [selectedBizUnits, setSelectedBizUnits] = useState<string[]>([]);

  // 캠페인 데이터가 변경되면 폼 초기화
  useEffect(() => {
    if (campaign) {
      // 타임존 변환 없이 문자열에서 직접 추출
      const dateStr = extractDateFromISO(campaign.send_at);
      const timeStr = extractTimeFromISO(campaign.send_at);

      setSendDate(dateStr);
      setSendTime(timeStr);

      // 사업부 파싱 (콤마 구분)
      const bizUnits = campaign.biz_unit.split(',').map(s => s.trim()).filter(Boolean);
      setSelectedBizUnits(bizUnits);

      reset({
        title: campaign.title,
        send_at: `${dateStr}T${timeStr}`,
        biz_unit: campaign.biz_unit,
        channel: campaign.channel,
        audience_size: campaign.audience_size,
        expected_reaction: campaign.expected_reaction,
        cs_memo: campaign.cs_memo || '',
      });
    } else {
      setSendDate('');
      setSendTime('');
      setSelectedBizUnits([]);
      reset({
        title: '',
        send_at: '',
        biz_unit: '',
        channel: '',
        audience_size: 0,
        expected_reaction: 'MID',
        cs_memo: '',
      });
    }
  }, [campaign, reset]);

  // 날짜/시간이 변경되면 send_at 업데이트
  useEffect(() => {
    if (sendDate && sendTime) {
      setValue('send_at', `${sendDate}T${sendTime}`);
    }
  }, [sendDate, sendTime, setValue]);

  // 사업부 선택이 변경되면 biz_unit 업데이트
  useEffect(() => {
    setValue('biz_unit', selectedBizUnits.join(', '));
  }, [selectedBizUnits, setValue]);

  // 사업부 체크박스 토글
  const handleBizUnitToggle = (unit: string, checked: boolean) => {
    if (checked) {
      setSelectedBizUnits(prev => [...prev, unit]);
    } else {
      setSelectedBizUnits(prev => prev.filter(u => u !== unit));
    }
  };

  const handleFormSubmit = async (data: CampaignFormValues) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const channel = watch('channel');
  const expectedReaction = watch('expected_reaction');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? '캠페인 수정' : '새 캠페인 생성'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          {/* 캠페인명 */}
          <div className="space-y-2">
            <Label htmlFor="title">
              캠페인명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="캠페인명을 입력하세요"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* 발송 날짜 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="send_date">
                발송 날짜 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="send_date"
                type="date"
                value={sendDate}
                onChange={(e) => setSendDate(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* 발송 시간 */}
            <div className="space-y-2">
              <Label htmlFor="send_time">
                발송 시간 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="send_time"
                type="time"
                value={sendTime}
                onChange={(e) => setSendTime(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          {errors.send_at && (
            <p className="text-sm text-red-500">{errors.send_at.message}</p>
          )}

          {/* 사업부 (복수 선택) */}
          <div className="space-y-2">
            <Label>
              사업부 <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(복수 선택 가능)</span>
            </Label>
            <div className="grid grid-cols-3 gap-2 p-3 border rounded-md bg-gray-50">
              {BIZ_UNIT_LIST.map((unit) => (
                <label
                  key={unit}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={selectedBizUnits.includes(unit)}
                    onCheckedChange={(checked) => handleBizUnitToggle(unit, checked as boolean)}
                    disabled={isLoading}
                  />
                  {unit}
                </label>
              ))}
            </div>
            {errors.biz_unit && (
              <p className="text-sm text-red-500">{errors.biz_unit.message}</p>
            )}
          </div>

          {/* 채널 */}
          <div className="space-y-2">
            <Label htmlFor="channel">
              채널 <span className="text-red-500">*</span>
            </Label>
            <Select
              value={channel}
              onValueChange={(value) => setValue('channel', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="채널을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {CHANNEL_LIST.map((ch) => (
                  <SelectItem key={ch} value={ch}>
                    {ch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.channel && (
              <p className="text-sm text-red-500">{errors.channel.message}</p>
            )}
          </div>

          {/* 발송 규모 */}
          <div className="space-y-2">
            <Label htmlFor="audience_size">
              발송 규모 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="audience_size"
              type="number"
              {...register('audience_size', { valueAsNumber: true })}
              placeholder="발송 대상 인원 수"
              disabled={isLoading}
            />
            {errors.audience_size && (
              <p className="text-sm text-red-500">{errors.audience_size.message}</p>
            )}
          </div>

          {/* 예상 반응도 */}
          <div className="space-y-2">
            <Label htmlFor="expected_reaction">
              예상 반응도 <span className="text-red-500">*</span>
            </Label>
            <Select
              value={expectedReaction}
              onValueChange={(value) => setValue('expected_reaction', value as 'HIGH' | 'MID' | 'LOW')}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="예상 반응도를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {REACTIONS.map((reaction) => (
                  <SelectItem key={reaction.value} value={reaction.value}>
                    {reaction.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.expected_reaction && (
              <p className="text-sm text-red-500">{errors.expected_reaction.message}</p>
            )}
          </div>

          {/* CS 참고 메모 */}
          <div className="space-y-2">
            <Label htmlFor="cs_memo">CS 참고 메모</Label>
            <Textarea
              id="cs_memo"
              {...register('cs_memo')}
              placeholder="CS팀 참고용 메모를 입력하세요"
              rows={4}
              disabled={isLoading}
            />
            {errors.cs_memo && (
              <p className="text-sm text-red-500">{errors.cs_memo.message}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? '저장 중...' : isEdit ? '수정' : '생성'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
