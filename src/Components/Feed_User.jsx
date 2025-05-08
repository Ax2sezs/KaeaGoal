import React, { useEffect, useState, useRef, useCallback } from 'react';
import useFetchData from './APIManage/useFetchData';
import { useAuth } from './APIManage/AuthContext';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


function Feed_User() {
    const { user } = useAuth();
    const {
        fetchMissionFeed,
        fetchCoinDetails,
        fetchUserDetails,
        fetchLikesForMission,
        fetchPublicMissions,
        Like,
        giveCoin,
        userDetails,
        coinDetails,
        error,
        isLoading,
    } = useFetchData(user?.token);

    const [missionFeed, setMissionFeed] = useState([]);
    const [modalImages, setModalImages] = useState([]);
    const [fullName, setFullName] = useState([])
    const [fullText, setFullText] = useState([])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({
        type: 'all',
        missionName: '',
        displayName: '',
    });
    const [errors, setErrors] = useState('')
    const [coinValue, setCoinValue] = useState(" ");
    const [desText, setDesText] = useState("")
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [recipientId, setRecipientId] = useState(null);
    const [likeUsers, setLikeUsers] = useState([]); // เก็บ user ที่กด Like
    const [currentLikeMissionId, setCurrentLikeMissionId] = useState(null); // เก็บ userMissionId ปัจจุบัน

    useEffect(() => {
        if (user?.token) {
            fetchCoinDetails();
            fetchUserDetails();
        }
    }, [user?.token]);

    const [publicMissions, setPublicMissions] = useState([]);


    useEffect(() => {
        const loadMissions = async () => {
            const result = await fetchPublicMissions(); // ต้องเป็น async
            setPublicMissions(result);
        };

        loadMissions();
    }, []);


    const openLikesModal = async (userMissionId) => {
        setCurrentLikeMissionId(userMissionId);

        try {
            const users = await fetchLikesForMission(userMissionId); // ดึงข้อมูลคนที่ Like
            setLikeUsers(users); // เซ็ตเข้า state
            const likeModal = document.getElementById('likeBy');
            if (likeModal) likeModal.showModal();
        } catch (errors) {
            console.error('Failed to fetch likes:', errors);
        }
    };


    const handleCoinChange = (e) => {
        const value = e.target.value;
        if (value === "" || (Number(value) >= 1 && Number(value) <= 10)) {
            setCoinValue(value);
        }
    };

    const handleTextChange = (e) => {
        const value = e.target.value
        setDesText(value);
    }

    const handleConfirmChange = (e) => setIsConfirmed(e.target.checked);

    const handleGiveCoin = async (userId) => {
        if (!coinValue || !recipientId) {
            setErrors("Please enter a valid amount and select a recipient.");
            return;
        }

        try {
            await giveCoin(recipientId, coinValue, desText);
            setCoinValue('');
            setDesText('');
            setIsConfirmed(false);
            const modal = document.getElementById(`modal-${userId}`);
            if (modal) {
                modal.close();
            }
            const successModal = document.getElementById("success_modal");
            if (successModal) {
                successModal.showModal();
                fetchCoinDetails()

            }
        } catch (err) {
            if (err.status === 400) {
                const errorModal = document.getElementById("error_modal");
                if (errorModal) {
                    errorModal.showModal();
                }
            } else {
                setErrors("Failed to give coin. Please try again.");
            }
        }
    };

    const openFeedModal = (item, receiverId) => {
        setRecipientId(receiverId);
        document.getElementById(`modal-${item.useR_MISSION_ID}`).showModal();
    };

    const closeFeedModal = (useR_MISSION_ID) => {
        setRecipientId(null);
        setCoinValue("");
        document.getElementById(`modal-${useR_MISSION_ID}`).close();
    };

    const observer = useRef();
    const pageSize = 10;

    const handleLike = async (item) => {
        try {
            const updatedItem = await Like(
                item.useR_MISSION_ID,
                item.missioN_ID,
                user.a_USER_ID,
                item.type
            );

            // อัปเดต missionFeed โดยเช็คจาก USER_MISSION_ID
            const updatedFeed = missionFeed.map(mission =>
                mission.useR_MISSION_ID === item.useR_MISSION_ID
                    ? {
                        ...mission,
                        iS_LIKE: !mission.iS_LIKE, // toggle ค่าใน frontend
                        likE_COUNT: mission.iS_LIKE
                            ? mission.likE_COUNT - 1
                            : mission.likE_COUNT + 1
                    }
                    : mission
            );

            setMissionFeed(updatedFeed);
            setSuccess("Like Success");
            setErrors(null);
        } catch (err) {
            console.error(err);
            setSuccess(null);
            setErrors("Failed to like the mission");
        }
    };

    const openModal = (images, index = 0) => {
        if (!Array.isArray(images)) {
            console.error("รูปที่ส่งเข้า modal ไม่ใช่ array:", images);
            return;
        }
        setModalImages({ images, index });
        window.feedPhoto?.showModal();
    };

    const closeModal = () => {
        setModalImages({ images: [], index: 0 });
        window.feedPhoto?.close();
    };

    const lastCardRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    const loadFeed = useCallback(async () => {
        const detail = await fetchUserDetails();
        const result = await fetchMissionFeed(
            page,
            pageSize,
            filters.type === 'all' ? null : filters.type,
            filters.missionName,
            filters.displayName
        );

        if (result?.data?.length > 0) {
            setMissionFeed((prev) => [...prev, ...result.data]);
            if (result.data.length < pageSize) setHasMore(false);
        } else {
            setHasMore(false);
        }
        
    }, [fetchMissionFeed, page, pageSize, filters,fetchUserDetails]);

    useEffect(() => {
        if (user?.token && hasMore) {
            loadFeed();
        }
    }, [page, user?.token, hasMore, loadFeed]);
    


    useEffect(() => {
        setMissionFeed([]);
        setPage(1);
        setHasMore(true);
    }, [filters]);


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPage(1);         // รีเซตหน้า
        setMissionFeed([]); // เคลียร์ของเดิม
        setHasMore(true);   // ให้โหลดใหม่
    };

    const uniqueMissionFeed = Array.from(new Set(missionFeed.map(a => a.useR_MISSION_ID)))
        .map(id => missionFeed.find(a => a.useR_MISSION_ID === id));


    return (
        <div className="bg-bg w-full rounded-2xl p-3 mb-16 min-h-screen">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
                {/* <h1 className="text-2xl font-bold text-button-text">Mission Feed</h1> */}
                <div className="flex flex-row gap-3 text-button-text">
                    {/* <select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        className="border px-3 py-2 rounded-xl text-sm bg-bg w-full"
                    >
                        <option value="all">All Types</option>
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                        <option value="text">Text</option>
                    </select> */}
                    <select
                        name="missionName"
                        value={filters.missionName}
                        onChange={handleFilterChange}
                        className="border px-3 py-2 rounded-xl text-sm bg-bg w-full"
                    >
                        <option value="">Select Mission</option>
                        {publicMissions
                            .filter((mission) => filters.type === 'all' || mission.missioN_TYPE === filters.type)
                            .map((mission) => (
                                <option key={mission.missioN_ID} value={mission.missioN_NAME}>
                                    {mission.missioN_NAME}
                                </option>
                            ))}
                    </select>

                    <input
                        name="displayName"
                        value={filters.displayName}
                        onChange={handleFilterChange}
                        placeholder="Search User Name"
                        className="border px-3 py-2 rounded-xl text-sm bg-bg w-full"
                    />
                </div>

            </div>

            {/* Feed Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uniqueMissionFeed.map((item, index) => {
                    // const isDisabled = coinDetails?.thankCoinBalance === 0;
                    const isLast = index === uniqueMissionFeed.length - 1;
                    return (
                        <div key={item.useR_MISSION_ID} ref={isLast ? lastCardRef : null} className="bg-white border-2 rounded-2xl p-4 flex flex-col gap-2 h-full">
                            <div>
                                <div className='flex flex-row'>
                                    <div className="text-lg text-gray-500 flex flex-row gap-2 items-center">
                                        <div className='w-8 h-8'>
                                            <img src={item?.imageURL || 'profile.png'} className='object-cover h-full w-full rounded-full' />
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-sm font-bold text-button-text'>{item.display_NAME}</span>
                                            <h2 className="text-xs">{item.missioN_NAME}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-row justify-between'>
                                    {/* <span className="text-xs uppercase">{item.type}</span> */}
                                </div>

                            </div>
                            <hr></hr>
                            <div className='flex-grow'>
                                {item.type === 'photo' && item.contenT_URLS?.length > 0 && (
                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        spaceBetween={10}
                                        slidesPerView={1}
                                        navigation
                                        pagination={{ clickable: true }}
                                        loop={true}
                                        className="w-full h-96 sm:h-72"
                                    >
                                        {item.contenT_URLS.map((imgUrl, index) => (
                                            <SwiperSlide key={index}>
                                                <img
                                                    src={imgUrl}
                                                    alt={`Mission Submission ${index + 1}`}
                                                    className="h-full w-full rounded-lg shadow-md object-cover cursor-pointer"
                                                    onClick={() => openModal(item.contenT_URLS, index)} // ถ้ามี modal
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                )}


                                {item.type === 'video' && (
                                    <video
                                        controls
                                        className="w-full rounded-xl"
                                        style={{ maxHeight: '400px' }}
                                    >
                                        <source src={item.contenT_URLS[0]} type="video/mp4" />
                                    </video>
                                )}

                                {item.type === 'text' && (
                                    <div className="whitespace-pre-wrap break-words text-gray-800 max-h-60 overflow-y-auto">
                                        {item.contenT_URLS[0].length > 255 ? (
                                            <>
                                                {item.contenT_URLS[0].slice(0, 255)}...
                                                <button
                                                    className="text-blue-500 underline ml-2 text-sm"
                                                    onClick={() => {
                                                        setFullText(item.contenT_URLS[0]);
                                                        setFullName(item.display_NAME);
                                                        document.getElementById('extend_text_modal')?.showModal();
                                                    }}
                                                >
                                                    Show more
                                                </button>
                                            </>
                                        ) : (
                                            item.contenT_URLS[0]
                                        )}
                                    </div>
                                )}
                            </div>
                            <hr></hr>

                            <div className="flex justify-between items-center mt-2">
                                <div className={`flex flex-row gap-3 items-center border-2 rounded-2xl w-auto px-2 py-1 hover:scale-105 transition-all duration-300 ease-in-out ${item.iS_LIKE ? 'border-red-500' : 'border-gray-400'}`}>
                                    <button
                                        className={`flex items-center ${item.iS_LIKE ? 'text-red-500 font-bold' : 'text-gray-600'} hover:scale-105`}
                                        onClick={() => handleLike(item)}
                                    >
                                        <span className=''>
                                            {item.iS_LIKE ? (
                                                <FavoriteOutlinedIcon />
                                            ) : (
                                                <FavoriteBorderOutlinedIcon />
                                            )}
                                        </span>
                                    </button>
                                    <span className={`flex items-center ${item.iS_LIKE ? 'text-red-500 font-bold' : 'text-gray-600'} hover:cursor-pointer`}
                                        onClick={() => openLikesModal(item.useR_MISSION_ID)}>
                                        {item.likE_COUNT}
                                    </span>
                                </div>

                                <span className="text-sm text-gray-600">
                                </span>
                                <button
                                    key={item.useR_ID}
                                    className="btn btn-sm btn-success btn-outline disabled:bg-transparent"
                                    title="Give Coin"
                                    disabled={
                                        userDetails?.branchCode !== "AUBR" &&
                                        (userDetails?.department === item.department || userDetails?.a_USER_ID === item.a_USER_ID)
                                    }

                                    onClick={() => {
                                        openFeedModal(item, item.useR_ID);

                                    }}
                                >
                                    <span
                                        className={`ml-1 flex flex-row items-center gap-2 ${(userDetails.branchCode !== "AUBR" &&
                                            (userDetails.department === item.department || userDetails.a_USER_ID === item.a_USER_ID))
                                            ? 'text-gray-400'  // ให้ข้อความ "Give Coin" เป็นสีเทาเมื่อปุ่ม disabled
                                            : ''
                                            }`}
                                    >
                                        {/* แสดงข้อความ "Give Coin" ถ้าไม่ disabled และซ่อนรูปภาพเมื่อ disabled */}
                                        Give Coin
                                        {!(
                                            userDetails.branchCode !== "AUBR" &&
                                            (userDetails.department === item.department || userDetails.a_USER_ID === item.a_USER_ID)
                                        ) && (
                                                <img src="./2.png" className="w-5 h-5" />
                                            )}
                                    </span>


                                </button>

                                {/* <button
                                    className="text-sm text-gray-600 hover:text-purple-500"
                                    onClick={() => handleShare(item)}
                                >
                                    Share
                                </button> */}
                            </div>
                        </div>
                    );
                })}
            </div>

            {
                isLoading && (
                    <div className="text-center text-gray-500">
                        <span className="loading loading-dots loading-lg"></span>
                    </div>)
            }

            {
                !hasMore && missionFeed.length > 0 && (
                    <p className="text-center text-gray-400 mt-6">You've reached the end 🎉</p>
                )
            }


            <dialog id="feedPhoto" className="modal">
                <div className="modal-box max-w-2xl w-full bg-bg">
                    <h3 className="font-bold text-lg mb-2">ภาพขนาดเต็ม</h3>

                    {modalImages?.images?.length > 0 && (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={10}
                            slidesPerView={1}
                            navigation
                            loop={true}
                            pagination={{ clickable: true }}
                            initialSlide={modalImages.index}
                            className="w-full h-[400px]"
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
                        <button
                            className="btn btn-error btn-outline btn-sm"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </dialog>
            <dialog id="extend_text_modal" className="modal">
                <div className="modal-box max-w-2xl bg-bg text-button-text">
                    <h3 className="font-bold text-lg mb-3">By {fullName}</h3>
                    <p className="whitespace-pre-wrap text-gray-700">{fullText}</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
            {
                uniqueMissionFeed?.map((item) => (
                    <dialog id={`modal-${item.useR_MISSION_ID}`} className="modal" key={`modal-${item.useR_MISSION_ID}-${item.a_USER_ID}`}>
                        <div className="modal-box bg-bg">
                            <div className="flex flex-col items-center"> {/* Center content horizontally */}
                                <div className="relative w-40 h-40 flex justify-center items-center"> {/* Center image */}
                                    <img
                                        src={item?.imageURL || 'profile.png'}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <h3 className="font-bold text-lg text-center mt-5 text-button-text">To {item.display_NAME}</h3> {/* Center text */}
                            </div>
                            <div className="py-4">
                                <label className="block mb-2 font-medium text-center text-button-text">Enter Coin Amount (1-10)</label> {/* Center text */}
                                <input
                                    type="number"
                                    className="input input-bordered w-full bg-bg border-heavy-color"
                                    value={coinValue}
                                    onChange={handleCoinChange}
                                    onKeyDown={(e) => {
                                        if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    inputMode="numeric"
                                />
                                <label className="block my-2 font-medium text-center text-button-text">Message</label>
                                <input type="text" className="input input-bordered w-full bg-bg text-button-text"
                                    value={desText}
                                    maxLength={200}
                                    placeholder="Tell Something"
                                    onChange={handleTextChange}
                                />

                                {/* ซ่อน checkbox ถ้าเหรียญไม่พอ */}
                                <div className="mt-4 flex items-center justify-center"> {/* Center checkbox and label */}
                                    <input
                                        type="checkbox"
                                        id={`confirm - ${item.useR_MISSION_ID}`}
                                        className="checkbox mr-2 border-button-text"
                                        checked={isConfirmed}
                                        onChange={handleConfirmChange}
                                    />
                                    <label htmlFor={`confirm - ${item.useR_ID}`} className="font-medium text-button-text">
                                        Coin given to {item.display_NAME}: {coinValue} coins!
                                    </label>
                                </div>

                            </div>
                            <div className="modal-action">
                                <button
                                    className="btn bg-[#54d376] border-none w-24 rounded-badge text-white hover:bg-[#43af60]"
                                    disabled={!isConfirmed || !coinValue || coinDetails?.thankCoinBalance < coinValue}
                                    onClick={() => handleGiveCoin(item.useR_ID)}
                                >
                                    Confirm
                                </button>
                                <button
                                    className="btn bg-[#ff6060] border-none w-24 rounded-badge text-white hover:bg-[#d44141]"
                                    onClick={() => closeFeedModal(item.useR_MISSION_ID)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </dialog>


                ))
            }
            {/* Error Modal */}
            <dialog id="error_modal" className="modal">
                <div className="modal-box bg-red-500 text-white text-center">
                    <h1 className='text-bg'><CloseOutlinedIcon fontSize='large' className='animate-bounce' /></h1>
                    <h3 className="text-xl font-bold">{error}</h3>
                    <button
                        className="btn border-bg bg-bg rounded-badge text-red-500 mt-3 border-hidden hover:transition-transform hover:scale-105 hover:bg-bg"
                        onClick={() => document.getElementById("error_modal").close()}
                    >
                        Close
                    </button>
                </div>
            </dialog>

            {/* Success Modal */}
            <dialog id="success_modal" className="modal">
                <div className="modal-box bg-green-500 text-white text-center">
                    <h1 className='text-bg'><CheckIcon fontSize='large' className='animate-bounce' /></h1>
                    <h3 className="text-xl font-bold">Give coin Successfully!</h3>
                    <p>You have successfully give coin...</p>
                    <button
                        className="btn border-bg bg-bg rounded-badge text-green-500 mt-3 border-hidden hover:transition-transform hover:scale-105 hover:bg-bg"
                        onClick={() => document.getElementById("success_modal").close()}
                    >
                        Close
                    </button>
                </div>
            </dialog>

            <dialog id="likeBy" className="modal modal-bottom md:modal-middle">
                <div className="modal-box bg-bg text-button-text text-center">
                    <h3 className="font-bold text-lg mb-4">People who liked <FavoriteOutlinedIcon className='text-red-500' />
                    </h3>

                    {likeUsers.length === 0 ? (
                        <p>No likes yet.</p>
                    ) : (
                        <ul className="max-h-60 overflow-y-auto p-1">
                            {likeUsers.map((user) => (
                                <li key={user.a_USER_ID} className="py-2 border-b">
                                    <div className="flex items-center justify-between space-x-3 w-full overflow-hidden">
                                        {/* ซ้ายมือ: รูป + ชื่อ */}
                                        <div className="flex flex-row gap-3 items-center w-1/2 overflow-hidden">
                                            <img
                                                src={user?.profileImageUrl || 'profile.png'}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                            />
                                            <span className="text-sm truncate">{user.displayName}</span>
                                        </div>

                                        {/* ขวามือ: Branch และ Department */}
                                        <div className="flex flex-col w-1/2 items-end overflow-hidden">
                                            <span className="text-gray-400 text-sm truncate w-full text-end">{user.bracnhCode}</span>
                                            <span className="text-gray-400 text-xs truncate w-full text-end">{user.department}</span>
                                        </div>

                                    </div>
                                </li>
                            ))}
                        </ul>

                    )}
                    <div className="hidden md:flex justify-center mt-4">
                        <form method="dialog">
                            <button className="btn btn-error text-bg btn-sm">Close</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className='modal-backdrop'>
                    <button>Close</button>
                </form>
            </dialog>



        </div >
    );
}

export default Feed_User;
