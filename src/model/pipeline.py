from .contour import extract_edges 
from .spline import create_smooth_spline
from .fourier import fourier_approximate
import sys
import os

def pipeline(image_path, min_threshold=100, max_threshold=200, n_circles=10):


        edges = extract_edges(image_path, min_threshold, max_threshold,n_samples=2000, ord=2)
        smooth_curve = create_smooth_spline(edges, smoothing_factor=0.4)
        frequencies, magnitude, phases = fourier_approximate(smooth_curve, n_frequencies=n_circles)
       
        return {
            "frequencies": frequencies,
            "magnitude": magnitude,
            "phases": phases
        }

if __name__ == "__main__":
    
    image_path = "experiment/faceimages/cat.png"
    if image_path is None:
        print("Please provide an image path.")
        sys.exit(1)
    result = pipeline(image_path)
    print("Frequencies:", result["frequencies"])
    print("Magnitude:", result["magnitude"])
    print("Phases:", result["phases"])

