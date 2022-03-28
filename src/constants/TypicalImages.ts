import convexHorNorm from '../assests/Convex_Norm.png';
import convexHorPatology from '../assests/Convex_Pathology.png';
import convexHorStrangeNorm from '../assests/Convex_Strange_Norm.png';
import convexVertNorm from '../assests/Convex_Norm.png';
import convexVertPatology from '../assests/Convex_Pathology.png';
import convexVertStrangeNorm from '../assests/Convex_Strange_Norm.png';
import linearHorNorm from '../assests/Linear_Norm.png';
import linearHorPatology from '../assests/Linear_Pathology.png';
import linearHorStrangeNorm from '../assests/Linear_Strange_Norm.png';
import linearVertNorm from '../assests/Linear_Norm.png';
import linearVertPatology from '../assests/Linear_Pathology.png';
import linearVertStrangeNorm from '../assests/Linear_Strange_Norm.png';
import reinforcedHorNorm from '../assests/Reinforced_Norm.png';
import reinforcedHorPatology from '../assests/Reinforced_Pathology.png';
import reinforecedHorStrangeNorm from '../assests/Reinforced_Strange_Path.png';
import reinforcedVertNorm from '../assests/Reinforced_Norm.png';
import reinforcedVertPatology from '../assests/Reinforced_Pathology.png';
import reinforcedVertStrangeNorm from '../assests/Reinforced_Strange_Path.png';

export const TYPICAL_IMAGES = {
  convex: {
    vert: [
      { image: convexVertNorm, name: 'Норма' },
      { image: convexVertPatology, name: 'Патологія' },
      { image: convexVertStrangeNorm, name: 'Не визначено' },
    ],
    hor: [
      { image: convexHorNorm, name: 'Норма' },
      { image: convexHorPatology, name: 'Патологія' },
      { image: convexHorStrangeNorm, name: 'Не визначено' },
    ],
  },
  linear: {
    vert: [
      { image: linearVertNorm, name: 'Норма' },
      { image: linearVertPatology, name: 'Патологія' },
      { image: linearVertStrangeNorm, name: 'Не визначено' },
    ],
    hor: [
      { image: linearHorNorm, name: 'Норма' },
      { image: linearHorPatology, name: 'Патологія' },
      { image: linearHorStrangeNorm, name: 'Не визначено' },
    ],
  },
  reinforced_linear: {
    vert: [
      { image: reinforcedVertNorm, name: 'Норма' },
      { image: reinforcedVertPatology, name: 'Патологія' },
      { image: reinforcedVertStrangeNorm, name: 'Не визначено' },
    ],
    hor: [
      { image: reinforcedHorNorm, name: 'Норма' },
      { image: reinforcedHorPatology, name: 'Патологія' },
      { image: reinforecedHorStrangeNorm, name: 'Не визначено' },
    ],
  },
};
