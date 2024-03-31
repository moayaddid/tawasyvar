import { convertDateStringToDate } from "../AdminOrders/OrderAdmin";

function NoteItem({ note }) {
  return (
    <div className="w-full flex flex-col justify-start hover:border-sky-500 transition-all duration-300 cursor-pointer items-start px-2 py-1 rounded-lg border-2 border-gray-400 ">
      <div className="w-full flex justify-between items-center px-2">
        <p className="text-lg font-semibold text-blue-500" >{note.sender}</p>
        <i>{convertDateStringToDate(note.created_at)}</i>
      </div>
      <p className="px-4" >{note.note}</p>
    </div>
  );
}

export default NoteItem;
