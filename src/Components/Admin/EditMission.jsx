import React, { useEffect, useState } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';

const EditMission = ({ initialData, onClose, onSuccess }) => {
    const { user } = useAuth();
    const { updateMission, isLoading, error } = useFetchData(user?.token);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [formData, setFormData] = useState({
        MISSION_ID: '',
        MISSION_NAME: '',
        MISSION_TYPE: '',
        MISSION_TypeCoin: 0,
        Coin_Reward: 0,
        Mission_Point: 0,
        Description: '',
        Start_Date: '',
        Expire_Date: '',
        Is_Active: true,
        Images: [],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                MISSION_ID: initialData.missioN_ID || '', // ✅ เพิ่มอันนี้
                MISSION_NAME: initialData.missioN_NAME || '',
                MISSION_TYPE: initialData.missioN_TYPE || 'QR',
                Coin_Reward: initialData.coin_Reward || '',
                Mission_Point: initialData.mission_Point || '',
                MISSION_TypeCoin: initialData.missioN_TypeCoin || 0,
                Start_Date: initialData.start_Date?.split('T')[0] || '',
                Expire_Date: initialData.expire_Date?.split('T')[0] || '',
                Description: initialData.description || '',
                Is_Limited: initialData.is_Limited ?? false,
                Accept_limit: initialData.accept_limit || '',
                Images: initialData.missionImages || [], // เพิ่มการโหลดภาพจาก initialData
                QRCode: initialData.qrMission || '',
                Code_Mission_Code: initialData.codeMission || '',
                Participate_Type: initialData.participate_Type || 'All',
                Department: initialData.department || '',
                Site: initialData.site || '',
                Is_Winners: initialData.is_Winners ?? false,
                Is_Public: initialData.is_Public ?? false,
                WinnerSt: initialData.winnerSt || 0,
                WinnerNd: initialData.winnerNd || 0,
                WinnerRd: initialData.winnerRd || 0,
                WinnerStCoin: initialData.winnerStCoin || 0,
                WinnerNdCoin: initialData.winnerNdCoin || 0,
                WinnerRdCoin: initialData.winnerRdCoin || 0,
            });
            console.log('Test ', initialData)
        }
    }, [initialData]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            Mission_Point: prev.Coin_Reward, // อัปเดตค่า Mission_Point ให้เท่ากับ Coin_Reward
        }));
    }, [formData.Coin_Reward]); // ทำงานเมื่อ Coin_Reward เปลี่ยนแปลง


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            Images: Array.from(e.target.files),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsConfirmOpen(true);
    };

    const handleConfirm = async () => {
        try {
            await updateMission(formData.MISSION_ID, formData);
            alert('✅ Mission updated successfully!');
            onSuccess();
            onClose();
        } catch (err) {
            console.error('❌ Error updating mission:', err);
            alert('❌ Failed to update mission!');
        } finally {
            setIsConfirmOpen(false);
        }
    };

    const handleCancel = () => setIsConfirmOpen(false);

    return (
        <div className="">
            <form onSubmit={handleSubmit} className="space-y-4 text-button-text">
                <h2 className="text-xl font-bold text-gray-800">Edit Mission</h2>
                <div className='grid grid-cols-3 gap-3'>
                    <div className='grid col-span-2'>
                        <label className="block font-medium">Mission Name</label>
                        <input
                            type="text"
                            name="MISSION_NAME"
                            value={formData.MISSION_NAME || ''}
                            onChange={handleChange}
                            className="input input-bordered w-full bg-bg"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Mission Type</label>
                        <select
                            name="MISSION_TYPE"
                            value={formData.MISSION_TYPE || ''}
                            onChange={handleChange}
                            className="select select-bordered w-full bg-bg"
                        >
                            <option value="Text">Text</option>
                            <option value="Code">Code</option>
                            <option value="Photo">Photo</option>
                            <option value="Video">Video</option>
                        </select>
                    </div>
                </div>
                {formData.MISSION_TYPE === 'Code' && (
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-button-text">Code Mission Code <strong className='text-red-500 text-xl'>*</strong></span>
                        </label>
                        <input
                            type="text"
                            name="Code_Mission_Code"
                            value={formData.Code_Mission_Code || ''}
                            onChange={handleChange}
                            className="input input-bordered bg-bg border-button-text"
                            required
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Coin Reward */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Coin Reward</span>
                        </label>
                        <input
                            type="number"
                            name="Coin_Reward"
                            value={formData.Coin_Reward}
                            min="1"
                            max="9999"
                            onChange={(e) => {
                                let value = e.target.value;

                                if (value === "") {
                                    handleChange({ target: { name: e.target.name, value: "" } });
                                    return;
                                }

                                if (/^\d*$/.test(value)) {
                                    let numericValue = Number(value);
                                    if (numericValue < 1) numericValue = 1;
                                    if (numericValue > 9999) numericValue = 9999;
                                    handleChange({ target: { name: e.target.name, value: numericValue } });
                                }
                            }}
                            onBlur={(e) => {
                                if (e.target.value === "") {
                                    handleChange({ target: { name: e.target.name, value: 1 } });
                                }
                            }}
                            onKeyDown={(e) => {
                                if (["-", "e", "+", "."].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            className="input input-bordered bg-bg border-button-text"
                            required
                        />
                    </div>

                    {/* Mission Point */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Mission Point</span>
                        </label>
                        <input
                            type="number"
                            name="Mission_Point"
                            value={formData.Mission_Point || ''}
                            onChange={handleChange}
                            className="input input-bordered bg-bg border-button-text"
                            readOnly
                            required
                        />
                    </div>

                    {/* Coin Type */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Coin Type</span>
                        </label>
                        <select
                            name="MISSION_TypeCoin"
                            value={formData.MISSION_TypeCoin}
                            onChange={handleChange}
                            className="select select-bordered bg-bg border-button-text"
                            required
                        >
                            <option value="0">Gae Coin</option>
                            <option value="1">Thanks Coin</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block font-medium">Description</label>
                    <textarea
                        name="Description"
                        value={formData.Description || ''}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full bg-bg h-96"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block font-medium">Start Date</label>
                        <input
                            type="date"
                            name="Start_Date"
                            value={formData.Start_Date || ''}
                            onChange={handleChange}
                            className="input input-bordered w-full bg-gray-800 text-bg"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Expire Date</label>
                        <input
                            type="date"
                            name="Expire_Date"
                            value={formData.Expire_Date || ''}
                            onChange={handleChange}
                            className="input input-bordered w-full bg-gray-800 text-bg"
                            min={formData.Start_Date || new Date().toISOString().slice(0, 16)} // ✅ ห้ามเลือกน้อยกว่า Start Date

                        />
                    </div>
                </div>
                {/* Accept_limit */}
                <div className='grid grid-cols-2 gap-3'>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-button-text">Participants</span>
                        </label>
                        <input
                            type="number"
                            name="Accept_limit"
                            max={2000}
                            value={formData.Accept_limit || ''}
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
                            className="input input-bordered border-button-text bg-bg"
                            required
                        />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text text-button-text">Site</span>
                        </label>
                        <select
                            name="Participate_Type"
                            value={formData.Participate_Type}
                            onChange={handleChange}
                            className="select select-bordered w-full bg-bg border-button-text"
                            required
                        >
                            <option value="All">All</option>
                            <option value="AUOF">AUOF - Office</option>
                            <option value="AUFC">AUFC - Factory</option>
                            <option value="AUBR">AUBR - Branch</option>
                        </select>
                    </div>
                </div>

                {/* Public & Winner toggle */}
                <div className='grid grid-cols-2'>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="flex justify-center items-center gap-3 label-text text-button-text">Is Public
                                <input
                                    type="checkbox"
                                    name="Is_Public"
                                    checked={formData.Is_Public}
                                    disabled={formData.MISSION_TYPE==='Code'}
                                    onChange={handleChange}
                                    className="checkbox checkbox-error bg-bg"
                                />
                            </span>

                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="flex justify-center items-center gap-3 label-text text-button-text">Is Winner
                                <input
                                    type="checkbox"
                                    name="Is_Winners"
                                    checked={formData.Is_Winners}
                                    disabled={formData.MISSION_TYPE==='Code'}
                                    onChange={handleChange}
                                    className="checkbox checkbox-error bg-bg"
                                />
                            </span>

                        </label>
                    </div>
                </div>


                {/* Winner fields */}
                {formData.Is_Winners && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {/* Winner 1st */}
                        <div>
                            <label className="label-text">Winner 1st</label>
                            <input
                                type="number"
                                name="WinnerSt"
                                value={formData.WinnerSt}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    // ป้องกันการใส่ค่าที่เกิน 5 หลัก
                                    if (value.length > 5) {
                                        value = value.slice(0, 5);
                                    }

                                    // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                    if ([".", "-", "e", "+", ","].includes(e.key)) {
                                        e.preventDefault();
                                    }

                                    handleChange({ target: { name: e.target.name, value } });
                                }}
                                onKeyDown={(e) => {
                                    // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                    if ([".", "-", "e", "+", ","].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="input input-bordered w-full bg-bg border-button-text"
                            />
                        </div>
                        <div>
                            <label className="label-text">1st Coin</label>
                            <input
                                type="number"
                                name="WinnerStCoin"
                                value={formData.WinnerStCoin}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    // ป้องกันการใส่ค่าที่เกิน 5 หลัก
                                    if (value.length > 5) {
                                        value = value.slice(0, 5);
                                    }

                                    // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                    if ([".", "-", "e", "+", ","].includes(e.key)) {
                                        e.preventDefault();
                                    }

                                    handleChange({ target: { name: e.target.name, value } });
                                }}
                                onKeyDown={(e) => {
                                    // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                    if ([".", "-", "e", "+", ","].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="input input-bordered w-full bg-bg border-button-text"
                            />
                        </div>

                        {/* Winner 2nd */}
                        <div>
                            <label className="label-text">Winner 2nd</label>
                            <input
                                type="number"
                                name="WinnerNd"
                                value={formData.WinnerNd}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    // ป้องกันการใส่ค่าที่เกิน 5 หลัก
                                    if (value.length > 5) {
                                        value = value.slice(0, 5);
                                    }

                                    // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                    if ([".", "-", "e", "+", ","].includes(e.key)) {
                                        e.preventDefault();
                                    }

                                    handleChange({ target: { name: e.target.name, value } });
                                }}
                                onKeyDown={(e) => {
                                    // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                    if ([".", "-", "e", "+", ","].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="input input-bordered w-full bg-bg border-button-text"
                            />
                        </div>
                        <div>
                            <label className="label-text">2nd Coin</label>
                            <input
                                type="number"
                                name="WinnerNdCoin"
                                value={formData.WinnerNdCoin}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    // ป้องกันการใส่ค่าที่เกิน 5 หลัก
                                    if (value.length > 5) {
                                        value = value.slice(0, 5);
                                    }

                                    // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                    if ([".", "-", "e", "+", ","].includes(e.key)) {
                                        e.preventDefault();
                                    }

                                    handleChange({ target: { name: e.target.name, value } });
                                }}
                                onKeyDown={(e) => {
                                    // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                    if ([".", "-", "e", "+", ","].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="input input-bordered w-full bg-bg border-button-text"
                            />
                        </div>

                        {/* Winner 3rd */}
                        <div>
                            <label className="label-text">Winner 3rd</label>
                            <input
                                type="number"
                                name="WinnerRd"
                                value={formData.WinnerRd}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    // ป้องกันการใส่ค่าที่เกิน 5 หลัก
                                    if (value.length > 5) {
                                        value = value.slice(0, 5);
                                    }

                                    // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                    if ([".", "-", "e", "+", ","].includes(e.key)) {
                                        e.preventDefault();
                                    }

                                    handleChange({ target: { name: e.target.name, value } });
                                }}
                                onKeyDown={(e) => {
                                    // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                    if ([".", "-", "e", "+", ","].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="input input-bordered w-full bg-bg border-button-text"
                            />
                        </div>
                        <div>
                            <label className="label-text">3rd Coin</label>
                            <input
                                type="number"
                                name="WinnerRdCoin"
                                value={formData.WinnerRdCoin}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    // ป้องกันการใส่ค่าที่เกิน 5 หลัก
                                    if (value.length > 5) {
                                        value = value.slice(0, 5);
                                    }

                                    // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                    if ([".", "-", "e", "+", ","].includes(e.key)) {
                                        e.preventDefault();
                                    }

                                    handleChange({ target: { name: e.target.name, value } });
                                }}
                                onKeyDown={(e) => {
                                    // ป้องกันการพิมพ์เครื่องหมายพิเศษหรือจุด
                                    if ([".", "-", "e", "+", ","].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="input input-bordered w-full bg-bg border-button-text"
                            />
                        </div>
                    </div>
                )}



                <div>
                    <label className="block font-medium">Upload Images</label>
                    <input
                        type="file"
                        name="Images"
                        multiple
                        onChange={handleFileChange}
                        className="file-input file-input-bordered w-full bg-bg"
                    />
                </div>




                <div className="flex justify-end space-x-2 pt-4">
                    <button type="submit" className="btn btn-success text-bg" disabled={isLoading}>
                        Update Mission
                    </button>
                    <button type="button" className="btn btn-error" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>

            {isConfirmOpen && (
                <div className="modal modal-open">
                    <div className="modal-box bg-bg">
                        <h3 className="font-bold text-lg">Confirm Update</h3>
                        <p>Are you sure you want to update this mission?</p>
                        <div className="modal-action">
                            <button onClick={handleConfirm} className="btn btn-success" disabled={isLoading}>
                                Yes
                            </button>
                            <button onClick={handleCancel} className="btn btn-error">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default EditMission;
