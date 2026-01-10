export default function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center pt-20 px-4 animate-fade-in">
      <h3 className="font-body1 text-primary-700 mb-12 text-center">
        검색어와 일치하는 내용이 없습니다.
      </h3>
      <div className="w-full max-w-[320px] self-center">
        <h4 className="font-body1 text-primary-700 mb-3">검색 TIP</h4>
        <ul className="flex flex-col gap-2 font-body3 text-primary-700 ml-4 list-disc marker:text-[#6D5A46]">
          <li>단어의 철자가 정확한지 확인해주세요.</li>
          <li>검색어의 단어수를 줄이거나 다른 검색어로 검색해보세요.</li>
          <li>보다 일반적인 단어로 다시 검색해보세요.</li>
        </ul>
      </div>
    </div>
  );
}
