import { InferInput, minLength, number, object, pipe, string } from 'valibot';
import { FILE_TYPE_REQUIRED, FILE_SIZE_IS_NUMBER, FILE_NAME_REQUIRED } from '../../constants/appMessages';

// Validation schema for generating presigned URL
export const generatePresignedUrlData = object({
  fileName: pipe(
    string("File name must be a string"), // Must be a string
    minLength(1, FILE_NAME_REQUIRED) // Minimum length of 3 characters
  ),

  fileType: pipe(
    string(), // Must be a string
    minLength(1, FILE_TYPE_REQUIRED) // Required field
  ),

  fileSize: pipe(
    number(), // Must be a number
    number(FILE_SIZE_IS_NUMBER) // Validates that file_size is a number
  )
});

export type GeneratePresignedUrlDataInput = InferInput<typeof generatePresignedUrlData>;
