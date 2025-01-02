import { Link } from "react-router-dom";

const ToastComponent = ({ data }) => {
  const { message, route, to, where } = data || {};
  return (
    <div>
      <p>{message}</p>

      {route && (
        <p>
          Click{" "}
          <Link to={to} className="font-semibold">
            here
          </Link>{" "}
          to {" " + where}
        </p>
      )}
    </div>
  );
};

export default ToastComponent;
