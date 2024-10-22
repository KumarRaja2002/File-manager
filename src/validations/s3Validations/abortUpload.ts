import { InferInput, nonEmpty, object, pipe, string } from "valibot";
import { FILE_KEY_REQUIRED, FILE_KEY_STRING, UPLOAD_ID_REQUIRED, UPLOAD_ID_STRING } from "../../constants/appMessages";

export const abortUploadData = object({
    file_key: pipe(
        string(FILE_KEY_STRING),
        nonEmpty(FILE_KEY_REQUIRED)
    ),

    upload_id: pipe(
        string(UPLOAD_ID_STRING),
        nonEmpty(UPLOAD_ID_REQUIRED)
    ),
});

export type AbortUploadData = InferInput<typeof abortUploadData>;