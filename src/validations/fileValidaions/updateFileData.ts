import { InferInput, object, pipe, string, regex, minLength } from 'valibot';
import { TITLE_IS_REQUIRED } from '../../constants/appMessages';

export const updateFileData = object({
  title: pipe(
    string(),
    minLength(3, TITLE_IS_REQUIRED), 
    regex(/^[^\s].*[^\s]$/, TITLE_IS_REQUIRED)
  ),
});

export type UpdateFileDataInput = InferInput<typeof updateFileData>;