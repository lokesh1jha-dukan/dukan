import { isAuthenticatedAndUserData } from "@/lib/auth";
import { responseHelper } from "@/lib/helpers";
import prisma from "@/lib/prisma/client";
import { Product, ProductFromDB, Quantity } from "@/types/server/types";

export async function GET(req: Request) {
  try {
    console.log("api/product/route GET")
    const url = new URL(req.url);
    const category_id = Number(url.searchParams.get("categoryId"));
    const seachBy: string | null | undefined = url.searchParams.get("search");


    if ((!category_id || Number.isNaN(category_id)) && (!seachBy)) {
      return responseHelper(
        { message: "Category Id is required or Search keyword is required", statusCode: 400, data: {} },
        400,
      );
    }


    let productsWithQuantities: Product[] = [];
    if (category_id) {
      productsWithQuantities = await prisma.$queryRaw`
      SELECT
        p.*,
        json_agg(q.*) as quantities
      FROM
        products p
      LEFT JOIN
        quantity q
      ON
        p.id = q.product_id
      WHERE
        p.category_id = ${category_id}
      GROUP BY
        p.id
    `;
    }

    if (seachBy) {
      productsWithQuantities = await prisma.$queryRaw`
      SELECT
        p.*,
        json_agg(q.*) as quantities
      FROM
        products p
      LEFT JOIN
        quantity q
      ON
        p.id = q.product_id
      WHERE
        p.name ILIKE '%${seachBy}%' OR p.description ILIKE '%${seachBy}%'
      GROUP BY
        p.id
    `;
    }

    return responseHelper(
      {
        message: "Products fetched successfully",
        statusCode: 200,
        data: productsWithQuantities,
      },
      200,
    );
  } catch (err) {
    console.error(
      "Internal server error in fetching Product By category Id:",
      err,
    );
    return responseHelper(
      { message: "Internal server error in fetching Products", statusCode: 500, data: {} },
      500,
    );
  }
}


export async function POST(req: Request) {
  try {
    const { product }: { product: Product } = await req.json();
    const authData = await isAuthenticatedAndUserData();
    const userId = authData?.user?.id;

    if (!product) {
      return responseHelper(
        { message: "Product is required", statusCode: 400, data: {} },
        400,
      );
    }

    if (!userId) {
      return responseHelper(
        { message: "User id is required", statusCode: 400, data: {} },
        400,
      );
    }

    const newProduct: ProductFromDB = {
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image: product.image,
    }

    const createNewProduct = await prisma.products.create({
      data: {
        ...newProduct,
      },
    });

    const quantities: Quantity[] = product.quantities.map((quantity: any) => {
      return {
        ...quantity,
        is_stock_available: 1,
        product_id: createNewProduct.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    });

    const result = await prisma.quantity.createMany({
      data: quantities
    })

    if (!result) {
      return responseHelper(
        { message: "Quantities not created", statusCode: 400, data: {} },
        400,
      );
    }
    return responseHelper(
      {
        message: "Product created successfully",
        statusCode: 200,
        data: newProduct,
      },
      200,
    );
  } catch (err) {
    console.error("Internal server error in creating Product:", err);
    return responseHelper(
      { message: "Internal server error in creating Product", statusCode: 500, data: {} },
      500,
    );
  }
}



// Replace this code by one query

//   const products: ProductFromDB[] = await prisma.$queryRaw`
//   SELECT * FROM products
//   WHERE category_id = ${Number(category_id)}
// `;

//   // Extract product IDs from the fetched products
//   const productIds: number[] = products.map((product: any) => Number(product.id));

//   const quantityOfProducts: Quantity[] = await prisma.$queryRaw`
//   SELECT * FROM quantity
//   WHERE product_id IN (${Prisma.join(
//     productIds
//   )})`;

//   // Group quantities by product ID
//   const quantitiesByProductId: Record<number, Quantity[]> = {};
//   quantityOfProducts.forEach((quantity: any) => {
//     if (!quantitiesByProductId[quantity.product_id]) {
//       quantitiesByProductId[quantity.product_id] = [];
//     }
//     quantitiesByProductId[quantity.product_id].push(quantity);
//   });

//   // Map quantities to their respective products
//   products.forEach((product: any) => {
//     const productQuantities = quantitiesByProductId[product.id] || [];

//     product.quantities = productQuantities;
//   });




/*
import { Directus } from '@directus/sdk';

// Initialize Directus SDK
const directus = new Directus('https://your-directus-url.com');

// Function to upload an image and associate it with a product
async function addProductWithImage(productName: string, productDescription: string, categoryId: number, imageUUID: string) {
  try {
      // Insert the product data into the products table
      const newProduct = await directus.items('products').create({
          name: productName,
          description: productDescription,
          category_id: categoryId,
          image: imageUUID // Associate the image with the product using its UUID
      });

      console.log('New product added:', newProduct);
      return newProduct;
  } catch (error) {
      console.error('Error adding product:', error);
      throw error;
  }
}

// Example usage
async function main() {
  try {
      // Upload the image to Directus (replace 'path/to/image.jpg' with the actual path to your image file)
      const uploadedImage = await directus.files.upload('path/to/image.jpg');

      // Get the UUID of the uploaded image
      const imageUUID = uploadedImage.data.id;

      // Add the product with the associated image
      const newProduct = await addProductWithImage('Product Name', 'Product Description', 1, imageUUID);

      console.log('New product added:', newProduct);
  } catch (error) {
      console.error('Error:', error);
  }
}

// Call the main function
main();

*/