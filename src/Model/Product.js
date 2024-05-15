export class Product{
    product_id;
    image_url;
    price;
    product_name;

    constructor(product_id, image_url, price, product_name) {
        this.product_id = product_id;
        this.image_url = image_url;
        this.price = price;
        this.product_name = product_name;
    }
}