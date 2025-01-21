import { useQuery } from "@tanstack/react-query";
import userService from "../../../services/user-service";
import UserCard from "./UserCard";

const UsersPage = () => {
  const { data: users } = useQuery({ queryFn: () => userService.findAll() });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        {users?.map((user) => (
          <UserCard key={user?.id} user={user} />
        ))}
      </table>
    </div>
  );
};

export default UsersPage;
