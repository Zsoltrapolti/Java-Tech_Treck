package ro.krumpi.demo.repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.krumpi.demo.model.stock.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findByName(String name);
    boolean existsByName(String name);

    @Modifying
    @Query("UPDATE Product p SET p.quantity = p.quantity - :amount WHERE p.name = :name AND p.quantity >= :amount")
    int decrementStock(@Param("name") String name, @Param("amount") int amount);
}
