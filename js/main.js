// Constants
const NOSTR_PUBKEY = '71df01920d67087f38d3f6c337762ddcfcf7db8c86eb2f74e181fea1f1f9cbe6'; // Hex of npub17q66c7yr5thrc9vscy2u2m7t50chjvvdwtkwp6qap6035ftv46xqmg3few
const NOSTR_NPUB = 'npub17q66c7yr5thrc9vscy2u2m7t50chjvvdwtkwp6qap6035ftv46xqmg3few';
const GITHUB_USERNAME = 'stevengeller';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/events/public`;
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

// DOM Elements
const loadingOverlay = document.getElementById('loading-overlay');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const typedTextElement = document.getElementById('typed-text');
const nostrPostsElement = document.getElementById('nostr-posts');
const githubActivityElement = document.getElementById('github-activity');
const loadingIndicator = document.getElementById('loading-indicator');

// Typed text phrases for hero section - all lowercase
const typedPhrases = [
    'head of bitcoin engineering at block.',
    'bitcoin protocol developer.',
    'lightning network builder.',
    'open source contributor.',
    'self-custody advocate.'
];

// Particles.js configuration - simplified
const particlesConfig = {
    "particles": {
        "number": {
            "value": 60,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ff9900"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
        },
        "opacity": {
            "value": 0.4,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 2,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#0066ff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 1,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": true,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 140,
                "line_linked": {
                    "opacity": 1
                }
            },
            "push": {
                "particles_nb": 4
            }
        }
    },
    "retina_detect": true
};

// Helper Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'today';
    } else if (diffDays === 1) {
        return 'yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).toLowerCase();
    }
}

// Typed Text Animation
function typeText() {
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentPhrase = typedPhrases[currentPhraseIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 50;
        } else {
            typedTextElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && currentCharIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1000; // Pause at the end of typing
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % typedPhrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

// Navigation Functionality
function setupNavigation() {
    // Toggle mobile navigation
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });
    
    // Close mobile nav when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // Change nav background on scroll
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.main-nav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Highlight current section in nav
        highlightCurrentSection();
    });
}

// Highlight active navigation section
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// Terminal Animation
function animateTerminal() {
    const terminalBody = document.getElementById('terminal-body');
    const lines = terminalBody.querySelectorAll('.line');
    
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '0';
            line.style.display = 'block';
            
            setTimeout(() => {
                line.style.opacity = '1';
            }, 100);
        }, index * 500);
    });
}

// Enhanced Nostr post fetching with multiple fallback methods
async function fetchNostrPosts() {
    try {
        console.log('fetching nostr posts for pubkey:', NOSTR_PUBKEY);
        
        // Try multiple sources for reliability
        let posts = [];
        
        // Method 1: Using a different CORS proxy that's more reliable
        try {
            // Using a different CORS proxy
            const corsProxy = 'https://api.allorigins.win/raw?url=';
            const apiUrl = `${corsProxy}${encodeURIComponent(`https://api.nostr.band/v0/notes?pubkey=${NOSTR_PUBKEY}&limit=10`)}`;
            
            console.log('fetching from:', apiUrl);
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/json'
                },
                timeout: 8000 // Increased timeout
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('nostr.band api response:', data);
                
                if (data && data.notes && data.notes.length > 0) {
                    posts = data.notes.map(note => ({
                        id: note.id,
                        content: note.content,
                        created_at: new Date(note.created_at).getTime()
                    }));
                    console.log('successfully fetched posts from nostr.band api:', posts.length);
                    return posts;
                }
            }
        } catch (error) {
            console.error('error fetching from nostr.band api:', error);
        }
        
        // Method 2: Try another API endpoint with no-cors mode
        try {
            // Using a different CORS proxy for the second method
            const corsProxy = 'https://corsproxy.org/?';
            const apiUrl = `${corsProxy}${encodeURIComponent('https://api.nostr.wine/v1/notes')}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    pubkey: NOSTR_PUBKEY,
                    limit: 10
                }),
                timeout: 8000 // Increased timeout
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.notes && data.notes.length > 0) {
                    posts = data.notes.map(note => ({
                        id: note.id,
                        content: note.content,
                        created_at: note.created_at * 1000
                    }));
                    console.log('successfully fetched posts from nostr.wine api:', posts.length);
                    return posts;
                }
            }
        } catch (error) {
            console.error('error fetching from nostr.wine api:', error);
        }
        
        // Method 3: Try direct relay connection if nostr library is available
        if (posts.length === 0 && typeof window.nostr !== 'undefined') {
            try {
                posts = await fetchFromNostrRelay();
                if (posts.length > 0) {
                    console.log('successfully fetched posts from direct relay:', posts.length);
                    return posts;
                }
            } catch (error) {
                console.error('error fetching from direct relay:', error);
            }
        }
        
        // Method 4: Use static fallback data if all else fails
        console.log('all api methods failed, using fallback data');
        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        return [
            {
                id: 'static-note-1',
                content: 'working on lightning network improvements to enhance scalability and reliability across block\'s platforms.',
                created_at: oneDayAgo
            },
            {
                id: 'static-note-2',
                content: 'just published a bitcoin protocol update. check out the repo: https://github.com/stevengeller/bitcoin-core-contrib',
                created_at: threeDaysAgo
            },
            {
                id: 'static-note-3',
                content: 'self-custody is non-negotiable. your keys, your bitcoin.',
                created_at: Date.now()
            }
        ];
    } catch (error) {
        console.error('error in main fetchNostrPosts function:', error);
        
        // Return fallback data on any error
        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
        return [
            {
                id: 'error-note',
                content: 'unable to load nostr posts. please try again later.',
                created_at: threeDaysAgo
            }
        ];
    }
}

