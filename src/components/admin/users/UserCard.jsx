import PropTypes from "prop-types";

const UserCard = ({ user }) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      <tr>
        <td className="px-6 py-4 whitespace-nowrap">{user?.nombre}</td>
        <td className="px-6 py-4 whitespace-nowrap">{user?.email}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
            {user?.activo ? "Activo" : "Inactivo"}
          </span>
        </td>
       
      </tr>
    </tbody>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string,
    email: PropTypes.string,
    activo: PropTypes.bool,
  }),
};

export default UserCard;
