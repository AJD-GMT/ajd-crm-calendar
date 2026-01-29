'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import type { Campaign } from '@/features/campaigns/types';

interface CampaignDeleteDialogProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function CampaignDeleteDialog({
  campaign,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CampaignDeleteDialogProps) {
  if (!campaign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>캠페인 삭제</DialogTitle>
              <DialogDescription>정말로 이 캠페인을 삭제하시겠습니까?</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm font-semibold text-gray-900">{campaign.title}</p>
            <p className="text-xs text-gray-600 mt-1">
              {campaign.biz_unit} / {campaign.channel}
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            삭제된 캠페인은 복구할 수 없습니다.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? '삭제 중...' : '삭제'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
