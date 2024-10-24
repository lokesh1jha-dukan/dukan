"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Address } from "@/types/client/types";
import { Heading } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import toast from "react-hot-toast";


type EditPopupProps = {
    address: Address;
    onCancel: (event?: React.MouseEvent<HTMLButtonElement>) => void;
    isOpen: boolean;
    onChange: (isOpen: boolean) => void;
    loadAddresses: () => void;

};

const EditAddressPopup: React.FC<EditPopupProps> = ({ address, onCancel, isOpen, onChange, loadAddresses }) => {
    const [editedAddress, setEditedAddress] = useState<Address>(address);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedAddress({ ...editedAddress, [name]: value });
    };

    const validateInputs = () => {
        // Check if all required fields are filled
        if (
            !editedAddress.address_line1 ||
            !editedAddress.address_line2 ||
            !editedAddress.city ||
            !editedAddress.state ||
            !editedAddress.country ||
            !editedAddress.postal_code
        ) {
            alert("All fields are required");
            return false;
        }

        // Validate postal code format
        const postalCodeRegex = /^\d{6}$/;
        if (!postalCodeRegex.test(editedAddress.postal_code)) {
            alert("Postal code must be a 6-digit number");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        console.log(editedAddress, 'editedAddress')
        if(!validateInputs()) {
            return;
        }
        if(editedAddress.id) {
            const response = await fetch(`/api/profile/address`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ address: editedAddress })
            })
        }else {
            const response = await fetch("/api/profile/address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ address: editedAddress })
            })
            
            if(response.ok) {
                toast.success("Address added successfully")
            }
        }
        onCancel();
        loadAddresses();
    };

    return (

        <Dialog open={isOpen} onOpenChange={() => onChange(false)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Address</DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-col gap-4">
                            <Heading size={2}>Edit Address</Heading>
                            <Input
                                type="text"
                                name="address_line1"
                                placeholder="Address Line 1"
                                value={editedAddress.address_line1}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="address_line2"
                                placeholder="Address Line 2"
                                value={editedAddress.address_line2}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={editedAddress.city}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={editedAddress.state}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={editedAddress.country}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="postal_code"
                                placeholder="Postal Code"
                                value={editedAddress.postal_code}
                                onChange={handleInputChange}
                            />
                            <Button className="bg-primary text-white" onClick={handleSubmit}>Save</Button>
                            <Button className="bg-primary text-white" onClick={onCancel}>Cancel</Button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    );
};


export default EditAddressPopup;