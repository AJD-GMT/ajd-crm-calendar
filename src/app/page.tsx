'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MainLayout } from '@/components/layout/main-layout';
import { CrmCalendar } from '@/components/calendar/crm-calendar';
import { CampaignDetailPanel } from '@/components/calendar/campaign-detail-panel';
import { CampaignFormDialog } from '@/components/calendar/campaign-form-dialog';
import { CampaignCopyDialog } from '@/components/calendar/campaign-copy-dialog';
import { CampaignDeleteDialog } from '@/components/calendar/campaign-delete-dialog';
import { FilterBar } from '@/components/filters/filter-bar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useFilters } from '@/features/calendar/hooks/use-filters';
import {
  useCreateCampaign,
  useUpdateCampaign,
  useCopyCampaign,
  useDeleteCampaign,
} from '@/features/campaigns/queries';
import type { Campaign } from '@/features/campaigns/types';
import type { CampaignFormValues } from '@/features/campaigns/schemas';
import { Plus } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { filters, setBizUnits, setChannels, setReactions, setSearchQuery, resetFilters } =
    useFilters();

  // 선택된 캠페인 상태
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 폼 다이얼로그 상태
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // 복사 다이얼로그 상태
  const [isCopyOpen, setIsCopyOpen] = useState(false);
  const [copyingCampaign, setCopyingCampaign] = useState<Campaign | null>(null);

  // 삭제 다이얼로그 상태
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);

  // Mutations
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const copyMutation = useCopyCampaign();
  const deleteMutation = useDeleteCampaign();

  // 캠페인 클릭 핸들러
  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailOpen(true);
  };

  // 새 캠페인 생성
  const handleCreateClick = () => {
    setEditingCampaign(null);
    setIsFormOpen(true);
  };

  // 캠페인 수정
  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };

  // 캠페인 복사
  const handleCopy = (campaign: Campaign) => {
    setCopyingCampaign(campaign);
    setIsCopyOpen(true);
    setIsDetailOpen(false);
  };

  // 캠페인 삭제
  const handleDelete = (campaign: Campaign) => {
    setDeletingCampaign(campaign);
    setIsDeleteOpen(true);
    setIsDetailOpen(false);
  };

  // 폼 제출
  const handleFormSubmit = async (data: CampaignFormValues) => {
    try {
      if (editingCampaign) {
        await updateMutation.mutateAsync({
          id: editingCampaign.id,
          campaign: data,
        });
        toast.success('캠페인이 수정되었습니다.');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('캠페인이 생성되었습니다.');
      }
      setIsFormOpen(false);
      setEditingCampaign(null);
    } catch (error) {
      console.error('캠페인 저장 실패:', error);
      toast.error('캠페인 저장에 실패했습니다.');
    }
  };

  // 복사 제출
  const handleCopySubmit = async (newSendAt: string) => {
    if (!copyingCampaign) return;
    try {
      await copyMutation.mutateAsync({
        id: copyingCampaign.id,
        newSendAt,
      });
      toast.success('캠페인이 복사되었습니다.');
      setIsCopyOpen(false);
      setCopyingCampaign(null);
    } catch (error) {
      console.error('캠페인 복사 실패:', error);
      toast.error('캠페인 복사에 실패했습니다.');
    }
  };

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!deletingCampaign) return;
    try {
      await deleteMutation.mutateAsync(deletingCampaign.id);
      toast.success('캠페인이 삭제되었습니다.');
      setIsDeleteOpen(false);
      setDeletingCampaign(null);
    } catch (error) {
      console.error('캠페인 삭제 실패:', error);
      toast.error('캠페인 삭제에 실패했습니다.');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* 상단 버튼 영역 */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">캠페인 캘린더</h1>
          {isAuthenticated && (
            <Button onClick={handleCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              새 캠페인
            </Button>
          )}
        </div>

        {/* 필터 바 */}
        <FilterBar
          bizUnits={filters.bizUnits}
          channels={filters.channels}
          reactions={filters.reactions}
          searchQuery={filters.searchQuery}
          onBizUnitsChange={setBizUnits}
          onChannelsChange={setChannels}
          onReactionsChange={setReactions}
          onSearchQueryChange={setSearchQuery}
          onReset={resetFilters}
        />

        {/* 캘린더 */}
        <CrmCalendar
          onCampaignClick={handleCampaignClick}
          filters={{
            bizUnit: filters.bizUnits,
            channel: filters.channels,
            reaction: filters.reactions,
            searchQuery: filters.searchQuery,
          }}
        />
      </div>

      {/* 상세 패널 */}
      <CampaignDetailPanel
        campaign={selectedCampaign}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEdit}
        onCopy={handleCopy}
        onDelete={handleDelete}
        isAuthenticated={isAuthenticated}
      />

      {/* 폼 다이얼로그 */}
      <CampaignFormDialog
        campaign={editingCampaign}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCampaign(null);
        }}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* 복사 다이얼로그 */}
      <CampaignCopyDialog
        campaign={copyingCampaign}
        isOpen={isCopyOpen}
        onClose={() => {
          setIsCopyOpen(false);
          setCopyingCampaign(null);
        }}
        onSubmit={handleCopySubmit}
        isLoading={copyMutation.isPending}
      />

      {/* 삭제 다이얼로그 */}
      <CampaignDeleteDialog
        campaign={deletingCampaign}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingCampaign(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </MainLayout>
  );
}
