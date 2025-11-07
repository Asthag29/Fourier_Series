from scipy.interpolate import splprep, splev
from scipy.ndimage import gaussian_filter1d 
import numpy as np


def create_smooth_spline(ordered_points,  smoothing_factor=None):
    """
    Function 3: Create smooth spline curve from ordered points
    
    Returns:
        smooth_curve: Mx2 array of smooth curve points
    """
    try:
        #fitting a parametric spline to the ordered points
        tck, u = splprep([ordered_points[:, 0], ordered_points[:, 1]], 
                        s=smoothing_factor * len(ordered_points), 
                        per=True)
        
        #this is sampling it uniformly in time 0 to 1
        u_new = np.linspace(0, 1, len(ordered_points)*2)
        smooth_x, smooth_y = splev(u_new, tck)
        smooth_curve = np.column_stack((smooth_x, smooth_y))

    except:
        print("Spline failed, using Gaussian smoothing")
        smooth_x = gaussian_filter1d(ordered_points[:, 0], sigma=1.0, mode='wrap')
        smooth_y = gaussian_filter1d(ordered_points[:, 1], sigma=1.0, mode='wrap')
        smooth_curve = np.column_stack((smooth_x, smooth_y))

    return smooth_curve

