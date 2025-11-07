from .contour import extract_edges 
from .spline import create_smooth_spline
from .fourier import fourier_approximate
import sys
import os
import numpy as np

def pipeline(image_path, n_samples=2000, min_threshold=100, max_threshold=200, n_circles=None):


        edges = extract_edges(image_path, min_threshold, max_threshold,n_samples=n_samples, ord=2)
        smooth_curve = create_smooth_spline(edges, smoothing_factor=0.5)
        frequencies, magnitude, phases = fourier_approximate(smooth_curve, n_circles)

        print(f"Fourier approximation produced {len(frequencies)} frequencies")
        return {
            "frequencies": frequencies,
            "magnitude": magnitude,
            "phases": phases
        }



    
   
