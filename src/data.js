export const PROJECTS = [
  { id: '3d-ai-interviewer',     title: '3D AI Interviewer', cover: '/assets/images/projects/Covers/CrackAI.webp',  year: '2026', category: 'Web Application', tags: ['Llama 3.2 3B','Blender','Three.js'], github: 'https://github.com/Vivek-the-creator/3D-AI-INTERVIEWER', images: ['/assets/images/projects/CrackAI/image1.png','/assets/images/projects/CrackAI/image2.png','/assets/images/projects/CrackAI/image3.png', '/assets/images/projects/CrackAI/image4.png', '/assets/images/projects/CrackAI/image5.png', '/assets/images/projects/CrackAI/image6.png'], desc: 'An advanced, AI-driven recruitment platform designed to automate and enhance the interview process using 3D avatars, real-time response analysis, and multi-model interaction.' },
  { id: 'verve',         title: 'Verve', cover: '/assets/images/projects/Covers/Verve.webp', year: '2025', category: 'Mobile App',          tags: ['Flutter','Firebase'], github: 'https://github.com/Vivek-the-creator/Verve', images: ['/assets/images/projects/Verve/image1.jpg','/assets/images/projects/Verve/image2.jpg','/assets/images/projects/Verve/image3.jpg', '/assets/images/projects/Verve/image4.jpg', '/assets/images/projects/Verve/image5.webp'], desc: 'Verve is an AI-powered nutritional advisor designed to help manage chronic diseases like diabetes and hypertension. It delivers personalized meal plans, tracks progress, and offers condition-specific dietary insights to support healthier living through intelligent, tailored nutrition.' },
  { id: 'aurora-voices', title: 'Aurora Voices', cover: '/assets/images/projects/Covers/AuroraVoices.webp', year: '2026', category: 'Web Application',      tags: ['MongoDB', 'React.js','Express.js','Node.js'], github: 'https://github.com/Vivek-the-creator/AuroraVoices', images: ['/assets/images/projects/AuroraVoices/image1.png','/assets/images/projects/AuroraVoices/image2.png','/assets/images/projects/AuroraVoices/image3.png', '/assets/images/projects/AuroraVoices/image4.png', '/assets/images/projects/AuroraVoices/image5.png', '/assets/images/projects/AuroraVoices/image6.png', '/assets/images/projects/AuroraVoices/image7.png', '/assets/images/projects/AuroraVoices/image8.png'], desc: 'A modern, responsive blog application built with React.js and CSS. This application allows users to create, read, edit, and delete blog posts with a beautiful user interface.' },
  { id: 'cardiacare',        title: 'CardiaCare', cover: '/assets/images/projects/Covers/Cardiacare.webp', year: '2025', category: 'Web Application',      tags: ['CNN-LSTM','OCR-NLP','Flask'], github: 'https://github.com/Vivek-the-creator/Cardiacare', images: ['/assets/images/projects/Cardiacare/image1.png','/assets/images/projects/Cardiacare/image2.png','/assets/images/projects/Cardiacare/image3.png'], desc: "Cardioscope is an AI-powered ECG analysis platform with a modern web interface, real-time visualization, and multi-format input—providing smart measurements, BPM, and helpful doctor's notes" },
  { id: 'akshara-ai',       title: 'Akshara.AI', cover: '/assets/images/projects/Covers/AksharaAI.webp', year: '2026', category: 'Web Application',      tags: ['JavaScript','Python','MongoDB'], github: 'https://github.com/Vivek-the-creator/Akshara.AI', images: ['/assets/images/projects/AksharaAI/image1.png','/assets/images/projects/AksharaAI/image2.jpeg','/assets/images/projects/AksharaAI/image3.png','/assets/images/projects/AksharaAI/image4.png'], desc: 'Akshara.AI is an AI-powered learning platform that helps children improve language and communication skills through interactive activities and conversations. It creates a fun and personalized learning experience using speech, writing and storytelling.' },
  { id: 'ultracode-ai',   title: 'Ultracode AI', cover: '/assets/images/projects/Covers/UltracodeAI.webp', year: '2025', category: 'IntelliJ Extension', tags: ['Java','Multi-Model'], github: 'https://github.com/Vivek-the-creator/UltraCodeAI', images: ['/assets/images/projects/UltracodeAI/image1.png','/assets/images/projects/UltracodeAI/image2.png','/assets/images/projects/UltracodeAI/image3.png'], desc: 'UltraCodeAI is an IntelliJ IDEA plugin that embeds an AI coding copilot directly in the IDE with multi-model chat with streaming responses that can work offline.' },
  { id: 'oxocare',      title: 'Oxocare', cover: '/assets/images/projects/Covers/Oxocare.webp', year: '2025', category: 'Mobile App', tags: ['Kotlin','OCR','NLP'], github: 'https://github.com/Vivek-the-creator/OXOCARE', images: ['/assets/images/projects/oxocare/image2.png','/assets/images/projects/oxocare/image.png','/assets/images/projects/oxocare/image3.png'], desc: 'Oxocare is a smart OCR-powered Android app built to assist during medical emergencies and digitize medical documents with high accuracy, maintain records in an global patient database.' },
  { id: 'gazevoice',          title: 'GazeVoice', cover: '/assets/images/projects/Covers/Gazevoice.webp', year: '2025', category: 'Website',        tags: ['WebGazer.js','WebRTC','React.js'], github: 'https://github.com/Vivek-the-creator/GazeVoice',  images: ['/assets/images/projects/gazevoice/image.png'], desc: 'A browser-based assistive communication system that enables ALS patients to communicate using real-time eye gaze tracking via webcam. Designed to be low-cost, accessible, and hardware-free.' },
]

