import React, { useEffect, useState } from "react";
import { useAdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorList = () => {
  const { authToken, getAllDoctorsData, doctors, changeAvailability } =
    useAdminContext();

  useEffect(() => {
    if (authToken) {
      getAllDoctorsData();
    }
  }, [authToken]);

  return (
    <div className="m-5 max-h-[90vh] w-full max-w-6xl   overflow-y-scroll">
      <h1 className=" m-2 text-xl text-black">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4  pt-5 gap-y-6 ">
        {doctors.map((doctor, idx) => (
          <div
            className="w-64 border-2 rounded-xl  border-gray-300 px-2 py-3 bg-white max-w-56   overflow-hidden group cursor-pointer transition-all duration-500 "
            key={idx}
          >
            <img
              className=" mb-2 group-hover:bg-blue-300 rounded "
              src={doctor.image}
              alt="doctorPic"
            />
            <div className="p-2">
              <p className="text-lg font-semibold ">{doctor.name}</p>
              <p>{doctor.speciality}</p>
              <div className="flex  gap-2 text-sm ">
                <input
                  className="rounded-full"
                  type="checkbox"
                  checked={doctor.available}
                  onChange={() => changeAvailability(doctor._id)}
                />
                <p className="font-medium">Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
