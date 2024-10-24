import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


const AdminDashboard = () => {
    return (
        <div>
            <div className="grid grid-cols-3 gap-4 mt-4 mr-4" >
                <Card>
                    <CardHeader>
                        <CardTitle>New Orders</CardTitle>
                        <CardDescription>Orders to be processed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-bold">52</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Out For Delivery</CardTitle>
                        <CardDescription>Orders currently being out for delivery</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-bold">12</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Due Orders</CardTitle>
                        <CardDescription>Orders due to be processed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-bold">5</p>
                    </CardContent>
                </Card>
            </div>

            {/* last 30 Days orders count chart */}
            
        </div>
    )
}

export default AdminDashboard