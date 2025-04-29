"use client";

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import client from "@/app/lib/apollo-client";

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

interface DeleteUserModalProps {
  id: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteUserModal({
  id,
  setShowModal,
}: DeleteUserModalProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteUser, { loading }] = useMutation(DELETE_USER, {
    variables: { id },
    refetchQueries: ["GET_USERS"], // Ensure the users list refreshes after deletion.
    onCompleted: () => {
      setShowModal(false);
      client.resetStore();
    },
    onError: (error) => setErrorMsg(error.message),
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Delete User</h2>
      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
      <p className="mb-4">Are you sure you want to delete this user?</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={() => deleteUser()}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
