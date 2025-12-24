package ro.krumpi.demo.repository;
import ro.krumpi.demo.model.stock.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findByName(String name);
    boolean existsByName(String name);

    List<Product> findAllByOwnerUsername(String username);
}