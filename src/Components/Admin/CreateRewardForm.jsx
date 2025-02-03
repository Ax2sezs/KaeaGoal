import React, { useState } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';
import PreviewModal from './PreviewModal'; // Import the PreviewModal component

const CreateRewardForm = ({ onCreateReward, onSuccess }) => {
  const { user } = useAuth();
  const { createReward, success, error, isLoading } = useFetchData(user?.token);

  const [rewardData, setRewardData] = useState({
    REWARD_NAME: '',
    REWARD_PRICE: 0,
    QUANTITY: 0,
    DESCRIPTION: '',
    ImageFile: [] // Ensure this starts as an array
  });

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRewardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setRewardData((prev) => ({ ...prev, ImageFile: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return; // Prevent duplicate submissions while loading

    setShowPreviewModal(true); // Show the preview modal
  };

  const handleConfirm = async () => {
    try {
      await createReward(rewardData);
      onCreateReward();
      onSuccess(); // Trigger page reload callback
      setShowPreviewModal(false); // Close the modal after confirmation
    } catch (err) {
      console.error('Error creating reward:', err);
    }
  };

  const handleCloseModal = () => {
    setShowPreviewModal(false); // Close the modal without confirming
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Form fields remain the same */}
        <div className='form-control w-full'>
          <label className='label-text text-button-text'>Reward Name</label>
          <input
            className='input input-bordered bg-bg border-button-text'
            type="text"
            name="REWARD_NAME"
            value={rewardData.REWARD_NAME}
            onChange={handleChange}
          />
        </div>

        <div className='form-control w-full'>
          <label className='label-text text-button-text'>Reward Price</label>
          <input
            className='input input-bordered bg-bg border-button-text'
            type="number"
            name="REWARD_PRICE"
            value={rewardData.REWARD_PRICE}
            onChange={handleChange}
          />
        </div>

        <div className='form-control w-full'>
          <label className='label-text text-button-text'>Quantity</label>
          <input
            className='input input-bordered bg-bg border-button-text'
            type="number"
            name="QUANTITY"
            value={rewardData.QUANTITY}
            onChange={handleChange}
          />
        </div>

        <div className='form-control w-full'>
          <label className='label-text text-button-text'>Description</label>
          <textarea
            className="textarea textarea-bordered bg-bg border-button-text"
            name="DESCRIPTION"
            value={rewardData.DESCRIPTION}
            onChange={handleChange}
          />
        </div>

        <div className="form-control w-full">
          <label className='label-text text-button-text'>Image</label>
          <input
            type="file"
            name="ImageFile"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full bg-bg border-button-text"
          />
        </div>

        <button type="submit" disabled={isLoading} className='btn btn-success text-bg'>
          {isLoading ? 'Submitting...' : 'Create Reward'}
        </button>

        {success && <div className="success">{success}</div>}
        {error && <div className="error">{error}</div>}
      </form>

      {showPreviewModal && (
        <PreviewModal
          rewardData={rewardData}
          onConfirm={handleConfirm}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default CreateRewardForm;