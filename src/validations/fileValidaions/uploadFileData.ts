import { InferInput, minLength, number, object, pipe, string, picklist, optional, array, regex, nonEmpty } from 'valibot';
import {  FILE_TYPE_REQUIRED, FILE_SIZE_IS_NUMBER, TITLE_IS_REQUIRED, FILE_NAME_REQUIRED, MIME_IS_REQUIRED, PATH_IS_REQUIRED, SIZE_IS_REQUIRED } from '../../constants/appMessages';

// Validation schema for uploading files
export const singleFileData = object(
  //@ts-ignore
  {
  name: pipe(
     //@ts-ignore
    string(),regex(/(.|\s)*\S(.|\s)*/,FILE_NAME_REQUIRED), minLength(1, FILE_NAME_REQUIRED)
  ),

  title:pipe(
    //@ts-ignore
    string(),regex(/(.|\s)*\S(.|\s)*/,TITLE_IS_REQUIRED), nonEmpty()
  ),

  mime_type: pipe(
    //@ts-ignore
    string(),regex(/(.|\s)*\S(.|\s)*/,MIME_IS_REQUIRED), minLength(1, FILE_TYPE_REQUIRED)
  ),

  size: pipe(
     //@ts-ignore
    number(), number(FILE_SIZE_IS_NUMBER),minLength(1, SIZE_IS_REQUIRED)
  ),

 

  type: pipe(
    //@ts-ignore
    string(),picklist(['image', 'media', 'document', 'other'], FILE_TYPE_REQUIRED)
  ),
    
  path: pipe(
    //@ts-ignore
    string(), regex(/(.|\s)*\S(.|\s)*/, PATH_IS_REQUIRED),minLength(1, PATH_IS_REQUIRED) 
  ),
    

  categoryId: optional(//@ts-ignore
  number()), 
  uploadedBy: optional(//@ts-ignore
  number()), 
  tags: optional(//@ts-ignore
  array(string()))
  
});

export type SingleFileDataInput = InferInput<typeof singleFileData>;




















