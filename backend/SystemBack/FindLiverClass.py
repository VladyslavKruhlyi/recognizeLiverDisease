import json
import os

import numpy as np
import pandas as pd

from CalculateImageFeatures import get_all_features


def tree_prediction(tree, img_f):
    tree = pd.DataFrame(tree)
    index = 0
    leaf = 1
    flag = False
    y_hat = -1
    while not flag:
        node = tree.loc[index]
        node_X = img_f[node['feature']]
        if node['side'] == 1:
            if node_X < node['threshold']:
                y_hat = 0
            else:
                y_hat = 1
        else:
            if node_X < node['threshold']:
                y_hat = 1
            else:
                y_hat = 0
        if np.where((tree['previous_leaf'] == leaf) & (tree['previous_direction']) == y_hat + 1)[0].size > 0:
            index = np.where((tree['previous_leaf'] == leaf) & (tree['previous_direction'] == y_hat + 1))[0][0]
            leaf = tree.loc[index]['leaf_number']
        else:
            flag = True
    return y_hat


def forest_prediction(sensor_type, img_f):
    with open(os.path.join('/home/engineer/CRM/hospital-crm-master/backend/SystemBack/Classifiers/GeneticForests', sensor_type + '.json')) as f:
        forest = json.load(f)
    y_proba = 0
    for obj in forest:
        tree = obj['tree']
        y_pred = tree_prediction(tree, img_f)
        y_proba += y_pred * obj['weight']
    if y_proba < 0.5:
        y_hat = 0
    else:
        y_hat = 1
    if y_hat == 0:
        y_proba = 1 - y_proba
    return y_proba, y_hat


def get_mean_signs(sensor_type, img_f):
    # if task_type == 1:
    if sensor_type == 'convex':
        feature1, feature2, feature3 = 'gm_wp_eq', 'horglrlm1l_entropy_orig', 'horglrlm2l_cov_eq'
        threshold1, threshold2, threshold3 = 0.558094, 4.181608, 2.276130
        value1, value2, value3 = img_f[feature1], img_f[feature2], img_f[feature3]
        if value1 < threshold1:
            res1 = 'Печень в норме'
        else:
            res1 = 'Печень не в норме'
        if value2 < threshold2:
            res2 = 'Печень в норме'
        else:
            res2 = 'Печень не в норме'
        if value3 < threshold3:
            res3 = 'Печень не в норме'
        else:
            res3 = 'Печень в норме'
    elif sensor_type == 'linear':
        feature1, feature2, feature3 = 'gm_wp_eq', 'horglrlm2l_entropy_eq', 'horglrlm2l_entropy_orig'
        threshold1, threshold2, threshold3 = 0.543821, 3.788145, 3.718229
        value1, value2, value3 = img_f[feature1], img_f[feature2], img_f[feature3]
        if value1 < threshold1:
            res1 = 'Печень в норме'
        else:
            res1 = 'Печень не в норме'
        if value2 < threshold2:
            res2 = 'Печень в норме'
        else:
            res2 = 'Печень не в норме'
        if value3 < threshold3:
            res3 = 'Печень не в норме'
        else:
            res3 = 'Печень в норме'
    elif sensor_type == 'reinforced_linear':
        feature1, feature2, feature3 = 'gm_wp_eq', 'gm_lbp255_eq', 'gm_lbp159_eq'
        threshold1, threshold2, threshold3 = 0.436147, 0.044118, 0.005618
        value1, value2, value3 = img_f[feature1], img_f[feature2], img_f[feature3]
        if value1 < threshold1:
            res1 = 'Печень в норме'
        else:
            res1 = 'Печень не в норме'
        if value2 < threshold2:
            res2 = 'Печень в норме'
        else:
            res2 = 'Печень не в норме'
        if value3 < threshold3:
            res3 = 'Печень в норме'
        else:
            res3 = 'Печень не в норме'
    else:
        feature1, feature2, feature3 = '', '', ''
        threshold1, threshold2, threshold3 = 0, 0, 0
        value1, value2, value3 = 0, 0, 0
        res1, res2, res3 = 0, 0, 0
    return [{'feature': feature1, 'threshold': threshold1, 'value': value1, 'result': res1},
            {'feature': feature2, 'threshold': threshold2, 'value': value2, 'result': res2},
            {'feature': feature3, 'threshold': threshold3, 'value': value3, 'result': res3}]


def get_classification_results(parameters):
    # тип датчика
    sensor_type = parameters['sensor_type']
    # task_type: 1 - норма/патология, 2 - стадия фиброза
    task_type = parameters['task_type']
    # настройки для получения текстурных признаков
    settings = parameters['settings']
    diff_indices = settings['diff_indices']  # оттенки серого для бинаризации
    ss_list = settings['ss_list']  # структура моделей пространственной развертки
    sw_list = settings['sw_list']  # структура моделей скользящего окна
    best_grad = settings['best_grad']  # лучшая градация серого для классификации "норма-патология"
    best_d = settings['best_d']  # лучшая диагональ
    best_p = settings['best_p']  # лучший перпендикуляр к лучшей диагонали
    best_pairs = settings['best_pairs']  # лучшие пары оттенков серого
    # текстурные матрицы
    texture_matrices = parameters['texture_matrices']
    # расчёт признаков
    img_f = {}
    image_type = 'orig'
    gm = texture_matrices[image_type]['gm']
    glcm0, glcm90 = texture_matrices[image_type]['glcm0'], texture_matrices[image_type]['glcm90']
    glrlm0, glrlm90 = texture_matrices[image_type]['glrlm0'], texture_matrices[image_type]['glrlm90']
    img_f = get_all_features(img_f, image_type, gm, glcm0, glcm90, glrlm0, glrlm90,
                             diff_indices['indices'], ss_list['structure'], sw_list['structure'],
                             best_grad, best_d, best_p, best_pairs)
    image_type = 'eq'
    gm = texture_matrices[image_type]['gm']
    glcm0, glcm90 = texture_matrices[image_type]['glcm0'], texture_matrices[image_type]['glcm90']
    glrlm0, glrlm90 = texture_matrices[image_type]['glrlm0'], texture_matrices[image_type]['glrlm90']
    img_f = get_all_features(img_f, image_type, gm, glcm0, glcm90, glrlm0, glrlm90,
                             diff_indices['indices'], ss_list['structure'], sw_list['structure'],
                             best_grad, best_d, best_p, best_pairs)

    # Генетический лес
    gf_prob, gf_class = forest_prediction(sensor_type, img_f)
    gf_result = 'Печень в норме' if gf_class == 0 else 'Печень не в норме'

    # Пороги трёх наилучших признаков
    mean_signs = get_mean_signs(sensor_type, img_f)

    return {'gf_result': gf_result, 'gf_probability': round(gf_prob * 100, 1), 'mean_signs': mean_signs}
