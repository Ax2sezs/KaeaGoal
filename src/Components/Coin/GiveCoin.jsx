import React, { useState } from "react";
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';
import { items } from "./item";

function GiveCoin() {
  const [selectedAgency, setSelectedAgency] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [coinValue, setCoinValue] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [recipientId, setRecipientId] = useState(null);  // Track selected recipient
  const [successMessage, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");

  const { user } = useAuth();
  const { alluserDetail = [], coinDetails, error, isLoading, giveCoin } = useFetchData(user?.token);

  const agencies = ["Head Office", "Branch", "Factory"];

  const handleAgencyChange = (e) => {
    const selected = e.target.value;
    setSelectedAgency(selected);
    setSelectedDept("");
    setFilteredItems([]);
  };

  const handleDeptChange = (e) => {
    const selected = e.target.value;
    setSelectedDept(selected);
    filterItems(selectedAgency, selected, nameFilter);
  };

  const handleNameChange = (e) => {
    const filter = e.target.value;
    setNameFilter(filter);
    if (filter === "") {
      setFilteredItems([]);
    } else {
      filterItems(selectedAgency, selectedDept, filter);
    }
  };

  const filterItems = (agency, department, name) => {
    const tempItems = items.filter(
      (item) =>
        (!agency || item.agency === agency) &&
        (!department || item.dept === department) &&
        (!name || item.name.toLowerCase().includes(name.toLowerCase()))
    );
    setFilteredItems(tempItems);
  };

  const handleCoinChange = (e) => setCoinValue(e.target.value);
  const handleConfirmChange = (e) => setIsConfirmed(e.target.checked);

  // Function to handle giving the coin
  const handleGiveCoin = async () => {
    if (!coinValue || !recipientId) {
      setError("Please enter a valid amount and select a recipient.");
      console.log("Error: Invalid amount or recipient not selected.");
      return;
    }
    try {
      // Trigger the API call to give the coin
      await giveCoin(recipientId, coinValue);
      setCoinValue(""); // Clear the input after successful transaction
      setIsConfirmed(false); // Reset the checkbox
      setSuccess("Coin successfully given!");
      console.log(`Success: Coin given to recipient ID: ${recipientId}, Amount: ${coinValue}`);
    } catch (err) {
      // Handle any errors during the coin giving process
      setError("Failed to give coin. Please try again.");
      console.error("Error: Coin giving failed", err);
      console.log(`Failure: Coin giving failed to recipient ID: ${recipientId}, Amount: ${coinValue}`);
    }
  };


  const openModal = (idx, receiverId) => {
    setRecipientId(receiverId); // Set the recipient ID when opening the modal
    console.log(`Selected Receiver: ${receiverId}`); // Log the selected receiver's ID
    console.log(`Entered Coin Amount: ${coinValue}`); // Log the current coin value
    document.getElementById(`modal-${idx}`).showModal();
  };

  const closeModal = (idx) => {
    setRecipientId(null); // Reset recipient ID when closing the modal
    document.getElementById(`modal-${idx}`).close();
  };

  return (
    <div>
      <div className="flex flex-col gap-5 justify-center items-center w-">
        <div className="">Favorite</div>
        <div
          className="flex flex-row mb-4 gap-3 overflow-x-auto scrollbar-hidden w-80 px-2 pt-2 "
          style={{ scrollBehavior: "smooth" }}
        >
          {alluserDetail.map((item, index) => (
            <div key={index} className="group">
              <div className="avatar flex flex-col justify-center items-center transition-transform duration-300 ease-in-out">
                <div className="w-24 h-24 rounded-full group-hover:scale-105">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt={`Avatar ${index + 1}`}
                  />
                </div>
                <span className="text-xs text-black">Test</span>
              </div>
            </div>
          ))}
        </div>
        <h1>{coinDetails?.remainingThankCoinGive} Remaining for today</h1>
        {/* Filter Inputs */}
        <div className="flex flex-col gap-5">
          <div className="mb-4">
            <label className="block mb-2 font-bold text-lg">Select Agency</label>
            <select
              className="select select-bordered rounded-badge bg-transparent border-heavy-color w-full max-w-xs"
              value={selectedAgency}
              onChange={handleAgencyChange}
            >
              <option disabled value="">Choose an agency</option>
              {agencies.map((agency, idx) => (
                <option key={idx} value={agency}>{agency}</option>
              ))}
            </select>
          </div>

          {/* Department Dropdown */}
          <div className="mb-4">
            <label className="block mb-2 font-bold text-lg">Select Department</label>
            <select
              className="select select-bordered rounded-badge bg-transparent border-heavy-color w-full max-w-xs"
              value={selectedDept}
              onChange={handleDeptChange}
              disabled={!selectedAgency}
            >
              <option disabled value="">
                {selectedAgency ? "Choose a department" : "Select an agency first"}
              </option>
              {filteredItems.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Display Filtered Items */}
      <div>
        <h4 className="text-lg font-bold text-button-text mb-4">Filtered Items</h4>
        {alluserDetail.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 lg:grid-cols-3">
            {alluserDetail.map((item, idx) => (
              <button
                key={idx}
                className="p-4 border rounded-lg bg-gray-100 shadow-md flex flex-col text-left transition-transform duration-300 hover:scale-105"
                onClick={() => openModal(idx, item.a_USER_ID)} // Pass the user ID to the modal
              >
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="text-button-text font-medium">
                      <strong>Name:</strong> {item.logoN_NAME}
                    </p>
                    <p className="text-button-text">
                      <strong>Code:</strong> {item.branchCode}
                    </p>
                    <p className="text-button-text">
                      <strong>Agency:</strong> {item.branch}
                    </p>
                  </div>
                  {/* <div>
                    <img src="src/assets/2.png" alt="Coin" className="w-14 h-14" />
                  </div> */}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-4">Please select an agency and department or filter by name.</p>
        )}
      </div>

      {/* Modals */}
      {alluserDetail.map((item, idx) => (
        <dialog id={`modal-${idx}`} className="modal" key={`modal-${idx}`}>
          <div className="modal-box bg-bg">
            <h3 className="font-bold text-lg">Give Coin to {item.logoN_NAME}</h3>
            <div className="py-4">
              <label className="block mb-2 font-medium">Enter Coin Amount</label>
              <input
                type="number"
                className="input input-bordered w-full bg-bg border-heavy-color"
                value={coinValue}
                onChange={handleCoinChange}
              />
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id={`confirm-${idx}`}
                  className="checkbox mr-2"
                  checked={isConfirmed}
                  onChange={handleConfirmChange}
                />
                <label htmlFor={`confirm-${idx}`} className="font-medium">
                  Coin given to {item.logoN_NAME}: {coinValue} coins!
                </label>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn bg-[#54d376] border-none w-24 rounded-badge text-white hover:bg-[#43af60]"
                disabled={!isConfirmed || !coinValue}
                onClick={handleGiveCoin} // Trigger the coin give action
              >
                Confirm
              </button>
              <button
                className="btn bg-[#ff6060] border-none w-24 rounded-badge text-white hover:bg-[#d44141]"
                onClick={() => closeModal(idx)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      ))}

      {/* Error or Success Message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
    </div>
  );
}

export default GiveCoin;
