import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import ImageUploadIcon from "@/assets/icons/image_upload.svg?react";
import { RegisteredProduct } from "@/types/product";
import ProductRegistration from "./ProductRegistration";
import { ReferenceApi } from "@/api/reference";
import ReferenceUploadSuccess from "./ReferenceUploadSuccess";
import { compressImage } from "@/utils/imageCompression";
import { MOOD_MAP, MOOD_TAGS } from "@/constants/common";

export default function ReferenceUploadPage() {
  const navigate = useNavigate();

  const [moodOpen, setMoodOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!image) {
      setImageUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(image);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const [isRegisteringProduct, setIsRegisteringProduct] = useState(false);
  const [products, setProducts] = useState<RegisteredProduct[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const productsRef = useRef<RegisteredProduct[]>(products);
  productsRef.current = products;

  useEffect(() => {
    return () => {
      productsRef.current.forEach((product) => {
        if (product.imageUrl) {
          URL.revokeObjectURL(product.imageUrl);
        }
      });
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleProductRegister = (product: RegisteredProduct) => {
    setProducts((prev) => [...prev, product]);
    setIsRegisteringProduct(false);
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("제품을 삭제하시겠습니까?")) {
      const productToDelete = products.find((p) => p.id === id);
      if (productToDelete?.imageUrl) {
        URL.revokeObjectURL(productToDelete.imageUrl);
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleUpload = async () => {
    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!image) {
      alert("사진을 업로드해주세요.");
      return;
    }

    try {
      const compressedImage = await compressImage(image);
      const formData = new FormData();

      formData.append("file", compressedImage);
      formData.append("name", title);
      formData.append("description", description);

      if (selectedMood) {
        formData.append("mood", MOOD_MAP[selectedMood]);
      }

      await ReferenceApi.createReference(formData);

      setUploadSuccess(true);
    } catch (error) {
      console.error(error);
      alert("업로드에 실패했습니다.");
    }
  };

  if (uploadSuccess) {
    return <ReferenceUploadSuccess onFinish={() => navigate("/feed")} />;
  }

  if (isRegisteringProduct) {
    return (
      <ProductRegistration
        onClose={() => setIsRegisteringProduct(false)}
        onRegister={handleProductRegister}
      />
    );
  }

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      <header className="shrink-0 flex items-center justify-center px-6 h-16 z-50">
        <button onClick={() => navigate(-1)} className="absolute left-2 p-2">
          <ArrowLeftIcon className="w-4.5 h-4.5 text-primary-700" />
        </button>
        <h1 className=" font-heading1 text-primary-700">레퍼런스 업로드하기</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 font-body3 text-primary-700 pb-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-start gap-2">
            <label className="w-[90px] pt-[14px] font-body3 text-primary-700 shrink-0">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              className="flex-1 h-[52px] px-4 rounded-[8px] border border-[#6D5A46] font-body3 text-primary-700 placeholder:text-[#AFAFAF] outline-none focus:border-[#FFC800] bg-white"
            />
          </div>

          <div className="flex items-start gap-2">
            <label className="w-[90px] pt-[14px] font-body3 text-primary-700 shrink-0">
              레퍼런스 설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="레퍼런스 설명을 입력해주세요"
              className="flex-1 h-[140px] p-4 rounded-[8px] border border-[#6D5A46] font-body3 text-primary-700 placeholder:text-[#AFAFAF] outline-none focus:border-[#FFC800] resize-none bg-white"
            />
          </div>

          <div className="flex items-start gap-2 relative z-20">
            <label className="w-[90px] pt-[14px] font-body3 text-primary-700 shrink-0">
              무드 태그
            </label>
            <div className="flex-1 relative">
              <button
                onClick={() => setMoodOpen(!moodOpen)}
                className={`w-full h-[52px] px-4 rounded-[8px] border ${
                  moodOpen ? "border-[#FFC800]" : "border-[#6D5A46]"
                } flex items-center justify-between bg-white outline-none font-body3`}
              >
                <span
                  className={
                    selectedMood ? "text-primary-700" : "text-[#AFAFAF]"
                  }
                >
                  {selectedMood || "선택 안함"}
                </span>
                {moodOpen ? (
                  <ArrowUpIcon className="w-5 h-5 text-[#424242]" />
                ) : (
                  <ArrowDownIcon className="w-5 h-5 text-[#424242]" />
                )}
              </button>

              {moodOpen && (
                <div className="absolute top-[60px] left-0 w-full bg-white rounded-[12px] border border-[#6D5A46] shadow-md overflow-hidden py-2">
                  {MOOD_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedMood(tag);
                        setMoodOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left font-body3 text-primary-700 hover:bg-[#FFF8E1] transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <label className="w-[90px] pt-[14px] font-body3 text-primary-700 shrink-0">
              사진 업로드
            </label>
            <div className="flex-1 min-h-[140px] rounded-[8px] border border-[#6D5A46] flex flex-col items-center justify-center bg-white overflow-hidden relative">
              {image ? (
                <div className="w-full h-full relative group">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                    <button
                      onClick={() => setImage(null)}
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
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center">
                      <ImageUploadIcon className="w-[30px] h-auto" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-end -mt-6">
            <span className="w-[calc(100%-100px)] text-[11px] text-[#AFAFAF] pl-1">
              사진 업로드 (한 장만 가능)
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <h3 className="font-body3 text-primary-700">사용된 제품 보기</h3>
            {products.length === 0 ? (
              <div className="w-full h-[80px] rounded-[8px] border border-dashed border-[#AFAFAF] flex items-center justify-center text-[#AFAFAF] text-[13px]">
                등록된 제품이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="relative aspect-[3/4] rounded-[8px] overflow-hidden bg-gray-100 group border border-gray-200"
                  >
                    {prod.imageUrl ? (
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white z-10"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 w-full bg-black/50 px-2 py-1">
                      <p className="text-[10px] text-white truncate text-center">
                        {prod.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-3">
            <button
              onClick={() => setIsRegisteringProduct(true)}
              className="w-full h-[50px] rounded-full bg-[#D6CDC7] font-body2 text-white"
            >
              제품 등록하기
            </button>
            <button
              onClick={handleUpload}
              className="w-full h-[50px] rounded-full bg-[#FFC800] font-body2 text-primary-700"
            >
              업로드 하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
