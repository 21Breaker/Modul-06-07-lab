// Simulating Teacher ID for the current session (can be dynamically set later)
const currentTeacherId = 1;  // Hardcoding teacher ID for now. This can be dynamically set based on login

// Simulated user data
const users = [
    { id: 1, username: 'teacher1', password: 'password1', role: 'teacher' },
    { id: 2, username: 'user1', password: 'password2', role: 'user' }
];

// Handle login
document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission behavior
    
    const username = document.getElementById('username').value;  // Get the entered username
    const password = document.getElementById('password').value;  // Get the entered password
    
    // Find the user with matching username and password
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store the current user in localStorage and redirect to the home page
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password');  // Show an error message if login fails
    }
});

// Get current user from localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Check if user is logged in, if not redirect to login page
if (!currentUser && window.location.pathname !== '/login.html') {
    window.location.href = 'login.html';
}

// Initialize courses data in localStorage if not already present
if (!localStorage.getItem('courses')) {
    localStorage.setItem('courses', JSON.stringify([]));
}

// Initialize cart data in localStorage if not already present
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Get courses from localStorage
function getCourses() {
    return JSON.parse(localStorage.getItem('courses'));
}

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart'));
}

// Display all courses
function displayCourses() {
    const courses = getCourses();
    const coursesContainer = document.getElementById('courses-container');
    coursesContainer.innerHTML = '';  // Clear the container

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
            ${currentUser.role === 'user' ? `
                <button onclick="addToCart(${course.id})">Add to Cart</button>
            ` : ''}
        `;
        coursesContainer.appendChild(courseElement);  // Add course element to the container
    });
}

// Display cart
function displayCart() {
    const cart = getCart();
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';  // Clear the container

    cart.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.classList.add('course');
        courseElement.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <button onclick="removeFromCart(${course.id})">Remove from Cart</button>
        `;
        cartContainer.appendChild(courseElement);  // Add course element to the container
    });
}

// Add a new course
document.getElementById('create-course-btn')?.addEventListener('click', () => {
    if (currentUser.role === 'teacher') {
        window.location.href = 'create-course.html';  // Redirect to the Create Course page
    } else {
        alert('Only teachers can create courses');  // Show an error message if user is not a teacher
    }
});

// Handle course creation
if (document.getElementById('create-course-form')) {
    document.getElementById('create-course-form').addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the default form submission behavior

        if (currentUser.role === 'teacher') {
            const title = document.getElementById('title').value;  // Get the entered course title
            const description = document.getElementById('description').value;  // Get the entered course description

            const courses = getCourses();
            const newCourse = {
                id: courses.length + 1,  // Simple way to generate unique ID
                title: title,
                description: description,
                teacherId: currentUser.id
            };

            courses.push(newCourse);  // Add the new course to the courses array
            localStorage.setItem('courses', JSON.stringify(courses));  // Save the updated courses array to localStorage

            window.location.href = 'index.html';  // Redirect back to the home page
        } else {
            alert('Only teachers can create courses');  // Show an error message if user is not a teacher
        }
    });
}

// Edit course functionality
function editCourse(courseId) {
    const courses = getCourses();
    const course = courses.find(c => c.id === courseId);
    
    if (course.teacherId === currentUser.id) {
        window.location.href = `edit-course.html?courseId=${courseId}`;  // Redirect to the Edit Course page
    } else {
        alert('You can only edit your own courses!');  // Show an error message if user is not the course creator
    }
}

// Handle course editing
if (document.getElementById('edit-course-form')) {
    const courseId = new URLSearchParams(window.location.search).get('courseId');
    const courses = getCourses();
    const course = courses.find(c => c.id == courseId);

    if (course.teacherId === currentUser.id) {
        document.getElementById('title').value = course.title;  // Pre-fill the course title
        document.getElementById('description').value = course.description;  // Pre-fill the course description

        document.getElementById('edit-course-form').addEventListener('submit', function(event) {
            event.preventDefault();  // Prevent the default form submission behavior

            course.title = document.getElementById('title').value;  // Update the course title
            course.description = document.getElementById('description').value;  // Update the course description

            localStorage.setItem('courses', JSON.stringify(courses));  // Save the updated courses array to localStorage

            window.location.href = 'index.html';  // Redirect back to the home page
        });
    } else {
        alert('You can only edit your own courses!');  // Show an error message if user is not the course creator
        window.location.href = 'index.html';  // Redirect back to the home page
    }
}

// Delete course functionality
function deleteCourse(courseId) {
    const courses = getCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);

    if (courses[courseIndex].teacherId === currentUser.id) {
        if (confirm('Are you sure you want to delete this course?')) {
            courses.splice(courseIndex, 1);  // Remove course from array
            localStorage.setItem('courses', JSON.stringify(courses));  // Save the updated courses array to localStorage
            displayCourses();  // Re-render courses
        }
    } else {
        alert('You can only delete your own courses!');  // Show an error message if user is not the course creator
    }
}

// Add course to cart
function addToCart(courseId) {
    const courses = getCourses();
    const course = courses.find(c => c.id === courseId);
    const cart = getCart();

    if (!cart.some(c => c.id === courseId)) {
        cart.push(course);  // Add course to cart if not already present
        localStorage.setItem('cart', JSON.stringify(cart));  // Save the updated cart to localStorage
        displayCart();  // Re-render cart
    } else {
        alert('Course is already in the cart');  // Show an error message if course is already in the cart
    }
}

// Remove course from cart
function removeFromCart(courseId) {
    const cart = getCart();
    const courseIndex = cart.findIndex(c => c.id === courseId);

    if (courseIndex !== -1) {
        cart.splice(courseIndex, 1);  // Remove course from cart
        localStorage.setItem('cart', JSON.stringify(cart));  // Save the updated cart to localStorage
        displayCart();  // Re-render cart
    }
}

// Initial rendering of courses and cart (on the home page)
if (document.getElementById('courses-container')) {
    displayCourses();
    displayCart();
}
