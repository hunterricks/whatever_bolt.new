-- Add screening questions support
ALTER TABLE jobs
ADD COLUMN screening_questions JSON DEFAULT NULL;

-- Add answers to applications
ALTER TABLE applications
ADD COLUMN question_answers JSON DEFAULT NULL;