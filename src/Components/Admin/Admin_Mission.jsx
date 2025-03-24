import React, { useState,useEffect } from "react";
import QRMissionTable from "./QRMissionTable";
import PhotoMissionTable from "./PhotoMIssionTable";
import TextMissionTable from "./TextMissionTable";
import useFetchData from "../APIManage/useFetchData";
import { useAuth } from "../APIManage/AuthContext";

const Admin_Mission = () => {
    const { user } = useAuth();
    const { allMission, alluserDetail, ApproveQR, ApprovePhoto, ApproveText, error, isLoading, 
        approveMission, approvePhoto, approveText, addAllCoinPhoto, addAllCoinText, addAllCoinQR, 
        fetchAllMissions,fetchAllUserDetails,fetchApprovePhoto,fetchApproveText,fetchApproveQR } = useFetchData(user?.token);

    const [activeTab, setActiveTab] = useState("QR");
    const [selectedMission, setSelectedMission] = useState("");
    const [coinAmount, setCoinAmount] = useState(0); // ✅ State เก็บค่า Amount

    useEffect(() => {
            if (user?.token) {
                fetchAllMissions()
                fetchAllUserDetails()
                fetchApprovePhoto()
                fetchApproveText()
                fetchApproveQR()
            }
          }, [user?.token, fetchAllMissions,fetchAllUserDetails,fetchApprovePhoto,fetchApproveText,fetchApproveQR]);

    // เลือก Mission ตาม Tab ที่ active
    const getOptions = () => {
        if (activeTab === "QR") return ApproveQR;
        if (activeTab === "Photo") return ApprovePhoto;
        if (activeTab === "Text") return ApproveText;
        return [];
    };

    // กรองข้อมูลใน Table ตาม Mission ที่เลือก
    const getFilteredMissions = () => {
        const missions = getOptions();
        if (selectedMission === "" || selectedMission === "all") {
            return missions;
        }
        return missions.filter(mission => mission.missioN_ID === selectedMission);
    };

    // ✅ ค้นหา Coin ของ Mission ที่เลือก
    const selectedMissionCoin = allMission?.find(m => m.missioN_ID === selectedMission)?.coin || 0;

    return (
        <div className="bg-bg w-full rounded-2xl min-h-screen p-3">
            <h2 className="text-2xl font-bold mb-6 text-button-text">Approve Missions</h2>

            {/* 🔹 Tab Navigation */}
            <div className="flex border-b">
                <button className={`p-3 w-1/3 text-center ${activeTab === "QR" ? "border-b-2 border-warning font-bold text-button-text" : "text-gray-500"}`} onClick={() => setActiveTab("QR")}>
                    QR Missions
                </button>
                <button className={`p-3 w-1/3 text-center ${activeTab === "Photo" ? "border-b-2 border-warning font-bold text-button-text" : "text-gray-500"}`} onClick={() => setActiveTab("Photo")}>
                    Photo Missions
                </button>
                <button className={`p-3 w-1/3 text-center ${activeTab === "Text" ? "border-b-2 border-warning font-bold text-button-text" : "text-gray-500"}`} onClick={() => setActiveTab("Text")}>
                    Text Missions
                </button>
            </div>

            {/* 🔹 Tab Content */}
            <div className="p-3">
                {activeTab === "QR" ? (
                    <QRMissionTable
                        ApproveQR={getFilteredMissions()}
                        approveMission={approveMission}
                        allMission={allMission}
                        alluserDetail={alluserDetail}
                        addAllCoinQR={addAllCoinQR}
                        isLoading={isLoading}
                        error={error}
                        refetch={fetchApproveQR}
                    />
                ) : activeTab === "Photo" ? (
                    <PhotoMissionTable
                        ApprovePhoto={getFilteredMissions()}
                        approvePhoto={approvePhoto}
                        allMission={allMission}
                        alluserDetail={alluserDetail}
                        addAllCoinPhoto={addAllCoinPhoto}
                        isLoading={isLoading}
                        error={error}
                        refetch={fetchApprovePhoto}
                    />
                ) : (
                    <TextMissionTable
                        ApproveText={getFilteredMissions()}
                        approveText={approveText}
                        allMission={allMission}
                        alluserDetail={alluserDetail}
                        addAllCoinText={addAllCoinText}
                        isLoading={isLoading}
                        error={error}
                        refetch={fetchApproveText}
                    />
                )}
            </div>
        </div>
    );
};

export default Admin_Mission;
