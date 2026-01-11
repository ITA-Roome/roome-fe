type Props = {
  content: string;
};

export default function UserMessage({ content }: Props) {
  return (
    <div className="flex justify-end">
      <div className="self-end inline-flex bg-primary-700 text-white max-w-[75%] p-3 rounded-2xl ml-auto whitespace-pre-wrap break-words">
        {content}
      </div>
    </div>
  );
}
