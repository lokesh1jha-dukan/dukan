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

