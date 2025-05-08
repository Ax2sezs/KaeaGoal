import React, { useEffect, useState } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';

const EditReward = ({ initialData, onClose, onSuccess, cate }) => {
    const { user } = useAuth();
    const { updateReward } = useFetchData(user?.token);

    const [formData, setFormData] = useState({
        REWARD_ID: '',
        REWARD_NAME: '',
        REWARD_PRICE: '',
        QUANTITY: '',
        DESCRIPTION: '',
        REWARDCate_Id: '',
        ImageFile: [],
        existingImages: [],
    });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                REWARD_ID: initialData.reward_Id || '',
                REWARD_NAME: initialData.reward_Name || '',
                REWARD_PRICE: initialData.reward_price || '',
                QUANTITY: initialData.reward_quantity || '',
                DESCRIPTION: initialData.reward_Description || '',
                REWARDCate_Id: initialData.rewardCate_Id || '',
                ImageFile: [],
                existingImages: initialData.reward_Images || [],
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            ImageFile: Array.from(e.target.files),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsConfirmOpen(true);
    };

    const handleConfirm = async () => {
        try {
            await updateReward(formData.REWARD_ID, formData);
            alert('✅ Reward updated successfully!');
            onSuccess();
            onClose();
        } catch (err) {
            console.error('❌ Error updating reward:', err);
            alert('❌ Failed to update reward!');
        } finally {
            setIsConfirmOpen(false);
        }
    };

    const handleCancel = () => setIsConfirmOpen(false);

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4 text-button-text">
                <div>
                    <label className="block font-semibold mb-1">Reward Name</label>
                    <input
                        name="REWARD_NAME"
                        value={formData.REWARD_NAME}
                        onChange={handleChange}
                        className="input input-bordered w-full bg-bg"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-1">Price</label>
                        <input
                            name="REWARD_PRICE"
                            type="number"
                            min="1"
                            value={formData.REWARD_PRICE}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                if ([".", "-", "e", "+", ","].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            className="input input-bordered w-full bg-bg"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Quantity</label>
                        <input
                            name="QUANTITY"
                            type="number"
                            min="1"
                            value={formData.QUANTITY}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                if ([".", "-", "e", "+", ","].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            className="input input-bordered w-full bg-bg"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Description</label>
                    <textarea
                        name="DESCRIPTION"
                        value={formData.DESCRIPTION}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full bg-bg"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <select
                        name="REWARDCate_Id"
                        value={formData.REWARDCate_Id}
                        onChange={handleChange}
                        className="select select-bordered w-full bg-bg"
                    >
                        <option value="" disabled>Select Category</option>
                        {cate.map((category, index) => (
                            <option key={index} value={category.rewardsCate_Id}>
                                {category.rewardsCate_NameEn}
                            </option>
                        ))}
                    </select>
                </div>


                <div>
                    <label className="block font-semibold mb-1">Upload Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="file-input file-input-bordered w-full bg-bg"
                    />
                </div>

                <div className="flex justify-end pt-4 gap-3">
                    <button type="submit" className="btn btn-success text-bg">Update Reward</button>
                    <button onClick={onClose} className="btn btn-error">Close</button>
                </div>
            </form>

            {/* Confirm Modal */}
            {isConfirmOpen && (
                <div className="modal modal-open">
                    <div className="modal-box bg-bg">
                        <h3 className="font-bold text-lg">Confirm Update</h3>
                        <p>Are you sure you want to update this reward?</p>
                        <div className="modal-action">
                            <button onClick={handleConfirm} className="btn btn-success">Yes</button>
                            <button onClick={handleCancel} className="btn btn-error">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditReward;
