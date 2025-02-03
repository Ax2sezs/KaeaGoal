import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from './APIManage/AuthContext';
import useFetchData from './APIManage/useFetchData';
import History from './Profile/History';
import MyReward from './Reward/MyReward';

function Profile() {
    const [activeTab, setActiveTab] = useState('history');
    const { user } = useAuth();
    const { userDetails = [], refetch, editProfileImg } = useFetchData(user?.token);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    

    const tabs = [
        { id: 'history', label: 'History', icon: 'src/assets/icons8-history-26.png', component: <History /> },
        { id: 'order', label: 'My Orders', icon: 'src/assets/icons8-shipped-26.png', component: <MyReward /> },
    ];

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;
    
        try {
            // Directly use the selected file, no need for FileReader
            const uploadResponse = await editProfileImg(selectedFile);  // Send file directly
            
            // Check if the response indicates a successful upload
            if (uploadResponse === "Profile has been updated.") {  // Adjust this based on actual response message
                console.log("Profile Image Update Response:", uploadResponse);
                // Refresh user details and close modal
                refetch()
                document.getElementById('profileImageModal').close();
    
                // Reset the file input and preview
                setSelectedFile(null);
                setPreview(null);
            } else {
                console.error("Failed to upload profile image:", uploadResponse);
            }
        } catch (error) {
            console.error("Error updating profile image:", error);
        }
    };
    





    return (
        <div className="bg-bg w-full min-h-screen rounded-2xl p-3">
            <div className='flex flex-row justify-between'>
                <h1 className="text-2xl text-layer-item font-bold">Profile.</h1>
                <Link to="/">
                    <button className='bg-layer-item hover:bg-heavy-color transition duration-300 border-hidden text-bg rounded-badge w-14 h-8'>
                        <LogoutIcon />
                    </button>
                </Link>
            </div>

            {/* Profile Picture */}
            <div className="divider divider-warning mb-10 relative">
                <div className="avatar flex flex-col justify-center items-center relative">
                    <div className="ring-layer-item ring-offset-base-100 w-28 rounded-full ring ring-offset-2">
                        <img
                            src={userDetails?.imageUrls}
                            alt="Profile"
                            loading="lazy"
                        />
                    </div>
                    <button
                        className="absolute bottom-0 right-0 bg-layer-item text-white text-sm rounded-full w-8 h-8 flex justify-center items-center shadow-lg hover:bg-heavy-color transition-all"
                        onClick={() => document.getElementById('profileImageModal').showModal()}
                    >
                        Edit
                    </button>
                </div>
            </div>

            {/* Edit Profile Image Modal */}
            <dialog id="profileImageModal" className="modal">
                <div className="modal-box">
                    <form method="dialog" className="flex flex-col items-center">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

                        <h3 className="font-bold text-lg mb-4">Update Profile Picture</h3>

                        {/* File Input */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            className="file-input file-input-bordered w-full max-w-xs"
                        />

                        {/* Preview Image */}
                        {selectedFile && (
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Preview"
                                className="mt-4 w-32 h-32 rounded-full object-cover"
                            />
                        )}

                        {/* Submit Button */}
                        <button
                            className="btn btn-primary mt-4"
                            onClick={handleSubmit}
                        >
                            Upload
                        </button>
                    </form>
                </div>
            </dialog>
            
            <dialog id="profileConfirm" className="modal">
                <div className="modal-box">
                    <form method="dialog" className="flex flex-col items-center">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

                        <h3 className="font-bold text-lg mb-4">Update Profile Picture Success</h3>

                        {/* Submit Button */}
                        <button
                            className="btn btn-primary mt-4"
                            onClick={refetch}
                        >
                            Close
                        </button>
                    </form>
                </div>
            </dialog>

            {/* User Info */}
            <div className="flex flex-row w-full mb-5 mt-14 justify-center items-center flex-wrap">
                <div>
                    <h1 className="text-xl md:text-3xl text-heavy-color text-center">{userDetails?.displayName}</h1>
                    <h1 className="text-lg md:text-lg text-heavy-color text-center">{userDetails?.branchCode} {userDetails?.branch}</h1>
                </div>
            </div>

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
                            <img
                                src={tab.icon}
                                alt={tab.label.toLowerCase()}
                                className={`transition-all w-5 h-5 ${activeTab === tab.id ? 'filter invert-0' : 'filter invert hover:invert'
                                    } md:w-6 md:h-6`}
                                loading="lazy"
                            />
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
