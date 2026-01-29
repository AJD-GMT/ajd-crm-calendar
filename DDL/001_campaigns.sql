-- CRM 캘린더 캠페인 테이블
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  send_at TIMESTAMPTZ NOT NULL,
  biz_unit VARCHAR(50) NOT NULL,
  channel VARCHAR(50) NOT NULL,
  audience_size INTEGER NOT NULL DEFAULT 0,
  expected_reaction VARCHAR(10) NOT NULL DEFAULT 'MID'
    CHECK (expected_reaction IN ('HIGH', 'MID', 'LOW')),
  cs_memo TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_campaigns_send_at ON campaigns(send_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_biz_unit ON campaigns(biz_unit);

-- RLS 활성화
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- 조회: 누구나 (비로그인도 가능)
CREATE POLICY "Anyone can view campaigns"
  ON campaigns FOR SELECT
  USING (true);

-- 생성: 인증 사용자만
CREATE POLICY "Auth users can insert campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 수정: 인증 사용자만
CREATE POLICY "Auth users can update campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- 삭제: 인증 사용자만
CREATE POLICY "Auth users can delete campaigns"
  ON campaigns FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 컬럼 코멘트
COMMENT ON TABLE campaigns IS 'CRM 발송 캠페인 일정';
COMMENT ON COLUMN campaigns.id IS '고유 식별자';
COMMENT ON COLUMN campaigns.title IS '캠페인명';
COMMENT ON COLUMN campaigns.send_at IS '발송 일시';
COMMENT ON COLUMN campaigns.biz_unit IS '사업부 (인터넷/렌탈/모바일/이사/상조/공통)';
COMMENT ON COLUMN campaigns.channel IS '발송 채널 (알림톡/친구톡/SMS/이메일)';
COMMENT ON COLUMN campaigns.audience_size IS '발송 대상 수';
COMMENT ON COLUMN campaigns.expected_reaction IS '예상 반응도 (HIGH/MID/LOW)';
COMMENT ON COLUMN campaigns.cs_memo IS 'CS 참고 메모';
COMMENT ON COLUMN campaigns.created_by IS '생성자 ID';
COMMENT ON COLUMN campaigns.created_at IS '생성일시';
COMMENT ON COLUMN campaigns.updated_at IS '수정일시';
