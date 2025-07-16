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
    if (["image/png", "image/jpeg"].includes(file.type)) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = 'Uploaded Image';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '300px';
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('imagePreview').appendChild(img);
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