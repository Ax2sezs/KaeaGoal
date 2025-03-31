import React, { useState, useEffect } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';

const CreateMissionForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const { createMission, success, error, isLoading } = useFetchData(user?.token);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // For confirmation modal visibility
  const [formData, setFormData] = useState({
    MISSION_NAME: '',
    MISSION_TYPE: 'QR',
    Coin_Reward: '',
    Mission_Point: '',
    Start_Date: '',
    Expire_Date: '',
    Description: '',
    Is_Limited: false,
    Accept_limit: '',
    Images: [],
    QRCode: '',
    Code_Mission_Code: '',
    Participate_Type: 'All',  // Set a default value
    Department: '',
    Site: ''
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };


  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      Images: Array.from(e.target.files),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true); // Open the confirmation modal
  };

  const handleConfirm = async () => {
    try {
      console.log('Sending the following data to the API:', formData); // Log to see the data being sent

      await createMission(formData);
      alert('Mission created successfully!');

      setFormData({
        MISSION_NAME: '',
        MISSION_TYPE: 'QR',
        Coin_Reward: '',
        Mission_Point: '',
        Start_Date: '',
        Expire_Date: '',
        Description: '',
        Is_Limited: false,
        Accept_limit: '',
        Images: [],
        QRCode: '',
        Code_Mission_Code: '',
        Participate_Type: 'All', // Reset to default
        Department: '',
        Site: ''
      });

      onClose(); // Close modal after successful submission
      onSuccess(); // Trigger page reload callback
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsConfirmOpen(false); // Close the confirmation modal after the action
    }
  };


  const handleCancel = () => {
    setIsConfirmOpen(false); // Close the confirmation modal if cancelled
  };
  const handleClear = () => {
    setFormData((prev) => ({
      ...prev,
      Images: [], // Reset Images to an empty array
    }));

    // Optional: Clear the file input value
    document.querySelector('input[name="Images"]').value = '';
  };
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      Mission_Point: prev.Coin_Reward, // อัปเดตค่า Mission_Point ให้เท่ากับ Coin_Reward
    }));
  }, [formData.Coin_Reward]); // ทำงานเมื่อ Coin_Reward เปลี่ยนแปลง


  return (
    <>
      <div className='text-button-text'>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mission Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-button-text">Mission Name</span>
            </label>
            <input
              type="text"
              name="MISSION_NAME"
              value={formData.MISSION_NAME}
              onChange={handleChange}
              className="input input-bordered w-full bg-bg border-button-text"
              required
            />
          </div>

          {/* Mission Type */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-button-text">Mission Type</span>
            </label>
            <select
              name="MISSION_TYPE"
              value={formData.MISSION_TYPE}
              onChange={handleChange}
              className="select select-bordered w-full bg-bg border-button-text"
            >
              <option value="QR">QR</option>
              <option value="Text">Text</option>
              <option value="Code">Code</option>
              <option value="Photo">Photo</option>
            </select>
          </div>
          {formData.MISSION_TYPE === 'Code' && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-button-text">Code Mission Code <strong className='text-red-500 text-xl'>*</strong></span>
              </label>
              <input
                type="text"
                name="Code_Mission_Code"
                value={formData.Code_Mission_Code}
                onChange={handleChange}
                className="input input-bordered bg-bg border-button-text"
                required
              />
            </div>
          )}

          {/* Coin Reward and Mission Points */}
          <div className="grid grid-cols-2 gap-4">
            {/* Kae Coin */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-button-text">Kae Coin</span>
              </label>
              <input
                type="number"
                name="Coin_Reward"
                value={formData.Coin_Reward}
                min="1"
                max="9999"
                onChange={(e) => {
                  let value = e.target.value;

                  // อนุญาตให้เป็นค่าว่าง เพื่อให้ผู้ใช้สามารถลบตัวเลขได้
                  if (value === "") {
                    handleChange({ target: { name: e.target.name, value: "" } });
                    return;
                  }

                  // ตรวจสอบให้เป็นตัวเลขเท่านั้น และอยู่ในช่วงที่กำหนด
                  if (/^\d*$/.test(value)) {
                    let numericValue = Number(value);

                    // จำกัดค่าขั้นต่ำที่ 1 และสูงสุด 9999
                    if (numericValue < 1) {
                      numericValue = 1;
                    } else if (numericValue > 9999) {
                      numericValue = 9999;
                    }

                    handleChange({ target: { name: e.target.name, value: numericValue } });
                  }
                }}
                onBlur={(e) => {
                  // ถ้าผู้ใช้ปล่อยช่องว่าง ให้เปลี่ยนเป็น 1
                  if (e.target.value === "") {
                    handleChange({ target: { name: e.target.name, value: 1 } });
                  }
                }}
                onKeyDown={(e) => {
                  if (["-", "e", "+", "."].includes(e.key)) {
                    e.preventDefault(); // ป้องกันการพิมพ์ตัวอักษรที่ไม่ต้องการ
                  }
                }}
                className="input input-bordered bg-bg border-button-text"
                required
              />
            </div>

            {/* Mission Point */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-button-text">Mission Point</span>
              </label>
              <input
                type="number"
                name="Mission_Point"
                value={formData.Mission_Point}
                className="input input-bordered bg-bg border-button-text"
                readOnly
                required
              />
            </div>
          </div>


          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-button-text">Start Date</span>
              </label>
              <input
                type="datetime-local"
                name="Start_Date"
                value={formData.Start_Date}
                onChange={handleChange}
                className="input input-bordered bg-bg border-button-text"
                required
                min={new Date().toISOString().slice(0, 16)} // ✅ ห้ามเลือกย้อนหลัง
              />
            </div>

            {/* Expire Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-button-text">Expire Date</span>
              </label>
              <input
                type="datetime-local"
                name="Expire_Date"
                value={formData.Expire_Date}
                onChange={handleChange}
                className="input input-bordered bg-bg border-button-text"
                required
                min={formData.Start_Date || new Date().toISOString().slice(0, 16)} // ✅ ห้ามเลือกน้อยกว่า Start Date
              />
            </div>
          </div>


          {/* Description */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-button-text">Description</span>
            </label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              className="textarea textarea-bordered bg-bg border-button-text"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-button-text">Participants</span>
            </label>
            <input
              type="number"
              name="Accept_limit"
              max={2000}
              value={formData.Accept_limit}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) { // ป้องกันตัวอักษรและสัญลักษณ์
                  handleChange(e);
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!value || value <= 0) {
                  handleChange({ target: { name: 'Accept_limit', value: 1 } }); // ถ้าว่างหรือเป็น 0 ให้เป็น 1
                } else if (value > 2000) {
                  handleChange({ target: { name: 'Accept_limit', value: 2000 } }); // ถ้ามากกว่า 2000 ให้เป็น 2000
                }
              }}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') { // ป้องกัน "-" และ "e"
                  e.preventDefault();
                }
              }}
              className="input input-bordered bg-bg border-button-text"
              required
            />

          </div>

          {/* <select
          name="Participate_Type"
          value={formData.Participate_Type}
          onChange={handleChange}
          className="select select-bordered w-full bg-bg border-button-text"
          required
        >
          <option value="All">All</option>
          <option value="Office">Office</option>
          <option value="Factory">Factory</option>
          <option value="Branch">Branch</option>
        </select> */}

          {/* Is Limited */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text text-button-text">Is Limited</span>
              <input
                type="checkbox"
                name="Is_Limited"
                checked={formData.Is_Limited}
                onChange={handleChange}
                className="checkbox checkbox-error bg-bg"
              />
            </label>
          </div>

          {/* Images */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-button-text">Images</span>
            </label>
            <input
              type="file"
              name="Images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full bg-bg border-button-text"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {formData.Images &&
              Array.from(formData.Images).map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            {formData.Images && formData.Images.length > 0 && (
              <div className="flex justify-start">
                <button
                  onClick={handleClear}
                  className="btn btn-error"
                >
                  Clear Image
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-error"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`btn ${isLoading ? 'btn-disabled' : 'btn-success text-bg'}`}
            >
              {isLoading ? 'Creating...' : 'Create Mission'}
            </button>
          </div>
        </form>

        {/* Confirmation Modal */}
        <dialog id="confirmation_modal" className={`modal ${isConfirmOpen ? 'modal-open' : ''}`}>
          <div className="modal-box bg-bg">
            <h3 className="font-bold text-lg">Are you sure you want to create this mission?</h3>

            {/* Display the first image preview */}
            {formData.Images.length > 0 && (
              <img
                src={URL.createObjectURL(formData.Images[0])}
                alt="Mission Preview"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}

            <p className="">Mission Name: {formData.MISSION_NAME}</p>
            <p className="">Mission Type: {formData.MISSION_TYPE}</p>
            <p className="">Mission Type: {formData.Accept_limit}</p>
            <p className="">Coin Reward: {formData.Coin_Reward}</p>
            <p className="">Mission Point: {formData.Mission_Point}</p>
            <p className="">Start Date: {formData.Start_Date}</p>
            <p className="">Expire Date: {formData.Expire_Date}</p>
            <p className="w-full max-h-32 overflow-auto break-words whitespace-pre-line">
              Description: {formData.Description}
            </p>

            <p className="">Is Limited: {formData.Is_Limited ? 'Yes' : 'No'}</p>
            <p className="">Participate Type: {formData.Participate_Type || 'N/A'}</p>

            <div className="modal-action">
              <button className="btn" onClick={() => {
                handleConfirm(); // Call the confirm logic
                setIsConfirmOpen(false); // Close the modal

              }} >Yes, Create</button>
              <button className="btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>

        </dialog>
      </div>
    </>
  );
};

export default CreateMissionForm;
