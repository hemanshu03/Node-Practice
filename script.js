const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const userInfoDiv = document.getElementById('user-info');
const userNameSpan = document.getElementById('user-name');
const userEmailSpan = document.getElementById('user-email');
const userGenderSpan = document.getElementById('user-gender');
const deleteButton = document.getElementById('delete-button');
const updateButton = document.getElementById('update-button');
const updateForm = document.getElementById('update-form');
const updateUserForm = document.getElementById('update-user-form');
const URL = "http://localhost:3000";

let token = null;

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const name = document.getElementById('register-name').value;
    const gender = document.getElementById('register-gender').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, gender, password }),
        });
        const result = await response.json();
        console.log(result);
    } catch (err) {
        console.error(err);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        token = result.token;
        if (token) {
            await fetchUserInfo();
        }
    } catch (err) {
        console.error(err);
    }
});

const fetchUserInfo = async () => {
    try {
        const response = await fetch(`${URL}/me`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorText = await response.text();  // Get error as text
            console.error(`Error: ${response.status} - ${errorText}`);
            return;  // Stop further execution if there's an error
        }

        const user = await response.json();  // If response is okay, parse as JSON
        userNameSpan.textContent = user.name;
        userEmailSpan.textContent = user.email;
        userGenderSpan.textContent = user.gender;
        userInfoDiv.style.display = 'block';
    } catch (err) {
        console.error(err);
    }
};


deleteButton.addEventListener('click', async () => {
    try {
        const response = await fetch(`${URL}/me`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const result = await response.json();
        console.log(result);
        token = null;
        userInfoDiv.style.display = 'none';
    } catch (err) {
        console.error(err);
    }
});

updateButton.addEventListener('click', () => {
    updateForm.style.display = 'block';
    const nameInput = document.getElementById('update-name');
    const emailInput = document.getElementById('update-email');
    const genderInput = document.getElementById('update-gender');
    nameInput.value = userNameSpan.textContent;
    emailInput.value = userEmailSpan.textContent;
    genderInput.value = userGenderSpan.textContent;
});

updateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('update-name').value;
    const email = document.getElementById('update-email').value;
    const gender = document.getElementById('update-gender').value;

    try {
        const response = await fetch(`${URL}/me`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name, email, gender }),
        });
        const result = await response.json();
        console.log(result);
        await fetchUserInfo();
        updateForm.style.display = 'none';
    } catch (err) {
        console.error(err);
    }
});