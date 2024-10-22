import {description, InferInput, nonEmpty, object, pipe, string,nullish,number, regex }from 'valibot';
import { CATEGORY_STRING,CATEGORY_NON_EMPTY,DESCRIPTION} from '../../../constants/appMessages';
//@ts-ignore
export const createCategorySchema = object({
    name:pipe(
        //@ts-ignore
        string(CATEGORY_STRING),nonEmpty(CATEGORY_NON_EMPTY),regex(/(.|\s)*\S(.|\s)*/,CATEGORY_NON_EMPTY)),
    description:nullish(
        //@ts-ignore
        string(DESCRIPTION)),
    
    slug:nullish(
        //@ts-ignore
        string()),
    created_by:nullish(
        //@ts-ignore
        number()),
    updated_by:nullish(
        //@ts-ignore
        number()
    )
  });
  
  export type createCategoryDataInput = InferInput<typeof createCategorySchema>