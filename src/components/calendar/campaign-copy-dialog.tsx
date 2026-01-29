'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Campaign } from '@/features/campaigns/types';

const copySchema = z.object({
  send_date: z.string().min(1, '발송 날짜를 선택해주세요'),
  send_time: z.string().min(1, '발송 시간을 선택해주세요'),
});

type CopyFormValues = z.infer<typeof copySchema>;

interface CampaignCopyDialogProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sendAt: string) => Promise<void>;
  isLoading?: boolean;
}

export function CampaignCopyDialog({
  campaign,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CampaignCopyDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CopyFormValues>({
    resolver: zodResolver(copySchema),
  });

  const handleFormSubmit = async (data: CopyFormValues) => {
    const sendAt = `${data.send_date}T${data.send_time}:00`;
    await onSubmit(sendAt);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!campaign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>캠페인 복사</DialogTitle>
          <DialogDescription>
            기존 캠페인 정보를 복사하여 새로운 캠페인을 생성합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 기존 캠페인 정보 */}
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <h4 className="font-medium text-sm text-gray-700">복사할 캠페인</h4>
            <p className="text-sm font-semibold">{campaign.title}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span className="font-medium">사업부:</span> {campaign.biz_unit}
              </div>
              <div>
                <span className="font-medium">채널:</span> {campaign.channel}
              </div>
              <div>
                <span className="font-medium">발송 규모:</span>{' '}
                {campaign.audience_size.toLocaleString()}명
              </div>
              <div>
                <span className="font-medium">예상 반응도:</span>{' '}
                {campaign.expected_reaction}
              </div>
            </div>
          </div>

          {/* 새 발송 일시 입력 */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="send_date">
                  새 발송 날짜 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="send_date"
                  type="date"
                  {...register('send_date')}
                  disabled={isLoading}
                />
                {errors.send_date && (
                  <p className="text-sm text-red-500">{errors.send_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="send_time">
                  새 발송 시간 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="send_time"
                  type="time"
                  {...register('send_time')}
                  disabled={isLoading}
                />
                {errors.send_time && (
                  <p className="text-sm text-red-500">{errors.send_time.message}</p>
                )}
              </div>
            </div>

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
                {isLoading ? '복사 중...' : '복사'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
