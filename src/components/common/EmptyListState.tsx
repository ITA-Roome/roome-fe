import React from "react";

interface EmptyListStateProps {
  message?: string;
}

export default function EmptyListState({
  message = "등록된 내용이 없습니다.",
}: EmptyListStateProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-20 px-4 animate-fade-in">
      <h3 className="font-body1 text-primary-700 text-center">{message}</h3>
    </div>
  );
}
