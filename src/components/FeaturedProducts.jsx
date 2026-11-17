import ProductCard from "./ProductCard";
import Carousel from "./Carousel";
import { products } from "../data/products";
import "./FeaturedProducts.css";

export default function FeaturedProducts() {
  return (
    <section className="section featured-products">
      <div className="container">
        <Carousel title="Shop Our Products">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
