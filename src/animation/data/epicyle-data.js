async function getFourierDataFromBackend(file, n_circles = 100) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('n_circles', n_circles);

    const response = await fetch('http://localhost:8000/api/fourier-data', {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    return result.circles; // Array of [amplitude, frequency, phase]
}