// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
  // Create theme toggle button if it doesn't exist
  if (!document.querySelector('.theme-toggle')) {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    document.body.appendChild(themeToggle);
  }

  const themeToggle = document.querySelector('.theme-toggle');
  
  // Always use dark mode as default
  const savedTheme = localStorage.getItem('theme');
  
  // Set initial theme
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    // Default to dark mode
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('theme', 'dark');
  }
  
  // Toggle theme when button is clicked
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    let newTheme;
    
    if (currentTheme === 'dark') {
      newTheme = 'light';
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      newTheme = 'dark';
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    
    // Add animation class
    themeToggle.classList.add('animate');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      themeToggle.classList.remove('animate');
    }, 500);
    
    // Set theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Dispatch event for other scripts to react to theme change
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: newTheme } 
    }));
  });
});