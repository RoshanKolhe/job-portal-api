import { get, HttpErrors, param, post, requestBody } from "@loopback/rest";

export interface Job {
  job_id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo_url: string;
    location: string;
  };
  employment_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | string;
  posted_date: string; 
  application_count: number;
  tags: string[];
  description: string;
  requirements: string[];
  matching_score: {
    percentage: number;
    label: string;
    keywords_matched: string[];
    feedback: string;
  };
  cta: {
    button_text: string;
    application_url: string;
  };
}

export class JobsController {
  constructor() {}
  
   // Jobs dummy json
  public jobs: Job[] = [
    {
      job_id: "job_239x13",
      title: "Data Scientist",
      company: {
        id: "cmp_9382",
        name: "Polygon Technology",
        logo_url: "https://cdn.altiv.ai/logos/polygon.png",
        location: "Mumbai, India"
      },
      employment_type: "Full-time",
      posted_date: "2025-06-20",
      application_count: 124,
      tags: ["ML", "Remote", "Full-time"],
      description: "<p>We’re looking for a data scientist to build and improve ML models for our decentralized platform.</p>",
      requirements: [
        "3+ years of experience with Python and SQL",
        "Hands-on with ML pipelines",
        "Good knowledge of data visualization tools"
      ],
      matching_score: {
        percentage: 75,
        label: "You have the matching keywords",
        keywords_matched: ["Machine Learning", "Data Analysis", "Python", "SQL"],
        feedback: "Your resume aligns well with this job"
      },
      cta: {
        button_text: "Apply now",
        application_url: "https://jobs.altiv.ai/apply/job_239x13"
      }
    },
    {
      job_id: "job_101fhd",
      title: "Frontend Engineer",
      company: {
        id: "cmp_1120",
        name: "Zerodha",
        logo_url: "https://cdn.altiv.ai/logos/zerodha.png",
        location: "Bangalore, India"
      },
      employment_type: "Full-time",
      posted_date: "2025-06-18",
      application_count: 98,
      tags: ["React", "JavaScript", "UI/UX"],
      description: "<p>Join our frontend team to create intuitive user experiences and lightning-fast interfaces.</p>",
      requirements: [
        "2+ years of experience with React and Redux",
        "Deep understanding of HTML/CSS/JS",
        "Experience with RESTful APIs"
      ],
      matching_score: {
        percentage: 82,
        label: "Great UI development match",
        keywords_matched: ["React", "JavaScript", "Redux"],
        feedback: "You are a strong match for frontend roles"
      },
      cta: {
        button_text: "Apply now",
        application_url: "https://jobs.altiv.ai/apply/job_101fhd"
      }
    },
    {
      job_id: "job_492jfd",
      title: "Backend Developer",
      company: {
        id: "cmp_3119",
        name: "Razorpay",
        logo_url: "https://cdn.altiv.ai/logos/razorpay.png",
        location: "Remote"
      },
      employment_type: "Full-time",
      posted_date: "2025-06-15",
      application_count: 142,
      tags: ["Node.js", "MongoDB", "REST APIs"],
      description: "<p>Design and build scalable backend APIs for our core payment systems.</p>",
      requirements: [
        "Expertise in Node.js and Express",
        "Experience with MongoDB/PostgreSQL",
        "Strong knowledge of REST architecture"
      ],
      matching_score: {
        percentage: 78,
        label: "Backend tech stack match",
        keywords_matched: ["Node.js", "MongoDB", "APIs"],
        feedback: "Solid backend engineering profile"
      },
      cta: {
        button_text: "Apply now",
        application_url: "https://jobs.altiv.ai/apply/job_492jfd"
      }
    },
    {
      job_id: "job_58sdkl",
      title: "DevOps Engineer",
      company: {
        id: "cmp_2901",
        name: "Freshworks",
        logo_url: "https://cdn.altiv.ai/logos/freshworks.png",
        location: "Chennai, India"
      },
      employment_type: "Full-time",
      posted_date: "2025-06-14",
      application_count: 75,
      tags: ["DevOps", "AWS", "CI/CD"],
      description: "<p>Automate infrastructure and ensure high availability for our product deployments.</p>",
      requirements: [
        "3+ years working with AWS and Docker",
        "Experience with Jenkins/GitHub Actions",
        "Knowledge of Kubernetes"
      ],
      matching_score: {
        percentage: 74,
        label: "Infrastructure experience match",
        keywords_matched: ["AWS", "CI/CD", "Docker"],
        feedback: "Your experience suits our infra needs"
      },
      cta: {
        button_text: "Apply now",
        application_url: "https://jobs.altiv.ai/apply/job_58sdkl"
      }
    },
    {
      job_id: "job_993lds",
      title: "Mobile Developer (React Native)",
      company: {
        id: "cmp_1582",
        name: "CRED",
        logo_url: "https://cdn.altiv.ai/logos/cred.png",
        location: "Bangalore, India"
      },
      employment_type: "Full-time",
      posted_date: "2025-06-12",
      application_count: 61,
      tags: ["React Native", "Mobile", "Cross-platform"],
      description: "<p>Build cross-platform applications for a fintech ecosystem loved by millions.</p>",
      requirements: [
        "2+ years using React Native",
        "Experience with app store deployment",
        "Redux & React Hooks knowledge"
      ],
      matching_score: {
        percentage: 79,
        label: "Strong mobile dev match",
        keywords_matched: ["React Native", "Redux", "Mobile"],
        feedback: "Mobile experience looks good"
      },
      cta: {
        button_text: "Apply now",
        application_url: "https://jobs.altiv.ai/apply/job_993lds"
      }
    },
    {
      job_id: "job_004bgd",
      title: "Full Stack Engineer",
      company: {
        id: "cmp_2023",
        name: "InVideo",
        logo_url: "https://cdn.altiv.ai/logos/invideo.png",
        location: "Remote"
      },
      employment_type: "Contract",
      posted_date: "2025-06-10",
      application_count: 88,
      tags: ["Full Stack", "JavaScript", "MongoDB"],
      description: "<p>Contribute to both frontend and backend of our dynamic video editor platform.</p>",
      requirements: [
        "React + Node.js full-stack experience",
        "MongoDB/PostgreSQL proficiency",
        "Understanding of async programming"
      ],
      matching_score: {
        percentage: 76,
        label: "Full stack profile fit",
        keywords_matched: ["JavaScript", "Node.js", "React"],
        feedback: "Your stack matches ours"
      },
      cta: {
        button_text: "Apply now",
        application_url: "https://jobs.altiv.ai/apply/job_004bgd"
      }
    },
    {
      job_id: "job_872jah",
      title: "AI Research Engineer",
      company: {
        id: "cmp_3245",
        name: "Turing",
        logo_url: "https://cdn.altiv.ai/logos/turing.png",
        location: "Remote"
      },
      employment_type: "Full-time",
      posted_date: "2025-06-08",
      application_count: 54,
      tags: ["AI", "Python", "Deep Learning"],
      description: "<p>Research and develop AI models that enhance our coding assistant tools.</p>",
      requirements: [
        "Strong foundation in AI/ML algorithms",
        "TensorFlow/PyTorch experience",
        "Ability to publish and prototype"
      ],
      matching_score: {
        percentage: 85,
        label: "Strong match in AI stack",
        keywords_matched: ["Deep Learning", "ML", "Python"],
        feedback: "Very relevant AI profile"
      },
      cta: {
        button_text: "Apply now",
        application_url: "https://jobs.altiv.ai/apply/job_872jah"
      }
    },
    {
      job_id: "job_518jkn",
      title: "UI/UX Designer",
      company: {
        id: "cmp_7511",
        name: "Figma",
        logo_url: "https://cdn.altiv.ai/logos/figma.png",
        location: "San Francisco, USA"
      },
      employment_type: "Full-time",
      posted_date: "2025-06-07",
      application_count: 70,
      tags: ["Design", "Figma", "UX"],
      description: "<p>Craft delightful user experiences for design collaboration software.</p>",
      requirements: [
        "Figma mastery",
        "Portfolio of user-centric designs",
        "Knowledge of user psychology"
      ],
      matching_score: {
        percentage: 81,
        label: "Design skills matched",
        keywords_matched: ["Figma", "UI", "UX"],
        feedback: "Creative and user-first design portfolio"
      },
      cta: {
        button_text: "Apply now",
        application_url: "https://jobs.altiv.ai/apply/job_518jkn"
      }
    },
    {
      job_id: "job_632hfd",
      title: "Cloud Security Analyst",
      company: {
        id: "cmp_4302",
        name: "Google Cloud",
        logo_url: "https://cdn.altiv.ai/logos/google.png",
        location: "Hyderabad, India"
      },
      employment_type: "Full-time",
      posted_date: "2025-06-06",
      application_count: 39,
      tags: ["Security", "Cloud", "Audit"],
      description: "<p>Ensure data and infrastructure security across multi-cloud environments.</p>",
      requirements: [
        "Familiarity with GCP/AWS security features",
        "Experience conducting security audits",
        "Knowledge of zero-trust principles"
      ],
      matching_score: {
        percentage: 74,
        label: "Security domain match",
        keywords_matched: ["Security", "Cloud", "Audit"],
        feedback: "Your profile fits cloud compliance needs"
      },
      cta: {
        button_text: "Apply now",
        application_url: "https://jobs.altiv.ai/apply/job_632hfd"
      }
    },
    {
      job_id: "job_911xdf",
      title: "Product Manager",
      company: {
        id: "cmp_8876",
        name: "Notion",
        logo_url: "https://cdn.altiv.ai/logos/notion.png",
        location: "Remote"
      },
      employment_type: "Full-time",
      posted_date: "2025-06-05",
      application_count: 52,
      tags: ["Product", "Roadmap", "Leadership"],
      description: "<p>Lead product strategy and execution for collaborative productivity tools.</p>",
      requirements: [
        "3+ years in product management",
        "Experience with agile methodologies",
        "Strong user empathy and communication"
      ],
      matching_score: {
        percentage: 77,
        label: "Product experience matched",
        keywords_matched: ["Product", "User Stories", "Agile"],
        feedback: "Leadership and vision match well"
      },
      cta: {
        button_text: "Apply now",
        application_url: "https://jobs.altiv.ai/apply/job_911xdf"
      }
    }
  ];

