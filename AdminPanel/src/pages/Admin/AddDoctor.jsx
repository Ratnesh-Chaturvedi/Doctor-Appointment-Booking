import React, { useState } from "react";
import { assets } from "../../assets/assets.js";
import axios from "axios";
import { useAdminContext } from "../../context/AdminContext.jsx";
import { toast } from "react-toastify";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [fee, setFee] = useState(0);
  const [experience, setExperience] = useState("1 Year");
  const [about, setAbout] = useState("");
  const [speciality, setSpeaciality] = useState("General physician");
  const [edu, setEdu] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, authToken } = useAdminContext();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!docImg) {
        return toast.error("Image not selected");
      }

      // we add doctor by submitting form data as we submit in backend so we create the form object and pass the values as they passed in the backend time
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("speciality", speciality);
      formData.append("experience", experience);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("degree", edu);
      formData.append("fee", fee);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );
      formData.append("about", about);
      // print the form data
      // formData.forEach((value, key) => {
      //   console.log(`${key}:${value}`);
      // });
      // sending data to backend // here we use header in which it will automatically converts into lowercase

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { authToken } }
      );
      if (data.success) {
    toast.success("Doctor added successfully");    
    setAbout('')
    setName('')
    setAddress1('')
    setAddress2('')
    setDocImg(false)
    setSpeaciality('General physician')
    setExperience('1 Year')
    setEdu('')
    setFee(0)
    setEmail('')
    setPassword('')

      } else {
        return toast.error("Failed to create the doctor");
      }
    } catch (error) {
      return toast.error(error.message);
    }

  };

  return (
    <form onSubmit={submitHandler} className="m-5 min-w-[80vw]   ">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl  max-h-[80vh]overflow-y-scroll overflow-x-scroll">
        <div className=" flex items-center gap-4 mb-8  ">
          <label htmlFor="doctor-img">
            <img
              className="w-16  bg-gray-100 rounded-full  cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
            />
          </label>
          <input
            onChange={(e) => {
              setDocImg(e.target.files[0]);
            }}
            type="file"
            id="doctor-img"
          />
          <p >Upload Doctor Image</p>
        </div>
        <div className="flex   items-start gap-10 ">
          <div className="w-full flex flex-col gap-5">
            <div>
              <p>Doctor Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-1"
                type="text"
                placeholder="Name"
                required
              />
            </div>
            <div>
              <p>Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-1"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div>
              <p>Doctor Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-1"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div>
              <p>Speciality</p>
              <select
                onChange={(e) => setSpeaciality(e.target.value)}
                value={speciality}
                name="speciality"
                className="border rounded px-3 py-1"
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div>
              <p>Fee</p>
              <input
                onChange={(e) => setFee(e.target.value)}
                value={fee}
                type="number"
                placeholder="Fees"
                className="border rounded px-3 py-1"
              />
            </div>
          </div>
          <div className="flex flex-col  items-start gap-5 ">
            <div>
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-3 py-1"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>
            <div>
              <p>Eductaion</p>
              <input
                onChange={(e) => setEdu(e.target.value)}
                value={edu}
                type="text"
                placeholder="Education"
                required
                className="border rounded px-3 py-1"
              />
            </div>
            <div className="">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                type="text"
                placeholder="Address 1"
                required
                className="border rounded px-3 py-1"
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-1"
                type="text"
                placeholder="Address 2"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex-1  flex flex-col gap-1 mt-4 ">
          <p>About me</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="border rounded px-3 py-1"
            placeholder="Add something about you"
            rows={5}
          ></textarea>
        </div>
        <button
          type="submit"
          className="mt-2  w-full bg-blue-500  px-2 py-1  rounded text-white"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
