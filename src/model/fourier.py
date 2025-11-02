import numpy as np

def fourier_approximate(smooth_curve, n_frequencies=1000):
    """
    Function 4: Approximate smooth curve using Fourier series
    
    Returns:
        frequencies: Integer frequencies for epicycles
        magnitude: Circle radii (amplitudes)
        phases: Starting angles
    """
    # Create complex signal
    z = smooth_curve[:,0] + 1j * smooth_curve[:,1]
    N = len(z)
    
    # Compute FFT and frequencies
    coefficients = np.fft.fft(z , norm='forward')
    frequencies = np.fft.fftfreq(N, 1/N)  # integer frequencies
    
    # Keep n largest components
    indices = np.argsort(-np.abs(coefficients))[:n_frequencies]
    frequencies = frequencies[indices]
    coefficients = coefficients[indices]
    
    # Get amplitudes and phases
    magnitude = np.abs(coefficients)
    phases = np.angle(coefficients)
    
    return frequencies, magnitude, phases

