import { useState, useEffect } from "react";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";
import ImageUploadIcon from "@/assets/icons/image_upload.svg?react";
import { RegisteredProduct } from "@/types/product";

interface Props {
  onClose: () => void;
  onRegister: (product: RegisteredProduct) => void;
}

export default function ProductRegistration({ onClose, onRegister }: Props) {
  const [regImage, setRegImage] = useState<File | null>(null);
  const [regName, setRegName] = useState("");
  const [regBrand, setRegBrand] = useState("");
  const [regTags, setRegTags] = useState("");
  const [regUrl, setRegUrl] = useState("");
  const [regImageUrl, setRegImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!regImage) {
      setRegImageUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(regImage);
    setRegImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [regImage]);

  const handleRegImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRegImage(e.target.files[0]);
    }
  };

  const handleRegisterProduct = () => {
    if (!regName) {
      alert("제품 명을 입력해주세요.");
      return;
    }
    const persistentImageUrl = regImage
      ? URL.createObjectURL(regImage)
      : undefined;

    const newProduct: RegisteredProduct = {
      id: Date.now(),
      image: regImage,
      imageUrl: persistentImageUrl,
      name: regName,
      brand: regBrand,
      tags: regTags,
      url: regUrl,
    };
    onRegister(newProduct);
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      <header className="shrink-0 flex items-center justify-center px-6 h-16 bg-white">
        <button onClick={onClose} className="absolute left-2 p-2">
          <ArrowLeftIcon className="w-[18px] h-[18px] text-gray-900" />
        </button>
        <h1 className="font-heading1 text-primary-700">제품 등록하기</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-10 font-body3 text-primary-700">
        <div className="flex flex-col gap-7">
          <div className="w-full h-[200px] rounded-[16px] border border-primary-700 flex flex-col items-center justify-center bg-white overflow-hidden relative">
            {regImage ? (
              <div className="w-full h-full relative group">
                <img
                  src={regImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                  <button
                    onClick={() => setRegImage(null)}
                    className="text-white text-sm bg-black/50 px-3 py-1 rounded"
                  >
                    제거
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleRegImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                  <ImageUploadIcon className="w-[42px] h-[32px]" />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-start -mt-6">
            <span className="text-[11px] text-[#AFAFAF]">
              사진 업로드 (한 장만 가능)
            </span>
          </div>

          <div className="flex items-start gap-2">
            <label className="w-[70px] pt-[14px] font-body3 text-primary-700 shrink-0">
              제품 명
            </label>
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="제품 명을 입력해주세요"
              className="flex-1 h-[50px] px-4 rounded-[8px] border border-primary-700 font-body3 text-primary-700 placeholder:text-[#AFAFAF] outline-none focus:border-[#FFC800] bg-white"
            />
          </div>
          <div className="flex items-start gap-2">
            <label className="w-[70px] pt-[14px] font-body3 text-primary-700 shrink-0">
              브랜드 명
            </label>
            <textarea
              value={regBrand}
              onChange={(e) => setRegBrand(e.target.value)}
              placeholder="브랜드 명을 입력해주세요"
              className="flex-1 h-[140px] p-4 rounded-[8px] border border-primary-700 font-body3 text-primary-700 placeholder:text-[#AFAFAF] outline-none focus:border-[#FFC800] resize-none bg-white"
            />
          </div>
          <div className="flex items-start gap-2">
            <label className="w-[70px] pt-[14px] font-body3 text-primary-700 shrink-0">
              제품 태그
            </label>
            <input
              type="text"
              value={regTags}
              onChange={(e) => setRegTags(e.target.value)}
              placeholder="태그를 입력해주세요"
              className="flex-1 h-[50px] px-4 rounded-[8px] border border-primary-700 font-body3 text-primary-700 placeholder:text-[#AFAFAF] outline-none focus:border-[#FFC800] bg-white"
            />
          </div>
          <div className="flex items-start gap-2">
            <label className="w-[70px] pt-[14px] font-body3 text-primary-700 shrink-0">
              제품 URL
            </label>
            <input
              type="text"
              value={regUrl}
              onChange={(e) => setRegUrl(e.target.value)}
              placeholder="제품 URL을 입력해주세요"
              className="flex-1 h-[50px] px-4 rounded-[8px] border border-primary-700 font-body3 text-primary-700 placeholder:text-[#AFAFAF] outline-none focus:border-[#FFC800] bg-white"
            />
          </div>
          <div>
            <button
              onClick={handleRegisterProduct}
              className="w-full h-[50px] rounded-full bg-[#FFC800] font-body2 text-primary-700"
            >
              상품 등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
