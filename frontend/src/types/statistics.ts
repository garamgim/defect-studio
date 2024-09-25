// 통계와 관련된 모든 Type 정의

// 도구 목록
export type UseType = 'text_to_image' | 'remove_background' | 'inpainting' | 'clip' | 'clean_up' | 'image_to_image';
// 날짜 구간 검색
export interface durationSearchProps {
  start_date?: string;
  end_date?: string;
}

// --------------------------------------------------------------------

// 일별 이미지 수 - 일별 생성한 이미지 총 수
export interface DailyImageCount {
  create_date: string;
  image_quantity: number;
}

// 도구별 사용 빈도
export interface ToolFrequency {
  use_type: UseType;
  usage: number;
}

// 모델 별 사용 빈도
export interface ModelFrequency {
  model: string;
  usage: number;
}

// 토큰 실제 사용 현황
export interface TokenUsage {
  use_date: string;
  use_type: UseType;
  token_quantity: number;
}

// --------------------------------------------------------------------

// 부서 내 사용자 별 이미지 생성 수
export interface MemberImageCount {
  member_id: number;
  member_name: string;
  image_quantity: number;
}

// 부서 내에서 토큰 분배
export interface TokenDistribution {
  distribute_date: string;
  token_quantity: number;
}

// 부서 내 사용자별 토큰 사용 현황
export interface DepartmentMemberTokenUsage {
  member_id: number;
  member_name: string;
  token_quantity: number;
}
