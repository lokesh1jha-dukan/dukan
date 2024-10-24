"use client"
import PaymentOptions from "@/components/block/page/payment/paymentOptions";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { fetchInsideTryCatch } from "@/lib/client/apiUtil";
import { Address, PaymentOption } from "@/types/client/types";
import { Select } from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


interface Props { }

interface TotalAmount {
    totalCartSum: number;
}

export default function Page(props: Props) {
    const [addressList, setAddressList] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [idtoAddressMap, setIdtoAddressMap] = useState<{ [key: number]: string }>({});
    const [selectedOption, setSelectedOption] = useState<PaymentOption>("COD");
    const [totalAmount, setTotalAmount] = useState<TotalAmount>({ totalCartSum: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()


    useEffect(() => {
        loadAddresses();
        calTotalAmount();
    }, []); 


    const loadAddresses = async () => {
        try {
            const response = await fetchInsideTryCatch('/api/profile/address');
            if (response && response.response.statusCode === 200 && response.response.data) {
                setAddressList(response.response.data as Address[]);
                await buildFullAddress(response.response.data as Address[]);

            }
        } catch (error) {
            console.error('Error loading addresses:', error);
        }
    };

    const buildFullAddress = async (addressList: Address[]) => {
        let item: any = {}
        for (const address of addressList) {
            if (address.id) {
                item[address.id] =
                    address.address_line1 + ", "
                    + address.address_line2 + ", "
                    + address.city + ", "
                    + address.state + ", "
                    + address.country + ", "
                    + address.postal_code
            }
        }
        setIdtoAddressMap(item);
    }

    const goToProfileAddressPage = () => {
        console.log("Add new address clicked");
    };

    const handleAddressChange = (value: any) => {
        setSelectedAddressId(value);
    };

    const calTotalAmount = async () => {
        const totalAmt = await fetchInsideTryCatch('/api/cart/total')
        if(totalAmt?.response.data && totalAmt.response.data) {
            // console.log(totalAmt?.response.data)
        let total = totalAmt.response.data
        setTotalAmount(total as TotalAmount);
        }
        
    }

    const isAllFieldsFilled = () => {
        if(selectedAddressId && selectedOption) {
            return true;
        }
        return false;
    }
    const placeOrder = async () => {
        setIsLoading(true);
        const response = await fetchInsideTryCatch('api/order', {
            method: 'POST',
            body: JSON.stringify({
                addressId: selectedAddressId,
                paymentOption: selectedOption,
                fullAddress: idtoAddressMap[Number(selectedAddressId)],
                cartTotal: totalAmount.totalCartSum
            })
        })
        setIsLoading(false);
        if(response && response.response.statusCode === 200 && response.response.data) {
            console.log(response.response.data)
        }
        router.push('/products')
        toast.success("Order Placed Successfully");
    };

    return (
        <div className="container">
            <h1 className="text-3xl font-bold mt-2 mb-4">CheckOut</h1>
            <div className="">
                {addressList.length > 0 ? (
                    <>

                        <h2 className="text-xl mt-2 mb-4">Deliver to this address:</h2>
                        <Select value={(selectedAddressId)?.toString() ?? ""} onValueChange={handleAddressChange}>
                            <SelectTrigger
                                className="bg-gray-200 rounded-md flex items-center justify-between px-3 py-2 text-black"
                                style={{ minWidth: "8rem" }}
                            >
                                <span className="font-semibold pr-2 text-black">
                                    {selectedAddressId
                                        ? idtoAddressMap[Number(selectedAddressId)]
                                        : "Select Address"}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-600" />
                            </SelectTrigger>
                            <SelectContent
                                className="mt-2"
                                style={{
                                    backgroundColor: "#fff",
                                    borderRadius: "4px",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                                }}
                            >
                                {
                                    addressList.map((address) => (
                                        <SelectItem key={address.id} value={(address.id)?.toString() ?? ""} style={{ maxWidth: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {address.id && idtoAddressMap[Number(address.id)]}
                                        </SelectItem>

                                    ))}
                            </SelectContent>
                        </Select>
                    </>
                ) : (
                    <div className="flex col-span-1 mt-2 px-2 py-3 rounded-lg">
                        <p>No address found</p>
                        <Button className="bg-primary text-white" onClick={goToProfileAddressPage}>
                            Add Address
                        </Button>
                    </div>
                )}
            </div>
            <div className="mt-5">
                <div>Amount to be paid: Rs {totalAmount.totalCartSum}</div>
            </div>
            <div className="mt-3">
                <PaymentOptions
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>
            <div className="flex justify-center">
                <Button
                    className="bg-primary text-white"
                    onClick={placeOrder}
                    disabled={!isAllFieldsFilled() || isLoading}
                >
                    {isLoading ? <LoadingSpinner/> : false}
                    Place Order
                </Button>
            </div>
        </div>
    );
}
