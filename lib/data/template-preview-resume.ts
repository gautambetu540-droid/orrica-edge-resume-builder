import { ResumeData } from '@/lib/types/resume';

/**
 * Filled, fictional resume used only for template-library previews.
 * This must never be used as the user's initial resume data.
 */
export const TEMPLATE_PREVIEW_RESUME: ResumeData = {
  personalInfo: {
    fullName: 'Alex Morgan',
    professionalTitle: 'Marketing Specialist',
    email: 'alex.morgan@email.com',
    phone: '+1 (555) 248-0198',
    city: 'New York, NY',
    country: 'United States',
    linkedin: 'linkedin.com/in/alexmorgan',
    portfolio: 'alexmorgan.com',
  },
  summary:
    'Results-driven marketing specialist with 6+ years of experience building integrated campaigns, growing digital engagement, and turning customer insights into measurable business results. Strong background in content strategy, paid media, lifecycle marketing, and cross-functional execution.',
  experience: [
    {
      id: 'preview-exp-1',
      company: 'Northstar Digital',
      jobTitle: 'Senior Marketing Specialist',
      location: 'New York, NY',
      startDate: '2022-03',
      endDate: '2025-06',
      currentlyWorking: false,
      responsibilities: 'Owned integrated campaigns across paid, organic, email, and partner channels.',
      achievements: [
        'Increased qualified inbound leads by 38% through segmented lifecycle campaigns and landing-page testing.',
        'Managed a $450K annual paid-media budget while improving cost per qualified lead by 24%.',
        'Partnered with sales and product teams to launch three go-to-market campaigns across North America.',
      ],
    },
    {
      id: 'preview-exp-2',
      company: 'Brightline Commerce',
      jobTitle: 'Marketing Coordinator',
      location: 'Brooklyn, NY',
      startDate: '2019-07',
      endDate: '2022-02',
      currentlyWorking: false,
      responsibilities: 'Supported campaign planning, content production, reporting, and marketing operations.',
      achievements: [
        'Raised email campaign engagement by 31% by redesigning audience segments and testing subject lines.',
        'Built weekly performance dashboards used by leadership to track pipeline and channel efficiency.',
        'Coordinated 20+ product launches and customer events with sales, design, and operations teams.',
      ],
    },
  ],
  education: [
    {
      id: 'preview-edu-1',
      institution: 'New York University',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Marketing & Communications',
      startDate: '2015-09',
      endDate: '2019-05',
      grade: '3.7 GPA',
      description: 'Coursework in consumer behavior, digital marketing, analytics, and brand strategy.',
    },
  ],
  skills: [
    { category: 'technical', items: ['Digital Marketing', 'Campaign Strategy', 'Marketing Analytics', 'SEO', 'Paid Media'] },
    { category: 'soft', items: ['Communication', 'Project Management', 'Stakeholder Management', 'Creative Problem Solving'] },
    { category: 'tools', items: ['Google Analytics', 'HubSpot', 'Salesforce', 'Google Ads', 'Figma'] },
    { category: 'languages', items: ['English', 'Spanish'] },
  ],
  projects: [
    {
      id: 'preview-project-1',
      name: 'Customer Lifecycle Revamp',
      role: 'Marketing Lead',
      description: 'Redesigned onboarding and retention journeys using behavioral segments and automated email sequences.',
      technologies: ['HubSpot', 'GA4', 'A/B Testing'],
      url: 'alexmorgan.com/lifecycle',
    },
    {
      id: 'preview-project-2',
      name: 'Q4 Growth Campaign',
      role: 'Campaign Strategist',
      description: 'Created an integrated acquisition campaign across paid search, social, content, and partnerships.',
      technologies: ['Google Ads', 'Meta Ads', 'Looker Studio'],
    },
  ],
  certifications: [
    { id: 'preview-cert-1', name: 'Google Analytics Certification', issuingOrganization: 'Google', issueDate: '2024-02' },
    { id: 'preview-cert-2', name: 'HubSpot Content Marketing', issuingOrganization: 'HubSpot Academy', issueDate: '2023-08' },
  ],
  languages: [
    { id: 'preview-lang-1', language: 'English', proficiency: 'native' },
    { id: 'preview-lang-2', language: 'Spanish', proficiency: 'professional' },
  ],
  achievements: [
    { id: 'preview-ach-1', type: 'achievement', title: 'Employee Excellence Award', description: 'Recognized for delivering a high-impact multi-channel growth campaign.', date: '2024-12' },
    { id: 'preview-ach-2', type: 'publication', title: 'Modern Lifecycle Marketing Playbook', description: 'Contributed an industry article on customer retention strategy.', date: '2023-10' },
  ],
  targetRole: 'Senior Marketing Specialist',
};
