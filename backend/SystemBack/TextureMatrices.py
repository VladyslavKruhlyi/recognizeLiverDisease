import cv2
import numpy as np
import pandas as pd
from skimage.feature import greycomatrix


def get_greyscale_matrix(filename):
    matrix = cv2.imread(filename, 0)
    return matrix.astype(int)


# Difference matrix
def get_diff_matrix(orig_matrix, var):
    # horizontal differentiation
    if var == 'hor':
        diff_matrix = np.diff(orig_matrix, axis=1)
    # vertical differentiation
    else:
        diff_matrix = np.diff(orig_matrix, axis=0)
    diff_matrix += abs(np.amin(diff_matrix))
    diff_matrix[diff_matrix > 255] = 255
    return diff_matrix


# Normed matrix
def get_norm_matrix(orig_matrix):
    norm_matrix = 255 * ((orig_matrix - np.amin(orig_matrix)) / (np.amax(orig_matrix) - np.amin(orig_matrix)))
    return np.asarray(norm_matrix, int)


# Equalized matrix
def get_eq_matrix(orig_matrix):
    eq_pixels = np.zeros(256)
    count = 0
    for i in range(256):
        count += np.sum(orig_matrix == i)
        eq_pixels[i] = (count * 255) / orig_matrix.size
    eq_matrix = np.copy(orig_matrix)
    for i in range(eq_matrix.shape[0]):
        for j in range(eq_matrix.shape[1]):
            eq_matrix[i, j] = round(eq_pixels[eq_matrix[i, j]], 0)
    return np.asarray(eq_matrix, int)


# Grey Level Co-Occurrence Matrix
def get_glcm(matrix, angle):
    init_glcm = greycomatrix(matrix, distances=[1], angles=[angle], levels=256, symmetric=True)
    init_glcm = np.asarray(np.reshape(init_glcm, (256, 256)), int)
    amin, amax = np.amin(matrix), np.amax(matrix)
    glcm = []
    for i in range(amin, amax + 1):
        for j in range(i, amax + 1):
            glcm.append([i, j, init_glcm[i, j]])
    glcm = pd.DataFrame(glcm, columns=['x', 'y', 'z'])
    return glcm.sort_values(['x', 'y'])


# Grey Level Run Length Matrix
def get_glrlm(matrix):
    max_len = 3
    amin, amax = np.amin(matrix), np.amax(matrix)
    glrlm = np.asarray(np.zeros(((amax - amin) + 1, max_len)), int)
    for i in range(matrix.size):
        # len = 1
        glrlm[matrix[i] - amin][0] += 1
        # len = 2
        try:
            if matrix[i] == matrix[i + 1]:
                glrlm[matrix[i] - amin][1] += 1
        except:
            continue
        # len = 3
        try:
            if matrix[i] == matrix[i + 1] == matrix[i + 2]:
                glrlm[matrix[i] - amin][2] += 1
        except:
            continue
    return pd.DataFrame(glrlm)


def find_matrices(matrix):
    gm = matrix.tolist()  # grayscale matrix
    glcm0 = get_glcm(matrix, 0).values  # gray-level co-occurrence matrix (0 angle)
    conc_matrix = np.concatenate(matrix, axis=None)  # convert GM from 2-D to 1-D
    glrlm0 = get_glrlm(conc_matrix).values  # grey-level run length matrix (0 angle)
    glcm90 = get_glcm(matrix, 90).values  # gray-level co-occurrence matrix (90 angle)
    conc_matrix = np.concatenate(matrix.T, axis=None)  # transporting matrix
    glrlm90 = get_glrlm(conc_matrix).values  # grey-level run length matrix (90 angle)
    return gm, glcm0.tolist(), glcm90.tolist(), glrlm0.tolist(), glrlm90.tolist()
