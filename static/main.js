const form = document.getElementById("form");
const progressBar = document.getElementById("progressBar");
const progress = document.getElementById("progress");
const reasonEl = document.getElementById("cringeReason");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    alert("Please select a file to upload.");
    return;
  }

  const allowedTypes = ["text/plain", "image/png", "image/jpeg"];
  if (!allowedTypes.includes(file.type)) {
    alert("Please upload a valid file type: .txt, .png, or .jpg");
    return;
  }

  try {
    progressBar.style.display = "block";
    progress.style.width = "0%";
    let fakeProgress = 0;

    const interval = setInterval(() => {
      fakeProgress = Math.min(fakeProgress + 5, 90);
      progress.style.width = `${fakeProgress}%`;
    }, 100);

    const response = await fetch("/cringeornot", {
      method: "POST",
      body: formData,
    });

    clearInterval(interval);
    progress.style.width = "100%";

    if (!response.ok) throw new Error("Upload failed.");

    const result = await response.json();

    const percent = parseFloat(result.response);
    const reason = result.reason;

    animateCringeMeter(percent);
    reasonEl.textContent = `Reason: ${reason}`;
  } catch (err) {
    console.error(err);
  }
});

document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      const imgDiv = document.getElementById("img");
      imgDiv.innerHTML = "";
      imgDiv.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

function animateCringeMeter(percent) {
  const canvas = document.getElementById("cringeMeter");
  const ctx = canvas.getContext("2d");
  const radius = canvas.width / 2;
  const start = Math.PI;
  const end = 2 * Math.PI;
  let current = 0;

  function drawBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 20, start, end);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 18;
    ctx.stroke();
  }

  function drawNeedle(val) {
    const angle = start + (val / 100) * Math.PI;
    const x = radius + (radius - 40) * Math.cos(angle);
    const y = radius + (radius - 40) * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#ff4d4d";
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  function drawText(val) {
    ctx.font = "18px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(`${val.toFixed(1)}% cringe`, radius, radius + 10);
  }

  function animate() {
    drawBg();
    drawNeedle(current);
    drawText(current);
    if (current < percent) {
      current += 1;
      requestAnimationFrame(animate);
    } else {
      drawNeedle(percent);
      drawText(percent);
    }
  }

  animate();
}