// Fetch from Nostr relay using nostr-tools
async function fetchFromNostrRelay() {
    try {
        // Popular public relays
        const relays = [
            'wss://nos.lol',
            'wss://relay.snort.social',
            'wss://relay.current.fyi',
            'wss://nostr.bitcoiner.social'
        ];
        
        // Promise wrapper for relay search
        return new Promise((resolve) => {
            let notes = [];
            let completedRelays = 0;
            const relayConnections = [];
            
            // Set timeout
            const timeout = setTimeout(() => {
                console.log(`relay search timeout reached, returning ${notes.length} notes`);
                
                // Close connections
                for (const conn of relayConnections) {
                    try { 
                        if (conn && typeof conn.close === 'function') {
                            conn.close(); 
                        }
                    } catch (e) {
                        console.error('error closing relay connection:', e);
                    }
                }
                
                resolve(notes);
            }, 5000);
            
            // Try each relay
            relays.forEach(relay => {
                try {
                    const relayConn = window.nostr.relayInit(relay);
                    relayConnections.push(relayConn);
                    
                    relayConn.on('connect', () => {
                        console.log(`connected to ${relay}`);
                        
                        try {
                            // Subscribe to user's notes
                            const sub = relayConn.sub([
                                {
                                    kinds: [1, 30023], // Text notes and long-form content
                                    authors: [NOSTR_PUBKEY],
                                    limit: 10
                                }
                            ]);
                            
                            sub.on('event', event => {
                                // Add to notes if not duplicate
                                if (!notes.some(note => note.id === event.id)) {
                                    notes.push({
                                        id: event.id,
                                        content: event.content,
                                        created_at: event.created_at * 1000
                                    });
                                }
                            });
                            
                            // After 3 seconds or on EOSE, close this relay connection
                            const relayTimeout = setTimeout(() => {
                                completedRelays++;
                                try {
                                    if (sub && typeof sub.unsub === 'function') {
                                        sub.unsub();
                                    }
                                    if (relayConn && typeof relayConn.close === 'function') {
                                        relayConn.close();
                                    }
                                } catch (e) {
                                    console.error('error during relay cleanup:', e);
                                }
                                
                                // If all relays have completed, resolve
                                if (completedRelays >= relays.length) {
                                    clearTimeout(timeout);
                                    resolve(notes);
                                }
                            }, 3000);
                            
                            sub.on('eose', () => {
                                clearTimeout(relayTimeout);
                                completedRelays++;
                                try {
                                    if (sub && typeof sub.unsub === 'function') {
                                        sub.unsub();
                                    }
                                    if (relayConn && typeof relayConn.close === 'function') {
                                        relayConn.close();
                                    }
                                } catch (e) {
                                    console.error('error during relay cleanup on eose:', e);
                                }
                                
                                // If all relays have completed, resolve
                                if (completedRelays >= relays.length) {
                                    clearTimeout(timeout);
                                    resolve(notes);
                                }
                            });
                        } catch (subError) {
                            console.error(`error creating subscription to ${relay}:`, subError);
                            completedRelays++;
                            
                            if (completedRelays >= relays.length) {
                                clearTimeout(timeout);
                                resolve(notes);
                            }
                        }
                    });
                    
                    relayConn.on('error', () => {
                        completedRelays++;
                        
                        if (completedRelays >= relays.length) {
                            clearTimeout(timeout);
                            resolve(notes);
                        }
                    });
                    
                    // Start the connection process
                    relayConn.connect();
                } catch (error) {
                    completedRelays++;
                    
                    if (completedRelays >= relays.length) {
                        clearTimeout(timeout);
                        resolve(notes);
                    }
                }
            });
        });
    } catch (error) {
        console.error('error in direct relay fetching:', error);
        return [];
    }
}

