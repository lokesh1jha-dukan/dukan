export type DirectusCartItem = {
    quantity: number,
    product_id: {
        id: number,
        name: string
        description: string
        price: string, 
        stocked_quantity: number
        category_id: number
        created_at: string
        updated_at: string
        image: string
        quantity: string
    }
}