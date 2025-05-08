import React, { useEffect, useState } from 'react';
import useFetchData from "../APIManage/useFetchData";
import { useAuth } from "../APIManage/AuthContext";

function BannerManage() {
    const { user } = useAuth();
    const { uploadBanner, fetchBanners, deleteBanner } = useFetchData(user?.token);

    const [banners, setBanners] = useState([]);
    const [newBanner, setNewBanner] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // สำหรับ Modal confirmation delete
    const [bannerToDelete, setBannerToDelete] = useState(null);


    // ดึงข้อมูล Banner เมื่อหน้าโหลด
    useEffect(() => {
        const loadBanners = async () => {
            try {
                const fetchedBanners = await fetchBanners();
                setBanners(fetchedBanners);
            } catch (err) {
                setError('Failed to fetch banners');
            }
        };

        loadBanners();
    }, [fetchBanners]);

    // ฟังก์ชันอัปโหลด Banner
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newBanner) {
            setError('Please select a file to upload');
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadBanner(newBanner);
            setSuccess('Banner uploaded successfully!');
            setError(null);
            setNewBanner(null); // Clear the file input after upload
            // รีเฟรชรายชื่อ banner
            const updatedBanners = await fetchBanners();
            setBanners(updatedBanners);
        } catch (err) {
            setError('Failed to upload banner');
        } finally {
            setIsUploading(false);
        }
    };

    // ฟังก์ชันลบ Banner
    const handleDelete = async () => {
        if (!bannerToDelete) return;

        try {
            await deleteBanner(bannerToDelete);
            setSuccess('Banner deleted successfully!');
            // รีเฟรชรายการ Banner หลังจากลบ
            const updatedBanners = await fetchBanners();
            setBanners(updatedBanners);
            document.getElementById("confirm_delete_modal").close(); // ✅ ปิด modal

        } catch (err) {
            setError('Failed to delete banner');
        }
    };

    useEffect(() => {
        if (success) {
          const timer = setTimeout(() => setSuccess(null), 3000);
          return () => clearTimeout(timer); // cleanup
        }
      }, [success]);
      
      useEffect(() => {
        if (error) {
          const timer = setTimeout(() => setError(null), 3000);
          return () => clearTimeout(timer); // cleanup
        }
      }, [error]);

    return (
        <div className="banner-manage-container p-6">
            <h1 className="text-3xl font-bold mb-4">Banner Management</h1>

            {/* แสดงผลข้อความความสำเร็จ/ข้อผิดพลาด */}
            {success && <div className="alert alert-success mb-4">{success}</div>}
            {error && <div className="alert alert-error mb-4">{error}</div>}

            {/* ฟอร์มอัปโหลด Banner */}
            <div className="upload-banner mb-6">
                <h2 className="text-2xl mb-2">Upload New Banner</h2>
                <form onSubmit={handleUpload} className="flex items-center space-x-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewBanner(e.target.files[0])}
                        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                    />
                    <button
                        type="submit"
                        disabled={isUploading}
                        className="btn btn-primary"
                    >
                        {isUploading ? 'Uploading...' : 'Upload Banner'}
                    </button>
                </form>
            </div>

            {/* แสดงรายการ Banner */}
            <div className="banner-list mb-6">
                <h2 className="text-2xl mb-2">Existing Banners</h2>
                <ul className="space-y-4">
                    {banners.map((banner) => (
                        <li key={banner.id} className="flex items-center space-x-4">
                            <img
                                src={banner.filePath}
                                alt={`Banner ${banner.id}`}
                                className="w-48 h-auto rounded-lg"
                            />
                            <button
                                className="btn btn-error"
                                onClick={() => {
                                    setBannerToDelete(banner.id); // ตั้ง ID ที่จะลบไว้
                                    document.getElementById("confirm_delete_modal").showModal();
                                }}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>

            </div>

            <dialog id="confirm_delete_modal" className="modal">
                <div className="modal-box bg-bg text-button-text">
                    <h3 className="font-bold text-lg">Confirm Deletion</h3>
                    <p className="py-4">Are you sure you want to delete this banner?</p>
                    <div className="modal-action">
                        <form method="dialog" className="flex gap-3">
                            <button
                                type="button"
                                className="btn btn-error"
                                onClick={handleDelete}
                            >
                                Confirm
                            </button>
                            <button className="btn btn-outline">Cancel</button>

                        </form>
                    </div>
                </div>
            </dialog>

        </div>
    );
}

export default BannerManage;
