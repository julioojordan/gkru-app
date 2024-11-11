CREATE TABLE users
(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL,
    password TEXT,
    PRIMARY KEY (id)
)ENGINE InnoDB;