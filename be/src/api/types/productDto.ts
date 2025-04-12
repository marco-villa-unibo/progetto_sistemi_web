import { components } from '../schemas';
import { createEnumObjectFromType } from '../../utils/helpers';

// PRODUCT
export type ProductDTO = components['schemas']['Product'];

// CATEGORY
export type CategoryDTO = components['schemas']['Category'];

export const CategoryEnum = createEnumObjectFromType<CategoryDTO>({
  BANCO: 'BANCO',
  ORTOFRUTTA: 'ORTOFRUTTA',
  SURGELATI: 'SURGELATI',
  CASA: 'CASA',
  ELETTRONICA: 'ELETTRONICA',
  LIQUORI: 'LIQUORI',
});
