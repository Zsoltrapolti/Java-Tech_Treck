CREATE TABLE user_products (
                               user_id BIGINT NOT NULL,
                               product_id BIGINT NOT NULL,

                               CONSTRAINT pk_user_products
                                   PRIMARY KEY (user_id, product_id),

                               CONSTRAINT fk_user_products_user
                                   FOREIGN KEY (user_id)
                                       REFERENCES users(id)
                                       ON DELETE CASCADE,

                               CONSTRAINT fk_user_products_product
                                   FOREIGN KEY (product_id)
                                       REFERENCES product(id)
                                       ON DELETE CASCADE
);
