import { ChatProduct } from "@/types/chatbot";

export default function ProductCard({ product }: { product: ChatProduct }) {
  return (
    <div className="border border-primary-200 rounded-2xl p-3 flex gap-3">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1 space-y-1 text-sm text-primary-700">
        <p className="font-semibold">{product.name}</p>
        <p className="font-semibold">₩{product.price.toLocaleString()}</p>
        {product.reason && (
          <p className="text-xs text-primary-500">{product.reason}</p>
        )}
        {product.advantage && (
          <p className="text-xs text-primary-500">장점: {product.advantage}</p>
        )}
        {product.recommendedPlace && (
          <p className="text-xs text-primary-500">
            추천 공간: {product.recommendedPlace}
          </p>
        )}
      </div>
    </div>
  );
}
