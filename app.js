// Simulating Teacher ID for the current session (can be dynamically set later)
const currentTeacherId = 1;  // Hardcoding teacher ID for now. This can be dynamically set based on login

// Simulated user data
const users = [
    { id: 1, username: 'teacher1', password: 'password1', role: 'teacher' },
    { id: 2, username: 'user1', password: 'password2', role: 'user' }
];

// Handle login
document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password');
    }
});

// Get current user
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Check if user is logged in
if (!currentUser && window.location.pathname !== '/login.html') {
    window.location.href = 'login.html';
}

// Simulated courses data in localStorage (if no courses exist, create an empty array)
if (!localStorage.getItem('courses')) {
    localStorage.setItem('courses', JSON.stringify([]));
}

// Get courses from localStorage
function getCourses() {
    return JSON.parse(localStorage.getItem('courses'));
}

// Display all courses
function displayCourses() {
    const courses = getCourses();
    const coursesContainer = document.getElementById('courses-container');
    coursesContainer.innerHTML = '';

    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.classList.add('course');
        courseElement.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <p>Created by Teacher #${course.teacherId}</p>
            ${currentUser.role === 'teacher' && currentUser.id === course.teacherId ? `
                <button onclick="editCourse(${course.id})">Edit</button>
                <button onclick="deleteCourse(${course.id})">Delete</button>
            ` : ''}
        `;
        coursesContainer.appendChild(courseElement);
    });
}

// Add a new course
document.getElementById('create-course-btn')?.addEventListener('click', () => {
    if (currentUser.role === 'teacher') {
        window.location.href = 'create-course.html';  // Redirect to the Create Course page
    } else {
        alert('Only teachers can create courses');
    }
});

// Handle course creation
if (document.getElementById('create-course-form')) {
    document.getElementById('create-course-form').addEventListener('submit', function(event) {
        event.preventDefault();

        if (currentUser.role === 'teacher') {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;

            const courses = getCourses();
            const newCourse = {
                id: courses.length + 1,  // Simple way to generate unique ID
                title: title,
                description: description,
                teacherId: currentUser.id
            };

            courses.push(newCourse);
            localStorage.setItem('courses', JSON.stringify(courses));

            window.location.href = 'index.html';  // Redirect back to the home page
        } else {
            alert('Only teachers can create courses');
        }
    });
}

// Edit course functionality
function editCourse(courseId) {
    const courses = getCourses();
    const course = courses.find(c => c.id === courseId);
    
    if (course.teacherId === currentUser.id) {
        window.location.href = `edit-course.html?courseId=${courseId}`;
    } else {
        alert('You can only edit your own courses!');
    }
}

// Handle course editing
if (document.getElementById('edit-course-form')) {
    const courseId = new URLSearchParams(window.location.search).get('courseId');
    const courses = getCourses();
    const course = courses.find(c => c.id == courseId);

    if (course.teacherId === currentUser.id) {
        document.getElementById('title').value = course.title;
        document.getElementById('description').value = course.description;

        document.getElementById('edit-course-form').addEventListener('submit', function(event) {
            event.preventDefault();

            course.title = document.getElementById('title').value;
            course.description = document.getElementById('description').value;

            localStorage.setItem('courses', JSON.stringify(courses));

            window.location.href = 'index.html';  // Redirect back to the home page
        });
    } else {
        alert('You can only edit your own courses!');
        window.location.href = 'index.html';
    }
}

// Delete course functionality
function deleteCourse(courseId) {
    const courses = getCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);

    if (courses[courseIndex].teacherId === currentUser.id) {
        if (confirm('Are you sure you want to delete this course?')) {
            courses.splice(courseIndex, 1);  // Remove course from array
            localStorage.setItem('courses', JSON.stringify(courses));
            displayCourses();  // Re-render courses
        }
    } else {
        alert('You can only delete your own courses!');
    }
}

// Initial rendering of courses (on the home page)
if (document.getElementById('courses-container')) {
    displayCourses();
}
