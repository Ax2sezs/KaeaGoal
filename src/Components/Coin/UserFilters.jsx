import React from 'react';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export const UserFilters = ({
  branchCodeFilter,
  branchFilter,
  userNameFilter,
  department,
  userDetails,
  onBranchCodeChange,
  onBranchChange,
  onUserNameChange,
  onSearch,
  onClearFilter
}) => (
  <div className="flex flex-col gap-3 mb-2 sm:flex-row">
    {/* Site Filter */}
    <div>
      <label className="block mb-2 font-bold text-sm">* Site</label>
      <select
        value={branchCodeFilter}
        onChange={onBranchCodeChange}
        className="input input-bordered border-layer-item w-full max-w-xs bg-bg"
      >
        <option value="clearSite">Select Site</option>
        {['AUOF', 'AUFC', 'AUBR'].map((branchCode, index) => (
          <option key={index} value={branchCode}>{branchCode}</option>
        ))}
      </select>
    </div>

    {/* Department Filter */}
    <div>
      <label className="block mb-2 font-bold text-sm">* Department</label>
      <select
        value={branchFilter}
        onChange={onBranchChange}
        className="input input-bordered border-layer-item w-full max-w-xs bg-bg"
        disabled={!branchCodeFilter || branchCodeFilter === "clearSite"}
      >
        <option value="clearDept">Select Department</option>
        {department && department.length > 0 ? (
          department
            .slice()
            .sort((a, b) => a.departmentCode.localeCompare(b.departmentCode))
            .filter((dept) => {
              if (branchCodeFilter !== "AUBR") {
                return dept.departmentCode !== userDetails?.departmentCode;
              }
              return true;
            })
            .map((dept, index) => (
              <option key={index} value={dept.departmentCode}>
                {dept.departmentCode} - {dept.departmentName}
              </option>
            ))
        ) : (
          <option disabled>No departments available</option>
        )}
      </select>
    </div>

    {/* User Name Filter */}
    <div className="flex flex-row gap-2">
      <div>
        <label className="block mb-2 font-bold text-sm">User Name</label>
        <input
          type="text"
          value={userNameFilter}
          onChange={onUserNameChange}
          placeholder="Enter name..."
          className="input input-bordered border-layer-item w-full max-w-xs bg-bg"
        />
      </div>

      <div className="flex items-end">
        <button
          onClick={onSearch}
          className="btn btn-success rounded-badge text-bg"
        >
          <PersonSearchIcon />
        </button>
      </div>
      <div className="flex items-end">
        <button
          onClick={onClearFilter}
          className="btn btn-error rounded-badge"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
);