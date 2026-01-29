import { z } from 'zod';

export const campaignSchema = z.object({
  title: z
    .string()
    .min(1, '캠페인명을 입력해주세요')
    .max(200, '캠페인명은 200자 이내로 입력해주세요'),
  send_at: z.string().min(1, '발송 일시를 선택해주세요'),
  biz_unit: z.string().min(1, '사업부를 선택해주세요'),
  channel: z.string().min(1, '발송 채널을 선택해주세요'),
  audience_size: z
    .number()
    .int('정수를 입력해주세요')
    .min(0, '0 이상의 숫자를 입력해주세요'),
  expected_reaction: z.enum(['HIGH', 'MID', 'LOW'], {
    message: '예상 반응도를 선택해주세요',
  }),
  send_message: z.string().optional(),
  cs_memo: z.string().optional(),
});

export type CampaignFormValues = z.infer<typeof campaignSchema>;
