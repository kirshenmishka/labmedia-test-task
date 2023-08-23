const API_URL = 'https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users';
const usersPerPage = 7;

let users = [];
let originalUsers = []; // Добавляем оригинальный список пользователей
let currentPage = 1;

async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        users = await response.json();
        originalUsers = users.slice(); // Копируем список пользователей в originalUsers
        renderTableWithPagination(users);
        renderPagination(users.length);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function renderTableWithPagination(usersToDisplay) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;

    for (let i = startIndex; i < endIndex && i < usersToDisplay.length; i++) {
        const user = usersToDisplay[i];
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.registration_date}</td>
        <td>${user.rating}</td>
        <td><a href="#" style="
        border: solid 0px;
        background: unset;
        vertical-align: -webkit-baseline-middle;
    " onclick="confirmDelete('${user.id}')"><img src="img/cancel.svg" alt="Delete"></a></td>
    `;
        tableBody.appendChild(row);
    }
}

function searchUsers(query) {
    const filteredUsers = users.filter(user => {
        const lowerCaseQuery = query.toLowerCase();
        return user.username.toLowerCase().includes(lowerCaseQuery) ||
            user.email.toLowerCase().includes(lowerCaseQuery);
    });
    return filteredUsers;
}

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    const filteredUsers = searchUsers(query);
    renderTableWithPagination(filteredUsers);
});

function renderPagination(totalUsers) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalUsers / usersPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.onclick = () => {
            currentPage = i;
            renderTableWithPagination(users);
        };
        pagination.appendChild(button);
    }
}

function sortTable(field) {
    users.sort((a, b) => {
        if (field === 'registration_date') {
            return new Date(a[field]) - new Date(b[field]);
        } else {
            return a[field] - b[field];
        }
    });
    renderTableWithPagination(users);
}

function confirmDelete(userId) {
    const confirmed = confirm('Вы уверены, что хотите удалить пользователя?');
    if (confirmed) {
        deleteUser(userId);
    }
}

function deleteUser(userId) {
    users = users.filter(user => user.id !== parseInt(userId));
    originalUsers = originalUsers.filter(user => user.id !== parseInt(userId)); // Обновляем оригинальный список
    renderTableWithPagination(users);
    renderPagination(users.length);
}

function submitSort(field) {
    sortTable(field);
    renderTableWithPagination(users);
}

function clearFilters() {
    users = originalUsers.slice(); // Вернуться к исходному списку пользователей
    searchInput.value = ''; // Очистить поле поиска
    renderTableWithPagination(users);
    renderPagination(users.length);
}

const clearSortLink = document.getElementById('clearSortLink');

clearSortLink.addEventListener('click', (event) => {
    event.preventDefault();
    clearFilters();
});

fetchUsers();
