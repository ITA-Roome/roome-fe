type Props = {
  content: string;
};

export default function UserMessage({ content }: Props) {
  return (
    <div className="self-end bg-primary-700 text-white max-w-[75%] p-3 rounded-lg ml-auto">
      {content}
    </div>
  );
}
