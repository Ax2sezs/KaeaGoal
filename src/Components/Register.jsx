import React, { useState, useEffect } from 'react';
import { useAuth } from './APIManage/AuthContext';  // Assuming this is your custom hook/context
import useFetchData from './APIManage/useFetchData';  // Import the merged custom hook
import { useNavigate } from "react-router-dom";

const mockEmployees = [
  { employeeId: "EMP001", citizenId: "1234567890123", name: "สมชาย ใจดี", department: "IT", division: "Software Development", position: "Software Engineer", dob: "1990-05-15", phone: "0812345678" },
  { employeeId: "EMP002", citizenId: "2345678901234", name: "สายสมร รักดี", department: "HR", division: "Recruitment", position: "HR Manager", dob: "1985-10-20", phone: "0898765432" },
  { employeeId: "EMP003", citizenId: "3456789012345", name: "วิชัย แก้วใส", department: "Finance", division: "Accounting", position: "Accountant", dob: "1988-08-08", phone: "0811223344" },
  { employeeId: "EMP004", citizenId: "4567890123456", name: "มานพ ทองดี", department: "Marketing", division: "Advertising", position: "Marketing Specialist", dob: "1992-03-25", phone: "0822334455" },
  { employeeId: "EMP005", citizenId: "5678901234567", name: "ชุติมา แสงจันทร์", department: "Sales", division: "Retail Sales", position: "Sales Executive", dob: "1995-07-12", phone: "0844556677" }
];

const Register = () => {
  const { user } = useAuth();
  const { alluser = [], error, isLoading } = useFetchData(user?.token);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: "", citizenId: "", name: "", department: "", division: "", position: "", dob: "", phone: ""
  });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const fetchEmployeeData = () => {
    const employee = mockEmployees.find(emp => emp.employeeId === formData.employeeId && emp.citizenId === formData.citizenId);
    setFormData(employee ? employee : { ...formData, name: "", department: "", division: "", position: "", dob: "", phone: "" });
    if (!employee) alert("ไม่พบข้อมูลพนักงาน");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register Data:", formData);
  };

  const inputFields = [
    { name: "name", placeholder: "Full Name" },
    { name: "department", placeholder: "Department" },
    { name: "division", placeholder: "Division" },
    { name: "position", placeholder: "Position" },
    { name: "dob", placeholder: "Date of Birth" },
    { name: "phone", placeholder: "Phone Number" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-blue-500 hover:underline mb-4">Back to Login</button>
        <h2 className="text-2xl font-bold text-center text-red-500">Register Test</h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            {["employeeId", "citizenId"].map((field) => (
              <input key={field} type="text" name={field} placeholder={field === "employeeId" ? "Employee ID" : "Citizen ID"} value={formData[field]} onChange={handleChange} className="input input-bordered w-1/2" required />
            ))}
          </div>

          <button type="button" onClick={fetchEmployeeData} className="btn btn-primary w-full">Load Employee Data</button>

          {inputFields.map(({ name, placeholder }) => (
            <input key={name} type="text" placeholder={placeholder} value={formData[name]} className="input input-bordered w-full" disabled />
          ))}

          <button type="submit" className="btn btn-success w-full">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
