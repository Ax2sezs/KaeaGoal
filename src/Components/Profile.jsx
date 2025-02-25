import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Alert from '@mui/material/Alert';
import { useAuth } from './APIManage/AuthContext';
import useFetchData from './APIManage/useFetchData';
import History from './Profile/History';
import MyReward from './Reward/MyReward';

function Profile() {
    const [activeTab, setActiveTab] = useState('history');
    const { user } = useAuth();
    const { userDetails = [], refetch, editProfileImg, editDisplayName, changePassword, isLoading,error } = useFetchData(user?.token);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [newDisplayName, setNewDisplayName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false)

    const tabs = [
        { id: 'history', label: 'History', component: <History /> },
        { id: 'order', label: 'My Orders', component: <MyReward /> },
    ];

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        try {
            let hasChanges = false;
            setLoading(true);
            // อัปเดตชื่อถ้ามีการเปลี่ยนแปลง
            if (newDisplayName.trim() && newDisplayName !== userDetails?.displayName) {
                const nameResponse = await editDisplayName(newDisplayName);
                if (nameResponse === "Display Name Updated.") {
                    hasChanges = true;
                }
            }

            // อัปโหลดรูปถ้ามีการเปลี่ยนแปลง
            if (selectedFile) {
                const imageResponse = await editProfileImg(selectedFile);
                if (imageResponse === "Profile has been updated.") {
                    hasChanges = true;
                }
            }

            if (hasChanges) {
                // Show alert message first
                setSuccessMessage("Profile updated successfully!");

                // Close modal & reset fields after a short delay
                setTimeout(() => {
                    document.getElementById('editProfileModal').close();
                    setSelectedFile(null);
                    setPreview(null);
                    setNewDisplayName("");

                    // Reload the page after 1 second
                    window.location.reload();
                }, 1000); // Adjust delay as needed
            }

        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="bg-bg w-full min-h-screen rounded-2xl p-3 mb-16 sm:mb-0">
            <div className="flex flex-row justify-between">
                <h1 className="text-2xl text-layer-item font-bold">Profile.</h1>
                
            </div>

            {isLoading ? (
                <div className="text-center text-gray-500">
                    <span className="loading loading-dots loading-lg"></span>
                </div>
            ) : (
                <>
                    <div className="divider divider-warning mb-10 relative">
                        <div className="avatar flex flex-col justify-center items-center relative">
                            <div className="ring-layer-item ring-offset-bg w-28 rounded-full ring ring-offset-2">
                                <img
                                    src={userDetails?.imageUrls || 'default-image.jpg'}
                                    alt="Profile"
                                    loading="lazy"
                                />
                            </div>
                            <button
                                className="absolute bottom-0 right-0 bg-layer-item text-white text-sm rounded-full w-8 h-8 flex justify-center items-center shadow-lg hover:bg-heavy-color transition-all"
                                onClick={() => document.getElementById('editProfileModal').showModal()}
                            >
                                <EditOutlinedIcon />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col w-full mt-16 justify-center items-center">
                        <h1 className="text-xl md:text-3xl text-heavy-color text-center">
                            {userDetails?.displayName}
                        </h1>
                        <h1 className="text-lg md:text-lg text-heavy-color text-center">
                            {userDetails?.branchCode} {userDetails?.branch}
                        </h1>
                    </div>
                </>
            )}

            {/* Edit Profile Modal (รวมเปลี่ยนชื่อ + เปลี่ยนรูป) */}
            <dialog id="editProfileModal" className="modal" onClose={() => { setSelectedFile(null); setPreview(null); }}>
                <div className="modal-box bg-bg">
                    <form method="dialog" className="flex flex-col items-center">
                        {/* ปุ่มปิด Modal */}
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => { setSelectedFile(null); setPreview(null); }}
                        >
                            ✕
                        </button>

                        <h3 className="font-bold text-lg mb-4 text-button-text">Edit Profile</h3>

                        {/* รูปโปรไฟล์ + ปุ่มแก้ไข */}
                        <div className="relative">
                            <div className="avatar">
                                <div className="w-32 h-32 rounded-full ring-2 ring-layer-item ring-offset-2">
                                    <img
                                        src={selectedFile ? preview : userDetails?.imageUrls}
                                        alt="Profile"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>

                            {/* ปุ่มแก้ไขรูป (ตรงขวาล่าง) */}
                            <button
                                type="button"
                                className="absolute bottom-3 right-0 bg-layer-item text-white text-sm rounded-full w-8 h-8 flex justify-center items-center shadow-lg hover:bg-heavy-color transition-all"
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                <EditOutlinedIcon fontSize="small" />

                            </button>
                        </div>
                        {successMessage && <Alert severity="success">{successMessage}</Alert>}
                        {/* File Input (ซ่อน) */}
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Input ใส่ชื่อใหม่ */}
                        <input
                            type="text"
                            placeholder="Enter new name"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            className="text-button-text input input-bordered border-layer-item rounded-badge w-full max-w-xs mb-4 bg-bg 
                focus:border-heavy-color focus:ring-2 focus:ring-heavy-color transition-all duration-300 mt-5"
                        />

                        {/* ปุ่มบันทึก */}
                        <div className='flex flex-row gap-5'>
                       
                        <button
                            className="btn btn-warning rounded-badge text-bg"
                            onClick={() => document.getElementById('changePasswordModal').showModal()}
                        >
                            Change Password
                        </button>
                        <button
                            type="button"
                            className="btn btn-success rounded-badge text-bg"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Save . . ." : "Save Change"}
                        </button>
                        </div>
                    </form>
                </div>
            </dialog>
            <dialog id="changePasswordModal" className="modal">
                <div className="modal-box bg-bg">
                    <form method="dialog" className="flex flex-col items-center">
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => {
                                setCurrentPassword("");
                                setNewPassword("");
                                setConfirmPassword("");
                                
                            }}
                        >
                            ✕
                        </button>

                        <h3 className="font-bold text-lg mb-4 text-button-text">Change Password</h3>

                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="text-button-text input input-bordered border-layer-item rounded-badge w-full max-w-xs mb-4 bg-bg 
                            focus:border-heavy-color focus:ring-2 focus:ring-heavy-color transition-all duration-300"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="text-button-text input input-bordered border-layer-item rounded-badge w-full max-w-xs mb-4 bg-bg 
                            focus:border-heavy-color focus:ring-2 focus:ring-heavy-color transition-all duration-300"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="text-button-text input input-bordered border-layer-item rounded-badge w-full max-w-xs mb-4 bg-bg 
                            focus:border-heavy-color focus:ring-2 focus:ring-heavy-color transition-all duration-300"
                        />

                        <button
                            type="button"
                            className="btn btn-success mt-4 rounded-badge text-bg"
                            onClick={() => changePassword(currentPassword, newPassword, confirmPassword)}
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            </dialog>



            {/* Tabs */}
            <div className="flex flex-col justify-center items-center h-20">
                <div className="join grid grid-cols-2 gap-0 justify-center items-center w-full lg:w-1/2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`join-item btn ${activeTab === tab.id
                                ? 'bg-layer-item border-hidden text-white hover:bg-heavy-color'
                                : 'border border-layer-item bg-transparent hover:bg-light-color hover:border-transparent hover:text-gray-600'
                                } rounded-full p-2`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <p className="text-sm md:text-lg">{tab.label}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div>{tabs.find((tab) => tab.id === activeTab)?.component}</div>
        </div>
    );
}

export default Profile;
