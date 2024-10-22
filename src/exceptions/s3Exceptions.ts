import { StatusCode } from 'hono/utils/http-status';
import BaseException from './baseException';

class S3Exception extends BaseException {
  constructor(message: string, status: StatusCode, errData?: any, isOperational = true) {
    super(message, status, errData, isOperational);
  }
}

export default S3Exception;