import * as v from 'valibot';
import { VALIDATION_FAILED } from '../constants/appMessages';
import UnprocessableContentException from '../exceptions/unproccessableContentException';

const validate = (schema: any, data: any) => {
     //@ts-ignore
    const validatedData = v.safeParse(schema, data, { abortPipeEarly: true });
    if (!validatedData.success) {
        const issues = v.flatten(validatedData.issues);
        throw new UnprocessableContentException(VALIDATION_FAILED, issues.nested);
    } else {
        return validatedData.output
    }
};

export default validate