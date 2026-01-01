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

export type UserLikeProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  productUrl: string;
  thumbnailKey: string;
  imageList: string[];
  tagList: ProductTag[];
  createdAt: string;
  updatedAt: string;
};

export type UserLikeProductResponse = {
  userLikeProductList: UserLikeProduct[];
};

export type UserLikeReference = {
  referenceId: number;
  nickname: string;
  userId: number;
  imageUrlList: string[];
  scrapCount: number;
};

export type UserLikeReferenceResponse = {
  userLikeReferenceList: UserLikeReference[];
};

export type UserProfile = {
  userId: number;
  profileImage: string;
  nickname: string;
  signUpDate: string; // 서버에서 yyyy-mm-dd 로 내려오므로 string 유지
  phoneNumber: string;
  email: string;
};
