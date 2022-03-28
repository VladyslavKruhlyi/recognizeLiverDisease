import numpy as np
import pandas as pd
import FeaturesStack as FS


def glcm_features(image_features, glcm, glcm_type, image_type, best_grad, best_d, best_p, best_pairs):
    glcm = pd.DataFrame(glcm, columns=['x', 'y', 'z'])
    image_features = FS.get_glcm_features(image_features, glcm_type, image_type, glcm,
                                          best_grad[glcm_type + '_' + image_type], best_d[glcm_type + '_' + image_type],
                                          best_p[glcm_type + '_' + image_type])
    if not image_type == 'orig':
        image_features = FS.get_pair_ensembles(image_features, glcm_type, image_type, glcm,
                                               best_pairs[glcm_type + '_' + image_type])
    return image_features


def glrlm_features(image_features, glrlm, glrlm_type, image_type):
    glrlm = pd.DataFrame(glrlm)
    image_features = FS.get_diffs(image_features, glrlm_type, image_type, glrlm)
    image_features = FS.get_dis_features(image_features, glrlm_type + 'glrlm1l', image_type, glrlm[0])
    image_features = FS.get_dis_features(image_features, glrlm_type + 'glrlm2l', image_type, glrlm[1])
    image_features = FS.get_dis_features(image_features, glrlm_type + 'glrlm3l', image_type, glrlm[2])
    return image_features


def get_all_features(image_features, image_type,
                     init_gm, glcm0, glcm90, glrlm0, glrlm90,
                     diff_indices, ss_list, sw_list, best_grad, best_d, best_p, best_pairs):
    # gm
    gm = np.concatenate(np.asarray(init_gm), axis=None)
    image_features = FS.get_ex_grads(image_features, image_type, gm)
    if not image_type == 'orig':
        image_features = FS.get_dis_features(image_features, 'gm', image_type, gm)
    if image_type == 'eq':
        image_features = FS.get_wp(image_features, gm, diff_indices, image_type)
    if image_type == 'orig':
        index = 1
        for model_structure in ss_list:
            image_features = FS.get_spatial_scan_coeffs(image_features, np.asarray(init_gm), model_structure, index,
                                                        image_type)
            index += 1
        index = 1
        for model_structure in sw_list:
            image_features = FS.get_sliding_window_coeffs(image_features, np.asarray(init_gm), model_structure, index,
                                                          image_type)
            index += 1
    ## lbp
    image_features = FS.get_lbp_features(image_features, np.asarray(init_gm), image_type)

    # glcms
    ## hor glcm (0 degree)
    image_features = glcm_features(image_features, glcm0, 'hor', image_type, best_grad, best_d, best_p, best_pairs)
    ## vert glcm (90 degree)
    image_features = glcm_features(image_features, glcm90, 'vert', image_type, best_grad, best_d, best_p, best_pairs)

    # glrlms
    ## hor glrlm (0 degree)
    image_features = glrlm_features(image_features, glrlm0, 'hor', image_type)
    ## vert glrlm (90 degree)
    image_features = glrlm_features(image_features, glrlm90, 'vert', image_type)
    return image_features
