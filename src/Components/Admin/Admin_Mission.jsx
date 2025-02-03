import React, { useState } from "react";
import QRMissionTable from "./QRMissionTable";
import PhotoMissionTable from "./PhotoMIssionTable";
import useFetchData from "../APIManage/useFetchData";
import { useAuth } from "../APIManage/AuthContext";

const Admin_Mission = () => {
    const { user } = useAuth();
    const { ApproveQR, ApprovePhoto, error, isLoading, approveMission, approvePhoto,refetch } = useFetchData(user?.token);
    const [activeTab, setActiveTab] = useState("QR");
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="bg-bg w-full rounded-2xl min-h-screen p-3">
            {/* Tab Navigation */}
            <div className="flex border-b">
                <button
                    className={`p-3 w-1/2 text-center ${activeTab === "QR" ? "border-b-2  border-warning font-bold" : "text-gray-500"}`}
                    onClick={() => setActiveTab("QR")}
                >
                    QR Missions
                </button>
                <button
                    className={`p-3 w-1/2 text-center ${activeTab === "Photo" ? "border-b-2 border-warning font-bold" : "text-gray-500"}`}
                    onClick={() => setActiveTab("Photo")}
                >
                    Photo Missions
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-3">
                {activeTab === "QR" ? (
                    <QRMissionTable ApproveQR={ApproveQR} approveMission={approveMission} isLoading={isLoading} error={error} refetch={refetch} />
                ) : (
                    <PhotoMissionTable ApprovePhoto={ApprovePhoto} approvePhoto={approvePhoto} isLoading={isLoading} error={error} refetch={refetch} />
                )}
            </div>
        </div>
    );
};

export default Admin_Mission;
