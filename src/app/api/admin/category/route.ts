import { responseHelper } from '@/lib/helpers';
import prisma from '@/lib/prisma/client';


export async function POST(req: Request) {
    try {

        const { name }: { name: string; } = await req.json();
        if (name) {
            await prisma.categories.create({
                data: {
                    name,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });
            return responseHelper({ message: 'Category created successfully', statusCode: 200, data: {} }, 200);
        }
        return responseHelper({ message: 'Invalid request', statusCode: 400, data: {} }, 400);
    } catch (err) {
        console.error('Internal server error:', err);
        return responseHelper({ message: 'Internal server error', statusCode: 500, data: {} }, 500);
    }
}

        