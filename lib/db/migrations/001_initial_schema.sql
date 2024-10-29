-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  budget DECIMAL(10, 2),
  min_hourly_rate DECIMAL(10, 2),
  max_hourly_rate DECIMAL(10, 2),
  estimated_hours INT,
  budget_type ENUM('fixed', 'hourly') NOT NULL,
  scope ENUM('small', 'medium', 'large') NOT NULL,
  duration VARCHAR(20) NOT NULL,
  experience_level ENUM('entry', 'intermediate', 'expert') NOT NULL,
  status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
  payment_status ENUM('pending', 'escrow', 'released', 'refunded') DEFAULT 'pending',
  posted_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id)
);

-- Job Skills table
CREATE TABLE IF NOT EXISTS job_skills (
  job_id VARCHAR(36),
  skill VARCHAR(50),
  PRIMARY KEY (job_id, skill),
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id VARCHAR(36) PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  service_provider_id VARCHAR(36) NOT NULL,
  cover_letter TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  estimated_duration VARCHAR(50) NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (service_provider_id) REFERENCES users(id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(36) PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  reviewer_id VARCHAR(36) NOT NULL,
  reviewee_id VARCHAR(36) NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id),
  FOREIGN KEY (reviewee_id) REFERENCES users(id)
);