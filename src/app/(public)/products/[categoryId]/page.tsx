import { getProductsByCategoryId } from "@/lib/directus/methods"


type Props = {
  params: { slug: string } 
}

const Page = async ({ params }: { params: { categoryId: string } }) => {
  const slug = params.categoryId
  const categoryProducts = await getProductsByCategoryId(slug)
  console.log(categoryProducts, "categoryProducts")
  return (
    <div>
      landed
    </div>
  )
}

export default Page