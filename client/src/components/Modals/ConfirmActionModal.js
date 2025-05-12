import React from "react";

const ConfirmActionModal = ({ actionType, onConfirm, onCancel, adminName }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm {actionType}?</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to {actionType} the admin:{" "}
          <strong>{adminName}</strong>?
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded text-white ${
              actionType === "delete" ? "bg-red-500 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-700"
            } transition duration-300`}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
