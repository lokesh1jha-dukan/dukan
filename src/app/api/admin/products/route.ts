import { responseHelper } from "@/lib/helpers";
import prisma from '@/lib/prisma/client';
import { Product, ProductFromDB, Quantity } from "@/types/server/types";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    let category_id: Number | undefined = Number(url.searchParams.get("categoryId"));
    const searchWith: string | null | undefined = url.searchParams.get("searchWith");

    let whereClause = "";

    if (!category_id || Number.isNaN(category_id)) {
      category_id = undefined;
    } else {
      whereClause = whereClause ? whereClause + " AND p.category_id = " + category_id : "WHERE p.category_id = " + category_id;
    }

    if (searchWith) {
      whereClause = whereClause ? whereClause + " AND p.name ILIKE '%" + searchWith + "%'" : "WHERE p.name ILIKE '%" + searchWith + "%'";
    }


    const productsWithQuantities: Product[] = await prisma.$queryRaw`
    SELECT
        p.*,
        json_agg(q.*) as quantities
    FROM
        products p
    LEFT JOIN
        quantity q
    ON
        p.id = q.product_id
    GROUP BY p.id`

    return responseHelper(
      {
        message: "Products fetched successfully",
        statusCode: 200,
        data: productsWithQuantities,
      },
      200
    );
  } catch (err) {
    console.error("Internal server error in fetching Products:", err);
    return responseHelper(
      { message: "Internal server error in fetching Products", statusCode: 500, data: {} },
      500
    );
  }
}



export async function POST(req: Request) {
  try {
    const { product }: { product: Product } = await req.json();

    if (!product) {
      return responseHelper(
        { message: "Product is required", statusCode: 400, data: {} },
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



export async function PATCH(req: Request) {
  try {
    const { product }: { product: Product } = await req.json();
    if (!product.id) {
      throw new Error("Product id is required");
    }

    const product_id = Number(product.id);

    // Prepare product data for update
    const productDataForDB: ProductFromDB = {
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image: product.image,
    }

    // Begin transaction
    const updatedProduct = await prisma.$transaction([
      // Update product
      prisma.products.update({
        where: { id: product_id },
        data: productDataForDB,
      }),

      // Update quantities with existing IDs
      ...product.quantities.filter(q => q.id).map(quantity => prisma.quantity.update({
        where: { id: quantity.id },
        data: { is_stock_available: 1, updated_at: new Date().toISOString() },
      })),

      // Create new quantities without IDs
      prisma.quantity.createMany({
        data: product.quantities.filter(q => !q.id).map(quantity => ({
          ...quantity,
          is_stock_available: 1,
          product_id: product_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })),
      }),
    ]);

    return responseHelper({
      message: "Product updated successfully",
      statusCode: 200,
      data: updatedProduct[0],
    }, 200);
  } catch (error) {
    console.error("Internal server error in updating Product:", error);
    return responseHelper({
      message: "Internal server error in updating Product",
      statusCode: 500,
      data: {},
    }, 500);
  } finally {
    await prisma.$disconnect();
  }
}