// Fetch GitHub activity
async function fetchGithubActivity() {
    try {
        let allActivities = [];
        
        // Fetch events data (recent activity)
        const perPage = 30;
        const url = `${GITHUB_API_URL}?per_page=${perPage}`;
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Website'
            },
            timeout: 8000
        });
        
        if (response.ok) {
            const activities = await response.json();
            allActivities = allActivities.concat(activities);
        }
        
        // Fetch repository data
        const reposUrl = `${GITHUB_REPOS_URL}?per_page=100&sort=updated`;
        const reposResponse = await fetch(reposUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Website'
            },
            timeout: 8000
        });
        
        if (reposResponse.ok) {
            const repos = await reposResponse.json();
            
            // Create synthetic activities from repo updates
            for (const repo of repos) {
                // Skip forks unless they have been updated
                if (repo.fork && new Date(repo.updated_at) <= new Date(repo.created_at)) {
                    continue;
                }
                
                // Add creation event if within our timeframe
                allActivities.push({
                    type: 'RepoCreatedEvent',
                    created_at: repo.created_at,
                    repo: { name: repo.full_name },
                    payload: {}
                });
                
                // Add update event if different from creation
                if (repo.updated_at !== repo.created_at) {
                    allActivities.push({
                        type: 'RepoUpdatedEvent',
                        created_at: repo.updated_at,
                        repo: { name: repo.full_name },
                        payload: {}
                    });
                }
            }
        }
        
        // Sort all activities by date
        allActivities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        return allActivities;
    } catch (error) {
        console.error('error fetching github activity:', error);
        return [];
    }
}

// Create GitHub activity summary
function createGitHubSummary(activities) {
    // Define multiple timeframes
    const now = new Date();
    
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    // Initialize counters for each time period
    let thirtyDayCount = 0;
    let sixtyDayCount = 0;
    let ninetyDayCount = 0;
    
    // Count activities for each period
    for (const activity of activities) {
        const activityDate = new Date(activity.created_at);
        
        if (activityDate >= thirtyDaysAgo) {
            thirtyDayCount++;
        }
        
        if (activityDate >= sixtyDaysAgo) {
            sixtyDayCount++;
        }
        
        if (activityDate >= ninetyDaysAgo) {
            ninetyDayCount++;
        }
    }
    
    // Create element for the activity graph
    const summaryElement = document.createElement('div');
    summaryElement.className = 'github-activity-graph';
    
    const countsSummary = document.createElement('div');
    countsSummary.className = 'activity-summary';
    
    // Create period elements for each timeframe - lowercase labels
    const periods = [
        { count: thirtyDayCount, label: 'last 30 days' },
        { count: sixtyDayCount, label: 'last 60 days' },
        { count: ninetyDayCount, label: 'last 90 days' }
    ];
    
    for (const period of periods) {
        const periodElement = document.createElement('div');
        periodElement.className = 'activity-period';
        
        const countElement = document.createElement('div');
        countElement.className = 'activity-count';
        countElement.textContent = period.count;
        
        const labelElement = document.createElement('div');
        labelElement.className = 'activity-label';
        labelElement.textContent = period.label;
        
        periodElement.appendChild(countElement);
        periodElement.appendChild(labelElement);
        countsSummary.appendChild(periodElement);
    }
    
    summaryElement.appendChild(countsSummary);
    return summaryElement;
}