  // Job boost dummy json
  public jobsBoost: object[] = [
    // dummy objects
  ];

  // Career Compass dummy json
  public careerCompassWithYears: object[] = [
    // dummy objects
  ];


  // Job detailed by id...
  @get('/jobs/{id}')
  async fetchJobById(
    @param.path.string('id') id: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: Job
  }>{
    try{
      const job = this.jobs.find((item) => item.job_id.trim().toLowerCase() === id.trim().toLowerCase());

      if(!job){
        throw new HttpErrors.NotFound(`Job with id ${id} not found`);
      }

      return{
        success: true,
        message: 'Job Details',
        data: job
      }
    }catch(error){
      throw error;
    }
  }

  // Job list with pagination...



  // career compass



  // Jobs Boost
  @post('/jobs/jobs-match-insight')
  async fechJobMatchInsight(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              resumeId: {type: 'number'},
              jobId: {type: 'string'},
            },
            required: ['resumeId, jobId']
          }
        }
      }
    })
    requestBody : {
      resumeId: number;
      jobId: string;
    }
  ): Promise<{
    success: boolean; 
    message: string; 
    data: object}>{
      try{
        console.log(requestBody.resumeId, requestBody.jobId);
        // randomly return any object from job boost array;

        return{
          success: true,
          message: 'job match insights',
          data: {}
        }
      }catch(error){
        throw error;
      }
    }
}
