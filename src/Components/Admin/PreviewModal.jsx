import React from 'react';

const PreviewModal = ({ rewardData, onConfirm, onClose }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Preview Reward</h3>
        <div className="py-4">
          <p><strong>Name:</strong> {rewardData.REWARD_NAME}</p>
          <p><strong>Price:</strong> {rewardData.REWARD_PRICE}</p>
          <p><strong>Quantity:</strong> {rewardData.QUANTITY}</p>
          <p><strong>Description:</strong> {rewardData.DESCRIPTION}</p>
          <div>
            <strong>Images:</strong>
            {rewardData.ImageFile.map((file, index) => (
              <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index}`} style={{ width: '100px', margin: '5px' }} />
            ))}
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-success" onClick={onConfirm}>Confirm</button>
          <button className="btn btn-error" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;