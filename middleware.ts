@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

:root {
  /* Dark vibrant aesthetic */
  --bg-color: #0d1117;
  --bg-card: #161b22;
  --bg-card-hover: #1f2530;
  
  --primary-color: #00e676;
  --primary-color-hover: #00c853;
  --accent-color: #ff3d00;
  
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  
  --border-color: #30363d;
  
  --font-family: 'Outfit', sans-serif;
  --border-radius: 12px;
  --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 16px rgba(0, 0, 0, 0.4);
  --transition: all 0.3s ease;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-color);
  color: var(--text-primary);
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition);
}

a:hover {
  text-decoration: underline;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease forwards;
}

/* Layout Utilities */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  width: 100%;
}

.map-container {
  height: 50vh;
  width: 100%;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 20px;
  font-family: var(--font-family);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: #000;
}

.btn-primary:hover {
  background-color: var(--primary-color-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 230, 118, 0.3);
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--bg-card-hover);
}

.btn-full {
  width: 100%;
}

/* Forms */
input, select, textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: var(--transition);
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(0, 230, 118, 0.2);
}

/* Cards */
.card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.card:hover {
  border-color: var(--primary-color);
}

/* Navbar */
.navbar {
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary-color);
  text-decoration: none;
}
.navbar-brand:hover {
  text-decoration: none;
}

.navbar-links {
  display: flex;
  gap: 1rem;
}
