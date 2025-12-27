// 레퍼런스 이미지 정보
export type ReferenceItem = {
  referenceId: number;
  nickname: string;
  userId: number;
  imageUrlList: string[];
  scrapCount: number;
};

// 레퍼런스 목록 조회 응답
export type ReferenceListResponse = {
  referenceList: ReferenceItem[];
};
