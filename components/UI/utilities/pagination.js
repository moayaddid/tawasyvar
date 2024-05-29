import ButtonComponent from "./buttonComponent";

function Pagination({ pagination, paginate }) {
  return (
    <div className="w-full flex justify-center items-center py-1 sm:text-base text-sm ">
      <ButtonComponent
        className={`max-w-max font-bold min-w-[5%] mx-1 text-center border-b-2 border-transparent disabled:border-transparent disabled:cursor-not-allowed hover:border-skin-primary disabled:opacity-70 px-2 py-1`}
        title={`First page`}
        onClick={() => {
          paginate(1);
        }}
        disabled={pagination.current_page == 1}
      />
      <ButtonComponent
        className={`max-w-fit font-bold w-[5%] mx-1 flex justify-center items-center border-b-2 border-transparent disabled:border-transparent disabled:cursor-not-allowed hover:border-skin-primary disabled:opacity-70 px-2 py-1`}
        title={`<`}
        onClick={() => {
          paginate(pagination.current_page - 1);
        }}
        disabled={pagination.current_page == 1}
      />
      <p className="py-1 px-3 border-b-2 mx-1 text-center border-skin-primary text-skin-primary">
        {pagination.current_page}
      </p>
      <ButtonComponent
        className={`max-w-fit font-bold w-[5%] flex justify-center items-center mx-1 text-center border-b-2 border-transparent disabled:border-transparent disabled:cursor-not-allowed hover:border-skin-primary disabled:opacity-70 px-2 py-1`}
        title={`>`}
        onClick={() => {
          paginate(pagination.current_page + 1);
        }}
        disabled={pagination.current_page == pagination.last_page}
      />
      <ButtonComponent
        className={`max-w-max font-bold min-w-[5%] mx-1 text-center border-b-2 border-transparent disabled:border-transparent  hover:border-skin-primary disabled:opacity-70 disabled:cursor-not-allowed px-2 py-1`}
        title={`Last page`}
        onClick={() => {
          paginate(pagination.last_page);
        }}
        disabled={pagination.current_page == pagination.last_page}
      />
    </div>
  );
}

export default Pagination;
