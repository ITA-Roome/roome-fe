type Props = {
  content: string;
};

export default function BotMessage({ content }: Props) {
  return (
    <div className="self-start bg-[var(--color-primary-200)] text-[var(--color-primary-800)] max-w-[75%] p-3 rounded-lg mr-auto">
      {content}
    </div>
  );
}
