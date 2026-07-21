/*
  FAMILY PERSONAL DEVELOPMENT — AI CREATIONS CONTENT

  HOW TO ADD A NEW CREATION
  1. Copy one object inside the creations array.
  2. Change its information.
  3. Add a screenshot/image to this folder (optional) and enter its file path.

  Only this file normally needs to be edited when adding gallery items.
*/

window.FAMILY_PD_AI_CREATIONS = {
  /* Change this one URL only if the FamilyPD AI page uses another folder. */
  familyPdAiUrl: "../ai/",

  categories: [
    { id: "all", label: "All Creations" },
    { id: "images", label: "Images" },
    { id: "webpages", label: "Webpages" },
    { id: "prompts", label: "Prompts" },
    { id: "projects", label: "Project Help" },
    { id: "tutoring", label: "Tutoring" }
  ],

  creations: [
    {
      id: "hair-stylist-starter-site",
      category: "webpages",
      title: "Hair Stylist Starter Website",
      description: "A polished starter-page concept showing how a new stylist can present services, booking information, a gallery, and contact details.",
      audience: "Entrepreneurs",
      tags: ["Small business", "Web design", "Branding"],
      image: "",
      imageAlt: "Hair stylist website concept",
      link: "",
      linkLabel: "View Sample",
      prompt: "Create a welcoming, mobile-friendly website for a hair stylist who is just getting started. Include an introduction, services, a simple price guide, gallery placeholders, booking steps, policies, testimonials, and contact information. Use warm, modern styling and plain language."
    },
    {
      id: "family-goal-setting-prompt",
      category: "prompts",
      title: "Family Goal-Setting Prompt",
      description: "A reusable prompt that helps a household turn broad hopes into one realistic shared goal, clear roles, and weekly checkpoints.",
      audience: "Families",
      tags: ["Goals", "Planning", "Family meeting"],
      image: "",
      imageAlt: "Family goal-setting prompt example",
      link: "",
      linkLabel: "Open Resource",
      prompt: "Help our family turn this goal into a realistic 30-day plan: [INSERT GOAL]. Ask us one question at a time about what success looks like, who is involved, available time, possible obstacles, and support we need. Then create a simple weekly plan with shared responsibilities and a short family check-in agenda."
    },
    {
      id: "student-project-planner",
      category: "projects",
      title: "Student Project Planning Support",
      description: "An example of using AI to break a large assignment into manageable stages without completing the student's work for them.",
      audience: "Students & Families",
      tags: ["Organization", "School projects", "Time management"],
      image: "",
      imageAlt: "Student project planning example",
      link: "",
      linkLabel: "View Example",
      prompt: "Act as a project coach, not the person completing my assignment. My project is: [DESCRIBE PROJECT]. Help me identify the requirements, create milestones, estimate how long each step may take, plan what evidence I need, and build a checklist. Ask me to make the important decisions and explain any concept I do not understand."
    },
    {
      id: "one-question-at-a-time-tutor",
      category: "tutoring",
      title: "One-Question-at-a-Time Tutor",
      description: "A tutoring format that teaches first, checks understanding, adapts the difficulty, and explains mistakes without overwhelming the learner.",
      audience: "Learners of All Ages",
      tags: ["Tutoring", "Practice", "Feedback"],
      image: "",
      imageAlt: "AI tutoring conversation example",
      link: "",
      linkLabel: "See Tutoring Method",
      prompt: "Tutor me on [TOPIC] one question at a time. Begin with a brief explanation and a simple example. Then give me one practice question. If I am correct, say so and increase the difficulty slightly. If I am incorrect, explain exactly where my thinking went wrong, give a new example, and let me try again. Do not complete an entire assignment for me."
    },
    {
      id: "family-pd-social-graphic",
      category: "images",
      title: "FamilyPD Social Graphic",
      description: "A visual concept that turns a FamilyPD message into an engaging, shareable graphic for families and community partners.",
      audience: "Community",
      tags: ["Graphics", "Social media", "Outreach"],
      image: "",
      imageAlt: "FamilyPD social graphic example",
      link: "",
      linkLabel: "View Image",
      prompt: "Create a warm, hopeful social-media graphic for Family Personal Development. Show a diverse family learning, planning, and growing together. Keep the layout uncluttered and use very little text. Main message: Growth starts at home."
    }
  ]
};
