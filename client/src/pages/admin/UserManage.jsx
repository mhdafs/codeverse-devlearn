import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Tooltip,
  Pagination,
  Select,
  Input,
  Space,
  Empty,
} from "antd";
import {
  CheckCircleFilled,
  ExclamationCircleFilled,
  EyeInvisibleOutlined,
  EyeOutlined,
  SearchOutlined,
  CloseCircleOutlined,
  CrownFilled,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  listUser,
  blockUser,
  unblockUser,
} from "../../api/services/adminService";
import Title from "../../components/admin/Title";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../utils/alertSlice";

const { confirm } = Modal;
const { Option } = Select;

function UserManage() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [size] = useState("large");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPrime, setFilterPrime] = useState("all");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(showLoading());
        const response = await listUser();
        dispatch(hideLoading());
        const userData = response.data.data;
        setUsers(userData);
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const blockUserHandler = async (userId) => {
    try {
      const response = await blockUser(userId);
      if (response.data.success) {
        const updatedUsers = users.map((user) =>
          user._id === userId ? { ...user, status: "blocked" } : user
        );
        setUsers(updatedUsers);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unblockUserHandler = async (userId) => {
    try {
      const response = await unblockUser(userId);
      if (response.data.success) {
        const updatedUsers = users.map((user) =>
          user._id === userId ? { ...user, status: "active" } : user
        );
        setUsers(updatedUsers);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSortByName = (value) => {
    if (value === "asc") {
      const sortedUsers = [...users].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setUsers(sortedUsers);
      setSortBy("asc");
    } else if (value === "desc") {
      const sortedUsers = [...users].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
      setUsers(sortedUsers);
      setSortBy("desc");
    } else {
      setSortBy("");
    }
  };

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  const filteredUsers = users.filter((user) => {
    if (filterStatus === "all") {
      return true;
    } else {
      return user.status === filterStatus;
    }
  });

  const filteredByPrime =
    filterPrime === "prime" ? true : filterPrime === "user" ? false : "all";

  const searchedUsers = filteredUsers
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => {
      if (filteredByPrime === "all") {
        return true;
      } else {
        return user.prime === filteredByPrime;
      }
    });

  const usersToDisplay = searchedUsers.slice(start, end);

  const showBlockConfirm = (userId) => {
    confirm({
      title: "Are you sure you want to block this user?",
      icon: <ExclamationCircleFilled />,
      content: "Blocking the user will prevent further interactions.",
      okText: "Block",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk() {
        blockUserHandler(userId);
      },
    });
  };

  const showUnblockConfirm = (userId) => {
    confirm({
      title: "Are you sure you want to unblock this user?",
      icon: <ExclamationCircleFilled />,
      content: "Unblocking the user will allow further interactions.",
      okText: "Unblock",
      okType: "success",
      cancelText: "Cancel",
      centered: true,
      onOk() {
        unblockUserHandler(userId);
      },
    });
  };

  return (
    <AdminLayout>
      <Title>
        <h2 className="text-xl font-semibold">Users</h2>
        <Space>
          <Input
            className="w-52"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={
              <SearchOutlined
                style={{ color: "#1890ff", marginRight: "5px" }}
              />
            }
            suffix={
              searchTerm && (
                <CloseCircleOutlined
                  style={{ color: "#1890ff", cursor: "pointer" }}
                  onClick={() => setSearchTerm("")}
                />
              )
            }
          />
        </Space>
      </Title>
      <div className="overflow-x-auto rounded-xl mt-5">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-dark-purple text-white">
            <tr>
              <th className="text-center border border-gray-300 py-2">#</th>
              <th className="text-center border border-gray-300 py-2">Name</th>
              <th className="text-center border border-gray-300 py-2">Email</th>
              <th className="text-center border border-gray-300 py-2">Prime</th>
              <th className="text-center border border-gray-300 py-2">
                Status
              </th>
              <th className="text-center border border-gray-300 py-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {usersToDisplay.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-14">
                  <div className="flex justify-center items-center h-full">
                    <Empty
                      description={
                        <span className="text-lg text-gray-500">
                          No users available.
                        </span>
                      }
                    />
                  </div>
                </td>
              </tr>
            ) : (
              usersToDisplay.map((user, index) => (
                <tr key={user._id} className="bg-gray-100 hover:bg-gray-200">
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className=" text-center border border-gray-300 py-2 px-2">
                    <div className="cursor-pointer hover:scale-105 duration-300">
                      {user.image ? (
                        <div className="overflow-hidden rounded-full w-11 h-11 mx-auto shadow-sm shadow-black ">
                          <img src={user.image} alt="User" />
                        </div>
                      ) : (
                        <div className="overflow-hidden rounded-full w-11 h-11 mx-auto shadow-sm shadow-black ">
                          <img
                            src="https://res.cloudinary.com/cloudverse/image/upload/v1695133216/CODEVERSE/g9vfctxt7chji6uwgcn0.jpg"
                            alt="Default User"
                          />
                        </div>
                      )}
                    </div>
                    {user.name}
                  </td>
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {user.email}
                  </td>
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {user.prime ? (
                      <Tooltip title="Prime Member" placement="left">
                        <CrownFilled style={{ color: "gold" }} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Normal User" placement="left">
                        <CloseCircleOutlined style={{ color: "red" }} />
                      </Tooltip>
                    )}
                  </td>
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {user.status === "blocked" ? (
                      <span className="text-red-500 text-sm">
                        <ExclamationCircleFilled
                          style={{ marginRight: "2px" }}
                        />{" "}
                        Banned
                      </span>
                    ) : (
                      <span className="text-green-500">
                        <CheckCircleFilled style={{ marginRight: "5px" }} />{" "}
                        Active
                      </span>
                    )}
                  </td>
                  <td className="text-center border border-gray-300 py-2 px-2">
                    {user.status === "blocked" ? (
                      <Tooltip title="Unblock" placement="left">
                        <Button
                          icon={<EyeOutlined />}
                          size={size}
                          onClick={() => showUnblockConfirm(user._id)}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Block" placement="left">
                        <Button
                          icon={<EyeInvisibleOutlined />}
                          size={size}
                          onClick={() => showBlockConfirm(user._id)}
                        />
                      </Tooltip>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 mb-20 flex justify-between items-center px-2">
        <div>
          <Select
            defaultValue="all"
            style={{ width: 90 }}
            onChange={(value) => setFilterStatus(value)}
          >
            <Option value="all">All</Option>
            <Option value="unblocked">Active</Option>
            <Option value="blocked">Banned</Option>
          </Select>
          <Select
            defaultValue="all"
            style={{ width: 90 }}
            onChange={(value) => setFilterPrime(value)}
          >
            <Option value="all">All</Option>
            <Option value="prime">Prime</Option>
            <Option value="user">User</Option>
          </Select>
        </div>
        <Pagination
          current={currentPage}
          total={users.length}
          pageSize={pageSize}
          onChange={(page) => {
            setCurrentPage(page);
          }}
        />
        <div>
          <Select
            defaultValue=""
            style={{ width: 90 }}
            onChange={handleSortByName}
          >
            <Option value="">Sort</Option>
            <Option value="asc">A-Z</Option>
            <Option value="desc">Z-A</Option>
          </Select>
          <Select
            defaultValue={pageSize}
            style={{ width: 90 }}
            onChange={(value) => {
              setCurrentPage(1);
              setPageSize(value);
            }}
          >
            <Option value={10}>10/{users.length}</Option>
            <Option value={20}>20/{users.length}</Option>
            <Option value={50}>50/{users.length}</Option>
            <Option value={100}>100/{users.length}</Option>
          </Select>
        </div>
      </div>
    </AdminLayout>
  );
}

export default UserManage;
