import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../utility/authContext";
import Chip from "./Chip";
import { FaRegEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IoDocumentTextOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { CiCircleCheck } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import JOBSEEKER_DEFAULT_PROFILE_IMAGE from "../assets/JOBSEEKER_DEFAULT_PROFILE_IMAGE.webp";
import { IoIosAddCircleOutline } from "react-icons/io";
import axios from "axios";
import { SERVER_URL } from "../utility/constants";
import { toast } from "react-toastify";
import ToastComponent from "./ToastComponent";

const scrollToSection = (section, sectionRefs) => {
  sectionRefs.current[section]?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

const profileSections = [
  {
    title: "Basic Details",
    name: "basicDetails",
  },
  {
    title: "Formal Description",
    name: "formalDescription",
  },
  {
    title: "Skills",
    name: "skills",
  },
  {
    title: "Resume",
    name: "resume",
  },
  {
    title: "Education Details",
    name: "education",
  },
  {
    title: "Experience",
    name: "experience",
  },
  {
    title: "Languages",
    name: "languages",
  },
];

const QuickLinks = ({ sectionRefs }) => {
  return (
    <div className="shadow-lg w-max m-auto px-7 py-4 rounded-md mt-10">
      <p className="text-xl mb-5 text-blue-500">Quick Links</p>
      <ul className="*:text-lg *:my-1 *:text-gray-500 *:cursor-pointer ">
        {profileSections.map((section) => (
          <li
            onClick={() => scrollToSection(section.name, sectionRefs)}
            className="hover:text-gray-600"
          >
            {section.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

const DetailTypeInput = ({
  name,
  value,
  type,
  section,
  editingSection,
  setValue,
  title,
  details,
  width = "w-96",
}) => {
  return (
    <div className="flex mb-6 items-center justify-between">
      <p className="text-lg capitalize mr-5">{title}</p>
      <input
        type={type}
        value={value ? value : ""}
        name={name}
        onChange={(e) => setValue({ ...details, [name]: e.target.value })}
        className={
          "outline-none pl-2 border-[1.3px] border-gray-300 px-2 py-1 rounded-md text-gray-500 disabled:bg-white " +
          width
        }
        {...(section != editingSection && { disabled: true })}
      />
    </div>
  );
};

const ProfileDetailTypeSelect = ({
  name,
  options,
  value,
  section,
  editingSection,
  title,
  setValue,
  details,
}) => {
  return (
    <div className="flex mb-6 items-center justify-between">
      <p className="text-lg capitalize mr-5">{title}</p>
      <select
        onChange={(e) => setValue({ ...details, [name]: e.target.value })}
        name={name}
        value={value}
        {...(section != editingSection && { disabled: true })}
        className="outline-none pl-2 border-[1.3px] border-gray-300 px-2 py-1 rounded-md text-gray-500 disabled:bg-white w-96  disabled:appearance-none"
      >
        <option
          value={null}
          {...(section == editingSection
            ? { label: "--SELECT--" }
            : { label: "" })}
        />
        {options.map((option) => (
          <option
            value={option.value}
            label={option.label}
            className="cursor-pointer"
          />
        ))}
      </select>
    </div>
  );
};

const EducationDetail = ({
  education,
  index,
  setCurrentUser,
  editingSection,
  setEditingSection,
  setAllEducation,
  sectionRefs,
}) => {
  const [edu, setEdu] = useState({ ...education });
  const name = "education." + index;
  return (
    <div className="px-3 py-2 border-gray-200 rounded-md border-2 mt-7">
      <div className="flex justify-between">
        <SectionHeader
          name={name}
          sectionRefs={sectionRefs}
          setEditingSection={setEditingSection}
          title={"Education " + (index + 1)}
        />
        {editingSection == name && (
          <AiOutlineDelete
            className="text-3xl ml-2 text-gray-300 cursor-pointer"
            title="Delete Education"
            onClick={async () => {
              await saveData(
                { [name]: null },
                setEditingSection,
                setCurrentUser,
                "Education",
                true
              );
            }}
          />
        )}
      </div>
      <DetailTypeInput
        title={"Institute"}
        name={"institute"}
        value={edu.institute}
        type={"text"}
        details={edu}
        editingSection={editingSection}
        section={name}
        setValue={setEdu}
        width="w-full"
      />
      <div className="flex justify-between">
        <DetailTypeInput
          title={"Course"}
          name={"course"}
          value={edu.course}
          type={"text"}
          details={edu}
          editingSection={editingSection}
          section={name}
          setValue={setEdu}
          width="w-44"
        />
        <DetailTypeInput
          title={"Specialization"}
          name={"specialization"}
          value={edu.specialization}
          type={"text"}
          details={edu}
          editingSection={editingSection}
          section={name}
          setValue={setEdu}
          width="w-44"
        />
      </div>
      <div className="flex justify-between">
        <DetailTypeInput
          title={"Start Year"}
          name={"startYear"}
          value={edu.startYear}
          type={"text"}
          details={edu}
          editingSection={editingSection}
          section={name}
          setValue={setEdu}
          width="w-28"
        />
        <DetailTypeInput
          title={"End Year"}
          name={"endYear"}
          value={edu.endYear}
          type={"text"}
          details={edu}
          editingSection={editingSection}
          section={name}
          setValue={setEdu}
          width="w-28"
        />
        <DetailTypeInput
          title={"Grade"}
          name={"grade"}
          value={edu.grade}
          type={"text"}
          details={edu}
          editingSection={editingSection}
          section={name}
          setValue={setEdu}
          width="w-16"
        />
      </div>
      <CancelAndSaveButton
        details={{ [name]: edu }}
        setEditingSection={setEditingSection}
        setCurrentUser={setCurrentUser}
        editingSection={editingSection}
        setDetails={setEdu}
        initialValue={{ ...education }}
        isArrayElement={true}
        sectionName={name}
        title={"Education"}
      />
    </div>
  );
};

const ExperienceDetail = ({ details }) => {
  const {
    designation,
    company,
    startYear,
    endYear,
    jobType,
    salaryDetails,
    description,
  } = details;
  const { salary, currency } = salaryDetails || {};
  return (
    <div className="mt-4">
      <div className="flex items-center">
        <p className="text-lg mb- mr-2">
          {designation || ""} {jobType ? ` (${jobType})` : ""}
        </p>
        <p className=" mb-1 mx-2">{company ? `|  ${company}` : ""}</p>

        <p className=" mb-1 mx-2">
          {salaryDetails ? `${currency || ""} ${salary || ""}` : ""}
        </p>
        <p className=" mb-1 text-sm mx-2">
          {" "}
          {endYear ? `${startYear}  -  ${endYear}` : ""}
        </p>
      </div>
      <p>{description || ""}</p>
    </div>
  );
};

const LanguageDetails = ({ details }) => {
  const { language, proficiency, read, write, speak } = details;
  return (
    <div className="mt-4">
      <p className="capitalize text-lg">{language || ""}</p>
      <p className="">{proficiency || ""}</p>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <p className="">Read</p>
          {read == true ? (
            <CiCircleCheck className="text-xl text-green-700 ml-1" />
          ) : (
            <IoIosCloseCircleOutline className="text-xl text-red-600 ml-1" />
          )}
        </div>
        <div className="flex items-center mr-4">
          <p className="">Write</p>
          {write == true ? (
            <CiCircleCheck className="text-xl text-green-700 ml-1" />
          ) : (
            <IoIosCloseCircleOutline className="text-xl text-red-600" />
          )}
        </div>
        <div className="flex items-center">
          <p className="">Speak</p>
          {speak == true ? (
            <CiCircleCheck className="text-xl text-green-700 ml-1" />
          ) : (
            <IoIosCloseCircleOutline className="text-xl text-red-600" />
          )}
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({
  name,
  title,
  sectionRefs,
  setEditingSection,
  isAddItem = false,
  structure,
  setDetail,
  editingSection,
  detail,
  currentUser,
}) => {
  return (
    <div
      className="flex items-center mb-3"
      ref={(el) => (sectionRefs.current[name] = el)}
    >
      <p className="text-2xl">{title}</p>
      {isAddItem ? (
        <IoIosAddCircleOutline
          className="ml-3 text-3xl text-blue-500 cursor-pointer hover:text-blue-400"
          title={"Add " + title}
          onClick={() => {
            console.log("hii");
            if (
              editingSection == "none" &&
              currentUser[name].length == detail.length // it means all the array elements are saved till now in db
            ) {
              setEditingSection(name + "." + detail.length);
              setDetail((prev) => [...prev, { ...structure }]);
              toast.success(<ToastComponent />, {
                data: {
                  message: "New "+name+" added!! \n Please fill the details",
                  route: false,
                },
              });
            } else {
              toast.error(<ToastComponent />, {
                data: {
                  message: "Please save the previous details first",
                  route: false,
                },
              });
            }
          }}
        />
      ) : (
        <FaRegEdit
          className="ml-3 text-2xl text-blue-500 cursor-pointer hover:text-blue-400"
          onClick={() => {
            setEditingSection((prev) => (prev == "none" ? name : prev));
          }}
        />
      )}
    </div>
  );
};

const CancelAndSaveButton = ({
  details,
  setEditingSection,
  setCurrentUser,
  editingSection,
  setDetails,
  initialValue,
  sectionName,
  title,
  isArrayElement = false,
}) => {
  console.log(initialValue);
  return (
    <div
      className={
        "flex justify-center mb-5 mt-5 " +
        (editingSection != sectionName && "hidden")
      }
    >
      <p
        className=" text-blue-500 border-2 border-blue-500 px-4 py-1 rounded-md cursor-pointer hover:text-blue-400  hover:border-blue-400 mr-3 "
        onClick={() => {
          setEditingSection("none");
          setDetails(initialValue);
        }}
      >
        Cancel
      </p>
      <p
        className="bg-blue-500 text-white px-4 py-1 rounded-md cursor-pointer hover:bg-blue-400 ml-3 "
        onClick={() => {
          saveData(
            details,
            setEditingSection,
            setCurrentUser,
            title,
            isArrayElement
          );
        }}
      >
        Save
      </p>
    </div>
  );
};

const saveData = async (
  data,
  setEditingSection,
  setCurrentUser,
  title,
  isArrayElement = false
) => {
  try {
    const response = await axios({
      method: "patch",
      url:
        SERVER_URL +
        "/user/profile/update" +
        (isArrayElement ? "/arrayElement" : ""),
      withCredentials: true,
      data: data,
    });
    if (response?.data?.data) setCurrentUser(response?.data?.data);
    setEditingSection("none");
    toast.success(<ToastComponent />, {
      data: {
        message: `${title} updated successfully!!`,
        route: false,
      },
    });
  } catch (err) {
    let message = "Opps! something went wrong";
    if (err?.response?.data?.message) message = err?.response?.data?.message;
    toast.error(<ToastComponent />, {
      data: {
        message: message,
        route: false,
      },
    });
  }
};

const BasicDetails = ({
  currentLocation,
  noticePeriod,
  jobSearchStatus,
  lastName,
  firstName,
  phone,
  linkedInUsername,
  gender,
  email,
  editingSection,
  sectionRefs,
  setCurrentUser,
  setEditingSection,
}) => {
  const initialValues = {
    currentLocation,
    noticePeriod,
    jobSearchStatus,
    lastName,
    phone,
    linkedInUsername,
    gender,
  };

  const [basicDetails, setBasicDetails] = useState(initialValues);
  console.log(basicDetails);

  return (
    <div>
      <SectionHeader
        title={"Basic Details"}
        name={"basicDetails"}
        sectionRefs={sectionRefs}
        setEditingSection={setEditingSection}
      />
      <DetailTypeInput
        title={"First name"}
        name={"firstName"}
        value={firstName}
        type={"text"}
        details={basicDetails}
        section={"basicDetailsButCannotEdit"}
        editingSection={editingSection}
      />
      <DetailTypeInput
        title={"Last name"}
        name={"lastName"}
        value={basicDetails.lastName}
        type={"text"}
        section={"basicDetails"}
        details={basicDetails}
        editingSection={editingSection}
        setValue={setBasicDetails}
      />
      <ProfileDetailTypeSelect
        name={"gender"}
        details={basicDetails}
        title={"Gender"}
        value={basicDetails.gender}
        options={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
          { label: "Others", value: "Others" },
        ]}
        section={"basicDetails"}
        editingSection={editingSection}
        setValue={setBasicDetails}
      />
      <DetailTypeInput
        name={"phone"}
        title={"Phone"}
        value={basicDetails.phone}
        details={basicDetails}
        type={"phone"}
        section={"basicDetails"}
        editingSection={editingSection}
        setValue={setBasicDetails}
      />
      <DetailTypeInput
        title={"Email Id"}
        name={"email"}
        value={email}
        details={basicDetails}
        type={"email"}
        section={"basicDetailsButCannotEdit"}
        editingSection={editingSection}
      />
      <DetailTypeInput
        title={"Current Location"}
        name={"currentLocation"}
        details={basicDetails}
        value={basicDetails.currentLocation}
        type={"text"}
        editingSection={editingSection}
        section={"basicDetails"}
        setValue={setBasicDetails}
      />
      <DetailTypeInput
        title={"LinkedIn Username"}
        name={"linkedInUsername"}
        value={basicDetails.linkedInUsername}
        type={"text"}
        details={basicDetails}
        editingSection={editingSection}
        section={"basicDetails"}
        setValue={setBasicDetails}
      />
      <ProfileDetailTypeSelect
        title={"Job Search Status"}
        name={"jobSearchStatus"}
        value={basicDetails.jobSearchStatus}
        setValue={setBasicDetails}
        editingSection={editingSection}
        details={basicDetails}
        options={[
          { label: "Active", value: "Active" },
          { label: "Looking", value: "Looking" },
          { label: "Not Looking", value: "Not Looking" },
        ]}
        section={"basicDetails"}
      />
      <ProfileDetailTypeSelect
        title={"Notice Period"}
        name="noticePeriod"
        details={basicDetails}
        value={basicDetails.noticePeriod}
        setValue={setBasicDetails}
        editingSection={editingSection}
        options={[
          { label: "Immediate", value: "Immediate" },
          {
            label: "15 Days or Less",
            value: "15 Days or Less",
          },

          { label: "1 month", value: "1 month" },
          { label: "2 months", value: "2 months" },

          { label: "3 months or More", value: "3 months or More" },
        ]}
        section={"basicDetails"}
      />
      <CancelAndSaveButton
        details={basicDetails}
        setEditingSection={setEditingSection}
        setCurrentUser={setCurrentUser}
        editingSection={editingSection}
        setDetails={setBasicDetails}
        initialValue={initialValues}
        sectionName="basicDetails"
        title={"Basic Details"}
      />
    </div>
  );
};

const FormalDescription = ({
  about,
  sectionRefs,
  editingSection,
  setEditingSection,
  setCurrentUser,
}) => {
  const [formalDescription, setFormalDescription] = useState({ about });
  return (
    <div className="mt-10">
      <SectionHeader
        title={"Formal Description"}
        name={"formalDescription"}
        sectionRefs={sectionRefs}
        setEditingSection={setEditingSection}
      />
      <textarea
        className="pl-2 border-[1.3px] border-gray-300 px-2 py-1 rounded-md text-gray-500 flex w-full resize-none h-28 outline-none disabled:bg-white mb-6"
        {...(editingSection != "formalDescription" && { disabled: true })}
        value={formalDescription.about}
        onChange={(e) => setFormalDescription({ about: e.target.value })}
      ></textarea>
      <CancelAndSaveButton
        details={formalDescription}
        setEditingSection={setEditingSection}
        setCurrentUser={setCurrentUser}
        editingSection={editingSection}
        setDetails={setFormalDescription}
        initialValue={{ about }}
        sectionName="formalDescription"
        title={"Formal Description"}
      />
    </div>
  );
};

const Skills = ({
  skills,
  sectionRefs,
  editingSection,
  setEditingSection,
  setCurrentUser,
}) => {
  console.log(skills);
  const [skill, setSkill] = useState({ skills });
  const [inputSkill, setInputSkill] = useState("");

  const handleSkillDelete = (sk) => {
    let s = [...skill.skills];
    s.splice(s.indexOf(sk), 1);
    setSkill({ skills: s });
  };

  const handleAddSkill = () => {
    let message;
    if (inputSkill.length < 2)
      message = "Skill must contain atleast 2 characters";
    else if (inputSkill.length > 50)
      message = "Skill can contain atmost 50 characters";
    else if (skill.skills.length == 15)
      message = "You cannot add more than 15 skills";
    else {
      setSkill({
        skills: [...skill.skills, inputSkill],
      });
      setInputSkill("");
      return;
    }
    toast.error(<ToastComponent />, {
      data: {
        message: message,
        route: false,
      },
    });
  };
  return (
    <div className="mt-10">
      <SectionHeader
        name={"skills"}
        sectionRefs={sectionRefs}
        setEditingSection={setEditingSection}
        title={"Skills"}
      />
      <div className="pl-2 border-[1.3px] border-gray-300 px-2 py-2 rounded-md flex  w-full flex-wrap mb-6  items-center">
        {skill.skills.map((sk) => (
          <div className="flex items-center bg-orange-400 *:text-white *:py-1 h-max px-3 rounded-md mx-2 my-2">
            <p className="capitalize">{sk}</p>
            {editingSection == "skills" && (
              <IoIosCloseCircleOutline
                className="text-2xl h-max ml-1 cursor-pointer hover:opacity-80 "
                onClick={() => {
                  handleSkillDelete(sk);
                }}
              />
            )}
          </div>
        ))}
        {editingSection == "skills" && (
          <div className="bg-orange-400 flex px-3 py-1 rounded-md items-center mx-2 my-2">
            <input
              type="text"
              name={"skills"}
              minLength={2}
              maxLength={50}
              required
              value={inputSkill}
              onChange={(e) => setInputSkill(e.target.value)}
              placeholder="Type a skill..."
              className="placeholder:text-white outline-none rounded-md text-white disabled:bg-white h-max bg-orange-400"
              {...(editingSection != "skills" && { disabled: true })}
            />
            <p
              className="text-orange-600 bg-white px-2 rounded-md font-semibold text-sm py-1 cursor-pointer hover:opacity-95"
              onClick={handleAddSkill}
            >
              Add
            </p>
          </div>
        )}
      </div>
      <CancelAndSaveButton
        details={skill}
        setEditingSection={setEditingSection}
        setCurrentUser={setCurrentUser}
        editingSection={editingSection}
        setDetails={setSkill}
        initialValue={{ skills }}
        sectionName="skills"
        title={"Skills"}
      />
    </div>
  );
};

const Resume = ({
  sectionRefs,
  editingSection,
  setEditingSection,
  setCurrentUser,
  resumeDetails,
  defaultResume,
}) => {
  const [resume, setResume] = useState({ resumeDetails });

  const handleDeleteResume = (index) => {
    let res = [...resume.resumeDetails];
    res.splice(index, 1);
    setResume({ resumeDetails: res });
  };

  return (
    <div className="mt-10">
      <SectionHeader
        name={"resume"}
        sectionRefs={sectionRefs}
        setEditingSection={setEditingSection}
        title={"Resume"}
      />
      <div className="flex flex-wrap items-center">
        {resume.resumeDetails.map((res, index) => (
          <div className="flex items-center px-4 py-2 shadow-md w-max rounded-md mr-3 mb-3">
            <IoDocumentTextOutline className="text-4xl mr-2 text-gray-500" />
            <div>
              <p className="text-gray-500">
                {`${res.resumeDisplayName || ""} ${
                  res?.resumeURL == defaultResume ? " (Default)" : ""
                }`}
              </p>
              <p className="text-gray-400">{`Uploaded On: ${
                new Date(res.resumeUploadDate)
                  .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                  .split(",")[0]
              }`}</p>
            </div>
            {editingSection == "resume" && (
              <AiOutlineDelete
                className="text-3xl ml-2 text-gray-300 cursor-pointer"
                title="Delete Resume"
                onClick={() => {
                  handleDeleteResume(index);
                }}
              />
            )}
          </div>
        ))}
        {editingSection == "resume" && (
          <IoIosAddCircleOutline
            className="text-4xl text-blue-500 hover:text-blue-400 cursor-pointer"
            title="Add resume"
          />
          //adding resume logic
        )}
      </div>
      <CancelAndSaveButton
        details={resume}
        setEditingSection={setEditingSection}
        setCurrentUser={setCurrentUser}
        editingSection={editingSection}
        setDetails={setResume}
        initialValue={{ resumeDetails }}
        sectionName="resume"
        title={"Resume"}
      />
    </div>
  );
};

const Education = ({
  sectionRefs,
  editingSection,
  setEditingSection,
  setCurrentUser,
  education,
  currentUser,
}) => {
  useEffect(() => {
    setAllEducation(currentUser.education);
  }, [currentUser]);
  const [allEducation, setAllEducation] = useState(education);
  return (
    <div className="mt-10">
      <SectionHeader
        name={"education"}
        sectionRefs={sectionRefs}
        setEditingSection={setEditingSection}
        title={"Education"}
        isAddItem={true}
        setDetail={setAllEducation}
        editingSection={editingSection}
        detail={allEducation}
        currentUser={currentUser}
        structure={{
          institute: null,
          course: null,
          specialization: null,
          startYear: null,
          endYear: null,
          grade: null,
        }}
      />
      <div>
        {allEducation.map((e, index) => (
          <EducationDetail
            education={e}
            editingSection={editingSection}
            index={index}
            setCurrentUser={setCurrentUser}
            setEditingSection={setEditingSection}
            sectionRefs={sectionRefs}
            setAllEducation={setAllEducation}
          />
        ))}
      </div>
    </div>
  );
};

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) navigate("/login?next=/profile");
  }, []);
  const {
    skills,
    resumeDetails,
    about,
    currentLocation,
    jobSearchStatus,
    experience,
    education,
    jobPreferences,
    languages,
    lastName,
    firstName,
    phone,
    profilePicture,
    linkedInUsername,
    gender,
    defaultResume,
    email,
    noticePeriod,
    role,
    profileScore,
  } = currentUser || {};
  const [editingSection, setEditingSection] = useState("none");
  const sectionRefs = useRef({});

  return (
    <>
      {currentUser ? (
        <div className="flex px-10 py-10 w-5/6 mx-auto scroll-pb-32">
          <div className="mb-3 mr-32 w-1/3 relative">
            <div className="fixed ">
              <img
                src={`${profilePicture || JOBSEEKER_DEFAULT_PROFILE_IMAGE}`}
                className="h-32 w-32 rounded-xl object-cover m-auto"
              />
              <p className="w-max m-auto py-1 px-3 border-pink-500 text-pink-500 bg-pink-50 mt-2 uppercase">
                {role}
              </p>
              <p className="w-max m-auto text-blue-500 text-lg my-1">
                Profile Score:{" "}
                <span className="font-semibold">{profileScore}%</span>
              </p>
              <QuickLinks sectionRefs={sectionRefs} />
            </div>
          </div>
          <div className="w-max">
            <BasicDetails
              {...{
                jobSearchStatus,
                lastName,
                firstName,
                phone,
                linkedInUsername,
                gender,
                email,
                setCurrentUser,
                role,
                currentLocation,
                sectionRefs,
                noticePeriod,
                setEditingSection,
                editingSection,
              }}
            />
            <FormalDescription
              {...{
                about,
                sectionRefs,
                editingSection,
                setEditingSection,
                setCurrentUser,
              }}
            />
            <Skills
              {...{
                sectionRefs,
                editingSection,
                setEditingSection,
                setCurrentUser,
                skills,
              }}
            />

            {/* <div>
              <p
                className="text-2xl my-6"
                ref={(el) => (sectionRefs.current["resume"] = el)}
              >
                Resume{" "}
              </p>
              <div className="flex flex-wrap items-center">
                {resumeDetails.map((resume) => (
                  <div className="flex items-center px-4 py-2 shadow-md w-max rounded-md mr-3 mb-3">
                    <IoDocumentTextOutline className="text-4xl mr-2 text-gray-500" />
                    <div>
                      <p className="text-gray-500">
                        {`${resume.resumeDisplayName || ""} ${
                          resume?.resumeURL &&
                          resume?.resumeURL == defaultResume
                            ? " (Default)"
                            : ""
                        }`}
                      </p>
                      <p className="text-gray-400">{`Uploaded On: ${
                        new Date(resume.resumeUploadDate)
                          .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                          .split(",")[0]
                      }`}</p>
                    </div>
                    <AiOutlineDelete
                      className="text-3xl ml-2 text-gray-300 cursor-pointer"
                      title="Delete Resume"
                    />
                  </div>
                ))}
                <IoIosAddCircleOutline
                  className="text-4xl text-blue-500 hover:text-blue-400 cursor-pointer"
                  title="Add resume"
                />
              </div>
            </div> */}
            <Resume
              {...{
                sectionRefs,
                editingSection,
                setEditingSection,
                setCurrentUser,
                resumeDetails,
                defaultResume,
              }}
            />
            <Education
              {...{
                sectionRefs,
                editingSection,
                setEditingSection,
                setCurrentUser,
                education,
                currentUser,
              }}
            />
            {/* <div className="mt-6">
              <div
                className="flex items-center"
                ref={(el) => (sectionRefs.current["education"] = el)}
              >
                <p className="text-2xl"> Education Details</p>
                <FaRegEdit className="ml-3 text-2xl text-blue-500 cursor-pointer" />
              </div>
              {education.map((educationDetail) => (
                <EducationDetail details={educationDetail} />
              ))}
            </div> */}
            <div className="mt-6">
              <div
                className="flex items-center"
                ref={(el) => (sectionRefs.current["experience"] = el)}
              >
                <p className="text-2xl"> Experience</p>
                <FaRegEdit className="ml-3 text-2xl text-blue-500 cursor-pointer" />
              </div>
              {experience.map((experienceDetails) => (
                <ExperienceDetail details={experienceDetails} />
              ))}
            </div>
            <div className="mt-6">
              <div
                className="flex items-center"
                ref={(el) => (sectionRefs.current["languages"] = el)}
              >
                <p className="text-2xl"> Languages</p>
                <FaRegEdit className="ml-3 text-2xl text-blue-500 cursor-pointer" />
              </div>
              {languages.map((language) => (
                <LanguageDetails details={language} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Profile;
