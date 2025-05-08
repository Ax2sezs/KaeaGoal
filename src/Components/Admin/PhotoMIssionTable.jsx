import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
// import heic2any from 'heic2any';

const PhotoMissionTable = ({ alluserDetail, allMission, ApprovePhoto, approvePhoto, addAllCoinPhoto, isLoading, error, refetch }) => {
    const [photoMissions, setPhotoMissions] = useState([]);
    const [filteredMissions, setFilteredMissions] = useState([]);
    const [selectedMissions, setSelectedMissions] = useState([]);
    const [coinAmount, setCoinAmount] = useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [selectedMissionId, setSelectedMissionId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedMissionName, setSelectedMissionName] = useState("all");
    const [isTableLayout, setIsTableLayout] = useState(false)
    const [convertedPhotos, setConvertedPhotos] = useState({});
    const [selects, setSelects] = useState([{ user: "", rank: "" }]);
    const users = ["User A", "User B", "User C"];
    const ranks = ["อันดับ 1", "อันดับ 2", "อันดับ 3"];

    const addSelect = () => {
        const nextRankNumber = selects.length + 1;
        const newSelect = {
            user: "",
            rank: `อันดับ ${nextRankNumber}`,
        };
        setSelects([...selects, newSelect]);
    };

    const removeSelect = () => {
        if (selects.length > 1) {
            setSelects(selects.slice(0, -1));
        }
    };

    const handleSelectChange = (index, field, value) => {
        const updated = [...selects];
        updated[index][field] = value;
        setSelects(updated);
      };
      
    // useEffect(() => {
    //     // แปลงไฟล์ HEIC ให้เป็นรูปภาพที่รองรับ
    //     const convertPhotos = async () => {
    //         const newConvertedPhotos = {};

    //         for (const mission of filteredMissions) {
    //             const photoUrls = mission.photo || [];
    //             const convertedUrls = [];

    //             for (const photoUrl of photoUrls) {
    //                 if (photoUrl.endsWith('.heic')) {
    //                     try {
    //                         const response = await fetch(photoUrl);
    //                         const blob = await response.blob();

    //                         // แปลงไฟล์ HEIC เป็น JPEG
    //                         const convertedImage = await heic2any({ blob, toType: 'image/jpeg' });

    //                         const convertedUrl = URL.createObjectURL(convertedImage);
    //                         convertedUrls.push(convertedUrl);
    //                     } catch (err) {
    //                         console.error(`Error converting HEIC file: ${err}`);
    //                         convertedUrls.push(photoUrl); // หากแปลงไม่ได้, ใช้ URL เดิม
    //                     }
    //                 } else {
    //                     convertedUrls.push(photoUrl); // หากไม่ใช่ HEIC, ใช้ URL เดิม
    //                 }
    //             }

    //             newConvertedPhotos[mission.userPhotoMissionId] = convertedUrls;
    //         }

    //         setConvertedPhotos(newConvertedPhotos);
    //     };

    //     convertPhotos();

    // }, [filteredMissions]);

    useEffect(() => {
        const mappedPhotoMissions = ApprovePhoto.map(mission => ({
            ...mission,
            userPhotoMissionId: mission.useR_PHOTO_MISSION_ID,
        }));

        console.log("Mapped Photo Missions:", mappedPhotoMissions); // ดูว่า mappedPhotoMissions มี 106 หรือไม่

        mappedPhotoMissions.sort((a, b) => (a.approve === null ? -1 : 1) - (b.approve === null ? -1 : 1));

        setPhotoMissions(mappedPhotoMissions);

        if (selectedMissionName === "all") {
            setFilteredMissions(mappedPhotoMissions);
        } else {
            const filtered = mappedPhotoMissions.filter(m => m.missioN_ID === selectedMissionName);
            console.log("Filtered Missions:", filtered); // ดูว่าผลการกรองมี 105 หรือไม่
            setFilteredMissions(filtered);
        }
    }, [ApprovePhoto, selectedMissionName]);



    useEffect(() => {
        if (selectedMissionName !== "all" && Array.isArray(allMission)) {
            const missionData = allMission.find(ms => ms.missioN_ID === selectedMissionName);
            setCoinAmount(missionData?.coin_Reward || 0);
        } else {
            setCoinAmount(0);
        }
    }, [selectedMissionName, allMission]);

    useEffect(() => {
        const storedMissionId = localStorage.getItem("selectedMissionId");
        if (storedMissionId) {
            setSelectedMissionName(storedMissionId);
        }
    }, []);

    const handleMissionFilter = (e) => {
        const missionId = e.target.value;
        setSelectedMissionName(missionId);
        localStorage.setItem("selectedMissionId", missionId);

        if (missionId === "all") {
            setFilteredMissions(photoMissions);
        } else {
            setFilteredMissions(photoMissions.filter(mission => mission.missioN_ID === missionId));
        }
    };

    const uniqueMissions = Array.from(
        new Map(photoMissions.map(mission => [mission.missioN_ID, mission.missioN_NAME])).entries()
    );

    const handleAction = async (missionId, isApproved) => {
        try {
            let accepted_Desc = 'Completed'
            if(!isApproved){
                accepted_Desc = prompt("Please enter the reason for rejection.")
                if(accepted_Desc===null||accepted_Desc.trim()===""){
                    alert("Rejection Reason is required")
                    return
                }
            }
            await approvePhoto(missionId, isApproved,accepted_Desc);
            setFilteredMissions(filteredMissions.filter(m => m.userPhotoMissionId !== missionId));
            alert(isApproved ? "Mission approved successfully!" : "Mission rejected successfully!");
            refetch();
        } catch (err) {
            console.error("Error handling mission action:", err);
            alert("An error occurred while processing the mission.");
        }
    };

    const handleImageClick = (missionId, imgUrl, index) => {
        setSelectedMissionId(missionId);
        setSelectedImageIndex(index);
        setOpenModal(true);
    };

    const handleNextImage = () => {
        const mission = filteredMissions.find(m => m.userPhotoMissionId === selectedMissionId);
        if (mission && selectedImageIndex < mission.photo.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const handlePreviousImage = () => {
        if (selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    const closeModal = () => {
        setOpenModal(false);
        setSelectedImageIndex(null);
        setSelectedMissionId(null);
    };

    const handleCheckboxChange = (missionId) => {
        setSelectedMissions(prevSelected =>
            prevSelected.includes(missionId)
                ? prevSelected.filter(id => id !== missionId)
                : [...prevSelected, missionId]
        );
    };

    const handleSelectAll = () => {
        const selectableMissions = filteredMissions.filter(m => m.approve === null || m.approve === true);

        if (selectedMissions.length === selectableMissions.length) {
            setSelectedMissions([]);
        } else {
            setSelectedMissions(selectableMissions.map(m => m.userPhotoMissionId)); // ✅ เลือกเฉพาะ approve === null หรือ true
        }
    };

    const handleAddAllCoin = async () => {
        if (selectedMissions.length === 0) {
            alert("Please select at least one mission.");
            return;
        }

        if (coinAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        if (selectedMissionName === "all") {
            alert("Please select a specific mission before adding coins.");
            return;
        }

        try {
            await addAllCoinPhoto(selectedMissionName, coinAmount);
            alert(`Successfully added ${coinAmount} coins to mission ID: ${selectedMissionName}!`);

            setSelectedMissions([]);

            if (Array.isArray(allMission)) {
                const missionData = allMission.find(ms => ms.missioN_ID === selectedMissionName);
                setCoinAmount(missionData?.coin_Reward || 0);
            } else {
                setCoinAmount(0);
            }

            refetch();
        } catch (err) {
            console.error("Error adding coins:", err);
            alert("An error occurred while adding coins.");
        }
    };

    const handleApproveAll = async () => {
        try {
            const unapprovedMissions = filteredMissions.filter(m => selectedMissions.includes(m.userPhotoMissionId) && m.approve === null);
            if (unapprovedMissions.length === 0) {
                alert("Please select at least one unapproved mission.");
                return;
            }

            await Promise.all(unapprovedMissions.map(mission => approvePhoto(mission.userPhotoMissionId, true,'Complete')));
            alert("All selected missions approved successfully!");
            refetch();
            setSelectedMissions([]);
        } catch (err) {
            console.error("Error approving all selected missions:", err);
            alert("An error occurred while approving all missions.");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-button-text">Photo Missions</h2>

            {/* 🔹 Mission Name Filter */}
            <div className="p-3">
                <select onChange={handleMissionFilter} value={selectedMissionName} className="select select-sm select-error bg-bg text-button-text">
                    <option value="all">Select Mission</option>
                    {uniqueMissions.map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>
            </div>

            {/* 🔹 Select All + Amount + Add Coin */}
            <div className="p-3 flex gap-4 items-center">
                <input
                    type="checkbox"
                    className="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedMissions.length > 0 && selectedMissions.length === filteredMissions.filter(m => m.approve === null || m.approve === true).length}
                />
                <label className="text-button-text">Select All</label>

                <input
                    type="number"
                    className="input input-bordered input-sm bg-bg border-button-text p-1 w-14 text-button-text"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(Number(e.target.value))}
                    placeholder="Amount"
                    readOnly
                />
                <button className="btn btn-warning btn-sm" onClick={() => document.getElementById('winner_modal').showModal()}>Add Coin To Winner</button>
                <button className="btn btn-primary btn-sm" onClick={handleAddAllCoin} disabled={selectedMissions.length === 0} >
                    Add Coin
                </button>
                <button className="btn btn-success btn-sm" onClick={handleApproveAll} disabled={selectedMissions.length === 0}>
                    Approve All
                </button>
                <h1>{filteredMissions.length}</h1>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <dialog id="winner_modal" className="modal">
                    <div className="modal-box bg-bg text-button-text">
                        <h3 className="font-bold text-lg">🏆 เลือกผู้ชนะ</h3>

                        {selects.map((select, index) => (
                            <div key={index} className="flex gap-2 items-center mt-2">
                                {/* Select User */}
                                <select
                                    className="select select-warning w-1/2 bg-bg"
                                    value={select.user}
                                    onChange={(e) => handleSelectChange(index, "user", e.target.value)}
                                >
                                    <option disabled value="">Select user</option>
                                    <option>User A</option>
                                    <option>User B</option>
                                    <option>User C</option>
                                </select>

                                {/* Select Rank */}
                                <select
                                    className="select select-info w-1/2 bg-bg"
                                    value={select.rank}
                                    onChange={(e) => handleSelectChange(index, "rank", e.target.value)}
                                >
                                    <option>อันดับ 1</option>
                                    <option>อันดับ 2</option>
                                    <option>อันดับ 3</option>
                                    <option>อันดับ 4</option>
                                </select>
                            </div>
                        ))}


                        <div className="flex gap-2 mt-4">
                            <button onClick={addSelect} className="btn btn-primary btn-sm">เพิ่มผู้ชนะ</button>
                            <button onClick={removeSelect} className="btn btn-secondary btn-sm">ลบรายการ</button>
                        </div>

                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn btn-error btn-sm">ปิด</button>
                            </form>
                        </div>
                    </div>
                </dialog>



                {/* <div className="stats shadow">
                    <div className="stat place-items-center">
                        <div className="stat-title">Downloads</div>
                        <div className="stat-value">31K</div>
                    </div>

                    <div className="stat place-items-center">
                        <div className="stat-title">Users</div>
                        <div className="stat-value text-secondary">4,200</div>
                    </div>

                    <div className="stat place-items-center">
                        <div className="stat-title">New Registers</div>
                        <div className="stat-value">1,200</div>
                    </div>
                </div> */}
            </div>
            <div className="flex justify-end mb-4">
                <button
                    className="px-4 py-2 border rounded-md bg-blue-500 text-white"
                    onClick={() => setIsTableLayout(!isTableLayout)}
                >
                    {isTableLayout ? <WindowOutlinedIcon /> : <FormatListBulletedOutlinedIcon />}
                </button>
            </div>
            {/* แสดง Table เฉพาะเมื่อเลือก Mission ที่เฉพาะเจาะจง */}
            {/* {selectedMissionName !== "all" && filteredMissions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-button-text">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Select</th>
                                <th className="border p-2">Mission Name</th>
                                <th className="border p-2">Username</th>
                                <th className="border p-2">Submission Date</th>
                                <th className="border p-2 w-72">Photos</th>
                                <th className="border p-2">Approve By</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMissions.map(mission => (
                                <tr key={mission.userPhotoMissionId} className="hover:bg-gray-50">
                                    <td className="border p-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={selectedMissions.includes(mission.userPhotoMissionId)}
                                            onChange={() => handleCheckboxChange(mission.userPhotoMissionId)}
                                            disabled={mission.approve === false} // ❌ ถ้า approve === false → ห้ามเลือก
                                        />
                                    </td>
                                    <td className="border p-2">{mission.missioN_NAME}</td>
                                    <td className="border p-2">
                                        {
                                            alluserDetail.find(user => user.a_USER_ID === mission.a_USER_ID)?.user_Name || "-"
                                        }
                                    </td>
                                    <td className="border p-2">{new Date(mission.uploadeD_AT).toLocaleString()}</td>
                                    <td className="border p-2 flex gap-2">
                                        <div className="grid grid-cols-4 gap-2">
                                            {mission.photo?.map((imgUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imgUrl}
                                                    alt={`Mission Submission ${index + 1}`}
                                                    className="h-16 w-16 rounded-lg shadow-md object-cover cursor-pointer hover:scale-"
                                                    onClick={() => handleImageClick(mission.userPhotoMissionId, imgUrl, index)}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="border p-2">
                                        {
                                            alluserDetail.find(user => user.a_USER_ID === mission.approve_By)?.user_Name || "-"
                                        }
                                    </td>
                                    <td className="border p-2">
                                        <div>
                                            {mission.approve === null ? (
                                                // หาก approve เป็น null ให้แสดงปุ่ม
                                                <>
                                                    <button
                                                        className="btn btn-success btn-xs"
                                                        onClick={() => handleAction(mission.userPhotoMissionId, true)}
                                                        disabled={mission.approve !== null}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-error btn-xs"
                                                        onClick={() => handleAction(mission.userPhotoMissionId, false)}
                                                        disabled={mission.approve !== null}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : mission.approve === true ? (
                                                // หาก approve เป็น true ให้แสดงข้อความ "Approved"
                                                <span className="text-green-500">Approved</span>
                                            ) : (
                                                // หาก approve เป็น false ให้แสดงข้อความ "Rejected"
                                                <span className="text-red-500">Rejected</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-10">Please select a mission to display the table.</p>
            )} */}
            {/* {selectedMissionName !== "all" && filteredMissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMissions.map(mission => (
                        <div key={mission.userPhotoMissionId} className="bg-white border border-gray-300 rounded-lg shadow-md p-4">

                            <div className="flex justify-between items-center mb-4">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={selectedMissions.includes(mission.userPhotoMissionId)}
                                    onChange={() => handleCheckboxChange(mission.userPhotoMissionId)}
                                    disabled={mission.approve === false} // ถ้า approve === false → ห้ามเลือก
                                />
                                <span className="text-xl font-semibold">{mission.missioN_NAME}</span>
                            </div>
                            <div className="flex gap-2">
                            <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-60"
        >
            {mission.photo?.map((imgUrl, index) => (
                <SwiperSlide key={index}>
                    <img
                        // src={imgUrl}
                        src="./wallpaper001.jpg"
                        alt={`Mission Submission ${index + 1}`}
                        className="h-full w-full rounded-lg shadow-md object-cover cursor-pointer"
                        onClick={() => handleImageClick(mission.userPhotoMissionId, imgUrl, index)}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
                            </div>
                            <div className="mb-4">
                                <div className="font-medium text-gray-700"></div>
                                <div className="text-gray-500">
                                    Username: {
                                        alluserDetail.find(user => user.a_USER_ID === mission.a_USER_ID)?.user_Name || "-"
                                    }
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                <div className="font-medium text-gray-700">Submission Date:</div>
                                <div className="text-gray-500">
                                    {new Date(mission.uploadeD_AT).toLocaleString()}
                                </div>
                                </div>
                                <div className="">
                                <div className="font-medium text-gray-700">Approve By:</div>
                                <div className="text-gray-500">
                                    {
                                        alluserDetail.find(user => user.a_USER_ID === mission.approve_By)?.user_Name || "-"
                                    }
                                </div>
                            </div>
                            </div>
                           

                            <div className="flex justify-between items-center mt-4">
                                {mission.approve === null ? (
                                    <>
                                        <button
                                            className="btn btn-success btn-xs"
                                            onClick={() => handleAction(mission.userPhotoMissionId, true)}
                                            disabled={mission.approve !== null}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn btn-error btn-xs"
                                            onClick={() => handleAction(mission.userPhotoMissionId, false)}
                                            disabled={mission.approve !== null}
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : mission.approve === true ? (
                                    <span className="text-green-500">Approved</span>
                                ) : (
                                    <span className="text-red-500">Rejected</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-10">Please select a mission to display the cards.</p>
            )} */}
            {selectedMissionName !== "all" && filteredMissions.length > 0 ? (
                isTableLayout ? (
                    // 🟢 Table View
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-button-text">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">Select</th>
                                    <th className="border p-2">EmployeeID</th>
                                    <th className="border p-2">EmployeeName</th>
                                    <th className="border p-2">Department</th>
                                    <th className="border p-2">Submission Date</th>
                                    <th className="border p-2 w-72">Photos</th>
                                    <th className="border p-2">Action</th>
                                    <th className="border p-2">Approver</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMissions.map(mission => (
                                    <tr key={mission.userPhotoMissionId} className="hover:bg-gray-50">
                                        <td className="border p-2">
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={selectedMissions.includes(mission.userPhotoMissionId)}
                                                onChange={() => handleCheckboxChange(mission.userPhotoMissionId)}
                                                disabled={mission.approve === false}
                                            />
                                        </td>
                                        <td className="border p-2">{mission.logoN_NAME}</td>
                                        <td className="border p-2">{mission.useR_NAME}</td>
                                        <td className="border p-2">{mission.branchCode}-{mission.department}</td>
                                        <td className="border p-2">{new Date(mission.uploadeD_AT).toLocaleString()}</td>
                                        <td className="border p-2">
                                            <div className="grid grid-cols-4 gap-2">
                                                {(convertedPhotos[mission.userPhotoMissionId] || mission.photo)?.map((imgUrl, index) => (
                                                    <img
                                                        key={index}
                                                        src={imgUrl}
                                                        alt={`Mission Submission ${index + 1}`}
                                                        className="h-16 w-16 rounded-lg shadow-md object-cover cursor-pointer"
                                                        onClick={() => handleImageClick(mission.userPhotoMissionId, imgUrl, index)}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="border p-2">
                                            <div className="flex gap-3">
                                                {mission.approve === null ? (
                                                    <>
                                                        <button className="btn btn-success btn-xs" onClick={() => handleAction(mission.userPhotoMissionId, true)}>
                                                            Approve
                                                        </button>
                                                        <button className="btn btn-error btn-xs" onClick={() => handleAction(mission.userPhotoMissionId, false)}>
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : mission.approve === true ? (
                                                    <span className="text-green-500">Approved</span>
                                                ) : (
                                                    <span className="text-red-500">Rejected</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="border p-2 flex flex-col">
                                            {
                                                alluserDetail.find(user => user.a_USER_ID === mission.approve_By)?.user_Name || "-"
                                            }
                                            <span className='text-xs text-gray-400'>
                                                {mission.approve_DATE ? new Date(mission.approve_DATE).toLocaleString() : '-'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // 🟢 Card View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-button-text">
                        {filteredMissions.map(mission => (
                            <div key={mission.userPhotoMissionId} className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-semibold">{mission.useR_NAME}</span>
                                        <span className="text-sm">{mission.branchCode}-{mission.department}</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={selectedMissions.includes(mission.userPhotoMissionId)}
                                        onChange={() => handleCheckboxChange(mission.userPhotoMissionId)}
                                        disabled={mission.approve === false}
                                    />
                                </div>

                                <Swiper modules={[Navigation, Pagination]} spaceBetween={10} slidesPerView={1} navigation pagination={{ clickable: true }} className="w-full h-60">
                                    {(convertedPhotos[mission.userPhotoMissionId] || mission.photo)?.map((imgUrl, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={imgUrl}
                                                alt={`Mission Submission ${index + 1}`}
                                                className="h-full w-full rounded-lg shadow-md object-cover cursor-pointer"
                                                onClick={() => handleImageClick(mission.userPhotoMissionId, imgUrl, index)}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                <div className="flex justify-between">
                                    <div className="font-medium text-gray-700">Submit Date:</div>
                                    <div className="text-gray-500">{new Date(mission.uploadeD_AT).toLocaleString()}</div>
                                </div>
                                <div className="divider"></div>
                                <div className="flex justify-between">
                                    <div className="flex flex-col">
                                        <div className="font-medium text-gray-700">Approve Date:</div>
                                        <div className="text-gray-500">{mission.approve_DATE ? new Date(mission.approve_DATE).toLocaleString() : '-'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-700">Approve By:</div>
                                        <div className="text-gray-500">
                                            {alluserDetail.find(user => user.a_USER_ID === mission.approve_By)?.user_Name || "-"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    {mission.approve === null ? (
                                        <>
                                            <button className="btn btn-success btn-sm w-24" onClick={() => handleAction(mission.userPhotoMissionId, true)}>Approve</button>
                                            <button className="btn btn-error btn-sm w-24" onClick={() => handleAction(mission.userPhotoMissionId, false)}>Reject</button>
                                        </>
                                    ) : mission.approve === true ? (
                                        <span className="text-green-500">Approved</span>
                                    ) : (
                                        <span className="text-red-500">Rejected</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <p className="text-gray-500 text-center mt-10">Please select a mission to display the table.</p>
            )}


            {/* Modal for Image Viewing */}
            <Dialog open={openModal} onClose={closeModal} maxWidth="md" fullWidth>
                <DialogTitle className="text-center"></DialogTitle>
                <DialogContent className="relative flex justify-center items-center">
                    <button
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black text-3xl"
                        onClick={handlePreviousImage}
                        disabled={selectedImageIndex <= 0}
                    >
                        <ArrowBackIcon />
                    </button>

                    {filteredMissions.find(m => m.userPhotoMissionId === selectedMissionId)?.photo?.[selectedImageIndex] && (
                        <img
                            src={filteredMissions.find(m => m.userPhotoMissionId === selectedMissionId)?.photo[selectedImageIndex]}
                            alt={`Mission Image ${selectedImageIndex + 1}`}
                            className="max-h-[500px] max-w-full object-contain"
                        />
                    )}

                    <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black text-3xl"
                        onClick={handleNextImage}
                        disabled={selectedImageIndex >= filteredMissions.find(m => m.userPhotoMissionId === selectedMissionId)?.photo.length - 1}
                    >
                        <ArrowForwardIcon />
                    </button>
                </DialogContent>
                <DialogActions className="justify-center">
                    <button className="btn btn-error" onClick={closeModal}>Close</button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PhotoMissionTable;
