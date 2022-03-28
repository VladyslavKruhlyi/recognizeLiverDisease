import cv2
import numpy as np


def get_transformed_image(diff_matrix, indices, path_to_save):
    transformed_image = np.where(np.isin(diff_matrix, indices), 255, 0)
    cv2.imwrite(path_to_save, transformed_image)
