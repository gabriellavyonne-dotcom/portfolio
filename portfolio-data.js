// Edit this file to personalise the portfolio. Paths beginning with ./ are relative to index.html.
const portfolio = {
  photo: './assets/gabriella.jpeg', // Example: './assets/gabriella.jpg'
  email: 'gabriellavyonne022@gmail.com',
  github: 'https://github.com/gabriellavyonne-dotcom', // Optional. Leave blank if you want to keep your GitHub profile off the site.
  linkedin: '',
  resume: '', // Example: './assets/Gabriella-Vyonne-Resume.pdf'
  publicUrl: '', // Optional. Defaults to the address of the published page.
  bio: 'I’m Gabriella Vyonne, a software developer building my skills in frontend and backend development. I’m interested in turning requirements into clear workflows, with particular attention to how people move through an application and recover when something goes wrong. I take the same care with the code behind those decisions, keeping it structured so features can be tested, maintained, and extended as requirements evolve.',
  skills: ['Python', 'JavaScript', 'Git', 'PHP', 'Supabase', 'MySQL'],
  currentlyLearning: 'Building REST APIs with FastAPI, with a focus on request validation and endpoint testing.',
  projects: [
    {
      title: 'MUFLO Properties',
      summary: 'MUFLO Properties is a real estate website that showcases residential developments in Kenya. Prospective buyers can browse available homes by development phase, view property galleries, and submit enquiries or feedback. An admin dashboard allows staff to manage listings and update property photos as availability changes.',
      stack: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite', 'Supabase', 'Netlify'],
      image: './assets/muflo-properties.png',
      imageAlt: 'MUFLO Properties homepage showing featured property lising',
      demo: 'https://muflo-properties.netlify.app/'
    },
    {
      title: 'KURASA Bookstore',
      summary: 'KURASA Bookstore is a digital storefront designed around the experience of discovering books. Its layout keeps the collection at the centre of the browsing experience, giving visitors space to explore titles and find books that match their interests. The project translates the feel of browsing a bookstore into an online experience, with an emphasis on clear navigation and readable presentation.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Python', 'SQLite'],
      image: './assets/kurasa-bookstore.png',
      imageAlt: 'KURASA Bookstore homepage showing featured books',
      demo: './assets/kurasa-walkthrough.mp4'
    },
    {
      title: 'BUILDWISE',
      summary: 'Buildwise is a construction materials management prototype designed to give site teams a clear view of stock and material usage. It brings delivery records, stock tracking, material requests, approvals, and issuing into one workflow. Its dashboards and reports are designed to help teams monitor wastage and compare planned quantities with actual consumption.',
      stack: ['HTML', 'CSS', 'JavaScript', 'MySQL', 'PHP', 'XAMPP'],
      image: './assets/buildwise.png',
      imageAlt: 'Buildwise construction materials dashboard',
      demo: ''
      
    }
    // Replace these sample entries with your own completed work. Remove sample: true for your projects.
  ],
  // Add entries as objects with title, detail and optional url.
  certificates: [],
  achievements: [],
  experience: []
};
