const form = document.getElementById('form');

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) {
        alert('Please select a file to upload.');
        return;
    }

    const allowedTypes = ['text/plain', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid file type: .txt, .png, or .jpg');
        return;
    }
    try {
        const response = await fetch('/cringeornot', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        alert(`You are: ${result.response} cringe. Why? ${result.reason}`);
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%'; 
            img.style.height = 'auto';
            img.style.display = 'block'; 
            const imagePreview = document.getElementById('img'); 
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});