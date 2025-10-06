/* eslint-disable @typescript-eslint/naming-convention */
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  Request,
  requestBody,
  response,
  RestBindings,
} from '@loopback/rest';
import axios from 'axios';
import { Jobs } from '../models';
import { JobsRepository, ResumeRepository, SavedJobsUsersLinkRepository, UserRepository } from '../repositories';
import { inject } from '@loopback/core';
import { UserProfile } from '@loopback/security';
import { JWTService } from '../services/jwt-service';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class JobsController {
  jobsData = [{
    "_id": {
      "$oid": "68c8f12cc1f8336890ee3870"
    },
    "title": "Frontend Developer",
    "description": "Job description\n\n\n0-4 years of experience building web-scale, highly available frontend for web and/or mobile design.\nStrong expertise in ReactJs / AngularJs / VueJs.\nExpertise with Redux and HTML DOM.\nRole: Front End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nFront endDOMWeb technologiesCloudHTMLWeb designingangularjs",
    "company": "Morpich Design",
    "companyLogo": "NA",
    "location": "Surat",
    "experience": "0 - 4 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Front end",
      "Front end",
      "DOM",
      "DOM",
      "Web technologies",
      "Web technologies",
      "Cloud",
      "Cloud",
      "HTML",
      "HTML",
      "Web designing",
      "Web designing",
      "angularjs",
      "angularjs"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-morpich-design-surat-0-to-4-years-240524500185",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.572Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.574Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.575Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee3871"
    },
    "title": "Frontend Developer",
    "description": "Job description\n\nRole & responsibilities\n\nSupport the team in building basic and responsive web pages using HTML, CSS, and JavaScript\n\nLearn by doing work on real tasks under guidance and supervision\n\nParticipate in team meetings, ask questions, and actively contribute to discussions\n\nUnderstand and implement simple UI/UX designs\n\nFix basic layout bugs and test for responsiveness on different devices\n\n(Optional) Explore tasks using React.js if you're interested and familiar\n\nTake feedback positively and improve continuously\n\n\n\n\nPreferred candidate profile\n\n\n\n\nFreshers or final-year students from any technical background (B.E./B.Tech/BCA/MCA etc.)\n\nBasic understanding of HTML, CSS, and JavaScript projects/coursework/personal practice is enough\n\nNot expected to be an expert, but should be eager to learn and put in the effort\n\nGood attitude — responsible, proactive, and a team player\n\nStrong willingness to learn, improve, and work in a fast-paced startup\n\nComfortable with asking for help, taking feedback, and learning from mistakes\n\nBonus: Exposure to tools like Git, or libraries like React.js\n\nIf you’ve built even small personal projects (hosted or on GitHub), that’s a big plus\n\n\n\nRole: Front End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nJavascriptHtml And Css\nTypescriptPHPReact.JsAngular",
    "company": "Innostes Solutions Pvt Ltd",
    "companyLogo": "NA",
    "location": "Hyderabad( 9th Phase KPHB )",
    "experience": "0 - 1 years",
    "salary": "1.25-2 Lacs P.A.",
    "posted": "2 weeks ago",
    "openings": "2",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Javascript",
      "Javascript",
      "Html And Css",
      "Html And Css",
      "Typescript",
      "Typescript",
      "PHP",
      "PHP",
      "React.Js",
      "React.Js",
      "Angular",
      "Angular"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-innostes-solutions-pvt-ltd-hyderabad-0-to-1-years-280825005554",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.631Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.633Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.633Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee3872"
    },
    "title": "Front - End Developer",
    "description": "Job description\nWe re seeking enthusiastic, early-career Front-End Developers to join our growing team. You ll work alongside experienced developers, contributing to the development and enhancement of our web and mobile applications. Your curiosity and eagerness to learn will be key as you dive into a variety of technologies and expand your skillset.\n\nResponsibilities\nCollaborate with design and development teams to create engaging and user-friendly interfaces.\nWrite clean, maintainable, and well-tested code in React, Node.js, and potentially other front-end frameworks.\nParticipate in code reviews to ensure quality and share knowledge.\nLearn and apply new technologies to enhance our applications.\nStay updated on the latest trends and best practices in front-end development.\nQualifications\nBachelor s degree in Computer Science or related field, or equivalent experience.\n0-3 years of experience with front-end technologies (React, Angular, Vue.js, etc.).\nSolid understanding of HTML, CSS, and JavaScript.\nBasic understanding of back-end technologies (Node.js, C#, VB.Net, etc.) is a plus, but not required.\nA strong desire to learn, grow, and collaborate in a team environment.\nExcellent problem-solving and communication skills.\nNice to Have\nExperience with Power Apps or similar low-code platforms.\nFamiliarity with responsive design and cross-browser compatibility.\nContributions to open source projects or personal coding portfolio.\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nComputer scienceBasicBackendFront endVB.NETCodingJavascriptHTMLMobile applicationsOpen source",
    "company": "Digital Glyde",
    "companyLogo": "NA",
    "location": "Kolkata",
    "experience": "0 - 3 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Computer science",
      "Computer science",
      "Basic",
      "Basic",
      "Backend",
      "Backend",
      "Front end",
      "Front end",
      "VB.NET",
      "VB.NET",
      "Coding",
      "Coding",
      "Javascript",
      "Javascript",
      "HTML",
      "HTML",
      "Mobile applications",
      "Mobile applications",
      "Open source",
      "Open source"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-front-end-developer-digital-glyde-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-3-years-170524500933",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.675Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.676Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.676Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee3873"
    },
    "title": "Frontend Developer",
    "description": "Job description\nWe are seeking enthusiastic and motivated individuals with a passion for frontend development to join our team. As a Frontend Developer, you will collaborate with our experienced team to design and implement user-friendly interfaces for web applications, ensuring a seamless and engaging user experience across various platforms and devices.\n \nResponsibilities:\nCollaborate with cross-functional teams to define, design, and ship new features.\nDevelop responsive web applications using HTML, CSS, and JavaScript frameworks.\nOptimize application performance for maximum speed and scalability.\nImplement best practices for frontend development and ensure code quality.\nStay updated on emerging technologies and trends in frontend development.\nRequirements:\nBachelors degree in Computer Science, Information Technology, or related field (B.Tech, BCA, BSc, MCA, M.Tech, or equivalent).\nStrong understanding of web development fundamentals (HTML5, CSS3, JavaScript).\nFamiliarity with frontend frameworks/libraries such as React, Angular, or Vue.js is a plus.\nAbility to work in a collaborative team environment and communicate effectively.\nEagerness to learn and adapt to new technologies and methodologies.\nBenefits:\nOpportunity to work on exciting projects and gain hands-on experience in frontend development.\nMentorship and guidance from experienced professionals in the industry.\nCompetitive salary and benefits package.\nCareer growth opportunities within the company\nRole: Software Development - Other\nIndustry Type: Internet\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate, BCA in Computers, B.Tech/B.E. in Any Specialization, B.Sc in Any Specialization\nPG: MCA in Computers, M.Tech in Any Specialization\nKey Skills\nFront endScalabilityhtml5ShapingWeb developmentJavascriptHTMLInformation technologyCSS3\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "TechKnowledgeHub.org",
    "companyLogo": "NA",
    "location": "Remote",
    "experience": "0 - 2 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Front end",
      "Front end",
      "Scalability",
      "Scalability",
      "html5",
      "html5",
      "Shaping",
      "Shaping",
      "Web development",
      "Web development",
      "Javascript",
      "Javascript",
      "HTML",
      "HTML",
      "Information technology",
      "Information technology",
      "CSS3",
      "CSS3"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-techknowledgehub-org-remote-0-to-2-years-220424500456",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.691Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.693Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.693Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee3874"
    },
    "title": "Frontend developers",
    "description": "Job description\n\nAs a frontend developer at astech you will be responsible for converting designs provided by our awesome clients into cross-browser and responsive html/css and then integrating that design to a functional angular app.\n\nYou ll also be responsible for integrating and writing the javascript that powers the design. You should be great at building web pages from scratch.\n\nKnowledge of jQuery, Git, the bootstrap framework, Angular and wordpress will be preferred.\n\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Post Graduation Not Required\nKey Skills\nCSSjQueryFront endGITWeb technologiesWordpressJavascriptHTMLbootstrap",
    "company": "Astech Solutions",
    "companyLogo": "NA",
    "location": "Mumbai",
    "experience": "0 - 3 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "CSS",
      "CSS",
      "jQuery",
      "jQuery",
      "Front end",
      "Front end",
      "GIT",
      "GIT",
      "Web technologies",
      "Web technologies",
      "Wordpress",
      "Wordpress",
      "Javascript",
      "Javascript",
      "HTML",
      "HTML",
      "bootstrap",
      "bootstrap"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developers-astech-solutions-mumbai-0-to-3-years-231220501688",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.709Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.711Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.711Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee3875"
    },
    "title": "Frontend Developer",
    "description": "Job description\nUnimity Solutions Pvt Ltd is looking for Frontend Developer to join our dynamic team and embark on a rewarding career journey\nUse markup languages like HTML to create user-friendly web pages\nMaintain and improve website\nOptimize applications for maximum speed\nDesign mobile-based features\nCollaborate with back-end developers and web designers to improve usability\nGet feedback from, and build solutions for, users and customers\nWrite functional requirement documents and guides\nCreate quality mockups and prototypes\nHelp back-end developers with coding and troubleshooting\nEnsure high quality graphic standards and brand consistency\nStay up-to-date on emerging technologies\nDisclaimer: This job description has been sourced from a public domain and may have been modified by Naukri.com to improve clarity for our users. We encourage job seekers to verify all details directly with the employer via their official channels before applying.\n\n\nCrafts the user interface and experience, bringing designs to life in the browser (React, Angular, Node)\n\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nfrontend developmentfront endemerging technologiescssui developmentuser interface designingphotoshopbootstrapprototypeajaxjavascriptjquerymarkup languagescodingangularreact.jstroubleshootingjsonhtmlweb developmentweb designing",
    "company": "Unimity",
    "companyLogo": "NA",
    "location": "Chennai",
    "experience": "0 - 4 years",
    "salary": "Not Disclosed",
    "posted": "6 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "At Unimity, we bring together the best of both worlds ? the robust foundations of enterprise systems and the agility of a start-up mindset. With a deep understanding of business processes, compliance, security, scalability, and stability, we design and deliver solutions that meet the rigorous demands of enterprise environments.",
    "keySkills": [
      "frontend development",
      "frontend development",
      "front end",
      "front end",
      "emerging technologies",
      "emerging technologies",
      "css",
      "css",
      "ui development",
      "ui development",
      "user interface designing",
      "user interface designing",
      "photoshop",
      "photoshop",
      "bootstrap",
      "bootstrap",
      "prototype",
      "prototype",
      "ajax",
      "ajax",
      "javascript",
      "javascript",
      "jquery",
      "jquery",
      "markup languages",
      "markup languages",
      "coding",
      "coding",
      "angular",
      "angular",
      "react.js",
      "react.js",
      "troubleshooting",
      "troubleshooting",
      "json",
      "json",
      "html",
      "html",
      "web development",
      "web development",
      "web designing",
      "web designing"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-unimity-solutions-pvt-ltd-chennai-0-to-4-years-090925504901",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.744Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.746Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.746Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee3876"
    },
    "title": "Frontend Developer",
    "description": "Job description\nTangibleheed Infotech is looking for Frontend Developer to join our dynamic team and embark on a rewarding career journey.\nUse markup languages like HTML to create user-friendly web pages\nMaintain and improve website\nOptimize applications for maximum speed\nDesign mobile-based features\nCollaborate with back-end developers and web designers to improve usability\nGet feedback from, and build solutions for, users and customers\nWrite functional requirement documents and guides\nCreate quality mockups and prototypes\nHelp back-end developers with coding and troubleshooting\nEnsure high quality graphic standards and brand consistency\nStay up-to-date on emerging technologies\nRole: Front End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nfrontend developmentfront endemerging technologiescssui developmentuser interface designingphotoshopbootstrapprototypeajaxjavascriptjquerymarkup languagescodingangularreact.jsjsonphphtmlweb developmentmysqlweb designing\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "Tangibleheed Infotech",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "1 - 4 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "frontend development",
      "frontend development",
      "front end",
      "front end",
      "emerging technologies",
      "emerging technologies",
      "css",
      "css",
      "ui development",
      "ui development",
      "user interface designing",
      "user interface designing",
      "photoshop",
      "photoshop",
      "bootstrap",
      "bootstrap",
      "prototype",
      "prototype",
      "ajax",
      "ajax",
      "javascript",
      "javascript",
      "jquery",
      "jquery",
      "markup languages",
      "markup languages",
      "coding",
      "coding",
      "angular",
      "angular",
      "react.js",
      "react.js",
      "json",
      "json",
      "php",
      "php",
      "html",
      "html",
      "web development",
      "web development",
      "mysql",
      "mysql",
      "web designing",
      "web designing"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-tangibleheed-infotech-pune-1-to-4-years-240425500914",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.781Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.783Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.783Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee3877"
    },
    "title": "Frontend Developer",
    "description": "Job description\nTechsolv IT Service is looking for Frontend Developer to join our dynamic team and embark on a rewarding career journey.\n\n\nUse markup languages like HTML to create user-friendly web pages\nMaintain and improve website\nOptimize applications for maximum speed\nDesign mobile-based features\nCollaborate with back-end developers and web designers to improve usability\nGet feedback from, and build solutions for, users and customers\nWrite functional requirement documents and guides\nCreate quality mockups and prototypes\nHelp back-end developers with coding and troubleshooting\nEnsure high quality graphic standards and brand consistency\nStay up-to-date on emerging technologies\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nfrontend developmentfront endemerging technologiescssui developmentuser interface designingphotoshopbootstrapprototypeajaxjavascriptjquerymarkup languagescodingangularreact.jsjsonphphtmlweb developmentmysqlweb designing",
    "company": "Techsolv It Service",
    "companyLogo": "NA",
    "location": "Bardhaman",
    "experience": "0 - 2 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "frontend development",
      "frontend development",
      "front end",
      "front end",
      "emerging technologies",
      "emerging technologies",
      "css",
      "css",
      "ui development",
      "ui development",
      "user interface designing",
      "user interface designing",
      "photoshop",
      "photoshop",
      "bootstrap",
      "bootstrap",
      "prototype",
      "prototype",
      "ajax",
      "ajax",
      "javascript",
      "javascript",
      "jquery",
      "jquery",
      "markup languages",
      "markup languages",
      "coding",
      "coding",
      "angular",
      "angular",
      "react.js",
      "react.js",
      "json",
      "json",
      "php",
      "php",
      "html",
      "html",
      "web development",
      "web development",
      "mysql",
      "mysql",
      "web designing",
      "web designing"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-techsolv-it-service-bardhaman-0-to-2-years-250325505417",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.797Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.798Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.798Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee3878"
    },
    "title": "FrontEnd Developer",
    "description": "Description\nThe candidate should have a strong foundation in web technologies, particularly HTML, CSS, JavaScript, and Angular. As a Front-End Developer, you will be responsible for creating visually appealing and user-friendly web interfaces that enhance the user experience.\nKey Responsibilities\nDevelop and maintain web applications using HTML, CSS, JavaScript, and Angular.\nCollaborate with designers and back-end developers to implement responsive and interactive user interfaces.\nWrite clean, efficient, and well-documented code.\nDebug and troubleshoot issues across different browsers and devices.\nStay up-to-date with the latest industry trends and technologies to ensure the best user experience.\nParticipate in code reviews and provide constructive feedback to peers. Requirements.\nRequired Skills and Qualifications\nBachelors degree Computer Science or relevant filed.\nProficiency in HTML5 and CSS3.\nStrong knowledge of JavaScript and its frameworks/libraries.\nBasic understanding of Angular or willingness to learn and work with Angular.\nFamiliarity with responsive design principles and techniques.\nUnderstanding of cross-browser compatibility issues and ways to work around them.\nGood problem-solving skills and attention to detail.\nJob Location- Pune\nRole Front End Developer\nDesired Skills Proficiency in HTML5 and CSS3, Basic understanding of Angular.\nAdditional Information- 0-6 Months Experience, Internship Experience Prefered.\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nComputer scienceBasicBackendCSSWeb technologieshtml5JavascriptHTMLInternshipCSS3",
    "company": "Icodex Publishing Solutions",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "No fixed duration",
    "salary": "Unpaid",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Computer science",
      "Computer science",
      "Basic",
      "Basic",
      "Backend",
      "Backend",
      "CSS",
      "CSS",
      "Web technologies",
      "Web technologies",
      "html5",
      "html5",
      "Javascript",
      "Javascript",
      "HTML",
      "HTML",
      "Internship",
      "Internship",
      "CSS3",
      "CSS3"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-icodex-publishing-solutions-pune-0-to-1-years-020425502715",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.815Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.816Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.816Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee3879"
    },
    "title": "Frontend Developer",
    "description": "Job description\nCreate responsive and intuitive user interfaces for our web applications. Work closely with designers and backend developers to implement seamless user experiences.\nSkills:\nHTML, CSS, TailwindCSS, JavaScript, jQuery, Blazor pages\nRole: Front End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nreduxcssweb applicationui developmentbootstrapajaxjqueryreact.jselastic searchgitasp.netjsonhtmlweb developmentmysqltypescriptmongodbc#frontend developmentfront endgithubjavascriptsql serverangularnode.jsblazorangularjs\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "Link Ideas Technologies",
    "companyLogo": "NA",
    "location": "Bhilai",
    "experience": "0 - 3 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "redux",
      "redux",
      "css",
      "css",
      "web application",
      "web application",
      "ui development",
      "ui development",
      "bootstrap",
      "bootstrap",
      "ajax",
      "ajax",
      "jquery",
      "jquery",
      "react.js",
      "react.js",
      "elastic search",
      "elastic search",
      "git",
      "git",
      "asp.net",
      "asp.net",
      "json",
      "json",
      "html",
      "html",
      "web development",
      "web development",
      "mysql",
      "mysql",
      "typescript",
      "typescript",
      "mongodb",
      "mongodb",
      "c#",
      "c#",
      "frontend development",
      "frontend development",
      "front end",
      "front end",
      "github",
      "github",
      "javascript",
      "javascript",
      "sql server",
      "sql server",
      "angular",
      "angular",
      "node.js",
      "node.js",
      "blazor",
      "blazor",
      "angularjs",
      "angularjs"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-link-ideas-technologies-bhilai-0-to-3-years-270525502135",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.833Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.834Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.834Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee387a"
    },
    "title": "Frontend Developer",
    "description": "Description\nBuild and maintain front-end templates\nProblem solving and creative thinking\nBe a good communicator and confident enough to work with colleague\nSupport throughout test and implementation\nIntegrate applications with network systems, servers and databases.\nTroubleshoot problems with application development and use.\nExcellent conceptual, and critical thinking capabilities.\nSelf-directed and self-motivated with the ability to take charge or play a supporting role.\nStrong understanding of product development.\nProficient understanding of cross-browser compatibility issues and ways to work around them\nStrong object-oriented JavaScript.\nMobile/Responsive UI development\nSkills in one or more chosen frameworks/libraries like jQuery or Bootstrap\nGit/GitHub, Continuous integration.\nRole: Technical Lead\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate, B.Tech/B.E. in Any Specialization, B.B.A/ B.M.S in Management, BCA in Computers\nPG: M.Tech in Any Specialization, MCA in Computers\nKey Skills\nUnixLinuxNetworkingXMLMySQLPHPHTMLWindowsSEOAjax\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "Shunya Ekai Tech",
    "companyLogo": "NA",
    "location": "Gurugram",
    "experience": "No fixed duration",
    "salary": "Unpaid",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Unix",
      "Unix",
      "Linux",
      "Linux",
      "Networking",
      "Networking",
      "XML",
      "XML",
      "MySQL",
      "MySQL",
      "PHP",
      "PHP",
      "HTML",
      "HTML",
      "Windows",
      "Windows",
      "SEO",
      "SEO",
      "Ajax",
      "Ajax"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-shunya-ekai-tech-gurugram-0-to-3-years-211022501121",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.869Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.870Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.870Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee387b"
    },
    "title": "Frontend Developer",
    "description": "Job description\nInfizius is looking for Frontend Developer to join our dynamic team and embark on a rewarding career journey.\nUse markup languages like HTML to create user-friendly web pages\nMaintain and improve website\nOptimize applications for maximum speed\nDesign mobile-based features\nCollaborate with back-end developers and web designers to improve usability\nGet feedback from, and build solutions for, users and customers\nWrite functional requirement documents and guides\nCreate quality mockups and prototypes\nHelp back-end developers with coding and troubleshooting\nEnsure high quality graphic standards and brand consistency\nStay up-to-date on emerging technologies\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nFront end\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "Infizius",
    "companyLogo": "NA",
    "location": "Mumbai",
    "experience": "0 - 1 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Front end",
      "Front end"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-infizius-mumbai-surat-0-to-1-years-201124513169",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.904Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.905Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.905Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee387c"
    },
    "title": "Frontend Developer",
    "description": "Job description\n\n\nCollaborate with cross-functional teams to achieve strategic outcomes\n\n\nApply subject expertise to support operations, planning, and decision-making\n\n\nUtilize tools, analytics, or platforms relevant to the job domain\n\n\nEnsure compliance with policies while improving efficiency and outcomes\nRole: Front End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nFront end\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "RD Info Global Solutions",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "1 - 5 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Front end",
      "Front end"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-rd-info-global-solutions-pune-1-to-5-years-120525504886",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.921Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.922Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.922Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12cc1f8336890ee387d"
    },
    "title": "Frontend Developer",
    "description": "Job description\nUnited Monks is looking for Frontend Developer to join our dynamic team and embark on a rewarding career journey\n\n\nUse markup languages like HTML to create user-friendly web pages\nMaintain and improve website\nOptimize applications for maximum speed\nDesign mobile-based features\nCollaborate with back-end developers and web designers to improve usability\nGet feedback from, and build solutions for, users and customers\nWrite functional requirement documents and guides\nCreate quality mockups and prototypes\nHelp back-end developers with coding and troubleshooting\nEnsure high quality graphic standards and brand consistency\nStay up-to-date on emerging technologies\nRole: Front End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nFront end\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "United Monks Technologies",
    "companyLogo": "NA",
    "location": "Kolkata",
    "experience": "0 - 5 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Front end",
      "Front end"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-united-monks-kolkata-0-to-5-years-120325503470",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:04.958Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:04.959Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:04.959Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12dc1f8336890ee387e"
    },
    "title": "Frontend Developer",
    "description": "Job description\n\n \n\nDeveloping new user-facing features using React.js\nBuilding reusable components and front-end libraries for future use\nTranslating UIUX design wireframes into high-quality code that will produce visual elements of the application\nOptimizing components for maximum performance across a vast array of web-capable devices and browsers\nCreating unit, scenario, integration sanity test, etc. if required\nCreating documentation for your code\n\nSkill(s) required: HTML, CSS, JavaScript, Data Structures, User Interface (UI) Development, Wireframing, GitHub, ReactJS and Redux\n\nRole: Back End Developer\nIndustry Type: Internet\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Post Graduation Not Required\nKey Skills\nUI developmentPOPgithubFront endData structureswireframingHTMLCustomer supportCustomer experienceMonitoring",
    "company": "Famepilot",
    "companyLogo": "NA",
    "location": "Gurgaon",
    "experience": "0 - 2 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "UI development",
      "UI development",
      "POP",
      "POP",
      "github",
      "github",
      "Front end",
      "Front end",
      "Data structures",
      "Data structures",
      "wireframing",
      "wireframing",
      "HTML",
      "HTML",
      "Customer support",
      "Customer support",
      "Customer experience",
      "Customer experience",
      "Monitoring",
      "Monitoring"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-famepilot-internet-gurgaon-0-to-2-years-140220500671",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:05.002Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:05.003Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:05.003Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12dc1f8336890ee387f"
    },
    "title": "Junior Frontend Developer",
    "description": "Job description\n\nIn this role, youll be working primarily with React to develop our web application, which is pivotal in bringing transparency to our capital-raising campaigns and enhancing our databasing platform.\n\nJob responsibilities\nDevelop and maintain the front-end of our web application using React.\nCollaborate with the design team to implement user-friendly interfaces.\nEnsure high performance and responsiveness of the application across devices.\nParticipate in code reviews and adhere to best coding practices.\nAssist in integrating our platform with back-end services and databases.\nWork closely with the marketing team to support online campaigns.\nContribute to the continuous improvement of the application based on user feedback.\n\nJob requirements\nBachelor s degree in Computer Science or a related field (or equivalent experience).\nProficiency in front-end technologies, especially React.\nUnderstanding of web markup, including HTML5 and CSS3.\nFamiliarity with server-side CSS pre-processing platforms, such as LESS and SASS.\nExperience with responsive and adaptive design.\nBasic understanding of backend technologies is advantageous.\nStrong problem-solving skills and attention to detail.\nAbility to work in a collaborative team environment.\nEagerness to learn and adapt in a fast-paced startup atmosphere.\nRole: Software Development - Other\nIndustry Type: Financial Services\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nComputer scienceBasicSIDEBackendFront endWeb technologiesCodingWeb applicationContinuous improvementCSS3\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "Capitalxai",
    "companyLogo": "NA",
    "location": "Kolkata",
    "experience": "0 - 2 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Computer science",
      "Computer science",
      "Basic",
      "Basic",
      "SIDE",
      "SIDE",
      "Backend",
      "Backend",
      "Front end",
      "Front end",
      "Web technologies",
      "Web technologies",
      "Coding",
      "Coding",
      "Web application",
      "Web application",
      "Continuous improvement",
      "Continuous improvement",
      "CSS3",
      "CSS3"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-junior-frontend-developer-capitalxai-com-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-2-years-201223501388",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:05.017Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:05.019Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:05.019Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12dc1f8336890ee3880"
    },
    "title": "Frontend Developer",
    "description": "Job description\nRiz Software Consultancy is looking for Frontend Developer to join our dynamic team and embark on a rewarding career journey.\nUse markup languages like HTML to create user-friendly web pages\nMaintain and improve website\nOptimize applications for maximum speed\nDesign mobile-based features\nCollaborate with back-end developers and web designers to improve usability\nGet feedback from, and build solutions for, users and customers\nWrite functional requirement documents and guides\nCreate quality mockups and prototypes\nHelp back-end developers with coding and troubleshooting\nEnsure high quality graphic standards and brand consistency\nStay up-to-date on emerging technologies\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nfrontend developmentfront endemerging technologiescssui developmentuser interface designingphotoshopbootstrapprototypeajaxjavascriptjquerymarkup languagescodingangularreact.jsjsonphphtmlweb developmentmysqlweb designing",
    "company": "riz Software Consultancy",
    "companyLogo": "NA",
    "location": "Kolkata",
    "experience": "0 - 3 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "frontend development",
      "frontend development",
      "front end",
      "front end",
      "emerging technologies",
      "emerging technologies",
      "css",
      "css",
      "ui development",
      "ui development",
      "user interface designing",
      "user interface designing",
      "photoshop",
      "photoshop",
      "bootstrap",
      "bootstrap",
      "prototype",
      "prototype",
      "ajax",
      "ajax",
      "javascript",
      "javascript",
      "jquery",
      "jquery",
      "markup languages",
      "markup languages",
      "coding",
      "coding",
      "angular",
      "angular",
      "react.js",
      "react.js",
      "json",
      "json",
      "php",
      "php",
      "html",
      "html",
      "web development",
      "web development",
      "mysql",
      "mysql",
      "web designing",
      "web designing"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-riz-software-consultancy-kolkata-0-to-3-years-080125502408",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:05.034Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:05.035Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:05.035Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12dc1f8336890ee3881"
    },
    "title": "Frontend Developer – JavaScript",
    "description": "Job description\n\nKey accountabilities/KRAs/KPIs:\n\nIntegration of user-facing elements developed by front-end developers with server side logic\nWriting reusable, testable, and efficient code.\nDesign and implementation of low-latency, high-availability, and performant applications.\nGet involved in all aspects of the teams development. Be open to learn AWS Cloud, Angular and Java if required.\n\n\n\n\n\n\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nJava DeveloperFrontend DeveloperSoftware DevelopmentAnalytical SkillsJunitJavascript. NetAngularTestingServer Side",
    "company": "Momentum Metropolitan Holdings",
    "companyLogo": "NA",
    "location": "Mumbai",
    "experience": "0 - 5 years",
    "salary": "Not Disclosed",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Java Developer",
      "Java Developer",
      "Frontend Developer",
      "Frontend Developer",
      "Software Development",
      "Software Development",
      "Analytical Skills",
      "Analytical Skills",
      "Junit",
      "Junit",
      "Javascript",
      "Javascript",
      ". Net",
      ". Net",
      "Angular",
      "Angular",
      "Testing",
      "Testing",
      "Server Side",
      "Server Side"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-javascript-momentum-metropolitan-services-private-limited-mumbai-0-to-5-years-240122501093",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:05.069Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:05.070Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:05.070Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12dc1f8336890ee3882"
    },
    "title": "Frontend Developer - Intern",
    "description": "Description\nWe are seeking a passionate and eager-to-learn Frontend Developer - Intern who is excited to apply their knowledge in real-world projects. This role offers an opportunity to work closely with our experienced development team, allowing you to gain hands-on experience in frontend development and contribute to meaningful projects. If youre someone who enjoys learning new skills, experimenting with code, and growing as a developer, we d love to hear from you!\n\nKey Responsibilities:\n- Assist in the development of user-facing features and web applications using HTML, CSS, and JavaScript.\n- Work with modern frontend frameworks like React.js, Vue.js, or Angular (prior experience is a plus but not required).\n- Collaborate with senior developers to integrate frontend components with backend services and APIs.\n- Translate UI/UX design mock-ups into code that produces engaging, responsive, and user-friendly web applications.\n- Participate in code reviews, learning best practices and improving code quality.\n- Optimize code for speed, scalability, and maintainability.\n- Troubleshoot and debug minor issues, with guidance from senior developers.\n- Continuously learn and apply new frontend techniques and industry trends.\n\nQualifications:\n- Currently studying Computer Science, Information Technology, Web Development, or a related field.\n- Basic understanding of HTML, CSS, and JavaScript .\n- Familiarity with any frontend framework (React.js, Vue.js, or Angular) is a plus.\n- Interest in responsive design and creating mobile-friendly web applications.\n- Eagerness to learn and adapt to new tools and frameworks.\n- Knowledge of version control systems (e.g., Git) is a plus but not mandatory.\n- Excellent problem-solving skills and attention to detail.\n\nWhat We Offer:\n- Hands-on experience working on real projects.\n- Mentorship and guidance from experienced developers.\n- Flexible working hours to accommodate academic commitments.\n- A supportive environment to experiment, learn, and grow.\n- Potential for a full-time position after the internship based on performance.\nPowered by\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nComputer scienceBackendVersion controlGITFront endWeb developmentJavascriptHTMLInformation technologyInternship\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "Revive Analytics",
    "companyLogo": "NA",
    "location": "Kolkata",
    "experience": "No fixed duration",
    "salary": "Unpaid",
    "posted": "3+ weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Computer science",
      "Computer science",
      "Backend",
      "Backend",
      "Version control",
      "Version control",
      "GIT",
      "GIT",
      "Front end",
      "Front end",
      "Web development",
      "Web development",
      "Javascript",
      "Javascript",
      "HTML",
      "HTML",
      "Information technology",
      "Information technology",
      "Internship",
      "Internship"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-intern-reviveanalytics-private-limited-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-0-to-5-years-091224502968",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:05.106Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:05.108Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:05.108Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f12dc1f8336890ee3883"
    },
    "title": "Frontend Developer - H5",
    "description": "Job description\nStrong knowledge of mobile responsive single-page applications and progressive web application using vue.JS (vuex and vue-router);\nExperience in Java development.\nFamiliarity with RESTful APIs to connect web applications to back-end services\nProficient understanding of web markup, including HTML5, CSS3, XML and JSON\nProficient understanding of client-side scripting and JavaScript frameworks, preferably vue.js\nExperience with offline storage, threading, and performance tuning\nFamiliarity with Google Analytics, Google Tag Manager and Google Optimize\nProficient understanding of code versioning tools, such as Git\nFamiliarity with project management tools, such as JIRA\nFamiliarity with CI/CD\nDOES\nTranslate designs and wireframes into high quality code\nDesign, build, and maintain high performance, reusable, and reliable code\nEnsure the best possible performance, quality, and responsiveness of the web application\nIdentify and correct bottlenecks and fix bugs\nHelp maintain code quality, organization, and automatization\nDISPLAYS\nAdvocates web UI design principles, patterns, and best practices\nAbility to understand business requirements and translate them into technical requirements\nA knack for benchmarking and optimization\nStays in touch with The TEAM via main preferred channels, ie. Telegram, email and mobile;\nDemonstrates expertise and leadership in Web development;\nDELIVERS\nDeliver assigned task based on requirement specifications\nEnsure quality of code\nRole: Front End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nPerformance tuningGoogle AnalyticsUser interface designingProject managementXMLWeb applicationWeb developmentJSONJIRACSS3\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "Myridius x Aethereus",
    "companyLogo": "NA",
    "location": "Kolkata",
    "experience": "6 - 10 years",
    "salary": "Not Disclosed",
    "posted": "6 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Performance tuning",
      "Performance tuning",
      "Google Analytics",
      "Google Analytics",
      "User interface designing",
      "User interface designing",
      "Project management",
      "Project management",
      "XML",
      "XML",
      "Web application",
      "Web application",
      "Web development",
      "Web development",
      "JSON",
      "JSON",
      "JIRA",
      "JIRA",
      "CSS3",
      "CSS3"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-frontend-developer-h5-myridius-x-aethereus-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-6-to-10-years-090925503707",
    "scrappedAt": {
      "$date": "2025-09-16T05:10:05.146Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:10:05.147Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:10:05.147Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1d937b3c858543310ea"
    },
    "title": "GEN AI/ML - Backend Developer",
    "description": "Job description\n\nKey Responsibilities:\n\n\n\nAssist in developing and deploying AI/ML models for business use cases.\nWork with Large Language Models (LLMs) and related tools/APIs.\nSupport in creating AI-driven prototypes and proof-of-concepts.\nResearch and apply AI techniques for real-world problems.\nCollaborate with the team to refine AI use cases and improve model performance.\n\n\n\nRequired Skills:\n\n\n\nBasic understanding of AI/ML concepts and model lifecycle.\nFamiliarity with Python and AI frameworks (e.g., TensorFlow, PyTorch, Hugging Face).\nExposure to Large Language Models (e.g., OpenAI, LLaMA, Claude) and prompt engineering.\nKnowledge of data preprocessing and model evaluation techniques.\nStrong problem-solving skills and eagerness to learn emerging AI trends.\n\n\n\nGood to Have:\n\n\n\nAcademic or personal AI/ML projects.\nKnowledge of cloud platforms (AWS, Azure, GCP) for AI deployments.\nRole: Back End Developer\nIndustry Type: Telecom / ISP\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: B.Tech/B.E. in Any Specialization, BCA in Any Specialization\nPG: M.Tech in Any Specialization, MCA in Any Specialization\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nLanguage learning modelGenerative Artificial IntelligenceMachine LearningBackend Development\nBackendOpenaiCloud PlatformPython",
    "company": "Airtel",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "1 - 3 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "3",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Language learning model",
      "Language learning model",
      "Generative Artificial Intelligence",
      "Generative Artificial Intelligence",
      "Machine Learning",
      "Machine Learning",
      "Backend Development",
      "Backend Development",
      "Backend",
      "Backend",
      "Openai",
      "Openai",
      "Cloud Platform",
      "Cloud Platform",
      "Python",
      "Python"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-gen-ai-ml-backend-developer-airtel-pune-1-to-3-years-080925002275",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:57.829Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:57.835Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:57.835Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1d937b3c858543310eb"
    },
    "title": "Backend Developer",
    "description": "Job description\nEncoreSky Technologies Pvt. Ltd is looking for Backend Developer to join our dynamic team and embark on a rewarding career journey Analyzing business requirements and translating them into technical specifications\n\nDesigning and implementing scalable and efficient backend systems, including databases, APIs, and server-side logicWriting clean, maintainable, and efficient code that adheres to industry best practices and standards\n\nCollaborating with front-end developers, designers, and stakeholders to ensure the smooth delivery of projectsImplementing security and data protection measures to ensure the confidentiality and integrity of sensitive informationTesting and debugging applications to ensure they are functioning correctly and fixing any issues that ariseMonitoring performance and optimizing backend systems to ensure they run efficiently and meet SLAs\n\nStrong experience with backend development technologies, such as SQL, Node\n\njs, Python, Ruby on Rails, or JavaKnowledge of database design, web application architecture, and RESTful API developmentStrong problem-solving skills and the ability to think creatively and criticallyExcellent communication and collaboration skills, with the ability to work effectively with technical and non-technical stakeholders\n\nDisclaimer: This job description has been sourced from a public domain and may have been modified by Naukri.com to improve clarity for our users. We encourage job seekers to verify all details directly with the employer via their official channels before applying.\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nBackend\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "Encoresky Technologies",
    "companyLogo": "NA",
    "location": "Indore",
    "experience": "0 - 2 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "50+",
    "aboutCompany": "EncoreSky Technologies Pvt. Ltd is a global digital solutions provider specializing in managed IT services, AI, and web development. The company emphasizes innovation, collaboration, and professional growth, offering a dynamic work environment for tech professionals. Their career page highlights roles in cutting-edge technologies and client-focused service delivery",
    "keySkills": [
      "Backend",
      "Backend"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-encoresky-technologies-pvt-ltd-indore-0-to-2-years-150925503367",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:57.891Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:57.894Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:57.894Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1d937b3c858543310ec"
    },
    "title": "BackEnd developer",
    "description": "Job description\n\nAt Capgemini Engineering, the world leader in engineering services, we bring together a global team of engineers, scientists, and architects to help the worlds mostinnovative companies unleash their potential. From autonomous cars to life-saving robots, our digital and software technology experts think outside the box as theyprovide unique R&D and engineering services across all industries. Join us for a career full of opportunities. Where you can make a difference. Where no two days arethe same.\n\n About The Role  \n\n About The Role : \n\n Experience  in ETL development with a focus on  Pentaho Data Integration .\n\nStrong SQL skills and experience with relational databases (e.g., MySQL, PostgreSQL, Oracle, SQL Server).\n\nExperience with data modeling and data warehousing concepts.\n\nFamiliarity with scripting languages (e.g., Shell, Python) is a plus.\n\nExperience with version control systems like Git.Strong problem-solving and analytical skills.Excellent communication and teamwork abilities.\n\n About The Role - Grade Specific \nFocus on Industrial Operations Engineering. Develops competency in own area of expertise. Shares expertise and provides guidance and support to others. Interprets clients needs. Completes own role independently or with minimum supervision. Identifies problems and relevant issues in straight forward situations and generates solutions. Contributes in teamwork and interacts with customers.\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: B.Tech/B.E. in Any Specialization\nPG: Any Postgraduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\npythondata warehousingsqlpentahoetl\noracleversion controlrelational databasesbackend developmentsql servergitjavapostgresqldata modelingmysqlshell scriptingdata integrationscripting languagesetl developmentengineering services",
    "company": "Capgemini",
    "companyLogo": "NA",
    "location": "Chennai",
    "experience": "2 - 4 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "NA",
    "applicants": "29",
    "aboutCompany": "NA",
    "keySkills": [
      "python",
      "python",
      "data warehousing",
      "data warehousing",
      "sql",
      "sql",
      "pentaho",
      "pentaho",
      "etl",
      "etl",
      "oracle",
      "oracle",
      "version control",
      "version control",
      "relational databases",
      "relational databases",
      "backend development",
      "backend development",
      "sql server",
      "sql server",
      "git",
      "git",
      "java",
      "java",
      "postgresql",
      "postgresql",
      "data modeling",
      "data modeling",
      "mysql",
      "mysql",
      "shell scripting",
      "shell scripting",
      "data integration",
      "data integration",
      "scripting languages",
      "scripting languages",
      "etl development",
      "etl development",
      "engineering services",
      "engineering services"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-capgemini-technology-services-india-limited-chennai-2-to-4-years-080925931849",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:57.929Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:57.931Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:57.931Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1d937b3c858543310ed"
    },
    "title": "Backend Developer",
    "description": "Job description\n\n\nBackend Developer for IBM Storage FlashSystems\n\n\nRequired education\nBachelor's Degree\n\nPreferred education\nMaster's Degree\n\nRequired technical and professional expertise\n\n Required Professional and Technical Expertise : \n2+ years of relevant experience Development.\nExperience in Algorithms, Data Structures/File Structures\nStrong skills in Unix/Linux internals – Hands-on in multi-threading, synchronization, interrupt handling & file systems, Kernel programming etc. User space Programming, Debugging.\nStrong C, Python, Linux Systems Programmer skills.\nGood problem-solving skills for complex issues with interdependencies across multiple modules.\nKnowledge and hand-on usage of code and defect management tools.\nAbility to crisply communicate with stake holders (clients and level 3 support teams) for resolving field issues.\nGood written/verbal communication skills to report program status crisply and accurately.\nExperience working with Global teams.\nFamiliarity with Host OS virtualization (VMware, MS Hyper-V)\nAbility to go through protocol specifications.\nDevelopment and build tools in a Linux development environment.\n\n\nPreferred technical and professional experience\n Good to have\n\n\nSkills:\n \nGood Storage domain knowledge with hands-on experience on storage software stack implementation and features like High availability, storage multi-pathing solutions.\nGood understanding of storage protocols such as Fibre Channel, FCoE, SCSI, iSCSI, LLDP, SAN, Multipath IO etc.\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nalgorithmslinux internalslinuxdata structuresunix\nsanpythonkernelvmwarefile systembackend developmentfile interfacesiscsiscsilinux developmentfibre channelalv reportsdebuggingmultithreadingsmartformsfcoeprotocolssap abaplldp",
    "company": "IBM",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "2 - 7 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "NA",
    "applicants": "Less than 10",
    "aboutCompany": "NA",
    "keySkills": [
      "algorithms",
      "algorithms",
      "linux internals",
      "linux internals",
      "linux",
      "linux",
      "data structures",
      "data structures",
      "unix",
      "unix",
      "san",
      "san",
      "python",
      "python",
      "kernel",
      "kernel",
      "vmware",
      "vmware",
      "file system",
      "file system",
      "backend development",
      "backend development",
      "file interfaces",
      "file interfaces",
      "iscsi",
      "iscsi",
      "scsi",
      "scsi",
      "linux development",
      "linux development",
      "fibre channel",
      "fibre channel",
      "alv reports",
      "alv reports",
      "debugging",
      "debugging",
      "multithreading",
      "multithreading",
      "smartforms",
      "smartforms",
      "fcoe",
      "fcoe",
      "protocols",
      "protocols",
      "sap abap",
      "sap abap",
      "lldp",
      "lldp"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-ibm-india-pvt-limited-pune-2-to-7-years-150925916053",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:57.966Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:57.968Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:57.968Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1d937b3c858543310ee"
    },
    "title": "Backend Developer",
    "description": "Job description\nSEO Space Castle is looking for Backend Developer to join our dynamic team and embark on a rewarding career journey\nAnalyzing business requirements and translating them into technical specificationsDesigning and implementing scalable and efficient backend systems, including databases, APIs, and server-side logicWriting clean, maintainable, and efficient code that adheres to industry best practices and standards\nCollaborating with front-end developers, designers, and stakeholders to ensure the smooth delivery of projectsImplementing security and data protection measures to ensure the confidentiality and integrity of sensitive information\nTesting and debugging applications to ensure they are functioning correctly and fixing any issues that ariseMonitoring performance and optimizing backend systems to ensure they run efficiently and meet SLAs\nStrong experience with backend development technologies, such as SQL, Node\njs, Python, Ruby on Rails, or JavaKnowledge of database design, web application architecture, and RESTful API developmentStrong problem-solving skills and the ability to think creatively and criticallyExcellent communication and collaboration skills, with the ability to work effectively with technical and non-technical stakeholders\nRole: Back End Developer\nIndustry Type: Advertising & Marketing\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nrestpythonsoftware testingweb application architecturedbmsbackend developmentjavascriptjquerysqlrubydatabase designspringnode.jsjavaruby railsrailsdebuggingtechnical specificationshtmlmysqlapicommunication skillsarchitecture",
    "company": "SEO Space Castle",
    "companyLogo": "NA",
    "location": "Mohali",
    "experience": "1 - 4 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "31",
    "aboutCompany": "SEO Space Castle is a full-service digital marketing agency offering expertise in SEO, PPC, content creation, social media management, and web development. Their job listings span roles like SEO Executive, Digital Marketing Manager, and UI/UX Designer, reflecting a comprehensive focus on online brand growth and performance optimization",
    "keySkills": [
      "rest",
      "rest",
      "python",
      "python",
      "software testing",
      "software testing",
      "web application architecture",
      "web application architecture",
      "dbms",
      "dbms",
      "backend development",
      "backend development",
      "javascript",
      "javascript",
      "jquery",
      "jquery",
      "sql",
      "sql",
      "ruby",
      "ruby",
      "database design",
      "database design",
      "spring",
      "spring",
      "node.js",
      "node.js",
      "java",
      "java",
      "ruby rails",
      "ruby rails",
      "rails",
      "rails",
      "debugging",
      "debugging",
      "technical specifications",
      "technical specifications",
      "html",
      "html",
      "mysql",
      "mysql",
      "api",
      "api",
      "communication skills",
      "communication skills",
      "architecture",
      "architecture"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-seo-space-castle-mohali-1-to-4-years-150925502113",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:57.993Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:57.994Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:57.994Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310ef"
    },
    "title": "BackEnd developer",
    "description": "Job description\n\nAt Capgemini Engineering, the world leader in engineering services, we bring together a global team of engineers, scientists, and architects to help the worlds mostinnovative companies unleash their potential. From autonomous cars to life-saving robots, our digital and software technology experts think outside the box as theyprovide unique R&D and engineering services across all industries. Join us for a career full of opportunities. Where you can make a difference. Where no two days arethe same.\n\n About The Role  \n\n About The Role : \n\nGood knowledge in Java 1.8,\n\nReactive Technology is mustSpring 5/ Spring Boot\n\nExperience in Microservices Architecture (REST services) is mandatory\n\nKnowledge in any of the database Oracle/ No SQL/ Maria DB / My SQL\n\nUnderstanding of design patterns\n\nExposure to tools - Bit bucket, GIT, Maven, Jira, Intellij, Eclise\n\nFamiliarity with Agile methods and Continuous Integration including but not limited to Program and Release Backlog Management (Jira), Defect Tracking (Jira), Collaboration (Confluence, Jive, others)\n\nCode Review tools (Sonar, Findbugs)\n\nExperience in Swagger classes\n\nExperience in Authorization and Authentication modules\n\nExperience in JPA and Spring Security\n\nExperience in RabbitMQ\n\n About The Role - Grade Specific \nFocus on Industrial Operations Engineering. Develops competency in own area of expertise. Shares expertise and provides guidance and support to others. Interprets clients needs. Completes own role independently or with minimum supervision. Identifies problems and relevant issues in straight forward situations and generates solutions. Contributes in teamwork and interacts with customers.\n\n Skills (competencies) \n\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: B.Tech/B.E. in Any Specialization\nPG: Any Postgraduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nmicroservicesspringjavajpaspring boot\ncontinuous integrationconfluencesonarbitbucketswaggerartificial intelligenceintellij ideagitdesign patternsmysqljirajiverestoraclemavenrabbitmqnosqlmariadbfindbugsspring securityagile",
    "company": "Capgemini",
    "companyLogo": "NA",
    "location": "Chennai",
    "experience": "2 - 4 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "NA",
    "applicants": "50+",
    "aboutCompany": "NA",
    "keySkills": [
      "microservices",
      "microservices",
      "spring",
      "spring",
      "java",
      "java",
      "jpa",
      "jpa",
      "spring boot",
      "spring boot",
      "continuous integration",
      "continuous integration",
      "confluence",
      "confluence",
      "sonar",
      "sonar",
      "bitbucket",
      "bitbucket",
      "swagger",
      "swagger",
      "artificial intelligence",
      "artificial intelligence",
      "intellij idea",
      "intellij idea",
      "git",
      "git",
      "design patterns",
      "design patterns",
      "mysql",
      "mysql",
      "jira",
      "jira",
      "jive",
      "jive",
      "rest",
      "rest",
      "oracle",
      "oracle",
      "maven",
      "maven",
      "rabbitmq",
      "rabbitmq",
      "nosql",
      "nosql",
      "mariadb",
      "mariadb",
      "findbugs",
      "findbugs",
      "spring security",
      "spring security",
      "agile",
      "agile"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-capgemini-technology-services-india-limited-chennai-2-to-4-years-080925932168",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.029Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.062Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.062Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310f0"
    },
    "title": "C# .Net Backend Developer (Remote, Full-Time)",
    "description": "Job description\n\nAbout Smart Working\n\nAt Smart Working, we believe your job should not only look right on paper but also feel right every day. This isnt just another remote opportunity - its about finding where you truly belong, no matter where you are. From day one, youre welcomed into a genuine community that values your growth and well-being.\nOur mission is simple: to break down geographic barriers and connect skilled professionals with outstanding global teams and products for full-time, long-term roles. We help you discover meaningful work with teams that invest in your success, where youre empowered to grow personally and professionally.Join one of the highest-rated workplaces on Glassdoor and experience what it means to thrive in a truly remote-first world.\n\n\n\n\n\nAbout the role\n\nAs a C# .Net Backend Developer, youll design and build backend systems with a focus on scalability, security, and reliability. Youll implement best practices to deliver high-quality, performant solutions; write and maintain efficient, reusable code; monitor delivery to ensure solutions meet business requirements and agreed timescales; proactively mentor and support teammates; identify and resolve bottlenecks and defects; and produce clear documentation to aid knowledge transfer.\n\n\n\n\nResponsibilities\n\nDesign new features and systems emphasizing scalability, security, and reliability\nImplement best practices to deliver high-quality, performant, and scalable solutions\nWrite and maintain efficient, reusable, robust code in .NET/C#\nMonitor progress and outputs so solutions meet business requirements and are delivered within agreed timescales\nProactively mentor and support team members\nIdentify bottlenecks, bugs, and issues, and devise effective solutions\nWrite supporting documentation to enable knowledge transfer\n\nRequirements\n\n5+ years of experience as a backend developer (C#/.NET)\nDomain-Driven Design (DDD): 2+ years commercial experience\nClean Architecture or Onion Architecture experience\n.NET Core proficiency\nC# expertise\nEntity Framework Core 6+ experience\nCQRS implementation experience\n\nNice to have\n\nMediator pattern/library experience\nSQL Server\nSwagger (API documentation)\nSpecFlow (BDD)\nAzure DevOps\nAutomated testing (TDD / BDD)\nLINQ strong proficiency\nAngular 12+\nActive Record pattern\nMicroservices architecture\nIntegration with SAP Business ByDesign API\nAzure Functions\nAzure Message Queues\nAzure API Management (Gateway)\nAzure Key Vault\nPayment provider integration\nShipping provider integration\n\nBenefits\n\nFixed Shifts: 12:00 PM – 8:00 PM IST (Summer) | 1:00 PM – 9:00 PM IST (Winter)\nNo Weekend Work: Real work-life balance, not just words\nDay 1 Benefits: Laptop and full medical insurance provided\nSupport That Matters: Mentorship, community, and forums where ideas are shared\nTrue Belonging: A long-term career where your contributions are valued\n\n\n\nAt Smart Working, you’ll never be just another remote hire.\n\n\n\n\nBe a Smart Worker — valued, empowered, and part of a culture that celebrates integrity, excellence, and ambition.\n\n\n\n\nIf that sounds like your kind of place, we’d love to hear your story. \n\nRole: Back End Developer\nIndustry Type: Software Product\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nCQRSClean or Onion Architecture.NetEntity FrameworkDomain Driven Design\nC#\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nOther\n500/500 Characters left\nSubmit",
    "company": "SWS Smart Working Solutions",
    "companyLogo": "NA",
    "location": "India",
    "experience": "5 - 10 years",
    "salary": "30-35 Lacs P.A.",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "CQRS",
      "CQRS",
      "Clean or Onion Architecture",
      "Clean or Onion Architecture",
      ".Net",
      ".Net",
      "Entity Framework",
      "Entity Framework",
      "Domain Driven Design",
      "Domain Driven Design",
      "C#",
      "C#"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-c-net-backend-developer-remote-full-time-sws-smart-working-solutions-india-5-to-10-years-150925004899",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.082Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.086Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.086Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310f1"
    },
    "title": "Backend Developer",
    "description": "Job description\nUnimity Solutions Pvt Ltd is looking for Backend Developer to join our dynamic team and embark on a rewarding career journey Analyzing business requirements and translating them into technical specificationsDesigning and implementing scalable and efficient backend systems, including databases, APIs, and server-side logicWriting clean, maintainable, and efficient code that adheres to industry best practices and standardsCollaborating with front-end developers, designers, and stakeholders to ensure the smooth delivery of projectsImplementing security and data protection measures to ensure the confidentiality and integrity of sensitive informationTesting and debugging applications to ensure they are functioning correctly and fixing any issues that ariseMonitoring performance and optimizing backend systems to ensure they run efficiently and meet SLAs\n\nStrong experience with backend development technologies, such as SQL, Node\n\njs, Python, Ruby on Rails, or JavaKnowledge of database design, web application architecture, and RESTful API developmentStrong problem-solving skills and the ability to think creatively and criticallyExcellent communication and collaboration skills, with the ability to work effectively with technical and non-technical stakeholders\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nSIDEDrupalBackendAWSSalesforce",
    "company": "Unimity",
    "companyLogo": "NA",
    "location": "Chenani",
    "experience": "0 - 2 years",
    "salary": "Not Disclosed",
    "posted": "6 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "SIDE",
      "SIDE",
      "Drupal",
      "Drupal",
      "Backend",
      "Backend",
      "AWS",
      "AWS",
      "Salesforce",
      "Salesforce"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-unimity-solutions-pvt-ltd-chenani-0-to-2-years-090925500765",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.117Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.131Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.131Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310f2"
    },
    "title": "Backend Developer",
    "description": "Job description\n\nRole Overview\n\nWere looking for a Senior .NET Developer to build scalable backend services and APIs that power enterprise applications. Youll collaborate with frontend developers, architects, and DevOps engineers to deliver secure, reliable, and performant solutions.\n\n\n\n\nResponsibilities\n\n\n\nBuild and maintain REST APIs and backend services using .NET Core/C#\nWork with SQL Server/PostgreSQL databases for transactional and analytics support\nWrite clean, testable, well-documented code\nDesign and implement service-layer logic, background workers, and messaging systems\nCollaborate with React/Angular frontend and DevOps teams on CI/CD pipelines\nFollow secure coding standards and conduct peer code reviews\nAssist in technical documentation and sprint planning\nDebug and resolve production issues using logs, telemetry, and distributed tracing\n\n\n\nRequired Skills\n\n510 years of backend engineering with .NET Core (5/6/7/8)\nStrong skills in C#, REST API design, and SQL performance tuning\nExperience with Entity Framework Core, LINQ, stored procedures\nKnowledge of asynchronous programming, dependency injection, SOLID principles, and clean architecture\nHands-on with Git, CI/CD pipelines (AWS DevOps/GitHub Actions), Docker/containers\n\n\n\nLocation & Work Mode\n\nHyderabad • Hybrid (onsite collaboration when required)\nCan work 100% remote\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nBackendBackend Development\nAPI",
    "company": "Bluebox Global",
    "companyLogo": "NA",
    "location": "Hyderabad",
    "experience": "5 - 10 years",
    "salary": "13-20 Lacs P.A.",
    "posted": "Just now",
    "openings": "1",
    "applicants": "Less than 10",
    "aboutCompany": "<p>BlueBOX Global is a rapidly growing Managed Security Services Provider (MSSP) and technology consultancyheadquartered in Australia, with active operations in the Philippines, India, and the European Union. We partner with enterprises across multiple industriesfinance, manufacturing, and technologyto deliver end-to-end IT, cybersecurity, DevOps, and software development solutions.</p><br><p>Our teams work on mission-critical infrastructure, secure cloud deployments, and modern applications that support global customers 247. Joining BlueBOX means becoming part of a high-performance, international team that values security, innovation, and engineering excellence.</p>",
    "keySkills": [
      "Backend",
      "Backend",
      "Backend Development",
      "Backend Development",
      "API",
      "API"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-bluebox-global-hyderabad-5-to-10-years-160925011840",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.166Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.175Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.175Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310f3"
    },
    "title": "Backend Developer",
    "description": "Job description\nNelito Systems Ltd is looking for Backend Developer to join our dynamic team and embark on a rewarding career journey\nAnalyzing business requirements and translating them into technical specificationsDesigning and implementing scalable and efficient backend systems, including databases, APIs, and server-side logic\nWriting clean, maintainable, and efficient code that adheres to industry best practices and standards\nCollaborating with front-end developers, designers, and stakeholders to ensure the smooth delivery of projectsImplementing security and data protection measures to ensure the confidentiality and integrity of sensitive information\nTesting and debugging applications to ensure they are functioning correctly and fixing any issues that ariseMonitoring performance and optimizing backend systems to ensure they run efficiently and meet SLAs\nStrong experience with backend development technologies, such as SQL, Node\njs, Python, Ruby on Rails, or JavaKnowledge of database design, web application architecture, and RESTful API developmentStrong problem-solving skills and the ability to think creatively and criticallyExcellent communication and collaboration skills, with the ability to work effectively with technical and non-technical stakeholders\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nrestpythonsoftware testingweb application architecturedbmsbackend developmentjavascriptjquerysqlrubydatabase designspringnode.jsjavaruby railsrailsdebuggingtechnical specificationshtmlmysqlapicommunication skillsarchitecture\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nOther\n500/500 Characters left\nSubmit",
    "company": "Nelito System",
    "companyLogo": "NA",
    "location": "Kolkata",
    "experience": "2 - 4 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "50+",
    "aboutCompany": "NA",
    "keySkills": [
      "rest",
      "rest",
      "python",
      "python",
      "software testing",
      "software testing",
      "web application architecture",
      "web application architecture",
      "dbms",
      "dbms",
      "backend development",
      "backend development",
      "javascript",
      "javascript",
      "jquery",
      "jquery",
      "sql",
      "sql",
      "ruby",
      "ruby",
      "database design",
      "database design",
      "spring",
      "spring",
      "node.js",
      "node.js",
      "java",
      "java",
      "ruby rails",
      "ruby rails",
      "rails",
      "rails",
      "debugging",
      "debugging",
      "technical specifications",
      "technical specifications",
      "html",
      "html",
      "mysql",
      "mysql",
      "api",
      "api",
      "communication skills",
      "communication skills",
      "architecture",
      "architecture"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-nelito-systems-ltd-kolkata-2-to-4-years-150925502180",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.235Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.240Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.240Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310f4"
    },
    "title": "Midlevel Backend Developer",
    "description": "Job description\nJPR Systems is looking for Midlevel Backend Developer - 1 to join our dynamic team and embark on a rewarding career journey Analyzing business requirements and translating them into technical specificationsDesigning and implementing scalable and efficient backend systems, including databases, APIs, and server-side logicWriting clean, maintainable, and efficient code that adheres to industry best practices and standardsCollaborating with front-end developers, designers, and stakeholders to ensure the smooth delivery of projectsImplementing security and data protection measures to ensure the confidentiality and integrity of sensitive informationTesting and debugging applications to ensure they are functioning correctly and fixing any issues that ariseMonitoring performance and optimizing backend systems to ensure they run efficiently and meet SLAs\n\nStrong experience with backend development technologies, such as SQL, Node\n\njs, Python, Ruby on Rails, or JavaKnowledge of database design, web application architecture, and RESTful API developmentStrong problem-solving skills and the ability to think creatively and criticallyExcellent communication and collaboration skills, with the ability to work effectively with technical and non-technical stakeholders\n\nDisclaimer: This job description has been sourced from a public domain and may have been modified by Naukri.com to improve clarity for our users. We encourage job seekers to verify all details directly with the employer via their official channels before applying.\nRole: Full Stack Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nweb application architecturedbmsajaxjquerysqldatabase designspringjavagitruby railsrailsdebugginghtmlmysqlapimongodbcommunication skillsarchitecturerestpythonsoftware developmentbackend developmentjavascriptrubynode.jsaws",
    "company": "JPR Systems",
    "companyLogo": "NA",
    "location": "Jaipur",
    "experience": "0 - 3 years",
    "salary": "Not Disclosed",
    "posted": "3 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "At JPR Systems, we develop innovative and creative products and services that provide total communication and information solutions. Among a plethora of services, web design and development, tailor made applications, ERPs, CRMs, e-commerce solutions, business-to-business applications, business-to-client applications, managed hosting and internet portal management",
    "keySkills": [
      "web application architecture",
      "web application architecture",
      "dbms",
      "dbms",
      "ajax",
      "ajax",
      "jquery",
      "jquery",
      "sql",
      "sql",
      "database design",
      "database design",
      "spring",
      "spring",
      "java",
      "java",
      "git",
      "git",
      "ruby rails",
      "ruby rails",
      "rails",
      "rails",
      "debugging",
      "debugging",
      "html",
      "html",
      "mysql",
      "mysql",
      "api",
      "api",
      "mongodb",
      "mongodb",
      "communication skills",
      "communication skills",
      "architecture",
      "architecture",
      "rest",
      "rest",
      "python",
      "python",
      "software development",
      "software development",
      "backend development",
      "backend development",
      "javascript",
      "javascript",
      "ruby",
      "ruby",
      "node.js",
      "node.js",
      "aws",
      "aws"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-midlevel-backend-developer-jpr-systems-jaipur-0-to-3-years-120925502400",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.277Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.280Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.280Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310f5"
    },
    "title": "Backend Developer",
    "description": "Job description\nExcellent Knowledge in Backend/Database/SQL-PLSQL development on all popular databases such as MSSQL, Oracle, Mango DB etc\nETL, Data migration is also required\nProficiency in ASP\nNet, Java, CSS, JavaScript, and frameworks like React\njs, Angular, or Vue\njs and other frontend technologies is must\nFamiliarity with version control systems, notably Git\nExperience with cloud services like AWS, Azure, or Google Cloud\nUnderstanding of security principles and how to apply them to web applications\n\n \n\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nData migrationBackendVersion controlGITFront endSQL databaseCloud ServicesJavascriptASP.NetOracle",
    "company": "Nelito System",
    "companyLogo": "NA",
    "location": "Mumbai",
    "experience": "2 - 5 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Data migration",
      "Data migration",
      "Backend",
      "Backend",
      "Version control",
      "Version control",
      "GIT",
      "GIT",
      "Front end",
      "Front end",
      "SQL database",
      "SQL database",
      "Cloud Services",
      "Cloud Services",
      "Javascript",
      "Javascript",
      "ASP.Net",
      "ASP.Net",
      "Oracle",
      "Oracle"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-nelito-systems-ltd-mumbai-2-to-5-years-150925501788",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.319Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.320Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.320Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310f6"
    },
    "title": "Backend Developer",
    "description": "Job description\n\n\nAI Development team is looking for enthusiastic and talented Backend development Engineer to join us. Our services belong to Match360 product portfolio. Our services are tightly integrated with IBM Cloud Pak for Data where customers can access a suite of leading data and AI capabilities in a unified experience. You are a Backend Developer, who will Design, develop and/or re-engineer complex product components, and integrate software packages, programs and reusable objects residing on multiple platforms. As an ambitious individual who can work under senior architect’s direction towards agreed targets and goals, you have the ability to manage change and to work under stress. You are curious to learn as demonstrated by your up-to-date technical knowledge. You are a good team player and you are familiar with Agile methodologies and principles and/or have experience working in an Agile team. We seek an applicant who will thrive in an open, dynamic, flexible, fun, spirited, collaborative environment; an individual who desires creative freedom and the opportunity to work in a high performing team.\n\nJob Responsibilities:\n\nAs a Backend developer you will be responsible for development/ maintenance/ Support of the Match360 applications through the full systems development lifecycle.\n\nParticipate in the design and implementation of sophisticated software systems front end.\n\nYou will work with the Product Architects, Product Managers to understand various priorities and work towards the execution.\n\nParticipate in software design and code reviews. Reviews include other Software Engineers and are held to ensure a high level of software quality and to share knowledge with team members.\n\nParticipate in, and adhere to, professional software engineering practices using such tools and methodologies as Agile Software Development, Test Driven Development, Continuous Integration, Source Code Management (git), and GitHub.\n\nEnsure good code coverage. Support bug fixes during testing and deploy to target environments.\n\nParticipate in the planning, creation and execution of automated test cases and load/performance testing. Create/maintain technical documentation.\n\nHands on experience in handling and debugging customer issues, work with L2 support team.\n\nMaintain a high level of proficiency with Computer Science/Software Engineering knowledge and contribute to the technical skills growth of other team members.\n\nYou will be providing vigilance and compliance to various software engineering, support and release processes e.g security, stack upgrades that are free of vulnerabilities etc.\"\n\n\n\nRequired education\nBachelor's Degree\n\nRequired technical and professional expertise\n\n5+ years of professional/industrial experience in software development.\n\nExpertise in RESTful APIs, JavaScript, Java J2EE, Microservices Architecture, MVC Web Frameworks. Expertise with consuming REST APIs from JavaScript based UX\n\nExperience in using messaging brokers like RabbitMQ, Kafka etc\n\nUnderstanding and experience writing and executing Unit and Integration Tests as part of Test-Driven DevOps Development\n\nUnderstanding and experience with at least one relational database (DB2, Oracle etc.)\n\nUnderstanding and experience with Agile, and Design/Implementation and Secure Software Engineering Best Practices\n\nWorking knowledge on tools like GitHub, Jenkins, Maven/Gradle.\n\nExperience implementing distributed applications in a container environment\n\nAbility to learn and apply new technologies quickly\n\nStrong sense of ownership of deliverables\n\n\nPreferred technical and professional experience\n\nDegree in Computer Science Engineering, or equivalent professional experience.\n\nWorking experience on Docker/Kubernetes, RedHat OpenShift, Linux Operating Systems (such as Red Hat, Ubuntu, etc.) , the DevOps\n\nExperience working with open-source technologies.\"\n\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nmicroservicesj2eesoftware engineeringrestjavascript\nkubernetescontinuous integrationredhat linuxdockerjavagitdevopslinuxjenkinsmvcgithubuxsoftware developmentoracleubuntumavenrabbitmqgradleweb frameworktddkafkaagile",
    "company": "IBM",
    "companyLogo": "NA",
    "location": "Bengaluru",
    "experience": "5 - 10 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "NA",
    "applicants": "27",
    "aboutCompany": "NA",
    "keySkills": [
      "microservices",
      "microservices",
      "j2ee",
      "j2ee",
      "software engineering",
      "software engineering",
      "rest",
      "rest",
      "javascript",
      "javascript",
      "kubernetes",
      "kubernetes",
      "continuous integration",
      "continuous integration",
      "redhat linux",
      "redhat linux",
      "docker",
      "docker",
      "java",
      "java",
      "git",
      "git",
      "devops",
      "devops",
      "linux",
      "linux",
      "jenkins",
      "jenkins",
      "mvc",
      "mvc",
      "github",
      "github",
      "ux",
      "ux",
      "software development",
      "software development",
      "oracle",
      "oracle",
      "ubuntu",
      "ubuntu",
      "maven",
      "maven",
      "rabbitmq",
      "rabbitmq",
      "gradle",
      "gradle",
      "web framework",
      "web framework",
      "tdd",
      "tdd",
      "kafka",
      "kafka",
      "agile",
      "agile"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-ibm-india-pvt-limited-bengaluru-5-to-10-years-080925933074",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.353Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.359Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.359Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310f7"
    },
    "title": "Backend Developer",
    "description": "Job description\nShould be primarily experienced in backend development and should be able to design, create, and implement a solution that is domain-driven, abstracted, business-oriented, and scalable from scratch, while also able to debug & fix issues.\n\nCore Skills:\nHard Skills:\nC#/.NET (Primary), Azure Functions, T-SQL/SQL Server (inline SQL), REST APIs, Dependency Injection, OpenAPI documentation.\nNice to have:\nJWT, Azure APIM, Azure Data Factory, Azure Service Bus, Redis Caching, CI/CD YAML, Advanced Git\nCompetencies:\nAPI Development: Strong ability to build clean, well-documented, and secure REST APIs that adhere to our architectural standards.\nDatabase Interaction: Proficient in writing performant SQL queries and managing database schemas.\nQuality First: A commitment to writing unit and integration tests as part of their daily workflow, using frameworks like xUnit and/or NUnit.\nReliability: Focuses on building reliable services with robust error handling, logging, and monitoring.\n\nRole: Back End Developer\nIndustry Type: Banking\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nNUnitSQL queriesBackendGITArchitectureDatabase managementManagement consultingMonitoringFinancial services",
    "company": "Capco",
    "companyLogo": "NA",
    "location": "Bengaluru",
    "experience": "2 - 3 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "1",
    "applicants": "50+",
    "aboutCompany": "NA",
    "keySkills": [
      "NUnit",
      "NUnit",
      "SQL queries",
      "SQL queries",
      "Backend",
      "Backend",
      "GIT",
      "GIT",
      "Architecture",
      "Architecture",
      "Database management",
      "Database management",
      "Management consulting",
      "Management consulting",
      "Monitoring",
      "Monitoring",
      "Financial services",
      "Financial services"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-capco-technologies-pvt-ltd-bengaluru-2-to-3-years-050925506153",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.388Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.389Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.389Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310f8"
    },
    "title": "Backend Developer",
    "description": "Job description\nDesign, develop, and maintain scalable backend services using Java and Spring Boot frameworks.\nArchitect robust APIs and microservices with a focus on performance, reliability, and security.\nWrite clean, maintainable, and well-documented code following industry best practices.\nOptimize SQL queries and database schemas for high-performance data access and integrity.\nImplement automated unit, integration, and end-to-end tests to ensure code quality and coverage.\nCollaborate cross-functionally with frontend, DevOps, and product teams to deliver seamless solutions.\nConduct code reviews and mentor junior developers on clean coding and testing principles.\nTroubleshoot production issues and contribute to continuous improvement of system stability.\nMust have skills\nStrong Java/SpringBoot knowledge, API Design, SOLID Principles and Microservices Good to have SQL\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nSQL queriesspring bootBackendCodingMentorContinuous improvementTroubleshootingSQLmicroservicesTesting",
    "company": "Peerislands",
    "companyLogo": "NA",
    "location": "Kolkata",
    "experience": "6 - 12 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "1",
    "applicants": "50+",
    "aboutCompany": "PeerIslands",
    "keySkills": [
      "SQL queries",
      "SQL queries",
      "spring boot",
      "spring boot",
      "Backend",
      "Backend",
      "Coding",
      "Coding",
      "Mentor",
      "Mentor",
      "Continuous improvement",
      "Continuous improvement",
      "Troubleshooting",
      "Troubleshooting",
      "SQL",
      "SQL",
      "microservices",
      "microservices",
      "Testing",
      "Testing"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-peerislands-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-6-to-12-years-020925503517",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.425Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.428Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.428Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310f9"
    },
    "title": "Backend Developer",
    "description": "Job description\n\n\nFor Installer:\nBachelor's degree in Computer Science, Software Engineering, or a related field.\n4+ years of experience in software development, with a significant focus on installer development for enterprise products.\nProficiency in one or more installer development tools such as Java Script, Java J2EE.\nStrong scripting skills (e.g., Shell scripting, Python) for automation and customization.\nSolid understanding of Windows and/or Linux operating systems, including file systems, registry, services, and security models relevant to software installations.\nExperience with database technologies (e.g., SQL Server, Oracle, DB2) and configuring database connections during installation.\nExperience with version control systems (e.g., Git).\nStrong problem-solving and debugging skills, with the ability to analyze and resolve complex technical issues.\nKnowledge of containerization technologies (e.g., Docker, Kubernetes).\nFamiliarity with continuous integration and continuous deployment (CI/CD) pipelines.\nAbility to work independently and as part of a collaborative team in an Agile development environment.\n\n\nRequired education\nBachelor's Degree\n\nRequired technical and professional expertise\n\nFor Installer:\nBachelor's degree in Computer Science, Software Engineering, or a related field.\n4+ years of experience in software development, with a significant focus on installer development for enterprise products.\nProficiency in one or more installer development tools such as Java Script, Java J2EE.\nStrong scripting skills (e.g., Shell scripting, Python) for automation and customization.\nSolid understanding of Windows and/or Linux operating systems, including file systems, registry, services, and security models relevant to software installations.\nExperience with database technologies (e.g., SQL Server, Oracle, DB2) and configuring database connections during installation.\nExperience with version control systems (e.g., Git).\nStrong problem-solving and debugging skills, with the ability to analyze and resolve complex technical issues.\nKnowledge of containerization technologies (e.g., Docker, Kubernetes).\nFamiliarity with continuous integration and continuous deployment (CI/CD) pipelines.\nAbility to work independently and as part of a collaborative team in an Agile development environment.\n\n\nPreferred technical and professional experience\n\nDegree in Computer Science, , Engineering, or equivalent professional experience.\nAn authority on Cloud Native Application architecture, Docker's and Microservices\nWorking experience on Docker/Kubernetes, the DevOps, Micro services, RedHat OpenShift, Java J2EE\nWilling to lead and work on quick proof of concepts.\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\ncontinuous integrationsoftware developmentci/cdjavadebugging\nkubernetespythonoracleredhat openshiftopenshiftdbmsjavascriptsql serverdockermicroservicessqlgitdevopslinuxj2eeshell scriptingagilecloud native architecture",
    "company": "IBM",
    "companyLogo": "NA",
    "location": "Bengaluru",
    "experience": "4 - 9 years",
    "salary": "Not Disclosed",
    "posted": "5 days ago",
    "openings": "NA",
    "applicants": "16",
    "aboutCompany": "NA",
    "keySkills": [
      "continuous integration",
      "continuous integration",
      "software development",
      "software development",
      "ci/cd",
      "ci/cd",
      "java",
      "java",
      "debugging",
      "debugging",
      "kubernetes",
      "kubernetes",
      "python",
      "python",
      "oracle",
      "oracle",
      "redhat openshift",
      "redhat openshift",
      "openshift",
      "openshift",
      "dbms",
      "dbms",
      "javascript",
      "javascript",
      "sql server",
      "sql server",
      "docker",
      "docker",
      "microservices",
      "microservices",
      "sql",
      "sql",
      "git",
      "git",
      "devops",
      "devops",
      "linux",
      "linux",
      "j2ee",
      "j2ee",
      "shell scripting",
      "shell scripting",
      "agile",
      "agile",
      "cloud native architecture",
      "cloud native architecture"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-ibm-india-pvt-limited-bengaluru-4-to-9-years-100925940024",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.462Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.465Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.465Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310fa"
    },
    "title": "Backend Developer",
    "description": "Job description\n\n\nIn the role of Storage Developer, you would be part of design and development of features for IBM Storage family of products, IBM Software Defined Storage portfolio & IBM cloud storage services. You will be owning and driving product functionality as SME and represent it in global product team. You will work with the senior technical leaders and manager in effectively managing the deliverables through technical skills and prior experience.\n\n\nRequired education\nBachelor's Degree\n\nRequired technical and professional expertise\n\n3-7 years of experience.\n\nStrong technical skills in storage system architecture.\n\nProven Storage domain knowledge with hands-on experience on storage software stack implementation and features like High availability, replication and storage multi-pathing solutions.\n\nStrong skills in Unix/Linux internals –\n\noHands-on in multi-threading, synchronization, interrupt handling & file systems, Kernel programming etc.\n\noExperience in Linux Kernel and User space Programming, Debugging, development and build tools in a Linux development environment.\n\noExperience in Algorithms, Data Structures/File Structures\n\nGood understanding of storage protocols such as Fibre Channel, FCoE, SCSI, iSCSI, LLDP, SAN, Multipath IO etc.\n\nAbility to go through and understand protocol specifications.\n\nUnderstanding of security concepts like encryption, key management, authentications, certificate signing processes, data integrity etc\n\nRequired Skills –\n\noProgramming & Debugging –C/C++, java (good to have)\n\noScripting –Python, Shell\n\noDebugging –Tcpdump, Packet tracing/Analysis\n\noNetworking - Ethernet (TCP/IP) / Fibre Channel\n\noProtocols - NVMe, iSCSI, FC\n\noOS Linux\n\nAdditional desired skills –\n\noVirtualization\n\n\nVMWare ESX (VASA, vVols),\n\n\nHyper-V\n\noOS - MS Windows\n\noTesting/Debugging tools –\n\n\nWireshark, SanBlaze packet analyzer.\n\noScripting - Perl.\n\noAdapters - ethernet / FC\n\noStorage - Block, NAS\n\nAbility to crisply communicate with stake holders (clients and level 3 support teams) for resolving field issues.\n\nGood written/verbal communication skills to report program status crisply and accurately.\n\n\n\n\nExperience working with Global teams.\n\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nc++linux internalssystem architecturelinuxunix\ntcpalgorithmssanpythonsoftware testingkernelipnetworkingkernel programmingwiresharkethernetiscsijavamicrosoft windowsdebuggingdata structuresmultithreadingshell scriptingperl",
    "company": "IBM",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "3 - 7 years",
    "salary": "Not Disclosed",
    "posted": "5 days ago",
    "openings": "NA",
    "applicants": "11",
    "aboutCompany": "NA",
    "keySkills": [
      "c++",
      "c++",
      "linux internals",
      "linux internals",
      "system architecture",
      "system architecture",
      "linux",
      "linux",
      "unix",
      "unix",
      "tcp",
      "tcp",
      "algorithms",
      "algorithms",
      "san",
      "san",
      "python",
      "python",
      "software testing",
      "software testing",
      "kernel",
      "kernel",
      "ip",
      "ip",
      "networking",
      "networking",
      "kernel programming",
      "kernel programming",
      "wireshark",
      "wireshark",
      "ethernet",
      "ethernet",
      "iscsi",
      "iscsi",
      "java",
      "java",
      "microsoft windows",
      "microsoft windows",
      "debugging",
      "debugging",
      "data structures",
      "data structures",
      "multithreading",
      "multithreading",
      "shell scripting",
      "shell scripting",
      "perl",
      "perl"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-ibm-india-pvt-limited-pune-3-to-7-years-100925940347",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.488Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.501Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.501Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310fb"
    },
    "title": "Backend Developer",
    "description": "Job description\n\n\nAs a  Senior Software Developer , you will work with the latest tools, technologies, and architectures to deliver cutting-edge software solutions.\nYou will  design, architect, and develop  complex new features while enhancing existing product capabilities.\nYou will  mentor and coach junior developers , fostering technical growth within the team.\nIn addition to hands-on development, you will contribute to  project planning, tracking, and execution .\nYour role will span the  full software engineering lifecycle  — from R&D, design, and architecture to development, testing, and supporting our growing customer base.\nWith your expertise in  Java and web technologies , you will drive product improvements and enhance customer experience.\nYou will be a  self-starter  with strong communication skills, capable of working independently, multitasking, and prioritizing effectively in a dynamic environment.\n\n\nRequired education\nBachelor's Degree\n\nPreferred education\nMaster's Degree\n\nRequired technical and professional expertise\n\nMinimum 7 years of proven experience as a Software Developer, with strong expertise in designing, developing, and delivering enterprise-grade software solutions\nProgramming & FrameworksJava, JavaEE, Python, SOAP/.NET, Dojo, JavaScript, HTML, ReactJS\nApplication Servers & MiddlewaretWAS, WebLogic, Liberty\nDatabasesDB2, MS SQL, Oracle, PostgreSQL\nAuthentication & SecurityLDAP, OIDC/OAuth/SSO\nDevOps & ToolsAnsible, Jenkins, GitHub, Artifactory, InstallAnywhere, Eclipse\nPlatforms & ContainersLinux, Windows, Docker, Kubernetes, YAML\n\n\nPreferred technical and professional experience\n\n Continuous Integration:  Strong working knowledge of Jenkins, HTTP, JSON, and XML\n Security:  Experience in identifying and addressing security vulnerabilities\n Cloud Platforms:  Exposure to AWS EKS, Azure AKS, and Google GKE\n Communication:  Excellent verbal and written communication skills for effective collaboration with team members, stakeholders, and clients\n Adaptability:  Quick learner with the ability to embrace new technologies, adapt to changing requirements, and thrive in dynamic environments\n Teamwork:  Collaborative mindset with the ability to contribute ideas, support team objectives, and work effectively within a team\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\njavaxmljsonsql serverweb technologies\nartifactorykubernetesdbmseksdockeransiblesqlreact.jspostgresqlldapdevopslinuxjenkinshtmlyamlpythongithuboraclegooglejavascriptazure kuberneteshttp.netawssoapdojo",
    "company": "IBM",
    "companyLogo": "NA",
    "location": "Bengaluru",
    "experience": "7 - 12 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "NA",
    "applicants": "Less than 10",
    "aboutCompany": "NA",
    "keySkills": [
      "java",
      "java",
      "xml",
      "xml",
      "json",
      "json",
      "sql server",
      "sql server",
      "web technologies",
      "web technologies",
      "artifactory",
      "artifactory",
      "kubernetes",
      "kubernetes",
      "dbms",
      "dbms",
      "eks",
      "eks",
      "docker",
      "docker",
      "ansible",
      "ansible",
      "sql",
      "sql",
      "react.js",
      "react.js",
      "postgresql",
      "postgresql",
      "ldap",
      "ldap",
      "devops",
      "devops",
      "linux",
      "linux",
      "jenkins",
      "jenkins",
      "html",
      "html",
      "yaml",
      "yaml",
      "python",
      "python",
      "github",
      "github",
      "oracle",
      "oracle",
      "google",
      "google",
      "javascript",
      "javascript",
      "azure kubernetes",
      "azure kubernetes",
      "http",
      "http",
      ".net",
      ".net",
      "aws",
      "aws",
      "soap",
      "soap",
      "dojo",
      "dojo"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-ibm-india-pvt-limited-bengaluru-7-to-12-years-150925916267",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.526Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.528Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.528Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310fc"
    },
    "title": "MICO Biomed - Server/Backend Developer",
    "description": "Job description\n\n[About the Hiring Company]\n\nWe are a healthcare AI startup focused on developing cutting-edge solutions for medical imaging and diagnostics. Our mission is to improve early disease detection and support better clinical decisions through artificial intelligence. As we establish our new office in Noida/Delhi NCR, we are building a dynamic local team. Join us to work on impactful projects, collaborate with leading hospitals, and help shape the future of AI-driven healthcare.\n\n\n\n\n(https://www.aicess.ai)\n\n\n\n\n[Job Responsibilities]\n\n> Web server and backend development\n\n> Mobile server development\n\n\n\n\n[Qualifications & Skills Required]\n\n> Bachelor's degree in B.Tech, BCA\n\n> 5+ years of development experience (education level not required)\n\n> Java Spring/Spring Boot framework development\n\n> RestFul API and JWT (JSON Web Token) development\n\n> Database design and programming\n\n> Hindi(Native) English(Fluent)\n\n\n\n\n[Preferred Qualifications]\n\n> Experience using container services such as Docker and Kubernetes\n\n> Experience building and operating DevOps or CI/CD pipelines\n\n> Experience designing and consulting on server security\n\n> Experience developing PACS systems or integrations\n\n\n\n\n[Working Condition]\n\n> Working Days: 5~6 days per week\n\n> Working Hours : 8 hours per day\n\n> Working Location: Pune\n\nRole: Back End Developer\nIndustry Type: Medical Services / Hospital\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Temporary/Contractual\nRole Category: Software Development\nEducation\nUG: BCA in Any Specialization, B.Tech/B.E. in Any Specialization\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nSpring BootMedical DevicesAi PlatformBackend Development\nDockerPACSJava Spring BootJwtRestful Web Api DevelopmentKubernetes",
    "company": "The Trade Office, Embassy Of The Republic Of Korea",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "5 - 10 years",
    "salary": "10-20 Lacs P.A.",
    "posted": "6 days ago",
    "openings": "2",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Spring Boot",
      "Spring Boot",
      "Medical Devices",
      "Medical Devices",
      "Ai Platform",
      "Ai Platform",
      "Backend Development",
      "Backend Development",
      "Docker",
      "Docker",
      "PACS",
      "PACS",
      "Java Spring Boot",
      "Java Spring Boot",
      "Jwt",
      "Jwt",
      "Restful Web Api Development",
      "Restful Web Api Development",
      "Kubernetes",
      "Kubernetes"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-mico-biomed-server-backend-developer-the-trade-office-embassy-of-the-republic-of-korea-pune-5-to-10-years-090925026411",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.567Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.569Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.569Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f1da37b3c858543310fd"
    },
    "title": "Backend Developer - Dp4Ve - C_C++_Vsphere_Hyperv",
    "description": "Job description\n\n\nWe are seeking a highly skilled software developer with 8-12 year experience in product development, and maintenance of Data Protection software.The role involves continuous development, testing and maintenance of a backup and recovery software – primarily for the  Microsoft   Hyper-V &  VMWare   vSphere hypervisor systems using  C/C++ programming language  on  Windows  &  Unix  platforms.\n\nAs a vital member of our software development team, you will be responsible for the features / functionality, optimize performance, improve stability, security, and reliability of our Data Protection software for Hyper-V and for VMWare.\n\nThe Key Responsibilities include the following:\n\n Data Protection for Virtual Environment Develop, maintain, secure, stabilize, and optimize the data protection software product that focuses on backup, restore and data integrity of the virtual machines running on hypervisors like  Hyper-V  & vCenter / ESXi systems .\n\n Product development & integration Lead the design and implementation of  C/C++ integration components for the data protection software product that integrates with the latest APIs and SDKs of  Hyper-V  &  vSphere . Ensure adherence to coding standards, best practices, security, and performance guidelines.\n\n Product support Provide technical expertise and support to customers and internal stakeholders regarding Data Protection for Virtual Environment related inquiries and issues that span  Hyper-V  & vCenter / ESXi systems .\n\n Troubleshooting and debugging Investigate and resolve complex issues in the end-to-end data protection workflows (or backup / restore workflows) for Hyper-V / vSphere data that are stored in Disks, Cloud, and/or Tape. In addition, working on issues related to data traceability, data integrity (corruption or tampering), and data recovery - with cross-functional teams, to identify root causes and implement effective solutions.\n\n Security and Compliance Ensure robust data security measures to protect sensitive data. Ensure compliance with relevant data privacy regulations and company policies.\n\n Performance optimization Benchmark and optimize the data protection workflows to ensure efficient, scalable, and reliable system performance during backup and recovery operations. Deep dive into the performance aspects of the networks and storage in the hypervisor - Hyper-V & vSphere.\n\n Documentation Develop and update comprehensive documentation related to configurations, performance tuning strategies, and troubleshooting procedures.\n\n Continuous improvement Stay updated with the latest advancements in C/C++, Hyper-V, vSphere (vCenter / ESXi), development practices, and software design principles. Recommend and improve efficiency in product development and maintainability.\n\n\nRequired education\nBachelor's Degree\n\nPreferred education\nMaster's Degree\n\nRequired technical and professional expertise\n\nBachelor's degree / Master’s degree in Computer Science, Software Engineering, or a related field (or equivalent practical experience).\n\nExtensive 8-12 years of experience in product development & support - with a focus on data protection, backup solutions, or related fields, particularly in virtualized environments, such as - Microsoft   Hyper-V &  VMWare   vSphere hypervisor systems using  C/C++ programming language  on  Windows  &  Unix  platforms,\n\nProven experience with data protection technologies, backup/restore APIs, and storage solutions; and highly proficient with programming languages –  C/C++,  Java; and scripting languages –  Perl , Unix Shell scripts, Powershell.\n\nHands-on experience and deep expertise in using, integrating and managing theHyper-V & vSphere environment; including performance tuning, and debugging of complex issues.\n\nFamiliarity with data security and compliance standards.\n\nExcellent problem-solving and debugging skills to analyse & resolve complex technical issues.\n\nStrong communication and collaboration skills to work in a team-oriented environment.\n\nRole: Database Administrator\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: DBA / Data warehousing\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nc++javaunix shell scriptingdebuggingscripting languages\nhp data protectorsoftware developmentperformance tuningvmware vspheredocumentationesxivsphereproduct developmentpowershellvcentertroubleshootingsoftware engineeringperlunix",
    "company": "IBM",
    "companyLogo": "NA",
    "location": "Bengaluru",
    "experience": "8 - 12 years",
    "salary": "Not Disclosed",
    "posted": "5 days ago",
    "openings": "NA",
    "applicants": "Less than 10",
    "aboutCompany": "NA",
    "keySkills": [
      "c++",
      "c++",
      "java",
      "java",
      "unix shell scripting",
      "unix shell scripting",
      "debugging",
      "debugging",
      "scripting languages",
      "scripting languages",
      "hp data protector",
      "hp data protector",
      "software development",
      "software development",
      "performance tuning",
      "performance tuning",
      "vmware vsphere",
      "vmware vsphere",
      "documentation",
      "documentation",
      "esxi",
      "esxi",
      "vsphere",
      "vsphere",
      "product development",
      "product development",
      "powershell",
      "powershell",
      "vcenter",
      "vcenter",
      "troubleshooting",
      "troubleshooting",
      "software engineering",
      "software engineering",
      "perl",
      "perl",
      "unix",
      "unix"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-backend-developer-dp4ve-c-c-vsphere-hyperv-ibm-india-pvt-limited-bengaluru-8-to-12-years-100925940445",
    "scrappedAt": {
      "$date": "2025-09-16T05:12:58.607Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:12:58.611Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:12:58.611Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a2f"
    },
    "title": "Python Developer",
    "description": "Job description\nDelivering new functionality by writing and shipping high quality code for the OMDP meeting the MSCI requirements.\nDesign, build, and maintain efficient, reusable, and reliable code.\nDesign and implementation of continuous integration and deployment.\nMonitor and optimise application performance.\nProblem solving with alternative approaches and in collaboration with Business Stakeholders, Quality Assurance,Data Operation and IT Infrastructure on all stages of software development life cycle.\nEncourages innovation and best practices\nFollowing Agile methodology\nYour skills and experience that will help you excel\nStrong programming skills in Python with 3-5 years of experience , with the ability to write clean, efficient, and production-ready code for large-scale data processing.\nHands-on experience with Apache Spark for distributed data processing, including performance optimisation and tuning of Spark jobs.\nProficiency in using Databricks as a unified analytics platform for building and deploying data pipelines at scale.\nSolid understanding of cloud-based data engineering workflows , with direct experience working on Microsoft Azure (e.g., Data Lake, Azure DevOps, Synapse).\nPractical knowledge of data pipeline orchestration , data transformation, and best practices in managing structured and semi-structured data.\nExposure to end-to-end data engineering lifecycle , including data ingestion, validation, enrichment, storage, and delivery.\nAbility to collaborate effectively in agile, cross-functional teams and communicate technical concepts to both technical and non-technical stakeholders.\nRole: Data warehouse Developer\nIndustry Type: Financial Services\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: DBA / Data warehousing\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\n\nread more\n\nKey Skills\nCVSManager Quality AssuranceorchestrationAgileSoftware development life cycleData processingAgile methodologyAnalyticsPythonRecruitment",
    "company": "MSCI Services",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "3 - 5 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "50+",
    "aboutCompany": "NA",
    "keySkills": [
      "CVS",
      "CVS",
      "Manager Quality Assurance",
      "Manager Quality Assurance",
      "orchestration",
      "orchestration",
      "Agile",
      "Agile",
      "Software development life cycle",
      "Software development life cycle",
      "Data processing",
      "Data processing",
      "Agile methodology",
      "Agile methodology",
      "Analytics",
      "Analytics",
      "Python",
      "Python",
      "Recruitment",
      "Recruitment"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-msci-services-pvt-ltd-pune-3-to-5-years-150925502050",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.241Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.244Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.244Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a30"
    },
    "title": "Python Developer",
    "description": "Job description\n\nAbout Persistent\n\nWe are a trusted Digital Engineering and Enterprise Modernization partner, combining deep technical expertise and industry experience to help our clients anticipate what’s next. Our offerings and proven solutions create a unique competitive advantage for our clients by giving them the power to see beyond and rise above. We work with many industry-leading organizations across the world including 12 of the 30 most innovative US companies, 80% of the largest banks in the US and India, and numerous innovators across the healthcare ecosystem.\n\nOur growth trajectory continues, as we reported $1,231M annual revenue (16% Y-o-Y). Along with our growth, we’ve onboarded over 4900 new employees in the past year, bringing our total employee count to over 23,500+ people located in 19 countries across the globe.\n\nPersistent Ltd. is  dedicated to fostering diversity and inclusion in the workplace. We invite applications from all qualified individuals, including those with disabilities, and regardless of gender or gender preference. We welcome diverse candidates from all backgrounds.\n\nFor more details please login to www.persistent.com\n\nAbout The Position\n\nWe are looking for an experienced Python Developer to join our engineering team and help us create dynamic software applications for our clients. You will be responsible for writing and testing scalable code, developing back-end components, and integrating user-facing elements in collaboration with front-end developers. To be successful in this role, you will require in-depth knowledge of object-relational mapping, experience with server-side logic, and above-average knowledge of Python programming. Ultimately, as a top-class Python Developer you should be able to design highly responsive web-applications that perfectly meet the needs of the client.\n\nWhat You?ll Do\n\nWrite effective, scalable code\nDevelop back-end components to improve responsiveness and overall performance\nIntegrate user-facing elements into applications\nTest and debug programs\nImprove functionality of existing systems\nImplement security and data protection solutions\nAssess and prioritize feature requests\nCoordinate with internal teams to understand user requirements and provide technical solutions\n\nExpertise You?ll Bring\n\nA Bachelor of Science degree in Computer Science, Engineering or relevant field\nWork experience as a Python Developer\nExpertise in at least one popular Python framework (like Django, Flask or Pyramid)\nKnowledge of object-relational mapping (ORM)\nFamiliarity with front-end technologies (like JavaScript and HTML5)\nTeam spirit\nGood problem-solving skills\n\nBenefits\n\nCompetitive salary and benefits package\nCulture focused on talent development with quarterly promotion cycles and company-sponsored higher education and certifications\nOpportunity to work with cutting-edge technologies\nEmployee engagement initiatives such as project parties, flexible work hours, and Long Service awards\nAnnual health check-ups\nInsurance coverage: group term life, personal accident, and Mediclaim hospitalization for self, spouse, two children, and parents\n\nInclusive Environment\n\n•We offer hybrid work options and flexible working hours to accommodate various needs and preferences.\n\n•Our office is equipped with accessible facilities, including adjustable workstations, ergonomic chairs, and assistive technologies to support employees with physical disabilities.\n\nLet's unleash your full potential. See Beyond,Rise Above. \n\nRole: Full Stack Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: B.Sc in Any Specialization\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\npython development\ncssdobootstrapjqueryhealthcaresqlgitpostgresqloopslinuxjsonhtmlmysqldata structuresapiteam spiritmongodbprogrammingrestpythonmappingormengineeringmachine learningjavascriptdjangoframeworkpyramidfrontflaskawspython frameworkobject",
    "company": "Persistent",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "3 - 7 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "50+",
    "aboutCompany": "NA",
    "keySkills": [
      "python development",
      "python development",
      "css",
      "css",
      "do",
      "do",
      "bootstrap",
      "bootstrap",
      "jquery",
      "jquery",
      "healthcare",
      "healthcare",
      "sql",
      "sql",
      "git",
      "git",
      "postgresql",
      "postgresql",
      "oops",
      "oops",
      "linux",
      "linux",
      "json",
      "json",
      "html",
      "html",
      "mysql",
      "mysql",
      "data structures",
      "data structures",
      "api",
      "api",
      "team spirit",
      "team spirit",
      "mongodb",
      "mongodb",
      "programming",
      "programming",
      "rest",
      "rest",
      "python",
      "python",
      "mapping",
      "mapping",
      "orm",
      "orm",
      "engineering",
      "engineering",
      "machine learning",
      "machine learning",
      "javascript",
      "javascript",
      "django",
      "django",
      "framework",
      "framework",
      "pyramid",
      "pyramid",
      "front",
      "front",
      "flask",
      "flask",
      "aws",
      "aws",
      "python framework",
      "python framework",
      "object",
      "object"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-persistent-systems-limited-pune-3-to-7-years-161024016686",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.342Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.361Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.361Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a31"
    },
    "title": "Python Software Developer-AB Pan India",
    "description": "Job description\n\nResponsibilities\n\n\n\n\nA day in the life of an Infoscion\n\n• As part of the Infosys delivery team, your primary role would be to ensure effective Design, Development, Validation and Support activities, to assure that our clients are satisfied with the high levels of service in the technology domain.\n\n• You will gather the requirements and specifications to understand the client requirements in a detailed manner and translate the same into system requirements.\n\n• You will play a key role in the overall estimation of work requirements to provide the right information on project estimations to Technology Leads and Project Managers.\n\n• You would be a key contributor to building efficient programs/ systems and if you think you fit right in to help our clients navigate their next in their digital transformation journey, this is the place for you! If you think you fit right in to help our clients navigate their next in their digital transformation journey, this is the place for you!\n\n\n\n\nAdditional Responsibilities:\n\n• Knowledge of design principles and fundamentals of architecture\n\n• Understanding of performance engineering\n\n• Knowledge of quality processes and estimation techniques\n\n• Basic understanding of project domain\n\n• Ability to translate functional / nonfunctional requirements to systems requirements\n\n• Ability to design and code complex programs\n\n• Ability to write test cases and scenarios based on the specifications\n\n• Good understanding of SDLC and agile methodologies\n\n• Awareness of latest technologies and trends\n\n• Logical thinking and problem solving skills along with an ability to collaborate\n\n\nTechnical and Professional Requirements:\n\n• Primary skills: Technology->Machine Learning->Python\n\n\nPreferred Skills: Technology->Machine Learning->Python\n\n\n\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: B.Tech/B.E. in Any Specialization, BCA in Any Specialization, B.Sc in Any Specialization\nPG: MCA in Any Specialization, M.Tech in Any Specialization, MS/M.Sc(Science) in Any Specialization\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nDjangoPythonFlask",
    "company": "Infosys",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "4 - 9 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "2000",
    "applicants": "50+",
    "aboutCompany": "NA",
    "keySkills": [
      "Django",
      "Django",
      "Python",
      "Python",
      "Flask",
      "Flask"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-software-developer-ab-pan-india-infosys-pune-ahmedabad-bengaluru-4-to-9-years-030725027817",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.400Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.401Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.401Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a32"
    },
    "title": "N | Python Developer",
    "description": "Job description\nNeed 2 + years of experience in Python Backend DevelopmentHands on experience in User spaceBackend Developer (Python) with strong exposure to systems programming,\nLinux environmentsWork with Linux-based systems to monitor, manage, and optimize performance and reliability\nParticipate in troubleshooting Linux-related issues across environments\nRole: Blockchain Quality Assurance Engineer\nIndustry Type: Software Product\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Quality Assurance and Testing\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\n\nread more\n\nKey Skills\nBackendLinuxProgrammingManagementTroubleshootingMonitoringPython",
    "company": "Aziro",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "2 - 7 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "50+",
    "aboutCompany": "NA",
    "keySkills": [
      "Backend",
      "Backend",
      "Linux",
      "Linux",
      "Programming",
      "Programming",
      "Management",
      "Management",
      "Troubleshooting",
      "Troubleshooting",
      "Monitoring",
      "Monitoring",
      "Python",
      "Python"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-n-python-developer-msys-tech-india-pvt-ltd-pune-2-to-7-years-150925502947",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.417Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.418Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.418Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a33"
    },
    "title": "Python Developer",
    "description": "Job description\n\nRequired Skills:\n\n\n\nAbsolute clarity in OOP fundamentals and Data-Structures\nMust have hands-on experience in Data Structure like List, Dict, Set, Strings, Lambda, etc\nKnowledge of various Python Web Frameworks (Django, Flask, FastAPI, etc.)\nMust have hands-on experience in working with RDBMS - SQL\nExcellent written and verbal communication and presentation skills.\n\n\n\nRoles and responsibilities:\n\n\n\nMaintain and improve existing projects\nCollaborate with the technical team to develop new features and troubleshoot issues\nLead projects to understand the requirements and distribute work to the technical team\nFollow the project/task timelines and quality.\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: B.Sc in Computers, B.Tech/B.E. in Any Specialization\nPG: MCA in Any Specialization\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nSoftware EngineeringDjangoPython\nData ScienceSoftware DevelopmentData StructuresDjango FrameworkWeb DevelopmentMachine LearningFlaskBackend Development",
    "company": "Bonami Software",
    "companyLogo": "NA",
    "location": "Noida( Sector 63 )",
    "experience": "0 - 2 years",
    "salary": "3-6 Lacs P.A.",
    "posted": "2 days ago",
    "openings": "5",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Software Engineering",
      "Software Engineering",
      "Django",
      "Django",
      "Python",
      "Python",
      "Data Science",
      "Data Science",
      "Software Development",
      "Software Development",
      "Data Structures",
      "Data Structures",
      "Django Framework",
      "Django Framework",
      "Web Development",
      "Web Development",
      "Machine Learning",
      "Machine Learning",
      "Flask",
      "Flask",
      "Backend Development",
      "Backend Development"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-bonami-software-noida-0-to-2-years-130925006016",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.455Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.457Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.457Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a34"
    },
    "title": "Python Developer",
    "description": "Job description\nStrong Python programming experience (3+ years).\nExperience with Generative AI frameworks such as Hugging Face Transformers, LangChain, OpenAI API, or LLamaIndex.\nFamiliarity with ML/DL frameworks: PyTorch, TensorFlow, or JAX.\nExperience with LLM fine-tuning prompt engineering, embeddings, or vector databases.\nUnderstanding of NLP concepts: tokenization, embeddings, attention mechanisms.\nWorking knowledge of REST APIs, Docker, and cloud services (AWS/GCP/Azure).\nRole: Data Platform Engineer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: LLM in Law\n\nread more\n\nKey Skills\nJAXGCPCloud ServicesProgrammingTransformersAWSPython",
    "company": "Photon",
    "companyLogo": "NA",
    "location": "Kolkata",
    "experience": "3 - 8 years",
    "salary": "Not Disclosed",
    "posted": "6 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "JAX",
      "JAX",
      "GCP",
      "GCP",
      "Cloud Services",
      "Cloud Services",
      "Programming",
      "Programming",
      "Transformers",
      "Transformers",
      "AWS",
      "AWS",
      "Python",
      "Python"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-photon-infotech-p-ltd-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-3-to-8-years-090925500511",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.486Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.487Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.487Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a35"
    },
    "title": "Python Developer",
    "description": "Job description\n\n\n\n\n \n\nAbout The Role  \n\nSoftware Development (5+ years)Proficient in Python and/or Node.js; strong REST API design and implementation skills.\nAWS ServerlessDeep experience with AWS Lambda, Step Functions, API Gateway (or Lambda Function URLs), DynamoDB/S3, and IAM.\nContainer & KubernetesHands-on with Docker and EKS (or ECS); comfortable with Helm, K8s manifests, and cluster autoscaling.\nMCP or Agent FrameworksFamiliarity with the Model Context Protocol spec or similar LLM tool-invocation patterns; experience with Bedrock Agents or LangChain is a plus.\nInfrastructure as CodeExpert in Terraform, AWS CDK, or CloudFormation for defining and deploying AWS infrastructure.\nSecurity Best PracticesStrong understanding of VPC networking, PrivateLink, security groups, WAF, Secrets Manager, and implementing least-privilege IAM policies.\nMonitoring & ObservabilityExperience with CloudWatch (logs, dashboards, alarms), Kibana, or open-source tooling (Prometheus, Grafana).\nCI/CD & DevOpsProficient setting up pipelines (GitHub Actions, Azure DevOps, or AWS CodePipeline) for automated testing and deployments.\nPrompt Engineering CollaborationAbility to translate AI/ML requirements into clear tool definitions and assist in iterative prompt tuning.\n\n\n\n \n\nPrimary Skill \n\nPython Development\nGen AI\nAWS\n\n\n\n \n\nSecondary Skills \n\nAWS AI services (Opensearch, Sagemaker, Kendra)\nregulatory frameworks (GDPR, HIPAA)\nservice mesh (AWS App Mesh, Istio)\nRole: Search Engineer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: B.Tech/B.E. in Any Specialization\nPG: Any Postgraduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\npythonpython developmentaws cloudformationaws lambdaaws\nkubernetessoftware developmentdynamo dbapi gatewayamazon vpcrest api designnetworkinghelmdockernodegeniamterraformsecurity centerweb application firewall",
    "company": "Capgemini",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "5 - 10 years",
    "salary": "Not Disclosed",
    "posted": "4 days ago",
    "openings": "NA",
    "applicants": "Less than 10",
    "aboutCompany": "NA",
    "keySkills": [
      "python",
      "python",
      "python development",
      "python development",
      "aws cloudformation",
      "aws cloudformation",
      "aws lambda",
      "aws lambda",
      "aws",
      "aws",
      "kubernetes",
      "kubernetes",
      "software development",
      "software development",
      "dynamo db",
      "dynamo db",
      "api gateway",
      "api gateway",
      "amazon vpc",
      "amazon vpc",
      "rest api design",
      "rest api design",
      "networking",
      "networking",
      "helm",
      "helm",
      "docker",
      "docker",
      "node",
      "node",
      "gen",
      "gen",
      "iam",
      "iam",
      "terraform",
      "terraform",
      "security center",
      "security center",
      "web application firewall",
      "web application firewall"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-capgemini-technology-services-india-limited-pune-5-to-10-years-110925921633",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.517Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.520Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.520Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a36"
    },
    "title": "Cybage Software is hiring Sr. Python Developers",
    "description": "Job description\n\nTechnical Qualifications:\n\nMinimum 7 years of work experience using advanced Python Programming language & microservices\nWell versed with developing REST APIs and Services using at least one Python web framework (Django, Flask, FastAPI)\nGood knowledge of version controls like Git, Github & SVN.\nGood to have knowledge of Devops tools (like Docker & GKE) and third-party tools like Airflow, Elastic Search, etc\nExposure to Cloud - GCP , AppEngine , Firestore , SQL and Big Query will be an added advantage\nStrong knowledge of Data Structures & Algorithms, OOP, Threads, Parallel-Processing\nHands-on experience working with relational SQL (PostgreSQL, MYSQL,Bigquery) and NOSQL (Datastore, MongoDB) databases.\n\nKey Responsibilities:\n\nWrite effective & scalable code using python and improve functionality of existing systems.\nDebug and optimize performance to ensure scalability and reliability with python test framework tools like pytest, pyunit.\nConduct code reviews and ensure the delivery of high-quality code\nCoordinate with internal & external teams to understand user requirements and provide technical solutions.\nManage the developers team - provide technical guidance and address technical challenges and risks\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nPython DeveloperPython\nDjango Rest ApiDjangoRest Api DevelopmentDjango FrameworkAPIPython DevelopmentFlask",
    "company": "Cybage",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "6 - 11 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Python Developer",
      "Python Developer",
      "Python",
      "Python",
      "Django Rest Api",
      "Django Rest Api",
      "Django",
      "Django",
      "Rest Api Development",
      "Rest Api Development",
      "Django Framework",
      "Django Framework",
      "API",
      "API",
      "Python Development",
      "Python Development",
      "Flask",
      "Flask"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-cybage-software-is-hiring-sr-python-developers-cybage-pune-6-to-11-years-030925921581",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.533Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.534Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.534Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a37"
    },
    "title": "Python Developer",
    "description": "Job description\nWe are seeking an experienced Infrastructure Automation Engineer with a strong background in scripting and automation across both mainframe and distributed systems. The ideal candidate will have hands on experience with Python, Ansible , and infrastructure as code practices, and will play a key role in automating repetitive infrastructure tasks, enabling faster deployments, and ensuring consistency across environments.\n\n\nPrimary Roles and Responsibilities:\nDesign, develop, and maintain automation scripts and frameworks using Python and Ansible.\nBuild infrastructure-as-code solutions to automate configuration, provisioning, and deployment of resources across mainframe and distributed platforms (e.g., Linux, Windows).\nWork closely with infrastructure, operations, and product(s) teams to understand automation needs and implement effective solutions.\nDevelop and manage Ansible playbooks and custom roles for reusable automation.\nContribute to configuration and change management processes in hybrid environments.\nSupport hybrid environments including z/OS, Unix/Linux, Windows, and Cloud platforms (AWS, Azure, etc.).\nDocument automation procedures, standards, and design decisions.\nTo ensure youre set up for success, you will bring the following skillset & experience:\nBachelors degree in Computer Science, Information Security, or related field (or equivalent experience).\n3+ years of experience in infrastructure automation or DevOps roles.\nStrong proficiency in Python scripting for infrastructure-related tasks.\nExperience with Ansible for configuration management and orchestration.\nHands on experience working with both Mainframe (z/OS) and Distributed Systems.\nFamiliarity with infrastructure as code principles and practices.\nExperience with Git or other version control tools.\nWorking knowledge of Linux system administration.\nGood understanding of job scheduling tools and system integrations.\nStrong analytical and problem-solving abilities.\nAbility to work independently and in a team across hybrid environments.\nExcellent communication and documentation skills.\nWillingness to learn legacy systems and contribute to their modernization.\nWhilst these are nice to have, our team can help you develop in the following skills:\nFamiliarity with container technologies like Docker and orchestration using Kubernetes.\nExperience integrating automation into CI/CD pipelines (e.g., GitLab CI, Jenkins).\nRole: Site Reliability Engineer\nIndustry Type: Software Product\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: DevOps\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\npythondocumentationansibledevopsaws\nlinux system administrationcontainerkubernetescontinuous integrationmainframesversion controlmicrosoft azurepython developmentgitlab cidockergitlinuxjenkinsgitlabunixci cd pipelinezos",
    "company": "BMC Software",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "3 - 8 years",
    "salary": "Not Disclosed",
    "posted": "4 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "python",
      "python",
      "documentation",
      "documentation",
      "ansible",
      "ansible",
      "devops",
      "devops",
      "aws",
      "aws",
      "linux system administration",
      "linux system administration",
      "container",
      "container",
      "kubernetes",
      "kubernetes",
      "continuous integration",
      "continuous integration",
      "mainframes",
      "mainframes",
      "version control",
      "version control",
      "microsoft azure",
      "microsoft azure",
      "python development",
      "python development",
      "gitlab ci",
      "gitlab ci",
      "docker",
      "docker",
      "git",
      "git",
      "linux",
      "linux",
      "jenkins",
      "jenkins",
      "gitlab",
      "gitlab",
      "unix",
      "unix",
      "ci cd pipeline",
      "ci cd pipeline",
      "zos",
      "zos"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-bmc-software-india-pvt-ltd-pune-3-to-8-years-110925935094",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.569Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.571Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.571Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a38"
    },
    "title": "Python Developer - AI",
    "description": "Job description\n\nDear Applicant,\n\n\n\n\nWe are looking for a self-driven Python Developer with 4-6 years of experience to design, develop, and scale web applications and backend systems. The ideal candidate should be comfortable working in production environments, bringing strong problem-solving skills and experience with databases. Collaboration with AI teams is a key part of the role, so a background or interest in AI/ML will be highly valued.\n\n\n\n\nKey Responsibilities:\n\nDevelop and maintain Python applications to address operational business needs.\nWork on production-grade systems, ensuring scalability, performance, and reliability.\nCollaborate closely with the AI team to integrate machine learning models and AI-based features into the backend.\nWrite clean, efficient Python code, following best practices (PEP 8) and design patterns.\nUtilize frameworks like Django, Flask, or FastAPI for web applications and API development.\nDevelop and maintain RESTful APIs for seamless integration with front-end systems and third-party services.\nParticipate in code reviews and contribute to high-quality software.\nUnit testing with frameworks such as PyTest to ensure quality and reduce defects.\nTroubleshoot and resolve application issues, providing timely fixes and optimizations.\nOptimize for speed and scalability of applications to handle high traffic.\nCollaborate with cross-functional teams (Front-end, DevOps, QA) to ensure a smooth development cycle.\nDocument code, processes, and best practices for knowledge sharing and onboarding.\nStay current with Python trends and technologies, continually improving technical skills.\n\n\n\nTechnical Skills Required:\n\nPython: Strong hands-on experience with Python (3.x), object-oriented programming (OOP), and design patterns.\nWeb Frameworks: Expertise in Django, Flask, or FastAPI.\nDatabases: Proficient in working with SQL (PostgreSQL, MySQL)\nAPI Development: Deep understanding of building RESTful APIs and integrating with external services.\nVersion Control: Proficient in Git and Git workflows.\nUnit Testing: Experience writing tests with PyTest, Unittest, or similar frameworks.\nCloud Services: Experience with AWS is a must.\nContainerization: Familiarity with Docker and Kubernetes.\nCI/CD: Experience setting up and managing CI/CD pipelines using Jenkins, GitLab CI, or CircleCI.\nMessage Brokers: Exposure to RabbitMQ, Kafka, or Celery for background task processing.\nSecurity Best Practices: Knowledge of securing APIs, encryption, and ensuring data privacy.\n\nExposure to AI/ML and Data Science (Preferred):\n\nFamiliar with machine learning libraries such as TensorFlow, PyTorch, or Scikit-learn.\nData manipulation skills using Pandas, NumPy, and Matplotlib.\nExposure to data pipelines, integrating Python with AI/ML models.\nExperience in model deployment and serving machine learning models via APIs.\nUnderstanding of statistical analysis, data modeling, and analytics techniques.\n\n\nRole: Data Science & Machine Learning - Other\nIndustry Type: IT Services & Consulting\nDepartment: Data Science & Analytics\nEmployment Type: Full Time, Permanent\nRole Category: Data Science & Machine Learning\nEducation\nUG: B.Tech/B.E. in Any Specialization, Bachelor of Artificial Intelligence in Any Specialization\nPG: MCA in Any Specialization, MS/M.Sc(Science) in Any Specialization, M.Tech in Any Specialization\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nTensorflowPytorchDesign PatternsArtificial IntelligencePython\nData ManipulationAi SolutionsAPIMachine LearningMl AlgorithmsAWSScikit-Learn",
    "company": "Xoriant",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "4 - 9 years",
    "salary": "Not Disclosed",
    "posted": "6 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "Xoriant is a Sunnyvale, CA headquartered digital engineering firm with offices in the USA, Europe, and Asia. From startups to Fortune 100, we enable innovation, accelerate time to market and ensure client competitiveness across industries. Xoriant has established a global presence as an innovation leader, preferred technology partner, and one of the Best Workplaces by Great Place to Work„¢.<br>Across all our focus areas €“ digital product &amp; platform engineering, experience design, data engineering and IoT €“ every solution we develop benefits from our product engineering DNA and culture of innovation. It also includes successful methodologies, framework components, and accelerators for rapidly solving critical client challenges. For 30 years and counting, we have taken great pride in the long-lasting, deep relationships we have with our clients.",
    "keySkills": [
      "Tensorflow",
      "Tensorflow",
      "Pytorch",
      "Pytorch",
      "Design Patterns",
      "Design Patterns",
      "Artificial Intelligence",
      "Artificial Intelligence",
      "Python",
      "Python",
      "Data Manipulation",
      "Data Manipulation",
      "Ai Solutions",
      "Ai Solutions",
      "API",
      "API",
      "Machine Learning",
      "Machine Learning",
      "Ml Algorithms",
      "Ml Algorithms",
      "AWS",
      "AWS",
      "Scikit-Learn",
      "Scikit-Learn"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-ai-xoriant-pune-4-to-9-years-100925011035",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.587Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.589Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.589Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a39"
    },
    "title": "Python Developer",
    "description": "Job description\nOverview\nOMPD is an MSCI Climate “future go to” internal platform and critical data provider for client facing platform used which will be used by:\nMSCI Sustainability researchers develop the Sustainability model as per the latest regulations, industry and market specific needs\nMSCI data operations team manages the with Sustainability specific data\nMSCI analysts to work with the mode and data to create, validate and refine Sustainability reports\nExternal Clients.\nResponsibilities\nDelivering new functionality by writing and shipping high quality code for the OMDP meeting the MSCI requirements.\nDesign, build, and maintain efficient, reusable, and reliable code.\nDesign and implementation of continuous integration and deployment.\nMonitor and optimise application performance.\nProblem solving with alternative approaches and in collaboration with Business Stakeholders, Quality Assurance,Data Operation and IT Infrastructure on all stages of software development life cycle.\nEncourages innovation and best practices\nFollowing Agile methodology\nQualifications\nStrong programming skills in Python with 3-5 years of experience, with the ability to write clean, efficient, and production-ready code for large-scale data processing.\nHands-on experience with Apache Spark for distributed data processing, including performance optimisation and tuning of Spark jobs.\nProficiency in using Databricks as a unified analytics platform for building and deploying data pipelines at scale.\nSolid understanding of cloud-based data engineering workflows, with direct experience working on Microsoft Azure (e.g., Data Lake, Azure DevOps, Synapse).\nPractical knowledge of data pipeline orchestration, data transformation, and best practices in managing structured and semi-structured data.\nExposure to end-to-end data engineering lifecycle, including data ingestion, validation, enrichment, storage, and delivery.\nAbility to collaborate effectively in agile, cross-functional teams and communicate technical concepts to both technical and non-technical stakeholders.\n\n \n\nWhat we offer you\n\nTransparent compensation schemes and comprehensive employee benefits, tailored to your location, ensuring your financial security, health, and overall wellbeing.\nFlexible working arrangements, advanced technology, and collaborative workspaces.\nA culture of high performance and innovation where we experiment with new ideas and take responsibility for achieving results.\nA global network of talented colleagues, who inspire, support, and share their expertise to innovate and deliver for our clients.\nGlobal Orientation program to kickstart your journey, followed by access to our Learning@MSCI platform, LinkedIn Learning Pro and tailored learning opportunities for ongoing skills development.\nMulti-directional career paths that offer professional growth and development through new challenges, internal mobility and expanded roles.\nWe actively nurture an environment that builds a sense of inclusion belonging and connection, including eight Employee Resource Groups. All Abilities, Asian Support Network, Black Leadership Network, Climate Action Network, Hola! MSCI, Pride & Allies, Women in Tech, and Women’s Leadership Forum.\n\nAt MSCI we are passionate about what we do, and we are inspired by our purpose – to power better investment decisions. You’ll be part of an industry-leading network of creative, curious, and entrepreneurial pioneers. This is a space where you can challenge yourself, set new standards and perform beyond expectations for yourself, our clients, and our industry.\n\nMSCI is a leading provider of critical decision support tools and services for the global investment community. With over 50 years of expertise in research, data, and technology, we power better investment decisions by enabling clients to understand and analyze key drivers of risk and return and confidently build more effective portfolios. We create industry-leading research-enhanced solutions that clients use to gain insight into and improve transparency across the investment process.\n\nMSCI Inc. is an equal opportunity employer. It is the policy of the firm to ensure equal employment opportunity without discrimination or harassment on the basis of race, color, religion, creed, age, sex, gender, gender identity, sexual orientation, national origin, citizenship, disability, marital and civil partnership/union status, pregnancy (including unlawful discrimination on the basis of a legally protected parental leave), veteran status, or any other characteristic protected by law. MSCI is also committed to working with and providing reasonable accommodations to individuals with disabilities. If you are an individual with a disability and would like to request a reasonable accommodation for any part of the application process, please email Disability.Assistance@msci.com and indicate the specifics of the assistance needed. Please note, this e-mail is intended only for individuals who are requesting a reasonable workplace accommodation; it is not intended for other inquiries.\n\n \n\nTo all recruitment agencies\n\nMSCI does not accept unsolicited CVs/Resumes. Please do not forward CVs/Resumes to any MSCI employee, location, or website. MSCI is not responsible for any fees related to unsolicited CVs/Resumes.\n\n \n\nNote on recruitment scams\n\nWe are aware of recruitment scams where fraudsters impersonating MSCI personnel may try and elicit personal information from job seekers. Read our full note on careers.msci.com\n\nRole: Data warehouse Developer\nIndustry Type: Financial Services\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: DBA / Data warehousing\nEducation\nUG: Any Graduate\n\nread more\n\nKey Skills\ncontinuous integrationpythonorchestrationmicrosoft azurepython developmentdata pipelinedata engineeringresearchazure devopsdata brickscloudanalyticssoftware development life cycleapachesparkdevopsweb technologiesagileprogrammingdata lakedeployment",
    "company": "MSCI Services",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "2 - 5 years",
    "salary": "Not Disclosed",
    "posted": "3 days ago",
    "openings": "NA",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "continuous integration",
      "continuous integration",
      "python",
      "python",
      "orchestration",
      "orchestration",
      "microsoft azure",
      "microsoft azure",
      "python development",
      "python development",
      "data pipeline",
      "data pipeline",
      "data engineering",
      "data engineering",
      "research",
      "research",
      "azure devops",
      "azure devops",
      "data bricks",
      "data bricks",
      "cloud",
      "cloud",
      "analytics",
      "analytics",
      "software development life cycle",
      "software development life cycle",
      "apache",
      "apache",
      "spark",
      "spark",
      "devops",
      "devops",
      "web technologies",
      "web technologies",
      "agile",
      "agile",
      "programming",
      "programming",
      "data lake",
      "data lake",
      "deployment",
      "deployment"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-msci-services-pune-2-to-5-years-120925025223",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.622Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.625Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.625Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a3a"
    },
    "title": "Python Developer",
    "description": "Job description\n\nAbout Persistent\n\nWe are a trusted Digital Engineering and Enterprise Modernization partner, combining deep technical expertise and industry experience to help our clients anticipate what?s next. Our offerings and proven solutions create a unique competitive advantage for our clients by giving them the power to see beyond and rise above. We work with many industry-leading organizations across the world including 14 of the 30 most innovative US companies, 80% of the largest banks in the US and India, and numerous innovators across the healthcare ecosystem.\n\nOur growth trajectory continues, as we reported $1,186M annual revenue (13.2% Y-o-Y). Along with our growth, we?ve onboarded over 4900 new employees in the past year, bringing our total employee count to over 23,850+ people located in 21 countries across the globe. Throughout this market-leading growth, we?ve maintained strong employee satisfaction - over 94% of our employees approve of the CEO and 89% recommend working at Persistent to a friend.\n\nAt Persistent, we embrace diversity to unlock everyone's potential. Our programs empower our workforce by harnessing varied backgrounds for creative, innovative problem-solving. Our inclusive environment fosters belonging, encouraging employees to unleash their full potential. \n\nFor more details please login to www.persistent.com\n\n \n\nAbout The Position\n\nWe are looking for an experienced Python Developer to join our engineering team and help us create dynamic software applications for our clients. You will be responsible for writing and testing scalable code, developing back-end components, and integrating user-facing elements in collaboration with front-end developers. To be successful in this role, you will require in-depth knowledge of object-relational mapping, experience with server-side logic, and above-average knowledge of Python programming. Ultimately, as a top-class Python Developer you should be able to design highly responsive web-applications that perfectly meet the needs of the client.\n\nWhat You?ll Do\n\nWrite effective, scalable code\nDevelop back-end components to improve responsiveness and overall performance\nIntegrate user-facing elements into applications\nTest and debug programs\nImprove functionality of existing systems\nImplement security and data protection solutions\nAssess and prioritize feature requests\nCoordinate with internal teams to understand user requirements and provide technical solutions\n\nExpertise You?ll Bring\n\nA Bachelor of Science degree in Computer Science, Engineering or relevant field\nWork experience as a Python Developer\nExpertise in at least one popular Python framework (like Django, Flask or Pyramid)\nKnowledge of object-relational mapping (ORM)\nFamiliarity with front-end technologies (like JavaScript and HTML5)\nTeam spirit\nGood problem-solving skills\n\nBenefits\n\nCompetitive salary and benefits package\nCulture focused on talent development with quarterly promotion cycles and company-sponsored higher education and certifications\nOpportunity to work with cutting-edge technologies\nEmployee engagement initiatives such as project parties, flexible work hours, and Long Service awards\nAnnual health check-ups\nInsurance coverage: group term life, personal accident, and Mediclaim hospitalization for self, spouse, two children, and parents\n\nOur company fosters a values-driven and people centric work environment that enables our employees to:\n\nAccelerate growth, both professionally and personally\nImpact the world in powerful, positive ways, using the latest technologies\nEnjoy collaborative innovation, with diversity and work-life wellbeing at the core\nUnlock global opportunities to work and learn with the industry?s best\n\nLet?s unleash your full potential at Persistent ? Apply Now\n\n \n\n \n\nRole: Full Stack Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: B.Sc in Any Specialization\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\npython development\ncssdobootstrapjqueryhealthcaresqlgitpostgresqloopslinuxjsonhtmlmysqldata structuresapiteam spiritmongodbprogrammingrestpythonmappingormengineeringmachine learningjavascriptdjangoframeworkpyramidfrontflaskawspython frameworkobject",
    "company": "Persistent",
    "companyLogo": "NA",
    "location": "Bengaluru",
    "experience": "3 - 7 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "python development",
      "python development",
      "css",
      "css",
      "do",
      "do",
      "bootstrap",
      "bootstrap",
      "jquery",
      "jquery",
      "healthcare",
      "healthcare",
      "sql",
      "sql",
      "git",
      "git",
      "postgresql",
      "postgresql",
      "oops",
      "oops",
      "linux",
      "linux",
      "json",
      "json",
      "html",
      "html",
      "mysql",
      "mysql",
      "data structures",
      "data structures",
      "api",
      "api",
      "team spirit",
      "team spirit",
      "mongodb",
      "mongodb",
      "programming",
      "programming",
      "rest",
      "rest",
      "python",
      "python",
      "mapping",
      "mapping",
      "orm",
      "orm",
      "engineering",
      "engineering",
      "machine learning",
      "machine learning",
      "javascript",
      "javascript",
      "django",
      "django",
      "framework",
      "framework",
      "pyramid",
      "pyramid",
      "front",
      "front",
      "flask",
      "flask",
      "aws",
      "aws",
      "python framework",
      "python framework",
      "object",
      "object"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-persistent-systems-limited-bengaluru-3-to-7-years-171024011437",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.657Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.660Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.660Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a3b"
    },
    "title": "Python Developer",
    "description": "Job description\nDelivering new functionality by writing and shipping high quality code for the OMDP meeting the MSCI requirements.\nDesign, build, and maintain efficient, reusable, and reliable code.\nDesign and implementation of continuous integration and deployment.\nMonitor and optimise application performance.\nProblem solving with alternative approaches and in collaboration with Business Stakeholders, Quality Assurance,Data Operation and IT Infrastructure on all stages of software development life cycle.\nEncourages innovation and best practices\nFollowing Agile methodology\nYour skills and experience that will help you excel\nStrong programming skills in Python with 3-5 years of experience , with the ability to write clean, efficient, and production-ready code for large-scale data processing.\nHands-on experience with Apache Spark for distributed data processing, including performance optimisation and tuning of Spark jobs.\nProficiency in using Databricks as a unified analytics platform for building and deploying data pipelines at scale.\nSolid understanding of cloud-based data engineering workflows , with direct experience working on Microsoft Azure (e.g., Data Lake, Azure DevOps, Synapse).\nPractical knowledge of data pipeline orchestration , data transformation, and best practices in managing structured and semi-structured data.\nExposure to end-to-end data engineering lifecycle , including data ingestion, validation, enrichment, storage, and delivery.\nAbility to collaborate effectively in agile, cross-functional teams and communicate technical concepts to both technical and non-technical stakeholders.\nRole: Data warehouse Developer\nIndustry Type: NGO / Social Services / Industry Associations\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: DBA / Data warehousing\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\n\nread more\n\nKey Skills\nCVSManager Quality AssuranceorchestrationAgileSoftware development life cycleData processingAgile methodologyAnalyticsPythonRecruitment",
    "company": "MSCI Services",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "3 - 5 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "Less than 10",
    "aboutCompany": "NA",
    "keySkills": [
      "CVS",
      "CVS",
      "Manager Quality Assurance",
      "Manager Quality Assurance",
      "orchestration",
      "orchestration",
      "Agile",
      "Agile",
      "Software development life cycle",
      "Software development life cycle",
      "Data processing",
      "Data processing",
      "Agile methodology",
      "Agile methodology",
      "Analytics",
      "Analytics",
      "Python",
      "Python",
      "Recruitment",
      "Recruitment"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-trove-research-pune-3-to-5-years-150925501408",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.693Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.694Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.694Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a3c"
    },
    "title": "Python Developer",
    "description": "Job description\n\nAbout Position:\n\n\n\n\nWe are seeking a highly skilled Python Developer with 48 years of experience in backend development, API design, and microservices architecture. The ideal candidate should have strong hands-on expertise in Python and a basic working knowledge or 10% experience in GoLang. This role offers flexibility across locations in India and involves working on scalable, high-performance applications in a collaborative, agile environment.\n\n\n\nRole: Python Developer\nLocation: All Persistent Locations\nExperience: 4 to 8 years\nJob Type : Full Time Employement\n\n\n\nWhat Youll Do:\n\n\n\nDesign, develop, and maintain backend services and RESTful APIs using Python\nCollaborate with product and engineering teams to understand requirements and deliver robust solutions\nOptimize application performance and ensure scalability and reliability\nParticipate in code reviews, testing, and deployment processes\nOccasionally contribute to GoLang-based components or services\nWork with CI/CD pipelines and containerized environments\nMaintain documentation and follow coding best practices\n\n\n\nExpertise Youll Bring:\n\n\n\nStrong hands-on experience in Python frameworks such as Django, Flask, or FastAPI\nSolid understanding of RESTful API development and microservices architecture\nExperience with databases like PostgreSQL, MySQL, or MongoDB\nFamiliarity with Docker, Kubernetes, and cloud platforms (AWS, Azure, GCP)\nBasic working knowledge or 10% experience in GoLang\nExperience with Git, CI/CD tools, and Agile methodologies\nStrong analytical and problem-solving skills\n\n\n\nBenefits:\n\n\n\nCompetitive salary and benefits package\nCulture focused on talent development with quarterly growth opportunities and company-sponsored higher education and certifications\nOpportunity to work with cutting-edge technologies\nEmployee engagement initiatives such as project parties, flexible work hours, and Long Service awards\nAnnual health check-ups\nInsurance coverage: group term life, personal accident, and Mediclaim hospitalization for self, spouse, two children, and parents\n\n\n\nValues-Driven, People-Centric & Inclusive Work Environment:\n\n\n\n\nPersistent Ltd. is dedicated to fostering diversity and inclusion in the workplace. We invite applications from all qualified individuals, including those with disabilities, and regardless of gender or gender preference. We welcome diverse candidates from all backgrounds.\n\n\n\nWe offer hybrid work options and flexible working hours to accommodate various needs and preferences.\nOur office is equipped with accessible facilities, including adjustable workstations, ergonomic chairs, and assistive technologies to support employees with physical disabilities.\nIf you are a person with disabilities and have specific requirements, please inform us during the application process or at any time during your employment. We are committed to creating an inclusive environment where all employees can thrive.\n\n\n\nLet's unleash your full potential at Persistent\n\n\n\n\n\"Persistent is an Equal Opportunity Employer and prohibits discrimination and harassment of any kind.\"\n\nRole: IT Infrastructure Services - Other\nIndustry Type: IT Services & Consulting\nDepartment: IT & Information Security\nEmployment Type: Full Time, Permanent\nRole Category: IT Infrastructure Services\nEducation\nUG: B.Tech/B.E. in Computers\nPG: M.Tech in Computers\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nPython DevelopmentGoLang\nPython",
    "company": "Persistent",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "4 - 8 years",
    "salary": "Not Disclosed",
    "posted": "3 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Python Development",
      "Python Development",
      "GoLang",
      "GoLang",
      "Python",
      "Python"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-persistent-pune-4-to-8-years-120925012779",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.725Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.728Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.728Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a3d"
    },
    "title": "Python Developer",
    "description": "Job description\n\nHello,\n\n\n\n\nCurrently we are Hiring for Python Developer for our Mumbai EY GDS Office\n\n\n\n\nPosition Overview:\n\nExp: 4-12 yrs\n\nSkills: Python, Django, Flask, Fast API, OOPS, NumPy, Pandas,\n\nLocation: Mumbai only\n\n\n\n\nInterested candidates can Directly apply in EY GDS Carrer Portal by using below Link\n\nLink To Apply:https://careers.ey.com/job-invite/1585006/\n\n\n\n\nRegards\n\nLikhita\n\nRole: Other\nIndustry Type: Management Consulting\nDepartment: Other\nEmployment Type: Full Time, Permanent\nRole Category: Other\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nDjangoOOPSFast ApiPythonFlask\nPandasRest ApiNumpy",
    "company": "EY",
    "companyLogo": "NA",
    "location": "Mumbai (All Areas)",
    "experience": "4 - 9 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "10",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Django",
      "Django",
      "OOPS",
      "OOPS",
      "Fast Api",
      "Fast Api",
      "Python",
      "Python",
      "Flask",
      "Flask",
      "Pandas",
      "Pandas",
      "Rest Api",
      "Rest Api",
      "Numpy",
      "Numpy"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-ey-mumbai-all-areas-4-to-9-years-100925010576",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.743Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.744Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.744Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a3e"
    },
    "title": "Python Developer",
    "description": "Job description\n\nAbout Position:\n\n\n\n\nWe are looking for a skilled Python Developer with a strong background in cloud platforms, automation, and containerized environments. The ideal candidate will be responsible for developing automation scripts, integrating APIs, and managing infrastructure across platforms like VMware and IBM Cloud.\n\n\n\nRole: Python Developer\nLocation: All Persistent Location\nExperience: 7 to 12 Years\nJob Type: Full Time Employment\n\n\n\nWhat You'll Do:\n\n\n\nWe are looking for a Python Developer with expertise in:\nCloud Platforms: VMware, IBM Cloud\nAutomation & Scripting: Python-based automation\nAPI Development & Integration\nNetworking: VMware NSX\nContainerization & Orchestration: Kubernetes, Docker\nPlatform Administration: Red Hat OpenShift, VMware\nResponsibilities:\nDevelop and maintain automation scripts\nManage cloud infrastructure and virtual environments\nIntegrate APIs across services\nConfigure and manage networking in virtualized setups\nDeploy and administer containerized applications\nIdeal Candidate: Problem-solver, team player, and experienced in dynamic cloud environments.\n\n\n\nExpertise You'll Bring:\n\n\n\nStrong proficiency in Python for automation and API development.\nHands-on experience with VMware platforms and VMware NSX for virtualization and networking.\nFamiliarity with IBM Cloud infrastructure and services.\nSolid understanding of networking concepts within cloud and virtual environments.\nExperience with containerization and orchestration tools like Docker, Kubernetes, and Red Hat OpenShift.\nSkilled in VMware administration and managing virtualized environments.\nAbility to design and implement automated solutions across hybrid cloud platforms.\nCollaborative mindset with problem-solving skills in dynamic, multi-cloud environments.\n\n\n\nBenefits:\n\n\n\nCompetitive salary and benefits package\nCulture focused on talent development with quarterly promotion cycles and company-sponsored higher education and certifications\nOpportunity to work with cutting-edge technologies\nEmployee engagement initiatives such as project parties, flexible work hours, and Long Service awards\nAnnual health check-ups\nInsurance coverage: group term life, personal accident, and Mediclaim hospitalization for self, spouse, two children, and parents\n\n\n\nValues-Driven, People-Centric & Inclusive Work Environment:\n\n\n\n\nPersistent Ltd. is dedicated to fostering diversity and inclusion in the workplace. We invite applications from all qualified individuals, including those with disabilities, and regardless of gender or gender preference. We welcome diverse candidates from all backgrounds.\n\n\n\nWe support hybrid work and flexible hours to fit diverse lifestyles.\nOur office is accessibility-friendly, with ergonomic setups and assistive technologies to support employees with physical disabilities.\nIf you are a person with disabilities and have specific requirements, please inform us during the application process or at any time during your employment\n\n\n\nLet's unleash your full potential at Persistent - persistent.com/careers\n\n\n\n\n\"Persistent is an Equal Opportunity Employer and prohibits discrimination and harassment of any kind.\"\n\nRole: IT Infrastructure Services - Other\nIndustry Type: IT Services & Consulting\nDepartment: IT & Information Security\nEmployment Type: Full Time, Permanent\nRole Category: IT Infrastructure Services\nEducation\nUG: B.Tech/B.E. in Computers\nPG: M.Tech in Computers\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\ncloudAnsiblePython",
    "company": "Persistent",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "7 - 12 years",
    "salary": "Not Disclosed",
    "posted": "6 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "cloud",
      "cloud",
      "Ansible",
      "Ansible",
      "Python",
      "Python"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-persistent-pune-7-to-12-years-090925018578",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.778Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.781Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.781Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a3f"
    },
    "title": "Python Developer@Infosys",
    "description": "Job description\n\nResponsibilities A day in the life of an Infoscion • As part of the Infosys delivery team, your primary role would be to ensure effective Design, Development, Validation and Support activities, to assure that our clients are satisfied with the high levels of service in the technology domain. • You will gather the requirements and specifications to understand the client requirements in a detailed manner and translate the same into system requirements. • You will play a key role in the overall estimation of work requirements to provide the right information on project estimations to Technology Leads and Project Managers. • You would be a key contributor to building efficient programs/ systems and if you think you fit right in to help our clients navigate their next in their digital transformation journey, this is the place for you! If you think you fit right in to help our clients navigate their next in their digital transformation journey, this is the place for you!\n\n\nTechnical and Professional Requirements: • Primary skills:Technology->Machine Learning->Python\n\n\nPreferred Skills: Technology->Machine Learning->Python\n\n\n\n\nAdditional Responsibilities: • Knowledge of design principles and fundamentals of architecture • Understanding of performance engineering • Knowledge of quality processes and estimation techniques • Basic understanding of project domain • Ability to translate functional / nonfunctional requirements to systems requirements • Ability to design and code complex programs • Ability to write test cases and scenarios based on the specifications • Good understanding of SDLC and agile methodologies • Awareness of latest technologies and trends • Logical thinking and problem solving skills along with an ability to collaborate\n\nEducational RequirementsMCA,MSc,MTech,Bachelor of Engineering,BCA,BSc,BTech responsibilities\n\n\n\n\nLocation- PAN INDIA\n\n\n\n\n\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: BCA in Any Specialization, B.Tech/B.E. in Any Specialization, B.Sc in Any Specialization\nPG: MCA in Any Specialization, MS/M.Sc(Science) in Any Specialization\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nDjangoPython DevelopmentPython\nDjango Framework",
    "company": "Infosys",
    "companyLogo": "NA",
    "location": "Hyderabad",
    "experience": "3 - 8 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "2500",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Django",
      "Django",
      "Python Development",
      "Python Development",
      "Python",
      "Python",
      "Django Framework",
      "Django Framework"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-infosys-infosys-hyderabad-pune-bengaluru-3-to-8-years-090625020450",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.812Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.814Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.814Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a40"
    },
    "title": "Python Software Developer - Pan India",
    "description": "Job description\n\nJob description\n\nHiring for Python Developer with experience range 9 to 17yrs.\n\nMandatory Skills: Python Developer-Python, Elasticsearch, PostgreSQL\n\nEducation: BE/B.Tech/MCA/M.Tech/MSc./MSts\n\n\n\n\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: B.Sc in Any Specialization, B.Tech/B.E. in Any Specialization, BCA in Any Specialization\nPG: M.Tech in Any Specialization, MS/M.Sc(Science) in Any Specialization, MCA in Any Specialization\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nPython FrameworkPostgresqlPython DevelopmentElastic SearchPython",
    "company": "Infosys",
    "companyLogo": "NA",
    "location": "Hyderabad",
    "experience": "8 - 13 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "99",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Python Framework",
      "Python Framework",
      "Postgresql",
      "Postgresql",
      "Python Development",
      "Python Development",
      "Elastic Search",
      "Elastic Search",
      "Python",
      "Python"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-software-developer-pan-india-infosys-hyderabad-pune-bengaluru-8-to-13-years-080925025842",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.838Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.839Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.839Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a41"
    },
    "title": "Python Software Developer-AB Pan India",
    "description": "Job description\n\nResponsibilities\n\n\n\n\nA day in the life of an Infoscion\n\n• As part of the Infosys delivery team, your primary role would be to ensure effective Design, Development, Validation and Support activities, to assure that our clients are satisfied with the high levels of service in the technology domain.\n\n• You will gather the requirements and specifications to understand the client requirements in a detailed manner and translate the same into system requirements. • You will play a key role in the overall estimation of work requirements to provide the right information on project estimations to Technology Leads and Project Managers.\n\n• You would be a key contributor to building efficient programs/ systems and if you think you fit right in to help our clients navigate their next in their digital transformation journey, this is the place for you! If you think you fit right in to help our clients navigate their next in their digital transformation journey, this is the place for you!\n\n\n\n\nTechnical and Professional Requirements:\n\n\n\n\n• Primary skills: Technology->Machine Learning->Python\n\n\n\n\nPreferred Skills: Technology->Machine Learning->Python\n\n\n\n\nAdditional Responsibilities:\n\n• Knowledge of design principles and fundamentals of architecture\n\n• Understanding of performance engineering\n\n• Knowledge of quality processes and estimation techniques\n\n• Basic understanding of project domain\n\n• Ability to translate functional / nonfunctional requirements to systems requirements • Ability to design and code complex programs\n\n• Ability to write test cases and scenarios based on the specifications\n\n• Good understanding of SDLC and agile methodologies\n\n• Awareness of latest technologies and trends\n\n• Logical thinking and problem solving skills along with an ability to collaborate\n\n\n\n\nEducational Requirements MCA, MSc, MTech, Bachelor of Engineering, BCA, BSc, BTech\n\nLocation- PAN INDIA\n\n\n\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: B.Tech/B.E. in Any Specialization, B.Sc in Any Specialization, BCA in Any Specialization\nPG: M.Tech in Any Specialization, MCA in Any Specialization, MS/M.Sc(Science) in Any Specialization\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nDjangoPythonFlask",
    "company": "Infosys",
    "companyLogo": "NA",
    "location": "Kolkata",
    "experience": "3 - 8 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "1000",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Django",
      "Django",
      "Python",
      "Python",
      "Flask",
      "Flask"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-software-developer-ab-pan-india-infosys-kolkata-pune-bengaluru-3-to-8-years-100625023928",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.853Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.854Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.854Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f2893e714800c08b6a42"
    },
    "title": "Python Developer",
    "description": "Job description\n\n\n\nRole & responsibilities:\n\nDesign, develop, and maintain scalable backend services using Python and FastAPI.\n\nBuild and integrate RESTful APIs and microservices for various applications.\n\nImplement best practices in coding, security, and application performance.\n\nDeploy, monitor, and optimize applications on cloud platforms (AWS/Azure/GCP).\n\nCollaborate with cross-functional teams including frontend developers, DevOps, and product owners.\n\nTroubleshoot, debug, and resolve issues in existing applications.\n\nWrite unit tests and ensure high code quality with proper documentation.\n\nWork in an Agile environment, contributing to sprint planning and delivery.\n\n\n\nRequired:\n\nStrong proficiency in Python (8+ years experience).\n\nHands-on experience with FastAPI (or Flask/Django with transition to FastAPI).\n\nSolid understanding of cloud technologies (AWS/Azure/GCP).\n\nExperience with Docker, Kubernetes, CI/CD pipelines is a plus.\n\nKnowledge of databases (SQL/NoSQL) and ORM frameworks.\n\nStrong problem-solving skills and ability to work independently in a remote setup.\n\n\n\n\nNote: Share your resume at mampi@akaasa.com or call 7349454036\n\nRole: Data Engineer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nCloud TechnologiesFast ApiPython\nGCPAzzureAWS",
    "company": "Akaasa Infotech Noida",
    "companyLogo": "NA",
    "location": "Hyderabad",
    "experience": "8 - 13 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "5",
    "applicants": "50+",
    "aboutCompany": "NA",
    "keySkills": [
      "Cloud Technologies",
      "Cloud Technologies",
      "Fast Api",
      "Fast Api",
      "Python",
      "Python",
      "GCP",
      "GCP",
      "Azzure",
      "Azzure",
      "AWS",
      "AWS"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-python-developer-akaasa-infotech-noida-hyderabad-8-to-13-years-150925003827",
    "scrappedAt": {
      "$date": "2025-09-16T05:15:53.885Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:15:53.887Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:15:53.887Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c8c417b2535c57b334"
    },
    "title": "Software Developer V - Typescript, Node.js, C++",
    "description": "Job description\nADSKJP00008748 Position Overview: We are looking for an experienced Senior Software Development Engineer to join our scrum team that we are setting up in Pune, India to contribute to Fusion Manufacturing Data Model (MFGDM)\nMFGDM is the foundation of Manufacturing Cloud and core Data Framework for Autodesk Cloud Flagship Product Autodesk Fusion\nYou will report to manager and its a hybrid work mode\nResponsibilities: - You will work with global MFGDM development group (US, Canada, India, China etc\n) and within a scrum team with about 6-7 engineers\n- Co-work with the scrum team members to accomplish customer/project requirements\n- - Collaborate with other scrum teams located in Shanghai or in other sites around the world\n- You will design, implement and validate MFGDM modules/components\nWillingness to participate in professional development activities to stay current on industry knowledge and bring initiatives from beginning to end\n- You will build the quality of work delivered, have for delivering in excellence and develop tools to improve high quality services development such as resiliency analysis, performance / scalability / stability monitor, automation test\n- Can carry out best engineering practices into own work\n- Can well present and participate in global technical discussions\n- Encourage initiatives and innovations everywhere as seeing opportunities\nMinimum Qualifications: - BS or higher in computer science or related technical discipline\n- 10+ years of software development experience in commercialized products or big-scale systems\n- Experience in Typescript, Nodejs, C++\n- Experience building apps on AWS using services such as Step functions, DynamoDB, IAM, EC2, CloudWatch and Lambda\n- Exposure with Cloud projects development experience\n- Willing to take challenges and stretch comfortable zone to grow\n- Good team player\nPreferred Qualifications: - Willing to take challenges and stretch comfortable zone to grow\n- Rich hands-on project experience in full stack Cloud services development\n- Experience communicating updates and resolutions to customers and other partners\n- Solid C++, Typescript skills\n- Experience working in Agile process is needed\nPrimary Skills (Must-have): Typescript, Node\njs, C++Secondary Skills (Good-to-have): AWS, Java\nRole: Full Stack Developer\nIndustry Type: Software Product\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\n\nread more\n\nKey Skills\nComputer scienceC++AutomationScalabilityCloud ServicesData modelingAgileScrumAutodeskMonitoring",
    "company": "Aziro",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "6 - 7 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "Less than 10",
    "aboutCompany": "NA",
    "keySkills": [
      "Computer science",
      "Computer science",
      "C++",
      "C++",
      "Automation",
      "Automation",
      "Scalability",
      "Scalability",
      "Cloud Services",
      "Cloud Services",
      "Data modeling",
      "Data modeling",
      "Agile",
      "Agile",
      "Scrum",
      "Scrum",
      "Autodesk",
      "Autodesk",
      "Monitoring",
      "Monitoring"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-software-developer-v-typescript-node-js-c-msys-tech-india-pvt-ltd-pune-6-to-7-years-150925502912",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:12.941Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:12.944Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:12.944Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b335"
    },
    "title": "Node Js Developer",
    "description": "Job description\n\nSkill: Nodejs, HTML, CSS, Java Script , Jquery\n\n\n\n\nExperience: 6 years to 12 Years\n\n\n\n\nNotice: Immediate to 60 days\n\nRole: Front End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nCSSNode.JsHTMLMongoDB\nExpressJavascript",
    "company": "Cognizant",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "4 - 7 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "30",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "CSS",
      "CSS",
      "Node.Js",
      "Node.Js",
      "HTML",
      "HTML",
      "MongoDB",
      "MongoDB",
      "Express",
      "Express",
      "Javascript",
      "Javascript"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-cognizant-pune-chennai-bengaluru-4-to-7-years-150525005801",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.002Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.003Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.003Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b336"
    },
    "title": "Node.js Developer",
    "description": "Job description\nPosition Summary\nWe?re looking for a Nodedot js Developer with a passion for automation, low-code tools, and custom integrations\nIn this hybrid role, you'll develop custom n8n nodes, build robust n8n workflows, and contribute to frontend components where needed\nYou should be comfortable working with APIs, building integration logic, and structuring automation pipelines using tools like n8n, Make (Integromat), or similar, This role blends hands-on coding with architectural thinking ? perfect for someone who enjoys bridging systems and building tools that reduce manual work and power intelligent automation\nResponsibilities:\nDevelop custom n8n nodes in TypeScript/JavaScript for internal and external service integration, Design and maintain scalable n8n workflows for automating business logic and data flow, Work with APIs (REST, GraphQL, webhooks) to integrate 3rd-party platforms and internal services, Build lightweight frontend components or dashboards (e-g\n, for workflow management or status reporting), Requirement\n3+ years of experience in software development (Nodedot js, JavaScript/TypeScript), Hands-on experience building or extending n8n workflows or custom nodes, Strong understanding of API design and consumption, including authentication (OAuth2, API keys), Solid grasp of data formats and structures (JSON, arrays, objects, etc ), Ability to design automation logic and think in terms of workflows or pipelines, Familiarity with Git and CI/CD processes, Nice To Have\nExperience with other low-code/automation tools (Make, Zapier, Retool, Pipedream, etc ), Basic frontend experience (React, Vue, or similar frameworks), Knowledge of queueing systems, scheduling, or event-driven architecture, Understanding of error handling and resilience in automated flows, Experience working with databases (SQL/NoSQL) or cloud functions, About Aumni Techworks\nAumni Techworks, established in 2016, is a Software Services Company that partners with Product companies to build and manage their dedicated teams in India\nSo, while you are working for a services company, you are working within a product team and growing with them, We do not take projects, and we have long term (open ended) contracts with our clients\nWhen our clients sign up with us, they are looking at a multi-year relationship\nFor e-g\nSome of the clients we signed up 8 or 6 years, are still with us, We do not move people across client teams and there is no concept of bench, At Aumni, we believe in quality work, and we truly believe that Indian talent is at par with someone in NY, London or Germany\n300+ and growing\nBenefits Of Working At Aumni Techworks\nOur award-winning culture reminds us of our engineering days, Medical insurance (including Parents), Life and disability insurance\n24 leaves + 10 public holidays + leaves for Hospitalization, maternity, paternity and bereavement, On site Gym, TT, Carrom, Foosball and Pool table\nHybrid work culture\nFitness group / rewards\nFriday Socials, Annual parties, treks, Show more Show less\nRole: Full Stack Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nrestsoftware developmentconsumablessql",
    "company": "Aumni Techworks",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "2 - 4 years",
    "salary": "Not Disclosed",
    "posted": "3 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "Founded in 2016, Aumni Techworks helps software product MNCs by building and operating their fully owned teams or their subsidiaries in India. This allows MNCs to have their presence in India without having to learn/manage on how to run a business in India.",
    "keySkills": [
      "rest",
      "rest",
      "software development",
      "software development",
      "consumables",
      "consumables",
      "sql",
      "sql"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-aumni-techworks-pune-2-to-4-years-120925501536",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.017Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.018Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.018Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b337"
    },
    "title": "Full Stack Developer (React+ Node.js)",
    "description": "Job description\nMOBISAP INFOTECH is looking for Full Stack Developer (React+ Node.js) to join our dynamic team and embark on a rewarding career journey Designing, developing, and testing front-end and back-end components of a web application\n\nBuilding scalable and efficient web pages and applications\n\nIntegrating user-facing elements with server-side logic\n\nImplementing security measures and data protection protocols to ensure the security of sensitive information\n\nCollaborating with other developers, designers, and stakeholders to define and build new features\n\nTroubleshooting and fixing technical issues as they arise\n\nKnowledge of agile software development methodologies\n\nStrong problem-solving and analytical skills\n\nExcellent written and verbal communication skills\nRole: Front End Developer\nIndustry Type: Internet\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nreduxfullstack developmentcssweb applicationbootstrapajaxjavascriptjquerynodereact.jsnode.jsgitwritingfull stacksoftware development methodologiestroubleshootingjsonhtmlmysqlagiletypescriptprotocolsmongodbcommunication skills",
    "company": "Mobisoft Infotech",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "4 - 7 years",
    "salary": "Not Disclosed",
    "posted": "4 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "Mobisoft Infotech is an ISO 27001:2013 certified global digital product development company. We partner with global businesses of all sizes to build, improve and scale products across industries leveraging disruptive technologies, combining design, engineering and innovation, while taking them forward on their digital journeys.",
    "keySkills": [
      "redux",
      "redux",
      "fullstack development",
      "fullstack development",
      "css",
      "css",
      "web application",
      "web application",
      "bootstrap",
      "bootstrap",
      "ajax",
      "ajax",
      "javascript",
      "javascript",
      "jquery",
      "jquery",
      "node",
      "node",
      "react.js",
      "react.js",
      "node.js",
      "node.js",
      "git",
      "git",
      "writing",
      "writing",
      "full stack",
      "full stack",
      "software development methodologies",
      "software development methodologies",
      "troubleshooting",
      "troubleshooting",
      "json",
      "json",
      "html",
      "html",
      "mysql",
      "mysql",
      "agile",
      "agile",
      "typescript",
      "typescript",
      "protocols",
      "protocols",
      "mongodb",
      "mongodb",
      "communication skills",
      "communication skills"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-full-stack-developer-react-node-js-mobisap-infotech-pune-4-to-7-years-110925503170",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.058Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.060Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.060Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b338"
    },
    "title": "Node.js Developer",
    "description": "Job description\nOwn architecture and technical direction for marketplace enhancements (search, catalog, payments, entitlement, usage analytics, etc.).\nDesign and develop performant REST/GraphQL services using Node.js and TypeScript.\nBuild responsive, component-driven UIs in React.js using hooks, context, and modern state management. Guide junior engineers through programming, code reviews, and 1-on-1 coaching. Work closely with Product, Design, and Data teams to deliver incremental value in sprints.\n\nSkill Level Experience:\n\n4 6 years. Proven record of owning production services end-to-end.\nLevel: 9.Core Technical Skill Set Backend (Must-Have): Node.js, Express, TypeScript Backend (Nice-to-Have): Event-driven patterns, micro-services\nFrontend (Must-Have): React.js, ES6+, Webpack/Vite Frontend (Nice-to-Have): Tailwind/Material UI, Storybook\nDatabase (Must-Have): MySQL (schema design, tuning, replication)Database (Nice-to-Have): Redis\nPlatform (Must-Have): Linux, DockerPlatform (Nice-to-Have): Kubernetes\nRole: Full Stack Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nBackendUsageFront endLinuxMySQLSchemaJavascriptDatabaseProduct designAnalytics",
    "company": "Apptad Inc",
    "companyLogo": "NA",
    "location": "Kolkata",
    "experience": "4 - 8 years",
    "salary": "Not Disclosed",
    "posted": "5 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Backend",
      "Backend",
      "Usage",
      "Usage",
      "Front end",
      "Front end",
      "Linux",
      "Linux",
      "MySQL",
      "MySQL",
      "Schema",
      "Schema",
      "Javascript",
      "Javascript",
      "Database",
      "Database",
      "Product design",
      "Product design",
      "Analytics",
      "Analytics"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-apptad-inc-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-4-to-8-years-100925504367",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.078Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.079Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.079Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b339"
    },
    "title": "Node Js Developer",
    "description": "Job description\n\nRole & responsibilities\n\n\n\n\n\nPreferred candidate profile\n\n\n\n\nJob Title: Senior Node.js Developer\n\nLocation: Mumbai (Onsite)\nClient: Reliance \nExperience: 5+ Years\nPosition Type: Full-time\n\n\nJob Description:\n\nWe are hiring a skilled and experienced Node.js Developer to work with our prestigious client, Reliance Industries Limited, based in Mumbai. The ideal candidate should have strong backend development expertise, particularly in Node.js, and must be capable of building scalable, secure, and efficient backend systems in a high-performance environment.\n\nKey Responsibilities:\n\nDevelop and maintain scalable backend services using Node.js and modern JavaScript (ES6+) features.\nDesign and implement robust RESTful APIs and integrate third-party services as needed.\nWork extensively with MySQL, MongoDB, and Oracle for schema design, complex queries, indexing, and performance tuning.\nWrite clean, maintainable, and efficient code, following best practices in error handling, logging, and debugging.\nEnsure secure development practices by implementing API security standards (JWT, OAuth, data validation, encryption).\nCollaborate with architects and engineers on Low-Level Design (LLD) and High-Level Design (HLD).\nHandle asynchronous programming, event-driven architecture, and design patterns effectively.\nWork with message queue systems like Kafka or RabbitMQ to manage distributed workloads.\nAnalyze, debug, and optimize backend workflows, especially under high-load or large-scale systems.\nContribute to the system design, microservices architecture, and distributed systems.\nUse Git proficiently with a collaborative branching and release strategy.\n\nRequired Skills:\n\nStrong proficiency in Node.js and JavaScript/ES6+\nExpertise in MySQL, MongoDB, and Oracle (schema design, complex queries, performance tuning)\nExperience in building and consuming RESTful APIs\nGood understanding of asynchronous programming and event-driven architecture\nHands-on experience in error handling, debugging, and logging in Node.js\nSolid knowledge of API security practices (JWT, OAuth, encryption, etc.)\nExperience with message queues like Kafka or RabbitMQ\nStrong understanding of LLD and HLD design principles\nExposure to system design, microservices, and distributed systems\nProblem-solving mindset with a focus on building scalable, maintainable, and efficient backend solutions\nProficiency with Git and version control workflows\nRole: IT Recruiter\nIndustry Type: IT Services & Consulting\nDepartment: Human Resources\nEmployment Type: Full Time, Permanent\nRole Category: Recruitment & Talent Acquisition\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nNode.Js\nNodeNode Js Framework",
    "company": "Mobile Programming",
    "companyLogo": "NA",
    "location": "Mumbai",
    "experience": "5 - 7 years",
    "salary": "Not Disclosed",
    "posted": "5 days ago",
    "openings": "10",
    "applicants": "100+",
    "aboutCompany": "<p>Mobile Programming LLC</p>",
    "keySkills": [
      "Node.Js",
      "Node.Js",
      "Node",
      "Node",
      "Node Js Framework",
      "Node Js Framework"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-mobile-programming-mumbai-navi-mumbai-pune-5-to-7-years-100925027403",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.092Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.094Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.094Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b33a"
    },
    "title": "Fullstack Developer - Node.js (AWS Serverless/Mobile App)",
    "description": "Job description\n\nAbout the Role:\n\nWe are hiring a Fullstack Developer with strong expertise in Node.js (Express) and AWS serverless infrastructure to join our high-impact mobile application development team. This is a hands-on development role where you will be responsible for architecting and implementing robust APIs, managing integrations with wearables and third-party health data platforms, and enabling AI/ML-powered features through seamless data pipelines.\n\nYou will be a key player in delivering a cutting-edge mobile solution that helps users monitor and improve their health while also managing carers and accessing essential community servicesall in one place.\n\nKey Responsibilities:\n\nDesign, build, and maintain scalable and secure RESTful APIs using Node.js (Express) hosted on AWS Lambda or EC2.\nIntegrate data ingestion from smart devices (Apple HealthKit, Google Fit, Fitbit, etc.), healthcare platforms, and manual user inputs.\nWork with AWS services including Lambda, API Gateway, S3, Cognito, and CloudWatch to develop and deploy backend infrastructure.\nImplement real-time data sync, user authentication, and role-based access control.\nDevelop and manage database schemas using Amazon Aurora (PostgreSQL) or DynamoDB for optimal performance and scalability.\nCollaborate with the AI/ML team to enable integration with Amazon SageMaker for predictive analytics and personalised health insights.\nSupport OCR integrations using Amazon Textract and Rekognition to process uploaded health documents.\nEnsure high levels of data security and compliance, especially for sensitive healthcare data.\nWork closely with the Flutter frontend developers, Technical Architect, and DevOps team to ensure seamless integration and deployment.\nParticipate in code reviews, maintain documentation, and contribute to continuous integration and deployment (CI/CD) pipelines.\n\nInitial Phase Deliverables:\n\nPhase 1:\n\nAPI integrations for wearable data, manual data input, and external healthcare sources\nCore backend for user dashboard, carer management, and service booking\nEmergency assistance backend and real-time alerts\nSecure deployment using AWS infrastructure\n\nPhase 2:\n\nAI/ML integration for intelligent insights and recommendations\nLife Expectancy Indicator logic and data aggregation\nOCR pipeline and document management features\nOngoing scalability and performance enhancements\n\nRequired Skills & Experience:\n\n3-5 years of experience in Node.js (Express) backend development\nSolid understanding of AWS architecture and services like Lambda, API Gateway, S3, CloudWatch, and EC2\nStrong experience with REST APIs, serverless frameworks, and API security (OAuth2/JWT)\nFamiliarity with PostgreSQL (Amazon Aurora) or DynamoDB database design and optimisation\nHands-on experience integrating third-party APIs, especially health-related SDKs and platforms\nFamiliarity with mobile-first backend development, working closely with Flutter or mobile frontend teams\nExcellent debugging, performance tuning, and documentation skills\nStrong understanding of asynchronous programming, error handling, and data validation\n\nNice to Have:\n\nExperience working with OCR (Textract, Rekognition) or AI/ML services (SageMaker)\nPrior work in healthcare tech, caregiver platforms, or IoT integrations\nExposure to WebSockets, push notifications, and real-time service booking systems\nKnowledge of DevOps tools for deployment, CI/CD, and monitoring (GitHub Actions, CodePipeline, etc.)\nAWS Certification (Developer Associate / Solutions Architect)\n\nWhat We Offer:\n\nOpportunity to work on an innovative health-focused mobile platform impacting real lives\nA dynamic and collaborative startup environment\nCompetitive salary and performance-based incentives\nGrowth opportunities into DevOps, AI integration, or technical leadership\nWork with cutting-edge AWS technology stack and AI-driven architecture\n\nHow to Apply:\n\nSend your resume and a short cover letter to careers@a1disabilitysupportcare.com.au\nSubject: Fullstack Developer Mobile Health App Mumbai\n\n(Very Important: You NEED TO copy-paste this subject above in the subject field of the email)\n\nRole: Full Stack Developer\nIndustry Type: Medical Services / Hospital\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: BCA in Any Specialization\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nAws LambdaNode.JsAWS\nFullstack DevelopmentFlutter DevelopmentRestful Web Api Development",
    "company": "Cosmos Media",
    "companyLogo": "NA",
    "location": "Mumbai",
    "experience": "5 - 10 years",
    "salary": "9-18 Lacs P.A.",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "25",
    "aboutCompany": "NA",
    "keySkills": [
      "Aws Lambda",
      "Aws Lambda",
      "Node.Js",
      "Node.Js",
      "AWS",
      "AWS",
      "Fullstack Development",
      "Fullstack Development",
      "Flutter Development",
      "Flutter Development",
      "Restful Web Api Development",
      "Restful Web Api Development"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-fullstack-developer-node-js-aws-serverless-mobile-app-cosmos-media-mumbai-5-to-10-years-170625019183",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.135Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.136Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.136Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b33b"
    },
    "title": "Node Js Developer",
    "description": "Job description\n\nWe are seeking few talented Node.js Developer to build and maintain scalable backend systems and APIs.\n\nBuild and manage RESTful APIs services for front-end integration.\nImplement authentication, authorization, and security best practices.\nImplement external APIs for SMS, WhatsApp, Email, Payment Gateway etc.\nDeploy and monitor applications on cloud platforms (AWS)\nStrong knowledge of MongoDB, Redis, Git/GitHub, JavaScript, TypeScript and Express.js\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nNode.JsMongoDB\nExpressAWS\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nOther\n500/500 Characters left\nSubmit",
    "company": "Saascraft Studio",
    "companyLogo": "NA",
    "location": "Hyderabad",
    "experience": "0 - 3 years",
    "salary": "1.75-6 Lacs P.A.",
    "posted": "Just now",
    "openings": "4",
    "applicants": "38",
    "aboutCompany": "NA",
    "keySkills": [
      "Node.Js",
      "Node.Js",
      "MongoDB",
      "MongoDB",
      "Express",
      "Express",
      "AWS",
      "AWS"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-saascraft-studio-hyderabad-0-to-3-years-160925012481",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.176Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.177Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.177Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b33c"
    },
    "title": "Node Js Developer",
    "description": "Job description\nDevelopment of all server-side logic, definition and maintenance of the central database, and ensuring high performance and responsiveness to requests from the front-end.\n\nDesigning, coding, testing, and maintaining server-side applications using Node.js.Full time2 YearsDeveloping and maintaining server-side logic using Node.js.\nStrong proficiency in JavaScript and server-side frameworks such as Express.js.\nWriting reusable, testable, and efficient code.&Integration of data storage solutions such as databases (e.g., MongoDB, MySQL, PostgreSQL).\n\nExperience with asynchronous programming and handling RESTful APIs.&Understanding of front-end technologies such as HTML5, CSS3, and JavaScript frameworks (React, Angular, Vue.js).\nRole: Front End Developer\nIndustry Type: Software Product\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nFront endCodingPostgresqlMySQLProgrammingJavascriptDatabaseMongoDBCSS3Testing",
    "company": "Systimanx It Solutions",
    "companyLogo": "NA",
    "location": "Madurai",
    "experience": "2 - 5 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "46",
    "aboutCompany": "NA",
    "keySkills": [
      "Front end",
      "Front end",
      "Coding",
      "Coding",
      "Postgresql",
      "Postgresql",
      "MySQL",
      "MySQL",
      "Programming",
      "Programming",
      "Javascript",
      "Javascript",
      "Database",
      "Database",
      "MongoDB",
      "MongoDB",
      "CSS3",
      "CSS3",
      "Testing",
      "Testing"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-systimanx-it-solutions-pvt-ltd-madurai-2-to-5-years-150925503454",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.216Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.217Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.217Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b33d"
    },
    "title": "Node JS Developer (Standard)",
    "description": "Job description\nDesign, develop, and maintain RESTful APIs in NodeJS/Typescript (HapiJs/NestJs) Work with databases (MySQL/NoSQL like MongoDB / Neo4j / Dynamodb / ElasticSearch) to build secure and optimized data access layers\nEnsure best practices in authentication, authorization, and data privacy (OAuth0, JWT, Auth0)\nCollaborate with frontend teams (React/Angular) to define clear API contracts\nOptimize performance and scalability for high-volume donation and user interactions\nWrite unit, integration, and end-to-end tests ensuring high code coverage and reliability\nDeploy, monitor, and troubleshoot applications in AWS using AWS CDK on ECS/Lambda/Serverless frameworks\nParticipate in code reviews, architecture discussions, and technical design sessions\nContribute to continuous integration and delivery pipelines Mentor junior developers and share best practices in clean coding, testing, and DevOps\nRequired Skills & Experience 5 7 years of experience as a backend engineer with strong expertise in Node\njs/TypeScript\nStrong knowledge of RDBMS (PostgreSQL/MySQL) and one NoSQL database (MongoDB, DynamoDB, Neo4j)\nHands-on experience with AWS or GCP services (ECS, Lambda, S3, Cloud Functions, Pub/Sub, SQS/Kafka)\nSolid understanding of API security, rate limiting, token validation, and encryption\nFamiliarity with event-driven architectures and message queues\nExperience with CI/CD pipelines and Dockerized deployments\nStrong problem-solving, debugging, and performance optimization skills\nExcellent communication and collaboration skills, with an ability to work in cross-functional teams\n\n \n\n \nNice-to-Have Experience\nEXPERIENCE\n4.5-6 Years\nSKILLS\nPrimary Skill: Open Source Development\nSub Skill(s): Open Source Development\nAdditional Skill(s): Node.js, HTML, JavaScript Development\nRole: Full Stack Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nTelecomAutomationBackendManaged servicesCodingGCPMySQLDebuggingHealthcaremicrosoft\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "Infogain",
    "companyLogo": "NA",
    "location": "Bengaluru",
    "experience": "4 - 6 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "50+",
    "aboutCompany": "NA",
    "keySkills": [
      "Telecom",
      "Telecom",
      "Automation",
      "Automation",
      "Backend",
      "Backend",
      "Managed services",
      "Managed services",
      "Coding",
      "Coding",
      "GCP",
      "GCP",
      "MySQL",
      "MySQL",
      "Debugging",
      "Debugging",
      "Healthcare",
      "Healthcare",
      "microsoft",
      "microsoft"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-standard-infogain-india-p-ltd-bengaluru-4-to-6-years-150925503244",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.233Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.235Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.235Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b33e"
    },
    "title": "Node Js Developer",
    "description": "Job description\nJob Title:- Node Js Developer\n\n\n\n\n\nJob Type:- Full Time\n\n\n\n\n\nJob Location:- Bangalore\n\n\n\n\n\n\nJD:-\n\n\n\n\n\n\n\nJob Description\n\n\n\n\nMinimum of 6 years of professional experience in software development, with a strong focus on Node.js.\n\n\nProven track record of delivering successful software projects with complex, scalable architectures.\n\n\nGood understanding of asynchronous programming and event-driven architecture in Node.js.\n\n\nProficiency in designing and consuming RESTful APIs and web services.\n\n\nFamiliarity with cloud platforms (e.g., AWS, Azure) is a plus.\n\n\nExcellent problem-solving skills and the ability to troubleshoot complex issues effectively.\n\n\nStrong communication skills, both written and verbal, with the ability to explain technical concepts to non-technical stakeholders.\n\n\n\n\nJob Responsibilities\n\n\n\n\nArchitect and develop backend services and APIs using Node.js, ensuring high performance, scalability, and maintainability.\n\n\nCollaborate with frontend developers, UI/UX designers, and product managers to design and implement end-to-end solutions that deliver exceptional user experiences.\n\n\nWrite well-structured, reusable, and efficient code while adhering to best practices and coding standards.\n\n\nParticipate in code reviews, providing constructive feedback and ensuring the quality of the codebase.\n\n\nInvestigate and resolve complex technical issues, optimizing application performance and identifying opportunities for improvement.\n\n\nLead technical discussions and contribute to architectural decisions that align with the company's long-term goals.\n\n\n\n\n\n\n\n\n\n\nRole: Full Stack Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nArchitectBackendWeb servicesFront endArchitectureScalabilityCodingJavascriptTechnical LeadTroubleshooting",
    "company": "Apptad Inc",
    "companyLogo": "NA",
    "location": "Kolkata",
    "experience": "6 - 8 years",
    "salary": "Not Disclosed",
    "posted": "5 days ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Architect",
      "Architect",
      "Backend",
      "Backend",
      "Web services",
      "Web services",
      "Front end",
      "Front end",
      "Architecture",
      "Architecture",
      "Scalability",
      "Scalability",
      "Coding",
      "Coding",
      "Javascript",
      "Javascript",
      "Technical Lead",
      "Technical Lead",
      "Troubleshooting",
      "Troubleshooting"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-apptad-inc-kolkata-mumbai-new-delhi-hyderabad-pune-chennai-bengaluru-6-to-8-years-100925504366",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.271Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.273Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.273Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b33f"
    },
    "title": "Job opportunity For Node.JS Developer",
    "description": "Job description\n\nRoles and Responsibilities :\n\nDesign, develop, test, and deploy scalable Node.js applications using best practices in software development.\nCollaborate with cross-functional teams to identify requirements and implement solutions that meet business needs.\nTroubleshoot issues and debug code to ensure high-quality deliverables.\nStay up-to-date with industry trends and emerging technologies to improve coding skills.\n\n\nLocation: Chennai only\nNotice Period: Immediate to 45Days\n\nJob Requirements :\n\n6-10 years of experience as a Node.js developer or similar role.\nMinimum 4Years of experience in Node.Js is required\nStrong understanding of JavaScript fundamentals, including data structures, algorithms, and object-oriented programming concepts.\nProficiency in writing clean, modularized code using modern frontend frameworks like React or Vue.js.\nRole: Front End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Graduation Not Required\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nnode.js developerNode.Js\nNode",
    "company": "Cognizant",
    "companyLogo": "NA",
    "location": "Chennai",
    "experience": "6 - 10 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "2",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "node.js developer",
      "node.js developer",
      "Node.Js",
      "Node.Js",
      "Node",
      "Node"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-opportunity-for-node-js-developer-cognizant-chennai-6-to-10-years-150925028590",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.297Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.298Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.298Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b340"
    },
    "title": "Node Js Developer",
    "description": "Job description\n\nJob Title: Node.js Developer\nType: Full Time\n\n\n\n\nAbout Company\n\n\n\n\nZARTHI is a technology service provider that acts as a catalyst for businesses. We have established relationships with companies and organizations such as Haldirams, Thirdwave Coffee, m-Pocket, UNICEF, and UNDP. Beyond providing technology support, we also specialize in cloud management. Our offerings span over 25 practices, including Product, UI/UX, Infrastructure, SRE, DevOps, Application, Data, and AI. The technologies we support include Java, React, Flutter, Python, IoT, BigQuery, Data Lake, and more.\n\n\n\n\nResponsibilities\n\n\n\nDevelop and maintain server-side network components using Node.js\nDesign and build scalable APIs and integrate third-party APIs\nCollaborate with front-end developers and stakeholders\nWrite reusable, efficient, and robust code\nEnsure optimal database performance and application responsiveness\nImplement security protocols and data protection measures\nTroubleshoot, debug, and provide technical support\nDocument processes and prepare technical reports\n\n\n\nRequirements\n\nMinimum 2 years experience as a Node.js developer\nGood understanding on websockets development\nStrong JavaScript knowledge and experience with Node.js, Express.js\nFamiliarity with front-end technologies (HTML5, CSS3, React)\nExperience with databases (MySQL, MongoDB)\nProblem-solving, collaboration, and communication skills\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nMySQLApi IntegrationJavascriptNode.Js\nJavaNode Js FrameworkRestful Web Api DevelopmentNodejs ApplicationsHtml/CssBackend Development",
    "company": "Centilytics",
    "companyLogo": "NA",
    "location": "Thiruvananthapuram",
    "experience": "2 - 4 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "3",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "MySQL",
      "MySQL",
      "Api Integration",
      "Api Integration",
      "Javascript",
      "Javascript",
      "Node.Js",
      "Node.Js",
      "Java",
      "Java",
      "Node Js Framework",
      "Node Js Framework",
      "Restful Web Api Development",
      "Restful Web Api Development",
      "Nodejs Applications",
      "Nodejs Applications",
      "Html/Css",
      "Html/Css",
      "Backend Development",
      "Backend Development"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-centilytics-thiruvananthapuram-2-to-4-years-150925025610",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.322Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.324Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.324Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b341"
    },
    "title": "Node Js Developer",
    "description": "Job description\n\nPosition: Node.js Lead (Mobile Banking)\n\n\n\n\nLocation: Mumbai, Dadar (In-office) (Alternate Saturday's to be working)\n\n\n\n\nExperience: 7-10 years total backend development, with 3+ years in a Node.js lead role.\n\n\n\n\nSpecific Requirement: Proven experience on a maximum of 3 mobile banking projects is a must.\n\n\n\n\nKey Responsibilities:\n\nLead and mentor a team of Node.js developers.\nArchitect and build secure, scalable backend systems for mobile banking apps.\nOversee the full development lifecycle, including code reviews and performance tuning.\nEnsure adherence to high standards for code quality and security, especially in the financial domain.\nTroubleshoot production issues and stay updated on new technologies.\nRequired Skills:\nExpertise in Node.js, JavaScript/TypeScript, and frameworks like Express.js.\nDeep knowledge of backend security best practices for financial applications.\nExperience with microservices, RESTful APIs, and both SQL/NoSQL databases.\nFamiliarity with cloud platforms (AWS, Azure, GCP) and CI/CD pipelines.\nExcellent leadership, problem-solving, and communication skills.\nWork Schedule: Monday-Friday, plus alternate Saturdays.\n\n\nRole: Front End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nSeniorJavascriptNode.JsExpresjs\nAzure CloudRestful Web Api Development\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nOther\n500/500 Characters left\nSubmit",
    "company": "Winjit Technologies",
    "companyLogo": "NA",
    "location": "Mumbai",
    "experience": "7 - 10 years",
    "salary": "9-12 Lacs P.A.",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "50+",
    "aboutCompany": "NA",
    "keySkills": [
      "Senior",
      "Senior",
      "Javascript",
      "Javascript",
      "Node.Js",
      "Node.Js",
      "Expresjs",
      "Expresjs",
      "Azure Cloud",
      "Azure Cloud",
      "Restful Web Api Development",
      "Restful Web Api Development"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-winjit-technologies-mumbai-mumbai-suburban-mumbai-all-areas-7-to-10-years-150925004248",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.347Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.349Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.349Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b342"
    },
    "title": "Node Js Developer",
    "description": "Job description\n\nRole & responsibilities\n\nFrontend & Backend Development: JavaScript, Node.js, TypeScript; React.js, Next.js; Backend for Frontends (BFFs); Contentful CMS\n\nInfrastructure & DevOps: Terraform / Pulumi (Infrastructure as Code); Azure (Serverless, Kubernetes); Git (Mono repo); CI/CD: GitHub Actions, GitOps; Secret Management: Azure Key Vault\n\nDatabase & Integration: Cosmos DB; Service Bus; REST APIs\n\nCaching & Logging: Redis; ELK Stack (Logging); Grafana (Monitoring)\n\nTesting & Agile Practices: Unit Testing: Jest; Agile / Scrum methodology; Tools: Jira board\n\nCommunication Tools: Slack; Microsoft Teams\n\nUI/UX Skills: Strong knowledge of CSS; Cross-browser compatibility; Responsive web design\n\n\n\n\n\nPreferred candidate profile\n\n\n\n\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nNodeNode.Js\nNode.js Developer\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nOther\n500/500 Characters left\nSubmit",
    "company": "Tekskills India PVT lTD",
    "companyLogo": "NA",
    "location": "Chennai",
    "experience": "8 - 10 years",
    "salary": "Not Disclosed",
    "posted": "Just now",
    "openings": "1",
    "applicants": "Less than 10",
    "aboutCompany": "NA",
    "keySkills": [
      "Node",
      "Node",
      "Node.Js",
      "Node.Js",
      "Node.js Developer",
      "Node.js Developer"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-tekskills-chennai-8-to-10-years-160925011965",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.389Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.390Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.390Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b343"
    },
    "title": "Node Js Developer-C2H Opportunity-Chennai, Bangalore",
    "description": "Job description\n\nRole: Node.js Developer\n\nExperience: 6 Yrs\n\nLocation: PAN India\n\nWork mode: Hybrid\n\nWork Type: C2H\n\nNotice period: Immediate\n\nSkills required: Node.js\n\n\n\n\nInterested candidates, drop your CV to gayathri.p@randstaddigital.com\n\n\n\n\n\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nNode.Js\nNodeMongoDB",
    "company": "Randstad",
    "companyLogo": "NA",
    "location": "Chennai",
    "experience": "6 - 11 years",
    "salary": "Not Disclosed",
    "posted": "1 day ago",
    "openings": "1",
    "applicants": "50+",
    "aboutCompany": "NA",
    "keySkills": [
      "Node.Js",
      "Node.Js",
      "Node",
      "Node",
      "MongoDB",
      "MongoDB"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-c2h-opportunity-chennai-bangalore-randstad-chennai-bengaluru-6-to-11-years-150925001760",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.428Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.447Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.447Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b344"
    },
    "title": "Node Js Developer",
    "description": "Job description\n\nRole :- Node Js AWS Developer\n\nExperience :- 5 to 12\n\nLocation :- Pune, Chennai\n\nNotice Period :- 0 to 30 Days Max.\n\n\n\n\nPlease find the Job Description :-\n\nAdvanced proficiency in REST API development, with expertise in Node.js (mandatory) and Python (preferred)\nStrong background in CI/CD methodologies utilizing GitLab and GitHub Actions\nHands-on experience with serverless frameworks, including Serverless and AWS SAM\nProficient in using serverless services such as Lambda, DynamoDB, and API Gateway\nExperience working with Docker containers and container orchestration (ECS/ECR)\nFamiliarity with event-driven architectures, including DynamoDB Streams, SQS, and Kinesis\nSkilled in utilizing API debugging tools such as Postman, Insomnia, CloudWatch, and Dynatrace\nAdaptable to diverse roles and responsibilities within fast-paced, evolving environments\n\nOther Considerations\n\nExperience and skills in solution design are preferred\nPrior exposure to AWS Cloud, Terraform, and DynamoDB is advantageous\nExperience with cloud-native and serverless technologies is desirable\nKnowledge of UI technologiesincluding React, JavaScript, and TypeScript—is a plus, but not required\nRole: Software Development - Other\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nNode.JsAWS\nRest Api DevelopmentPython",
    "company": "Ltimindtree",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "5 - 10 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "5",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Node.Js",
      "Node.Js",
      "AWS",
      "AWS",
      "Rest Api Development",
      "Rest Api Development",
      "Python",
      "Python"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-ltimindtree-pune-chennai-5-to-10-years-080925008699",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.487Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.489Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.489Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b345"
    },
    "title": "Node JS Developer",
    "description": "Job description\nWe are looking for a Node.js Developer who will be responsible for implementing web services. Your primary focus will be the development of all backend components, definition and maintenance of databases, and ensuring high performance and responsiveness to requests from the front-end.\n\n\n\nRequirements\nRoles and Responsibilities\n\nDesign, build and maintain high performance, reusable, and reliable code\n\nStrong experience of building RESTful APIs with Express or Express-based frameworks\n\nIntegration of data storage solutions which can include databases, key-value stores,blob stores, etc\n\nImplementation of security and data protection\n\nUnit-test the code components; document the code and the functionality while collaborating with other team members\n\nDefine code architecture decisions to support a high-performance and scalable product\n\nUnit-test code for robustness, usability, and general reliability\n\nIdentify and correct bottlenecks and fix bugs\n\n\n\nTechnical Skills\n\nGood object-oriented software design principles\n\nStrong understanding and hands-on experience of JavaScript\n\nStrong experience in Node.js and Express and NestJs or any of the Express-based frameworks\n\nUnderstanding of database schema design, modeling, and ORMs\n\nHands-on experience with at least 1 SQL and NoSQL DB like Postgres or MongoDB\n\nExperience in integrating 3rd party SDKs, APIs & libraries in Express applications\n\nProficient understanding of Gi t\n\n\n\nRole: Full Stack Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Permanent\nRole Category: Software Development\nEducation\nUG: Any Graduate\nPG: Any Postgraduate\nKey Skills\nSoftware designBackendFront endNoSQLHP data protectorSchemaJavascriptMongoDBUnit testingSQL\nReport this job\nInappropriate Content\nIncomplete information about job / company\nFake job / Non-recruitment related job / Scam\nDuplicate of another job on the site\nIncorrect Email ID\nPhone number not contactable\nExpired job / Job is not active\nOther\n500/500 Characters left\nSubmit",
    "company": "Coditas Technologies",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "3 - 6 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Software design",
      "Software design",
      "Backend",
      "Backend",
      "Front end",
      "Front end",
      "NoSQL",
      "NoSQL",
      "HP data protector",
      "HP data protector",
      "Schema",
      "Schema",
      "Javascript",
      "Javascript",
      "MongoDB",
      "MongoDB",
      "Unit testing",
      "Unit testing",
      "SQL",
      "SQL"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-coditas-technologies-pvt-ltd-pune-3-to-6-years-040925502303",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.500Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.502Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.502Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b346"
    },
    "title": "Node Js Developer",
    "description": "Job description\n\nHiring for Node Js Developer with experience range 7 years & above\n\nMandatory skills-Node Js, GraphQL\n\nEducation: BE/B.Tech/MCA/M.Tech/MSc./MS\n\nLocation-Pune,BLR,Chennai,Noida,Gurgaon , hyderabad\n\nRole: IT & Information Security - Other\nIndustry Type: IT Services & Consulting\nDepartment: IT & Information Security\nEmployment Type: Full Time, Permanent\nRole Category: IT & Information Security - Other\nEducation\nUG: B.Sc in Any Specialization, B.Tech/B.E. in Any Specialization, BCA in Any Specialization\nPG: MCA in Any Specialization, M.Tech in Any Specialization, MS/M.Sc(Science) in Any Specialization\n\nread more\n\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nGraphqlNode.Js\nTypescript",
    "company": "Infosys",
    "companyLogo": "NA",
    "location": "Pune",
    "experience": "7 - 10 years",
    "salary": "Not Disclosed",
    "posted": "1 week ago",
    "openings": "999",
    "applicants": "100+",
    "aboutCompany": "NA",
    "keySkills": [
      "Graphql",
      "Graphql",
      "Node.Js",
      "Node.Js",
      "Typescript",
      "Typescript"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-infosys-pune-chennai-bengaluru-7-to-10-years-030925032721",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.518Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.518Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.518Z"
    },
    "isDeleted": false
  },
  {
    "_id": {
      "$oid": "68c8f3c9c417b2535c57b347"
    },
    "title": "Node Js Developer",
    "description": "Job description\n\nThe candidate will have expertise in Node.js, MongoDB, Mongoose and Amazon services. Experience in OTT Digital Content Delivery is a plus. This is a hybrid work model with day shifts and no travel required.\n\n\n\n\nRequired Skills: Node js, Amazon services , MongoDB (Mongoose)\n\nNice to have skills : Typescript, Typegoose, Java, microservices, Mongo Atlas Search\n\nRole: Back End Developer\nIndustry Type: IT Services & Consulting\nDepartment: Engineering - Software & QA\nEmployment Type: Full Time, Temporary/Contractual\nRole Category: Software Development\nEducation\nUG: Any Graduate\nKey Skills\nSkills highlighted with ‘‘ are preferred keyskills\nNode.JsMongoDBAWS",
    "company": "MNC",
    "companyLogo": "NA",
    "location": "Hyderabad",
    "experience": "5 - 10 years",
    "salary": "10-20 Lacs P.A.",
    "posted": "2 weeks ago",
    "openings": "1",
    "applicants": "100+",
    "aboutCompany": "<p> </p><p>CloudXtreme Technology Private Ltd</p><br><p><u>https://www.cloudxtreme.com/</u></p>",
    "keySkills": [
      "Node.Js",
      "Node.Js",
      "MongoDB",
      "MongoDB",
      "AWS",
      "AWS"
    ],
    "redirectUrl": "https://www.naukri.com/job-listings-node-js-developer-cloudxtreme-hyderabad-pune-delhi-ncr-5-to-10-years-020925011108",
    "scrappedAt": {
      "$date": "2025-09-16T05:21:13.532Z"
    },
    "createdAt": {
      "$date": "2025-09-16T05:21:13.533Z"
    },
    "updatedAt": {
      "$date": "2025-09-16T05:21:13.533Z"
    },
    "isDeleted": false
  }]

  constructor(
    @repository(JobsRepository)
    public jobsRepository: JobsRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ResumeRepository)
    public resumeRepository: ResumeRepository,
    @repository(SavedJobsUsersLinkRepository)
    public savedJobsUsersLinkRepository: SavedJobsUsersLinkRepository,
    @inject('service.jwt.service')
    public jwtService: JWTService,
  ) { }

  // fetching token from header and returning userProfile...
  private async validateCredentials(authHeader: string) {
    try {
      if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
          throw new HttpErrors.BadRequest('Verify token! incorrect signature');
        }
        const token = parts[1];
        const userProfile = await this.jwtService.verifyToken(token);

        return userProfile
      }
    } catch (error) {
      throw error;
    }
  }

  // Add bulk jobs ==> for adding data
  @post("/add-bulk-jobs")
  async addJobs(): Promise<{ success: boolean; message: string; }> {
    const newData = this.jobsData.map((job) => ({
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      applicants: job.applicants,
      openings: job.openings,
      jobType: "Full Time, Permanent",
      salaryRange: job.salary,
      experience: job.experience,
      skillRequirements: job.keySkills,
      description: job.description,
      redirectUrl: job.redirectUrl,
      postedAt: new Date(),
      isAsync: false,
      isDeleted: false
    }));

    await this.jobsRepository.createAll(newData);

    return {
      message: "Jobs Added successfully",
      success: true
    }
  }

  // Store to yashwants db
  @post("/post-job")
  async postJobTo(): Promise<{ success: boolean; message: string; count: number }> {
    const jobs = await this.jobsRepository.find();
    let count = 0;
    if (jobs.length > 0) {
      for (const job of jobs) {
        const jobObject = {
          job_id: job.id?.toString(),
          title: job.jobTitle,
          company: job.company,
          Location: job.location,
          Description: job.description,
          Skills: job.skillRequirements,
          Salary: job.salaryRange,
          "Experience Range": job.experience,
          Job_Type: job.jobType,
          Posted_Date: job.postedAt,
          RedirectURL: job.redirectUrl,
        };

        console.log('job object', jobObject);
        try {
          const apiResponse = await axios.post(
            "http://164.52.221.77:7483/api/jd/process",
            jobObject,
            {
              headers: {
                "X-apiKey": "2472118222258182",
              },
            }
          );
          console.log(`✅ Job ${job.id} posted successfully`, apiResponse.data);

          await this.jobsRepository.updateById(job.id, { isAsync: true });
          count = count + 1;
        } catch (error) {
          // console.error(`❌ Failed to post job ${job.id}:`, error.message);
          continue;
        }
      }
    }

    return ({
      success: true,
      message: "Jobs posted to yashwants api",
      count: count
    })
  }

  @post('/jobs')
  @response(200, {
    description: 'Jobs model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Jobs) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Jobs, {
            title: 'NewJobs',
            exclude: ['id'],
          }),
        },
      },
    })
    jobs: Omit<Jobs, 'id'>,
  ): Promise<Jobs> {
    return this.jobsRepository.create(jobs);
  }

  @get('/jobs/count')
  @response(200, {
    description: 'Jobs model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Jobs) where?: Where<Jobs>,
  ): Promise<Count> {
    return this.jobsRepository.count(where);
  }

  @get('/jobs')
  @response(200, {
    description: 'Array of Jobs model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Jobs, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @inject(RestBindings.Http.REQUEST) request: Request,
    @param.filter(Jobs) filter?: Filter<Jobs>,
  ): Promise<(Jobs & { isSaved?: boolean })[]> {
    try {
      const jobs: any = await this.jobsRepository.find(filter);
      // current User profile
      let currentUser: any = null;
      const authHeader = request.headers.authorization;

      if (authHeader && authHeader !== '' && authHeader !== null && authHeader !== undefined && authHeader !== 'Bearer') {
        currentUser = await this.validateCredentials(authHeader);
      }

      let user: any = null;

      if (currentUser) {
        user = await this.userRepository.findById(currentUser.id);
      };

      if (!user) {
        return jobs;
      }

      // Add isSaved & isApplied flags
      const newJobs: (Jobs & { isSaved?: boolean; isApplied?: boolean })[] = [];

      for (const job of jobs) {
        const link = await this.savedJobsUsersLinkRepository.findOne({
          where: { and: [{ jobsId: job.id }, { userId: user.id }] },
        });

        newJobs.push({
          ...job,
          isSaved: !!link?.isSaved,
          isApplied: !!link?.isApplied,
        });
      }

      return newJobs;

    } catch (error) {
      throw error;
    }
  }

  @patch('/jobs')
  @response(200, {
    description: 'Jobs PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Jobs, { partial: true }),
        },
      },
    })
    jobs: Jobs,
    @param.where(Jobs) where?: Where<Jobs>,
  ): Promise<Count> {
    return this.jobsRepository.updateAll(jobs, where);
  }

  @get('/jobs/{id}')
  @response(200, {
    description: 'Jobs model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Jobs, { includeRelations: true }),
      },
    },
  })
  async findById(
    @inject(RestBindings.Http.REQUEST) request: Request,
    @param.path.number('id') id: number,
    @param.filter(Jobs, { exclude: 'where' }) filter?: FilterExcludingWhere<Jobs>
  ): Promise<{ data: Jobs, matchScore: number | null, isSaved: boolean }> {
    const job = await this.jobsRepository.findById(id, filter);

    // current User profile
    let currentUser: any = null;
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader !== '' && authHeader !== null && authHeader !== undefined && authHeader !== 'Bearer') {
      currentUser = await this.validateCredentials(authHeader);
    }

    let user: any = null;
    let resume: any = null;

    if (currentUser) {
      user = await this.userRepository.findById(currentUser.id);
      resume = await this.resumeRepository.findOne({ where: { userId: user.id } });
    }

    if (job && user && resume) {
      const apiData = {
        resume_id: resume?.id?.toString(),
        job_id: job?.id?.toString(),
        job_boost: false
      };

      console.log(`${process.env.SERVER_URL}/api/job_boost/job_match_insights`);
      const apiResponse = await axios.post(`${process.env.SERVER_URL}/api/job_boost/job_match_insights`,
        apiData,
        {
          headers: {
            "X-apiKey": "2472118222258182",
          }
        }
      );

      const savedJob = await this.savedJobsUsersLinkRepository.findOne({
        where: { and: [{ jobsId: job.id }, { userId: user.id }] },
      });

      if (apiResponse.data) {
        return {
          data: job,
          matchScore: apiResponse?.data?.match_score,
          isSaved: !!savedJob,
        }
      } else {
        return {
          data: job,
          matchScore: null,
          isSaved: !!savedJob,
        }
      }
    }

    return {
      data: job,
      matchScore: null,
      isSaved: false
    }
  }

  @patch('/jobs/{id}')
  @response(204, {
    description: 'Jobs PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Jobs, { partial: true }),
        },
      },
    })
    jobs: Jobs,
  ): Promise<void> {
    await this.jobsRepository.updateById(id, jobs);
  }

  @put('/jobs/{id}')
  @response(204, {
    description: 'Jobs PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() jobs: Jobs,
  ): Promise<void> {
    await this.jobsRepository.replaceById(id, jobs);
  }

  @del('/jobs/{id}')
  @response(204, {
    description: 'Jobs DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.jobsRepository.deleteById(id);
  }

  // similar jobs
  @post('/jobs/similar-jobs')
  async fetchSimilarJobs(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              jobId: {
                type: 'number',
              },
              limit: {
                type: 'number'
              },
            }
          }
        }
      }
    })
    data: {
      jobId: number;
      limit: number;
    }
  ): Promise<{ success: boolean; message: string; data: Jobs[] }> {
    try {
      const job = await this.jobsRepository.findById(data.jobId);

      if (!job) {
        throw new HttpErrors.NotFound(`Job with Id ${data.jobId} not found`);
      }

      const apiData = {
        jd_id: job?.id?.toString(),
        limit: data.limit ? data.limit : 10
      };

      const apiResponse = await axios.post(`${process.env.SERVER_URL}/api/jd/similar_jobs`,
        apiData,
        {
          headers: {
            "X-apiKey": "2472118222258182",
          }
        }
      );

      if (apiResponse && apiResponse.data) {
        const similarJobsIds = apiResponse.data.similar_job_ids ? apiResponse.data.similar_job_ids : [];
        const jobs = await this.jobsRepository.find({ where: { id: { inq: similarJobsIds } } });

        return {
          success: true,
          message: "Similar jobs",
          data: jobs
        }
      }

      return {
        success: false,
        message: "Failed to get similar jobs",
        data: []
      }
    } catch (error) {
      throw error;
    }
  }

  // job-boost-insights
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @post('/jobs/job-boost')
  async getJobBoostData(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              jobId: {
                type: 'number',
              },
              resumeId: {
                type: 'number',
              }
            }
          }
        }
      }
    })
    data: {
      jobId: number;
      resumeId: number;
    }
  ): Promise<{ success: boolean; message: string; data: object | null }> {
    try {
      const job = await this.jobsRepository.findById(data.jobId);

      if (!job) {
        throw new HttpErrors[404](`Job not found with Id ${data.jobId}`);
      }

      const resume = await this.resumeRepository.findById(data.resumeId);

      if (!resume) {
        throw new HttpErrors[404](`Resume not found with Id ${data.resumeId}`);
      }

      if (resume && resume.userId !== Number(currentUser.id)) {
        throw new HttpErrors.Unauthorized(`Given Resume Id is not of login user`);
      }

      if (job && resume) {
        const apiData = {
          resume_id: resume?.id?.toString(),
          job_id: job?.id?.toString(),
          job_boost: true
        }

        const apiResponse = await axios.post(`${process.env.SERVER_URL}/api/job_boost/job_match_insights`,
          apiData,
          {
            headers: {
              "X-apiKey": "2472118222258182",
            }
          }
        );

        if (apiResponse.data) {
          return {
            success: true,
            message: "Job boost data",
            data: apiResponse.data
          }
        } else {
          return {
            success: false,
            message: "Failed to get job boost data",
            data: null
          }
        }
      }

      return {
        success: false,
        message: "Failed to get job boost data",
        data: null
      }
    } catch (error) {
      throw error;
    }
  }

  // job-boost-company-statistical-data
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @post('/jobs/job-boost-statistical-data/{id}')
  async fetchJobBoostStatisticalData(
    @param.path.number('id') jobId: number,
  ): Promise<{ success: boolean; message: string; data: object | null }> {
    try {
      const job = await this.jobsRepository.findById(jobId);

      if (!job) {
        throw new HttpErrors[404](`Job with Id ${jobId} not found`);
      }

      const apiData = {
        job_title: job.jobTitle,
        company_name: job.company
      }

      const apiResponse = await axios.post(`${process.env.SERVER_URL}/api/job_boost/company_benchmark`,
        apiData,
        {
          headers: {
            "X-apiKey": "2472118222258182",
          }
        }
      );

      if (apiResponse.data) {
        return {
          success: true,
          message: "Job boost statistical data",
          data: apiResponse.data
        }
      }

      return {
        success: false,
        message: "Failed to get job boost statistical data",
        data: null
      }
    } catch (error) {
      throw error;
    }
  }

  // saved job
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @post('/jobs/save-job/{id}')
  async saveJob(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.number('id') jobId: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const job = await this.jobsRepository.findById(jobId);
      if (!job) {
        throw new HttpErrors.NotFound(`Job with Id ${jobId} not found`);
      }

      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.NotFound(`User with Id ${currentUser.id} not found`);
      }

      const existingLink = await this.savedJobsUsersLinkRepository.findOne({
        where: { userId: user.id, jobsId: jobId },
      });

      if (existingLink) {
        // toggle saved flag
        await this.savedJobsUsersLinkRepository.updateById(existingLink.id, {
          isSaved: !existingLink.isSaved,
          updatedAt: new Date(),
        });
        return { success: true, message: existingLink.isSaved ? 'Job unsaved successfully' : 'Job saved successfully' };
      } else {
        await this.savedJobsUsersLinkRepository.create({
          userId: user.id,
          jobsId: jobId,
          isSaved: true,
          isApplied: false,
        });
        return { success: true, message: 'Job saved successfully' };
      }
    } catch (error) {
      throw error;
    }
  }

  // applied job
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @post('/jobs/apply-job/{id}')
  async appliedJob(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.number('id') jobId: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const job = await this.jobsRepository.findById(jobId);
      if (!job) {
        throw new HttpErrors.NotFound(`Job with Id ${jobId} not found`);
      }

      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.NotFound(`User with Id ${currentUser.id} not found`);
      }

      const existingLink = await this.savedJobsUsersLinkRepository.findOne({
        where: { userId: user.id, jobsId: jobId },
      });

      if (existingLink) {
        if (existingLink.isApplied) {
          return { success: false, message: 'Already applied to this job' };
        }
        await this.savedJobsUsersLinkRepository.updateById(existingLink.id, {
          isApplied: true,
          updatedAt: new Date(),
        });
        return { success: true, message: 'Job applied successfully' };
      } else {
        await this.savedJobsUsersLinkRepository.create({
          userId: user.id,
          jobsId: jobId,
          isSaved: false,
          isApplied: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { success: true, message: 'Job applied successfully' };
      }
    } catch (error) {
      throw error;
    }
  }

  // saved jobs
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @post('/jobs/saved-jobs')
  async getSavedJobs(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
  ): Promise<{ success: boolean; message: string; savedJobs: object[] }> {
    try {
      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.NotFound(`User with Id ${currentUser.id} not found`);
      }

      const links = await this.savedJobsUsersLinkRepository.find({
        where: { userId: user.id, isSaved: true },
      });

      const jobs: object[] = [];
      for (const link of links) {
        const job = await this.jobsRepository.findById(link.jobsId);
        jobs.push({
          ...job,
          isSaved: link.isSaved,
          isApplied: link.isApplied,
        });
      }

      return { success: true, message: 'Saved jobs', savedJobs: jobs };
    } catch (error) {
      throw error;
    }
  }

  // applied jobs
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @post('/jobs/applied-jobs')
  async getAppliedJobs(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
  ): Promise<{ success: boolean; message: string; appliedJobs: object[] }> {
    try {
      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.NotFound(`User with Id ${currentUser.id} not found`);
      }

      const links = await this.savedJobsUsersLinkRepository.find({
        where: { userId: user.id, isApplied: true },
      });

      const jobs: object[] = [];
      for (const link of links) {
        const job = await this.jobsRepository.findById(link.jobsId);
        jobs.push({
          ...job,
          isSaved: link.isSaved,
          isApplied: link.isApplied,
        });
      }

      return { success: true, message: 'Applied jobs', appliedJobs: jobs };
    } catch (error) {
      throw error;
    }
  }
}
