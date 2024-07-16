import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded p-4 bbg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{moment(date).format("DD-MM-YYYY")}</span>
        </div>

        <MdOutlinePushPin
          className={`${isPinned ? "text-primary" : "text-slate-400"} hover:text-primary`}
          onClick={onPinNote}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs flex items-start text-slate-500 gap-2">{tags.map((tag)=> `#${tag}  `)}</div>
        <div className="flex items-center gap-2">
          <MdCreate className="icon-btn hover:text-gray-600 hover:bg-transparent" onClick={onEdit} />
          <MdDelete
            className="icon-btn hover:text-red-500 hover:bg-transparent"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
