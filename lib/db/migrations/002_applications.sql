-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(36) PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  contractor_id VARCHAR(36) NOT NULL,
  cover_letter TEXT NOT NULL,
  proposed_rate DECIMAL(10, 2) NOT NULL,
  estimated_duration VARCHAR(100) NOT NULL,
  availability VARCHAR(255) NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (contractor_id) REFERENCES users(id),
  UNIQUE KEY unique_application (job_id, contractor_id)
);