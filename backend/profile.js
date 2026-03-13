// profile.js - Lógica para la página de perfil

function resizeImage(dataUrl, maxWidth, maxHeight) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let { width, height } = img;

            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = dataUrl;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // If not logged in, redirect to main page
        window.location.href = 'index.html';
        return;
    }

    // Display user info
    document.getElementById('user-name').textContent = currentUser.username;
    document.getElementById('user-email').textContent = currentUser.email;

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Back to home
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Profile update
    document.querySelector('.profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newUsername = document.getElementById('new-username').value;
        const newEmail = document.getElementById('new-email').value;
        const newPassword = document.getElementById('new-password').value;
        const profilePicFile = document.getElementById('profile-pic').files[0];

        const updateProfile = (profilePicDataUrl) => {
            let updatedUser = { ...currentUser };
            if (newUsername) updatedUser.username = newUsername;
            if (newEmail) updatedUser.email = newEmail;
            if (newPassword) updatedUser.password = newPassword;
            if (profilePicDataUrl) updatedUser.profilePic = profilePicDataUrl;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const index = users.findIndex(u => u.username === currentUser.username);
            if (index !== -1) {
                users[index] = updatedUser;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                document.getElementById('user-name').textContent = updatedUser.username;
                document.getElementById('user-email').textContent = updatedUser.email;
                alert('Perfil actualizado!');
            }
        };

        if (profilePicFile) {
            const reader = new FileReader();
            reader.onload = () => {
                resizeImage(reader.result, 300, 300).then(updateProfile);
            };
            reader.readAsDataURL(profilePicFile);
        } else {
            updateProfile(null);
        }
    });

    // Create post
    document.querySelector('.post-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const imageFile = document.getElementById('post-image').files[0];

        const savePost = (imageDataUrl) => {
            const post = {
                id: Date.now(),
                author: currentUser.username,
                title,
                content,
                image: imageDataUrl || null,
                date: new Date().toLocaleDateString()
            };

            let posts = JSON.parse(localStorage.getItem('posts')) || [];
            posts.unshift(post);
            localStorage.setItem('posts', JSON.stringify(posts));

            alert('Publicación creada!');
            document.getElementById('post-title').value = '';
            document.getElementById('post-content').value = '';
            document.getElementById('post-image').value = '';
        };

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = () => {
                resizeImage(reader.result, 800, 600).then(savePost);
            };
            reader.readAsDataURL(imageFile);
        } else {
            savePost(null);
        }
    });
});