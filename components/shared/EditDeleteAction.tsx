"use client";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";


interface Props {
  type: string;
  itemId: string;
}
const EditDeleteAction = ({ type, itemId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const handleDelete = async () => {
    if (type === "Question") {
      // Delete Question
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname });
    } else if (type === "Answer") {
      // Delete Answer
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
    }
  };

  const handleEdit = () => {
   router.push(`/question/edit/${JSON.parse(itemId)}`);
  };
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
     {type !== 'Edit' && <Image
        src="/assets/icons/edit.svg"
        alt="edit"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleEdit}
      /> 
      }

      <Image
        src="/assets/icons/trash.svg"
        alt="delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
