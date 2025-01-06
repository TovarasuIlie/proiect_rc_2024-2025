CREATE TABLE IF NOT EXISTS settings
(
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id int(11) NOT NULL,
    desired_temperature int(2) NOT NULL DEFAULT 23,
    threshold int(2) NOT NULL DEFAULT 1,
    CONSTRAINT FK_user_settings FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);