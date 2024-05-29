import Link from "next/link";

function AdminDashboardCard({ icon, name, data, href }) {
  return (
    <Link
      href={href}
      className="border-2 border-gray-400 py-4 px-5 rounded-md hover:border-skin-primary"
    >
      <div className="flex justify-between pb-4">
        <div>
          <h2 className="text-xl">{name}</h2>
        </div>
        <div className="text-skin-primary w-[25px] h-[25px]">{icon}</div>
      </div>
      <div>
        <p>{data}</p>
      </div>
    </Link>
  );
}

export default AdminDashboardCard;
