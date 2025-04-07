import { components } from '../schemas';
import { createEnumObjectFromType } from '../utils/helpers';

export type CategoryDto = components['schemas']['Category'];

export const CategoryEnum = createEnumObjectFromType<CategoryDto>({
  BANCO: 'BANCO',
  ORTOFRUTTA: 'ORTOFRUTTA',
  SURGELATI: 'SURGELATI',
});
