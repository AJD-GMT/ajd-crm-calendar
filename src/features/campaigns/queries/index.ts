'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '../services';
import type { CampaignInsert, CampaignUpdate, CampaignFilters } from '../types';

export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters?: CampaignFilters) => [...campaignKeys.lists(), filters] as const,
  details: () => [...campaignKeys.all, 'detail'] as const,
  detail: (id: string) => [...campaignKeys.details(), id] as const,
};

// 캠페인 목록 조회
export function useCampaigns(filters?: CampaignFilters) {
  return useQuery({
    queryKey: campaignKeys.list(filters),
    queryFn: () => campaignService.getCampaigns(filters),
  });
}

// 캠페인 단건 조회
export function useCampaign(id: string) {
  return useQuery({
    queryKey: campaignKeys.detail(id),
    queryFn: () => campaignService.getCampaign(id),
    enabled: !!id,
  });
}

// 캠페인 생성
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaign: CampaignInsert) =>
      campaignService.createCampaign(campaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}

// 캠페인 수정
export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, campaign }: { id: string; campaign: CampaignUpdate }) =>
      campaignService.updateCampaign(id, campaign),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: campaignKeys.detail(data.id) });
      }
    },
  });
}

// 캠페인 삭제
export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignService.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}

// 캠페인 복사
export function useCopyCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newSendAt }: { id: string; newSendAt: string }) =>
      campaignService.copyCampaign(id, newSendAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
}
