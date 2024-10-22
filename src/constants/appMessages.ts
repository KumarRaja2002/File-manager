export const VALIDATION_FAILED = "Validation failed";
export const EMAIL_EXISTED = "Email already exists";
export const USER_NOT_FOUND = "User not found";
export const INVALID_CREDENTIALS = "Invalid credentials";
export const USER_REGISTERED = "User registered successfully";
export const SOMETHING_WENT_WRONG = "Something went wrong";
export const USER_LOGIN = "User login successfully";
export const USER_FETCHED = "User fetched successfully";
export const USER_UPDATED = "User updated successfully";
export const USER_DELETED = "User deleted successfully";
export const CATEGORIES_CREATED= 'Category created successfully';
export const INTERNAL_SERVER_ERROR=  'Internal Server Error';
export const CATEGORY_STRING='Category name must be a string';
export const CATEGORY_NON_EMPTY='Category not be empty';
export const SLUG_STRING='slug must be a string';
export const SLUG_NON_EMPTY='Slug not be empty';
export const CREATED_BY_NUMBER='Created by must be a number';
export const UPDATED_BY_NUMBER='Updated by should be a number';
export const DESCRIPTION='It should be a group of strings';
export const NAME_ALREADY_EXISTS = "Name already exists";
export const CATEGORY_NOT_FOUND="Category not exist";
export const CATEGORY_FETCHED="Categories fetched successfully";
export const CATEGORY_FOUND = "Category fetched successfully";
export const CATEGORY_UPDATED="Category updated successfully";
export const CATEGORY_DELETED="Category peramantly deleted successsfully";
export const CATEGORY_ARCHIVED="Category deleted successfully"
export const CATEGORY_EXISTS="Category already exists";
export const FILES_NOT_FOUND="Files not found";
export const STATUS_UPDATED_ARCHIVE="Files status updated to archived successfully";
export const ERROR_ARCHIVING_FILES="Error archiving files";
export const FILES_UPLOADED="File uploaded successfully";
export const ERROR_UPLOADING_FILES='Error uploading file';
export const ERROR_FETCHING_FILES="Error fetching files";
export const FILE_NOT_FOUND="File not found";
export const CATEGORY_RESTORED="Category restored";
export const CATEGORIES_RETRIVED="Categories retrived successfully";


//Multi-Part constants

export const MULTIPART_UPLOAD_START = "Multipart upload started successfully";
export const MULTIPART_UPLOAD_URLS = "Multipart upload URLs fetched successfully";
export const MULTIPART_UPLOAD_SUCCESS = "File uploaded successfully";
export const MULTIPART_UPLOAD_FAILED = "Multipart upload failed";
export const MULTIPART_UPLOAD_URLS_FAILED = "Failed to fetch multipart upload URLs";
export const MULTIPART_UPLOAD_START_FAILED = "Failed to start multipart upload";
export const MULTIPART_UPLOAD_ABORTED_FAILED = "Failed to abort multipart upload";
export const MULTIPART_UPLOAD_ABORTED = "Multipart upload aborted";

export const FILE_ORIGINAL_NAME_REQUIRED = "File name is required";
export const FILE_ORIGINAL_NAME_AT_LEAST_5_CHARACTERS = "File name contains at least 5 characters";
export const FILE_NAME_IS_STRING = "File name must be a string";
export const FILE_TYPE_REQUIRED = "File type is must be image, media, document, other";
export const FILE_TYPE_STRING = "File type must be a string";
export const FILE_SIZE_IS_NUMBER = "File size must be a number";

export const FILE_KEY_REQUIRED = "File key is required";
export const FILE_KEY_STRING = "File key must be a string";

export const UPLOAD_ID_REQUIRED = "Upload id is required";
export const UPLOAD_ID_STRING = "Upload id must be a string";

export const PARTS_NUMBER = "Parts must be a number";

export const ETAG_REQUIRED = "ETag is required";
export const ETAG_STRING = "ETag must be a string";

export const FILED_TO_FETCH_INCOMPLETE_PARTS = "Failed to fetch incomplete parts";
export const FETCHED_INCOMPLETE_PARTS = "Fetched incomplete parts successfully";
export const CANT_UPDATE="Cannot update an archived category";

//Single-File upload

export const FILE_NAME_REQUIRED = 'File name is required';
export const FILE_NAME_AT_LEAST_3_CHARACTERS = 'File name must be at least 3 characters';
export const FILE_SIZE_REQUIRED = 'File size is required';
export const PRESIGNED_URL_GENERATED = 'Presigned URL generated successfully';
export const AUTHENTICATION_FAILED = 'User not authenticated';
export const FILE_UPLOADED= 'File uploaded successfully';;
export const FILE_FETCHED= 'File fetched successfully';
export const STATUS_UPDATED_TO_ARCHIVE= 'File deleted successfully';
export const NO_FILES_FOUND="No files found for the given IDs and category";
export const FILES_ARCHIVED="Files deleted successfully";
export const FILES_FETCHED = "Files fetched successfully"

//User

export const EMAIL_REQUIRED = 'Email is required';
export const EMAIL_STRING = 'Email must be a string';
export const EMAIL_INVALID = 'Email is not valid';
export const PASSWORD_REQUIRED = 'Password is required';
export const PASSWORD_STRING = 'Password must be a string';
export const INVALID_FILE_TYPE = "Invalid file type. Allowed types are 'image', 'media', 'document', or 'other'.";
export const INVALID_FILE_STATUS = "Invalid file status. Allowed statuses are 'active' or 'archieved'.";
export const CATEGORY_ID_REQUIRED = "Category ID is required.";
export const FILE_STATUS_REQUIRED = "File status is required.";

export const ARCIVED_FILES_NOT_FOUND = 'No archived files found for the user.';
export const FILES_DELETED = 'Archived files deleted successfully.';
export const FILE_NON_EMPTY = 'File name cannot be empty.';
export const STORAGE_FETCHED= 'Storage fetched successfully';
export const TITLE_IS_REQUIRED = 'Title is required';
export const MIME_IS_REQUIRED = 'Mime type is required';
export const PATH_IS_REQUIRED = 'Path is required';
export const SIZE_IS_REQUIRED = 'Size is required';
export const SIZE_MUST_BE_GREATER_THAN_ZERO = 'Size must be greater than 0';
export const FILE_DELETED = 'File deleted successfully';
export const FILE_RESTORED = 'File restored successfully';

