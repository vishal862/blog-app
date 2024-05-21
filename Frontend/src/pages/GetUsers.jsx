import { Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineCheck } from "react-icons/hi";
import { HiOutlineXMark } from "react-icons/hi2";

export default function GetUsers() {
  const currentUser = useSelector((state) => state.user);
  const [fetchUsersError, setFetchUsersError] = useState(null);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(false);
  console.log(users);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getUsers");
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUsers(data.users);
        }
        if (data.users.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [currentUser.isAdmin]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Table>
        <Table.Head>
          <Table.HeadCell>Data created</Table.HeadCell>
          <Table.HeadCell>User Image</Table.HeadCell>
          <Table.HeadCell>USERname</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Admin</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>
        {users.map((user) => (
          <Table.Body key={user._id}>
            <Table.Row>
              <Table.Cell>
                {new Date(user.createdAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                <img
                  className="h-10 w-10 object-cover bg-gray-500 rounded-full"
                  src={user.profilePicture}
                  alt="UserImages"
                />
              </Table.Cell>
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                {user.isAdmin ? <HiOutlineCheck color="green"/> : <HiOutlineXMark color="red"/>}
              </Table.Cell>
              <Table.Cell><span className="text-red-600 hover:underline cursor-pointer">Delete</span></Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
    </div>
  );
}
