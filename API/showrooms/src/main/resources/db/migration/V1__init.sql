-- V1__init.sql
CREATE TABLE showrooms (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    commercial_registration_number DECIMAL(10,0) NOT NULL UNIQUE,
    manager_name VARCHAR(100),
    contact_number DECIMAL(15,0) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE cars (
    id BIGSERIAL PRIMARY KEY,
    vin VARCHAR(25) NOT NULL,
    maker VARCHAR(25) NOT NULL,
    model VARCHAR(25) NOT NULL,
    model_year DECIMAL(4,0) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    showroom_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_showroom FOREIGN KEY (showroom_id) REFERENCES showrooms(id)
);

---- Create indexes for better query performance
--CREATE INDEX idx_showroom_crn ON showrooms(commercial_registration_number) WHERE NOT deleted;
--CREATE INDEX idx_cars_maker ON cars(maker) WHERE NOT deleted;
--CREATE INDEX idx_cars_showroom ON cars(showroom_id) WHERE NOT deleted;