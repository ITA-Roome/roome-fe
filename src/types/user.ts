export type OnboardingPayload = {
  ageGroup: string;
  gender: string;
  moodType: string;
  spaceType: string;
};

export type OnboardingExistenceResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  success?: boolean;
  data?: {
    isExist?: boolean;
    exists?: boolean;
    hasOnboardingInformation: boolean;
  };
};

export type ProductTag = {
  id: number;
  type: string;
  name: string;
};

export type UserScrapProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  productUrl: string;
  thumbnailKey: string;
  imageList: string[];
  tagList: ProductTag[];
  likeCount: number;
  scrapCount: number;
  isLiked: boolean;
  isScrapped: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserScrapProductResponse = {
  userScrapProductList: UserScrapProduct[];
};

export type UserScrapReference = {
  referenceId: number;
  nickname: string;
  userId: number;
  imageUrlList: string[];
  scrapCount: number;
  likeCount: number;
  isScrapped: boolean;
  isLiked: boolean;
};

export type UserScrapReferenceResponse = {
  userScrapReferenceList: UserScrapReference[];
};

export type UserProfile = {
  userId: number;
  profileImage: string;
  nickname: string;
  signUpDate: string; // 서버에서 yyyy-mm-dd 로 내려오므로 string 유지
  phoneNumber: string;
  email: string;
};

// 유저가 업로드한 레퍼런스 1개
export type UserUploadedReference = {
  referenceId: number;
  name: string;
  nickname: string;
  userId: number;
  imageUrlList: string[];
  scrapCount: number;
  likeCount: number;
  isScrapped: boolean;
  isLiked: boolean;
};

// 유저 업로드 레퍼런스 리스트 응답
export type UserUploadedReferenceResponse = {
  userUploadedReferenceList: UserUploadedReference[];
};
