// GitHub Activity Status Indicators
document.addEventListener('DOMContentLoaded', () => {
  // Apply GitHub activity type indicators
  function applyGitHubActivityTypes() {
    // Find all GitHub activity items
    const githubItems = document.querySelectorAll('.github-item');
    
    githubItems.forEach(item => {
      // Find the type span inside the item
      const typeSpan = item.querySelector('.github-type');
      if (typeSpan) {
        // Extract the activity type from the text content
        const activityType = typeSpan.textContent.trim().toLowerCase();
        
        // Set data-type attribute based on the activity type
        switch (activityType) {
          case 'push':
            typeSpan.dataset.type = 'push';
            break;
          case 'create':
            typeSpan.dataset.type = 'create';
            break;
          case 'pr':
          case 'pullrequest':
            typeSpan.dataset.type = 'pr';
            break;
          case 'issue':
          case 'issues':
            typeSpan.dataset.type = 'issue';
            break;
          case 'comment':
            typeSpan.dataset.type = 'comment';
            break;
          case 'star':
          case 'watch':
            typeSpan.dataset.type = 'star';
            break;
          case 'fork':
            typeSpan.dataset.type = 'fork';
            break;
          case 'update':
            typeSpan.dataset.type = 'update';
            break;
          default:
            // For any other type, don't set a specific data-type
            break;
        }
      }
    });
  }
  
  // Apply GitHub activity types when content is loaded
  applyGitHubActivityTypes();
  
  // Also apply when dynamic content might be loaded
  // This uses MutationObserver to detect when GitHub activity is added to the page
  const githubActivityContainer = document.getElementById('github-activity');
  
  if (githubActivityContainer) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Apply types to newly added elements
          applyGitHubActivityTypes();
        }
      });
    });
    
    // Start observing the GitHub activity container
    observer.observe(githubActivityContainer, { 
      childList: true,
      subtree: true 
    });
  }
  
  // Override the renderGithubActivity function if it exists in the global scope
  if (window.renderGithubActivity) {
    const originalRenderGithubActivity = window.renderGithubActivity;
    
    window.renderGithubActivity = function(activity) {
      const element = originalRenderGithubActivity(activity);
      
      // Find the type span inside the newly created element
      const typeSpan = element.querySelector('.github-type');
      if (typeSpan) {
        // Set data-type attribute based on activity type
        switch (activity.type) {
          case 'PushEvent':
            typeSpan.dataset.type = 'push';
            break;
          case 'CreateEvent':
            typeSpan.dataset.type = 'create';
            break;
          case 'PullRequestEvent':
            typeSpan.dataset.type = 'pr';
            break;
          case 'IssuesEvent':
            typeSpan.dataset.type = 'issue';
            break;
          case 'IssueCommentEvent':
            typeSpan.dataset.type = 'comment';
            break;
          case 'WatchEvent':
            typeSpan.dataset.type = 'star';
            break;
          case 'ForkEvent':
            typeSpan.dataset.type = 'fork';
            break;
          case 'RepoCreatedEvent':
            typeSpan.dataset.type = 'create';
            break;
          case 'RepoUpdatedEvent':
            typeSpan.dataset.type = 'update';
            break;
        }
      }
      
      return element;
    };
  }
});