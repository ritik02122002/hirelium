export const JOBSEEKER_MAX_SKILLS = 15;
export const JOBSEEKER_SKILL_MAX_LENGTH = 50;
export const JOBSEEKER_ABOUT_MIN_LENGTH = 30;
export const JOBSEEKER_ABOUT_MAX_LENGTH = 2000;
export const JOBSEEKER_VALID_PROFILE_UPDATES = [
  "skills",
  "resumeDetails",
  "about",
  "currentLocation",
  "noticePeriod",
  "jobSearchStatus",
  "experience",
  "education",
  "jobPreferences",
  "languages",
  "lastName",
  "phone",
  "profilePicture",
  "linkedInUsername",
  "gender",
  "defaultResume",
];
export const JOBSEEKER_VALID_ARRAY_ELEMENT_UPDATES = [
  "experience",
  "education",
];
export const RECRUITER_VALID_PROFILE_UPDATES = [
  "lastName",
  "phone",
  "profilePicture",
  "linkedInUsername",
  "gender",
];
export const VALID_COMPANY_DETAILS = [
  "name",
  "rating",
  "logo",
  "description",
  "companyDomain",
];
export const VALID_APPLICATION_STATUS = [
  "Applied",
  "Shortlisted",
  "Interviewed",
  "Rejected",
  "Offered",
];

export const VALID_JOB_DETAILS = [
  "title",
  "role",
  "description",
  "qualifications",
  "responsibilities",
  "postedById",
  "companyId",
  "salaryDetails",
  "additionalInfo",
  "workModel",
  "minimumExperience",
  "maximumExperience",
  "jobType",
  "locations",
  "appliedCount",
  "keySkills",
  "isJobActive",
  "vacancy",
];

export const JOB_VALID_UPDATES = [
  "description",
  "qualifications",
  "responsibilities",
  "additionalInfo",
  "workModel",
  "salaryDetails",
  "minimumExperience",
  "maximumExperience",
  "locations",
  "keySkills",
  "vacancy",
  "isJobActive",
];

// highest weightage to lowest weitage
export const DEFAULT_WEIGHTAGE_ORDER_FOR_JOB_MATH = [
  "jobType",
  "jobRole",
  "salary",
  "skills",
  "location",
];

export const JOBSEEKER_RECRUITER_VIEW = [
  "firstName",
  "lastName",
  "email",
  "profilePicture",
  "linkedInUsername",
  "gender",
  "skills",
  "resumeDetails",
  "about",
  "currentLocation",
  "noticePeriod",
  "jobSearchStatus",
  "experience",
  "education",
  "languages",
];

export const VALID_COMPANY_UPDATES = ["rating", "logo", "description"];

export const DEFAULT_RESULT_LIMIT = 10;

export const DEFAULT_PAGE = 1;

export const JOBSEEKER_PROFILE_DETAIL_SCORES = {
  //initially 5 -> firstName + email
  resumeDetails: [6, 10, 15], // 10 -> resume more than 6 months old, 15 -> resume less than or equal to 6 months old
  skills: [8, 10, 15], // 10 -> less than 8 skills, 15 -> equal to or more than 8 skills
  about: [500, 5, 8], // 5 -> about of less than 500 chars,  8 -> about of more than or equal to 500 chars
  experience: 8,
  education: [1, 5, 8], //5 -> 1 education, 8 -> more than 1 education
  phone: 5,
  profilePicture: 5,
  linkedInUsername: 5,
  gender: 3,
  noticePeriod: [1, 2, 3, 4, 5], //5-> "Immediate", 4-> "15 Days or Less",3-> "1 month", 2-> "2 months",1-> "3 months or More"
  jobSearchStatus: [2, 5, 8], // 2->Not looking, 5->Looking, 8->Active
  currentLocation: 5,
  languages: [1, 3, 5], // 3-> 1 language , 5->more than 1 language
};

export const MAX_SEARCH_HISTORY_ITEMS = 10;
export const MAX_SEARCH_HISTORY_ITEM_LENGTH = 100;
export const VALID_JOB_FILTERS = [
  {
    type: "checkbox",
    values: ["Remote", "Hybrid", "On-Site"],
    name: "workModel",
    title: "Work Mode",
  },
  {
    type: "checkbox",
    values: ["Full-time", "Internship"],
    name: "jobType",
    title: "Job Type",
  },
  {
    type: "radio",
    values: ["Any", "5000", "20000", "50000", "80000", "120000", "200000"],
    name: "minimumSalary",
    title: "Salary( /month)",
  },
  {
    type: "checkbox",
    values: ["1-5", "6-15", "16-30", "31-60", "61-100", "100-100000"],
    name: "vacancy",
    title: "Open Positions",
  },
  {
    type: "radio",
    values: [
      "Any",
      String(1000 * 60 * 60),
      String(1000 * 60 * 60 * 24),
      String(1000 * 60 * 60 * 24 * 3),
      String(1000 * 60 * 60 * 24 * 7),
      String(1000 * 60 * 60 * 24 * 30),
    ],
    name: "createdAt",
    title: "Date of Posting",
  },
  {
    type: "range",
    values: Array(52)
      .fill(0)
      .map((_, i) => String(i)),
    name: "experience",
    title: "Experience (in yrs)",
  },
];

// export const VALID_JOB_FILTERS
// = [
//   "workModel",
//   "jobType",
//   "salaryDetails",
//   "vacancy",
//   "createdAt",
// ];
