import re
from math import ceil
from typing import Optional

import numpy as np
import pandas as pd
import statsmodels.api as sm
from scipy.stats import kurtosis as kurt
from scipy.stats import median_abs_deviation as mad
from scipy.stats import skew, entropy

"""
============================
GLCM features (Vlad Kruhlyi)
============================
"""


def get_glcm_features(image_features, glcm_type, image_type, glcm, best_grad, best_d, best_p):
    max_index = np.argmax(glcm['z'].values)
    image_features[glcm_type + 'glcm_f1_' + image_type] = glcm.at[max_index, 'x'] * glcm.at[max_index, 'y']
    image_features[glcm_type + 'glcm_f2_' + image_type] = get_grad_freq(glcm.copy(), best_grad)
    image_features[glcm_type + 'glcm_f3_' + image_type] = np.amax(glcm['x'].values) * np.amax(glcm['y'].values)
    image_features[glcm_type + 'glcm_f4_' + image_type] = get_d_freq(glcm.copy(), best_d)
    image_features[glcm_type + 'glcm_f5_' + image_type] = get_p_freq(glcm.copy(), best_p)
    return image_features


## Calculate frequency of pair with given grad
def get_grad_freq(glcm, grad):
    if np.sum(glcm['z']) > 0:
        glcm['z'] = (glcm['z'] / np.sum(glcm['z'])) * 10000
        grad_from_glcm = glcm[(glcm['x'] == grad)]['z'].tolist()
        if len(grad_from_glcm) > 0:
            return np.mean(grad_from_glcm)
        else:
            return 0
    else:
        return 0


## Calculate frequency of pair with given diagonal grad
def get_d_freq(glcm, d):
    if np.sum(glcm['z'].values) > 0:
        glcm_d = glcm[(glcm['x'] == d) & (glcm['y'] == d)]
        return (np.sum(glcm_d['z'].values) / np.sum(glcm['z'].values)) * 10000
    else:
        return 0


## Calculate frequency of pair with given diagonal grad
def get_p_freq(glcm, p):
    if np.sum(glcm['z'].values) > 0:
        glcm_p = glcm[(glcm['x'] == p[0]) & (glcm['y'] == p[1])]
        return (np.sum(glcm_p['z'].values) / np.sum(glcm['z'].values)) * 10000
    else:
        return 0


"""
================================================
Optimal ensembles of pixel pairs (Max Honcharuk)
================================================
"""


def get_pair_ensembles(image_features, glcm_type, image_type, glcm, best_pairs):
    glcm = pd.DataFrame(glcm, columns=['x', 'y', 'z'])
    for best_pair in best_pairs:
        pair = glcm[((glcm['x'] == best_pair[0]) & (glcm['y'] == best_pair[1])) |
                    ((glcm['x'] == best_pair[1]) & (glcm['y'] == best_pair[0]))]
        feature_name = glcm_type + 'glcm_pair' + str(best_pair[0]) + str(best_pair[1]) + '_' + image_type
        if np.sum(glcm['z'].values) > 0:
            image_features[feature_name] = (np.sum(pair['z'].values) / np.sum(glcm['z'].values)) * 10000
        else:
            image_features[feature_name] = 0
    return image_features


"""
====================================
Features from Vitya Babenko
====================================
"""


# GM grads of extremes frequency
def get_ex_grads(image_features, image_type, gm):
    image_features['gm_minfreq_' + image_type] = (np.sum(gm == np.amin(gm)) / gm.size) * 100
    image_features['gm_maxfreq_' + image_type] = (np.sum(gm == np.amax(gm)) / gm.size) * 100
    return image_features