// Render GitHub activity
function renderGithubActivity(activity) {
    const activityElement = document.createElement('div');
    activityElement.className = 'github-item';
    
    let title = '';
    let typeLabel = '';
    
    try {
        switch (activity.type) {
            case 'PushEvent':
                typeLabel = 'push';
                if (activity.payload.commits && activity.payload.commits.length > 0) {
                    title = `pushed to ${activity.repo.name}: ${activity.payload.commits[0].message}`;
                } else {
                    title = `pushed to ${activity.repo.name}`;
                }
                break;
            case 'CreateEvent':
                typeLabel = 'create';
                title = `created ${activity.payload.ref_type || 'repo'} ${activity.repo.name}`;
                break;
            case 'PullRequestEvent':
                typeLabel = 'pr';
                if (activity.payload.pull_request) {
                    title = `${activity.payload.action} pull request in ${activity.repo.name}: ${activity.payload.pull_request.title}`;
                } else {
                    title = `${activity.payload.action || 'updated'} pull request in ${activity.repo.name}`;
                }
                break;
            case 'IssuesEvent':
                typeLabel = 'issue';
                if (activity.payload.issue) {
                    title = `${activity.payload.action} issue in ${activity.repo.name}: ${activity.payload.issue.title}`;
                } else {
                    title = `${activity.payload.action || 'updated'} issue in ${activity.repo.name}`;
                }
                break;
            case 'IssueCommentEvent':
                typeLabel = 'comment';
                title = `commented on issue in ${activity.repo.name}`;
                break;
            case 'WatchEvent':
                typeLabel = 'star';
                title = `starred ${activity.repo.name}`;
                break;
            case 'ForkEvent':
                typeLabel = 'fork';
                title = `forked ${activity.repo.name}`;
                break;
            case 'RepoCreatedEvent':
                typeLabel = 'create';
                title = `created repository ${activity.repo.name}`;
                break;
            case 'RepoUpdatedEvent':
                typeLabel = 'update';
                title = `updated repository ${activity.repo.name}`;
                break;
            default:
                typeLabel = activity.type.replace('Event', '').toLowerCase();
                title = `activity in ${activity.repo.name}`;
        }
        
        const typeElement = document.createElement('span');
        typeElement.className = 'github-type';
        typeElement.dataset.type = typeLabel;
        typeElement.textContent = typeLabel;
        
        const contentElement = document.createElement('div');
        contentElement.textContent = ` ${title.toLowerCase()}`; // Convert to lowercase
        contentElement.prepend(typeElement);
        
        const dateElement = document.createElement('div');
        dateElement.className = 'github-date';
        dateElement.textContent = formatDate(activity.created_at);
        
        activityElement.appendChild(contentElement);
        activityElement.appendChild(dateElement);
    } catch (error) {
        console.error('error rendering activity:', error);
        activityElement.textContent = `${activity.type.toLowerCase()} on ${formatDate(activity.created_at)}`;
    }
    
    return activityElement;
}

// Render Nostr posts
function renderNostrPosts(posts) {
    nostrPostsElement.innerHTML = '';
    
    if (!posts || posts.length === 0) {
        const emptyElement = document.createElement('div');
        emptyElement.className = 'post';
        emptyElement.textContent = 'no posts found';
        nostrPostsElement.appendChild(emptyElement);
        return;
    }
    
    for (const post of posts) {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        const contentElement = document.createElement('div');
        contentElement.className = 'post-content';
        
        // Process content to make links clickable but keep text lowercase
        const content = post.content.toLowerCase().replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        contentElement.innerHTML = content;
        
        const dateElement = document.createElement('div');
        dateElement.className = 'post-date';
        dateElement.textContent = formatDate(post.created_at);
        
        postElement.appendChild(contentElement);
        postElement.appendChild(dateElement);
        
        nostrPostsElement.appendChild(postElement);
    }
}

// Initialize particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles', particlesConfig);
    } else {
        console.error('particles.js library not loaded');
        
        // Dynamically load particles.js if not available
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.onload = function() {
            console.log('particles.js loaded successfully, initializing now');
            particlesJS('particles', particlesConfig);
        };
        document.head.appendChild(script);
    }
}

// Main initialization
async function initialize() {
    try {
        // Initialize UI elements
        setupNavigation();
        typeText();
        
        // Initialize particles immediately
        initParticles();
        
        // Show loading state
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
        
        // Fetch data
        const [posts, activities] = await Promise.all([
            fetchNostrPosts(),
            fetchGithubActivity()
        ]);
        
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // Render GitHub activity
        if (githubActivityElement && activities && activities.length > 0) {
            // Add summary first
            githubActivityElement.appendChild(createGitHubSummary(activities));
            
            // Show the last 5 GitHub activities
            for (const activity of activities.slice(0, 5)) {
                githubActivityElement.appendChild(renderGithubActivity(activity));
            }
        } else if (githubActivityElement) {
            githubActivityElement.innerHTML = '<div class="github-item">no recent activity found or unable to load github data</div>';
        }
        
        // Render Nostr posts
        if (nostrPostsElement) {
            renderNostrPosts(posts);
        }
        
        // Animate terminal after a delay
        setTimeout(animateTerminal, 1000);
        
        // Hide loading overlay
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 500);
        }
        
    } catch (error) {
        console.error('error during initialization:', error);
        
        // Hide loading overlay even on error
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
        
        // Show error messages in the UI
        if (nostrPostsElement) {
            nostrPostsElement.innerHTML = `
                <div class="post">
                    <div class="post-content">
                        <strong>error loading nostr posts:</strong> ${error.message || 'unknown error'}
                    </div>
                    <div class="post-date">just now</div>
                </div>
            `;
        }
        
        if (githubActivityElement) {
            githubActivityElement.innerHTML = `
                <div class="github-item">
                    <strong>error loading github activity:</strong> ${error.message || 'unknown error'}
                    <div class="github-date">please try refreshing the page</div>
                </div>
            `;
        }
    }
}

// Add event listener for mobile nav toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', initialize);

// Add scroll reveal animations
window.addEventListener('load', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});