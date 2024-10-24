"use client";

import { Address } from "@/types/client/types";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import EditAddressPopup from "./EditAddressPopup";
import { AiFillHome } from "react-icons/ai";
import toast from "react-hot-toast";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";


type Props = {
    addresses: Address[];
    loadAddresses: () => void;
};

const AddressModal = ({ addresses, loadAddresses }: Props) => {
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [openEditAddressPopup, setOpenEditAddressPopup] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);

    const handleEditClick = (address: Address) => {
        setSelectedAddress(address);
        setOpenEditAddressPopup(true)
        console.log("Edit Clicked", address);
    };

    const deleteAddress = async () => {
        console.log(selectedAddress, 'selectedAddress')
        const response = await fetch(`/api/profile/address`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ address: selectedAddress })
        })

        if (response.ok) {
            setSelectedAddress(null);
            toast.success("Address deleted successfully")
        }
        setDeletePopup(false)
        // Refresh the Addresses
        loadAddresses()
    }
    const handleDeleteClick = async (address: Address) => {
        setSelectedAddress(address);
        setDeletePopup(true)

    };

    return (
        <>

            <div className="flex flex-col">
                <ul>
                    {addresses.map(address => (
                        <li key={address.id}>
                            <div className="grid grid-cols-1 gap-4">
                                <AiFillHome />

                                <div className="font-medium">Home</div>

                                <div>{`${address.address_line1}, ${address.address_line2}, ${address.city}, ${address.state}, ${address.country}, ${address.postal_code}`}</div>
                                <div className="flex items-center gap-2 ml-auto">

                                    <Button className="bg-primary text-white" onClick={() => handleEditClick(address)}>Edit</Button>

                                    <Button className="bg-primary text-white" onClick={() => handleDeleteClick(address)}>Delete</Button>
                                </div>
                            </div>
                            <svg height="1" className="mt-2 w-full">

                                <line x1="0" y1="0" x2="100%" y2="0" stroke="black" strokeWidth="1" />

                            </svg>
                        </li>
                    ))}
                </ul>
            </div>

            {openEditAddressPopup &&
                <EditAddressPopup
                    address={selectedAddress!}
                    onCancel={() => setOpenEditAddressPopup(false)}
                    isOpen={openEditAddressPopup}
                    onChange={() => setOpenEditAddressPopup(false)}
                    loadAddresses={loadAddresses}
                />}
            {
                deletePopup &&
                <Dialog open={deletePopup} onOpenChange={setDeletePopup}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Address</DialogTitle>
                            <DialogDescription>
                                <p>Are you sure you want to delete this address?</p>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-4">
                            <Button color="secondary" onClick={() => setDeletePopup(false)}>Cancel</Button>
                            <Button onClick={deleteAddress}>Delete</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            }
        </>
    );
};

export default AddressModal;
