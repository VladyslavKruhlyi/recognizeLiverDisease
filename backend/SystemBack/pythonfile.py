import os
import sys
import TextureMatrices as TM
from FindLiverClass import get_classification_results
from MakeRepresentation import get_transformed_image
import json

if __name__ == '__main__':
    # Входные аргументы
    link = sys.argv[1]
    task_type = sys.argv[2]
    sensor_type = sys.argv[3]
    path_to_save = sys.argv[4]

    load_dir = 'Settings'
    with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), load_dir, 'DiffIndices', sensor_type + '.json')) as f:
        diff_indices = json.load(f)
    with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), load_dir, 'SpatialScan', sensor_type + '.json')) as f:
        ss_list = json.load(f)
    with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), load_dir, 'SlidingWindow', sensor_type + '.json')) as f:
        sw_list = json.load(f)
    with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), load_dir, 'BestGrad', sensor_type + '.json')) as f:
        best_grad = json.load(f)
    with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), load_dir, 'BestDiagonal', sensor_type + '.json')) as f:
        best_d = json.load(f)
    with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), load_dir, 'BestPerpendicular', sensor_type + '.json')) as f:
        best_p = json.load(f)
    with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), load_dir, 'PairEnsembles', sensor_type + '.json')) as f:
        best_pairs = json.load(f)

    settings = {'diff_indices': diff_indices, 'ss_list': ss_list, 'sw_list': sw_list, 'best_grad': best_grad,
                'best_d': best_d, 'best_p': best_p, 'best_pairs': best_pairs}

    orig_matrix = TM.get_greyscale_matrix(link)
    orig_gm, orig_glcm0, orig_glcm90, orig_glrlm0, orig_glrlm90 = TM.find_matrices(
        orig_matrix)
    eq_gm, eq_glcm0, eq_glcm90, eq_glrlm0, eq_glrlm90 = TM.find_matrices(
        TM.get_eq_matrix(orig_matrix))

    texture_matrices = {
        'orig': {'gm': orig_gm, 'glcm0': orig_glcm0, 'glcm90': orig_glcm90, 'glrlm0': orig_glrlm0,
                 'glrlm90': orig_glcm90},
        'eq': {'gm': eq_gm, 'glcm0': eq_glcm0, 'glcm90': eq_glcm90, 'glrlm0': eq_glrlm0, 'glrlm90': eq_glcm90}}

    res = get_classification_results({'task_type': task_type, 'sensor_type': sensor_type, 'settings': settings,
                                      'texture_matrices': texture_matrices})
                                      
    print(json.dumps(res))
    get_transformed_image(TM.get_eq_matrix(orig_matrix),
                          diff_indices['indices'], path_to_save)
