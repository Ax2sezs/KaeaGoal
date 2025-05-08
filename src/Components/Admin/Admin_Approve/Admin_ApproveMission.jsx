import React, { useState, useEffect } from 'react';
import useFetchData from '../../APIManage/useFetchData';
import { useAuth } from "../../APIManage/AuthContext";
import PhotoTable from './PhotoTable';
import TextTable from './TextTable';
import VideoTable from './VideoTable';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import { Autocomplete, TextField } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

const Admin_ApproveMission = () => {
    const { user } = useAuth();
    const {
        getMission,
        fetchByMission,
        fetchApprovePhotoByMission,
        fetchApproveTextByMission,
        fetchApproveVideoByMission,
        isLoading,
        error,
        ApprovePhotoByName,
        ApproveTextByName,
        ApproveVideoByName,
        approvePhoto,
        approveText,
        approveVideo,
        addAllWinnerCoin,
        fetchUsersInMission,
        setView,
    } = useFetchData(user?.token);

    const [missionType, setMissionType] = useState('');
    const [missions, setMissions] = useState([]);
    const [missionId, setMissionId] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalPage, setTotalPage] = useState(1);
    const [isTableLayout, setIsTableLayout] = useState(false);
    const [totalParticipants, setTotalParticipants] = useState(0); const [selects, setSelects] = useState([{ user: "", rank: "" }]);
    const [userOptions, setUserOptions] = useState([]);
    const selectedMission = missions.find(m => m.missioN_ID === missionId);
    const [searchName, setSearchName] = useState('');
    const [rejectDes, setRejectDes] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [isRejecting, setIsRejecting] = useState(false); // เพื่อแยก approve/reject
    const [selectedReason, setSelectedReason] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success'); // หรือ 'error'
    const [showAlert, setShowAlert] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const approveDataMap = {
        photo: ApprovePhotoByName,
        text: ApproveTextByName,
        video: ApproveVideoByName,
    };

    const currentApproveList = approveDataMap[missionType] || [];


    const handleSelectChange = (index, field, value) => {
        const newSelects = [...selects];
        newSelects[index][field] = value;
        setSelects(newSelects);
    };

    const addSelect = () => {
        setSelects([...selects, { user: "", rank: "" }]);
    };

    const removeSelect = () => {
        if (selects.length > 1) {
            setSelects(selects.slice(0, -1));
        }
    };

    const handleSubmitWinner = async () => {
        const isAllSelected = selects.every(s => s.user && s.rank);
        const winners = selects.filter(s => s.user && s.rank);  // คัดกรองผู้ชนะที่เลือก
        console.log("🔥 winners ที่จะส่ง:", winners);

        if (winners.length === 0) {
            alert("กรุณาเลือกผู้ชนะอย่างน้อย 1 คน");
            return;
        }

        try {
            // ใช้ Promise.all เพื่อส่งข้อมูลผู้ชนะทั้งหมดพร้อมกัน
            await Promise.all(winners.map(winner =>
                addAllWinnerCoin(winner.user, missionId, winner.rank)
            ));

            alert("บันทึกผู้ชนะสำเร็จ");
            document.getElementById("winner_modal").close();
        } catch (error) {
            console.error("ส่งข้อมูลผู้ชนะผิดพลาด", error);
            alert("เกิดข้อผิดพลาดในการบันทึกผู้ชนะ");
        }
    };
    const getFilteredUserOptions = (index) => {
        const selectedUsers = selects
            .filter((_, i) => i !== index)
            .map(select => select.user);
        return userOptions.filter(user => !selectedUsers.includes(user.a_USER_ID));
    };

    useEffect(() => {
        const fetchMissions = async () => {
            if (missionType) {
                localStorage.setItem('missionType', missionType);
                const result = await fetchByMission(missionType);
                setMissions(result || []);
            } else {
                setMissions([]);
            }
        };
        fetchMissions();
    }, [missionType]);

    useEffect(() => {
        if (missionId) {
            localStorage.setItem('currentMissionId', missionId);
            localStorage.setItem('currentPage', page.toString());
            const fetchData = {
                photo: fetchApprovePhotoByMission,
                text: fetchApproveTextByMission,
                video: fetchApproveVideoByMission,
            }[missionType];
            fetchData?.(missionId, page, pageSize, searchName).then((res) => {
                setTotalPage(res?.totalPage || 0);
                setTotalParticipants(res?.total || 0); // ✅ เก็บจำนวนทั้งหมดไว้แสดงผล
            });
        }
    }, [missionId, page, missionType, searchName]);

    useEffect(() => {
        const savedType = localStorage.getItem('missionType');
        const savedMissionId = localStorage.getItem('currentMissionId');
        const savedPage = parseInt(localStorage.getItem('currentPage')) || 1;

        if (savedMissionId) {
            setMissionType(savedType);
            setMissionId(savedMissionId);
            setPage(savedPage);
        }
    }, []);
    useEffect(() => {
        const fetchUsers = async () => {
            if (missionId && missionType) {
                const users = await fetchUsersInMission(missionId, missionType);
                setUserOptions(users || []);
            } else {
                setUserOptions([]);
            }
        };
        fetchUsers();
    }, [missionId, missionType]);


    // const handleAction = async (id, isApproved) => {
    //     try {
    //         let accepted_Desc = 'Completed';
    //         if (!isApproved) {
    //             accepted_Desc = prompt("Please enter the reason for rejection.");
    //             document.getElementById('reject_modal').showModal(); // เปิด modal
    //             if (accepted_Desc === null || accepted_Desc.trim() === "") {
    //                 alert("Rejection Reason is required");
    //                 return;
    //             }
    //         }

    //         const approveFn = {
    //             photo: approvePhoto,
    //             text: approveText,
    //             video: approveVideo,
    //         }[missionType];

    //         const fetchFn = {
    //             photo: fetchApprovePhotoByMission,
    //             text: fetchApproveTextByMission,
    //             video: fetchApproveVideoByMission,
    //         }[missionType];

    //         await approveFn(id, isApproved, accepted_Desc);
    //         alert(isApproved ? "Mission approved successfully!" : "Mission rejected successfully!");
    //         fetchFn(missionId, page, pageSize);
    //     } catch (err) {
    //         console.error("Error handling mission action:", err);
    //         alert("An error occurred while processing the mission.");
    //     }
    // };

    const handleAction = (id, isApproved) => {
        if (!isApproved) {
            setSelectedId(id); // เก็บ id ไว้ตอน reject
            setIsRejecting(true); // flag สำหรับ reject
            document.getElementById('reject_modal').showModal();
        } else {
            processApproval(id, true, "Completed");
        }
    };

    const processApproval = async (id, isApproved, accepted_Desc) => {
        try {
            const approveFn = {
                photo: approvePhoto,
                text: approveText,
                video: approveVideo,
            }[missionType];

            const fetchFn = {
                photo: fetchApprovePhotoByMission,
                text: fetchApproveTextByMission,
                video: fetchApproveVideoByMission,
            }[missionType];

            await approveFn(id, isApproved, accepted_Desc);

            setAlertMessage(isApproved ? "Mission approved successfully!" : "Mission rejected successfully!");
            setAlertType(isApproved ? "success" : "error");
            setShowAlert(true);

            // รอให้ refetch เสร็จก่อนจะขยับต่อ
            await fetchFn(missionId, page, pageSize);

            // Reset
            setRejectDes('');
            setSelectedId(null);
            setIsRejecting(false);
            setTimeout(() => setShowAlert(false), 3000);

        } catch (err) {
            console.error("Error handling mission action:", err);
            alert("An error occurred while processing the mission.");
        }
    };

    const handleToggleView = async (id, newIsView) => {
        try {
            await setView(missionType, id, newIsView);
            const fetchFn = {
                photo: fetchApprovePhotoByMission,
                text: fetchApproveTextByMission,
                video: fetchApproveVideoByMission,
            }[missionType];

            fetchFn(missionId, page, pageSize, searchName);
        } catch (error) {
            console.error("Error toggling view:", error);
            alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะการแสดงผล");
        }
    };

    const reasonToUse =
        selectedReason === "Other" ? rejectDes.trim() : selectedReason;


    const tableMap = {
        photo: <PhotoTable
            data={ApprovePhotoByName}
            currentPage={page}
            totalPage={totalPage}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            isTableLayout={isTableLayout}
            approve={handleAction}
            view={handleToggleView}
        />,
        text: <TextTable
            data={ApproveTextByName}
            currentPage={page}
            totalPage={totalPage}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            isTableLayout={isTableLayout}
            approve={handleAction}
            view={handleToggleView}

        />,
        video: <VideoTable
            data={ApproveVideoByName}
            currentPage={page}
            totalPage={totalPage}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            isTableLayout={isTableLayout}
            approve={handleAction}
            view={handleToggleView}
        />
    };

    return (
        <div className="p-6 mx-auto w-full text-button-text">
            <h2 className="text-2xl font-bold">Approve Mission</h2>
            <div className="mt-4 text-lg font-medium text-button-text bg-bg p-4 rounded-lg flex flex-col md:flex-row md:justify-between gap-2 md:gap-4">
                <div>
                    Type: <span className="capitalize">{missionType || '—'}</span>
                </div>
                <div>
                    {missions.find(m => m.missioN_ID === missionId)?.is_Public ? (
                        <span className="text-red-500">(Public) - </span>
                    ) : (
                        ''
                    )}
                    Mission:
                    <span>
                        {getMission.find(m => m.missioN_ID === missionId)?.missioN_NAME || '—'}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    {missions.find(m => m.missioN_ID === missionId)?.coin_Reward.toLocaleString() || 0}

                    <img src="./1.png" className="w-5 h-5" />
                </div>
                <div>
                    Participants: <span>{missionId ? totalParticipants : '—'}</span> User
                </div>
            </div>




            {/* เลือกประเภทภารกิจ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
                <div>
                    <label htmlFor="missionType" className="block mb-1 font-semibold">Select Mission Type</label>
                    <select
                        id="missionType"
                        value={missionType}
                        onChange={(e) => {
                            const selectedType = e.target.value;

                            // ล้างค่าก่อนตั้งค่าใหม่
                            setMissionId('');
                            setPage(1);
                            setMissions([]);
                            localStorage.removeItem('missionType');
                            localStorage.removeItem('currentMissionId');
                            localStorage.removeItem('currentPage');

                            if (selectedType !== "") {
                                setMissionType(selectedType);
                                localStorage.setItem('missionType', selectedType);
                            } else {
                                setMissionType('');
                            }
                        }}

                        className="select select-bordered w-full bg-bg text-button-text"
                    >
                        <option value="">-- Select Type --</option>
                        <option value="photo">📸 Photo</option>
                        <option value="text">✏️ Text</option>
                        <option value="video">🎥 Video</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="missionId" className="block mb-1 font-semibold">Select Mission</label>
                    <select
                        id="missionId"
                        value={missionId}
                        onChange={(e) => {
                            const selectedId = e.target.value;

                            // ล้างก่อนตั้งค่าใหม่
                            setPage(1);
                            localStorage.removeItem('currentMissionId');
                            localStorage.removeItem('currentPage');

                            if (selectedId !== "") {
                                setMissionId(selectedId);
                                localStorage.setItem('currentMissionId', selectedId);
                                localStorage.setItem('currentPage', '1');
                            } else {
                                setMissionId('');
                            }
                        }}

                        className="select select-bordered w-full bg-bg text-button-text"
                        disabled={!missionType}
                    >
                        <option value="">-- Select Mission --</option>
                        {[...missions]
                            .sort((a, b) => new Date(b.start_DATE) - new Date(a.start_DATE)) // 🔥 เรียง createD_AT ใหม่ก่อน
                            .map((mission) => {
                                const isExpired = new Date(mission.expire_DATE) < new Date(); // 🔥 เช็คหมดอายุ
                                return (
                                    <option key={mission.missioN_ID} value={mission.missioN_ID}>
                                      {isExpired ? '(EXPIRED) -- ' : ''}{mission.missioN_NAME} ({mission.coin_Reward})Coin 
                                    </option>
                                );
                            })
                        }
                    </select>
                </div>
                <div>
                    <label htmlFor="searchName" className="block mb-1 font-semibold">Search by Name</label>
                    <input
                        type="text"
                        id="searchName"
                        value={searchName}
                        onChange={(e) => {
                            setSearchName(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Enter name to search"
                        className="input input-bordered w-full bg-bg text-button-text"
                    />
                </div>
            </div>
            {/* <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-5 my-4 sm:w-full'> */}
            <div className='grid grid-cols-3'>
                {/* Description + Show More */}
                <div className="col-span-2 w-full">
                    {selectedMission?.description?.length > 100 ? (
                        <div className='flex gap-3'>
                            <p className="whitespace-pre-line">{selectedMission.description.slice(0, 100)}...</p>
                            <button
                                className="btn btn-sm btn-outline btn-info mt-1"
                                onClick={() => document.getElementById('showMore').showModal()}
                            >
                                Show More
                            </button>
                        </div>
                    ) : (
                        <p className="whitespace-pre-line">{selectedMission?.description}</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-end justify-end gap-3">
                    <button
                        className='btn btn-circle btn-neutral hover:animate-spin'
                        onClick={() => window.location.reload()}
                        title="Reload"
                    >
                        <RefreshIcon />
                    </button>

                    <button
                        onClick={() => document.getElementById('winner_modal').showModal()}
                        className="btn btn-success text-white"
                        disabled={!missionId || (selectedMission?.is_Winners !== true)}
                    >
                        Select Winners
                    </button>

                    <button
                        className='btn btn-error text-bg border-hidden'
                        onClick={() => {
                            setMissionType('');
                            setMissionId('');
                            setPage(1);
                            setMissions([]);
                            localStorage.removeItem('missionType');
                            localStorage.removeItem('currentMissionId');
                            localStorage.removeItem('currentPage');
                        }}
                    >
                        Clear
                    </button>

                    <button
                        onClick={() => setIsTableLayout(!isTableLayout)}
                        className="btn btn-primary border-hidden text-bg"
                    >
                        {isTableLayout ? <WindowOutlinedIcon /> : <FormatListBulletedOutlinedIcon />}
                    </button>
                </div>
            </div>

            <div className="fixed top-24 left-[256px] w-[calc(100%-256px)] flex justify-center z-50">
                {showAlert && (
                    <div className={`transition-opacity duration-300 ${showAlert ? 'opacity-100' : 'opacity-0'}`}>
                        <div role="alert" className={`alert alert-${alertType}`}>
                            <span className='text-bg'>{alertMessage}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="divider"></div>

            <div className=''>
                {isLoading ? (
                    <div className="text-center text-gray-500">
                        <span className="loading loading-dots loading-lg"></span>
                    </div>
                ) : missionId ? (
                    tableMap[missionType]
                ) : (
                    <div className="text-center text-gray-500 mt-4">Please select Mission</div>
                )}
            </div>
            <dialog id="winner_modal" className="modal">
                <div className="modal-box bg-bg text-button-text h-full">
                    <h3 className="font-bold text-lg">🏆 Select Winners</h3>

                    {selects.map((select, index) => (
                        <div key={index} className="flex gap-2 items-center mt-2">
                            <Autocomplete
                                className="w-1/2"
                                options={getFilteredUserOptions(index)}
                                disablePortal
                                getOptionLabel={(user) =>
                                    `${user.branchCode}-${user.department}-${user.useR_NAME}`
                                }
                                value={userOptions.find(u => u.a_USER_ID === select.user) || null}
                                onChange={(event, newValue) => handleSelectChange(index, "user", newValue?.a_USER_ID || "")}
                                renderInput={(params) => (
                                    <TextField {...params} label="Select user" variant="outlined" size="small" />
                                )}
                                isOptionEqualToValue={(option, value) => option.a_USER_ID === value.a_USER_ID}
                            />


                            <select
                                className="select select-info w-1/2 bg-bg"
                                value={select.rank}
                                onChange={(e) => handleSelectChange(index, "rank", e.target.value)}
                            >
                                <option disabled value="">--Rank--</option>
                                <option value="1">Rank 1</option>
                                <option value="2">Rank 2</option>
                                <option value="3">Rank 3</option>
                            </select>
                        </div>
                    ))}

                    <div className="flex gap-2 mt-4">
                        <button onClick={addSelect} className="btn btn-primary btn-sm">Add Row</button>
                        <button onClick={removeSelect} className="btn btn-secondary btn-sm">Delete Row</button>
                    </div>

                    <div className="modal-action">
                        <button onClick={handleSubmitWinner} className="btn btn-success btn-sm " disabled={!selects.every(s => s.user && s.rank)}
                        >
                            Confirm
                        </button>
                        <form method="dialog">
                            <button className="btn btn-error btn-sm">Close</button>
                        </form>

                    </div>
                </div>
            </dialog>
            <dialog id="reject_modal" className="modal">
                <div className="modal-box bg-bg">
                    <h3 className="font-bold text-lg">Reason for Rejection</h3>

                    <select
                        className="select select-bordered w-full my-4 bg-bg"
                        value={selectedReason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                    >
                        <option value="" disabled>Select a reason (เลือกเหตุผล)</option>
                        <option value="Not relevant to the task (ไม่เกี่ยวข้อง)">Not relevant to the task (ไม่เกี่ยวข้อง)</option>
                        <option value="Inappropriate content (เนื้อหาที่ไม่เหมาะสม)">Inappropriate content (เนื้อหาที่ไม่เหมาะสม)</option>
                        <option value="Unclear or confusing (ไม่ชัดเจนหรือสับสน)">Unclear or confusing (ไม่ชัดเจนหรือสับสน)</option>
                        <option value="Off-topic (ออกนอกประเด็น)">Off-topic (ออกนอกประเด็น)</option>
                        <option value="Incomplete submission (ส่งข้อมูลไม่ครบถ้วน)">Incomplete submission (ส่งข้อมูลไม่ครบถ้วน)</option>
                        <option value="Duplicate or repetitive content (เนื้อหาซ้ำซ้อนหรือซ้ำเติม)">Duplicate or repetitive content (เนื้อหาซ้ำซ้อนหรือซ้ำเติม)</option>
                        <option value="Other">Other (อื่น ๆ) (กรุณาระบุ)</option>
                    </select>

                    {selectedReason === "Other" && (
                        <textarea
                            className="textarea textarea-bordered w-full my-4 bg-bg"
                            placeholder="Please enter the reason..."
                            value={rejectDes}
                            required
                            onChange={(e) => setRejectDes(e.target.value)}
                        />
                    )}

                    <div className="modal-action">
                        <form
                            method="dialog"
                            className="flex gap-2"
                            onSubmit={(e) => {
                                e.preventDefault(); // กันไม่ให้ form ปิด modal เอง

                                if (!reasonToUse || reasonToUse.trim() === "") {
                                    return; // ปล่อยให้ textarea โชว์ validation error เอง
                                }

                                processApproval(selectedId, false, reasonToUse);
                                setRejectDes('');
                                setSelectedReason('');
                                document.getElementById('reject_modal').close(); // ปิด modal manual
                            }}
                        >
                            <button type="submit" className="btn btn-error" disabled={!reasonToUse}>
                                Confirm Reject
                            </button>
                            <button type="button" className="btn btn-outline" onClick={() => document.getElementById('reject_modal').close()}>
                                Cancel
                            </button>
                        </form>

                    </div>
                </div>
            </dialog>
            <dialog id="showMore" className="modal">
                <div className="modal-box bg-bg">
                    <h3 className="font-bold text-lg mb-2">Mission Description</h3>
                    <p>{selectedMission?.description}</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-error">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>


        </div>
    );
};

export default Admin_ApproveMission;