export const SKILLS = [
  { group: 'frontend',   label: 'Frontend',  items: ['React.js','Flutter','TypeScript','Three.js','Tailwind CSS'] },
  { group: 'backend',    label: 'Backend',   items: ['Python','Java','Django','Node.js'] },
  { group: 'ml/dl',   label: 'ML / DL',   items: ['TensorFlow','PyTorch','ScikitLearn','Yolo'] },
  { group: 'database',   label: 'Databases', items: ['Redis','MySQL','MongoDB','PostgreSQL (Supabase)'] },
  { group: 'tools',     label: 'Tools',     items: ['Git/GitHub','Canva','Figma','Docker'] },
]

export const INTERNSHIPS = [
  { 
    company: 'Cellstrat, Bengaluru', 
    role: 'AI Intern', 
    duration: '1 month', 
    year: 'Jul 2025', 
    img: '/assets/images/internships/cellstrat.jpg',
    experience: 'Worked on developing AI models for healthcare applications by implementing CNN-LSTM architectures for ECG abnormality detection from ECG reports / csv files and OCR-NLP pipelines for medical report summarization. Gained practical experience in deep learning, medical image analysis, natural language processing, and AI-driven healthcare solutions.'
  },
  { 
    company: 'Synapslogic, Coimbatore', 
    role: 'Full Stack Intern', 
    duration: '2 months', 
    year: 'Sep 2025', 
    img: '/assets/images/internships/synapslogic.jpg',
    experience: 'Contributed to the development of a confidential enterprise web application under a Non-Disclosure Agreement (NDA). Designed responsive frontend interfaces, integrated frontend components with backend APIs, and collaborated with the development team to deliver scalable, user-centric solutions.'
  },
  { 
    company: 'NIELIT, Calicut', 
    role: 'Research Intern', 
    duration: '1 month', 
    year: 'Dec 2025', 
    img: '/assets/images/internships/nielit.png',
    experience: 'Contributed to AI and computer vision research by developing Django-based applications and implementing YOLO models for object detection. Collaborated on building a pothole detection system, gaining hands-on experience in deep learning, image processing, and deploying AI-driven solutions.'
  },
]

export const CERTIFICATIONS = [
  { title: 'Claude with Google Vertex AI', img: '/assets/images/certifications/Claude with Google Vertex AI.png', issuer: 'Anthropic' },
  { title: 'DSA Bootcamp', img: '/assets/images/certifications/DSA Bootcamp.png', issuer: 'Unstop' },
  { title: 'Data Analytics Essentials', img: '/assets/images/certifications/Data Analytics Essentials.png', issuer: 'Cisco Networking Academy' },
  { title: 'Figma', img: '/assets/images/certifications/Figma.png', issuer: 'Simplilearn' },
  { title: 'Flutter Development', img: '/assets/images/certifications/Flutter.png', issuer: 'Udemy' },
  { title: 'Introduction to Modern AI', img: '/assets/images/certifications/Introduction to Modern AI.png', issuer: 'Cisco Networking Academy' },
  { title: 'MERN Stack Development', img: '/assets/images/certifications/MERN Stack.png', issuer: 'Udemy' },
  { title: 'RAG with MongoDB', img: '/assets/images/certifications/RAG with MongoDB.png', issuer: 'Credly' },
]

export const ARROW_SVG = `<svg style="width:1.25em;height:1.25em;vertical-align:-0.25em;" viewBox="0 0 84 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z"/></svg>`
