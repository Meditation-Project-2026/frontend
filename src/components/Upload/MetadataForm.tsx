interface MetadataFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

const MetadataForm: React.FC<MetadataFormProps> = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="content-title" className="block text-xs font-semibold text-gray-400 mb-2">
          제목
        </label>
        <input
          id="content-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="예: 10분 아침 명상"
          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-accent
                     placeholder:text-gray-400 outline-none focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="content-description" className="block text-xs font-semibold text-gray-400 mb-2">
          설명 및 태그
        </label>
        <textarea
          id="content-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="내용에 대한 간단한 설명과 #태그 를 입력해주세요."
          rows={3}
          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-accent
                     placeholder:text-gray-400 outline-none resize-none focus:border-primary"
        />
      </div>
    </div>
  );
};

export default MetadataForm;