# Greyscale distribution characteristics
def get_dis_features(image_features, matrix_type, image_type, matrix):
    mean = np.mean(matrix)
    image_features[matrix_type + '_mean_' + image_type] = mean
    std = np.std(matrix)  # Standard Deviation
    image_features[matrix_type + '_std_' + image_type] = std

    # Coefficient of Variation
    if mean > 0:
        image_features[matrix_type + '_cov_' + image_type] = std / mean
    else:
        image_features[matrix_type + '_cov_' + image_type] = 0

    image_features[matrix_type + '_skew_' + image_type] = skew(matrix)  # Skewness
    image_features[matrix_type + '_kurt_' + image_type] = kurt(matrix)  # Kurtosis
    image_features[matrix_type + '_range_' + image_type] = np.amax(matrix) - np.amin(matrix)
    image_features[matrix_type + '_median_' + image_type] = np.median(matrix)
    q1 = np.percentile(matrix, 25, interpolation='midpoint')
    image_features[matrix_type + '_q1_' + image_type] = q1
    q3 = np.percentile(matrix, 75, interpolation='midpoint')
    image_features[matrix_type + '_q3_' + image_type] = q3
    image_features[matrix_type + '_p5_' + image_type] = np.percentile(matrix, 5, interpolation='midpoint')
    image_features[matrix_type + '_p95_' + image_type] = np.percentile(matrix, 95, interpolation='midpoint')
    image_features[matrix_type + '_iqr_' + image_type] = q3 - q1  # Intra-Quartile Range
    image_features[matrix_type + '_mad_' + image_type] = mad(matrix)  # Mean Absolute Deviation
    image_features[matrix_type + '_entropy_' + image_type] = entropy(matrix)
    image_features[matrix_type + '_energy_' + image_type] = np.mean(matrix ** 2)
    return image_features


# Differences between amplitudes of modes
def get_diffs(image_features, glrlm_type, image_type, glrlm):
    image_features[glrlm_type + 'glrlm_diff12_' + image_type] = np.amax(glrlm[0]) - np.amax(glrlm[1])
    image_features[glrlm_type + 'glrlm_diff13_' + image_type] = np.amax(glrlm[0]) - np.amax(glrlm[2])
    image_features[glrlm_type + 'glrlm_diff23_' + image_type] = np.amax(glrlm[1]) - np.amax(glrlm[2])
    return image_features


# White percentage after binarization
def get_wp(image_features, gm, diff_indices, image_type):
    new_gm = np.where(np.isin(gm, diff_indices), 255, 0)
    image_features['gm_wp_' + image_type] = np.sum(new_gm == 255) / new_gm.size
    return image_features


"""
====================================
LBP operator features (Alina Ivanchenko)
====================================
"""


def get_lbp_features(image_features, gm, image_type):
    lbp_list = [0, 1, 2, 3, 4, 6, 7, 8, 12, 14, 15, 16, 24, 28, 30, 31, 32, 48, 56, 60, 62, 63, 64, 96, 112, 120, 124,
                126, 127, 128, 129, 131, 135, 143, 159, 191, 192, 193, 195, 199, 207, 223, 224, 225, 227, 231, 239, 240,
                241, 243, 247, 248, 249, 251, 252, 253, 254, 255]
    lbp_img = lbp_operator(gm)
    for lbp in lbp_list:
        image_features['gm_lbp' + str(lbp) + '_' + image_type] = np.sum(lbp_img == lbp) / lbp_img.size
    image_features = get_dis_features(image_features, 'gm(lbp)', image_type, lbp_img)
    return image_features


# Checking the location of a pixel outside the image
def out_of_bounds(point, length):
    return (point < 0) | (point > length)


# Transforming image with LBP (Local Binary Patterns) operator
def lbp_operator(gm):
    width, height = gm.shape[0], gm.shape[1]
    lbp_img = []
    for x in range(width):
        for y in range(height):
            index = 0
            ssum = 0
            c_list = []
            for i in range(-1, 2):
                for j in range(-1, 2):
                    if i == 0 and j == 0:
                        continue
                    new_i = i + x
                    new_j = j + y
                    if out_of_bounds(new_i, width - 1) or out_of_bounds(new_j, height - 1):
                        s = 1
                        c_list.append(0)
                    else:
                        num = gm[new_i, new_j] - gm[x, y]
                        if num > 0:
                            s = 0
                        else:
                            s = 1
                        c_list.append(gm[new_i, new_j])
                    ssum += s * (2 ** index)
                    index += 1
            lbp_img.append(ssum)
    return np.asarray(lbp_img, int)


"""
====================================
Set classification features (Dima Hrishko and Sasha Trofimenko)
====================================
"""


