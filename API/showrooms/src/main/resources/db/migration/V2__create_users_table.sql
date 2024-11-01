CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- 255 for bcrypt hashed passwords
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password will be: admin123)
INSERT INTO users (username, password)
VALUES ('admin', '$2y$10$iFtoSxxgwbwn70AQ4N2kQuiAp2Gi7XDKuKL.Y50vg4DHnmjK3CFQS');
