"use client";
import { Button } from "@/components/ui/button"
import { Address } from "@/types/client/types";
import AddressModal from "./AddressModal";
import { useEffect, useState } from "react";
import EditAddressPopup from "./EditAddressPopup";
import { fetchInsideTryCatch } from "@/lib/client/apiUtil";



const emptyAddress: Address = {
    id: 0,
    user_id: 0,
    address_line1: '',
    address_line2: '',
    city: '',
    state: 'Manipur',
    country: 'India',
    postal_code: '',
    created_at: '',
    updated_at: '',
};
const MyAddress = () => {
    const [addNewAddressPopup, setAddNewAddressPopup] = useState(false);
    const [usersAddesses, setUsersAddesses] = useState<Address[]>([]);
    const getMyAddresses = async () => {
        const response = await fetchInsideTryCatch('api/profile/address')

        if(response && response.response.statusCode === 200 && response.response.data) {
            let data = response && response.response.data
            setUsersAddesses(data as Address[])
        }
        return []
    }
    
    useEffect(() => {
        getMyAddresses();
    },[])
    const handleAddNewAddressClick = () => {
        setAddNewAddressPopup(true)
        console.log("Add new address clicked");
    }

    return (
        <>
            <div className="flex gap-4 mb-4">
                My Address
            </div>
            <div className="mb-4">
                <Button
                    className="bg-primary text-white"
                    onClick={handleAddNewAddressClick}>
                    Add New Address
                </Button>
            </div>
            <div>
                <AddressModal addresses={usersAddesses} loadAddresses={getMyAddresses}/>
            </div>
        {
            addNewAddressPopup && 
            <EditAddressPopup
                address={emptyAddress!}
                onCancel={() => setAddNewAddressPopup(false)}
                isOpen={addNewAddressPopup}
                onChange={() => setAddNewAddressPopup(false)}
                loadAddresses={getMyAddresses}
            />
        }
        </>
    )
}

export default MyAddress