def create_dataset(afc_values, structure):
    Y, X = afc_values[:, 0], []
    try:
        for component in structure.split("+"):
            if component == "a":
                X.append(np.ones_like(Y))

            elif component.isdigit():
                X.append(afc_values[:, int(component) - 1])

            elif "^" in component:
                idx = re.search(r"\(([A-Za-z0-9_]+)\)", component).group(1)
                power = component.split("^")[-1]
                x = afc_values[:, int(idx) - 1] ** int(power)
                X.append(x)

            elif "x" in component:  # TODO: update to multiply 2+ arrays
                idxs = np.array(component.split("x")).astype(int)
                x_multiply = afc_values[:, idxs[0] - 1] * afc_values[:, idxs[1] - 1]
                X.append(x_multiply)

        return np.stack(X, axis=0), Y
    except:
        return 0, 0


def direct_calculation(X, Y):
    """
    Прямой подсчет МНК
    X - Матрица объект/свойство
    Y - Вектор выхода
    return a - Вектор параметров
    """
    HS = X.T.dot(X)
    a = np.linalg.inv(HS).dot(X.T).dot(Y)
    return a


"""
====================================
Spatitial scan (Sasha Trofimenko)
====================================
"""


def calc_acf_for_img(box, n):
    """
    Apply autocorrelation function to bounding box
    Parameters
    ----------
    box : 2d numpy array with bounding box image
    n : number of indices for peaks
    Returns
    -------
    indices : 2d numpy array with H_image x N size with indices from acf
    values : 2d numpy array with H_image x N size with values from acf
    Examples
    --------
    # >>> indices, values = calc_acf_for_img(img_array, n=5)
    # >>> indices.shape, values.shape
    (113, 5) (113, 5)
    """
    indices = []
    values = []
    for row in box:
        acf = sm.tsa.stattools.acf(row, fft=False)
        idx = (-acf).argsort()[:n]
        indices.append(idx)
        values.append(row[idx])
    return np.array(indices), np.array(values)


def get_spatial_scan_coeffs(image_features, gm, model_structure, index1, image_type, N=5):
    _, values = calc_acf_for_img(gm, N)
    X, Y = create_dataset(values, model_structure)
    try:
        model_params = direct_calculation(X.T, Y)
        index2 = 1
        for param in model_params:
            image_features['gm_sscoeff' + str(index1) + str(index2) + '_' + image_type] = param
            index2 += 1
    except:
        index2 = 1
        for component in model_structure.split("+"):
            image_features['gm_sscoeff' + str(index1) + str(index2) + '_' + image_type] = 0
            index2 += 1
    return image_features


"""
====================================
Sliding window (Dima Hrishko)
====================================
"""


def get_kernels(gm, h, w, kernel_size, cell_mode=0) -> Optional[np.ndarray]:
    target_index = 0 if cell_mode == 'first' else ceil(kernel_size ** 2 / 2)  # NOTE: tmp solution is left
    target_index = cell_mode  # should be int
    # print('target index = ', target_index)
    values = []
    for i in range(0, h - kernel_size + 1, kernel_size):
        for j in range(0, w - kernel_size + 1, kernel_size):
            values.append(gm[i:i + kernel_size, j:j + kernel_size].reshape(-1))

    values = np.array(values)
    # print(values.shape, gm.shape)
    target = values[:, target_index]
    values = np.delete(values, target_index, 1)
    return np.hstack((np.expand_dims(target, axis=1), values))


def get_sliding_window_coeffs(image_features, gm, model_structure, index1, image_type, kernel_size=3):
    h, w = gm.shape
    if kernel_size > h or kernel_size > w:
        index2 = 1
        for component in model_structure.split("+"):
            image_features['gm_swcoeff' + str(index1) + str(index2) + '_' + image_type] = 0
            index2 += 1
    else:
        values = get_kernels(gm, h, w, kernel_size)
        X, Y = create_dataset(values, model_structure)
        try:
            model_params = direct_calculation(X.T, Y)
            index2 = 1
            for param in model_params:
                image_features['gm_swcoeff' + str(index1) + str(index2) + '_' + image_type] = param
                index2 += 1
        except:
            index2 = 1
            for component in model_structure.split("+"):
                image_features['gm_swcoeff' + str(index1) + str(index2) + '_' + image_type] = 0
                index2 += 1
    return image_features
