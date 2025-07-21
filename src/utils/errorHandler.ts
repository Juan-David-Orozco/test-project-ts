import { Response } from 'express';

export const handleServiceError = (res: Response, error: any, defaultMessage: string = 'An unexpected error occurred.') => {
  if (error instanceof Error) {
    // Known error from our services
    res.status(400).json({ message: error.message });
  } else {
    // Unknown or generic error
    console.error(error); // Log the full error for debugging
    res.status(500).json({ message: defaultMessage });
  }
};