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
