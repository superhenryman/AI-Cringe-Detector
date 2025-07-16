const form = document.getElementById('form');

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const file = formData.get('file');
    if (file instanceof File) {
        if (file.type !== 'text/plain' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
            alert('Please upload a valid file type: .txt, .png, or .jpg');
            return;
        }
    } else {
        alert('Please select a file to upload.');
        return;
    }
    try {
        const response = await fetch('/cringeornot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        alert('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    }
});