import cv2
import numpy as np


def extract_edges(image_path, min_threshold=None, max_threshold=None, n_samples=None, ord=2):
    """
    Function 1: Load image and extract edges using OpenCV Canny
    
    Returns:
        gray: Grayscale image
        edges: Binary edge map
    """
    gray = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if gray is None:
        raise ValueError(f"Image at path {image_path} could not be loaded.")
    edges = cv2.Canny(gray, min_threshold, max_threshold)

    y_coords, x_coords = np.where(edges > 0)
    all_points = np.column_stack((x_coords, y_coords))      #stacking them along column
    
    # Sample if too many points
    if len(all_points) > n_samples:
        indices = np.random.choice(len(all_points), n_samples, replace=False)
        points = all_points[indices]
    else:
        points = all_points
    
    print(f"Ordering {len(points)} edge points...")
    
    # Order points using nearest neighbor
    current = 0
    visited = {current}
    ordered_points = [points[current]]
    
    while len(visited) < len(points):
        current_point = points[current]
        distances = np.linalg.norm(points - current_point,  ord=ord,axis=1)
        distances[list(visited)] = np.inf
        
        next_idx = np.argmin(distances)
        if distances[next_idx] == np.inf:
            break
            
        ordered_points.append(points[next_idx])
        visited.add(next_idx)
        current = next_idx

    ordered_points = np.array(ordered_points)

    return ordered_points

