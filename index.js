let currentUser = JSON.parse(localStorage.getItem('session')) || null;
let items = JSON.parse(localStorage.getItem('shop_items')) || [];
let currentMode = 'login';

// Initialize Page
window.onload = () => {
    if(currentUser) updateUI();
    renderShop();
};

// Sticky Footer Logic
window.onscroll = function() {
    let footer = document.getElementById("footer-nav");
    if (window.pageYOffset > 300) {
        footer.classList.add("sticky-footer");
    } else {
        footer.classList.remove("sticky-footer");
    }
};

function openModal(mode) {
    currentMode = mode;
    document.getElementById('modal-title').innerText = mode === 'login' ? 'Login' : 'Sign Up';
    document.getElementById('signup-fields').className = mode === 'signup' ? '' : 'hidden';
    document.getElementById('authModal').style.display = 'flex';
}

function closeModal() { document.getElementById('authModal').style.display = 'none'; }

function handleAuth() {
    const user = document.getElementById('user-id').value;
    const pass = document.getElementById('pass-id').value;

    if (currentMode === 'signup') {
        const dob = new Date(document.getElementById('reg-dob').value);
        const age = new Date().getFullYear() - dob.getFullYear();
        const group = age >= 13 ? '13+' : 'Under 13';
        
        currentUser = { username: user, ageGroup: group, isAdmin: (user === 'Chad') };
        localStorage.setItem('session', JSON.stringify(currentUser));
    } else {
        // Simple login simulation
        currentUser = { username: user, ageGroup: '13+', isAdmin: (user === 'Chad') };
        localStorage.setItem('session', JSON.stringify(currentUser));
    }
    
    closeModal();
    updateUI();
}

function updateUI() {
    document.getElementById('auth-btns').classList.add('hidden');
    document.getElementById('user-display').classList.remove('hidden');
    document.getElementById('user-display').innerHTML = `Hi, ${currentUser.username} (${currentUser.ageGroup}) <button onclick="logout()">Logout</button>`;
    
    if(currentUser.isAdmin) {
        document.getElementById('admin-panel').classList.remove('hidden');
    }
}

function logout() {
    localStorage.removeItem('session');
    location.reload();
}

function toggleStock() {
    const isLimited = document.getElementById('p-limited').checked;
    document.getElementById('p-stock').className = isLimited ? '' : 'hidden';
}

function uploadItem() {
    const newItem = {
        name: document.getElementById('p-name').value,
        price: document.getElementById('p-price').value,
        img: document.getElementById('p-img').value || 'https://via.placeholder.com/150',
        limited: document.getElementById('p-limited').checked,
        stock: document.getElementById('p-stock').value || 0,
        date: Date.now()
    };
    items.unshift(newItem); // Newest first
    localStorage.setItem('shop_items', JSON.stringify(items));
    renderShop();
}

function showShop() {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('shop-section').classList.remove('hidden');
}

function renderShop() {
    const display = document.getElementById('shop-display');
    display.innerHTML = '';
    
    items.forEach(item => {
        // Age Group Protection Logic
        if (currentUser && currentUser.ageGroup === 'Under 13' && item.price > 100) {
            // Example restriction: kids can't see expensive items
            return; 
        }

        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <img src="${item.img}">
            <h3>${item.name}</h3>
            <p>$${item.price}</p>
            <p>${item.limited ? 'STOCK: ' + item.stock : 'Unlimited'}</p>
            <button onclick="alert('Redirecting to item page...')">Buy Now</button>
        `;
        display.appendChild(card);
    });
}