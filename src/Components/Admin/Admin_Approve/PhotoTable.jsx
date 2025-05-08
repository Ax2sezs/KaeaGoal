import React, { useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import 'swiper/css/zoom';
import { Navigation, Pagination } from "swiper/modules";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const PhotoTable = ({ data, currentPage, totalPage, pageSize, onPageChange, isTableLayout, approve, view }) => {

    const [modalImages, setModalImages] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [modalImageList, setModalImageList] = useState([]);
    const [modalStartIndex, setModalStartIndex] = useState(0);
    const [modalKey, setModalKey] = useState(0); // เพื่อ reset Swiper ให้เริ่มที่ index ใหม่ทุกครั้ง

    const handleImageClick = (imageList, startIndex = 0) => {
        setModalImageList(imageList);
        setModalStartIndex(startIndex);
        setModalKey(prev => prev + 1); // ทำให้ Swiper re-render ด้วย index ใหม่
        window.approvePhoto?.showModal();
    };

    const openModal = (images, index = 0) => {
        if (!Array.isArray(images)) {
            console.error("รูปที่ส่งเข้า modal ไม่ใช่ array:", images);
            return;
        }
        setModalImages({ images, index });
        window.approvePhoto?.showModal();
    };

    const closeModal = () => {
        setModalImages({ images: [], index: 0 });
        window.approvePhoto?.close();
    };

    return (
        <div className="space-y-4 text-button-text mb-12">

            {isTableLayout ? (
                // 🟢 Table View
                <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 mt-4">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                            <tr className="bg-gray-100">
                                <th className="border p-2">Is Active</th>
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Site</th>
                                <th className="border p-2">Department</th>
                                <th className="border p-2">Upload Date</th>
                                <th className="border p-2">Images</th>
                                <th className='border p-2'>Approve</th>
                                <th className='border p-2'>Approver</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {data.map((item, index) => (
                                <tr key={item.useR_PHOTO_MISSION_ID || index}>
                                    <td className="border p-2">
                                        <button
                                            className={`btn btn-sm flex items-center gap-1 btn-outline ${item.is_View ? 'btn-success' : 'btn-error'}`}
                                            onClick={() => view(item.useR_PHOTO_MISSION_ID, !item.is_View)}
                                            disabled={item.approve != true}
                                        >
                                            {item.is_View ? (
                                                <>
                                                    <VisibilityOffIcon fontSize="small" />
                                                    HIDE
                                                </>
                                            ) : (
                                                <>
                                                    <VisibilityIcon fontSize="small" />
                                                    SHOW
                                                </>
                                            )}
                                        </button>

                                    </td>
                                    <td className="border p-2 text-center">{item.logoN_NAME}</td>
                                    <td className="border p-2 text-center">{item.useR_NAME}</td>
                                    <td className="border p-2 text-center">{item.branchCode}</td>
                                    <td className="border p-2 text-center">{item.department}</td>
                                    <td className="border p-2 text-center">{new Date(item.uploadeD_AT).toLocaleString('th-TH')}</td>
                                    <td className="border p-2 text-center">
                                        <div className="grid grid-cols-4 gap-2">
                                            {(item.photo)?.map((imgUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imgUrl}
                                                    alt={`Mission Submission ${index + 1}`}
                                                    className="h-16 w-16 rounded-lg shadow-md object-cover cursor-pointer"
                                                    onClick={() => openModal(item.photo, index)}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className='border p-2'>
                                        <div className="flex gap-3 justify-center">
                                            {item.approve === null ? (
                                                <>
                                                    <button className="btn btn-success btn-xs" onClick={() => approve(item.useR_PHOTO_MISSION_ID, true)}>
                                                        Approve
                                                    </button>
                                                    <button className="btn btn-error btn-xs" onClick={() => approve(item.useR_PHOTO_MISSION_ID, false)}>
                                                        Reject
                                                    </button>
                                                </>
                                            ) : item.approve === true ? (
                                                <span className="text-green-500">Approved</span>
                                            ) : (
                                                <span className="text-red-500">Rejected</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="border p-2 text-center"><div>
                                        <span className='text-button-text text-sm'>{item.approve_By_NAME}</span>
                                    </div>
                                        <span className='text-gray-400 text-xs'>{item.approve_DATE ? new Date(item.approve_DATE).toLocaleString('th-TH') : '-'}
                                        </span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                // 🟢 Card View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-button-text">
                    {data.map((item) => (
                        <div key={item.useR_PHOTO_MISSION_ID} className="bg-white border border-gray-300 rounded-lg shadow-md p-4 h-auto">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex flex-col w-full">
                                    <div className='flex justify-between'>
                                        <span className="text-lg font-semibold">{item.useR_NAME}</span>
                                        <button
                                            className={`btn btn-sm flex items-center gap-1 btn-outline ${item.is_View ? 'btn-success' : 'btn-error'}`}
                                            onClick={() => view(item.useR_PHOTO_MISSION_ID, !item.is_View)}
                                            disabled={item.approve != true}
                                        >
                                            {item.is_View ? (
                                                <>
                                                    <VisibilityOffIcon fontSize="small" />
                                                    HIDE
                                                </>
                                            ) : (
                                                <>
                                                    <VisibilityIcon fontSize="small" />
                                                    SHOW
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <span className="text-sm">{item.logoN_NAME}-{item.branchCode}-{item.department}</span>
                                </div>
                            </div>

                            {/* ใช้ Swiper เฉพาะเมื่อมีรูปมากกว่า 1 รูป */}
                            {item.photo && item.photo.length > 0 ? (
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    navigation
                                    pagination={{ clickable: true }}
                                    loop={true} // เปิด loop เสมอเพื่อให้สามารถวนลูปได้
                                    className="w-full h-72"
                                >
                                    {item.photo.map((imgUrl, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={imgUrl}
                                                alt={`Mission Submission ${index + 1}`}
                                                className="h-full w-full rounded-lg shadow-md object-cover cursor-pointer"
                                                onClick={() => openModal(item.photo, index)}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <div className="grid grid-cols-1 gap-2">
                                    {item.photo?.map((imgUrl, index) => (
                                        <img
                                            key={index}
                                            src={imgUrl}
                                            alt={`Mission Submission ${index + 1}`}
                                            className="h-32 w-32 rounded-lg shadow-md object-cover cursor-pointer"
                                            onClick={() => openModal(imgUrl, item.photo)}
                                        />
                                    ))}
                                </div>
                            )}
                            <div className='flex flex-row justify-between mt-2'>
                                <span className="text-sm">Submit Date:</span>
                                <span className='text-sm'> {new Date(item.uploadeD_AT).toLocaleString('th-TH')}</span>
                            </div>
                            <hr className='my-2'></hr>
                            <div className='flex flex-row justify-between'>
                                <span className="text-sm ">Approve Date:<br></br>{item.approve_DATE ? new Date(item.approve_DATE).toLocaleString('th-TH') : '-'}</span>
                                <span className='text-sm'>Approver:<br></br>{item.approve_By_NAME}</span>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                {item.approve === null ? (
                                    <>
                                        <button className="btn btn-success btn-sm" onClick={() => approve(item.useR_PHOTO_MISSION_ID, true)}>
                                            Approve
                                        </button>
                                        <button className="btn btn-error btn-sm" onClick={() => approve(item.useR_PHOTO_MISSION_ID, false)}>
                                            Reject
                                        </button>
                                    </>
                                ) : item.approve === true ? (
                                    <span className="text-green-500">Approved</span>
                                ) : (
                                    <span className="text-red-500">Rejected: {item.reject_Des}</span>
                                )}
                            </div>
                        </div>
                    ))}

                </div>
            )}

            < div className="flex justify-center space-x-2 mt-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-sm px-3 py-1 border rounded disabled:opacity-50"
                >
                    Previous
                </button>
                {/* <span className="px-3 py-1 border rounded bg-gray-100">
                    หน้า {currentPage} จาก {totalPages}
                </span> */}
                <span className="px-3 py-1 border rounded bg-gray-100">
                    Page {currentPage} / {totalPage}
                </span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPage}
                    className="btn btn-sm px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Modal for image preview */}
            <dialog id="approvePhoto" className="modal">
                <div className="modal-box max-w-2xl w-full bg-bg">
                    <h3 className="font-bold text-lg mb-2">ภาพขนาดเต็ม</h3>

                    {modalImages?.images?.length > 0 && (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={10}
                            slidesPerView={1}
                            navigation
                            zoom={true}
                            loop={true}
                            pagination={{ clickable: true }}
                            initialSlide={modalImages.index} // ✅ ตรงตัวแปร
                            className="w-full h-full"
                        >

                            {modalImages.images.map((imgUrl, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={imgUrl}
                                        alt={`Full Image ${index + 1}`}
                                        className="h-full w-full rounded-lg shadow-md object-contain"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}

                    <div className="modal-action mt-4">
                        <button className="btn btn-error btn-outline btn-sm" onClick={closeModal}>Close</button>
                    </div>
                </div>
            </dialog>
        </div >
    );
};

export default PhotoTable;
