import React, { useState, useEffect } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';

function CreateUserForm({ onClose }) {
  const { user } = useAuth();
  const { createUser, success, error, isLoading } = useFetchData(user?.token);

  const [formData, setFormData] = useState({
    logoN_NAME: '',
    firstName: '',
    lastName: '',
    branchCode: '',
    branch: '',
    stateCode: 0,
    deletionStateCode: 0,
    isBkk: 0,
    isAdmin: 0,
    user_Name: '',
    isshop: true,
    issup: true,
    isQSC: 0,
    useR_EMAIL: '',
    user_Position: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose(); // Close modal after success
      }, 2000);
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  useEffect(() => {
    if (error) {
      alert('Error: ' + error);
    }
  }, [error]);

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-auto relative">
      {/* Close Button */}
      <button
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onClick={onClose}
      >
        ✕
      </button>

      {/* Success Alert */}
      {showSuccess && (
        <div className="alert alert-success shadow-lg mb-4">
          <span>User created successfully!</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error shadow-lg mb-4">
          <span>{error}</span>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-center">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
      {/* Input Fields */}
        <div className="form-control">
          <label className="label">Logo Name</label>
          <input
            type="text"
            name="logoN_NAME"
            value={formData.logoN_NAME}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="form-control w-1/2">
            <label className="label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control w-1/2">
            <label className="label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label">Branch Code</label>
          <input
            type="text"
            name="branchCode"
            value={formData.branchCode}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">Branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">Email</label>
          <input
            type="email"
            name="useR_EMAIL"
            value={formData.useR_EMAIL}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">Username</label>
          <input
            type="text"
            name="user_Name"
            value={formData.user_Name}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">Position</label>
          <input
            type="text"
            name="user_Position"
            value={formData.user_Position}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        {/* Toggle Switches */}
        <div className="flex justify-between items-center">
          <label className="label cursor-pointer">
            <span className="label-text">Admin</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={formData.isAdmin}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isAdmin: e.target.checked,
                }))
              }
            />
          </label>

          <label className="label cursor-pointer">
            <span className="label-text">Is Shop</span>
            <input
              type="checkbox"
              className="toggle toggle-secondary"
              checked={formData.isshop}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isshop: e.target.checked,
                }))
              }
            />
          </label>

          <label className="label cursor-pointer">
            <span className="label-text">Is Sup</span>
            <input
              type="checkbox"
              className="toggle toggle-accent"
              checked={formData.issup}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  issup: e.target.checked,
                }))
              }
            />
          </label>
        </div>

        {/* Numeric Fields */}
        <div className="flex gap-4">
          <div className="form-control w-1/2">
            <label className="label">State Code</label>
            <input
              type="number"
              name="stateCode"
              value={formData.stateCode}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control w-1/2">
            <label className="label">Deletion State Code</label>
            <input
              type="number"
              name="deletionStateCode"
              value={formData.deletionStateCode}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            'Create User'
          )}
        </button>
      </form>
    </div>
  );
}

export default CreateUserForm;
