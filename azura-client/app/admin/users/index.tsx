"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import Loader from "@/app/shared/components/Loader";
import Link from "next/link";
import { GET_USERS } from "@/app/shared/utils/queries";
import { UserProfile } from "@/app/(landingPage)/shared/type";
import { Modal } from "@/app/shared/modal";
import { useGetCurrentUser } from "@/app/shared/hooks/useGetCurrentUser";
import CreateUserForm from "./createUser";
import { Pencil, Trash2 } from "lucide-react";
import UpdateUserRoleForm from "./edit";
import DeleteUserModal from "./DeleteUserModal"; // Import the new delete component

const Users: React.FC = () => {
  const { data, loading, error } = useQuery(GET_USERS);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [editId, setEditId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const { currentUser } = useGetCurrentUser();

  // Open the edit modal and set the selected user ID.
  function handleEdit(id: string) {
    setEditId(id);
    setShowEditModal(true);
  }

  // Open the delete modal and set the selected user ID.
  function handleDelete(id: string) {
    setDeleteId(id);
    setShowDeleteModal(true);
  }

  console.log(currentUser, "currentuser");

  if (loading) return <Loader />;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  const users: UserProfile[] = data?.users || [];
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primaryx hover:bg-primaryx-hover text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Create New User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-100 rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user: UserProfile) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                  <Link href={`/admin/users/${user.id}`}>
                    <button className="bg-primaryx hover:bg-primaryx-hover text-white font-medium py-1 px-3 rounded-md transition-colors">
                      View
                    </button>
                  </Link>
                  <button onClick={() => handleEdit(user.id)}>
                    <Pencil className="w-4 h-4 text-blue-500 cursor-pointer" />
                  </button>
                  <button onClick={() => handleDelete(user.id)}>
                    <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      <Modal onOpenChange={setShowCreateModal} open={showCreateModal}>
        <CreateUserForm setShowModal={setShowCreateModal} />
      </Modal>

      {/* Update User Role Modal */}
      <Modal onOpenChange={setShowEditModal} open={showEditModal}>
        <UpdateUserRoleForm id={editId} setShowModal={setShowEditModal} />
      </Modal>

      {/* Delete User Modal */}
      <Modal onOpenChange={setShowDeleteModal} open={showDeleteModal}>
        <DeleteUserModal id={deleteId} setShowModal={setShowDeleteModal} />
      </Modal>
    </div>
  );
};

export default Users;
