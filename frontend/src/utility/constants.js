export const SERVER_URL = "http://localhost:8080";
export const IMAGE_WITH_INITIALS_URL_PREFIX =
  "https://ui-avatars.com/api/?background=random&name=";

export const JOB_FILTER_INFO = [
  {
    type: "range",
    values: [0, 51],
    name: "experience",
    title: "Experience (in yrs)",
  },
  {
    type: "checkbox",
    values: [
      { name: "Remote", value: "Remote" },
      { name: "Hybrid", value: "Hybrid" },
      { name: "On-Site", value: "On-Site" },
    ],
    name: "workModel",
    title: "Work Mode",
  },
  {
    type: "checkbox",
    values: [
      { name: "Full-time", value: "Full-time" },
      { name: "Internship", value: "Internship" },
    ],
    name: "jobType",
    title: "Job Type",
  },
  {
    type: "radio",
    values: [
      { name: "Any", value: "Any" },
      { name: "5k+", value: "5000" },
      { name: "20k+", value: "20000" },
      { name: "50K+", value: "50000" },
      { name: "80K+", value: "80000" },
      { name: "1.2L+", value: "120000" },
      { name: "2L+", value: "200000" },
    ],
    name: "minimumSalary",
    title: "Salary (per month)",
  },
  {
    type: "checkbox",
    values: [
      { name: "1 - 5", value: "1-5" },
      { name: "6 - 15", value: "6-15" },
      { name: "16 - 30", value: "16-30" },
      { name: "31 - 60", value: "31-60" },
      { name: "61 - 100", value: "61-100" },
      { name: "100+", value: "100-100000" },
    ],
    name: "vacancy",
    title: "Open Positions",
  },
  {
    type: "radio",
    values: [
      { name: "Any", value: "Any" },
      { name: "Last 1 hour", value: 1000 * 60 * 60 },
      { name: "Last 1 day", value: 1000 * 60 * 60 * 24 },
      { name: "Last 3 days", value: 1000 * 60 * 60 * 24 * 3 },
      { name: "Last 7 days", value: 1000 * 60 * 60 * 24 * 7 },
      { name: "Last 30 days", value: 1000 * 60 * 60 * 24 * 30 },
    ],
    name: "createdAt",
    title: "Date of Posting",
  },
];

export const DEFAULT_JOB_FILTER = {
  workModel: [],
  jobType: [],
  minimumSalary: null,
  vacancy: [],
  createdAt: null,
  experience: 51,
};

//true means expanded and false mean collapsed
export const DEFAULT_JOB_FILTER_ACCORDION_STATUS = {
  workModel: true,
  jobType: true,
  minimumSalary: true,
  vacancy: true,
  createdAt: true,
  experience: true,
};

export const COVER_LETTER_PLACEHOLDER =
  "Tell us how your unique skills and passion make you the perfect fit for this role! Share your story, your accomplishments, and your vision for contributing to our team.";

export const DEFAULT_PAGINATION_DATA = {
  hasNext: false,
  hasPrevious: false,
  nextCursor: "",
  previousCursor: "",
};

export const FOOTER_CONTENT = [
  "About us",
  "Careers",
  "Employer home",
  "Sitemap",
  "Credits",
  "Help",
  "Privacy policy",
  "Terms & conditions",
  "© 2024 Hirelium | All rights Reserved",
];
